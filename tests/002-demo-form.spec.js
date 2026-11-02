import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => { await page.goto('/#demo'); });
const submit = (page) => page.locator('#demo-form button[type=submit]').click();

async function fillValid(page) {
  await page.getByLabel('Name').fill('Asha Iyer');
  await page.getByLabel('Work email').fill('asha@trainingco.example');
  await page.getByLabel('Company').fill('TrainingCo');
  await page.getByLabel('Number of learners').selectOption('26–100');
}

test('AC-2.1 all four fields are present and labelled', async ({ page }) => {
  for (const label of ['Name', 'Work email', 'Company', 'Number of learners']) {
    await expect(page.getByLabel(label)).toBeVisible();
  }
});

test('AC-2.2 empty submit shows an error per field and focuses the first invalid one', async ({ page }) => {
  await submit(page);
  for (const id of ['name', 'email', 'company', 'learners']) {
    await expect(page.locator(`#${id}-error`)).toHaveText('This field is required');
    await expect(page.locator(`#${id}`)).toHaveAttribute('aria-invalid', 'true');
  }
  await expect(page.getByLabel('Name')).toBeFocused();
});

test('AC-2.3 rejects a personal email domain', async ({ page }) => {
  await fillValid(page);
  await page.getByLabel('Work email').fill('asha.iyer@Gmail.com');
  await submit(page);
  await expect(page.locator('#email-error')).toHaveText('Please use your work email');
  await expect(page.getByLabel('Work email')).toBeFocused();
  await expect(page.getByRole('status')).toBeEmpty();
});

test('AC-2.4 a valid submission confirms, is announced, and clears the form', async ({ page }) => {
  await fillValid(page);
  await submit(page);
  await expect(page.getByRole('status')).toHaveText("Thanks, we'll be in touch within 1 working day");
  await expect(page.getByLabel('Name')).toHaveValue('');
  await expect(page.getByLabel('Number of learners')).toHaveValue('');
});

test('AC-2.5 an error clears as soon as the field becomes valid', async ({ page }) => {
  await submit(page);
  await expect(page.locator('#company-error')).toBeVisible();
  await page.getByLabel('Company').fill('T');
  await expect(page.locator('#company-error')).toBeHidden();
  await expect(page.getByLabel('Company')).toHaveAttribute('aria-invalid', 'false');
});

test('AC-2.6 submitting sends no network request', async ({ page }) => {
  const requests = [];
  page.on('request', (r) => { if (r.method() !== 'GET') requests.push(r.url()); });
  await fillValid(page);
  await submit(page);
  await expect(page.getByRole('status')).not.toBeEmpty();
  expect(requests).toEqual([]);
});
