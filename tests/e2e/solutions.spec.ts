import { test, expect } from '@playwright/test';

test.describe('Homepage Act 2: Solution Selector', () => {
  test('the first discipline is selected and its panel is shown', async ({ page }) => {
    await page.goto('/');

    const selector = page.locator('#what-you-need');
    await expect(selector).toBeVisible();

    const tabs = selector.locator('.discipline-tab-btn');
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');

    const visiblePanels = selector.locator('.selector-panel.active');
    await expect(visiblePanels).toHaveCount(1);
  });

  test('clicking a discipline swaps the panel and its details', async ({ page }) => {
    await page.goto('/');

    const selector = page.locator('#what-you-need');
    const computeTab = selector.locator('#tab-compute');
    await computeTab.click();

    await expect(computeTab).toHaveAttribute('aria-selected', 'true');
    const computePanel = selector.locator('#panel-compute');
    await expect(computePanel).toBeVisible();
    await expect(computePanel).toHaveClass(/active/);

    const visiblePanels = selector.locator('.selector-panel.active');
    await expect(visiblePanels).toHaveCount(1);
  });

  test('arrow keys move between disciplines and activate them', async ({ page }) => {
    await page.goto('/');

    const selector = page.locator('#what-you-need');
    const tabs = selector.locator('.discipline-tab-btn');
    const count = await tabs.count();
    expect(count).toBeGreaterThan(2);

    await tabs.first().focus();
    await page.keyboard.press('ArrowRight');

    await expect(tabs.nth(1)).toBeFocused();
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('ArrowLeft');
    await expect(tabs.first()).toBeFocused();
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('End');
    await expect(tabs.nth(count - 1)).toBeFocused();

    await page.keyboard.press('Home');
    await expect(tabs.first()).toBeFocused();
  });
});

test.describe('Master Solutions Hub (/solutions)', () => {
  test('renders the central topology grid with all 5 infrastructure domains', async ({ page }) => {
    await page.goto('/solutions');

    await expect(page).toHaveTitle(/Infrastructure Solutions Architecture/i);
    const coreNode = page.locator('.center-hub-token');
    await expect(coreNode).toBeAttached();

    const domainNodes = page.locator('.domain-node');
    await expect(domainNodes).toHaveCount(5);

    for (const slug of ['network', 'infrastructure', 'cloud', 'security', 'operations']) {
      const node = page.locator(`.domain-node.domain-${slug}`);
      await expect(node).toBeVisible();
      const link = node.locator('.node-title a');
      await expect(link).toBeAttached();
    }
  });

  test('each domain provides direct links to specific service capabilities', async ({ page }) => {
    await page.goto('/solutions');

    const networkNode = page.locator('.domain-node.domain-network');
    const serviceLinks = networkNode.locator('a.service-link');
    const count = await serviceLinks.count();
    expect(count).toBeGreaterThanOrEqual(4);

    const firstHref = await serviceLinks.first().getAttribute('href');
    expect(firstHref).toBeTruthy();
  });
});
