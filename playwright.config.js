import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: 'http://localhost:4321' },
  webServer: { command: 'npx astro preview --port 4321 --host 127.0.0.1', url: 'http://127.0.0.1:4321', reuseExistingServer: true },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
