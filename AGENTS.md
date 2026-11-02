# AGENTS.md: rules for coding agents working on this repo

This file is read by Claude Code (and any other agent) before it touches the repo. Every rule here was added
because an agent got it wrong once; see `REVIEW-LOG.md` for the history.

## How work arrives
- Every change starts from a spec in `specs/NNN-name.md` with numbered acceptance criteria (AC-1, AC-2…).
- Each acceptance criterion gets at least one Playwright test whose title starts with its id, e.g.
  `test('AC-2.3 rejects a personal email', …)`. A criterion without a test is not done.
- Don't change a spec to make a test pass. If the spec is wrong, say so in the PR description.

## Brand voice (LabForge)
- Plain, specific, confident. Say what the product does for the learner or the trainer; no "revolutionise",
  "seamless", "cutting-edge", "unlock", "empower" or "next-generation". `scripts/seo-check.mjs` fails the build
  on those words.
- Sentence case for headings. Numbers as digits.

## Design tokens
- Use the CSS variables in `src/layouts/Base.astro` (`--ink`, `--muted`, `--accent`, `--surface`, `--line`).
  No raw hex colours in components.
- Every interactive element needs a visible focus style and a text label.

## Technical SEO (enforced by `npm run seo`)
- One `<h1>` per page. Unique `<title>` (≤ 60 chars) and meta description (70–160 chars) per page.
- Canonical URL, Open Graph title/description/url on every page.
- Structured data as JSON-LD that parses: `Organization` on the home page, `FAQPage` where there's an FAQ,
  `Course` on each lab page.
- Every page appears in `sitemap.xml`; `robots.txt` points to it. Every `<img>` has `alt`. No broken internal links.

## Tests that prove something
- Assert the behaviour the spec describes, not that an element exists. "The success message appears and the
  form is cleared" proves something; "the button is visible" usually doesn't.
- For forms, test the invalid paths first.
- Don't use `waitForTimeout`. Wait for the state you expect.

## Before opening a PR
`npm run check` (build + SEO check + Playwright) must pass locally. Write a short PR description: what changed,
which ACs it covers, and anything you're unsure about.
