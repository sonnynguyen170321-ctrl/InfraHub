import { test, expect } from '@playwright/test';

/**
 * First-load choreography is part of the hero's UX, not decoration. These tests keep the
 * sequence intentional across viewport classes and make sure reduced-motion users never wait
 * for hidden content.
 */

type EntryTiming = {
  line1: number;
  line2: number;
  body: number;
  actions: number;
  imageDuration: number;
};

async function timings(page: import('@playwright/test').Page): Promise<EntryTiming> {
  return page.evaluate(() => {
    const sec = (value: string) => {
      const first = value.split(',')[0].trim();
      if (first.endsWith('ms')) return parseFloat(first) / 1000;
      if (first.endsWith('s')) return parseFloat(first);
      return Number.NaN;
    };
    const delay = (selector: string) => sec(getComputedStyle(document.querySelector(selector) as Element).animationDelay);
    const image = getComputedStyle(document.querySelector('.hero-bg-img') as Element);
    return {
      line1: delay('.hero-line-1'),
      line2: delay('.hero-line-2'),
      body: delay('.hero-description'),
      actions: delay('.hero-actions'),
      imageDuration: sec(image.animationDuration),
    };
  });
}

test.describe('hero first-load choreography', () => {
  test('desktop reveals environment, proposition, explanation, then action', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const t = await timings(page);
    expect(t.line1).toBeGreaterThanOrEqual(0.3);
    expect(t.line2).toBeGreaterThan(t.line1);
    expect(t.body).toBeGreaterThan(t.line2);
    expect(t.actions).toBeGreaterThan(t.body);
    expect(t.actions).toBeLessThanOrEqual(1.2);
    expect(t.imageDuration).toBeGreaterThan(t.actions);
  });

  test('short laptop keeps the hierarchy without holding the CTA too long', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 650 });
    await page.goto('/');

    const t = await timings(page);
    expect(t.line2).toBeGreaterThan(t.line1);
    expect(t.body).toBeGreaterThan(t.line2);
    expect(t.actions).toBeGreaterThan(t.body);
    expect(t.actions).toBeLessThanOrEqual(0.95);
  });

  test('mobile preserves sequence with a tighter cadence', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const t = await timings(page);
    expect(t.line2).toBeGreaterThan(t.line1);
    expect(t.body).toBeGreaterThan(t.line2);
    expect(t.actions).toBeGreaterThan(t.body);
    expect(t.actions).toBeLessThanOrEqual(0.95);
    expect(t.imageDuration).toBeLessThanOrEqual(1.45);
  });

  test('reduced motion shows the complete message immediately', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    for (const selector of ['.hero-line-1', '.hero-line-2', '.hero-description', '.hero-actions']) {
      const state = await page.locator(selector).evaluate((el) => {
        const style = getComputedStyle(el);
        return {
          animationName: style.animationName,
          opacity: style.opacity,
          transform: style.transform,
        };
      });
      expect(state.animationName).toBe('none');
      expect(Number(state.opacity)).toBe(1);
      expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(state.transform);
    }
  });
});
