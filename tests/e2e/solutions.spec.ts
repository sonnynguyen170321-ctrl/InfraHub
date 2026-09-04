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

test.describe('discovery scene progression', () => {
  test('scrolling through the pinned scene changes the discipline', async ({ page }) => {
    await page.goto('/');

    const bands = await page.evaluate(() => {
      const scene = document.getElementById('discoveryScene');
      const sticky = scene?.querySelector('.discovery-sticky') as HTMLElement | null;
      if (!scene || !sticky) return null;
      const travel = scene.offsetHeight - sticky.offsetHeight;
      return { top: scene.getBoundingClientRect().top + window.scrollY, travel };
    });

    expect(bands, 'the discovery scene should exist').not.toBeNull();
    expect(bands!.travel, 'the scene should be taller than its sticky child').toBeGreaterThan(200);

    const seen: string[] = [];
    for (const fraction of [0.05, 0.45, 0.95]) {
      await page.evaluate(
        ({ top, travel, fraction }) => window.scrollTo(0, Math.round(top + travel * fraction)),
        { ...bands!, fraction }
      );
      await page.waitForTimeout(200);
      seen.push(
        (await page.locator('.discipline-tab-btn.active').getAttribute('data-target')) || ''
      );
    }

    expect(new Set(seen).size, `scrolling should change discipline, saw ${seen.join(' -> ')}`).toBeGreaterThan(2);
    await expect(page.locator('#solutionDiscovery .services-panel:not([hidden])')).toHaveCount(1);
  });

  test('the routing line shows only the active discipline branches', async ({ page }) => {
    await page.goto('/');

    const activeSets = page.locator('.route-set.active');
    await expect(activeSets).toHaveCount(1);
    await expect(activeSets).toHaveAttribute('data-route-set', 'infrastructure');

    await page.locator('.discipline-tab-btn').nth(2).click();
    await expect(page.locator('.route-set.active')).toHaveAttribute('data-route-set', 'network');
  });

  test('the scene does not pin under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const position = await page
      .locator('.discovery-sticky')
      .evaluate((el) => getComputedStyle(el).position);

    expect(position).toBe('static');
  });
});
