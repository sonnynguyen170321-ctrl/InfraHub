import { test, expect } from '@playwright/test';

test.describe('Homepage Act 2: The InfraHub Infrastructure Lens', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(300);
  });

  test('renders 5 canonical disciplines in the navigation rail', async ({ page }) => {
    const stage = page.locator('#what-you-need');
    await expect(stage).toBeVisible();

    const tabs = stage.locator('.discipline-tab-btn');
    await expect(tabs).toHaveCount(5);

    await expect(tabs.nth(0)).toContainText('Network');
    await expect(tabs.nth(1)).toContainText('Compute');
    await expect(tabs.nth(2)).toContainText('Cloud');
    await expect(tabs.nth(3)).toContainText('Security');
    await expect(tabs.nth(4)).toContainText('Operations');
  });

  test('switching disciplines synchronizes rail, physical slide, and decision panel', async ({ page }) => {
    const stage = page.locator('#what-you-need');

    // Click Compute
    const computeTab = stage.locator('#tab-compute');
    await computeTab.click();

    await expect(computeTab).toHaveAttribute('aria-selected', 'true');
    await expect(stage.locator('#slide-compute')).toHaveClass(/active/);
    await expect(stage.locator('#panel-compute')).toHaveClass(/active/);
    await expect(stage.locator('#panel-compute .panel-headline')).toContainText('High-density bare-metal');

    // Click Security
    const securityTab = stage.locator('#tab-security');
    await securityTab.click();

    await expect(securityTab).toHaveAttribute('aria-selected', 'true');
    await expect(stage.locator('#slide-security')).toHaveClass(/active/);
    await expect(stage.locator('#panel-security')).toHaveClass(/active/);
    await expect(stage.locator('#panel-security .panel-headline')).toContainText('Multi-Tbps volumetric scrubbing');
  });

  test('capacity lens interaction updates constraints and route styling', async ({ page }) => {
    const stage = page.locator('#what-you-need');

    const cap400g = stage.locator('#cap-btn-400G');
    await expect(cap400g).toBeVisible();
    await cap400g.click();

    await expect(cap400g).toHaveClass(/active/);
    await expect(stage.locator('#capacity-constraint-text')).toContainText('coherent optical transceivers');

    const cap10g = stage.locator('#cap-btn-10G');
    await cap10g.click();
    await expect(cap10g).toHaveClass(/active/);
    await expect(stage.locator('#capacity-constraint-text')).toContainText('Single or redundant 10G optical cross-connects');
  });

  test('perspective toggle switches between physical lens and verified reach atlas', async ({ page }) => {
    const stage = page.locator('#what-you-need');

    const toggleReach = stage.locator('#toggle-reach-view');
    const togglePhysical = stage.locator('#toggle-physical-view');
    const lensContainer = stage.locator('#lens-primary-container');
    const reachContainer = stage.locator('#reach-atlas-container');

    // Initially Physical is active
    await expect(togglePhysical).toHaveClass(/active/);
    await expect(lensContainer).toBeVisible();
    await expect(reachContainer).toBeHidden();

    // Toggle to Reach Atlas
    await toggleReach.click();
    await expect(toggleReach).toHaveClass(/active/);
    await expect(reachContainer).toBeVisible();
    await expect(lensContainer).toBeHidden();

    // Inspect Reach Atlas nodes
    const fraNode = stage.locator('.reach-node-group[data-node-id="fra"]');
    await expect(fraNode).toBeVisible();
    await fraNode.dispatchEvent('click');

    await expect(stage.locator('#reach-detail-title')).toContainText('Frankfurt (FRA) Gateway');
    await expect(stage.locator('#reach-detail-provider')).toContainText('Evaluated via Gcore / Zenlayer');

    // Toggle back to Physical
    await togglePhysical.click();
    await expect(lensContainer).toBeVisible();
    await expect(reachContainer).toBeHidden();
  });

  test('bridge link routes to requirement intake', async ({ page }) => {
    const stage = page.locator('#what-you-need');
    const bridgeLink = stage.locator('.rail-bridge a.bridge-link');

    await expect(bridgeLink).toBeVisible();
    await expect(bridgeLink).toHaveAttribute('href', '/lets-talk');
  });
});
