import { test, expect } from '@playwright/test';

test.describe('DecisionNavigator interactive architecture journeys', () => {
  test('network connectivity decision map steps through options and builds brief', async ({ page }) => {
    await page.goto('/solutions/network-connectivity');

    const nav = page.locator('#decision-navigator-network');
    await expect(nav).toBeVisible();

    // Step 1: Metro selection
    const amsOption = nav.locator('.option-card', { hasText: 'Amsterdam (AMS)' });
    await expect(amsOption).toBeVisible();
    await amsOption.click();

    await expect(nav.locator('#status-network-metro')).toHaveText('Amsterdam (AMS)');
    await expect(nav.locator('.blueprint-badge')).toContainText(['Amsterdam (AMS)']);

    // Step 2 is now active
    const cap100g = nav.locator('.option-card', { hasText: '100G LR4' });
    await expect(cap100g).toBeVisible();
    await cap100g.click();

    await expect(nav.locator('#status-network-capacity')).toHaveText('100G LR4 / CWDM4');

    // Verify Desk bridge link
    const deskLink = nav.locator('#desk-link-network');
    await expect(deskLink).toHaveAttribute('href', /lets-talk\?service=connectivity/);
    await expect(deskLink).toHaveAttribute('href', /Amsterdam/);
  });

  test('cloud virtualization decision map and topology explorer work smoothly', async ({ page }) => {
    await page.goto('/solutions/cloud-virtualization');

    // Decision Navigator verification
    const nav = page.locator('#decision-navigator-cloud');
    await expect(nav).toBeVisible();

    const vmwareOption = nav.locator('.option-card', { hasText: 'VMware Migration' });
    await expect(vmwareOption).toBeVisible();
    await vmwareOption.click();

    await expect(nav.locator('#status-cloud-workload')).toHaveText('VMware Migration');

    // CloudTopologyExplorer verification
    const exhibit = page.locator('#cloudTopologyExhibit');
    await expect(exhibit).toBeVisible();

    const toggleHyperscaler = exhibit.locator('#toggle-hyperscaler');
    await toggleHyperscaler.click();
    await expect(exhibit.locator('#hypervisorHeading')).toContainText('Multi-Tenant Virtualization Pool');
    await expect(exhibit.locator('#valEgress')).toContainText('Metered');

    const toggleSovereign = exhibit.locator('#toggle-sovereign');
    await toggleSovereign.click();
    await expect(exhibit.locator('#hypervisorHeading')).toContainText('Dedicated Hypervisors');
    await expect(exhibit.locator('#valEgress')).toContainText('Unmetered');
  });

  test('security decision map and scrubbing explorer demonstrate mitigation states', async ({ page }) => {
    await page.goto('/solutions/security');

    // Decision Navigator verification
    const nav = page.locator('#decision-navigator-security');
    await expect(nav).toBeVisible();

    const volumetricOption = nav.locator('.option-card', { hasText: 'Volumetric Uplink Saturation' });
    await expect(volumetricOption).toBeVisible();
    await volumetricOption.click();

    await expect(nav.locator('#status-security-threat')).toHaveText('Volumetric Uplink Saturation');

    // SecurityScrubbingExplorer verification
    const exhibit = page.locator('#securityScrubbingExhibit');
    await expect(exhibit).toBeVisible();

    const toggleAttack = exhibit.locator('#toggle-attack');
    await toggleAttack.click();
    await expect(exhibit.locator('#attackPill')).toBeVisible();
    await expect(exhibit.locator('#metricScrubbing')).toContainText('Dropped');

    const toggleNormal = exhibit.locator('#toggle-normal');
    await toggleNormal.click();
    await expect(exhibit.locator('#attackPill')).toBeHidden();
    await expect(exhibit.locator('#metricScrubbing')).toContainText('Standby');
  });
});
