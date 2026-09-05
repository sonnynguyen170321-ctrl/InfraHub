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

test.describe('logo optical sizing', () => {
  // FastNetMon's lockup puts a lightning bolt above and below its wordmark, so its name is only
  // 39% of the file's height where StormWall's is 98%. Sizing every logo to the same pixel
  // height therefore renders one brand at half the size of the others. These tests hold the
  // correction in place on the two surfaces where the logos sit side by side.
  test('the ribbon renders FastNetMon at a comparable optical size', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() =>
      document.querySelectorAll('.marquee-track').forEach((track) => {
        (track as HTMLElement).style.animation = 'none';
        (track as HTMLElement).style.transform = 'translate3d(0,0,0)';
      })
    );
    await page.waitForTimeout(200);

    const heights = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.primary-track .partner-logo-img'))
        .map((img) => ({
          name: (img.getAttribute('src') || '').split('/').pop() || '',
          height: Math.round(img.getBoundingClientRect().height)
        }))
        .filter((entry) => entry.height > 0)
    );

    const fastnetmon = heights.find((entry) => entry.name.startsWith('fastnetmon'));
    const others = heights.filter((entry) => !entry.name.startsWith('fastnetmon'));

    expect(fastnetmon, 'FastNetMon should be in the ribbon').toBeTruthy();
    const median = others.map((o) => o.height).sort((a, b) => a - b)[Math.floor(others.length / 2)];

    // Taller than the rest, because its wordmark occupies less of its canvas.
    expect(fastnetmon!.height).toBeGreaterThan(median);
    // But not so tall that it breaks the row rhythm.
    expect(fastnetmon!.height).toBeLessThanOrEqual(median * 1.8);
  });

  test('the catalogue applies the same correction', async ({ page }) => {
    await page.goto('/partners');

    const heights = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.ledger-partner-logo')).map((img) => ({
        name: (img.getAttribute('src') || '').split('/').pop() || '',
        height: Math.round(img.getBoundingClientRect().height)
      }))
    );

    const fastnetmon = heights.find((entry) => entry.name.startsWith('fastnetmon'));
    const others = heights.filter((entry) => !entry.name.startsWith('fastnetmon') && entry.height > 0);
    const median = others.map((o) => o.height).sort((a, b) => a - b)[Math.floor(others.length / 2)];

    expect(fastnetmon!.height).toBeGreaterThan(median);
  });

  test('no logo overflows its ribbon slot', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() =>
      document.querySelectorAll('.marquee-track').forEach((track) => {
        (track as HTMLElement).style.animation = 'none';
        (track as HTMLElement).style.transform = 'translate3d(0,0,0)';
      })
    );
    await page.waitForTimeout(200);

    const overflowing = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.primary-track .partner-item'))
        .map((slot) => {
          const img = slot.querySelector('img');
          if (!img) return null;
          const slotBox = slot.getBoundingClientRect();
          const imgBox = img.getBoundingClientRect();
          if (imgBox.height === 0) return null;
          return imgBox.height > slotBox.height + 1
            ? `${(img.getAttribute('src') || '').split('/').pop()} ${Math.round(imgBox.height)}px in ${Math.round(slotBox.height)}px slot`
            : null;
        })
        .filter(Boolean)
    );

    expect(overflowing).toEqual([]);
  });
});
