import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

// Offer publication gates, asserted against the built site rather than the source: a record
// that is not publicly approved must have produced no public surface at all.

const OFFERS_DIR = path.resolve('src/content/offers');
const DIST = path.resolve('dist/client');

interface OfferRecord {
  slug: string;
  status: string;
  publicApproved: boolean;
  priceStatus: string;
  displayPrice?: string;
}

function readOffers(): OfferRecord[] {
  return fs
    .readdirSync(OFFERS_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(OFFERS_DIR, file), 'utf8');
      const value = (key: string) => {
        const match = raw.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'));
        return match ? match[1].trim().replace(/^["']|["']$/g, '') : '';
      };
      return {
        slug: path.basename(file, '.md'),
        status: value('status') || 'active',
        publicApproved: value('publicApproved') === 'true',
        priceStatus: value('priceStatus') || 'indicative',
        displayPrice: value('displayPrice')
      };
    });
}

const offers = readOffers();
const unapproved = offers.filter((offer) => !offer.publicApproved || offer.status !== 'active');
const published = offers.filter((offer) => offer.publicApproved && offer.status === 'active');

test.describe('offer publication gates', () => {
  test('the corpus is readable', () => {
    expect(offers.length).toBeGreaterThan(0);
  });

  for (const offer of unapproved) {
    test(`${offer.slug} (${offer.status}, publicApproved=${offer.publicApproved}) has no public route`, async ({
      request
    }) => {
      const built = path.join(DIST, 'offers', offer.slug, 'index.html');
      expect(fs.existsSync(built), `${offer.slug} must not be built`).toBe(false);

      const response = await request.get(`/offers/${offer.slug}`);
      expect(response.status()).toBe(404);
    });

    test(`${offer.slug} is absent from the offers board and the homepage`, async ({ page }) => {
      for (const route of ['/offers', '/']) {
        await page.goto(route);
        await expect(
          page.locator(`a[href="/offers/${offer.slug}"]`),
          `${offer.slug} must not be linked from ${route}`
        ).toHaveCount(0);
      }
    });
  }

  test('the offers board reflects only published records', async ({ page }) => {
    await page.goto('/offers');

    if (published.length === 0) {
      await expect(page.locator('.offers-empty-state')).toBeVisible();
      return;
    }

    for (const offer of published) {
      await expect(page.locator(`a[href="/offers/${offer.slug}"]`).first()).toHaveCount(1);
    }
  });

  test('no unverified price is ever displayed as an exact public price', async ({ page }) => {
    const unverified = offers.filter(
      (offer) => !['confirmed_allocation', 'partner_quote'].includes(offer.priceStatus)
    );

    await page.goto('/offers');
    const boardText = await page.locator('body').innerText();

    for (const offer of unverified) {
      const price = offer.displayPrice || '';
      const looksLikeAmount = /\d/.test(price) && /[$€£]|\/mo|per month/i.test(price);
      if (looksLikeAmount) {
        expect(boardText, `${offer.slug} price must not be public`).not.toContain(price);
      }
    }

    // Every price shown on the board must either be a published exact price or the request label.
    const shown = await page.locator('.price-amount').allInnerTexts();
    for (const label of shown) {
      const belongsToPublished = published.some((offer) => offer.displayPrice === label.trim());
      expect(
        belongsToPublished || label.trim() === 'Request current pricing',
        `unexpected public price "${label}"`
      ).toBe(true);
    }
  });

  test('expired records are not treated as active', () => {
    for (const offer of published) {
      const raw = fs.readFileSync(path.join(OFFERS_DIR, `${offer.slug}.md`), 'utf8');
      const expiry = raw.match(/^expiryDate:\s*(.*)$/m)?.[1]?.trim();
      expect(expiry, `${offer.slug} is active and must carry an expiryDate`).toBeTruthy();
      expect(new Date(expiry as string).getTime()).toBeGreaterThan(Date.now());
    }
  });
});
