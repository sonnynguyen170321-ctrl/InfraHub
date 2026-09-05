// scripts/optimize-partner-logos.mjs
//
// Partner logos are used at 30px tall in the ribbon and about 90px wide in the catalogue, but
// the official brand-kit files are up to 2658px wide. This resizes the delivered copies to a
// sensible maximum while keeping the untouched originals in docs/brand-source/, so provenance
// still points at the file the partner published.
//
// Nothing about the artwork changes: no recolouring, no cropping, no re-composition. Only the
// pixel dimensions of the delivered copy.
//
//   node scripts/optimize-partner-logos.mjs

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const DELIVERED = path.resolve('public/images/partners');
const ORIGINALS = path.resolve('docs/brand-source/partners');
// Logos render at 156px wide in the ribbon and about 120px in the catalogue. 600px is a 2x
// delivery copy with room to spare; the untouched originals stay in docs/brand-source.
const MAX_WIDTH = 600;

fs.mkdirSync(ORIGINALS, { recursive: true });

const files = fs.readdirSync(DELIVERED).filter((file) => /\.png$/i.test(file));
let changed = 0;

for (const file of files) {
  const deliveredPath = path.join(DELIVERED, file);
  const originalPath = path.join(ORIGINALS, file);

  const metadata = await sharp(deliveredPath).metadata();
  if (!metadata.width || metadata.width <= MAX_WIDTH) {
    console.log(`${file}: ${metadata.width}px wide — left as is`);
    continue;
  }

  // Keep the official file exactly as published before touching the delivered copy.
  if (!fs.existsSync(originalPath)) fs.copyFileSync(deliveredPath, originalPath);

  const before = fs.statSync(deliveredPath).size;
  const resized = await sharp(originalPath)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();

  fs.writeFileSync(deliveredPath, resized);
  const after = fs.statSync(deliveredPath).size;
  changed += 1;

  console.log(
    `${file}: ${metadata.width}px ${(before / 1024).toFixed(0)}kb -> ${MAX_WIDTH}px ${(after / 1024).toFixed(0)}kb`
  );
}

console.log(`\n${changed} logo(s) resized; originals preserved in docs/brand-source/partners/`);
