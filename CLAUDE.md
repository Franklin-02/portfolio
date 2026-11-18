# Working rules for this project

These rules were set by the site owner. They apply to every session and every helper agent.

## 1. Stay inside this folder

- Read, create, change and delete files **only inside this project folder**.
- Do not read, list, scan or modify anything outside it: no other folders, no user profile,
  no system Temp folder, no other drives.
- **No network access**: no `npm install` or `npm view`, no downloads, no web requests, no
  external services. Do not deploy, publish or push anything. The only address that may be
  requested is the local dev or preview server (`http://127.0.0.1:<port>`).
- Scratch files, screenshots and test output go in `qa/` inside the project. The QA scripts in
  `qa/tools` keep the headless browser's temporary data in `qa/tmp`; any new script that uses
  the browser must start with `import './local-env.mjs'`.
- If a task truly cannot be done without leaving the folder or using the network, stop and
  say so. Do not work around this rule.

## 2. Content honesty

- Never invent personal details, metrics, employers, clients, certifications, links,
  screenshots or completion claims. All facts come from the owner.
- The reported figures (30% test coverage, 50% defect turnaround, and so on) are
  resume-reported. Never describe them as verified or audited.
- Anything not supplied yet (resume PDF, article links, repository or demo links) gets a clear
  placeholder, never a fake.
- No skill-proficiency percentages. No client screenshots, logos or confidential details.

## 3. How the project is organised

- All site content lives in `src/data/*` and is typed in `src/types/content.ts`. Change
  content there, not in components.
- Colours and other design tokens are defined once in `src/styles/index.css`. Components use
  the semantic utilities (`bg-card`, `text-muted`, `border-line`, ...), never raw colours.
- Animated elements use `m` components (`import * as m from 'motion/react-m'`); `motion.*`
  throws because the app runs `LazyMotion` in strict mode.
- Icons come from `lucide-react` v1 (many names differ from older versions).

## 4. Machine limits

- Node.js 20.10: stay on Vite 6, ESLint 9 and TypeScript 6 until Node is upgraded.
- 8 GB of RAM: run one heavy command at a time (typecheck, lint, build, browser test).

## 5. Checks before calling work finished

```bash
npm run lint
npm run typecheck
npm run build
```

Then run the browser checks in `qa/tools` against `npm run preview` (see README).

## 6. Working style

- Finish the whole task without stopping to ask for permission between steps.
- Report plainly: what was done, what was verified, what is still open.
