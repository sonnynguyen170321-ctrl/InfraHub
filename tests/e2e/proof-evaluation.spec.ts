import { test, expect } from '@playwright/test';

test.describe('Phase 5: Proof & Evaluation Matrix', () => {
  test('sector evaluation scorecard renders and switches dynamically on click', async ({ page }) => {
    await page.goto('/');

    const card = page.locator('#sectorEvaluationCard');
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
    await expect(evalChallenge).toContainText('VMware Broadcom');

    const metricsGrid = page.locator('#evalMetricsGrid');
    await expect(metricsGrid).toContainText('Hypervisor TCO');

    // Switch to Sector 03: SaaS & Technology
    const saasTab = page.locator('#sector-tab-saas');
    await saasTab.click();
    await expect(evalKicker).toContainText('Edge Latency');
    await expect(metricsGrid).toContainText('Egress Cost Reduction');

    // Switch to Sector 04: Enterprise
    const enterpriseTab = page.locator('#sector-tab-enterprise');
    await enterpriseTab.click();
    await expect(evalKicker).toContainText('Physical Redundancy');
    await expect(metricsGrid).toContainText('Conduit Separation');
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

  test('featured offer commit terms and technical specs are interactive', async ({ page }) => {
    await page.goto('/');

    const offersSection = page.locator('#featured-offers');
    if ((await offersSection.count()) === 0) return;

    // Check commit terms
    const term24 = page.locator('.term-btn[data-term="24"]');
    await expect(term24).toBeVisible();
    await term24.click();
    await expect(term24).toHaveClass(/is-active/);

    const note = page.locator('#allocationCommitNote');
    await expect(note).toContainText('7-day port activation SLA');

    // Check tech spec inspector tabs
    const handoverTab = page.locator('.spec-tab[data-spec-key="handover"]');
    await handoverTab.click();
    await expect(handoverTab).toHaveClass(/is-active/);

    const specDetail = page.locator('#specDetailView');
    await expect(specDetail).toContainText('Equinix FR5');

    const slaTab = page.locator('.spec-tab[data-spec-key="sla"]');
    await slaTab.click();
    await expect(specDetail).toContainText('99.99% availability SLA');
  });
});
