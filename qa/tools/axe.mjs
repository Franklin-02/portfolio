#!/usr/bin/env node
/**
 * Automated accessibility audit with axe-core (headless Microsoft Edge via playwright-core).
 *
 * Usage:
 *   node axe.mjs --url <url> [--width 1440] [--height 900] [--theme dark|light]
 *                [--click <css>]... [--wait <ms>] [--include <css>]
 *                [--tags wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22aa,best-practice]
 *
 * The page is scrolled once first so scroll-reveal content is visible before the audit
 * (elements at opacity 0 would otherwise be skipped or mis-measured for contrast).
 * Prints every violation with its impact, rule id, help text and up to 6 offending nodes.
 */
import './local-env.mjs'
import { chromium } from 'playwright-core'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))

function parseArgs(argv) {
  const args = { click: [] }
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i]
    if (!token.startsWith('--')) continue
    const key = token.slice(2)
    const next = argv[i + 1]
    const hasValue = next !== undefined && !next.startsWith('--')
    const value = hasValue ? next : true
    if (hasValue) i++
    if (key === 'click') args.click.push(value)
    else args[key] = value
  }
  return args
}

const args = parseArgs(process.argv.slice(2))
if (!args.url) {
  console.error('Required: --url <url>')
  process.exit(2)
}

const width = Number(args.width ?? 1440)
const height = Number(args.height ?? 900)
const theme = args.theme === 'light' ? 'light' : 'dark'
const tags = String(args.tags ?? 'wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22aa,best-practice').split(',')

const browser = await chromium.launch({ channel: 'msedge', headless: true })
try {
  const context = await browser.newContext({ viewport: { width, height } })
  await context.addInitScript((value) => {
    try {
      window.localStorage.setItem('fsm-theme', value)
    } catch {
      /* ignore */
    }
  }, theme)
  const page = await context.newPage()
  await page.goto(String(args.url), { waitUntil: 'networkidle', timeout: 60000 })
  await page.evaluate(() => document.fonts.ready)

  await page.evaluate(async () => {
    const step = Math.max(200, Math.floor(window.innerHeight * 0.6))
    const total = () => document.documentElement.scrollHeight
    for (let y = 0; y < total(); y += step) {
      window.scrollTo(0, y)
      await new Promise((done) => setTimeout(done, 110))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(2500)

  for (const selector of args.click) {
    await page.locator(String(selector)).first().click({ timeout: 8000 })
    await page.waitForTimeout(600)
  }
  await page.waitForTimeout(Number(args.wait ?? 300))

  await page.addScriptTag({ path: join(here, 'node_modules', 'axe-core', 'axe.min.js') })
  const results = await page.evaluate(
    async ({ include, runTags }) => {
      const target = include ? { include: [[include]] } : document
      return await window.axe.run(target, {
        runOnly: { type: 'tag', values: runTags },
        resultTypes: ['violations', 'incomplete'],
      })
    },
    { include: args.include ? String(args.include) : null, runTags: tags },
  )

  const summarise = (list) =>
    list.map((item) => ({
      id: item.id,
      impact: item.impact,
      help: item.help,
      nodes: item.nodes.slice(0, 6).map((node) => ({
        target: node.target.join(' '),
        summary: (node.failureSummary ?? '').replace(/\s+/g, ' ').slice(0, 300),
        html: node.html.slice(0, 200),
      })),
      count: item.nodes.length,
    }))

  const violations = summarise(results.violations)
  console.log(`AXE ${theme} ${width}x${height} ${args.url}`)
  console.log(`VIOLATIONS: ${violations.length}`)
  for (const violation of violations) {
    console.log(`- [${violation.impact}] ${violation.id}: ${violation.help} (${violation.count} node(s))`)
    for (const node of violation.nodes) {
      console.log(`    target: ${node.target}`)
      console.log(`    why: ${node.summary}`)
      console.log(`    html: ${node.html}`)
    }
  }

  // "Incomplete" = axe could not decide (often contrast over gradients). Listed for manual review.
  const incomplete = summarise(results.incomplete)
  console.log(`NEEDS MANUAL REVIEW: ${incomplete.length}`)
  for (const item of incomplete) {
    console.log(`- ${item.id}: ${item.help} (${item.count} node(s))`)
    for (const node of item.nodes.slice(0, 3)) console.log(`    target: ${node.target}`)
  }
} finally {
  await browser.close()
}
