# Franklin Selvaraj M. — Professional Portfolio

Personal portfolio website for **Franklin Selvaraj M.**, Senior QA Tester / PMO
(Quality Assurance · Business Analysis · Project Management).

A fast, single-page site built with React, TypeScript, Vite and Tailwind CSS. All content
lives in plain data files, so it can be updated without touching the components.

---

## Contents

1. [Features](#features)
2. [Tech stack](#tech-stack)
3. [Getting started](#getting-started)
4. [Project structure](#project-structure)
5. [Updating the content](#updating-the-content)
6. [Resume download](#resume-download)
7. [Contact form](#contact-form)
8. [Environment variables](#environment-variables)
9. [SEO](#seo)
10. [Analytics (optional)](#analytics-optional)
11. [Design system and themes](#design-system-and-themes)
12. [Putting the code on GitHub](#putting-the-code-on-github)
13. [Deployment](#deployment)
14. [Quality checks](#quality-checks)
15. [Things you still need to supply](#things-you-still-need-to-supply)

---

## Features

- **Sections:** Hero with key statistics, About, Professional Experience (timeline), Technical
  Skills, Insurance Technology (with an original InsuranceSuite diagram), Business Analysis &
  PMO (interactive delivery process), Featured Projects, Key Achievements, Certifications &
  Education, LinkedIn content series, Contact.
- **Navigation:** fixed navigation bar with an active-section indicator, smooth scrolling, a
  mobile menu, and a scroll-to-top button.
- **Dark theme by default, with a light theme.** The choice is remembered on the device.
- **Project detail views** open in an accessible dialog and have shareable links
  (`/?project=<slug>`). The browser Back button closes them.
- **Contact form** with validation, loading / success / error states and spam protection.
  Works out of the box through the visitor's email app, and switches to a form service when
  one is configured.
- **Resume download** that turns on automatically when the PDF is added.
- **SEO:** page title and description, Open Graph and Twitter/X cards, structured data,
  `robots.txt`, `sitemap.xml`, canonical URL.
- **Accessible:** semantic HTML, keyboard support, visible focus, reduced-motion support.
- **Custom 404 page** served with a real 404 status by static hosts.
- **Honest by design:** no invented links, screenshots, metrics or completion badges.
  Anything not yet available shows a clear placeholder.

## Tech stack

| Area | Choice |
| --- | --- |
| UI | React 19, TypeScript 6 |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 (design tokens in `src/styles/index.css`) |
| Animation | Motion (`motion` package, loaded through `LazyMotion` to keep it small) |
| Icons | Lucide React |
| Fonts | Inter and Manrope, self-hosted (no requests to Google Fonts) |
| Linting | ESLint 9 with typescript-eslint and the React Hooks rules |

There is no router: the portfolio is one page, which keeps the JavaScript small and lets it
run on any static host without rewrite rules.

> **Why these versions?** The project was set up on **Node.js 20.10**. Vite 7+, ESLint 10 and
> some other current releases need Node 20.19 or newer, so the newest versions that run on
> Node 20.10 are used. `npm install` therefore prints an `EBADENGINE` warning for one
> ESLint helper package and a deprecation notice for ESLint 9; both are harmless. After
> upgrading Node to the current LTS you can move to the latest Vite and ESLint.

## Getting started

Requirements: **Node.js 20.10 or newer** and npm.

```bash
npm install        # install dependencies (first time only)
npm run dev        # start the development server at http://localhost:5173
```

Other commands:

| Command | What it does |
| --- | --- |
| `npm run build` | Type-checks the project and creates the production site in `dist/` |
| `npm run preview` | Serves the built `dist/` folder locally to check it before deploying |
| `npm run lint` | Runs ESLint |
| `npm run typecheck` | Runs the TypeScript compiler without building |

## Project structure

```text
index.html               Main page shell: SEO tags, structured data, theme bootstrap
404.html                 "Page not found" page shell
public/
  favicon/               FSM favicon (SVG and PNG sizes)
  images/                Social sharing image (og-image.png)
  resume/                Put the resume PDF here
  site.webmanifest
src/
  main.tsx               Entry for the portfolio
  not-found.tsx          Entry for the 404 page
  App.tsx                Page frame + home page
  AppProviders.tsx       Theme, animation and error-boundary providers
  config/site.ts         Settings read from environment variables
  data/                  ALL SITE CONTENT (edit these files to update the site)
  types/content.ts       TypeScript types for the content
  pages/                 Home (the section order) and NotFound
  components/
    layout/              Navbar, mobile menu, theme toggle, footer, scroll-to-top
    sections/            One component (plus helpers) per page section
    ui/                  Shared building blocks: Button, Card, Section, Tag, Icon ...
  hooks/                 Theme, active section, scroll state, project links ...
  utils/                 Class names, scrolling, contact form logic, analytics ...
  styles/                Design tokens (index.css) and font faces (fonts.css)
  dev/                   Development-only component preview (not in production builds)
build/vite-plugins.ts    Build-time SEO tags, robots.txt, sitemap.xml, font preloading
qa/tools/                Browser-based checks (functional, content coverage, accessibility)
qa/brand-assets/         Sources of the social sharing image and the PNG favicons
CLAUDE.md                Working rules for AI coding assistants on this project
```

## Updating the content

Everything the site says is in `src/data/`. Change the text there and the page updates;
no component needs to be edited.

| File | Controls |
| --- | --- |
| `profile.ts` | Name, designation, contact details, languages, hero text and statistics, About text and capability cards, Contact heading |
| `navigation.ts` | Navigation links and which section highlights which link |
| `experience.ts` | Company, role, and the project engagements with their responsibilities |
| `skills.ts` | Skill categories and skills |
| `insurance.ts` | Insurance technology products and the InsuranceSuite diagram labels |
| `delivery.ts` | Business Analysis & PMO areas and the delivery process steps |
| `projects.ts` | Featured projects |
| `achievements.ts` | Key achievement figures |
| `education.ts` | Certifications and education |
| `articles.ts` | LinkedIn content series |

### Add a project

Add an object to the `projects` array in `src/data/projects.ts` (copy an existing one).
The card and its detail view are generated automatically.

- `slug` must be unique and use only lowercase letters, digits and hyphens. It becomes the
  shareable link `/?project=<slug>`.
- `links.github` and `links.demo`: add them only when the real URLs exist. While they are
  missing, the site shows the `linksNote` text instead of a button.
- `status.tone` sets the badge colour: `professional`, `in-progress`, `concept` or `planned`.

### Link a LinkedIn post

In `src/data/articles.ts`, add `url: 'https://www.linkedin.com/posts/...'` to the article.
The "Read on LinkedIn" link appears only for articles that have a `url`.

### Use a new icon in content

Content refers to icons by a short key (for example `icon: 'shield-check'`). To make another
icon available, add its key to `IconName` in `src/types/content.ts` and map it to a Lucide icon
in `src/components/ui/Icon.tsx`.

## Resume download

The "Download Resume" buttons (navigation bar, hero, contact section and footer) are wired
to a PDF in `public/resume/`.

1. Save the resume as **`public/resume/Franklin-Selvaraj-M-Resume.pdf`**.
2. Restart `npm run dev`, or rebuild and redeploy.

That is all: the build detects the file and the buttons become real download links. Until
the file exists they show a "Resume · Coming soon" placeholder, so visitors are never offered
a broken download.

To use a different filename, set `VITE_RESUME_FILE` (see
[Environment variables](#environment-variables)) to the exact name of the file in
`public/resume/`.

## Contact form

The form validates the name, email, subject and message, shows inline errors, and has
loading, success and error states.

### Default: email app fallback (no setup)

With no form service configured, submitting the form opens the visitor's email app with the
message already filled in and addressed to the email in `src/data/profile.ts`. The site says
so clearly and never claims a message was "sent".

### Recommended: connect a form service

A form service delivers messages straight to your inbox without the visitor leaving the page.
Any service that accepts a JSON `POST` works. Set the endpoint and rebuild:

**Formspree**

1. Create a form at <https://formspree.io> and copy its endpoint.
2. Set `VITE_CONTACT_ENDPOINT=https://formspree.io/f/your-form-id`

**Web3Forms**

1. Get an access key at <https://web3forms.com>.
2. Set `VITE_CONTACT_ENDPOINT=https://api.web3forms.com/submit`
   and `VITE_CONTACT_ACCESS_KEY=your-access-key`
   (this key is designed to be public; it only identifies the destination inbox).

**Getform or your own backend**

Set `VITE_CONTACT_ENDPOINT` to the endpoint URL. The form sends
`{ "name", "email", "subject", "message" }` as JSON and treats any `2xx` response as success.

When a service is configured, two spam checks are active in the browser: a hidden "honeypot"
field and a minimum time before submission. Most services add their own filtering as well.

If sending fails (for example the visitor is offline), the form keeps the typed message and
offers the email app as a fallback.

## Environment variables

All variables are optional. Copy `.env.example` to `.env` for local development, or set them
in your hosting provider's dashboard and redeploy.

| Variable | Purpose | Example |
| --- | --- | --- |
| `VITE_SITE_URL` | Public address of the site, without a trailing slash. Enables the canonical URL, `og:url`, absolute social image URL and `sitemap.xml`. | `https://your-domain.com` |
| `VITE_BASE_PATH` | Only when the site is served from a sub-folder (GitHub Pages project sites). | `/portfolio/` |
| `VITE_RESUME_FILE` | Resume filename inside `public/resume/`. | `Franklin-Selvaraj-M-Resume.pdf` |
| `VITE_CONTACT_ENDPOINT` | Form service endpoint. Empty = email app fallback. | `https://formspree.io/f/abcdwxyz` |
| `VITE_CONTACT_ACCESS_KEY` | Public access key for services that need one (Web3Forms). | |
| `VITE_PLAUSIBLE_DOMAIN` | Enables Plausible Analytics for this domain. Empty = no analytics. | `your-domain.com` |
| `VITE_PLAUSIBLE_SRC` | Custom Plausible script URL (self-hosted or proxied). | |

> Every `VITE_*` value is embedded in the public JavaScript. **Never put a password or a
> private API key in these variables.** `.env` files are ignored by git.

## SEO

- **Title, description and keywords** are in `index.html`.
- **Open Graph and Twitter/X card** tags are in `index.html`; the social image is
  `public/images/og-image.png` (1200 × 630).
- **Structured data** (schema.org `Person`) is in `index.html`.
- **Canonical URL, `og:url`, the absolute image URL and `sitemap.xml`** need the real address
  of the site. Set `VITE_SITE_URL` and they are generated at build time. Without it the build
  prints a warning and leaves them out rather than publishing a wrong address.
- **`robots.txt`** is generated on every build.

After deploying, check how the link preview looks with the
[LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/).

No search ranking or performance score is claimed for this site: measure it after deployment
with Lighthouse or PageSpeed Insights.

## Analytics (optional)

The site ships with **no analytics** by default. To enable privacy-friendly, cookieless
[Plausible Analytics](https://plausible.io), set `VITE_PLAUSIBLE_DOMAIN` to the domain
registered in Plausible. The script loads only in production builds and is skipped for
visitors who have enabled "Do Not Track".

## Design system and themes

Colours, fonts, shadows and animations are defined once as design tokens in
`src/styles/index.css`. Components use semantic names (`bg-card`, `text-muted`,
`border-line`, `text-primary-soft`), never raw colour values, so both themes stay consistent.

| Token | Dark (default) | Used for |
| --- | --- | --- |
| `canvas` | `#080D18` | Page background |
| `surface` | `#101827` | Alternating section background |
| `card` | `#141F30` | Cards |
| `primary` | `#3B82F6` | Primary accent |
| `secondary` | `#8B5CF6` | Secondary accent |
| `highlight` | `#22D3EE` | Highlights |
| `ink` | `#F8FAFC` | Primary text |
| `muted` | `#94A3B8` | Secondary text |

To adjust a colour, change its value under `:root` (dark) or `[data-theme='light']` in that file.

## Putting the code on GitHub

1. Create an empty repository at <https://github.com/new> (do not add a README there).
2. In the project folder run:

```bash
git init
git add .
git commit -m "Initial commit: portfolio website"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repository>.git
git push -u origin main
```

`node_modules`, `dist` and `.env` files are already excluded by `.gitignore`.

## Deployment

The site is a static build (`npm run build` creates `dist/`). It has **not** been deployed
yet; pick one of the options below.

For every option, set `VITE_SITE_URL` to the final address so the SEO tags are complete, and
add the other variables you use (contact form, analytics).

### Option A — Vercel (recommended)

1. Push the code to GitHub.
2. At <https://vercel.com/new>, import the repository. Vercel detects Vite; the build command
   (`npm run build`) and output folder (`dist`) are also set in `vercel.json`.
3. Under **Environment Variables**, add `VITE_SITE_URL` (and any others).
4. Click **Deploy**. Every later push to `main` redeploys automatically.

### Option B — Netlify

1. Push the code to GitHub.
2. At <https://app.netlify.com/start>, import the repository. The build settings come from
   `netlify.toml`.
3. Under **Site configuration → Environment variables**, add `VITE_SITE_URL` (and any others).
4. Deploy.

### Option C — GitHub Pages

A ready-made workflow is included at `.github/workflows/deploy-github-pages.yml`.

1. Push the code to GitHub.
2. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Open the **Actions** tab, choose **Deploy to GitHub Pages**, and click **Run workflow**.

The workflow builds for `https://<username>.github.io/<repository>/` by default. For a
custom domain or a `<username>.github.io` repository, add two repository variables under
**Settings → Secrets and variables → Actions → Variables**: `VITE_BASE_PATH` = `/` and
`VITE_SITE_URL` = your address. Contact form and analytics variables can be added there too.

### After deploying

- Open the site on a phone and on a desktop browser.
- Visit a made-up address (for example `/does-not-exist`) to confirm the 404 page appears.
- Send yourself a message through the contact form.
- Check the link preview with the LinkedIn Post Inspector.

## Quality checks

```bash
npm run lint       # code quality
npm run typecheck  # TypeScript
npm run build      # production build
npm run preview    # open the built site locally
```

### Browser checks

The scripts in `qa/tools` drive a real browser (the Microsoft Edge already installed on
Windows) against the built site. They work entirely inside the project folder: nothing is
installed globally and the browser's temporary data goes to `qa/tmp`.

```bash
npm run build
npm run preview                                             # serves dist/ at http://localhost:4173

# in a second terminal
node qa/tools/qa.mjs --base http://localhost:4173/          # navigation, theme, menu, dialog, form, 404, overflow at 7 widths, keyboard
node qa/tools/coverage.mjs --base http://localhost:4173/    # every item from the content specification is on the page
node qa/tools/axe.mjs --url http://localhost:4173/          # accessibility audit (axe-core)
node qa/tools/shot.mjs --url http://localhost:4173/ --out qa/shots/home.png --width 390 --slices
```

| Script | What it verifies |
| --- | --- |
| `qa.mjs` | Page metadata, navigation and active indicator, hero actions, theme toggle, scroll-to-top, project dialog (open, close, Back, shared links), contact form validation and feedback, mobile menu (focus, Escape, scroll lock), 404 page, reduced motion, keyboard focus, and horizontal overflow at 360, 390, 768, 1024, 1280, 1440 and 1920 px in both themes |
| `coverage.mjs` | That every required item (skills, responsibilities, metrics, projects, education, contact details ...) appears on the rendered site, and that nothing forbidden does (invented links, proficiency bars, "verified" wording) |
| `axe.mjs` | WCAG 2.x A / AA rules through axe-core, for either theme and any width |
| `endpoint-test.mjs` | The contact form against a local mock form service (needs a build with `VITE_CONTACT_ENDPOINT=http://127.0.0.1:4599/submit`) |
| `resume-test.mjs` | The resume download links and the download itself (needs a build made while the PDF is in `public/resume/`) |
| `shot.mjs` | Screenshots plus console-error and overflow diagnostics |
| `render-assets.mjs` | Renders the brand images (see below) |

### Brand images

The social sharing image and the PNG favicons are rendered from the HTML sources in
`qa/brand-assets/`, using the site's own fonts. To change them (for example a new title on
the sharing image), edit the HTML and render again:

```bash
node qa/tools/render-assets.mjs --in qa/brand-assets/og-image.html --out public/images/og-image.png --size 1200x630 --opaque
```

The settings used for each favicon size are listed at the top of `qa/brand-assets/icon.html`.

The two libraries these scripts use (`playwright-core`, `axe-core`) live in
`qa/tools/node_modules`, which is not committed. After a fresh clone, run `npm install`
inside `qa/tools` once before using them.

Manual checklist before publishing changes: navigation links and active indicator, theme
toggle, mobile menu, project detail dialog (open, close, Back button, shared link), contact
form validation, email / phone / LinkedIn links, resume download, and the layout at 360, 390,
768, 1024, 1440 and 1920 pixels wide.

## Things you still need to supply

| Item | Where it goes |
| --- | --- |
| Resume PDF | `public/resume/Franklin-Selvaraj-M-Resume.pdf` |
| Final site address | `VITE_SITE_URL` in the hosting dashboard |
| Form service (optional) | `VITE_CONTACT_ENDPOINT` |
| LinkedIn post links | `url` on each article in `src/data/articles.ts` |
| Project repository / demo links | `links` on each project in `src/data/projects.ts` |
| Profile photo (optional) | Not used today; the hero shows an abstract graphic by design |

---

© Franklin Selvaraj M. All rights reserved. Guidewire, PolicyCenter, BillingCenter,
ClaimCenter, InsuranceSuite and InsuranceNow are trademarks of Guidewire Software, Inc.
This is an independent personal portfolio and is not affiliated with or endorsed by Guidewire.
