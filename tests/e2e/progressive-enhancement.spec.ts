import { test, expect } from '@playwright/test';

// The homepage is a document first. With JavaScript disabled it loses dynamic transitions, not its
// content: every chapter still communicates its value.
test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('every chapter still renders its content', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    // Act 1: Hero
    await expect(page.locator('main h1')).toContainText('Complex infrastructure');

    // Act 1: Partner Ecosystem Ribbon — all eight partners are in the document, not injected
    await expect(page.locator('.partner-trust-ribbon')).toBeVisible();
    const logos = await page.locator('.partner-trust-ribbon img').count();
    expect(logos).toBeGreaterThanOrEqual(8);

    // Act 2: Solution Selector — capabilities are readable in markup
    await expect(page.locator('#what-you-need')).toBeVisible();
    await expect(page.locator('.selector-panel.active')).toHaveCount(1);

    // Act 3: Convergence — InfraHub value proposition is rendered
    await expect(page.locator('#why-infrahub')).toBeVisible();

    // Act 4: Route Diversity Explorer — the exhibit's lesson exists as text
    const verify = (await page.locator('.route-verify').innerText()).toLowerCase();
    expect(verify).toContain('building entry');
    expect(verify).toContain('bridge or rail crossing');

    // Act 5: Start Requirement Desk
    await expect(page.locator('#start-requirement')).toBeVisible();
    await expect(page.locator('#start-requirement a[href^="/lets-talk"]').first()).toBeVisible();
  });

  test('the inquiry form is still submittable markup', async ({ page }) => {
    await page.goto('/lets-talk');

    await expect(page.locator('#inquiry-form')).toBeVisible();
    await expect(page.locator('#lookingFor')).toBeVisible();
    await expect(page.locator('#submit-btn')).toBeVisible();
  });
});

// Reduced motion is a first-class version of the page, not a broken one:
// no scroll-linked forced jumps, and every state reachable by clicking.
test.describe('reduced motion', () => {
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

  test('the solution disciplines still switch by click', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    await page.locator('.discipline-tab-btn').nth(3).click();
    await expect(page.locator('.discipline-tab-btn').nth(3)).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('.selector-panel.active')).toHaveCount(1);
  });
});
