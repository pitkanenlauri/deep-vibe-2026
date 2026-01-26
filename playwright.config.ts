import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4321/deep-vibe-2026',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'] },
    },
  ],
  webServer: {
    command: process.env.CI
      ? 'npx http-server dist-serve -p 4321 -c-1'
      : 'npm run preview',
    url: 'http://localhost:4321/deep-vibe-2026',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
