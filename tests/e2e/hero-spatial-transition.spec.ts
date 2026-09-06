import { expect, test } from '@playwright/test';

test.describe('hero spatial transition', () => {
  test('uses only the enhanced canvas once it has initialized', async ({ page }) => {
    await page.goto('/');

    const hero = page.locator('#hero');
    const canvas = page.locator('#hero3dCanvas');
    const fallback = page.locator('.hero-spatial-fallback');

    await expect(canvas).toHaveCSS('opacity', '1', { timeout: 10_000 });

    await page.evaluate(() => {
      const heroElement = document.getElementById('hero');
      window.scrollTo(0, (heroElement?.offsetHeight ?? 1) * 0.75);
    });

    await expect.poll(async () => {
      return hero.evaluate((element) =>
        Number.parseFloat(element.style.getPropertyValue('--hero-progress') || '0')
      );
    }).toBeGreaterThan(0.7);

    await fallback.evaluate(async (element) => {
      await Promise.all(element.getAnimations().map((animation) => animation.finished));
    });

    await expect(fallback).toHaveCSS('opacity', '0');
  });

  test('keeps the SVG fallback when the canvas enhancement is unavailable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const hero = page.locator('#hero');
    const container = page.locator('#heroSpatialTransition');
    const canvas = page.locator('#hero3dCanvas');
    const fallback = page.locator('.hero-spatial-fallback');

    await expect(container).not.toHaveAttribute('data-enhanced', 'true');
    await expect(canvas).toHaveCSS('opacity', '0');

    await page.evaluate(() => {
      const heroElement = document.getElementById('hero');
      window.scrollTo(0, (heroElement?.offsetHeight ?? 1) * 0.75);
    });

    await expect.poll(async () => {
      return hero.evaluate((element) =>
        Number.parseFloat(element.style.getPropertyValue('--hero-progress') || '0')
      );
    }).toBeGreaterThan(0.7);

    await fallback.evaluate(async (element) => {
      await Promise.all(element.getAnimations().map((animation) => animation.finished));
    });

    await expect.poll(async () =>
      fallback.evaluate((element) => Number.parseFloat(getComputedStyle(element).opacity))
    ).toBeGreaterThan(0.7);
  });

  test('deactivates the desktop canvas when the viewport becomes narrow', async ({ page }) => {
    await page.goto('/');

    const container = page.locator('#heroSpatialTransition');
    const canvas = page.locator('#hero3dCanvas');

    await expect(container).toHaveAttribute('data-enhanced', 'true', { timeout: 10_000 });
    await expect(canvas).toHaveCSS('opacity', '1');

    await page.setViewportSize({ width: 390, height: 844 });

    await expect(container).not.toHaveAttribute('data-enhanced', 'true');
    await expect(canvas).toHaveCSS('opacity', '0');

    await page.setViewportSize({ width: 1440, height: 900 });

    await expect(container).toHaveAttribute('data-enhanced', 'true');
    await expect(canvas).toHaveCSS('opacity', '1');
  });

  test('responds when reduced-motion preference changes at runtime', async ({ page }) => {
    await page.goto('/');

    const container = page.locator('#heroSpatialTransition');
    const canvas = page.locator('#hero3dCanvas');
    const fallback = page.locator('.hero-spatial-fallback');

    await expect(container).toHaveAttribute('data-enhanced', 'true', { timeout: 10_000 });

    await page.emulateMedia({ reducedMotion: 'reduce' });

    await expect(container).not.toHaveAttribute('data-enhanced', 'true');
    await expect(canvas).toHaveCSS('opacity', '0');
    await expect(fallback).toHaveCSS('opacity', '1');

    await page.emulateMedia({ reducedMotion: 'no-preference' });

    await expect(container).toHaveAttribute('data-enhanced', 'true');
    await expect(canvas).toHaveCSS('opacity', '1');
  });
});
