import { test, expect } from '@playwright/test';

// The eight canonical partner records. Each one must have a live profile, a logo that actually
// loads, and decision guidance that came from the record rather than the template.
const CANONICAL_PARTNERS = [
  'fastnetmon',
  'gcore',
  'stormwall',
  'zenlayer',
  'ipxo',
  'vates',
  'itcare',
  'airframe'
];

test.describe('partner profiles', () => {
  for (const slug of CANONICAL_PARTNERS) {
    test(`/partners/${slug} renders its own decision layer`, async ({ page }) => {
      const response = await page.goto(`/partners/${slug}`);
      expect(response?.status()).toBe(200);

      await expect(page.locator('main h1')).toBeVisible();
      await expect(page.locator('.signature-architecture-section')).toBeVisible();
      await expect(page.locator('.buyer-decision-layer')).toBeVisible();

      // Four architecture steps come from the record; the fallback would also render four, so
      // assert on the record-specific title being present and non-generic.
      await expect(page.locator('.sig-step-card')).toHaveCount(4);
      const architectureTitle = await page.locator('.sig-title').innerText();
      expect(architectureTitle.trim().length).toBeGreaterThan(0);
      expect(architectureTitle).not.toContain('Technical Fit & Operating Model');
    });
  }

  test('the partner index links to every canonical profile', async ({ page }) => {
    await page.goto('/partners');

    for (const slug of CANONICAL_PARTNERS) {
      await expect(page.locator(`a[href="/partners/${slug}"]`).first()).toHaveCount(1);
    }
  });

  test('partner logos load rather than 404', async ({ page, request }) => {
    await page.goto('/partners');

    const sources = await page.locator('img').evaluateAll((images) =>
      Array.from(
        new Set(
          images
            .map((img) => img.getAttribute('src') || '')
            .filter((src) => src.startsWith('/images/partners/'))
        )
      )
    );

    expect(sources.length).toBeGreaterThan(0);

    for (const src of sources) {
      const response = await request.get(src);
      expect(response.status(), `${src} should load`).toBe(200);
      const body = await response.body();
      expect(body.byteLength, `${src} should not be empty`).toBeGreaterThan(0);
    }
  });
});
