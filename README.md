# LabForge site: an agent-built marketing site, spec to tests

[![CI](https://github.com/chinthanshetty07/labforge-site/actions/workflows/ci.yml/badge.svg)](https://github.com/chinthanshetty07/labforge-site/actions/workflows/ci.yml)

**Live site: https://chinthanshetty07.github.io/labforge-site/**

A small Astro marketing site for a fictional hands-on cloud-labs product, built the way an AI-native team works:
**write the spec, let the agent implement it, review what it produced, and prove it with tests**. The site is
deliberately simple. The point is the workflow around it.

Built as an independent project after applying to Spektra Systems' AI-Native Software Engineer – Trainee role.
It is not affiliated with Spektra Systems or CloudLabs, and "LabForge" is a made-up product.

## How it was built

| Step | Where |
|---|---|
| House rules the agent reads first: brand voice, design tokens, SEO rules, what a "real" test is | [`AGENTS.md`](AGENTS.md) |
| Three specs with numbered acceptance criteria | [`specs/`](specs) |
| One Playwright test per criterion, titled with its id (`AC-2.3 rejects a personal email domain`) | [`tests/`](tests) |
| A technical SEO and brand-voice checker that runs on every build | [`scripts/seo-check.mjs`](scripts/seo-check.mjs) |
| Tests proving the checker fails on broken pages | [`scripts/seo-check.test.mjs`](scripts/seo-check.test.mjs) |
| What I caught reviewing the agent's work, and the rule each one became | [`REVIEW-LOG.md`](REVIEW-LOG.md) |

Built with Claude Code. I wrote the specs and `AGENTS.md`, directed the implementation, and reviewed the output
through the tests and the checks below.

## What the tests prove

- **Landing page (AC-1.x):** one `h1`, the call to action really lands on the form, the FAQ opens with the keyboard
  and its `FAQPage` JSON-LD matches the visible questions, every lab link returns 200, and there's no horizontal
  scroll at 375 px.
- **Demo form (AC-2.x):** empty submit flags every field and focuses the first; `@gmail.com` (any case) is refused
  as a work email; success is announced via `role="status"` and clears the form; errors clear once fixed; and
  **no network request is sent**, because a static site has nowhere to send it.
- **Lab pages (AC-3.x):** generated from `src/data/labs.json`, each with `Course` JSON-LD and working links.

## Technical SEO checks (`npm run seo`)

One `h1` per page; unique titles (≤ 60 chars) and descriptions (70–160); canonical and Open Graph tags;
JSON-LD that parses and has the right type per page; every page in `sitemap.xml`; `robots.txt` pointing to it;
`alt` on every image; no broken internal links; and none of the banned marketing words from `AGENTS.md`.

## Run

```bash
npm install
npm run check        # build + SEO check + checker tests + 21 Playwright tests
npm run dev          # http://localhost:4321
```

## What I'd add next

- Lighthouse budgets for performance and accessibility in CI.
- A second brand sharing the same components, to show the design-system split.
- An `agents/skills/` folder with reusable prompts for "new lab page" and "new landing section".
