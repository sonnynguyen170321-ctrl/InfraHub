import { test, expect } from '@playwright/test';

test.describe('Phase 5: Sector Evaluation', () => {
  test('sector evaluation detail renders and switches dynamically on click', async ({ page }) => {
    await page.goto('/');

    const card = page.locator('#sectorDetailPanel');
    await expect(card).toBeVisible();

    // Default sector 01: ISPs
    const evalKicker = page.locator('#evalKicker');
    await expect(evalKicker).toContainText('Carrier Peering');

    // Switch to Sector 02: Hosting & Cloud Providers
    const hostingTab = page.locator('#sector-tab-hosting');
    await expect(hostingTab).toBeVisible();
    await hostingTab.click();

    await expect(hostingTab).toHaveClass(/is-active/);
    await expect(hostingTab).toHaveAttribute('aria-selected', 'true');
    await expect(evalKicker).toContainText('Virtualization Economics');

    const evalChallenge = page.locator('#evalChallenge');
    await expect(evalChallenge).toContainText('Licensing changes');

    const metricsGrid = page.locator('#evalMetricsGrid');
    await expect(metricsGrid).toContainText('Platform migration');

    // Switch to Sector 03: SaaS & Technology
    const saasTab = page.locator('#sector-tab-saas');
    await saasTab.click();
    await expect(evalKicker).toContainText('Edge Latency');
    await expect(metricsGrid).toContainText('Egress model');

    // Switch to Sector 04: Enterprise
    const enterpriseTab = page.locator('#sector-tab-enterprise');
    await enterpriseTab.click();
    await expect(evalKicker).toContainText('Physical Redundancy');
    await expect(metricsGrid).toContainText('Building entry');
  });

  test('sector tabs support keyboard navigation', async ({ page }) => {
    await page.goto('/');

    const ispsTab = page.locator('#sector-tab-isps');
    await ispsTab.focus();

    // Press ArrowDown to advance to Hosting
    await page.keyboard.press('ArrowDown');
    const hostingTab = page.locator('#sector-tab-hosting');
    await expect(hostingTab).toHaveClass(/is-active/);
    await expect(page.locator('#evalKicker')).toContainText('Virtualization Economics');

    // Press ArrowDown to advance to SaaS
    await page.keyboard.press('ArrowDown');
    const saasTab = page.locator('#sector-tab-saas');
    await expect(saasTab).toHaveClass(/is-active/);
    await expect(page.locator('#evalKicker')).toContainText('Edge Latency');

    // Press ArrowUp to move back to Hosting
    await page.keyboard.press('ArrowUp');
    await expect(hostingTab).toHaveClass(/is-active/);
  });
});
