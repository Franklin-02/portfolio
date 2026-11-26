#!/usr/bin/env node
/**
 * Content coverage check: verifies that every item the site owner listed in the
 * specification actually appears on the rendered site, and that nothing that was
 * forbidden (fake links, proficiency bars, "verified" wording) is present.
 *
 * The expected strings below are transcribed from the owner's specification,
 * NOT from src/data, so this compares the brief against the rendered page.
 *
 * Usage: node coverage.mjs --base http://127.0.0.1:4173/
 */
import './local-env.mjs'
import { chromium } from 'playwright-core'

const argv = process.argv.slice(2)
const baseIndex = argv.indexOf('--base')
const BASE = String(baseIndex >= 0 ? argv[baseIndex + 1] : 'http://127.0.0.1:4173/').replace(/\/?$/, '/')

const REQUIRED = {
  'Identity and contact': [
    'Franklin Selvaraj M.',
    'Senior QA Tester / PMO',
    'Quality Assurance',
    'Business Analysis',
    'Project Management',
    'Trichy, Tamil Nadu, India',
    'Techyfrank9750@gmail.com',
    '+91 8754128805',
    'linkedin.com/in/franklin-selvaraj-m',
    'New Dream Data Systems',
    '4+ Years',
    'June 2022 – Present',
    'ISTQB – Certified Tester Foundation Level (CTFL)',
    'Tamil',
    'Advanced',
    'English',
    'Intermediate',
    'Hindi',
    'Beginner',
  ],
  Navigation: ['Home', 'About', 'Experience', 'Expertise', 'Projects', 'Achievements', 'Education', 'Contact'],
  Hero: [
    "Hello, I'm Franklin Selvaraj M.",
    'With 4+ years of experience in Quality Assurance within the P&C insurance domain, I specialize in Guidewire PolicyCenter, InsuranceNow, QA Automation, API Testing, Business Analysis, and Project Delivery.',
    'Explore My Experience',
    'View My Projects',
    'Contact Me',
    'Years Experience',
    'Test Coverage Improvement',
    'Defect Turnaround Reduction',
    'ISTQB',
    'Certified',
    '4+',
    '30%',
    '50%',
  ],
  About: [
    'I am Franklin Selvaraj M., a Senior QA Tester / PMO with 4+ years of experience in the IT industry, specializing in Quality Assurance, Business Analysis, and Project Management within the Property & Casualty insurance domain.',
    'I have hands-on experience working with Guidewire PolicyCenter and InsuranceNow, contributing to insurance application testing, functional analysis, API validation, regression testing, automation, and business process validation.',
    'My technical expertise includes Java, Selenium, Playwright, Rest Assured, TestNG, Robot Framework, and Postman. I am ISTQB CTFL certified and experienced in the Software Testing Life Cycle, Agile/Scrum methodologies, defect management, and test strategy development.',
    'Beyond testing, I actively contribute to application analysis, requirements understanding, documentation, project coordination, and delivery activities.',
    'I am also passionate about independent software product development, AI-assisted engineering, business automation, and creating scalable digital solutions.',
    'Quality Engineering',
    'Ensuring application quality through structured testing, automation, defect management, API validation, and regression strategies.',
    'Understanding business requirements, application workflows, functional specifications, documentation, and business processes.',
    'Project Management / PMO',
    'Supporting project coordination, task management, documentation, stakeholder communication, sprint activities, and delivery tracking.',
  ],
  Experience: [
    'Western Reserve Group (WRG)',
    'Guidewire PolicyCenter',
    'Consumer Portal',
    'Developed comprehensive test plans and test strategies.',
    'Covered eight major lines of business across Ohio and Indiana.',
    'Analyzed functional and non-functional requirements.',
    'Designed detailed manual test cases.',
    'Executed 400+ manual test cases per release cycle.',
    'Identified and tracked 300+ defects using Rally.',
    'Performed regression testing on policy lifecycle, underwriting, and product management workflows.',
    'Validated consumer portal forms and input data.',
    'Performed form validation.',
    'Supported performance testing.',
    'Collaborated with developers, business analysts, and project managers.',
    'Participated in 80+ Agile ceremonies.',
    'Mentored and trained new team members.',
    'InsuranceNow (SPIC & AFR)',
    'Developed test plans and automation scripts.',
    'Designed scenarios across multiple P&C insurance lines of business.',
    'Executed functional and regression tests.',
    'Validated application forms and customer workflows.',
    'Tracked and managed defects using Mantis.',
    'Mantis',
    'Worked with cross-functional teams.',
    'Participated in Agile delivery activities.',
    'Supported testing process improvements.',
    'Orion Application Analysis & Delivery',
    'Current project',
    'Application analysis and delivery-support work involving UI analysis, workflow analysis, requirements documentation, functional understanding, and project coordination.',
    'Application UI analysis',
    'Business workflow analysis',
    'Requirements documentation',
    'FRD preparation',
    'Source-code analysis',
    'API and database analysis',
    'Jira task management',
    'Confluence knowledge documentation',
    'SharePoint document management',
    'Knowledge transfer documentation',
    'India',
  ],
  Achievements: [
    '30%',
    'Improvement in Test Coverage',
    '50%',
    'Reduction in Defect Turnaround Time',
    '10%',
    'Reduction in Test Cycle Time',
    '20%',
    'Increase in Customer Satisfaction',
    '400+',
    'Manual Test Cases Per Release Cycle',
    '300+',
    'Defects Identified and Tracked',
    '80+',
    'Agile Ceremonies',
    'P&C Lines of Business',
  ],
  Skills: [
    'Insurance Domain',
    'Guidewire PolicyCenter',
    'InsuranceNow',
    'Consumer Portal',
    'BillingCenter',
    'ClaimCenter',
    'Basic',
    'Property & Casualty Insurance',
    'Eight Lines of Business',
    'Manual Testing',
    'Functional Testing',
    'Regression Testing',
    'Integration Testing',
    'UAT',
    'Test Planning',
    'Test Strategy',
    'Test Case Design',
    'Defect Management',
    'STLC',
    'Defect Life Cycle',
    'Automation Testing',
    'Selenium',
    'Java',
    'TestNG',
    'Rest Assured',
    'Playwright',
    'Robot Framework',
    'Page Object Model',
    'Data-Driven Testing',
    'UI Automation',
    'API Automation',
    'API Testing',
    'Postman',
    'Forms validation',
    'API Request and Response Validation',
    'Requirement Analysis',
    'Functional Analysis',
    'Workflow Analysis',
    'FRD Documentation',
    'Business Process Understanding',
    'Application Analysis',
    'Gap Analysis',
    'Documentation Management',
    'PMO Activities',
    'Agile / Scrum',
    'Sprint Planning',
    'Daily Stand-ups',
    'Retrospectives',
    'Rally',
    'Jira',
    'Confluence',
    'SharePoint',
    'Task Tracking',
    'Project Coordination',
    'Development & AI Tools',
    'Git',
    'GitHub',
    'VS Code',
    'Eclipse',
    'Node.js',
    'Gemini',
    'AI Coding Assistants',
    'Excel',
  ],
  // Projects as corrected by the owner after the first build: Orion moved to the experience
  // timeline (current project), the two concept entries were removed, and the two that remain
  // are both the owner's freelance projects (the section is headed "Freelance Projects").
  Projects: [
    'Freelance Projects',
    'Billing Software',
    'Freelance Project',
    'Delivered',
    'Desktop billing software developed as a freelance project and delivered to its users.',
    'Billing management',
    'Invoice workflows',
    'Business-oriented user interface',
    'Ecommerce Application',
    'built as a freelance project',
    'Demo UI',
    'Premium homepage',
    'Product listings',
    'Product cards',
    'Product browsing',
    'Responsive interface',
    'View Details',
  ],
  'Business Analysis & PMO': [
    'Bridging Business Requirements and Technology Delivery.',
    'Requirement understanding',
    'Application analysis',
    'Business workflow analysis',
    'Functional documentation',
    'FRD preparation',
    'Gap identification',
    'Task coordination',
    'Jira management',
    'Meeting coordination',
    'Sprint tracking',
    'Delivery documentation',
    'Stakeholder communication',
    'Documentation & Knowledge Management',
    'Confluence',
    'SharePoint',
    'FRDs',
    'KT documentation',
    'Application analysis reports',
    'Traceability',
    'Business Requirements',
    'Analysis',
    'Documentation',
    'Development Coordination',
    'Testing',
    'Validation',
    'Delivery',
  ],
  'Insurance technology': [
    'Specialized in Insurance Technology.',
    'Guidewire PolicyCenter',
    'Policy lifecycle',
    'Policy administration',
    'Underwriting workflows',
    'Product management',
    'Policy transactions',
    'InsuranceNow',
    'Insurance application workflows',
    'REST API validation',
    'Consumer portal',
    'Multi-line-of-business testing',
    'BillingCenter',
    'ClaimCenter',
    'Basic functional understanding',
    'InsuranceSuite',
  ],
  'Certification and education': [
    'ISTQB – Certified Tester Foundation Level (CTFL)',
    'Bachelor of Computer Applications (BCA)',
    'Computer Science',
    'Tamilnadu Open University',
    '2026',
    'Diploma in Computer Engineering',
    'Seshasayee Institute of Technology',
    '2022',
  ],
  'LinkedIn content': [
    'Sharing Knowledge. Growing Together.',
    'PolicyCenter Life Cycle',
    'BillingCenter Life Cycle',
    'ClaimCenter Life Cycle',
    'InsuranceSuite Architecture',
    'PolicyCenter Data Model',
    'Guidewire Educational Series',
    'Follow the series on LinkedIn',
  ],
  Contact: [
    "Let's Connect and Build Something Meaningful.",
    "Whether you're looking to collaborate on software quality, discuss insurance technology, explore business opportunities, or connect professionally, I'd be happy to hear from you.",
    'Name',
    'Email',
    'Subject',
    'Message',
  ],
  Footer: ['All rights reserved'],
}

/** Section headings the owner specified word for word. Each must be an h2 on the page. */
const REQUIRED_HEADINGS = [
  'Beyond Testing – Understanding the Bigger Picture.',
  'Professional Journey',
  'Bridging Business Requirements and Technology Delivery.',
  'Specialized in Insurance Technology.',
  'Sharing Knowledge. Growing Together.',
  "Let's Connect and Build Something Meaningful.",
]

const HEADLINE = 'Engineering Quality. Understanding Business. Delivering Excellence.'

function normalise(text) {
  return String(text)
    .toLowerCase()
    .replace(/[ \s]+/g, ' ')
    .replace(/[‐-―−-]/g, '-')
    .replace(/[‘’`]/g, "'")
    .replace(/[“”]/g, '"')
    .trim()
}

/** List items in the brief end with a full stop; the site may render them without. */
function needle(text) {
  return normalise(text).replace(/\.$/, '')
}

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await context.newPage()
const problems = []

await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 })
await page.evaluate(() => document.fonts.ready)
await page.evaluate(async () => {
  const step = Math.floor(window.innerHeight * 0.6)
  for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
    window.scrollTo(0, y)
    await new Promise((done) => setTimeout(done, 90))
  }
  window.scrollTo(0, 0)
})
await page.waitForTimeout(2500)

let corpus = await page.evaluate(() => document.body.textContent)

// Interactive states hold content too: every process step and every project dialog.
const tabs = page.locator('#delivery [role="tab"]')
const tabCount = await tabs.count()
for (let index = 0; index < tabCount; index++) {
  await tabs.nth(index).click()
  await page.waitForTimeout(350)
  corpus += ' ' + (await page.locator('#delivery').evaluate((node) => node.textContent))
}

const detailButtons = page.locator('#projects').getByRole('button', { name: /view details/i })
const projectCount = await detailButtons.count()
const dialogTexts = []
for (let index = 0; index < projectCount; index++) {
  await detailButtons.nth(index).scrollIntoViewIfNeeded()
  await detailButtons.nth(index).click()
  await page.waitForSelector('dialog[open]', { timeout: 10000 })
  await page.waitForTimeout(350)
  const text = await page.locator('dialog[open]').evaluate((node) => node.textContent)
  const heading = await page.locator('dialog[open]').getByRole('heading').first().innerText()
  dialogTexts.push({ title: normalise(heading), text: normalise(text) })
  corpus += ' ' + text
  await page.keyboard.press('Escape')
  await page.waitForTimeout(600)
}

const haystack = normalise(corpus)
let checked = 0
const missing = {}
for (const [group, items] of Object.entries(REQUIRED)) {
  for (const item of items) {
    checked += 1
    if (!haystack.includes(needle(item))) (missing[group] ??= []).push(item)
  }
}

// Headline: the only h1, exactly as specified (whitespace between the styled words is ignored).
const h1Texts = await page.locator('h1').allTextContents()
const squash = (text) => normalise(text).replace(/\s+/g, '')
if (h1Texts.length !== 1) problems.push(`expected exactly one h1, found ${h1Texts.length}`)
else if (squash(h1Texts[0]) !== squash(HEADLINE)) problems.push(`h1 is "${h1Texts[0].trim()}", expected "${HEADLINE}"`)

const h2Texts = (await page.locator('h2').allTextContents()).map(normalise)
for (const heading of REQUIRED_HEADINGS) {
  if (!h2Texts.includes(normalise(heading))) problems.push(`no h2 with the exact text "${heading}"`)
}

// Things that must NOT be on the site.
const forbidden = await page.evaluate(() => {
  const found = []
  const text = document.body.textContent.toLowerCase()
  // Entries the owner asked to remove must not come back.
  for (const gone of ['family location tracker', 'insurance qa automation', 'cloud-based billing']) {
    if (text.includes(gone)) found.push('removed project still on the page: ' + gone)
  }
  // Owner's correction: neither employer project involved API validation.
  const experienceText = (document.getElementById('experience')?.textContent ?? '').toLowerCase()
  for (const wrong of ['rest api', 'postman', 'rest assured', 'api validation']) {
    if (experienceText.includes(wrong)) found.push('experience section still mentions "' + wrong + '"')
  }
  const insuranceText = (document.getElementById('insurance-technology')?.textContent ?? '').toLowerCase()
  if (insuranceText.includes('rest api')) found.push('insurance technology section still lists REST API validation')
  for (const word of ['audited', 'independently verified', 'verified by', 'lorem ipsum', 'your-domain', 'example.com']) {
    if (text.includes(word)) found.push(`forbidden wording on the page: "${word}"`)
  }
  const links = [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'))
  for (const href of links) {
    if (/github\.com/i.test(href)) found.push(`GitHub link present although no repository was supplied: ${href}`)
    if (/linkedin\.com\/(posts|pulse|feed)/i.test(href)) found.push(`LinkedIn article link present although none was supplied: ${href}`)
    if (/^https?:/i.test(href) && !/linkedin\.com\/in\/franklin-selvaraj-m\/?$/i.test(href)) found.push(`unexpected external link: ${href}`)
  }
  const skills = document.getElementById('expertise')
  if (skills) {
    if (skills.querySelector('[role="progressbar"], progress, meter')) found.push('skills section contains a proficiency bar')
    if (/\d\s?%/.test(skills.textContent)) found.push('skills section contains a percentage')
  }
  // The owner asked for the series progress bar and its counts to go: more posts are published on
  // LinkedIn all the time, so any "x of y posts" figure on the site would be out of date.
  const insights = document.getElementById('insights')
  if (insights) {
    const text = insights.textContent
    if (/series progress|posts planned|current topic/i.test(text)) found.push('LinkedIn section still shows series progress wording')
    if (/\d+\s*(?:\/|of)\s*\d+/i.test(text)) found.push('LinkedIn section still shows an "x of y" post count')
    if (insights.querySelector('[role="progressbar"], progress, meter, [aria-label^="Series progress" i]')) {
      found.push('LinkedIn section still contains a series progress bar')
    }
  }
  const education = document.getElementById('education')
  if (education && education.querySelector('a[href]')) found.push('education section contains a link (no verification links were supplied)')
  const images = [...document.querySelectorAll('main img')].map((img) => img.getAttribute('src'))
  if (images.length > 0) found.push(`unexpected <img> elements in the page content: ${images.join(', ')}`)
  return found
})
problems.push(...forbidden)

// Every project dialog must state its status honestly and offer no invented links.
const dialogChecks = [
  ['Billing Software', ['freelance', 'delivered', 'desktop shortcut', 'desktop application']],
  ['Ecommerce Application', ['freelance', 'demo', 'not a live store', 'node.js']],
]
for (const [title, fragments] of dialogChecks) {
  const text = dialogTexts.find((entry) => entry.title === normalise(title))?.text
  if (!text) {
    problems.push(`no project detail view found for "${title}"`)
    continue
  }
  for (const fragment of fragments) {
    if (!text.includes(fragment)) problems.push(`project detail "${title}" does not mention "${fragment}"`)
  }
}

await browser.close()

const missingCount = Object.values(missing).reduce((sum, list) => sum + list.length, 0)
console.log(`CONTENT COVERAGE against the owner's specification (${BASE})`)
console.log(`  required items checked: ${checked}`)
console.log(`  process steps visited: ${tabCount} | project detail views opened: ${projectCount}`)
console.log(`  missing items: ${missingCount}`)
for (const [group, items] of Object.entries(missing)) {
  console.log(`  [${group}]`)
  for (const item of items) console.log(`    MISSING: ${item}`)
}
console.log(`  other problems: ${problems.length}`)
for (const problem of problems) console.log(`    PROBLEM: ${problem}`)
console.log(missingCount === 0 && problems.length === 0 ? 'RESULT: PASS' : 'RESULT: FAIL')
process.exit(missingCount === 0 && problems.length === 0 ? 0 : 1)
