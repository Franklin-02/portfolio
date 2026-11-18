#!/usr/bin/env node
/**
 * Resume download test.
 *
 * Needs a build made while a PDF exists in public/resume/ (the build detects the
 * file and switches the buttons from the "coming soon" placeholder to real links).
 *
 * Usage: node resume-test.mjs --base http://127.0.0.1:4175/ --file <pdf file name>
 */
import './local-env.mjs'
import { chromium } from 'playwright-core'

const argv = process.argv.slice(2)
const arg = (name, fallback) => {
  const index = argv.indexOf(`--${name}`)
  return index >= 0 ? argv[index + 1] : fallback
}
const BASE = String(arg('base', 'http://127.0.0.1:4175/')).replace(/\/?$/, '/')
const FILE = String(arg('file', 'Franklin-Selvaraj-M-Resume.pdf'))

let failed = 0
function report(name, ok, detail = '') {
  if (!ok) failed += 1
  console.log(`${ok ? 'PASS' : 'FAIL'}  [resume] ${name}${detail ? `  -- ${detail}` : ''}`)
}

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true })
const page = await context.newPage()
await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 })

const info = await page.evaluate(() => {
  const where = (link) => (link.closest('header') ? 'navigation' : link.closest('footer') ? 'footer' : (link.closest('section[id]')?.id ?? 'other'))
  return {
    links: [...document.querySelectorAll('a[download]')].map((link) => ({ where: where(link), href: link.getAttribute('href'), name: link.getAttribute('download'), text: link.textContent.trim() })),
    placeholders: [...document.querySelectorAll('span')].filter((span) => /^\s*coming soon\s*$/i.test(span.textContent)).length,
  }
})

const places = new Set(info.links.map((link) => link.where))
report('download links in the navigation bar, hero and contact section', ['navigation', 'home', 'contact'].every((place) => places.has(place)), `found in: ${[...places].join(', ')}`)
report('no "coming soon" placeholder remains', info.placeholders === 0, `${info.placeholders} placeholder(s)`)
report('every link is labelled "Download Resume" and names the file', info.links.length > 0 && info.links.every((link) => /download resume/i.test(link.text) && link.name === FILE), info.links.map((link) => `${link.where}: "${link.text}" -> ${link.name}`).join(' | '))

const response = info.links[0] ? await page.request.get(new URL(info.links[0].href, BASE).href) : null
report('the file is served as a PDF', Boolean(response) && response.status() === 200 && /application\/pdf/.test(response.headers()['content-type'] ?? ''), response ? `${response.status()} ${response.headers()['content-type']}` : 'no link')

// Clicking the hero button must start a real download of that file.
try {
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 15000 }),
    page.locator('#home a[download]').first().click(),
  ])
  report('clicking the hero button downloads the file', download.suggestedFilename() === FILE, `downloaded as "${download.suggestedFilename()}"`)
  await download.delete()
} catch (error) {
  report('clicking the hero button downloads the file', false, String(error?.message ?? error).split('\n')[0])
}

await browser.close()
console.log(`\nSUMMARY: ${failed === 0 ? 'all resume checks passed' : `${failed} check(s) failed`}`)
process.exit(failed === 0 ? 0 : 1)
