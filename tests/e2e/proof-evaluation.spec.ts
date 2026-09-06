import { test, expect } from '@playwright/test';

test.describe('Industries & Sector Evaluation (/industries)', () => {
  test('industry grid renders all 4 tailored technical evaluation sectors', async ({ page }) => {
    await page.goto('/industries');

    await expect(page).toHaveTitle(/Industries/i);
    const cards = page.locator('.industry-card');
    await expect(cards).toHaveCount(4);

    const titles = await cards.locator('.industry-title').allInnerTexts();
    expect(titles.map((t) => t.trim())).toEqual([
      'ISPs & Network Operators',
      'Hosting & Cloud Providers',
      'SaaS & Technology Companies',
      'Enterprise Infrastructure'
    ]);
  });

  test('each industry card links to its dedicated evaluation framework page', async ({ page }) => {
    await page.goto('/industries');

    for (const slug of [
      '/industries/isps-network-operators',
      '/industries/hosting-cloud-providers',
      '/industries/saas-technology',
      '/industries/enterprise'
    ]) {
      const link = page.locator(`.industry-card[href="${slug}"]`);
      await expect(link).toBeVisible();
    }
  });
});
