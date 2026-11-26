#!/usr/bin/env node
/**
 * Renders an HTML document to a PDF (headless Microsoft Edge via playwright-core).
 * Used for the resume. The page size and margins come from the document's own @page rule.
 *
 * Usage (from the project folder):
 *   node qa/tools/render-pdf.mjs --in qa/resume/Franklin-Selvaraj-M-Resume.html --out public/resume/Franklin-Selvaraj-M-Resume.pdf
 *
 * Prints the number of pages and how full the last page is, so the layout can be tuned.
 * The PDF contains real, selectable text (readable by applicant tracking systems).
 */
import './local-env.mjs'
import { chromium } from 'playwright-core'
import { mkdirSync, statSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const argv = process.argv.slice(2)
const arg = (name) => {
  const index = argv.indexOf(`--${name}`)
  return index >= 0 ? argv[index + 1] : undefined
}

const input = arg('in')
const output = arg('out')
if (!input || !output) {
  console.error('Required: --in <page.html> --out <file.pdf>')
  process.exit(2)
}

const outPath = resolve(output)
mkdirSync(dirname(outPath), { recursive: true })

const browser = await chromium.launch({ channel: 'msedge', headless: true })
try {
  const page = await browser.newPage()
  await page.goto(pathToFileURL(resolve(input)).href, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.emulateMedia({ media: 'print' })

  // Measure the content against the printable area declared by @page (A4 with the document's margins).
  const layout = await page.evaluate(() => {
    const MM = 96 / 25.4
    const rule = [...document.styleSheets]
      .flatMap((sheet) => [...sheet.cssRules])
      .find((item) => item.constructor.name === 'CSSPageRule')
    const margins = (rule?.style.margin || '13mm 15mm').split(/\s+/).map((value) => parseFloat(value))
    const top = margins[0]
    const right = margins[1] ?? top
    const bottom = margins[2] ?? top
    const left = margins[3] ?? right
    const printableWidth = (210 - left - right) * MM
    const printableHeight = (297 - top - bottom) * MM
    document.documentElement.style.width = `${printableWidth}px`
    const height = document.documentElement.getBoundingClientRect().height
    document.documentElement.style.width = ''
    return {
      fonts: [...new Set([...document.querySelectorAll('h1, p, li')].map((node) => getComputedStyle(node).fontFamily.split(',')[0].trim()))],
      estimatedPages: height / printableHeight,
    }
  })

  await page.pdf({
    path: outPath,
    preferCSSPageSize: true,
    printBackground: true,
    tagged: true,
    outline: true,
  })

  const bytes = statSync(outPath).size
  console.log(`PDF written: ${outPath}`)
  console.log(`  size: ${(bytes / 1024).toFixed(1)} KB`)
  console.log(`  first-choice font: ${layout.fonts.join(', ')}`)
  console.log(`  content length: about ${layout.estimatedPages.toFixed(2)} page(s) (an estimate; open the PDF to confirm)`)
} finally {
  await browser.close()
}
