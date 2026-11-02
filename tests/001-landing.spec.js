import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => { await page.goto('/'); });

test('AC-1.1 exactly one h1 that says what LabForge does', async ({ page }) => {
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toContainText('cloud labs');
});

test('AC-1.2 the hero call to action takes you to the demo form', async ({ page }) => {
  await page.locator('main a.btn', { hasText: 'Book a demo' }).first().click();
  await expect(page).toHaveURL(/#demo$/);
  await expect(page.locator('#demo-form')).toBeInViewport();
});

test('AC-1.3 three features, each with a heading and a sentence', async ({ page }) => {
  const cards = page.getByTestId('features').locator('article');
  await expect(cards).toHaveCount(3);
  for (const card of await cards.all()) {
    await expect(card.locator('h3')).not.toBeEmpty();
    await expect(card.locator('p')).toHaveText(/\.$/);
  }
});

test('AC-1.4 FAQ opens with the keyboard and matches its FAQPage JSON-LD', async ({ page }) => {
  const first = page.locator('details').first();
  await first.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(first).toHaveAttribute('open', '');
  const visible = await page.locator('details summary').allInnerTexts();
  const ld = await page.locator('script[type="application/ld+json"]').allInnerTexts();
  const faq = ld.map((t) => JSON.parse(t)).find((d) => d['@type'] === 'FAQPage');
  expect(faq.mainEntity.map((q) => q.name)).toEqual(visible.map((t) => t.trim()));
});

test('AC-1.5 every popular-lab link resolves to its lab page', async ({ page, request }) => {
  const hrefs = await page.getByTestId('lab-links').locator('a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  expect(hrefs).toHaveLength(3);
  for (const href of hrefs) expect((await request.get(href)).status()).toBe(200);
});

test('AC-1.6 no horizontal scrolling at 375 px', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
