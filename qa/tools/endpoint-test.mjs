#!/usr/bin/env node
/**
 * Contact form test in "endpoint" mode, against a local mock form service.
 *
 * The site must be BUILT with  VITE_CONTACT_ENDPOINT=http://127.0.0.1:<mock-port>/submit
 * and served somewhere (e.g. `vite preview`). This script starts the mock service itself.
 *
 * Usage: node endpoint-test.mjs --base http://127.0.0.1:4174/ [--mock-port 4599]
 *
 * Checks: successful delivery (payload, success message, form reset), server failure
 * (error message, values kept, email fallback offered), "200 but success:false",
 * the honeypot and the minimum-fill-time trap (nothing may be sent).
 */
import './local-env.mjs'
import { chromium } from 'playwright-core'
import { createServer } from 'node:http'

const argv = process.argv.slice(2)
const arg = (name, fallback) => {
  const index = argv.indexOf(`--${name}`)
  return index >= 0 ? argv[index + 1] : fallback
}
const BASE = String(arg('base', 'http://127.0.0.1:4174/')).replace(/\/?$/, '/')
const MOCK_PORT = Number(arg('mock-port', 4599))

let mode = 'ok'
const received = []

const server = createServer((request, response) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'content-type, accept',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
  if (request.method === 'OPTIONS') {
    response.writeHead(204, cors)
    response.end()
    return
  }
  let body = ''
  request.on('data', (chunk) => (body += chunk))
  request.on('end', () => {
    let parsed = null
    try {
      parsed = JSON.parse(body)
    } catch {
      /* keep null */
    }
    received.push({ method: request.method, url: request.url, contentType: request.headers['content-type'], body: parsed })
    const send = (status, payload) => {
      setTimeout(() => {
        response.writeHead(status, { ...cors, 'Content-Type': 'application/json' })
        response.end(JSON.stringify(payload))
      }, 700) // long enough to observe the loading state
    }
    if (mode === 'fail') send(500, { error: 'mock failure' })
    else if (mode === 'soft-fail') send(200, { success: false, message: 'mock rejection' })
    else send(200, { ok: true, success: true })
  })
})
await new Promise((resolve) => server.listen(MOCK_PORT, '127.0.0.1', resolve))

const results = []
function record(name, ok, detail = '') {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  [endpoint] ${name}${detail ? `  -- ${detail}` : ''}`)
}
async function check(name, fn) {
  try {
    const detail = await fn()
    record(name, true, typeof detail === 'string' ? detail : '')
  } catch (error) {
    record(name, false, String(error?.message ?? error).split('\n')[0].slice(0, 500))
  }
}
function expect(condition, message) {
  if (!condition) throw new Error(message)
}

const VALUES = {
  name: 'Quality Check',
  email: 'qa.check@example.com',
  subject: 'Portfolio enquiry',
  message: 'This is an automated functional check of the contact form in endpoint mode.',
}

const browser = await chromium.launch({ channel: 'msedge', headless: true })

async function openForm() {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  const problems = []
  page.on('pageerror', (error) => problems.push(String(error)))
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 })
  await page.locator('#contact').scrollIntoViewIfNeeded()
  const form = page.locator('#contact form')
  return { context, page, form, problems }
}

async function fill(form, values = VALUES) {
  for (const [name, value] of Object.entries(values)) await form.locator(`[name="${name}"]`).fill(value)
}

const statusText = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('#contact [role="status"], #contact [role="alert"]')]
      .map((node) => `${node.getAttribute('role')}: ${node.textContent.trim()}`)
      .filter((text) => text.length > 9)
      .join(' || '),
  )

await check('page is built in endpoint mode (helper text says it sends from the page)', async () => {
  const { context, page } = await openForm()
  const help = await page.locator('#contact-form-help').innerText()
  await context.close()
  expect(/sends your message/i.test(help), `helper text: "${help}"`)
  return help
})

await check('successful delivery: loading state, correct JSON payload, success message, form reset', async () => {
  mode = 'ok'
  received.length = 0
  const { context, page, form } = await openForm()
  await page.waitForTimeout(2800)
  await fill(form)
  await form.locator('button[type="submit"]').click()
  await page.waitForTimeout(250)
  const busy = await page.evaluate(() => {
    const button = document.querySelector('#contact form button[type="submit"]')
    return { text: button.textContent.trim(), busy: button.getAttribute('aria-busy'), disabled: button.getAttribute('aria-disabled') ?? String(button.disabled) }
  })
  expect(/sending/i.test(busy.text) && (busy.busy === 'true' || busy.disabled === 'true'), `no loading state while sending: ${JSON.stringify(busy)}`)
  await page.waitForTimeout(1800)
  const status = await statusText(page)
  expect(received.length === 1, `mock service received ${received.length} request(s)`)
  const payload = received[0].body ?? {}
  expect(/application\/json/.test(received[0].contentType ?? ''), `content-type ${received[0].contentType}`)
  for (const [name, value] of Object.entries(VALUES)) expect(payload[name] === value, `payload.${name} = ${JSON.stringify(payload[name])}`)
  expect(!('reference_code' in payload), 'the honeypot field was sent to the service')
  expect(/^status:/.test(status) && /sent|thank|received/i.test(status), `status after success: "${status.slice(0, 200)}"`)
  const remaining = await form.locator('[name="message"]').inputValue()
  expect(remaining === '', 'form was not reset after a successful delivery')
  await context.close()
  return `"${status.slice(0, 120)}"`
})

for (const failure of ['fail', 'soft-fail']) {
  await check(`service ${failure === 'fail' ? 'error (HTTP 500)' : 'rejection (200 with success:false)'}: error shown, values kept, email fallback offered`, async () => {
    mode = failure
    received.length = 0
    const { context, page, form } = await openForm()
    await page.waitForTimeout(2800)
    await fill(form)
    await form.locator('button[type="submit"]').click()
    await page.waitForTimeout(2200)
    const status = await statusText(page)
    expect(received.length === 1, `mock service received ${received.length} request(s)`)
    expect(/^alert:/.test(status) || / \|\| alert:/.test(status), `no role="alert" message: "${status.slice(0, 200)}"`)
    const kept = await form.locator('[name="message"]').inputValue()
    expect(kept === VALUES.message, 'typed message was lost after the failure')
    const fallback = await page.locator('#contact a[href^="mailto:"]').evaluateAll((links) => links.map((a) => a.getAttribute('href')).filter((href) => /subject=/.test(href)))
    expect(fallback.some((href) => href.includes(encodeURIComponent(VALUES.subject))), 'no pre-filled email fallback link offered')
    const button = await page.evaluate(() => document.querySelector('#contact form button[type="submit"]').textContent.trim())
    expect(!/sending/i.test(button), 'button is stuck in the loading state')
    await context.close()
    return `"${status.slice(0, 120)}"`
  })
}

await check('honeypot filled: nothing is sent', async () => {
  mode = 'ok'
  received.length = 0
  const { context, page, form } = await openForm()
  await page.waitForTimeout(2800)
  await fill(form)
  await page.evaluate(() => {
    const trap = document.querySelector('#contact form [name="reference_code"]')
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
    setter.call(trap, 'spam-bot')
    trap.dispatchEvent(new Event('input', { bubbles: true }))
  })
  await form.locator('button[type="submit"]').click()
  await page.waitForTimeout(1800)
  expect(received.length === 0, `a request was sent although the honeypot was filled (${received.length})`)
  await context.close()
})

await check('submitted faster than a person could type: nothing is sent', async () => {
  mode = 'ok'
  received.length = 0
  const { context, page, form } = await openForm()
  await page.evaluate(() => {
    const form = document.querySelector('#contact form')
    const set = (name, value) => {
      const control = form.querySelector(`[name="${name}"]`)
      const proto = control instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
      Object.getOwnPropertyDescriptor(proto, 'value').set.call(control, value)
      control.dispatchEvent(new Event('input', { bubbles: true }))
    }
    set('name', 'Bot')
    set('email', 'bot@example.com')
    set('subject', 'Instant spam')
    set('message', 'Submitted immediately after the page loaded.')
  })
  // A fresh page load: reload and submit at once so the form has existed for well under the limit.
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForSelector('#contact form [name="name"]')
  await page.evaluate(() => {
    const form = document.querySelector('#contact form')
    const set = (name, value) => {
      const control = form.querySelector(`[name="${name}"]`)
      const proto = control instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
      Object.getOwnPropertyDescriptor(proto, 'value').set.call(control, value)
      control.dispatchEvent(new Event('input', { bubbles: true }))
    }
    set('name', 'Bot')
    set('email', 'bot@example.com')
    set('subject', 'Instant spam')
    set('message', 'Submitted immediately after the page loaded.')
    form.requestSubmit()
  })
  await page.waitForTimeout(1800)
  expect(received.length === 0, `a request was sent ${received.length} time(s) for an instant submission`)
  await context.close()
})

await browser.close()
await new Promise((resolve) => server.close(resolve))

const failed = results.filter((result) => !result.ok)
console.log('')
console.log(`SUMMARY: ${results.length - failed.length} passed, ${failed.length} failed`)
process.exit(failed.length > 0 ? 1 : 0)
