import { test, expect } from '@playwright/test';

test.describe('Act 5: Requirement Desk Orchestration', () => {
  test('renders the Desk headline, natural language input, and starter prompt chips', async ({ page }) => {
    await page.goto('/');

    const deskSection = page.locator('#start-requirement');
    await expect(deskSection).toBeVisible();

    await expect(deskSection.locator('.start-title')).toContainText('What are you working on?');
    const input = deskSection.locator('#home-requirement-input');
    await expect(input).toBeVisible();

    const chips = deskSection.locator('.prompt-chip-btn');
    await expect(chips).toHaveCount(4);
  });

  test('clicking a starter prompt chip fills the input and reveals draft brief card', async ({ page }) => {
    await page.goto('/');

    const deskSection = page.locator('#start-requirement');
    const firstChip = deskSection.locator('.prompt-chip-btn').first();
    await firstChip.click();

    const input = deskSection.locator('#home-requirement-input');
    await expect(input).toHaveValue(/100G transit in Frankfurt/i);

    const briefCard = deskSection.locator('#home-live-brief');
    await expect(briefCard).toBeVisible();
    await expect(briefCard.locator('#brief-rendered-title')).toContainText('Frankfurt');
  });

  test('clicking a category pill navigates with service param to /lets-talk', async ({ page }) => {
    await page.goto('/');

    const deskSection = page.locator('#start-requirement');
    const cloudPill = deskSection.locator('.category-pill[data-scope="cloud"]');
    await expect(cloudPill).toBeVisible();
    await cloudPill.click();

    await expect(page).toHaveURL(/\/lets-talk\?service=cloud/);
  });

  test('form submission carries requirement text to /lets-talk', async ({ page }) => {
    await page.goto('/');

    const input = page.locator('#home-requirement-input');
    await input.fill('Need 100G wavelength between Frankfurt and Amsterdam');
    
    const submitBtn = page.locator('.btn-submit-requirement');
    await submitBtn.click();

    await expect(page).toHaveURL(/\/lets-talk/);
    expect(page.url()).toContain('requirement=Need+100G+wavelength');
  });
});
