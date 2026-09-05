import { test, expect } from '@playwright/test';

// The route diversity explorer lives on /wavelengths. It is an illustrative schematic: the
// tests check that it behaves, and that it has not regained the fabricated metrics that were
// removed from it.

test.describe('route diversity explorer', () => {
  test('perspective toggle switches the schematic and reports pressed state', async ({ page }) => {
    await page.goto('/wavelengths');

    const logical = page.locator('[data-view="logical"]');
    const physical = page.locator('[data-view="physical"]');

    await expect(logical).toHaveAttribute('aria-pressed', 'true');
    await expect(physical).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('#svgPhysical')).toHaveAttribute('aria-hidden', 'true');

    await physical.click();

    await expect(physical).toHaveAttribute('aria-pressed', 'true');
    await expect(logical).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('#svgPhysical')).toHaveAttribute('aria-hidden', 'false');
    await expect(page.locator('#svgLogical')).toHaveAttribute('aria-hidden', 'true');

    await logical.click();
    await expect(logical).toHaveAttribute('aria-pressed', 'true');
  });

  test('the toggle is operable from the keyboard', async ({ page }) => {
    await page.goto('/wavelengths');

    const physical = page.locator('[data-view="physical"]');
    await physical.focus();
    await page.keyboard.press('Enter');

    await expect(physical).toHaveAttribute('aria-pressed', 'true');
  });

  test('the schematic claims nothing it cannot evidence', async ({ page }) => {
    await page.goto('/wavelengths');

    const explorer = await page.locator('#route-explorer').innerText();
    const text = explorer.toLowerCase();

    for (const banned of ['100%', '0m', 'zero-man-hole', 'zero man hole', 'verified route']) {
      expect(text, `route explorer must not claim "${banned}"`).not.toContain(banned);
    }

    // It must say what it is instead.
    expect(text).toContain('illustrative');
  });

  test('does not claim a 3D or WebGL rendering it does not have', async ({ page }) => {
    await page.goto('/wavelengths');

    const html = await page.content();
    expect(html.toLowerCase()).not.toContain('three.js');
    expect(html.toLowerCase()).not.toContain('webgl');
  });

  test('respects reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    // The partner ribbon is the one continuously animating element on the site.
    const animation = await page
      .locator('.marquee-track')
      .first()
      .evaluate((el) => getComputedStyle(el).animationName);

    expect(animation === 'none' || animation === '').toBe(true);
  });
});

test.describe('route diversity states', () => {
  test('scrolling moves through all four states', async ({ page }) => {
    await page.goto('/');

    const scene = await page.evaluate(() => {
      const el = document.getElementById('routeScene');
      const sticky = el?.querySelector('.route-sticky') as HTMLElement | null;
      if (!el || !sticky) return null;
      return {
        top: el.getBoundingClientRect().top + window.scrollY,
        travel: el.offsetHeight - sticky.offsetHeight
      };
    });

    expect(scene).not.toBeNull();

    const seen: string[] = [];
    for (const fraction of [0.05, 0.35, 0.6, 0.9]) {
      await page.evaluate(
        ({ top, travel, fraction }) => window.scrollTo(0, Math.round(top + travel * fraction)),
        { ...scene!, fraction }
      );
      await page.waitForTimeout(220);
      seen.push((await page.locator('#route-explorer').getAttribute('data-state')) || '');
    }

    expect(seen).toEqual(['1', '2', '3', '4']);
  });

  test('the shared segment and its risk points only appear in the physical view', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#svgLogical')).toHaveAttribute('aria-hidden', 'false');
    await expect(page.locator('#svgPhysical .route-shared')).toBeHidden();

    await page.locator('[data-view="physical"]').click();
    await page.waitForTimeout(250);

    await expect(page.locator('#svgPhysical')).toHaveAttribute('aria-hidden', 'false');
    await expect(page.locator('#svgPhysical .route-shared')).toBeVisible();
  });

  test('every convergence point named on the model is also written in the document', async ({ page }) => {
    await page.goto('/');

    const listed = (await page.locator('.route-verify').innerText()).toLowerCase();
    for (const point of [
      'building entry',
      'local duct',
      'bridge or rail crossing',
      'carrier facility',
      'meet-me room',
      'long-haul segment'
    ]) {
      expect(listed, `"${point}" must exist as text, not only on the model`).toContain(point);
    }
  });

  test('the exhibit needs no canvas', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#route-explorer canvas')).toHaveCount(0);
    await expect(page.locator('#route-explorer svg')).not.toHaveCount(0);
  });
});
