// scripts/logo-qa.mjs
//
// The optical calibration surface for partner logos.
//
// It is a script rather than a route because this project builds with output: 'static', so any
// file under src/pages is emitted into dist and published. A QA surface must not ship, and the
// alternative — a page that renders nothing in production — still publishes the URL.
//
// It drives the real ribbon rather than a reproduction: same component, same slot geometry,
// same background, animation stopped and the landing tilt neutralised so nothing is measured
// through a 3D projection. Every lockup is captured at 75%, 100% and 125% so that a correction
// can be judged at the sizes a visitor actually meets.
//
//   node scripts/logo-qa.mjs [url]        default http://localhost:4321/
//
// Writes a sheet plus per-brand measurements to node_modules/.cache/logo-qa/.

import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const URL = process.argv[2] || 'http://localhost:4321/';
const OUT = 'node_modules/.cache/logo-qa';
const ZOOMS = [0.75, 1, 1.25];

fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 900 } });
await page.goto(URL, { waitUntil: 'load' });
await page.waitForTimeout(900);

// Stop everything that would make two captures differ for reasons other than the artwork.
await page.evaluate(() => {
  const sec = document.querySelector('.partner-trust-ribbon');
  const inner = document.querySelector('.ribbon-inner');
  const strip = document.querySelector('.marquee-strip');
  sec.style.setProperty('--ribbon-land', '1');
  inner.style.transform = 'none';
  strip.style.animation = 'none';
  strip.style.transform = 'none';
  document.querySelector('.ribbon-track-wrapper').style.maskImage = 'none';
});
await page.waitForTimeout(200);

const rows = [];
const tiles = [];

for (const zoom of ZOOMS) {
  await page.evaluate((z) => { document.documentElement.style.zoom = String(z); }, zoom);
  await page.waitForTimeout(400);

  const measured = await page.evaluate(() => {
    const ground = getComputedStyle(document.querySelector('.partner-trust-ribbon')).backgroundColor;
    return [...document.querySelectorAll('.primary-track .partner-item')].map((slot) => {
      const img = slot.querySelector('img');
      const s = slot.getBoundingClientRect();
      const i = img.getBoundingClientRect();
      return {
        name: (img.getAttribute('alt') || '').replace(/ logo$/, ''),
        file: (img.getAttribute('src') || '').split('/').pop(),
        slotW: Math.round(s.width), slotH: Math.round(s.height),
        drawnW: Math.round(i.width), drawnH: Math.round(i.height),
        // How much of its slot the mark actually claims. Two brands can share a height cap and
        // still read at different sizes; this is the number that exposes that.
        fillW: +((i.width / s.width) * 100).toFixed(1),
        fillH: +((i.height / s.height) * 100).toFixed(1),
        offsetY: Math.round((i.top - s.top) - (s.bottom - i.bottom)),
        ground,
      };
    });
  });
  rows.push({ zoom, measured });

  /*
   * Element capture rather than a clipped page shot: under document zoom, layout coordinates
   * and device pixels diverge, so a clip computed from boundingBox lands outside the image.
   */
  const ribbon = page.locator('.partner-trust-ribbon');
  await ribbon.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  const shot = await ribbon.screenshot();
  tiles.push(await sharp(shot).resize({ width: 1400 }).toBuffer());
}

await page.evaluate(() => { document.documentElement.style.zoom = '1'; });
await browser.close();

const metas = await Promise.all(tiles.map((t) => sharp(t).metadata()));
const height = metas.reduce((a, m) => a + m.height + 10, 0);
await sharp({ create: { width: 1400, height, channels: 3, background: '#1b1d21' } })
  .composite(tiles.map((t, i) => ({ input: t, left: 0, top: metas.slice(0, i).reduce((a, m) => a + m.height + 10, 0) })))
  .png()
  .toFile(path.join(OUT, 'sheet.png'));

fs.writeFileSync(path.join(OUT, 'measurements.json'), JSON.stringify(rows, null, 2));

const at100 = rows.find((r) => r.zoom === 1).measured;
console.log(`ground ${at100[0].ground}   slot ${at100[0].slotW}x${at100[0].slotH}\n`);
console.log('brand           file                  drawn      % of slot w/h   offsetY');
for (const m of at100) {
  console.log(
    m.name.padEnd(16) + m.file.padEnd(22) +
    `${m.drawnW}x${m.drawnH}`.padEnd(11) +
    `${m.fillW}% / ${m.fillH}%`.padEnd(16) + m.offsetY);
}
const widths = at100.map((m) => m.drawnW);
console.log(`\nwidest ${Math.max(...widths)}px, narrowest ${Math.min(...widths)}px, spread ${Math.max(...widths) - Math.min(...widths)}px`);
console.log(`\nsheet: ${path.join(OUT, 'sheet.png')} (75% / 100% / 125%)`);
