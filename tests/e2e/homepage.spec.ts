import { test, expect } from '@playwright/test';

test.describe('homepage', () => {
  test('renders the hero, the primary heading and the footer', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/InfraHub/);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('footer.site-footer')).toBeVisible();
  });

  test('skip link is the first tab stop and targets main content', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');

    const skipLink = page.locator('a.skip-link');
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toHaveAttribute('href', '#main-content');
    await expect(page.locator('#main-content')).toHaveCount(1);
  });

  test('partner ribbon shows the ecosystem without unapproved claims', async ({ page }) => {
    await page.goto('/');

    const ribbon = page.locator('.partner-trust-ribbon');
    await expect(ribbon).toBeVisible();
    await expect(ribbon.getByText('Our partner ecosystem')).toBeVisible();

    // The duplicated marquee track exists only to make the loop seamless; it must not be
    // announced twice.
    const duplicateTrack = ribbon.locator('.marquee-track[aria-hidden="true"]');
    await expect(duplicateTrack).toHaveCount(1);

    const body = (await page.locator('body').innerText()).toLowerCase();
    for (const banned of ['trusted by', 'strategic partner', 'official partner']) {
      expect(body).not.toContain(banned);
    }
  });

  test('every homepage link resolves to a real page', async ({ page, request }) => {
    await page.goto('/');

    const hrefs = await page.locator('a[href^="/"]').evaluateAll((links) =>
      Array.from(new Set(links.map((link) => link.getAttribute('href') || '')))
    );

    expect(hrefs.length).toBeGreaterThan(10);

    for (const href of hrefs) {
      const response = await request.get(href.split('#')[0] || '/');
      expect(response.status(), `${href} should not 404`).toBeLessThan(400);
    }
  });
});

test.describe('404', () => {
  test('unknown paths render the 404 page with onward routes', async ({ page }) => {
    const response = await page.goto('/this-path-does-not-exist');

    expect(response?.status()).toBe(404);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('a[href="/solutions/infrastructure"]').first()).toBeVisible();
  });
});
