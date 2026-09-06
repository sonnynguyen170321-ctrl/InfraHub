import { test, expect } from '@playwright/test';

const CANONICAL_PARTNERS = [
  'FastNetMon',
  'Gcore',
  'StormWall',
  'Zenlayer',
  'IPXO',
  'Vates',
  'ITcare',
  'Airframe'
];

test.describe('Partner Ecosystem Ribbon — Premium Marquee Architecture', () => {
  test('primary sequence contains all 8 canonical partners as non-clickable passive credibility badges', async ({ page }) => {
    await page.goto('/');

    const ribbon = page.locator('.partner-trust-ribbon');
    await expect(ribbon).toBeVisible();

    const kicker = ribbon.locator('.ribbon-kicker');
    await expect(kicker).toHaveText(/Our partner ecosystem/i);

    const primaryTrack = ribbon.locator('.primary-track');
    await expect(primaryTrack).toBeVisible();

    const items = primaryTrack.locator('.partner-item');
    await expect(items).toHaveCount(CANONICAL_PARTNERS.length);

    // Verify all partner badges are passive (non-clickable spans, NO links per Directive Section 3)
    const links = ribbon.locator('a');
    await expect(links).toHaveCount(0);

    for (let i = 0; i < CANONICAL_PARTNERS.length; i++) {
      const partnerName = CANONICAL_PARTNERS[i];
      const badge = items.nth(i).locator('span.partner-logo-link');
      await expect(badge).toBeAttached();
      const img = badge.locator('img.partner-logo-img');
      await expect(img).toBeAttached();
      await expect(img).toHaveAttribute('alt', `${partnerName} logo`);
    }
  });

  test('duplicate sequences are aria-hidden and contain NO focusable links', async ({ page }) => {
    await page.goto('/');

    const ribbon = page.locator('.partner-trust-ribbon');
    const duplicateTracks = ribbon.locator('.duplicate-track');
    
    // There are 2 duplicate tracks (Sequence B and Sequence C)
    await expect(duplicateTracks).toHaveCount(2);

    for (let i = 0; i < 2; i++) {
      const track = duplicateTracks.nth(i);
      await expect(track).toHaveAttribute('aria-hidden', 'true');
      
      // CRITICAL accessibility check: NO focusable <a> tags inside duplicate sequences
      const links = track.locator('a');
      await expect(links).toHaveCount(0);

      // Verify each item is a non-interactive span
      const spans = track.locator('span.partner-logo-link');
      await expect(spans).toHaveCount(CANONICAL_PARTNERS.length);
    }
  });

  test('ribbon is passive credibility and does not trap keyboard focus', async ({ page }) => {
    await page.goto('/');

    // Per Directive Section 3: partner logos are non-clickable passive badges and should not receive tab focus
    const ribbonLinks = page.locator('.partner-trust-ribbon a');
    await expect(ribbonLinks).toHaveCount(0);
  });

  test('parent marquee strip exists, animates infinite, and measures distance', async ({ page }) => {
    await page.goto('/');

    const strip = page.locator('.partner-trust-ribbon .marquee-strip');
    await expect(strip).toBeVisible();

    const computed = await strip.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        animationName: style.animationName,
        animationIterationCount: style.animationIterationCount,
        animationTimingFunction: style.animationTimingFunction
      };
    });

    expect(computed.animationName).toContain('partnerMarquee');
    expect(computed.animationIterationCount).toBe('infinite');
    expect(computed.animationTimingFunction).toBe('linear');
  });

  test('reduced-motion halts animation and hides duplicate tracks cleanly', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const ribbon = page.locator('.partner-trust-ribbon');
    const strip = ribbon.locator('.marquee-strip');
    const animationName = await strip.evaluate((el) => window.getComputedStyle(el).animationName);
    expect(animationName === 'none' || animationName === '').toBe(true);

    const duplicateTrack = ribbon.locator('.duplicate-track').first();
    await expect(duplicateTrack).not.toBeVisible();
  });

  test('all 8 partner logo asset URLs return HTTP 200 without breakage', async ({ page, request }) => {
    await page.goto('/');

    const primaryTrack = page.locator('.partner-trust-ribbon .primary-track');
    const imgUrls = await primaryTrack.locator('img.partner-logo-img').evaluateAll(imgs => 
      imgs.map(img => img.getAttribute('src')).filter(Boolean) as string[]
    );

    expect(imgUrls.length).toBe(CANONICAL_PARTNERS.length);

    for (const url of imgUrls) {
      const res = await request.get(url);
      expect(res.status(), `Logo ${url} should return 200`).toBe(200);
    }
  });

  test('lazy partner logos finish loading before the marquee reveals them', async ({ page }) => {
    await page.goto('/');

    const wrapper = page.locator('.partner-trust-ribbon .ribbon-track-wrapper');

    for (const partnerName of ['ITcare', 'Airframe']) {
      const image = page.locator('.partner-trust-ribbon .primary-track')
        .getByAltText(`${partnerName} logo`);

      await expect.poll(async () => {
        const [wrapperBox, imageBox] = await Promise.all([
          wrapper.boundingBox(),
          image.boundingBox()
        ]);
        if (!wrapperBox || !imageBox) return false;
        return imageBox.x + imageBox.width > wrapperBox.x &&
          imageBox.x < wrapperBox.x + wrapperBox.width;
      }, { timeout: 20_000 }).toBe(true);

      await expect.poll(async () =>
        image.evaluate((element) => (element as HTMLImageElement).naturalWidth)
      ).toBeGreaterThan(0);
    }
  });

  test('no horizontal overflow at various desktop and mobile viewports', async ({ page }) => {
    const viewports = [
      { width: 390, height: 844 },
      { width: 430, height: 932 },
      { width: 1280, height: 800 },
      { width: 1440, height: 900 },
      { width: 1490, height: 900 },
      { width: 1920, height: 1080 },
      { width: 2560, height: 1440 }
    ];

    for (const vp of viewports) {
      await page.setViewportSize(vp);
      await page.goto('/');

      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      expect(overflow, `Overflow detected at ${vp.width}x${vp.height}`).toBe(false);
    }
  });
});
