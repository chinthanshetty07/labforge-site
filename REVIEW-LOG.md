# Review log

What I checked in the agent's work, what was wrong, and which rule in `AGENTS.md` it led to. Kept short and
honest: if a run passed first time, the entry says so.

| # | What happened | Fix | Rule it became |
|---|---|---|---|
| 1 | The first version of the SEO checker had only ever been run on the finished site, where it passed. A checker that has never failed proves nothing. | Added `scripts/seo-check.test.mjs`: one good page that must pass, two broken pages (two `h1`s, banned words, a missing sitemap entry, a 9-character description, JSON-LD that doesn't parse, a broken link) that must fail with the right messages. | "Tests that prove something": test the failure path. |
| 2 | `node --test scripts/` treated `scripts/seo-check.mjs` itself as a test file, ran it with no arguments and reported a failure that had nothing to do with the tests. | The npm script names the test file explicitly. | Point test runners at test files, not folders that also hold tools. |
| 3 | Writing the dynamic route `src/pages/labs/[slug].astro` from a zsh shell failed silently the first time ("no matches found"): zsh treats `[slug]` as a glob. | Quote paths with brackets. | Noted in "How work arrives": check the file exists before running the build. |
| 4 | Review, not a bug: the form originally re-validated on every keystroke, which shows "Enter a valid email address" while someone is still typing. | Errors only re-check once a field has already been marked invalid, so they clear as soon as it's fixed (AC-2.5) but don't appear early. | — |
| 5 | Review, not a bug: AC-2.3's personal-email check needed to be case-insensitive (`Asha@Gmail.com`). The test uses a capitalised domain on purpose. | Domain lower-cased before the check. | — |

The Playwright suite (21 tests) and the SEO check passed on their first full run after the spec-to-test mapping
was written. That's recorded here rather than implied otherwise.
