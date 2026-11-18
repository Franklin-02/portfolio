#!/usr/bin/env node
/**
 * Brand asset renderer (headless Microsoft Edge via playwright-core).
 *
 * Renders standalone HTML pages to PNG files at an exact pixel size, checks that
 * every glyph was drawn with a loaded web font (no system-font fallback), then
 * re-encodes each PNG losslessly so the file is as small as it can be.
 *
 * Usage:
 *   node render-assets.mjs --in <page.html> --out <file.png> --size <W>x<H> [job options]
 *                          [--in <page.html> --out ... next job] ...
 *
 * Every `--in` starts a new job; the options that follow it belong to that job.
 * All jobs share one browser launch.
 *
 * Job options:
 *   --out <file.png>    Output file (required)
 *   --size <W>x<H>      Exact output size in CSS pixels = image pixels (required)
 *   --param <k=v>       Query-string parameter handed to the page (repeatable)
 *   --transparent       Keep the page background transparent (omitBackground)
 *   --opaque            Fail unless every pixel is fully opaque; the PNG is written without an alpha channel
 *   --wait <ms>         Extra wait before the capture (default 120)
 *   --allow-system-fonts  Do not fail when a glyph was drawn with a non-web font (inspection sheets)
 *
 * Global options:
 *   --no-optimize       Keep the PNG bytes exactly as the browser encoded them
 *
 * Exit code: 0 when every job succeeded, 1 otherwise.
 */
import './local-env.mjs'
import { chromium } from 'playwright-core'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { deflateSync, inflateSync, constants as zlib } from 'node:zlib'

/* -------------------------------------------------------------------------- */
/* Arguments                                                                   */
/* -------------------------------------------------------------------------- */

function parseArgs(argv) {
  const jobs = []
  const globals = { optimize: true }
  let job = null

  const need = (flag, value) => {
    if (value === undefined) throw new Error(`${flag} needs a value`)
    return value
  }

  for (let i = 0; i < argv.length; i++) {
    const token = argv[i]
    if (token === '--no-optimize') {
      globals.optimize = false
      continue
    }
    if (token === '--in') {
      job = { input: resolve(need(token, argv[++i])), params: [], wait: 120 }
      jobs.push(job)
      continue
    }
    if (!job) throw new Error(`Unexpected argument before the first --in: ${token}`)
    if (token === '--out') job.output = resolve(need(token, argv[++i]))
    else if (token === '--size') {
      const match = /^(\d+)x(\d+)$/.exec(need(token, argv[++i]))
      if (!match) throw new Error('--size must look like 1200x630')
      job.width = Number(match[1])
      job.height = Number(match[2])
    } else if (token === '--param') {
      const pair = need(token, argv[++i])
      const at = pair.indexOf('=')
      if (at < 1) throw new Error('--param must look like key=value')
      job.params.push([pair.slice(0, at), pair.slice(at + 1)])
    } else if (token === '--transparent') job.transparent = true
    else if (token === '--opaque') job.opaque = true
    else if (token === '--allow-system-fonts') job.allowSystemFonts = true
    else if (token === '--wait') job.wait = Number(need(token, argv[++i]))
    else throw new Error(`Unknown option: ${token}`)
  }

  if (jobs.length === 0) throw new Error('Nothing to do. See the usage notes in the file header.')
  for (const item of jobs) {
    if (!item.output) throw new Error(`Job ${item.input}: --out is required`)
    if (!item.width || !item.height) throw new Error(`Job ${item.input}: --size is required`)
    if (item.transparent && item.opaque) throw new Error(`Job ${item.input}: --transparent and --opaque exclude each other`)
  }
  return { jobs, globals }
}

/* -------------------------------------------------------------------------- */
/* PNG: decode, lossless re-encode                                             */
/* -------------------------------------------------------------------------- */

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  return table
})()

function crc32(...buffers) {
  let c = 0xffffffff
  for (const buffer of buffers) {
    for (let i = 0; i < buffer.length; i++) c = CRC_TABLE[(c ^ buffer[i]) & 0xff] ^ (c >>> 8)
  }
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const head = Buffer.alloc(8)
  head.writeUInt32BE(data.length, 0)
  head.write(type, 4, 'latin1')
  const tail = Buffer.alloc(4)
  tail.writeUInt32BE(crc32(head.subarray(4), data), 0)
  return Buffer.concat([head, data, tail])
}

function paeth(a, b, c) {
  const p = a + b - c
  const pa = Math.abs(p - a)
  const pb = Math.abs(p - b)
  const pc = Math.abs(p - c)
  if (pa <= pb && pa <= pc) return a
  return pb <= pc ? b : c
}

/** Reads the IHDR of a PNG buffer. */
function readPngHeader(buffer) {
  if (buffer.length < 33 || !buffer.subarray(0, 8).equals(PNG_SIGNATURE)) throw new Error('Not a PNG file')
  if (buffer.toString('latin1', 12, 16) !== 'IHDR') throw new Error('PNG without a leading IHDR chunk')
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
    bitDepth: buffer[24],
    colorType: buffer[25],
    interlace: buffer[28],
  }
}

/** Decodes an 8-bit, non-interlaced RGB or RGBA PNG into raw pixels. Returns null for other layouts. */
function decodePng(buffer) {
  const header = readPngHeader(buffer)
  if (header.bitDepth !== 8 || header.interlace !== 0) return null
  if (header.colorType !== 2 && header.colorType !== 6) return null
  const channels = header.colorType === 6 ? 4 : 3

  const parts = []
  for (let offset = 8; offset < buffer.length; ) {
    const length = buffer.readUInt32BE(offset)
    const type = buffer.toString('latin1', offset + 4, offset + 8)
    if (type === 'IDAT') parts.push(buffer.subarray(offset + 8, offset + 8 + length))
    if (type === 'IEND') break
    offset += 12 + length
  }

  const { width, height } = header
  const stride = width * channels
  const raw = inflateSync(Buffer.concat(parts))
  if (raw.length !== (stride + 1) * height) throw new Error('Unexpected PNG data length')

  const pixels = Buffer.alloc(stride * height)
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)]
    const src = y * (stride + 1) + 1
    const dst = y * stride
    for (let x = 0; x < stride; x++) {
      const left = x >= channels ? pixels[dst + x - channels] : 0
      const up = y > 0 ? pixels[dst + x - stride] : 0
      const upLeft = y > 0 && x >= channels ? pixels[dst + x - stride - channels] : 0
      let value = raw[src + x]
      if (filter === 1) value += left
      else if (filter === 2) value += up
      else if (filter === 3) value += (left + up) >> 1
      else if (filter === 4) value += paeth(left, up, upLeft)
      else if (filter !== 0) throw new Error(`Unknown PNG filter ${filter}`)
      pixels[dst + x] = value & 0xff
    }
  }
  return { width, height, channels, pixels }
}

/** Alpha statistics of decoded RGBA pixels. */
function alphaStats(image) {
  if (image.channels !== 4) return { opaque: image.width * image.height, partial: 0, clear: 0 }
  let opaque = 0
  let partial = 0
  let clear = 0
  for (let i = 3; i < image.pixels.length; i += 4) {
    const alpha = image.pixels[i]
    if (alpha === 255) opaque++
    else if (alpha === 0) clear++
    else partial++
  }
  return { opaque, partial, clear }
}

function dropAlpha(image) {
  const pixels = Buffer.alloc(image.width * image.height * 3)
  for (let from = 0, to = 0; from < image.pixels.length; from += 4, to += 3) {
    pixels[to] = image.pixels[from]
    pixels[to + 1] = image.pixels[from + 1]
    pixels[to + 2] = image.pixels[from + 2]
  }
  return { width: image.width, height: image.height, channels: 3, pixels }
}

/** Applies one PNG filter type to a row; returns the sum of absolute signed residuals. */
function filterRow(type, pixels, rowStart, stride, channels, out, outStart) {
  let score = 0
  for (let x = 0; x < stride; x++) {
    const value = pixels[rowStart + x]
    const left = x >= channels ? pixels[rowStart + x - channels] : 0
    const up = rowStart >= stride ? pixels[rowStart + x - stride] : 0
    const upLeft = rowStart >= stride && x >= channels ? pixels[rowStart + x - stride - channels] : 0
    let residual
    if (type === 0) residual = value
    else if (type === 1) residual = value - left
    else if (type === 2) residual = value - up
    else if (type === 3) residual = value - ((left + up) >> 1)
    else residual = value - paeth(left, up, upLeft)
    residual &= 0xff
    out[outStart + x] = residual
    score += residual < 128 ? residual : 256 - residual
  }
  return score
}

/** Builds the filtered scanline stream. `mode` is 0-4 for a fixed filter or 'adaptive'. */
function filterImage(image, mode) {
  const { width, height, channels, pixels } = image
  const stride = width * channels
  const out = Buffer.alloc((stride + 1) * height)
  const scratch = Buffer.alloc(stride)
  for (let y = 0; y < height; y++) {
    const rowStart = y * stride
    const outStart = y * (stride + 1)
    if (mode !== 'adaptive') {
      out[outStart] = mode
      filterRow(mode, pixels, rowStart, stride, channels, out, outStart + 1)
      continue
    }
    // Adaptive: keep the filter with the smallest sum of absolute residuals for this row.
    let bestScore = Infinity
    for (let type = 0; type < 5; type++) {
      const score = filterRow(type, pixels, rowStart, stride, channels, scratch, 0)
      if (score < bestScore) {
        bestScore = score
        out[outStart] = type
        scratch.copy(out, outStart + 1)
      }
    }
  }
  return out
}

/** Lossless PNG encoder: tries every filter strategy and keeps the smallest stream. */
function encodePng(image) {
  const header = Buffer.alloc(13)
  header.writeUInt32BE(image.width, 0)
  header.writeUInt32BE(image.height, 4)
  header[8] = 8
  header[9] = image.channels === 4 ? 6 : 2
  header[10] = 0
  header[11] = 0
  header[12] = 0

  let best = null
  let bestLabel = ''
  for (const mode of ['adaptive', 0, 1, 2, 3, 4]) {
    const filtered = filterImage(image, mode)
    for (const [label, strategy] of [
      ['default', zlib.Z_DEFAULT_STRATEGY],
      ['filtered', zlib.Z_FILTERED],
    ]) {
      const packed = deflateSync(filtered, { level: 9, memLevel: 9, windowBits: 15, strategy })
      if (!best || packed.length < best.length) {
        best = packed
        bestLabel = `${mode}/${label}`
      }
    }
  }

  const png = Buffer.concat([PNG_SIGNATURE, chunk('IHDR', header), chunk('IDAT', best), chunk('IEND', Buffer.alloc(0))])
  return { png, strategy: bestLabel }
}

/* -------------------------------------------------------------------------- */
/* Font verification                                                           */
/* -------------------------------------------------------------------------- */

/** Waits for web fonts and reports the state of every declared face. */
async function settleFonts(page) {
  return page.evaluate(async () => {
    await document.fonts.ready
    const faces = [...document.fonts]
    const results = await Promise.allSettled(faces.map((face) => face.load()))
    await document.fonts.ready
    await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)))
    return faces.map((face, index) => ({
      family: face.family.replace(/^["']|["']$/g, ''),
      weight: face.weight,
      status: face.status,
      error: results[index].status === 'rejected' ? String(results[index].reason) : null,
    }))
  })
}

/** Asks the browser which platform fonts actually drew the text on the page. */
async function usedFonts(page) {
  const client = await page.context().newCDPSession(page)
  try {
    await client.send('DOM.enable')
    await client.send('CSS.enable')
    const { root } = await client.send('DOM.getDocument', { depth: 0 })
    const { nodeIds } = await client.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: 'body, body *' })
    const totals = new Map()
    for (const nodeId of nodeIds) {
      const { fonts } = await client.send('CSS.getPlatformFontsForNode', { nodeId })
      for (const font of fonts) {
        const key = `${font.familyName}|${font.isCustomFont ? 'web' : 'system'}`
        totals.set(key, (totals.get(key) ?? 0) + font.glyphCount)
      }
    }
    return [...totals].map(([key, glyphs]) => {
      const [family, source] = key.split('|')
      return { family, source, glyphs }
    })
  } finally {
    await client.detach().catch(() => {})
  }
}

/* -------------------------------------------------------------------------- */
/* Main                                                                        */
/* -------------------------------------------------------------------------- */

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`

async function runJob(browser, job, globals) {
  const problems = []
  const context = await browser.newContext({
    viewport: { width: job.width, height: job.height },
    deviceScaleFactor: 1,
    colorScheme: 'dark',
    reducedMotion: 'reduce',
  })
  try {
    const page = await context.newPage()
    page.on('console', (message) => {
      if (message.type() === 'error' || message.type() === 'warning') problems.push(`console ${message.type()}: ${message.text()}`)
    })
    page.on('pageerror', (error) => problems.push(`page error: ${String(error?.message ?? error)}`))
    page.on('requestfailed', (request) => problems.push(`request failed: ${request.url()} (${request.failure()?.errorText ?? 'unknown'})`))

    const url = pathToFileURL(job.input)
    for (const [key, value] of job.params) url.searchParams.append(key, value)
    await page.goto(url.href, { waitUntil: 'load', timeout: 60000 })
    // Pages that draw asynchronously expose a promise in window.__ready.
    await page.evaluate(() => window.__ready ?? null)

    const faces = await settleFonts(page)
    for (const face of faces) {
      if (face.status !== 'loaded') problems.push(`font face not loaded: ${face.family} ${face.weight} (${face.status}${face.error ? `, ${face.error}` : ''})`)
    }

    // Wait for images, then let layout settle.
    await page.evaluate(async () => {
      await Promise.all(
        [...document.images].map((image) =>
          image.complete ? null : new Promise((done) => image.addEventListener('load', done, { once: true })),
        ),
      )
      await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)))
    })
    await page.waitForTimeout(job.wait)

    const fonts = await usedFonts(page)
    for (const font of fonts) {
      if (font.source !== 'web' && !job.allowSystemFonts) problems.push(`system font used: ${font.family} (${font.glyphs} glyphs)`)
    }

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
      width: window.innerWidth,
      height: window.innerHeight,
      report: typeof window.__report === 'function' ? window.__report() : null,
    }))
    if (overflow.scrollWidth > overflow.width || overflow.scrollHeight > overflow.height) {
      problems.push(`content overflows the canvas: ${overflow.scrollWidth}x${overflow.scrollHeight} > ${overflow.width}x${overflow.height}`)
    }

    const captured = await page.screenshot({
      type: 'png',
      omitBackground: Boolean(job.transparent),
      clip: { x: 0, y: 0, width: job.width, height: job.height },
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
    })

    let output = captured
    let note = 'not optimised'
    let stats = null
    const decoded = decodePng(captured)
    if (decoded) {
      stats = alphaStats(decoded)
      if (job.opaque && (stats.partial > 0 || stats.clear > 0)) {
        problems.push(`--opaque: ${stats.partial + stats.clear} pixels are not fully opaque`)
      }
      if (job.transparent && stats.clear === 0) problems.push('--transparent: the image has no transparent pixels')
      if (globals.optimize) {
        const image = decoded.channels === 4 && stats.partial === 0 && stats.clear === 0 ? dropAlpha(decoded) : decoded
        const encoded = encodePng(image)
        // Round-trip check: the re-encoded file must decode to the same pixels.
        const check = decodePng(encoded.png)
        if (!check || !check.pixels.equals(image.pixels)) throw new Error('PNG re-encode round-trip mismatch')
        if (encoded.png.length < captured.length || image !== decoded) {
          output = encoded.png
          note = `re-encoded ${encoded.strategy}, ${kb(captured.length)} -> ${kb(encoded.png.length)}`
        } else {
          note = 'browser encoding kept (already smaller)'
        }
      }
    } else if (job.opaque || job.transparent) {
      problems.push('could not decode the capture to check its alpha channel')
    }

    const header = readPngHeader(output)
    if (header.width !== job.width || header.height !== job.height) {
      problems.push(`wrong size: ${header.width}x${header.height}, expected ${job.width}x${job.height}`)
    }

    mkdirSync(dirname(job.output), { recursive: true })
    writeFileSync(job.output, output)

    const colour = { 2: 'RGB', 6: 'RGBA' }[header.colorType] ?? `type ${header.colorType}`
    console.log(`${problems.length ? 'FAILED' : 'OK'}  ${job.output}`)
    console.log(`    ${header.width}x${header.height}  ${header.bitDepth}-bit ${colour}  ${output.length} bytes (${kb(output.length)})  [${note}]`)
    if (stats && header.colorType === 6) {
      console.log(`    alpha: ${stats.opaque} opaque, ${stats.partial} partial, ${stats.clear} transparent pixels`)
    }
    console.log(`    font faces: ${faces.map((face) => `${face.family} ${face.weight} = ${face.status}`).join('; ') || 'none declared'}`)
    console.log(`    glyphs drawn: ${fonts.map((font) => `${font.family} (${font.source}) x${font.glyphs}`).join('; ') || 'no text'}`)
    if (overflow.report) console.log(`    page report: ${JSON.stringify(overflow.report)}`)
    for (const problem of problems) console.log(`    PROBLEM: ${problem}`)
    return problems.length === 0
  } finally {
    await context.close()
  }
}

let parsed
try {
  parsed = parseArgs(process.argv.slice(2))
} catch (error) {
  console.error(String(error.message ?? error))
  process.exit(2)
}

const browser = await chromium.launch({
  channel: 'msedge',
  headless: true,
  // Greyscale anti-aliasing (no coloured sub-pixel fringes in the PNG) and a fixed sRGB output.
  args: ['--disable-lcd-text', '--force-color-profile=srgb', '--hide-scrollbars'],
})
let failed = 0
try {
  for (const job of parsed.jobs) {
    try {
      if (!(await runJob(browser, job, parsed.globals))) failed++
    } catch (error) {
      failed++
      console.log(`FAILED  ${job.output}`)
      console.log(`    ${String(error?.stack ?? error)}`)
    }
  }
} finally {
  await browser.close()
}
console.log(failed ? `${failed} of ${parsed.jobs.length} job(s) failed` : `All ${parsed.jobs.length} job(s) succeeded`)
process.exit(failed ? 1 : 0)
