import { test, expect } from '@playwright/test';

test.describe('Phase 6: Final CTA & Inquiry Orchestration', () => {
  test('final CTA section renders the headline and technical inquiry routes', async ({ page }) => {
    await page.goto('/');

    const ctaSection = page.locator('#contact');
    await expect(ctaSection).toBeVisible();

    await expect(ctaSection.locator('.conversion-headline')).toContainText("Tell us what you're");
    const fastTrackGrid = ctaSection.locator('.fast-track-grid');
    await expect(fastTrackGrid).toBeVisible();
    await expect(fastTrackGrid.locator('.fast-track-chip')).toHaveCount(4);
  });

  test('fast-track connectivity chip pre-populates inquiry form on /lets-talk', async ({ page }) => {
    await page.goto('/');

    const connectivityChip = page.locator('.fast-track-chip[href*="service=connectivity"]');
    await expect(connectivityChip).toBeVisible();
    await connectivityChip.click();

    await expect(page).toHaveURL(/\/lets-talk\?service=connectivity/);
    await expect(page.locator('#lookingFor')).toHaveValue('connectivity');
    await expect(page.locator('#context-service')).toHaveValue('connectivity');

    const badge = page.locator('#context-badge-wrap');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('connectivity');
  });

  test('fast-track cloud chip pre-populates cloud scope on /lets-talk', async ({ page }) => {
    await page.goto('/');

    const cloudChip = page.locator('.fast-track-chip[href*="service=cloud"]');
    await expect(cloudChip).toBeVisible();
    await cloudChip.click();

    await expect(page).toHaveURL(/\/lets-talk\?service=cloud/);
    await expect(page.locator('#lookingFor')).toHaveValue('cloud');
    await expect(page.locator('#context-service')).toHaveValue('cloud');
  });

  test('fast-track ddos chip pre-populates security scope on /lets-talk', async ({ page }) => {
    await page.goto('/');

    const ddosChip = page.locator('.fast-track-chip[href*="service=ddos-security"]');
    await expect(ddosChip).toBeVisible();
    await ddosChip.click();

    await expect(page).toHaveURL(/\/lets-talk\?service=ddos-security/);
    await expect(page.locator('#lookingFor')).toHaveValue('ddos-security');
  });

  test('main CTA button leads to /lets-talk', async ({ page }) => {
    await page.goto('/');

    const mainBtn = page.locator('#mainCtaButton');
    await expect(mainBtn).toBeVisible();
    await mainBtn.click();

    await expect(page).toHaveURL(/\/lets-talk$/);
    await expect(page.locator('#inquiry-form')).toBeVisible();
  });
});
