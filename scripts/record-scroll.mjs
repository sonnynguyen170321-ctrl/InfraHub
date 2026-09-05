// scripts/record-scroll.mjs
//
// Records a full-page scroll of the homepage as video: a still screenshot cannot show whether
// a scene holds, hands over, or stutters.
//
// Produces three recordings in screenshots/video/ (git-ignored):
//   desktop 1440x900, mobile 390x844, and desktop under reduced motion.
//
//   node scripts/record-scroll.mjs
//   BASE=http://localhost:4331 node scripts/record-scroll.mjs

import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const BASE = process.env.BASE || 'http://localhost:4331';
const OUT = path.resolve('screenshots/video');

fs.mkdirSync(OUT, { recursive: true });

// A human-paced scroll: roughly 900 CSS pixels per second, which is a firm but readable
// wheel scroll, so the recording shows what a reader actually experiences.
async function scrollThrough(page, pixelsPerSecond = 900) {
  await page.evaluate(async (speed) => {
    const total = document.body.scrollHeight - window.innerHeight;
    const startedAt = performance.now();

    await new Promise((resolve) => {
      function step(now) {
        const elapsed = (now - startedAt) / 1000;
        const y = Math.min(elapsed * speed, total);
        window.scrollTo(0, y);
        if (y >= total) resolve(null);
        else requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, pixelsPerSecond);
}

async function record({ name, viewport, reducedMotion }) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport,
    recordVideo: { dir: OUT, size: viewport },
    reducedMotion: reducedMotion ? 'reduce' : 'no-preference'
  });

  const page = await context.newPage();
  if (reducedMotion) await page.emulateMedia({ reducedMotion: 'reduce' });

  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForTimeout(1200); // let the hero reveal finish before moving
  await scrollThrough(page);
  await page.waitForTimeout(800);

  const video = page.video();
  await context.close();

  if (video) {
    const target = path.join(OUT, `${name}.webm`);
    if (fs.existsSync(target)) fs.rmSync(target);
    fs.renameSync(await video.path(), target);
    const size = fs.statSync(target).size;
    console.log(`${name}: ${(size / 1024 / 1024).toFixed(1)}MB  ${target}`);
  }

  await browser.close();
}

await record({ name: 'homepage-desktop', viewport: { width: 1440, height: 900 } });
await record({ name: 'homepage-mobile', viewport: { width: 390, height: 844 } });
await record({
  name: 'homepage-reduced-motion',
  viewport: { width: 1440, height: 900 },
  reducedMotion: true
});

console.log('\nrecordings written to screenshots/video/');
