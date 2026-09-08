import { test, expect, type APIRequestContext } from '@playwright/test';

// The eight canonical partner records. Each one must have a live profile, a logo that actually
// loads, and decision guidance that came from the record rather than the template.
//
// Two environments, two truths. vercel.json 308-redirects /partners and every /partners/<slug>
// onto a solution route, so on a real deployment these pages are built but unreachable. The
// local fixture server (scripts/static-server.mjs) reproduces cleanUrls and nothing else, so the
// same routes render there. Both behaviours are correct for their environment.
//
// This suite used to assume the local one. Run against a deployment it failed eleven times, and
// had done so since the redirects were added - nobody saw it because the suite only ever ran
// against the build output. So rather than assert one environment's behaviour everywhere, these
// specs ask the environment which it is: the page-rendering tests run where the pages are
// reachable, and the redirect contract is verified where it is live. Neither is skipped silently
// in the environment that can actually check it.
const CANONICAL_PARTNERS = [
  'fastnetmon',
  'gcore',
  'stormwall',
  'zenlayer',
  'ipxo',
  'vates',
  'itcare',
  'airframe'
];

// Source of truth mirrored from vercel.json. Kept here deliberately: if a redirect is changed
// there without updating this, the redirect specs fail and say so.
const PARTNER_REDIRECTS: Record<string, string> = {
  '/partners': '/solutions',
  '/partners/fastnetmon': '/solutions/security',
  '/partners/stormwall': '/solutions/security',
  '/partners/zenlayer': '/solutions/network-connectivity',
  '/partners/gcore': '/solutions/cloud-virtualization',
  '/partners/vates': '/solutions/cloud-virtualization',
  '/partners/itcare': '/solutions/managed-services',
  '/partners/ipxo': '/ipv4',
  '/partners/airframe': '/how-we-work'
};

// Probed once per worker rather than inferred from E2E_BASE, so the answer comes from what the
// target actually does. A deployment that stopped redirecting would flip these suites over
// instead of quietly passing the wrong set.
let redirectsLive: boolean | null = null;
async function partnersRedirect(request: APIRequestContext): Promise<boolean> {
  if (redirectsLive === null) {
    const response = await request.get('/partners', { maxRedirects: 0 });
    const status = response.status();
    redirectsLive = status >= 300 && status < 400;
  }
  return redirectsLive;
}

test.describe('partner route redirects', () => {
  for (const [from, to] of Object.entries(PARTNER_REDIRECTS)) {
    test(`${from} redirects to ${to}`, async ({ request }) => {
      test.skip(
        !(await partnersRedirect(request)),
        'the local fixture server reproduces cleanUrls only, not vercel.json redirects'
      );

      const response = await request.get(from, { maxRedirects: 0 });
      expect(response.status(), `${from} should be a permanent redirect`).toBe(308);
      expect(response.headers()['location'], `${from} should land on ${to}`).toContain(to);
    });
  }
});

test.describe('partner profiles', () => {
  for (const slug of CANONICAL_PARTNERS) {
    test(`/partners/${slug} renders its own decision layer`, async ({ page, request }) => {
      test.skip(
        await partnersRedirect(request),
        'this deployment redirects /partners/* - the redirect contract is covered above'
      );

      const response = await page.goto(`/partners/${slug}`);
      expect(response?.status()).toBe(200);

      await expect(page.locator('main h1')).toBeVisible();
      await expect(page.locator('.signature-architecture-section')).toBeVisible();
      await expect(page.locator('.buyer-decision-layer')).toBeVisible();

      // Four architecture steps come from the record; the fallback would also render four, so
      // assert on the record-specific title being present and non-generic.
      await expect(page.locator('.sig-step-card')).toHaveCount(4);
      const architectureTitle = await page.locator('.sig-title').innerText();
      expect(architectureTitle.trim().length).toBeGreaterThan(0);
      expect(architectureTitle).not.toContain('Technical Fit & Operating Model');
    });
  }

  test('the partner index links to every canonical profile', async ({ page, request }) => {
    test.skip(
      await partnersRedirect(request),
      'this deployment redirects /partners - the redirect contract is covered above'
    );

    await page.goto('/partners');

    for (const slug of CANONICAL_PARTNERS) {
      await expect(page.locator(`a[href="/partners/${slug}"]`).first()).toHaveCount(1);
    }
  });

  test('partner logos load rather than 404', async ({ page, request }) => {
    // Deliberately not skipped on a deployment. Whether the logo files are served is exactly the
    // kind of thing worth checking against the real origin, so when /partners is redirected the
    // sources come from the homepage ribbon, which renders the same eight assets everywhere.
    await page.goto((await partnersRedirect(request)) ? '/' : '/partners');

    const sources = await page.locator('img').evaluateAll((images) =>
      Array.from(
        new Set(
          images
            .map((img) => img.getAttribute('src') || '')
            .filter((src) => src.startsWith('/images/partners/'))
        )
      )
    );

    expect(sources.length).toBeGreaterThan(0);

    for (const src of sources) {
      const response = await request.get(src);
      expect(response.status(), `${src} should load`).toBe(200);
      const body = await response.body();
      expect(body.byteLength, `${src} should not be empty`).toBeGreaterThan(0);
    }
  });
});

test.describe('logo optical sizing', () => {
  // FastNetMon's lockup puts a lightning bolt above and below its wordmark, so its name is only
  // 39% of the file's height where StormWall's is 98%. Sizing every logo to the same pixel
  // height therefore renders one brand at half the size of the others. These tests hold the
  // correction in place on the two surfaces where the logos sit side by side.
  test('the ribbon renders FastNetMon at a comparable optical size', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() =>
      document.querySelectorAll('.marquee-track').forEach((track) => {
        (track as HTMLElement).style.animation = 'none';
        (track as HTMLElement).style.transform = 'translate3d(0,0,0)';
      })
    );
    await page.waitForTimeout(200);

    const heights = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.primary-track .partner-logo-img'))
        .map((img) => ({
          name: (img.getAttribute('src') || '').split('/').pop() || '',
          height: Math.round(img.getBoundingClientRect().height)
        }))
        .filter((entry) => entry.height > 0)
    );

    const fastnetmon = heights.find((entry) => entry.name.startsWith('fastnetmon'));
    const others = heights.filter((entry) => !entry.name.startsWith('fastnetmon'));

    expect(fastnetmon, 'FastNetMon should be in the ribbon').toBeTruthy();
    const median = others.map((o) => o.height).sort((a, b) => a - b)[Math.floor(others.length / 2)];

    // Taller than the rest, because its wordmark occupies less of its canvas.
    expect(fastnetmon!.height).toBeGreaterThan(median);
    // But not so tall that it breaks the row rhythm.
    expect(fastnetmon!.height).toBeLessThanOrEqual(median * 1.8);
  });

  test('the catalogue applies the same correction', async ({ page, request }) => {
    test.skip(
      await partnersRedirect(request),
      'the catalogue page is redirected on this deployment; the ribbon test above still covers the correction'
    );

    await page.goto('/partners');

    const heights = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.ledger-partner-logo')).map((img) => ({
        name: (img.getAttribute('src') || '').split('/').pop() || '',
        height: Math.round(img.getBoundingClientRect().height)
      }))
    );

    const fastnetmon = heights.find((entry) => entry.name.startsWith('fastnetmon'));
    const others = heights.filter((entry) => !entry.name.startsWith('fastnetmon') && entry.height > 0);
    const median = others.map((o) => o.height).sort((a, b) => a - b)[Math.floor(others.length / 2)];

    expect(fastnetmon!.height).toBeGreaterThan(median);
  });

  test('no logo overflows its ribbon slot', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() =>
      document.querySelectorAll('.marquee-track').forEach((track) => {
        (track as HTMLElement).style.animation = 'none';
        (track as HTMLElement).style.transform = 'translate3d(0,0,0)';
      })
    );
    await page.waitForTimeout(200);

    const overflowing = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.primary-track .partner-item'))
        .map((slot) => {
          const img = slot.querySelector('img');
          if (!img) return null;
          const slotBox = slot.getBoundingClientRect();
          const imgBox = img.getBoundingClientRect();
          if (imgBox.height === 0) return null;
          return imgBox.height > slotBox.height + 1
            ? `${(img.getAttribute('src') || '').split('/').pop()} ${Math.round(imgBox.height)}px in ${Math.round(slotBox.height)}px slot`
            : null;
        })
        .filter(Boolean)
    );

    expect(overflowing).toEqual([]);
  });
});
