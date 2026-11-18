#!/usr/bin/env node
/**
 * Functional QA for the portfolio (headless Microsoft Edge via playwright-core).
 *
 * Usage: node qa.mjs --base http://127.0.0.1:4173/ [--only <group>[,<group>]] [--json <file>]
 *
 * Groups: meta, desktop, projects, contact, mobile, overflow, notfound, motion, keyboard
 * Prints PASS / FAIL per check and exits with code 1 when anything fails.
 */
import './local-env.mjs'
import { chromium } from 'playwright-core'
import { writeFileSync } from 'node:fs'

function parseArgs(argv) {
  const args = {}
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i]
    if (!token.startsWith('--')) continue
    const next = argv[i + 1]
    const hasValue = next !== undefined && !next.startsWith('--')
    args[token.slice(2)] = hasValue ? next : true
    if (hasValue) i++
  }
  return args
}

const args = parseArgs(process.argv.slice(2))
const BASE = String(args.base ?? 'http://127.0.0.1:4173/').replace(/\/?$/, '/')
const only = args.only ? String(args.only).split(',') : null

const EXPECTED = {
  title: 'Franklin Selvaraj M. | Senior QA Tester, Business Analyst & PMO',
  nav: ['Home', 'About', 'Experience', 'Expertise', 'Projects', 'Achievements', 'Education', 'Contact'],
  navTargets: ['home', 'about', 'experience', 'expertise', 'projects', 'achievements', 'education', 'contact'],
  sections: ['home', 'about', 'experience', 'expertise', 'insurance-technology', 'delivery', 'projects', 'achievements', 'education', 'insights', 'contact'],
  email: 'Techyfrank9750@gmail.com',
  tel: 'tel:+918754128805',
  linkedin: 'https://www.linkedin.com/in/franklin-selvaraj-m/',
  // Featured projects in display order (Orion is employer work and lives in the experience timeline).
  projectSlugs: ['billing-software', 'ecommerce-application'],
  firstProjectTitle: /Billing Software/,
  engagements: ['Western Reserve Group (WRG)', 'InsuranceNow (SPIC & AFR)', 'Orion Application Analysis & Delivery'],
}

const results = []
const consoleProblems = []

function record(group, name, ok, detail = '') {
  results.push({ group, name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  [${group}] ${name}${detail ? `  -- ${detail}` : ''}`)
}

async function check(group, name, fn) {
  try {
    const detail = await fn()
    record(group, name, true, typeof detail === 'string' ? detail : '')
  } catch (error) {
    record(group, name, false, String(error?.message ?? error).split('\n')[0].slice(0, 500))
  }
}

function expect(condition, message) {
  if (!condition) throw new Error(message)
}

const browser = await chromium.launch({ channel: 'msedge', headless: true })

async function newPage({ width = 1440, height = 900, theme = null, reducedMotion = false, mobile = false, label = '' } = {}) {
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion: reducedMotion ? 'reduce' : 'no-preference',
    hasTouch: mobile,
    isMobile: mobile,
  })
  if (theme) {
    await context.addInitScript((value) => {
      try {
        if (!sessionStorage.getItem('qa-theme-set')) {
          localStorage.setItem('fsm-theme', value)
          sessionStorage.setItem('qa-theme-set', '1')
        }
      } catch {
        /* ignore */
      }
    }, theme)
  }
  const page = await context.newPage()
  const tag = label || String(width)
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      consoleProblems.push(`[${tag}] [${message.type()}] ${message.text().slice(0, 300)}`)
    }
  })
  page.on('pageerror', (error) => consoleProblems.push(`[${tag}] [pageerror] ${String(error).slice(0, 300)}`))
  page.on('response', (response) => {
    if (response.status() >= 400) consoleProblems.push(`[${tag}] [http ${response.status()}] ${response.url()}`)
  })
  return { context, page }
}

async function load(page, path = '') {
  await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 60000 })
  await page.evaluate(() => document.fonts.ready)
}

/** Waits until scrolling has stopped and returns the final position. */
async function settle(page) {
  // Give a smooth scroll time to start before looking for it to stop.
  await page.waitForTimeout(250)
  let last = -1
  let stable = 0
  for (let i = 0; i < 80; i++) {
    const y = await page.evaluate(() => Math.round(window.scrollY))
    stable = y === last ? stable + 1 : 0
    // Five unchanged readings in a row: on a busy machine a smooth scroll can pause briefly mid-way.
    if (stable >= 5) return y
    last = y
    await page.waitForTimeout(110)
  }
  return last
}

async function sectionTop(page, id) {
  return page.evaluate((sectionId) => {
    const element = document.getElementById(sectionId)
    return element ? Math.round(element.getBoundingClientRect().top) : null
  }, id)
}

async function atPageBottom(page) {
  return page.evaluate(() => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 6)
}

const dialogOpen = (page) => page.evaluate(() => Boolean(document.querySelector('dialog[open]')))

function run(group) {
  return !only || only.includes(group)
}

/* ------------------------------------------------------------------ meta */
if (run('meta')) {
  const { context, page } = await newPage({ label: 'meta' })
  await load(page)

  await check('meta', 'page title', async () => {
    const title = await page.title()
    expect(title === EXPECTED.title, `got "${title}"`)
  })
  await check('meta', 'meta description, keywords, author, robots', async () => {
    for (const name of ['description', 'keywords', 'author', 'robots']) {
      const content = await page.getAttribute(`meta[name="${name}"]`, 'content')
      expect(content && content.length > 3, `missing meta ${name}`)
    }
  })
  await check('meta', 'Open Graph and Twitter card tags', async () => {
    for (const property of ['og:type', 'og:title', 'og:description', 'og:image', 'og:site_name']) {
      const content = await page.getAttribute(`meta[property="${property}"]`, 'content')
      expect(content && content.length > 2, `missing ${property}`)
    }
    for (const name of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
      const content = await page.getAttribute(`meta[name="${name}"]`, 'content')
      expect(content && content.length > 2, `missing ${name}`)
    }
  })
  await check('meta', 'JSON-LD parses as a schema.org Person', async () => {
    const raw = await page.textContent('script[type="application/ld+json"]')
    const data = JSON.parse(raw)
    expect(data['@type'] === 'Person' && data.name === 'Franklin Selvaraj M.', 'unexpected JSON-LD')
  })
  await check('meta', 'html lang and default dark theme', async () => {
    const info = await page.evaluate(() => ({ lang: document.documentElement.lang, theme: document.documentElement.getAttribute('data-theme') }))
    expect(info.lang === 'en', `lang=${info.lang}`)
    expect(info.theme === 'dark', `theme=${info.theme}`)
  })
  await check('meta', 'static assets respond (favicons, manifest, social image, robots)', async () => {
    const paths = ['favicon/favicon.svg', 'favicon/favicon-32x32.png', 'favicon/apple-touch-icon.png', 'favicon/icon-192.png', 'favicon/icon-512.png', 'site.webmanifest', 'images/og-image.png', 'robots.txt']
    const failures = []
    for (const path of paths) {
      const response = await page.request.get(BASE + path)
      const type = response.headers()['content-type'] ?? ''
      if (response.status() !== 200) failures.push(`${path}: ${response.status()}`)
      else if (/\.png$/.test(path) && !/image\/png/.test(type)) failures.push(`${path}: content-type ${type}`)
    }
    expect(failures.length === 0, failures.join(', '))
  })
  await check('meta', 'exactly one h1, sections labelled, heading levels do not skip', async () => {
    const info = await page.evaluate(() => {
      const headings = [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')].map((h) => ({ level: Number(h.tagName[1]), text: h.textContent.trim().slice(0, 40) }))
      let skipped = null
      for (let i = 1; i < headings.length; i++) {
        if (headings[i].level > headings[i - 1].level + 1) skipped = `h${headings[i - 1].level} "${headings[i - 1].text}" -> h${headings[i].level} "${headings[i].text}"`
      }
      const unlabelled = [...document.querySelectorAll('main section[id]')]
        .filter((section) => {
          const id = section.getAttribute('aria-labelledby')
          return !id || !document.getElementById(id)
        })
        .map((section) => section.id)
      return { h1: document.querySelectorAll('h1').length, skipped, unlabelled }
    })
    expect(info.h1 === 1, `h1 count ${info.h1}`)
    expect(!info.skipped, `heading level skipped: ${info.skipped}`)
    expect(info.unlabelled.length === 0, `sections without a valid aria-labelledby: ${info.unlabelled.join(', ')}`)
  })
  await check('meta', 'all sections exist in the expected order', async () => {
    const ids = await page.evaluate(() => [...document.querySelectorAll('main section[id]')].map((s) => s.id))
    const missing = EXPECTED.sections.filter((id) => !ids.includes(id))
    expect(missing.length === 0, `missing: ${missing.join(', ')}`)
    const order = ids.filter((id) => EXPECTED.sections.includes(id))
    expect(JSON.stringify(order) === JSON.stringify(EXPECTED.sections), `order: ${order.join(' > ')}`)
  })
  await check('meta', 'landmarks: one header, one main, one footer, labelled navs', async () => {
    const info = await page.evaluate(() => ({
      header: document.querySelectorAll('body header:not(dialog header):not(section header):not(article header)').length,
      main: document.querySelectorAll('main').length,
      footer: document.querySelectorAll('body > div > footer, body footer:not(section footer):not(article footer)').length,
      unlabelledNav: [...document.querySelectorAll('nav')].filter((nav) => !nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')).length,
    }))
    expect(info.main === 1, `main count ${info.main}`)
    expect(info.header >= 1 && info.footer >= 1, JSON.stringify(info))
    expect(info.unlabelledNav === 0, `${info.unlabelledNav} nav element(s) without a label`)
  })
  await check('meta', 'images have alt text; external links are safe', async () => {
    const info = await page.evaluate(() => ({
      noAlt: [...document.querySelectorAll('img')].filter((img) => !img.hasAttribute('alt')).length,
      unsafe: [...document.querySelectorAll('a[target="_blank"]')].filter((a) => !/noopener/.test(a.rel)).map((a) => a.href),
    }))
    expect(info.noAlt === 0, `${info.noAlt} img without alt`)
    expect(info.unsafe.length === 0, `target=_blank without noopener: ${info.unsafe.join(', ')}`)
  })
  await check('meta', 'no dead links (missing href, "#", or javascript:)', async () => {
    const dead = await page.evaluate(() =>
      [...document.querySelectorAll('a')]
        .filter((a) => {
          const href = a.getAttribute('href')
          return href === null || href === '' || href === '#' || href.startsWith('javascript:')
        })
        .map((a) => a.textContent.trim().slice(0, 40)),
    )
    expect(dead.length === 0, `dead links: ${dead.join(' | ')}`)
  })
  await check('meta', 'every button has an accessible name', async () => {
    const unnamed = await page.evaluate(() =>
      [...document.querySelectorAll('button, [role="button"], [role="tab"]')]
        .filter((button) => !(button.getAttribute('aria-label') || button.getAttribute('aria-labelledby') || button.textContent.trim()))
        .map((button) => button.outerHTML.slice(0, 120)),
    )
    expect(unnamed.length === 0, `unnamed buttons: ${unnamed.join(' | ')}`)
  })
  await context.close()
}

/* --------------------------------------------------------------- desktop */
if (run('desktop')) {
  const { context, page } = await newPage({ label: 'desktop' })
  await load(page)
  const header = page.locator('header').first()
  const navLinks = header.locator('nav a')

  await check('desktop', 'navigation shows the eight links in order', async () => {
    const labels = (await navLinks.allTextContents()).map((label) => label.trim()).filter(Boolean)
    expect(JSON.stringify(labels) === JSON.stringify(EXPECTED.nav), `got ${labels.join(', ')}`)
  })

  for (let index = EXPECTED.nav.length - 1; index >= 0; index--) {
    const label = EXPECTED.nav[index]
    const target = EXPECTED.navTargets[index]
    await check('desktop', `nav "${label}" scrolls to #${target} and becomes active`, async () => {
      await navLinks.filter({ hasText: new RegExp(`^\\s*${label}\\s*$`) }).first().click()
      await settle(page)
      await page.waitForTimeout(300)
      if (target === 'home') {
        const y = await page.evaluate(() => window.scrollY)
        expect(y < 5, `scrollY ${y}`)
      } else {
        const top = await sectionTop(page, target)
        expect(top !== null && ((await atPageBottom(page)) || (top >= -4 && top <= 130)), `section top at ${top}px`)
      }
      const current = (await header.locator('nav a[aria-current]').allTextContents()).map((text) => text.trim())
      expect(current.length === 1 && current[0] === label, `aria-current on: ${current.join(', ') || 'none'}`)
      const hash = await page.evaluate(() => window.location.hash)
      expect(hash === (target === 'home' ? '' : `#${target}`), `URL hash is "${hash}"`)
    })
  }

  await check('desktop', 'active indicator follows the secondary sections (expertise and education groups)', async () => {
    const mapping = { 'insurance-technology': 'Expertise', delivery: 'Expertise', insights: 'Education' }
    for (const [id, label] of Object.entries(mapping)) {
      await page.evaluate((sectionId) => document.getElementById(sectionId).scrollIntoView({ block: 'start', behavior: 'instant' }), id)
      await page.waitForTimeout(350)
      const current = (await header.locator('nav a[aria-current]').allTextContents()).map((text) => text.trim())
      expect(current.length === 1 && current[0] === label, `at #${id} the active link is ${current.join(', ') || 'none'}, expected ${label}`)
    }
  })

  for (const [label, target] of [['Explore My Experience', 'experience'], ['View My Projects', 'projects'], ['Contact Me', 'contact']]) {
    await check('desktop', `hero action "${label}" scrolls to #${target}`, async () => {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
      await settle(page)
      await page.locator('#home').getByRole('link', { name: label, exact: true }).click()
      await settle(page)
      const top = await sectionTop(page, target)
      expect(top !== null && ((await atPageBottom(page)) || (top >= -4 && top <= 130)), `section top at ${top}px`)
    })
  }

  await check('desktop', 'resume control: real download link, or a clear placeholder in nav, hero and contact', async () => {
    const info = await page.evaluate(() => {
      const count = (root) => (root ? [...root.querySelectorAll('span')].filter((span) => /^\s*coming soon\s*$/i.test(span.textContent)).length : 0)
      return {
        links: [...document.querySelectorAll('a[download]')].map((a) => a.getAttribute('href')),
        nav: count(document.querySelector('header')),
        hero: count(document.getElementById('home')),
        contact: count(document.getElementById('contact')),
      }
    })
    if (info.links.length > 0) {
      const response = await page.request.get(new URL(info.links[0], BASE).href)
      expect(response.status() === 200, `resume link status ${response.status()}`)
      expect(/pdf/.test(response.headers()['content-type'] ?? ''), `content-type ${response.headers()['content-type']}`)
      expect(info.links.length >= 3, `only ${info.links.length} download links`)
      return `real download links: ${info.links.length}`
    }
    expect(info.nav >= 1 && info.hero >= 1 && info.contact >= 1, `placeholders: ${JSON.stringify(info)}`)
    return `placeholder shown (nav ${info.nav}, hero ${info.hero}, contact ${info.contact})`
  })

  await check('desktop', 'theme toggle switches, updates theme-color and persists after reload', async () => {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await header.getByRole('button', { name: /switch to light theme/i }).click()
    await page.waitForTimeout(300)
    let state = await page.evaluate(() => ({
      theme: document.documentElement.getAttribute('data-theme'),
      stored: localStorage.getItem('fsm-theme'),
      color: document.querySelector('meta[name="theme-color"]')?.getAttribute('content'),
      background: getComputedStyle(document.body).backgroundColor,
    }))
    expect(state.theme === 'light' && state.stored === 'light', JSON.stringify(state))
    expect(state.color && state.color.toUpperCase() !== '#080D18', `theme-color ${state.color}`)
    await page.reload({ waitUntil: 'networkidle' })
    state = await page.evaluate(() => ({ theme: document.documentElement.getAttribute('data-theme') }))
    expect(state.theme === 'light', `after reload: ${state.theme}`)
    await page.locator('header').first().getByRole('button', { name: /switch to dark theme/i }).click()
    await page.waitForTimeout(300)
    state = await page.evaluate(() => ({ theme: document.documentElement.getAttribute('data-theme'), stored: localStorage.getItem('fsm-theme') }))
    expect(state.theme === 'dark' && state.stored === 'dark', `after toggling back: ${JSON.stringify(state)}`)
  })

  await check('desktop', 'navbar is fixed and turns into a glass bar after scrolling', async () => {
    const glassOpacity = () =>
      page.evaluate(() => {
        const head = document.querySelector('header')
        const layer = [...head.children].find((child) => child.getAttribute('aria-hidden') === 'true')
        return { position: getComputedStyle(head).position, opacity: layer ? Number(getComputedStyle(layer).opacity) : null }
      })
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await page.waitForTimeout(500)
    const before = await glassOpacity()
    await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }))
    await page.waitForTimeout(600)
    const after = await glassOpacity()
    expect(after.position === 'fixed' || after.position === 'sticky', `header position ${after.position}`)
    if (before.opacity !== null) expect(before.opacity < 0.1 && after.opacity > 0.9, `glass opacity ${before.opacity} -> ${after.opacity}`)
    return `glass layer opacity ${before.opacity} -> ${after.opacity}`
  })

  await check('desktop', 'scroll-to-top button appears after scrolling and returns to the top', async () => {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await page.waitForTimeout(700)
    const button = page.getByRole('button', { name: /back to top/i })
    expect((await button.count()) === 0 || !(await button.first().isVisible()), 'button visible at the top of the page')
    await page.evaluate(() => window.scrollTo({ top: 2400, behavior: 'instant' }))
    await page.waitForTimeout(800)
    expect(await button.first().isVisible(), 'button not visible after scrolling')
    await button.first().click()
    const y = await settle(page)
    expect(y < 5, `scrollY ${y} after click`)
  })

  await check('desktop', 'hero statistics show their final values after counting', async () => {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await page.waitForTimeout(2800)
    const info = await page.evaluate(() => ({
      text: document.getElementById('home').textContent.replace(/\s+/g, ''),
      // Each counter shows an animated number and carries the final one for screen readers.
      unfinished: [...document.querySelectorAll('#home .tabular-nums')]
        .map((counter) => ({ shown: counter.querySelector('[aria-hidden="true"]')?.textContent.trim(), final: counter.querySelector('.sr-only')?.textContent.trim() }))
        .filter((counter) => counter.final !== undefined && counter.shown !== counter.final)
        .map((counter) => `${counter.shown} (should be ${counter.final})`),
    }))
    for (const fragment of ['4+', '30%', '50%', 'ISTQB']) expect(info.text.includes(fragment), `hero is missing "${fragment}"`)
    expect(info.unfinished.length === 0, `counters did not reach their final value: ${info.unfinished.join(', ')}`)
  })

  await check('desktop', 'achievement counters reach all eight final values', async () => {
    await page.evaluate(() => document.getElementById('achievements').scrollIntoView({ block: 'start', behavior: 'instant' }))
    await page.waitForTimeout(600)
    await page.evaluate(async () => {
      const section = document.getElementById('achievements')
      const bottom = section.getBoundingClientRect().bottom + window.scrollY
      for (let y = window.scrollY; y < bottom; y += 300) {
        window.scrollTo({ top: y, behavior: 'instant' })
        await new Promise((done) => setTimeout(done, 250))
      }
    })
    await page.waitForTimeout(3200)
    const info = await page.evaluate(() => ({
      text: document.getElementById('achievements').textContent.replace(/\s+/g, ''),
      // The number each visitor actually sees, read from the visible (aria-hidden) counter text.
      shown: [...document.querySelectorAll('#achievements .tabular-nums [aria-hidden="true"]')]
        .filter((node) => getComputedStyle(node).visibility !== 'hidden' && !node.closest('.invisible'))
        .map((node) => node.textContent.trim()),
    }))
    for (const fragment of ['30%', '50%', '10%', '20%', '400+', '300+', '80+']) expect(info.text.includes(fragment), `achievements are missing "${fragment}"`)
    for (const value of ['30', '50', '10', '20', '400', '300', '80', '8']) {
      expect(info.shown.some((text) => text.replace(/[^\d]/g, '') === value), `no counter is showing ${value} (showing: ${info.shown.join(', ')})`)
    }
  })

  await check('desktop', 'delivery process: all seven steps selectable by click and arrow keys', async () => {
    const tabs = page.locator('#delivery [role="tab"]')
    const count = await tabs.count()
    expect(count === 7, `found ${count} steps`)
    await tabs.first().scrollIntoViewIfNeeded()
    const panels = new Set()
    for (let index = 0; index < count; index++) {
      await tabs.nth(index).click()
      await page.waitForTimeout(350)
      expect((await tabs.nth(index).getAttribute('aria-selected')) === 'true', `step ${index + 1} not selected after click`)
      // Read the panel this tab controls, and make sure it is the one on screen.
      const panel = await tabs.nth(index).evaluate((tab) => {
        const node = document.getElementById(tab.getAttribute('aria-controls') ?? '')
        if (!node) return { found: false, visible: false, text: '', labelled: false }
        const rect = node.getBoundingClientRect()
        const style = getComputedStyle(node)
        return {
          found: true,
          visible: rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none',
          text: node.textContent.replace(/\s+/g, ' ').trim(),
          labelled: node.getAttribute('aria-labelledby') === tab.id,
        }
      })
      expect(panel.found, `step ${index + 1}: aria-controls points to no element`)
      expect(panel.visible, `step ${index + 1}: its panel is not visible after selecting it`)
      expect(panel.labelled, `step ${index + 1}: its panel is not labelled by the tab`)
      panels.add(panel.text)
    }
    expect(panels.size === 7, `only ${panels.size} distinct step descriptions`)
    await tabs.first().click()
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(250)
    expect((await tabs.nth(1).getAttribute('aria-selected')) === 'true', 'ArrowRight did not move to the second step')
    await page.keyboard.press('End')
    await page.waitForTimeout(250)
    expect((await tabs.nth(6).getAttribute('aria-selected')) === 'true', 'End did not move to the last step')
  })

  await check('desktop', 'footer: copyright year, trademark note, contact links', async () => {
    const footer = page.locator('footer').last()
    const text = (await footer.innerText()).replace(/\s+/g, ' ')
    expect(text.includes(String(new Date().getFullYear())), 'current year missing')
    expect(/Franklin Selvaraj M\./.test(text), 'name missing')
    expect(/all rights reserved/i.test(text), 'copyright wording missing')
    expect(/trademarks? of Guidewire/i.test(text), 'trademark note missing')
    expect((await footer.locator(`a[href="mailto:${EXPECTED.email}"]`).count()) > 0, 'email link missing')
    expect((await footer.locator(`a[href="${EXPECTED.tel}"]`).count()) > 0, 'phone link missing')
    expect((await footer.locator(`a[href="${EXPECTED.linkedin}"]`).count()) > 0, 'LinkedIn link missing')
  })

  await check('desktop', 'deep link /#projects lands on the section', async () => {
    await load(page, '#projects')
    await page.waitForTimeout(900)
    const top = await sectionTop(page, 'projects')
    expect(top !== null && top >= -4 && top <= 130, `section top at ${top}px`)
  })
  await context.close()
}

/* -------------------------------------------------------------- projects */
if (run('projects')) {
  const { context, page } = await newPage({ label: 'projects' })
  await load(page)
  const section = page.locator('#projects')
  const detailButtons = section.getByRole('button', { name: /view details/i })
  const closeButton = () => page.locator('dialog[open]').getByRole('button', { name: /close/i }).first()

  await check('projects', 'one card per featured project, each with a View Details button', async () => {
    const count = await detailButtons.count()
    expect(count === EXPECTED.projectSlugs.length, `found ${count}, expected ${EXPECTED.projectSlugs.length}`)
  })
  await check('projects', 'employer work is in the experience timeline, not in Featured Projects', async () => {
    const info = await page.evaluate(() => ({
      timeline: [...document.querySelectorAll('#experience article h3')].map((heading) => heading.textContent.trim()),
      projects: document.getElementById('projects').textContent,
      current: [...document.querySelectorAll('#experience article')]
        .filter((card) => /current project/i.test(card.textContent))
        .map((card) => card.querySelector('h3')?.textContent.trim()),
    }))
    // The first card on the timeline is the company and role; the project entries follow it.
    const entries = info.timeline.slice(-EXPECTED.engagements.length)
    expect(JSON.stringify(entries) === JSON.stringify(EXPECTED.engagements), `timeline entries: ${info.timeline.join(' | ')}`)
    expect(info.timeline.length === EXPECTED.engagements.length + 1, `expected the company card plus ${EXPECTED.engagements.length} projects, found ${info.timeline.length} cards`)
    expect(!/Orion/.test(info.projects), 'Orion still appears in Featured Projects')
    expect(info.current.length === 1 && /Orion/.test(info.current[0] ?? ''), `marked as current: ${info.current.join(' | ') || 'none'}`)
  })
  await check('projects', 'no invented repository or demo links', async () => {
    const hrefs = await section.locator('a[href^="http"]').evaluateAll((links) => links.map((a) => a.href))
    expect(hrefs.length === 0, `unexpected external links: ${hrefs.join(', ')}`)
  })
  await check('projects', 'View Details opens a modal dialog and puts the project in the URL', async () => {
    await detailButtons.first().scrollIntoViewIfNeeded()
    await detailButtons.first().click()
    await page.waitForSelector('dialog[open]', { timeout: 10000 })
    await page.waitForTimeout(400)
    const state = await page.evaluate(() => {
      const dialog = document.querySelector('dialog[open]')
      return {
        url: window.location.search,
        modal: dialog.matches(':modal'),
        labelled: Boolean(document.getElementById(dialog.getAttribute('aria-labelledby') ?? '')?.textContent.trim()),
        title: document.title,
        focusInside: dialog.contains(document.activeElement),
        bodyOverflow: getComputedStyle(document.body).overflow,
      }
    })
    expect(state.url.includes(`project=${EXPECTED.projectSlugs[0]}`), `url ${state.url}`)
    expect(state.modal === true, 'dialog is not modal')
    expect(state.labelled, 'dialog has no valid aria-labelledby')
    expect(state.focusInside, 'focus is not inside the dialog')
    expect(EXPECTED.firstProjectTitle.test(state.title), `document title "${state.title}"`)
    expect(state.bodyOverflow === 'hidden', `page behind the dialog still scrolls (overflow ${state.bodyOverflow})`)
  })
  await check('projects', 'Escape closes the dialog, cleans the URL, restores the title and returns focus', async () => {
    await page.keyboard.press('Escape')
    await page.waitForTimeout(800)
    const state = await page.evaluate(() => ({
      open: Boolean(document.querySelector('dialog[open]')),
      url: window.location.search,
      focus: document.activeElement?.textContent?.trim().slice(0, 30),
      title: document.title,
      bodyOverflow: getComputedStyle(document.body).overflow,
    }))
    expect(!state.open, 'dialog still open')
    expect(!state.url.includes('project='), `url ${state.url}`)
    expect(/view details/i.test(state.focus ?? ''), `focus on "${state.focus}"`)
    expect(state.title === EXPECTED.title, `title not restored: "${state.title}"`)
    expect(state.bodyOverflow !== 'hidden', 'page scrolling is still locked')
  })
  await check('projects', 'browser Back closes the dialog', async () => {
    await detailButtons.nth(1).click()
    await page.waitForSelector('dialog[open]', { timeout: 10000 })
    await page.goBack()
    await page.waitForTimeout(800)
    const url = await page.evaluate(() => window.location.search)
    expect(!(await dialogOpen(page)) && !url.includes('project='), `open=${await dialogOpen(page)} url=${url}`)
  })
  await check('projects', 'browser Forward reopens it, Back closes it again', async () => {
    await page.goForward()
    await page.waitForTimeout(900)
    expect(await dialogOpen(page), 'Forward did not reopen the dialog')
    await page.goBack()
    await page.waitForTimeout(800)
    expect(!(await dialogOpen(page)), 'Back did not close the dialog')
  })
  await check('projects', 'Next project switches without adding history; Back still closes', async () => {
    await detailButtons.first().click()
    await page.waitForSelector('dialog[open]', { timeout: 10000 })
    await page.locator('dialog[open]').getByRole('button', { name: /next project/i }).first().click()
    await page.waitForTimeout(600)
    const url = await page.evaluate(() => window.location.search)
    expect(url.includes(`project=${EXPECTED.projectSlugs[1]}`), `url ${url}`)
    // With exactly two projects there is a single control (previous and next are the same entry).
    const controls = await page.locator('dialog[open] nav[aria-label="Other projects"] button').allTextContents()
    if (EXPECTED.projectSlugs.length === 2) {
      expect(controls.length === 1, `expected one control for two projects, found ${controls.length}: ${controls.join(' | ')}`)
    } else {
      expect(new Set(controls.map((text) => text.replace(/^(previous|next) project:?\s*/i, ''))).size === controls.length, `two controls lead to the same project: ${controls.join(' | ')}`)
    }
    const backButton = controls.length === 1 ? /next project/i : /previous project/i
    await page.locator('dialog[open]').getByRole('button', { name: backButton }).first().click()
    await page.waitForTimeout(600)
    const back = await page.evaluate(() => window.location.search)
    expect(back.includes(`project=${EXPECTED.projectSlugs[0]}`), `url after Previous ${back}`)
    await page.goBack()
    await page.waitForTimeout(800)
    const final = await page.evaluate(() => window.location.search)
    expect(!(await dialogOpen(page)) && !final.includes('project='), `open=${await dialogOpen(page)} url=${final}`)
  })
  await check('projects', 'backdrop click and close button close the dialog', async () => {
    await detailButtons.first().click()
    await page.waitForSelector('dialog[open]', { timeout: 10000 })
    await page.waitForTimeout(400)
    await page.mouse.click(8, 8)
    await page.waitForTimeout(800)
    expect(!(await dialogOpen(page)), 'backdrop click did not close')
    await detailButtons.first().click()
    await page.waitForSelector('dialog[open]', { timeout: 10000 })
    await closeButton().click()
    await page.waitForTimeout(800)
    expect(!(await dialogOpen(page)), 'close button did not close')
  })
  await check('projects', 'shared link ?project=<slug> opens that project; closing cleans the URL', async () => {
    await load(page, `?project=${EXPECTED.projectSlugs[1]}`)
    await page.waitForSelector('dialog[open]', { timeout: 10000 })
    const heading = await page.locator('dialog[open]').getByRole('heading').first().innerText()
    expect(/Ecommerce Application/i.test(heading), `dialog heading "${heading}"`)
    await page.keyboard.press('Escape')
    await page.waitForTimeout(800)
    const url = await page.evaluate(() => window.location.search)
    expect(!(await dialogOpen(page)) && !url.includes('project='), `open=${await dialogOpen(page)} url=${url}`)
    const top = await sectionTop(page, 'projects')
    return `after closing, the projects section is at ${top}px`
  })
  await check('projects', 'unknown ?project= value opens nothing and is removed', async () => {
    await load(page, '?project=does-not-exist')
    await page.waitForTimeout(1000)
    const url = await page.evaluate(() => window.location.search)
    expect(!(await dialogOpen(page)) && !url.includes('project='), `open=${await dialogOpen(page)} url=${url}`)
  })
  await check('projects', 'every project opens with its own title', async () => {
    await load(page)
    const titles = []
    for (let index = 0; index < EXPECTED.projectSlugs.length; index++) {
      await detailButtons.nth(index).scrollIntoViewIfNeeded()
      await detailButtons.nth(index).click()
      await page.waitForSelector('dialog[open]', { timeout: 10000 })
      titles.push((await page.locator('dialog[open]').getByRole('heading').first().innerText()).trim())
      await page.keyboard.press('Escape')
      await page.waitForTimeout(700)
    }
    expect(new Set(titles).size === EXPECTED.projectSlugs.length, `titles: ${titles.join(' | ')}`)
    return titles.join(' | ')
  })
  await context.close()
}

/* --------------------------------------------------------------- contact */
if (run('contact')) {
  const { context, page } = await newPage({ label: 'contact' })
  const posts = []
  page.on('request', (request) => {
    if (request.method() === 'POST') posts.push(request.url())
  })
  await load(page)
  const section = page.locator('#contact')
  await section.scrollIntoViewIfNeeded()
  await page.waitForTimeout(700)

  await check('contact', 'email, phone and LinkedIn links are correct', async () => {
    expect((await section.locator(`a[href="mailto:${EXPECTED.email}"]`).count()) > 0, 'mailto link missing')
    expect((await section.locator(`a[href="${EXPECTED.tel}"]`).count()) > 0, 'tel link missing')
    const linkedin = section.locator(`a[href="${EXPECTED.linkedin}"]`).first()
    expect((await linkedin.count()) > 0, 'LinkedIn link missing')
    expect((await linkedin.getAttribute('target')) === '_blank', 'LinkedIn link does not open a new tab')
    expect(/noopener/.test((await linkedin.getAttribute('rel')) ?? ''), 'LinkedIn link lacks rel=noopener')
  })
  await check('contact', 'details show name, email, phone, location and LinkedIn', async () => {
    const text = (await section.evaluate((node) => node.textContent)).replace(/[­​]/g, '').replace(/\s+/g, ' ')
    for (const fragment of ['Franklin Selvaraj M.', EXPECTED.email, '+91 8754128805', 'Trichy, Tamil Nadu, India', 'linkedin.com/in/franklin-selvaraj-m']) {
      expect(text.includes(fragment), `missing "${fragment}"`)
    }
  })

  const form = section.locator('form')
  const submit = form.locator('button[type="submit"]')
  const field = (name) => form.locator(`[name="${name}"]`)

  await check('contact', 'form has labelled Name, Email, Subject and Message fields and a submit button', async () => {
    const info = await page.evaluate(() => {
      const form = document.querySelector('#contact form')
      return ['name', 'email', 'subject', 'message'].map((name) => {
        const control = form.querySelector(`[name="${name}"]`)
        const label = control ? form.querySelector(`label[for="${control.id}"]`) : null
        return { name, exists: Boolean(control), label: label?.textContent.trim() ?? null, required: control?.getAttribute('aria-required') === 'true' || control?.required === true }
      })
    })
    for (const item of info) {
      expect(item.exists, `no ${item.name} field`)
      expect(item.label && new RegExp(item.name, 'i').test(item.label), `${item.name} field has no matching <label> (got "${item.label}")`)
      expect(item.required, `${item.name} field is not marked required`)
    }
    expect((await form.getAttribute('novalidate')) !== null, 'form is missing noValidate')
    expect((await submit.count()) === 1, 'submit button missing')
  })
  await check('contact', 'empty submit shows four errors and focuses the first invalid field', async () => {
    await page.waitForTimeout(2800)
    await submit.click()
    await page.waitForTimeout(500)
    const state = await page.evaluate(() => {
      const form = document.querySelector('#contact form')
      const invalid = [...form.querySelectorAll('[aria-invalid="true"]')]
      return {
        invalid: invalid.map((control) => control.getAttribute('name')),
        described: invalid.every((control) =>
          (control.getAttribute('aria-describedby') ?? '')
            .split(/\s+/)
            .filter(Boolean)
            .some((id) => /error/.test(id) && (document.getElementById(id)?.textContent ?? '').trim().length > 0),
        ),
        focused: document.activeElement?.getAttribute('name'),
      }
    })
    expect(state.invalid.length === 4, `invalid fields: ${state.invalid.join(', ') || 'none'}`)
    expect(state.described, 'an invalid field has no linked, non-empty error message')
    expect(state.focused === 'name', `focus on "${state.focused}"`)
    expect(posts.length === 0, 'a request was sent for an invalid form')
  })
  await check('contact', 'invalid email address is rejected with a clear message', async () => {
    await field('email').fill('not-an-email')
    await field('email').blur()
    await page.waitForTimeout(300)
    expect((await field('email').getAttribute('aria-invalid')) === 'true', 'email not marked invalid')
    const message = await page.evaluate(() => document.getElementById('contact-email-error')?.textContent ?? '')
    expect(/valid email/i.test(message), `error text: "${message}"`)
  })
  await check('contact', 'too-short values are rejected; errors clear when corrected', async () => {
    await field('name').fill('A')
    await field('name').blur()
    await page.waitForTimeout(200)
    expect((await field('name').getAttribute('aria-invalid')) === 'true', 'one-letter name accepted')
    await field('name').fill('Quality Check')
    await field('email').fill('qa.check@example.com')
    await field('subject').fill('Portfolio enquiry')
    await field('message').fill('This is an automated functional check of the contact form.')
    await field('message').blur()
    await page.waitForTimeout(400)
    const invalid = await page.evaluate(() => [...document.querySelectorAll('#contact form [aria-invalid="true"]')].map((control) => control.getAttribute('name')))
    expect(invalid.length === 0, `still invalid: ${invalid.join(', ')}`)
  })
  await check('contact', 'valid submit gives honest feedback for the active delivery mode', async () => {
    await submit.click()
    await page.waitForTimeout(1800)
    const status = await page.evaluate(() =>
      [...document.querySelectorAll('#contact [role="status"], #contact [role="alert"]')]
        .map((node) => node.textContent.trim())
        .filter(Boolean)
        .join(' || '),
    )
    expect(status.length > 0, 'no status message after submit')
    if (posts.length === 0) {
      expect(/email app/i.test(status), `mailto mode status should mention the email app: "${status.slice(0, 200)}"`)
      expect(!/\b(message sent|sent successfully|has been sent|was sent|thank you, your message)\b/i.test(status), `mailto mode must not claim the message was sent: "${status.slice(0, 200)}"`)
      const kept = await field('message').inputValue()
      expect(kept.length > 10, 'typed message was cleared in mailto mode')
      return `mailto mode: "${status.slice(0, 140)}"`
    }
    return `endpoint mode (${posts[0]}): "${status.slice(0, 140)}"`
  })
  await context.close()
}

/* ---------------------------------------------------------------- mobile */
if (run('mobile')) {
  const { context, page } = await newPage({ width: 390, height: 844, mobile: true, label: 'mobile' })
  await load(page)
  const toggle = page.locator('header button[aria-controls]').first()
  const menuState = () =>
    page.evaluate(() => {
      const button = document.querySelector('header button[aria-controls]')
      const menu = document.getElementById(button?.getAttribute('aria-controls') ?? '')
      const active = document.activeElement
      return {
        label: button?.getAttribute('aria-label'),
        expanded: button?.getAttribute('aria-expanded'),
        links: menu ? [...menu.querySelectorAll('nav a')].map((a) => a.textContent.replace(/^\s*\d+\s*/, '').trim()) : [],
        overflow: getComputedStyle(document.body).overflow,
        focusInMenu: Boolean(menu && active && menu.contains(active)),
        focusOnToggle: active === button,
      }
    })

  await check('mobile', 'hamburger button is present with correct ARIA and a 44px target', async () => {
    expect(await toggle.isVisible(), 'menu button not visible')
    const state = await menuState()
    expect(/open menu/i.test(state.label ?? ''), `label "${state.label}"`)
    expect(state.expanded === 'false', 'aria-expanded should be false')
    const box = await toggle.boundingBox()
    expect(box.width >= 44 && box.height >= 44, `touch target ${Math.round(box.width)}x${Math.round(box.height)}`)
    expect((await page.locator('header nav a').count()) === 0 || !(await page.locator('header nav a').first().isVisible()), 'desktop links visible on a phone')
  })
  await check('mobile', 'menu opens with all eight links, locks scrolling and takes focus', async () => {
    await toggle.click()
    await page.waitForTimeout(800)
    const state = await menuState()
    expect(state.expanded === 'true', `aria-expanded=${state.expanded}`)
    expect(/close menu/i.test(state.label ?? ''), `label "${state.label}"`)
    const missing = EXPECTED.nav.filter((label) => !state.links.includes(label))
    expect(missing.length === 0, `menu is missing: ${missing.join(', ')} (has ${state.links.join(', ')})`)
    expect(state.overflow === 'hidden', `body overflow ${state.overflow}`)
    expect(state.focusInMenu, 'focus did not move into the menu')
  })
  await check('mobile', 'Tab and Shift+Tab stay inside the open menu', async () => {
    const escaped = []
    for (let i = 0; i < 26; i++) {
      await page.keyboard.press(i % 9 === 8 ? 'Shift+Tab' : 'Tab')
      const inside = await page.evaluate(() => Boolean(document.activeElement?.closest('header')))
      if (!inside) escaped.push(i)
    }
    expect(escaped.length === 0, `focus left the menu on key press(es): ${escaped.join(', ')}`)
  })
  await check('mobile', 'Escape closes the menu, unlocks scrolling and returns focus to the button', async () => {
    await page.keyboard.press('Escape')
    await page.waitForTimeout(700)
    const state = await menuState()
    expect(state.expanded === 'false', `aria-expanded=${state.expanded}`)
    expect(state.focusOnToggle, 'focus did not return to the menu button')
    expect(state.overflow !== 'hidden', 'body scrolling is still locked')
  })
  await check('mobile', 'choosing a link closes the menu and scrolls to the section', async () => {
    await toggle.click()
    await page.waitForTimeout(700)
    const menuId = await toggle.getAttribute('aria-controls')
    await page.locator(`#${menuId} nav a`, { hasText: 'Projects' }).first().click()
    await settle(page)
    await page.waitForTimeout(600)
    const state = await menuState()
    expect(state.expanded === 'false', `aria-expanded=${state.expanded}`)
    const top = await sectionTop(page, 'projects')
    expect(top !== null && top >= -4 && top <= 130, `projects top at ${top}px`)
  })
  await check('mobile', 'theme toggle works on a phone', async () => {
    await page.getByRole('button', { name: /switch to light theme/i }).first().click()
    await page.waitForTimeout(300)
    expect((await page.evaluate(() => document.documentElement.getAttribute('data-theme'))) === 'light', 'theme did not switch')
    await page.getByRole('button', { name: /switch to dark theme/i }).first().click()
    await page.waitForTimeout(300)
  })
  await check('mobile', 'project dialog fits the phone screen and closes', async () => {
    const button = page.locator('#projects').getByRole('button', { name: /view details/i }).first()
    await button.scrollIntoViewIfNeeded()
    await button.click()
    await page.waitForSelector('dialog[open]', { timeout: 10000 })
    await page.waitForTimeout(600)
    const box = await page.evaluate(() => {
      const rect = document.querySelector('dialog[open]').getBoundingClientRect()
      return { left: Math.round(rect.left), right: Math.round(rect.right), top: Math.round(rect.top), bottom: Math.round(rect.bottom), vw: window.innerWidth, vh: window.innerHeight }
    })
    expect(box.left >= -1 && box.right <= box.vw + 1 && box.top >= -1 && box.bottom <= box.vh + 1, JSON.stringify(box))
    await page.locator('dialog[open]').getByRole('button', { name: /close/i }).first().click()
    await page.waitForTimeout(700)
    expect(!(await dialogOpen(page)), 'dialog did not close')
  })
  await check('mobile', 'primary controls are at least 44px tall', async () => {
    const small = await page.evaluate(() => {
      const offenders = []
      const controls = document.querySelectorAll('#home a, #contact form button, #contact form input, #contact form textarea, #projects button, header button')
      for (const control of controls) {
        const rect = control.getBoundingClientRect()
        if (rect.width === 0 || rect.height === 0) continue
        // Not a control for people: the spam honeypot is hidden off-screen on purpose.
        if (control.closest('[aria-hidden="true"]') || rect.right < 0) continue
        if (rect.height < 43.5) offenders.push(`${control.tagName.toLowerCase()} "${(control.getAttribute('aria-label') || control.textContent || control.getAttribute('name') || '').trim().slice(0, 28)}" ${Math.round(rect.height)}px`)
      }
      return offenders
    })
    expect(small.length === 0, `${small.length} control(s) under 44px: ${small.slice(0, 8).join(' | ')}`)
  })
  await context.close()
}

/* -------------------------------------------------------------- overflow */
if (run('overflow')) {
  for (const width of [360, 390, 768, 1024, 1280, 1440, 1920]) {
    for (const theme of ['dark', 'light']) {
      const height = width < 600 ? 800 : width < 1100 ? 1024 : width < 1900 ? 900 : 1080
      const { context, page } = await newPage({ width, height, theme, mobile: width < 600, label: `${width}-${theme}` })
      await check('overflow', `no horizontal overflow or clipped text at ${width}px (${theme})`, async () => {
        await load(page)
        await page.evaluate(async () => {
          const step = Math.max(200, Math.floor(window.innerHeight * 0.7))
          for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
            window.scrollTo(0, y)
            await new Promise((done) => setTimeout(done, 70))
          }
        })
        await page.waitForTimeout(600)
        const info = await page.evaluate(() => {
          const viewport = document.documentElement.clientWidth
          const scroll = document.documentElement.scrollWidth
          const describe = (element) => {
            const section = element.closest('section[id], header, footer')
            return `${section?.id || section?.tagName.toLowerCase() || '?'} > ${element.tagName.toLowerCase()}.${String(element.className).split(/\s+/).slice(0, 3).join('.')}`
          }
          const offenders = []
          if (scroll > viewport + 1) {
            for (const element of document.querySelectorAll('body *')) {
              const rect = element.getBoundingClientRect()
              if (rect.width === 0 || rect.height === 0 || rect.right <= viewport + 1) continue
              if (getComputedStyle(element).position === 'fixed') continue
              let clipped = false
              for (let parent = element.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
                if (getComputedStyle(parent).overflowX !== 'visible') {
                  clipped = true
                  break
                }
              }
              if (clipped) continue
              offenders.push(`${describe(element)} right=${Math.round(rect.right)}`)
              if (offenders.length >= 5) break
            }
          }
          // Text cut off by its own box (a word wider than its container).
          const cut = []
          for (const element of document.querySelectorAll('main h1, main h2, main h3, main p, main li, main a, main button, main dd, main dt, footer p, footer a')) {
            const style = getComputedStyle(element)
            if (style.overflowX === 'visible' || style.textOverflow === 'ellipsis') continue
            // Screen-reader-only text is clipped to one pixel on purpose.
            if (element.clientWidth <= 2 || element.closest('.sr-only')) continue
            if (element.scrollWidth > element.clientWidth + 2 && element.clientWidth > 0) {
              cut.push(`${describe(element)} "${element.textContent.trim().slice(0, 30)}"`)
              if (cut.length >= 5) break
            }
          }
          return { viewport, scroll, offenders, cut, theme: document.documentElement.getAttribute('data-theme') }
        })
        expect(info.theme === theme, `theme is ${info.theme}`)
        expect(info.scroll <= info.viewport + 1, `scrollWidth ${info.scroll} > ${info.viewport}: ${info.offenders.join(' ; ')}`)
        expect(info.cut.length === 0, `clipped text: ${info.cut.join(' ; ')}`)
      })
      await context.close()
    }
  }
}

/* -------------------------------------------------------------- notfound */
if (run('notfound')) {
  const { context, page } = await newPage({ label: '404' })
  await check('notfound', '404 page renders with site chrome, heading and a way home', async () => {
    await load(page, '404.html')
    const info = await page.evaluate(() => ({
      title: document.title,
      h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()),
      robots: document.querySelector('meta[name="robots"]')?.getAttribute('content'),
      header: Boolean(document.querySelector('header')),
      footer: Boolean(document.querySelector('footer')),
    }))
    expect(/not found/i.test(info.title), `title "${info.title}"`)
    expect(info.h1.length === 1 && /not found/i.test(info.h1[0]), `h1: ${info.h1.join(' | ')}`)
    expect(/noindex/.test(info.robots ?? ''), 'missing noindex')
    expect(info.header && info.footer, 'site chrome missing')
    const href = await page.getByRole('link', { name: /back to home/i }).first().getAttribute('href')
    expect(new URL(href, BASE).href === BASE, `home link href ${href}`)
  })
  await check('notfound', 'navigation on the 404 page leads back to the home page section', async () => {
    await page.locator('header nav a', { hasText: /^\s*About\s*$/ }).first().click()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(900)
    const state = await page.evaluate(() => ({ hash: window.location.hash, hasAbout: Boolean(document.getElementById('about')), top: Math.round(document.getElementById('about')?.getBoundingClientRect().top ?? -9999) }))
    expect(state.hasAbout && state.hash === '#about', JSON.stringify(state))
    expect(state.top >= -4 && state.top <= 130, `about section at ${state.top}px after arriving from the 404 page`)
  })
  await context.close()

  const mobile = await newPage({ width: 390, height: 844, mobile: true, label: '404-mobile' })
  await check('notfound', '404 page has no overflow on a phone', async () => {
    await load(mobile.page, '404.html')
    const info = await mobile.page.evaluate(() => ({ viewport: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }))
    expect(info.scroll <= info.viewport + 1, `scrollWidth ${info.scroll} > ${info.viewport}`)
  })
  await mobile.context.close()
}

/* ---------------------------------------------------------------- motion */
if (run('motion')) {
  const { context, page } = await newPage({ reducedMotion: true, label: 'reduced-motion' })
  await check('motion', 'reduced motion: headline visible immediately and statistics show final values', async () => {
    await load(page)
    await page.waitForTimeout(700)
    const info = await page.evaluate(() => {
      const h1 = document.querySelector('h1')
      let opacity = 1
      for (let node = h1; node && node !== document.body; node = node.parentElement) opacity *= Number(getComputedStyle(node).opacity)
      const shown = [...document.querySelectorAll('#home .tabular-nums > [aria-hidden="true"]')].map((node) => node.textContent.trim())
      return { opacity, shown }
    })
    expect(info.opacity > 0.98, `h1 effective opacity ${info.opacity}`)
    for (const value of ['4', '30', '50']) expect(info.shown.includes(value), `counter does not show ${value} immediately (showing: ${info.shown.join(', ')})`)
  })
  await check('motion', 'reduced motion: every section heading is fully visible when scrolled to', async () => {
    const hidden = await page.evaluate(async () => {
      const problems = []
      for (const section of document.querySelectorAll('main section[id]')) {
        section.scrollIntoView({ block: 'start', behavior: 'instant' })
        await new Promise((done) => setTimeout(done, 550))
        const heading = section.querySelector('h1, h2')
        if (!heading) continue
        let opacity = 1
        for (let node = heading; node && node !== document.body; node = node.parentElement) opacity *= Number(getComputedStyle(node).opacity)
        if (opacity < 0.95) problems.push(`${section.id}: ${opacity.toFixed(2)}`)
      }
      return problems
    })
    expect(hidden.length === 0, `headings not fully visible: ${hidden.join(', ')}`)
  })
  await check('motion', 'reduced motion: no element keeps animating', async () => {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await page.waitForTimeout(1200)
    const running = await page.evaluate(() =>
      document
        .getAnimations()
        .filter((animation) => animation.playState === 'running' && (animation.effect?.getComputedTiming().duration ?? 0) > 50)
        .map((animation) => animation.animationName || animation.constructor.name)
        .slice(0, 6),
    )
    expect(running.length === 0, `still running: ${running.join(', ')}`)
  })
  await context.close()

  const normal = await newPage({ label: 'entrance' })
  await check('motion', 'headline is readable within one second of loading', async () => {
    await normal.page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await normal.page.waitForSelector('h1', { timeout: 15000 })
    await normal.page.waitForTimeout(1000)
    const opacity = await normal.page.evaluate(() => {
      let value = 1
      for (let node = document.querySelector('h1'); node && node !== document.body; node = node.parentElement) value *= Number(getComputedStyle(node).opacity)
      return value
    })
    expect(opacity > 0.9, `h1 effective opacity one second after it appeared: ${opacity.toFixed(2)}`)
  })
  await normal.context.close()
}

/* -------------------------------------------------------------- keyboard */
if (run('keyboard')) {
  const { context, page } = await newPage({ label: 'keyboard' })
  await load(page)
  await check('keyboard', 'first Tab reveals a visible "Skip to main content" link that works', async () => {
    await page.keyboard.press('Tab')
    const info = await page.evaluate(() => {
      const active = document.activeElement
      const rect = active.getBoundingClientRect()
      return { text: active.textContent.trim(), visible: rect.width > 20 && rect.height > 10 && rect.top >= 0 && rect.left >= 0 }
    })
    expect(/skip to main content/i.test(info.text), `first focus is "${info.text}"`)
    expect(info.visible, 'skip link is not visible when focused')
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)
    const focused = await page.evaluate(() => document.activeElement?.id)
    expect(focused === 'main-content', `focus moved to "${focused}"`)
  })
  await check('keyboard', 'every control reached with Tab shows a visible focus indicator', async () => {
    await load(page)
    const missing = []
    const seen = new Set()
    for (let i = 0; i < 220; i++) {
      await page.keyboard.press('Tab')
      const info = await page.evaluate(() => {
        const active = document.activeElement
        if (!active || active === document.body) return null
        const style = getComputedStyle(active)
        const outlined = style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) >= 1
        const ring = Boolean(style.boxShadow && style.boxShadow !== 'none')
        const label = `${active.tagName.toLowerCase()}:${(active.getAttribute('aria-label') || active.textContent || active.getAttribute('name') || '').trim().slice(0, 32)}`
        const rect = active.getBoundingClientRect()
        return { indicated: outlined || ring, label, key: `${label}@${Math.round(rect.top + window.scrollY)}:${Math.round(rect.left)}`, inFooter: Boolean(active.closest('footer')) }
      })
      if (!info) continue
      if (seen.has(info.key)) break
      seen.add(info.key)
      if (!info.indicated) missing.push(info.label)
    }
    expect(missing.length === 0, `${missing.length} control(s) without a focus indicator: ${missing.slice(0, 8).join(' | ')}`)
    expect(seen.size >= 30, `only ${seen.size} controls were reachable with Tab`)
    return `${seen.size} controls tabbed`
  })
  await check('keyboard', 'project dialog can be opened, tabbed through and closed with the keyboard alone', async () => {
    const button = page.locator('#projects').getByRole('button', { name: /view details/i }).first()
    await button.focus()
    await page.keyboard.press('Enter')
    await page.waitForSelector('dialog[open]', { timeout: 10000 })
    await page.waitForTimeout(400)
    const escaped = []
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press('Tab')
      const inside = await page.evaluate(() => {
        const dialog = document.querySelector('dialog[open]')
        return Boolean(dialog?.contains(document.activeElement)) || document.activeElement === document.body
      })
      if (!inside) escaped.push(i)
    }
    expect(escaped.length === 0, `focus left the dialog on Tab press(es): ${escaped.join(', ')}`)
    await page.keyboard.press('Escape')
    await page.waitForTimeout(800)
    expect(!(await dialogOpen(page)), 'Escape did not close the dialog')
  })
  await context.close()
}

await browser.close()

const uniqueProblems = [...new Set(consoleProblems)]
console.log('')
console.log(`CONSOLE / NETWORK PROBLEMS: ${uniqueProblems.length}`)
for (const problem of uniqueProblems.slice(0, 40)) console.log(`  ${problem}`)

const failed = results.filter((result) => !result.ok)
console.log('')
console.log(`SUMMARY: ${results.length - failed.length} passed, ${failed.length} failed, ${uniqueProblems.length} console/network problem(s)`)
for (const failure of failed) console.log(`  FAILED [${failure.group}] ${failure.name} -- ${failure.detail}`)
if (args.json) writeFileSync(String(args.json), JSON.stringify({ base: BASE, results, consoleProblems: uniqueProblems }, null, 2))
process.exit(failed.length > 0 || uniqueProblems.length > 0 ? 1 : 0)
