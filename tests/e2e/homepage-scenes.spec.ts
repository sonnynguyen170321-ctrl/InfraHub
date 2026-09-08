import { test, expect, type Page } from '@playwright/test';

/**
 * The homepage runs one scene controller over eight chapters. Its failure mode is silent: a
 * selector that matches nothing simply means that chapter never participates, and the page
 * still looks fine on a still screenshot. The hero shipped that way — registered as
 * `.hero-chapter`, a class it has never had — so the first chapter of the page was absent from
 * the controller and nothing said so.
 */

const EXPECTED_SCENES = [
  'hero',
  'ecosystem',
  'discovery',
  'judgment',
  'routeReality',
  'market',
  'practice',
  'conversation',
];

async function sceneApi(page: Page) {
  await page.waitForFunction(() => Boolean((window as any).__infrahubScenes), null, { timeout: 5000 });
}

test.describe('homepage scene controller', () => {
  test('every expected scene resolves to an element', async ({ page }) => {
    await page.goto('/');
    await sceneApi(page);

    const missing = await page.evaluate(() => (window as any).__infrahubScenes.missingScenes());
    expect(missing, `unresolved scenes: ${missing.join(', ')}`).toEqual([]);
  });

  test('every scene reports a normalized progress', async ({ page }) => {
    await page.goto('/');
    await sceneApi(page);

    const hasOffers = (await page.locator('#featured-offers').count()) > 0;
    const activeScenes = EXPECTED_SCENES.filter((id) => id !== 'market' || hasOffers);

    const progresses = await page.evaluate(
      (ids: string[]) => ids.map((id) => ({ id, progress: (window as any).__infrahubScenes.sceneProgress(id) })),
      activeScenes
    );

    expect(progresses).toHaveLength(activeScenes.length);
    for (const entry of progresses) {
      expect(entry.progress, `${entry.id} progress`).toBeGreaterThanOrEqual(0);
      expect(entry.progress, `${entry.id} progress`).toBeLessThanOrEqual(1);
    }
  });

  test('the hero participates in the controller rather than being invisible to it', async ({ page }) => {
    await page.goto('/');
    await sceneApi(page);

    expect(await page.evaluate(() => (window as any).__infrahubScenes.sceneProgress('hero'))).toBe(0);

    const heroHeight = await page.locator('#hero').evaluate((el: HTMLElement) => el.offsetHeight);
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(heroHeight * 0.5));
    await page.waitForTimeout(250);

    const progress = await page.evaluate(() => (window as any).__infrahubScenes.sceneProgress('hero'));
    expect(progress).toBeGreaterThan(0.35);
    expect(progress).toBeLessThanOrEqual(1);
  });

  test('choosing a solution discipline switches the active panel cleanly', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForTimeout(300);

    const selector = page.locator('#what-you-need');
    await expect(selector).toBeVisible();

    const computeTab = selector.locator('#tab-compute');
    await computeTab.click();
    await page.waitForTimeout(100);

    const computePanel = selector.locator('#panel-compute');
    await expect(computePanel).toHaveClass(/active/);
    await expect(computeTab).toHaveAttribute('aria-selected', 'true');
  });

  test('solution discipline tabs navigate via arrow keys', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForTimeout(300);

    const firstTab = page.locator('.discipline-tab-btn').first();
    await firstTab.focus();
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);

    const secondTab = page.locator('.discipline-tab-btn').nth(1);
    await expect(secondTab).toBeFocused();
    await expect(secondTab).toHaveAttribute('aria-selected', 'true');
  });

  test('the discipline tablist uses roving tabindex', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForTimeout(400);

    const state = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.discipline-tab-btn')).map((el) => ({
        selected: el.getAttribute('aria-selected'),
        tabindex: (el as HTMLElement).tabIndex,
      }))
    );

    expect(state.length).toBeGreaterThan(1);
    for (const tab of state) {
      // Exactly the selected tab is reachable with Tab; the rest are reached with arrow keys.
      expect(tab.tabindex).toBe(tab.selected === 'true' ? 0 : -1);
    }
    expect(state.filter((t) => t.tabindex === 0)).toHaveLength(1);
  });
});
