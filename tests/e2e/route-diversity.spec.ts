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
  test('view toggle and scroll states advance correctly', async ({ page }) => {
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

    if (scene!.travel > 50) {
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
    } else {
      // In teaser mode: clicking physical toggle advances state
      await page.locator('[data-view="physical"]').click();
      await page.waitForTimeout(200);
      const state = await page.locator('#route-explorer').getAttribute('data-state');
      expect(['2', '3', '4']).toContain(state);
    }
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

  test('optical transmission pulses render along carrier paths in both views', async ({ page }) => {
    await page.goto('/');

    const logicalPulses = page.locator('#svgLogical .route-path-pulse');
    await expect(logicalPulses).toHaveCount(2);

    await page.locator('[data-view="physical"]').click();
    const physicalPulses = page.locator('#svgPhysical .route-path-pulse');
    await expect(physicalPulses).toHaveCount(3);
  });

  test('hotspot interaction updates the route-point explanation', async ({ page }) => {
    await page.goto('/wavelengths');

    const physical = page.locator('[data-view="physical"]');
    await physical.click();
    // aria-pressed is only set by the explorer script, so waiting on it keeps the hotspot
    // click below from landing before that script's listeners attach.
    await expect(physical).toHaveAttribute('aria-pressed', 'true');

    const bridgeItem = page.locator('.verify-item[data-risk-target="bridge-or-rail-crossing"]');
    await bridgeItem.click();

    const title = page.locator('#routePointName');
    const desc = page.locator('#routePointDesc');
    await expect(title).toContainText('Civil Bridge or Rail Crossing');
    await expect(desc).toContainText('River, highway, or railway barriers');
  });

  test('selected route point returns after closing the failure illustration', async ({ page }) => {
    await page.goto('/wavelengths');

    const physical = page.locator('[data-view="physical"]');
    await physical.click();
    await expect(physical).toHaveAttribute('aria-pressed', 'true');

    await page.locator('.verify-item[data-risk-target="bridge-or-rail-crossing"]').click();
    const pointName = page.locator('#routePointName');
    await expect(pointName).toContainText('Civil Bridge or Rail Crossing');

    const failureControl = page.locator('#btnSeverSim');
    await failureControl.click();
    await expect(pointName).toContainText('Shared civil crossing unavailable');

    await failureControl.click();
    await expect(pointName).toContainText('Civil Bridge or Rail Crossing');
  });

  test('shared-segment failure control explains the common-mode state', async ({ page }) => {
    await page.goto('/');

    const severBtn = page.locator('#btnSeverSim');
    await expect(severBtn).toBeVisible();

    await severBtn.click();
    await expect(severBtn).toHaveClass(/is-active/);
    await expect(severBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#route-explorer')).toHaveClass(/is-severed/);

    const statusTag = page.locator('#statusTag');
    await expect(statusTag).toContainText('Common-mode failure');

    const desc = page.locator('#routePointDesc');
    await expect(desc).toContainText('illustrative model');

    // Toggle back off
    await severBtn.click();
    await expect(severBtn).not.toHaveClass(/is-active/);
    await expect(page.locator('#route-explorer')).not.toHaveClass(/is-severed/);
  });
});

