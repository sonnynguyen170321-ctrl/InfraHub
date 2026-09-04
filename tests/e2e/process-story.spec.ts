import { test, expect } from '@playwright/test';

// Chapter 04. The claim under test is that the story advances with the reader: the active step,
// the drawn route line and the single annotation stay in agreement.

test.describe('process story', () => {
  test('the annotation follows the step being read', async ({ page }) => {
    await page.goto('/');

    const observed: string[] = [];

    for (const step of ['understand', 'match', 'introduce', 'deliver']) {
      await page.evaluate((id) => {
        const el = document.getElementById(`step-${id}`);
        if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 280);
      }, step);
      await page.waitForTimeout(220);

      await expect(page.locator(`#step-${step}`)).toHaveClass(/is-active/);
      observed.push(
        (await page.locator('.annotation-slide.active .annotation-title').innerText()).trim()
      );
    }

    // Four steps, four different observations, in order.
    expect(new Set(observed).size).toBe(4);
  });

  test('steps already passed keep their route line drawn', async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => {
      const el = document.getElementById('step-deliver');
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 280);
    });
    await page.waitForTimeout(220);

    await expect(page.locator('#step-understand')).toHaveClass(/is-passed/);
    await expect(page.locator('#step-match')).toHaveClass(/is-passed/);
  });

  test('the process states nothing beyond the commercial model', async ({ page }) => {
    await page.goto('/');

    const text = (await page.locator('#how-it-works').innerText()).toLowerCase();
    for (const banned of ['guarantee', 'zero markup', 'verified specialist', 'best provider']) {
      expect(text, `process copy must not claim "${banned}"`).not.toContain(banned);
    }
    expect(text).toContain('the selected specialist contracts and delivers');
  });
});
