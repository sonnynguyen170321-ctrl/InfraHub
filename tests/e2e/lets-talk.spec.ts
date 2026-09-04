import { test, expect } from '@playwright/test';

// The inquiry form is novalidate, so every message a person sees comes from the page's own
// validation. These tests assert the accessible behaviour, not the wording.

test.describe('inquiry form validation', () => {
  test('submitting empty reports per-field errors and focuses the first one', async ({ page }) => {
    await page.goto('/lets-talk');

    await page.locator('#submit-btn').click();

    const summary = page.locator('#form-error-alert');
    await expect(summary).toBeVisible();

    await expect(page.locator('#lookingFor-error')).toBeVisible();
    await expect(page.locator('#lookingFor')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#workEmail')).toHaveAttribute('aria-invalid', 'true');

    await expect(page.locator('#lookingFor')).toBeFocused();
  });

  test('an invalid email is reported on its own field', async ({ page }) => {
    await page.goto('/lets-talk');

    await page.locator('#workEmail').fill('not-an-email');
    await page.locator('#workEmail').blur();

    await expect(page.locator('#workEmail-error')).toBeVisible();
    await expect(page.locator('#workEmail')).toHaveAttribute('aria-invalid', 'true');
  });

  test('a field error clears once the field becomes valid', async ({ page }) => {
    await page.goto('/lets-talk');

    await page.locator('#contactName').fill('a');
    await page.locator('#contactName').blur();
    await expect(page.locator('#contactName-error')).toBeVisible();

    await page.locator('#contactName').fill('Alex Doe');
    await page.locator('#contactName').blur();
    await expect(page.locator('#contactName-error')).toBeHidden();
    await expect(page.locator('#contactName')).not.toHaveAttribute('aria-invalid', 'true');
  });

  test('the discipline select offers every category the API accepts', async ({ page }) => {
    await page.goto('/lets-talk');

    const values = await page
      .locator('#lookingFor option')
      .evaluateAll((options) => options.map((option) => (option as HTMLOptionElement).value).filter(Boolean));

    for (const expected of [
      'hardware',
      'dedicated-infrastructure',
      'cloud',
      'connectivity',
      'ddos-security',
      'cybersecurity',
      'managed-services',
      'ipv4',
      'other'
    ]) {
      expect(values, `the form must expose "${expected}"`).toContain(expected);
    }
  });
});

test.describe('inquiry form context and submission', () => {
  test('URL context and attribution reach the hidden inputs', async ({ page }) => {
    await page.goto(
      '/lets-talk?service=ip-transit&industry=hosting&utm_source=linkedin&utm_medium=social&utm_campaign=q3&utm_term=transit&utm_content=variant-a'
    );

    await expect(page.locator('#context-service')).toHaveValue('ip-transit');
    await expect(page.locator('#context-industry')).toHaveValue('hosting');
    await expect(page.locator('#context-utm-source')).toHaveValue('linkedin');
    await expect(page.locator('#context-utm-medium')).toHaveValue('social');
    await expect(page.locator('#context-utm-campaign')).toHaveValue('q3');
    await expect(page.locator('#context-utm-term')).toHaveValue('transit');
    await expect(page.locator('#context-utm-content')).toHaveValue('variant-a');

    await expect(page.locator('#context-badge-text')).toContainText('ip-transit');
  });

  test('an offer reference is carried into the form', async ({ page }) => {
    await page.goto('/lets-talk?offer=example-offer');

    await expect(page.locator('#context-offer')).toHaveValue('example-offer');
    await expect(page.locator('#context-badge-text')).toContainText('example-offer');
  });

  test('a successful submission announces the reference and sends the attribution', async ({ page }) => {
    // The API is a serverless function and is not part of the static build under test, so the
    // route is mocked. The assertion is on the request the page makes and what it does with a
    // success response.
    let submitted: Record<string, string> | null = null;

    await page.route('**/api/inquiry', async (route) => {
      submitted = JSON.parse(route.request().postData() || '{}');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, leadId: 'INQ-20260101-TESTMOCK' })
      });
    });

    await page.goto('/lets-talk?service=ip-transit&utm_source=linkedin');

    await page.locator('#lookingFor').selectOption('connectivity');
    await page.locator('#requirementsDescription').fill('10G IP transit in Frankfurt, dual upstream.');
    await page.locator('#timeline').selectOption('1-3-months');
    await page.locator('#contactName').fill('Alex Doe');
    await page.locator('#companyName').fill('Example Networks');
    await page.locator('#workEmail').fill('alex@example.com');

    await page.locator('#submit-btn').click();

    const success = page.locator('#form-success-card');
    await expect(success).toBeVisible();
    await expect(success).toHaveAttribute('role', 'status');
    await expect(page.locator('#lead-id-display')).toContainText('INQ-20260101-TESTMOCK');
    await expect(page.locator('#inquiry-form')).toBeHidden();

    expect(submitted).not.toBeNull();
    expect(submitted!.lookingFor).toBe('connectivity');
    expect(submitted!.serviceParam).toBe('ip-transit');
    expect(submitted!.utmSource).toBe('linkedin');
  });

  test('a failed submission reports the message and re-enables submit', async ({ page }) => {
    await page.route('**/api/inquiry', async (route) => {
      await route.fulfill({
        status: 502,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, message: 'Dispatch unavailable.' })
      });
    });

    await page.goto('/lets-talk');

    await page.locator('#lookingFor').selectOption('connectivity');
    await page.locator('#requirementsDescription').fill('10G IP transit in Frankfurt, dual upstream.');
    await page.locator('#timeline').selectOption('1-3-months');
    await page.locator('#contactName').fill('Alex Doe');
    await page.locator('#companyName').fill('Example Networks');
    await page.locator('#workEmail').fill('alex@example.com');

    await page.locator('#submit-btn').click();

    await expect(page.locator('#form-error-alert')).toContainText('Dispatch unavailable.');
    await expect(page.locator('#submit-btn')).toBeEnabled();
    await expect(page.locator('#form-success-card')).toBeHidden();
  });
});
