#!/usr/bin/env node
/**
 * Screenshot + page diagnostics tool (headless Microsoft Edge via playwright-core).
 *
 * Usage:
 *   node shot.mjs --url <url> --out <file.png> [options]
 *
 * Options:
 *   --width <px>        Viewport width (default 1440)
 *   --height <px>       Viewport height (default 900)
 *   --theme dark|light  Theme to render (default dark)
 *   --full              Capture the full page as ONE image (avoid on tall pages: unreadable when downscaled)
 *   --slices            Capture the page as consecutive viewport-height images: <out>-01.png, <out>-02.png, ...
 *   --max-slices <n>    Limit for --slices (default 12)
 *   --selector <css>    Capture only this element (scrolled into view first)
 *   --scroll-to <css>   Scroll this element to the top of the viewport before a viewport capture
 *   --click <css>       Click this element before capturing (repeatable, in order)
 *   --hover <css>       Hover this element before capturing
 *   --press <key>       Press a key before capturing (e.g. Tab, Escape) (repeatable)
 *   --wait <ms>         Extra wait before capturing (default 600)
 *   --reduced-motion    Emulate prefers-reduced-motion: reduce
 *   --no-reveal         Do not pre-scroll the page to trigger scroll-reveal animations
 *   --scale <n>         Device scale factor (default 1)
 *   --mobile            Emulate a touch device (hasTouch + isMobile)
 *
 * Always prints a DIAGNOSTICS block: console errors/warnings, uncaught page errors,
 * failed requests, and elements that cause horizontal overflow.
 * Exit code is 0 even when diagnostics report problems; read the output.
 */
import './local-env.mjs'
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

function parseArgs(argv) {
  const args = { click: [], press: [] }
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i]
    if (!token.startsWith('--')) continue
    const key = token.slice(2)
    const next = argv[i + 1]
    const hasValue = next !== undefined && !next.startsWith('--')
    const value = hasValue ? next : true
    if (hasValue) i++
    if (key === 'click' || key === 'press') args[key].push(value)
    else args[key] = value
  }
  return args
}

const args = parseArgs(process.argv.slice(2))
if (!args.url || !args.out) {
  console.error('Required: --url <url> --out <file.png>. See the usage notes in the file header.')
  process.exit(2)
}

const width = Number(args.width ?? 1440)
const height = Number(args.height ?? 900)
const theme = args.theme === 'light' ? 'light' : 'dark'
const extraWait = Number(args.wait ?? 600)
const out = resolve(String(args.out))
mkdirSync(dirname(out), { recursive: true })

const consoleMessages = []
const pageErrors = []
const failedRequests = []

const browser = await chromium.launch({ channel: 'msedge', headless: true })
try {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: Number(args.scale ?? 1),
    reducedMotion: args['reduced-motion'] ? 'reduce' : 'no-preference',
    hasTouch: Boolean(args.mobile),
    isMobile: Boolean(args.mobile),
  })
  await context.addInitScript((value) => {
    try {
      window.localStorage.setItem('fsm-theme', value)
    } catch {
      /* ignore */
    }
  }, theme)

  const page = await context.newPage()
  page.on('console', (message) => {
    const type = message.type()
    if (type === 'error' || type === 'warning') consoleMessages.push(`[${type}] ${message.text()}`)
  })
  page.on('pageerror', (error) => pageErrors.push(String(error?.stack ?? error)))
  page.on('requestfailed', (request) => {
    const failure = request.failure()?.errorText ?? ''
    if (!failure.includes('ERR_ABORTED')) failedRequests.push(`${request.method()} ${request.url()} :: ${failure}`)
  })
  page.on('response', (response) => {
    if (response.status() >= 400) failedRequests.push(`${response.status()} ${response.url()}`)
  })

  await page.goto(String(args.url), { waitUntil: 'networkidle', timeout: 60000 })
  await page.evaluate(() => document.fonts.ready)

  // Trigger scroll-reveal animations and counters by walking down the page once.
  if (!args['no-reveal']) {
    await page.evaluate(async () => {
      const step = Math.max(200, Math.floor(window.innerHeight * 0.6))
      const total = () => document.documentElement.scrollHeight
      for (let y = 0; y < total(); y += step) {
        window.scrollTo(0, y)
        await new Promise((done) => setTimeout(done, 110))
      }
      window.scrollTo(0, total())
      await new Promise((done) => setTimeout(done, 250))
      window.scrollTo(0, 0)
    })
    await page.waitForTimeout(2300)
  }

  for (const selector of args.click) {
    await page.locator(String(selector)).first().click({ timeout: 8000 })
    await page.waitForTimeout(450)
  }
  if (args.hover) {
    await page.locator(String(args.hover)).first().hover({ timeout: 8000 })
    await page.waitForTimeout(350)
  }
  for (const key of args.press) {
    await page.keyboard.press(String(key))
    await page.waitForTimeout(200)
  }
  if (args['scroll-to']) {
    await page.locator(String(args['scroll-to'])).first().evaluate((element) => {
      element.scrollIntoView({ block: 'start', behavior: 'instant' })
    })
    await page.waitForTimeout(400)
  }
  await page.waitForTimeout(extraWait)

  // Layout diagnostics.
  const layout = await page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth
    const scrollWidth = document.documentElement.scrollWidth
    const offenders = []
    if (scrollWidth > viewportWidth + 1) {
      for (const element of document.querySelectorAll('body *')) {
        const rect = element.getBoundingClientRect()
        if (rect.width === 0 || rect.height === 0) continue
        if (rect.right > viewportWidth + 1 || rect.left < -1) {
          const style = getComputedStyle(element)
          if (style.position === 'fixed') continue
          // Skip elements clipped by an ancestor.
          let clipped = false
          for (let parent = element.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
            if (getComputedStyle(parent).overflowX !== 'visible') {
              clipped = true
              break
            }
          }
          if (clipped) continue
          const id = element.id ? `#${element.id}` : ''
          const cls =
            typeof element.className === 'string' && element.className
              ? `.${element.className.trim().split(/\s+/).slice(0, 4).join('.')}`
              : ''
          offenders.push(`${element.tagName.toLowerCase()}${id}${cls} [left=${Math.round(rect.left)} right=${Math.round(rect.right)}]`)
          if (offenders.length >= 8) break
        }
      }
    }
    return {
      viewportWidth,
      scrollWidth,
      pageHeight: document.documentElement.scrollHeight,
      title: document.title,
      theme: document.documentElement.getAttribute('data-theme'),
      offenders,
    }
  })

  const written = []
  if (args.selector) {
    const target = page.locator(String(args.selector)).first()
    await target.scrollIntoViewIfNeeded({ timeout: 8000 })
    await page.waitForTimeout(500)
    await target.screenshot({ path: out })
    written.push(out)
  } else if (args.slices) {
    const max = Number(args['max-slices'] ?? 12)
    const pageHeight = layout.pageHeight
    const count = Math.min(max, Math.max(1, Math.ceil(pageHeight / height)))
    for (let index = 0; index < count; index++) {
      const y = Math.min(index * height, Math.max(0, pageHeight - height))
      await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y)
      await page.waitForTimeout(350)
      const file = out.replace(/\.png$/i, '') + `-${String(index + 1).padStart(2, '0')}.png`
      await page.screenshot({ path: file })
      written.push(file)
    }
    if (Math.ceil(pageHeight / height) > max) {
      written.push(`(stopped at --max-slices ${max}; page needs ${Math.ceil(pageHeight / height)} slices)`)
    }
  } else {
    await page.screenshot({ path: out, fullPage: Boolean(args.full) })
    written.push(out)
  }

  console.log('SCREENSHOTS:')
  for (const file of written) console.log(`  ${file}`)
  console.log('DIAGNOSTICS:')
  console.log(`  title: ${layout.title}`)
  console.log(`  theme: ${layout.theme} | viewport: ${width}x${height} | page height: ${layout.pageHeight}px`)
  console.log(
    `  horizontal overflow: ${layout.scrollWidth > layout.viewportWidth + 1 ? `YES (scrollWidth ${layout.scrollWidth} > viewport ${layout.viewportWidth})` : 'none'}`,
  )
  for (const offender of layout.offenders) console.log(`    overflow offender: ${offender}`)
  console.log(`  console errors/warnings: ${consoleMessages.length}`)
  for (const message of consoleMessages.slice(0, 15)) console.log(`    ${message.slice(0, 600)}`)
  console.log(`  uncaught page errors: ${pageErrors.length}`)
  for (const message of pageErrors.slice(0, 8)) console.log(`    ${message.slice(0, 800)}`)
  console.log(`  failed requests: ${failedRequests.length}`)
  for (const message of failedRequests.slice(0, 10)) console.log(`    ${message}`)
} finally {
  await browser.close()
}
