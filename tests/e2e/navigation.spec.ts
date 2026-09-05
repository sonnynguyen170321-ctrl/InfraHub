import { test, expect } from '@playwright/test';

// Desktop navigation. The header switches to the desktop layout at 1180px; the desktop project
// runs at 1440 so these are the real desktop affordances, not a CSS accident.

test.describe('desktop navigation', () => {
  test('mega menu opens on hover and reports its expanded state', async ({ page }) => {
    await page.goto('/');

    const item = page.locator('.nav-item.has-megamenu').first();
    const trigger = item.locator('.menu-trigger').first();
    const panel = item.locator('.megamenu-panel');

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await item.hover();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toBeVisible();
  });

  test('mega menu opens on keyboard focus and closes on Escape without losing focus', async ({ page }) => {
    await page.goto('/');

    const item = page.locator('.nav-item.has-megamenu').first();
    const trigger = item.locator('.menu-trigger').first();

    await trigger.focus();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();
  });

  test('the mega menu panel stays inside the viewport', async ({ page }) => {
    await page.goto('/');

    const item = page.locator('.nav-item.has-megamenu').first();
    await item.hover();

    const panel = item.locator('.megamenu-panel');
    const box = await panel.boundingBox();
    const viewport = page.viewportSize();

    expect(box).not.toBeNull();
    expect(viewport).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width);
  });

  test('the desktop nav is not rendered below its breakpoint', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');

    await expect(page.locator('.desktop-nav')).toBeHidden();
    await expect(page.locator('#mobile-toggle')).toBeVisible();
  });
});
