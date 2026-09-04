import { defineConfig, devices } from '@playwright/test';

// The site is desktop-first (1280px+) but must not break on a phone, so the suite runs a
// desktop project by default and a narrow project for the drawer and layout checks.
//
// Tests run against the real build output served by scripts/static-server.mjs, which mirrors
// Vercel's cleanUrls mapping. The inquiry API is a serverless function and is not part of that
// output; tests that need it mock the route, so no test depends on a live webhook.

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',

  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },

  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } }
    },
    {
      name: 'mobile',
      testMatch: /(mobile-navigation|responsive)\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } }
    }
  ],

  webServer: {
    command: 'node scripts/static-server.mjs',
    url: 'http://localhost:4321/',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000
  }
});
