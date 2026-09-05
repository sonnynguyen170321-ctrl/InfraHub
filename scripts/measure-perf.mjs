// scripts/measure-perf.mjs
//
// Measures what the homepage actually costs: bytes by type, LCP, CLS, and long tasks, on a
// warm run and on a throttled one. Reports numbers, not a verdict.
//
//   node scripts/measure-perf.mjs
//   BASE=http://localhost:4331 node scripts/measure-perf.mjs

import { chromium } from '@playwright/test';

const BASE = process.env.BASE || 'http://localhost:4331';

function kb(bytes) {
  return `${(bytes / 1024).toFixed(1)}kb`;
}

async function run({ throttle }) {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const bytes = { document: 0, script: 0, stylesheet: 0, image: 0, font: 0, other: 0 };

  page.on('response', async (response) => {
    try {
      const headers = response.headers();
      const size = Number(headers['content-length'] || 0);
      const type = response.request().resourceType();
      const bucket = type in bytes ? type : 'other';
      bytes[bucket] += size || (await response.body().catch(() => Buffer.alloc(0))).byteLength;
    } catch {
      /* a response body that cannot be read does not invalidate the rest */
    }
  });

  if (throttle) {
    const client = await context.newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8
    });
    await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  }

  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForTimeout(2500);

  const vitals = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const result = { lcp: 0, cls: 0, longTasks: 0, longTaskMs: 0 };

        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) result.lcp = Math.round(entry.startTime);
        }).observe({ type: 'largest-contentful-paint', buffered: true });

        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const shift = entry;
            if (!shift.hadRecentInput) result.cls += shift.value;
          }
        }).observe({ type: 'layout-shift', buffered: true });

        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            result.longTasks += 1;
            result.longTaskMs += Math.round(entry.duration);
          }
        }).observe({ type: 'longtask', buffered: true });

        setTimeout(() => {
          result.cls = Number(result.cls.toFixed(4));
          resolve(result);
        }, 600);
      })
  );

  // A scroll pass: the scenes only do their work once the reader moves.
  const scrollStart = Date.now();
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.5;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    }
  });
  const scrollMs = Date.now() - scrollStart;

  const afterScroll = await page.evaluate(() => ({
    cls: performance
      .getEntriesByType('layout-shift')
      .filter((entry) => !entry.hadRecentInput)
      .reduce((total, entry) => total + entry.value, 0)
  }));

  await browser.close();

  return { bytes, vitals, scrollMs, clsAfterScroll: Number(afterScroll.cls.toFixed(4)) };
}

for (const mode of [{ throttle: false }, { throttle: true }]) {
  const label = mode.throttle ? 'throttled (4x CPU, ~1.6Mbps)' : 'unthrottled';
  const { bytes, vitals, scrollMs, clsAfterScroll } = await run(mode);
  const total = Object.values(bytes).reduce((a, b) => a + b, 0);

  console.log(`\n── ${label} ──`);
  console.log(
    `  document ${kb(bytes.document)} · script ${kb(bytes.script)} · css ${kb(bytes.stylesheet)} · images ${kb(bytes.image)} · fonts ${kb(bytes.font)} · other ${kb(bytes.other)}`
  );
  console.log(`  total transferred: ${kb(total)}`);
  console.log(`  LCP ${vitals.lcp}ms · CLS ${vitals.cls} (after full scroll: ${clsAfterScroll})`);
  console.log(`  long tasks: ${vitals.longTasks} totalling ${vitals.longTaskMs}ms`);
  console.log(`  full-page scroll pass: ${scrollMs}ms`);
}
