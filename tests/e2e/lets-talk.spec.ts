import { test, expect } from '@playwright/test';

test.describe('InfraHub Desk progressive requirement builder', () => {
  test('gives value before asking for contact details', async ({ page }) => {
    await page.goto('/lets-talk');

    await expect(page.getByRole('heading', { name: 'What are you working on?' })).toBeVisible();
    await expect(page.locator('[data-scope="connectivity"]')).toBeVisible();
    await expect(page.locator('#contactName')).toBeHidden();
  });

  test('visual choices reveal only the relevant next step and build a brief', async ({ page }) => {
    await page.goto('/lets-talk');

    await page.locator('[data-scope="connectivity"]').click();
    await expect(page.locator('[data-service-set="connectivity"]')).toBeVisible();
    await expect(page.locator('[data-service-set="cloud"]')).toBeHidden();

    await page.getByRole('button', { name: 'IP Transit', exact: true }).click();
    await page.locator('#targetLocation').fill('Frankfurt');
    await page.getByRole('button', { name: '100G', exact: true }).click();
    await page.getByRole('button', { name: 'Yes', exact: true }).click();

    const summary = page.locator('.requirement-card');
    await expect(summary).toContainText('IP Transit');
    await expect(summary).toContainText('Frankfurt');
    await expect(summary).toContainText('100G');
  });

  test('natural language infers a useful route without claiming certainty', async ({ page }) => {
    await page.goto('/lets-talk');
    await page.locator('#requirementsDescription').fill('Our connection keeps going offline at one location');

    await expect(page.locator('#lookingFor')).toHaveValue('connectivity');
    await expect(page.locator('[data-service-set="connectivity"]')).toBeVisible();
    await expect(page.locator('.requirement-card')).toContainText('To confirm');
  });

  test('contact follows a usable requirement brief', async ({ page }) => {
    await page.goto('/lets-talk');
    await page.locator('[data-scope="connectivity"]').click();
    await page.getByRole('button', { name: 'IP Transit', exact: true }).click();
    await page.locator('#timeline').selectOption('1-3-months');
    await page.locator('#continue-to-contact').click();

    await expect(page.locator('#contactName')).toBeVisible();
    await expect(page.locator('#contactName')).toBeFocused();
    await expect(page.locator('#companyName')).not.toHaveAttribute('required', '');
  });

  test('the advanced path exposes every field immediately', async ({ page }) => {
    await page.goto('/lets-talk');
    await page.locator('#advanced-toggle').click();

    await expect(page.locator('#targetLocation')).toBeVisible();
    await expect(page.locator('#contactName')).toBeVisible();
    await expect(page.locator('#requirementsDescription')).toBeFocused();
  });

  test('changing scope clears detail values and their pressed states', async ({ page }) => {
    await page.goto('/lets-talk');
    await page.locator('[data-scope="connectivity"]').click();
    await page.getByRole('button', { name: 'IP Transit', exact: true }).click();
    await page.getByRole('button', { name: '100G', exact: true }).click();
    await page.getByRole('button', { name: 'Yes', exact: true }).click();

    await page.locator('[data-scope="cloud"]').click();

    await expect(page.locator('[data-service="IP Transit"]')).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByRole('button', { name: '100G', exact: true })).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByRole('button', { name: 'Yes', exact: true })).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('[data-service-set="cloud"]')).toBeVisible();
    await expect(page.locator('[data-service-set="cloud"] [data-service]').first()).toBeFocused();
    await expect(page.locator('.requirement-card dd').nth(2)).toHaveText('To confirm');
    await expect(page.locator('.requirement-card dd').nth(3)).toHaveText('To confirm');
  });
});

test.describe('InfraHub Desk context and submission', () => {
  test('a solution CTA preselects its matching infrastructure scope', async ({ page }) => {
    await page.goto('/solutions/network-connectivity');
    await page.getByRole('link', { name: 'Consult a Network Architect' }).click();

    await expect(page).toHaveURL(/\/lets-talk\?service=connectivity$/);
    await expect(page.locator('#context-service')).toHaveValue('connectivity');
    await expect(page.locator('#lookingFor')).toHaveValue('connectivity');
    await expect(page.locator('[data-service-set="connectivity"]')).toBeVisible();
  });

  test('every published service parameter maps to a valid builder scope', async ({ page }) => {
    test.setTimeout(60_000);
    const expectedScopes: Record<string, string> = {
      advisory: 'other',
      'ai-netops': 'managed-services',
      automation: 'managed-services',
      bgp: 'connectivity',
      cloud: 'cloud',
      'cloud-connectivity': 'cloud',
      colocation: 'dedicated-infrastructure',
      connectivity: 'connectivity',
      'custom-iaas': 'cloud',
      cybersecurity: 'ddos-security',
      'ddos-detection': 'ddos-security',
      'ddos-protection': 'ddos-security',
      'ddos-security': 'ddos-security',
      'dedicated-infrastructure': 'dedicated-infrastructure',
      'dedicated-servers': 'dedicated-infrastructure',
      'gpu-ai': 'dedicated-infrastructure',
      hardware: 'dedicated-infrastructure',
      'ip-transit': 'connectivity',
      ipv4: 'connectivity',
      'layer-2': 'connectivity',
      'managed-noc': 'managed-services',
      'managed-services': 'managed-services',
      'network-engineering': 'managed-services',
      'private-cloud': 'cloud',
      'route-audit': 'connectivity',
      'vmware-alternatives': 'cloud',
      wavelengths: 'connectivity'
    };

    for (const [service, scope] of Object.entries(expectedScopes)) {
      await page.goto(`/lets-talk?service=${service}`);
      await expect(page.locator('#lookingFor'), service).toHaveValue(scope);
      await expect(page.locator(`[data-service-set="${scope}"]`), service).toBeVisible();
    }
  });

  test('URL attribution reaches the hidden inputs', async ({ page }) => {
    await page.goto('/lets-talk?service=ip-transit&industry=hosting&utm_source=linkedin&utm_medium=social&utm_campaign=q3&utm_term=transit&utm_content=variant-a');

    await expect(page.locator('#context-service')).toHaveValue('ip-transit');
    await expect(page.locator('#context-industry')).toHaveValue('hosting');
    await expect(page.locator('#context-utm-source')).toHaveValue('linkedin');
    await expect(page.locator('#context-utm-medium')).toHaveValue('social');
    await expect(page.locator('#context-utm-campaign')).toHaveValue('q3');
    await expect(page.locator('#context-utm-term')).toHaveValue('transit');
    await expect(page.locator('#context-utm-content')).toHaveValue('variant-a');
    await expect(page.locator('#context-note')).toContainText('ip-transit');
  });

  test('submits the structured brief with minimal contact data', async ({ page }) => {
    let submitted: Record<string, string> | null = null;
    await page.route('**/api/inquiry', async (route) => {
      submitted = JSON.parse(route.request().postData() || '{}');
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, leadId: 'INQ-20260101-TESTMOCK' }) });
    });

    await page.goto('/lets-talk?service=ip-transit&utm_source=linkedin');
    await page.locator('#requirementsDescription').fill('Need transit in Frankfurt with separate physical paths');
    await page.getByRole('button', { name: 'IP Transit', exact: true }).click();
    await page.getByRole('button', { name: '100G', exact: true }).click();
    await page.getByRole('button', { name: 'Yes', exact: true }).click();
    await page.locator('#timeline').selectOption('1-3-months');
    await page.locator('#continue-to-contact').click();
    await page.locator('#contactName').fill('Alex Doe');
    await page.locator('#workEmail').fill('alex@example.com');
    await page.locator('#submit-btn').click();

    await expect(page.locator('#form-success-card')).toBeVisible();
    await expect(page.locator('#lead-id-display')).toContainText('INQ-20260101-TESTMOCK');
    expect(submitted).not.toBeNull();
    expect(submitted!.lookingFor).toBe('connectivity');
    expect(submitted!.requirementsDescription).toContain('IP Transit · 100G · Redundancy: Yes');
    expect(submitted!.companyName).toBe('');
    expect(submitted!.utmSource).toBe('linkedin');
  });

  test('failed delivery reports the provider message and re-enables submit', async ({ page }) => {
    await page.route('**/api/inquiry', async (route) => {
      await route.fulfill({ status: 502, contentType: 'application/json', body: JSON.stringify({ success: false, message: 'Dispatch unavailable.' }) });
    });
    await page.goto('/lets-talk');
    await page.locator('#advanced-toggle').click();
    await page.locator('[data-scope="connectivity"]').click();
    await page.locator('#requirementsDescription').fill('10G IP transit in Frankfurt, dual upstream.');
    await page.locator('#timeline').selectOption('1-3-months');
    await page.locator('#contactName').fill('Alex Doe');
    await page.locator('#workEmail').fill('alex@example.com');
    await page.locator('#submit-btn').click();

    await expect(page.locator('#form-error-alert')).toContainText('Dispatch unavailable.');
    await expect(page.locator('#submit-btn')).toBeEnabled();
    await expect(page.locator('#form-success-card')).toBeHidden();
  });

  test('starter example chips populate description and infer scope', async ({ page }) => {
    await page.goto('/lets-talk');

    const ddosChip = page.locator('.example-chip', { hasText: 'DDoS protection' });
    await expect(ddosChip).toBeVisible();
    await ddosChip.click();

    await expect(page.locator('#requirementsDescription')).toHaveValue('Need volumetric DDoS protection and BGP FlowSpec diversion');
    await expect(page.locator('#lookingFor')).toHaveValue('ddos-security');
    await expect(page.locator('[data-service-set="ddos-security"]')).toBeVisible();
    await expect(page.locator('#requirementsDescription')).toBeFocused();
  });

  test('persistent DeskTrigger exists on home and links to /lets-talk, hidden on /lets-talk', async ({ page }) => {
    await page.goto('/');
    const homeTrigger = page.locator('#deskTrigger');
    await expect(homeTrigger).toHaveAttribute('href', '/lets-talk');

    await page.goto('/lets-talk');
    await expect(page.locator('#deskTriggerWrap')).toHaveCount(0);
  });
});
