import { test, expect } from '@playwright/test';
import labs from '../src/data/labs.json' with { type: 'json' };

for (const lab of labs) {
  test.describe(lab.slug, () => {
    test.beforeEach(async ({ page }) => { await page.goto(`/labs/${lab.slug}/`); });

    test('AC-3.1 + AC-3.2 page exists with title, duration, level and skills', async ({ page }) => {
      await expect(page.locator('h1')).toHaveText(lab.title);
      await expect(page.getByTestId('duration')).toHaveText(lab.duration);
      await expect(page.getByTestId('level')).toHaveText(lab.level);
      await expect(page.getByTestId('skills').locator('li')).toHaveText(lab.skills);
    });

    test('AC-3.3 Course JSON-LD names LabForge as provider', async ({ page }) => {
      const ld = (await page.locator('script[type="application/ld+json"]').allInnerTexts()).map((t) => JSON.parse(t));
      const course = ld.find((d) => d['@type'] === 'Course');
      expect(course.name).toBe(lab.title);
      expect(course.provider.name).toBe('LabForge');
    });

    test('AC-3.4 links back home and to the demo form', async ({ page }) => {
      await page.getByRole('link', { name: '← All labs' }).click();
      await expect(page.locator('h1')).toContainText('cloud labs');
      await page.goBack();
      await page.getByRole('link', { name: 'Book a demo' }).last().click();
      await expect(page).toHaveURL(/\/#demo$/);
    });
  });
}
