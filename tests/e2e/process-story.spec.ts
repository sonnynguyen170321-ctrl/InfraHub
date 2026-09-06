import { test, expect } from '@playwright/test';

test.describe('How We Work Operating Process & Commercial Story (/how-we-work)', () => {
  test('renders all 4 stages in the operating process', async ({ page }) => {
    await page.goto('/how-we-work');

    await expect(page).toHaveTitle(/How We Work/i);
    const stages = page.locator('.stage-block');
    await expect(stages).toHaveCount(4);

    const kickers = await stages.locator('.stage-kicker').allInnerTexts();
    expect(kickers.map((k) => k.trim())).toEqual(['Understand', 'Match', 'Introduce', 'Deliver']);
  });

  test('the process states truthful commercial boundaries without hype', async ({ page }) => {
    await page.goto('/how-we-work');

    const bodyText = (await page.locator('main').innerText()).toLowerCase();
    for (const banned of ['guarantee', 'zero markup', 'best provider in the world', 'cheapest']) {
      expect(bodyText, `process copy must not claim "${banned}"`).not.toContain(banned);
    }

    expect(bodyText).toContain('understand');
    expect(bodyText).toContain('evaluate');
  });

  test('commercial FAQ section answers key relationship and SLA questions', async ({ page }) => {
    await page.goto('/how-we-work');

    const faqEntries = page.locator('.faq-entry');
    const count = await faqEntries.count();
    expect(count).toBeGreaterThanOrEqual(3);

    const firstQuestion = page.locator('.faq-question').first();
    await expect(firstQuestion).toBeVisible();
  });
});
