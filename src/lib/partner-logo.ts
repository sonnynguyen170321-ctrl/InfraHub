// src/lib/partner-logo.ts
//
// Optical sizing for partner lockups.
//
// Logos are compared by the size of the *name*, not by the size of the file's canvas. Those
// two are not the same thing: StormWall's wordmark fills 98% of its canvas height, Zenlayer's
// 69%, and FastNetMon's only 39% — its lightning bolt overshoots the wordmark above and below.
// Cap every logo at the same pixel height and FastNetMon's name renders at half the size of
// everyone else's, which is what made it look like an afterthought in the ribbon.
//
// logoScale on the partner record raises (or lowers) the height cap for such lockups. It is an
// optical correction to the delivery size, never a change to the artwork.

/** Pixel height for a partner's logo on a surface whose base height is `base`. */
export function logoHeight(scale: number | undefined, base: number): number {
  return Math.round(base * (scale ?? 1));
}

/**
 * Inline style for a surface that sizes logos by a fixed height (catalogue rows, profile
 * headers). Returns undefined at scale 1 so the stylesheet keeps control in the common case.
 */
export function logoHeightStyle(scale: number | undefined, base: number): string | undefined {
  if (!scale || scale === 1) return undefined;
  return `height: ${logoHeight(scale, base)}px;`;
}

/**
 * The ribbon's base logo height changes with the breakpoint, so the optical correction has to
 * reach CSS as a multiplier rather than as an already-resolved pixel value. A resolved inline
 * max-height cannot answer a media query, which is how a 1.5-scaled lockup came to be 54px tall
 * inside a 50px slot: the base moved and the inline value could not follow.
 */
export function logoScaleStyle(scale: number | undefined): string | undefined {
  if (!scale || scale === 1) return undefined;
  return `--logo-scale: ${scale};`;
}
