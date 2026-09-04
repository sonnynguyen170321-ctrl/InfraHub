import { test, expect } from '@playwright/test';

test.describe('solution discovery tabs', () => {
  test('the first discipline is selected and its panel is the only one shown', async ({ page }) => {
    await page.goto('/');

    const tabs = page.locator('#solutionDiscovery .discipline-tab-btn');
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');

    const visiblePanels = page.locator('#solutionDiscovery .services-panel:not([hidden])');
    await expect(visiblePanels).toHaveCount(1);
  });

  test('clicking a discipline swaps the panel and the visual', async ({ page }) => {
    await page.goto('/');

    const secondTab = page.locator('#solutionDiscovery .discipline-tab-btn').nth(1);
    const target = await secondTab.getAttribute('data-target');

    await secondTab.click();

    await expect(secondTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator(`#panel-${target}`)).toBeVisible();
    await expect(page.locator(`#visual-${target}`)).toHaveAttribute('aria-hidden', 'false');
    await expect(page.locator('#solutionDiscovery .services-panel:not([hidden])')).toHaveCount(1);
  });

  test('arrow keys move between disciplines and activate them', async ({ page }) => {
    await page.goto('/');

    const tabs = page.locator('#solutionDiscovery .discipline-tab-btn');
    const count = await tabs.count();
    expect(count).toBeGreaterThan(2);

    await tabs.first().focus();
    await page.keyboard.press('ArrowDown');

    await expect(tabs.nth(1)).toBeFocused();
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('ArrowUp');
    await expect(tabs.first()).toBeFocused();
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('End');
    await expect(tabs.nth(count - 1)).toBeFocused();

    await page.keyboard.press('Home');
    await expect(tabs.first()).toBeFocused();
  });

  test('wrapping past the last discipline returns to the first', async ({ page }) => {
    await page.goto('/');

    const tabs = page.locator('#solutionDiscovery .discipline-tab-btn');
    const count = await tabs.count();

    await tabs.nth(count - 1).focus();
    await page.keyboard.press('ArrowDown');

    await expect(tabs.first()).toBeFocused();
  });
});
