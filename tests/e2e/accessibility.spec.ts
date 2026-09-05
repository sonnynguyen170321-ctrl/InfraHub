import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

// Axe over the pages that carry the most machinery, including the states that are hidden on
// arrival. A scene that only appears after a click or a scroll is exactly where a contrast or
// aria mistake survives an audit.

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

async function violations(page: import('@playwright/test').Page) {
  const result = await new AxeBuilder({ page }).withTags(WCAG).analyze();
  return result.violations.map(
    (v) => `${v.id} (${v.impact}, ${v.nodes.length}): ${v.nodes[0]?.target?.join(' ')}`
  );
}

test.describe('accessibility', () => {
  for (const route of ['/', '/partners', '/partners/gcore', '/offers', '/lets-talk', '/wavelengths', '/about']) {
    test(`${route} has no WCAG A/AA violations`, async ({ page }) => {
      await page.goto(route);
      await page.waitForTimeout(400);
      expect(await violations(page)).toEqual([]);
    });
  }

  test('every discipline panel is clean, not just the first', async ({ page }) => {
    await page.goto('/');

    const tabs = page.locator('.discipline-tab-btn');
    const count = await tabs.count();

    for (let index = 0; index < count; index++) {
      await tabs.nth(index).click();
      await page.waitForTimeout(350);
      const found = await violations(page);
      expect(found, `discipline ${index + 1} of ${count}`).toEqual([]);
    }
  });

  test('the route exhibit is clean in both views', async ({ page }) => {
    await page.goto('/');

    await page.locator('[data-view="physical"]').click();
    await page.waitForTimeout(500);
    expect(await violations(page), 'physical view').toEqual([]);

    await page.locator('[data-view="logical"]').click();
    await page.waitForTimeout(500);
    expect(await violations(page), 'logical view').toEqual([]);
  });

  test('the inquiry form is clean in its error state', async ({ page }) => {
    await page.goto('/lets-talk');

    await page.locator('#submit-btn').click();
    await page.waitForTimeout(300);

    await expect(page.locator('#form-error-alert')).toBeVisible();
    expect(await violations(page), 'form with errors shown').toEqual([]);
  });

  test('the mobile drawer is clean while open', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await page.locator('#mobile-toggle').click();
    await page.waitForTimeout(300);

    expect(await violations(page), 'drawer open').toEqual([]);
  });
});
