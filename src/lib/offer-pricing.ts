// src/lib/offer-pricing.ts
//
// Public price gating for offer records.
//
// An exact price is a commercial statement. It may only reach a public page when the
// record carries evidence that someone confirmed it: an owner-approved publication flag,
// a price status that names where the number came from, a display value, and a reference
// to the source of that number. Anything short of that renders the request label instead.
//
// The gate is deliberately fail-closed: a record that is merely present in markdown, or
// merely has a number in it, is not publishable.

export const PRICE_REQUEST_LABEL = 'Request current pricing';

/** Price statuses that describe a confirmed commercial source. */
export const PUBLISHABLE_PRICE_STATUSES = ['confirmed_allocation', 'partner_quote'] as const;

export type PublishablePriceStatus = (typeof PUBLISHABLE_PRICE_STATUSES)[number];

export interface OfferPriceFacts {
  publicApproved?: boolean;
  priceStatus?: string;
  displayPrice?: string;
  verifiedPrice?: string;
  priceSourceRef?: string;
}

/**
 * A display value that is itself a request-for-pricing placeholder is not an exact price.
 * Records use this wording while awaiting confirmation, so treat it as "no price".
 */
function isPlaceholder(value: string): boolean {
  const normalised = value.trim().toLowerCase();
  return (
    normalised.length === 0 ||
    normalised === PRICE_REQUEST_LABEL.toLowerCase() ||
    normalised.includes('request') ||
    normalised.includes('quote on') ||
    normalised.includes('tbc') ||
    normalised.includes('tbd')
  );
}

/**
 * True only when every publication condition holds. `priceSourceRef` is required rather
 * than preferred: without it there is no way to answer "who quoted this, and when?".
 */
export function canPublishExactPrice(offer: OfferPriceFacts): boolean {
  if (offer.publicApproved !== true) return false;

  const status = offer.priceStatus;
  if (!status) return false;
  if (!(PUBLISHABLE_PRICE_STATUSES as readonly string[]).includes(status)) return false;

  const display = offer.displayPrice ?? offer.verifiedPrice;
  if (!display || isPlaceholder(display)) return false;

  if (!offer.priceSourceRef || offer.priceSourceRef.trim().length === 0) return false;

  return true;
}

/**
 * The string a public surface may render for this offer. Never returns an unconfirmed
 * number, so callers can use it directly without repeating the gate.
 */
export function publicPriceLabel(offer: OfferPriceFacts): string {
  if (!canPublishExactPrice(offer)) return PRICE_REQUEST_LABEL;
  return (offer.displayPrice ?? offer.verifiedPrice) as string;
}
