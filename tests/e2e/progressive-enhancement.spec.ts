import { test, expect } from '@playwright/test';

// The homepage is a document first. With JavaScript disabled it loses its scenes, not its
// content: every chapter still has to say what it says.
test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('every chapter still renders its content', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    // 01 Arrival
    await expect(page.locator('main h1')).toContainText('The right infrastructure');

    // 02 Ecosystem — all eight partners are in the document, not injected
    await expect(page.locator('.partner-trust-ribbon')).toBeVisible();
    const logos = await page.locator('.partner-trust-ribbon img').count();
    expect(logos).toBeGreaterThanOrEqual(8);

    // 03 Discovery — the first discipline and its routes are readable
    await expect(page.locator('#solutionDiscovery')).toBeVisible();
    await expect(page.locator('#solutionDiscovery .services-panel:not([hidden])')).toHaveCount(1);

    // 04 Judgment — all four steps present
    for (const step of ['understand', 'match', 'introduce', 'deliver']) {
      await expect(page.locator(`#step-${step}`)).toBeVisible();
    }

    // 05 Reality — the exhibit's lesson exists as text
    const verify = (await page.locator('.route-verify').innerText()).toLowerCase();
    expect(verify).toContain('building entry');
    expect(verify).toContain('bridge or rail crossing');

    // 06 Market, 07 Practice, 08 Conversation
    await expect(page.locator('#featured-offers')).toBeVisible();
    await expect(page.locator('#who-we-help')).toBeVisible();
    await expect(page.locator('#contact')).toBeVisible();
    await expect(page.locator('#contact a[href="/lets-talk"]').first()).toBeVisible();
  });

  test('the inquiry form is still submittable markup', async ({ page }) => {
    await page.goto('/lets-talk');

    await expect(page.locator('#inquiry-form')).toBeVisible();
    await expect(page.locator('#lookingFor')).toBeVisible();
    await expect(page.locator('#submit-btn')).toBeVisible();
  });
});

// Reduced motion is a first-class version of the page, not a broken one: no pinning, no
// scroll-linked movement, and every state reachable by clicking.
test.describe('reduced motion', () => {
  test('no scene pins and the page reads top to bottom', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    for (const selector of ['.discovery-sticky', '.route-sticky']) {
      const position = await page.locator(selector).evaluate((el) => getComputedStyle(el).position);
      expect(position, `${selector} must not pin under reduced motion`).toBe('static');
    }
  });

  test('the partner marquee does not run', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const animation = await page
      .locator('.marquee-track')
      .first()
      .evaluate((el) => getComputedStyle(el).animationName);

    expect(animation === 'none' || animation === '').toBe(true);
  });

  test('the route exhibit still switches views by click', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    await page.locator('[data-view="physical"]').click();
    await expect(page.locator('#route-explorer')).toHaveAttribute('data-route-view', 'physical');
    await expect(page.locator('#svgPhysical')).toHaveAttribute('aria-hidden', 'false');

    await page.locator('[data-view="logical"]').click();
    await expect(page.locator('#route-explorer')).toHaveAttribute('data-route-view', 'logical');
  });

  test('the discovery disciplines still switch by click', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    await page.locator('.discipline-tab-btn').nth(3).click();
    await expect(page.locator('.discipline-tab-btn').nth(3)).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#solutionDiscovery .services-panel:not([hidden])')).toHaveCount(1);
  });
});
