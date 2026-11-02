# Spec 001: LabForge landing page

LabForge (fictional) gives trainers ready-to-run cloud lab environments for their courses.

## Acceptance criteria
- **AC-1.1** The home page has exactly one `h1` that says what LabForge does in plain words.
- **AC-1.2** The hero has a primary call to action, "Book a demo", that scrolls to the demo form (`#demo`).
- **AC-1.3** A features section lists exactly 3 features, each with a heading and one sentence.
- **AC-1.4** The FAQ uses native `<details>` elements, so answers expand with the keyboard (Enter/Space) and
  without JavaScript; the page has `FAQPage` JSON-LD whose questions match the visible ones.
- **AC-1.5** A "Popular labs" section links to every lab page, and each link resolves.
- **AC-1.6** At a 375 px wide viewport there is no horizontal scrolling.
