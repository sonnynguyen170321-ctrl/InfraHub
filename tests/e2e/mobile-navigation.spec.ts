import { test, expect } from '@playwright/test';

// Runs in the mobile project (390x844). These assertions are about focus, not appearance:
// a drawer that opens while focus stays behind it is unusable with a keyboard or screen reader.

test.describe('mobile drawer', () => {
  test('opens, moves focus inside, and reports state', async ({ page }) => {
    await page.goto('/');

    const toggle = page.locator('#mobile-toggle');
    const drawer = page.locator('#mobile-drawer');

    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(drawer).toHaveAttribute('aria-hidden', 'true');

    await toggle.click();

    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(drawer).toHaveAttribute('aria-hidden', 'false');

    const focusedInsideDrawer = await page.evaluate(() => {
      const drawerEl = document.getElementById('mobile-drawer');
      return Boolean(drawerEl && document.activeElement && drawerEl.contains(document.activeElement));
    });
    expect(focusedInsideDrawer).toBe(true);
  });

  test('Escape closes the drawer and returns focus to the toggle', async ({ page }) => {
    await page.goto('/');

    const toggle = page.locator('#mobile-toggle');
    const drawer = page.locator('#mobile-drawer');

    await toggle.click();
    await expect(drawer).toHaveAttribute('aria-hidden', 'false');

    await page.keyboard.press('Escape');

    await expect(drawer).toHaveAttribute('aria-hidden', 'true');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();
  });

  test('toggling closed with the button also restores focus', async ({ page }) => {
    await page.goto('/');

    const toggle = page.locator('#mobile-toggle');
    await toggle.click();
    await toggle.click();

    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();
  });

  test('body scroll is locked only while the drawer is open', async ({ page }) => {
    await page.goto('/');

    const overflow = () => page.evaluate(() => document.body.style.overflow);
    const toggle = page.locator('#mobile-toggle');

    expect(await overflow()).toBe('');
    await toggle.click();
    expect(await overflow()).toBe('hidden');
    await page.keyboard.press('Escape');
    expect(await overflow()).toBe('');
  });
});

test.describe('responsive layout', () => {
  const widths = [320, 375, 390, 430, 768, 1024];

  for (const width of widths) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow, `page scrolls horizontally at ${width}px`).toBeLessThanOrEqual(1);
    });
  }
});
