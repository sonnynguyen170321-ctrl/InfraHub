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

/** Scrolls to a fraction of the way through a scene's own travel. */
async function scrollThroughScene(page: Page, selector: string, fraction: number) {
  await page.evaluate(
    ({ selector, fraction }) => {
      const el = document.querySelector(selector) as HTMLElement;
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: Math.round(top + el.offsetHeight * fraction), behavior: 'instant' as ScrollBehavior });
    },
    { selector, fraction }
  );
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

  test('a pinned scene and the controller report the same progress', async ({ page }) => {
    await page.goto('/');
    await sceneApi(page);

    await scrollThroughScene(page, '#discovery-stage', 0.5);
    await page.waitForTimeout(300);

    // The pinned element is #discoveryScene inside the #discovery-stage section. The controller
    // holds the section, because that is where the handoff variables belong, but progress comes
    // from the scene's own registered source — measuring the section here instead would be a
    // third estimate of the same thing, which is the class of bug this suite exists to catch.
    const { controller, scene } = await page.evaluate(() => {
      const el = document.getElementById('discoveryScene') as HTMLElement;
      const sticky = el.querySelector('.discovery-sticky') as HTMLElement | null;
      const travel = el.offsetHeight - (sticky ? sticky.offsetHeight : 0);
      const sceneTop = el.getBoundingClientRect().top + window.scrollY;
      return {
        controller: (window as any).__infrahubScenes.sceneProgress('discovery'),
        scene: Math.min(Math.max((window.scrollY - sceneTop) / travel, 0), 1),
      };
    });

    // Same coordinate system, not two estimates of the same thing.
    expect(Math.abs(controller - scene)).toBeLessThan(0.02);
  });

  test('discovery progress is continuous, not five steps', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await sceneApi(page);

    const widths = new Set<string>();
    for (let i = 0; i <= 14; i++) {
      await scrollThroughScene(page, '#discovery-stage', i / 16);
      await page.waitForTimeout(120);
      widths.add(await page.locator('#discoveryProgressBar').evaluate((el) => (el as HTMLElement).style.transform));
    }

    // A bar driven from the active discipline can only ever show five values.
    expect(widths.size, `distinct widths: ${[...widths].join(', ')}`).toBeGreaterThan(5);
  });

  test('choosing a discipline updates the rail at widths where the scene does not pin', async ({ page }) => {
    // Between 980 and 1179px the progress rail is visible but the scene does not pin, so a tab
    // click causes no scroll and therefore no scheduler frame. The bar has to be written by the
    // activation itself or it holds the previous discipline's value until something unrelated
    // happens to repaint it.
    await page.setViewportSize({ width: 1100, height: 900 });
    await page.goto('/');
    await page.waitForTimeout(500);

    const rail = page.locator('#discoveryProgressBar');
    await expect(page.locator('.discovery-progress-rail')).toBeVisible();

    const tabs = page.locator('.discipline-tab-btn');
    await tabs.nth(0).click();
    await page.waitForTimeout(200);
    const first = await rail.evaluate((el) => (el as HTMLElement).style.transform);

    await tabs.nth(3).click();
    await page.waitForTimeout(200);
    const fourth = await rail.evaluate((el) => (el as HTMLElement).style.transform);

    expect(fourth).not.toBe(first);
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
