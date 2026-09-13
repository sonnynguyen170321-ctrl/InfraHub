// scripts/capture-matrix.mjs
//
// Captures the release screenshot matrix: the homepage at every viewport the directive names,
// plus the desktop scene states that only exist part-way through a scroll.
//
//   node scripts/capture-matrix.mjs            # against the built output on :4331
//   BASE=http://localhost:4399 node scripts/capture-matrix.mjs
//
// Output goes to screenshots/, which is git-ignored: these are evidence for a review, not
// artefacts of the site.

import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const BASE = process.env.BASE || 'http://localhost:4331';
const OUT = path.resolve('screenshots');

const VIEWPORTS = [
  [1440, 900],
  [1366, 768],
  [1280, 800],
  [1100, 800],
  [1024, 768],
  [768, 1024],
  [430, 932],
  [390, 844],
  [375, 812],
  [320, 568]
];

// Scenes that only exist at a scroll position, captured at 1440x900.
const SCENES = [
  { name: 'hero', scrollTo: () => 0 },
  { name: 'partners', selector: '.partner-trust-ribbon' },
  { name: 'solutions-infrastructure', scene: 'discoveryScene', sticky: '.discovery-sticky', fraction: 0.06 },
  { name: 'solutions-network', scene: 'discoveryScene', sticky: '.discovery-sticky', fraction: 0.5 },
  { name: 'process-match', selector: '#step-match', offset: 280 },
  { name: 'route-logical', scene: 'routeScene', sticky: '.route-sticky', fraction: 0.05 },
  { name: 'route-physical', scene: 'routeScene', sticky: '.route-sticky', fraction: 0.35 },
  { name: 'route-risk', scene: 'routeScene', sticky: '.route-sticky', fraction: 0.62 },
  { name: 'offers', selector: '#featured-offers', offset: 120 },
  { name: 'final-cta', selector: '#contact', offset: 120 }
];

fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

async function settle(page) {
  await page.waitForTimeout(450);
}

// ── Viewport matrix ────────────────────────────────────────────────────────
for (const [width, height] of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  await settle(page);

  await page.screenshot({ path: path.join(OUT, `home-${width}x${height}-fold.png`) });
  await page.screenshot({ path: path.join(OUT, `home-${width}x${height}-full.png`), fullPage: true });

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  console.log(`${width}x${height}  horizontal overflow: ${overflow}px`);

  await context.close();
}

// ── Desktop scene states ───────────────────────────────────────────────────
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
await page.goto(BASE, { waitUntil: 'load' });

for (const shot of SCENES) {
  if (shot.scene) {
    await page.evaluate(
      ({ scene, sticky, fraction }) => {
        const el = document.getElementById(scene);
        const stickyEl = el?.querySelector(sticky);
        if (!el || !stickyEl) return;
        const travel = el.offsetHeight - stickyEl.offsetHeight;
        const top = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo(0, Math.round(top + travel * fraction));
      },
      shot
    );
  } else if (shot.selector) {
    await page.evaluate(
      ({ selector, offset }) => {
        const el = document.querySelector(selector);
        if (!el) return;
        window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - (offset || 90));
      },
      shot
    );
  } else {
    await page.evaluate(() => window.scrollTo(0, 0));
  }

  await settle(page);
  await page.screenshot({ path: path.join(OUT, `scene-${shot.name}.png`) });
  console.log(`captured scene: ${shot.name}`);
}

await context.close();

// ── Reduced motion, one full page ──────────────────────────────────────────
const rmContext = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'reduce'
});
const rmPage = await rmContext.newPage();
await rmPage.emulateMedia({ reducedMotion: 'reduce' });
await rmPage.goto(BASE, { waitUntil: 'load' });
await settle(rmPage);
await rmPage.screenshot({ path: path.join(OUT, 'home-reduced-motion-full.png'), fullPage: true });
console.log('captured: reduced motion full page');
await rmContext.close();

await browser.close();
console.log(`\nmatrix written to ${OUT}`);
