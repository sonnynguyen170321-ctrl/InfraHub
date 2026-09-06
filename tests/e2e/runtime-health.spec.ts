import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';

const DIST_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../dist/client');

function publishedRoutes(directory = DIST_ROOT, relative = ''): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryRelative = path.join(relative, entry.name);
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) return publishedRoutes(entryPath, entryRelative);
    if (entry.name !== 'index.html') return [];

    const routeDirectory = path.dirname(entryRelative).replaceAll('\\', '/');
    return [routeDirectory === '.' ? '/' : `/${routeDirectory}`];
  });
}

test('every published page loads without browser errors or failed local resources', async ({ page }) => {
  test.setTimeout(120_000);

  const problems: string[] = [];
  let activeRoute = '/';

  page.on('pageerror', (error) => problems.push(`${activeRoute}: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') problems.push(`${activeRoute}: console: ${message.text()}`);
  });
  page.on('requestfailed', (request) => {
    const failure = request.failure()?.errorText ?? 'unknown request failure';
    if (failure !== 'net::ERR_ABORTED') {
      problems.push(`${activeRoute}: ${request.url()} (${failure})`);
    }
  });
  page.on('response', (response) => {
    const responseUrl = new URL(response.url());
    if (responseUrl.origin === new URL(page.url()).origin && response.status() >= 400) {
      problems.push(`${activeRoute}: ${responseUrl.pathname} returned ${response.status()}`);
    }
  });

  const routes = publishedRoutes().sort();
  expect(routes.length).toBeGreaterThan(40);

  for (const route of routes) {
    activeRoute = route;
    const response = await page.goto(route, { waitUntil: 'load' });

    expect(response?.status(), `${route} should return a successful document`).toBeLessThan(400);
    await expect(page.locator('main'), `${route} should render its main content`).toBeVisible();
    await page.evaluate(() => new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    }));
  }

  expect(problems, problems.join('\n')).toEqual([]);
});
