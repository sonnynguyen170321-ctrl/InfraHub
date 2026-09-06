/**
 * Visual baseline / regression capture (master plan §25, §26).
 *
 * Captures the viewport set the redesign is verified against, plus console errors and
 * failed requests per page, into a phase-scoped folder so later phases can diff against
 * the pre-redesign baseline.
 *
 *   node scripts/visual-baseline.mjs --phase 00-baseline
 *   node scripts/visual-baseline.mjs --phase 07-homepage --only /
 *
 * Expects a server already running (scripts/static-server.mjs, default port 4331).
 * Set BASE_URL to point elsewhere, e.g. a Vercel preview.
 */

import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4331';

// §25 responsive design standard: the exact sizes the redesign must be verified at.
const VIEWPORTS = [
  { name: '1920x1080', width: 1920, height: 1080 },
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1366x768', width: 1366, height: 768 },
  { name: '1280x800', width: 1280, height: 800 },
  { name: '1024x768', width: 1024, height: 768 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '430x932', width: 430, height: 932 },
  { name: '390x844', width: 390, height: 844 },
  { name: '360x800', width: 360, height: 800 }
];

// The homepage carries the five acts, so it gets the full viewport sweep. Representative
// pages for each other surface get the three sizes that actually change layout decisions.
const FULL_SWEEP = ['/'];
const KEY_SIZES = ['1440x900', '768x1024', '390x844'];
const PAGES = [
  '/',
  '/wavelengths',
  '/partners',
  '/partners/fastnetmon',
  '/about',
  '/how-we-work',
  '/lets-talk',
  '/solutions/network-connectivity',
  '/insights'
];

function arg(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const phase = arg('--phase', '00-baseline');
const only = arg('--only', null);
const outDir = path.join('docs', 'redesign', 'visual', phase);
const pages = only ? [only] : PAGES;

function slug(route) {
  return route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-');
}

const report = [];

const browser = await chromium.launch();

for (const route of pages) {
  const wanted = FULL_SWEEP.includes(route)
    ? VIEWPORTS
    : VIEWPORTS.filter((v) => KEY_SIZES.includes(v.name));

  for (const vp of wanted) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2
    });
    const page = await context.newPage();

    const consoleErrors = [];
    const failedRequests = [];
    page.on('console', (m) => {
      if (m.type() === 'error') consoleErrors.push(m.text());
    });
    page.on('requestfailed', (r) => {
      failedRequests.push(`${r.url()} — ${r.failure()?.errorText ?? 'unknown'}`);
    });

    const dir = path.join(outDir, slug(route));
    fs.mkdirSync(dir, { recursive: true });

    const started = Date.now();
    const response = await page.goto(BASE_URL + route, {
      waitUntil: 'networkidle',
      timeout: 45000
    });
    const loadMs = Date.now() - started;

    // A mistyped route otherwise captures a 404 page and files it as a valid baseline.
    if (!response || response.status() >= 400) {
      throw new Error(
        `${route} returned HTTP ${response ? response.status() : 'no response'} — ` +
          'fix the route list rather than baselining an error page'
      );
    }

    await page.screenshot({ path: path.join(dir, `${vp.name}-viewport.png`) });
    if (vp.name === '1440x900' || vp.name === '390x844') {
      await page.screenshot({ path: path.join(dir, `${vp.name}-full.png`), fullPage: true });
    }

    report.push({
      route,
      viewport: vp.name,
      loadMs,
      consoleErrors: consoleErrors.length,
      failedRequests: failedRequests.length,
      details: { consoleErrors, failedRequests }
    });

    console.log(
      `${route.padEnd(24)} ${vp.name.padEnd(10)} ${String(loadMs).padStart(5)}ms  ` +
        `errors=${consoleErrors.length} failed=${failedRequests.length}`
    );

    await context.close();
  }
}

await browser.close();

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'capture-report.json'), JSON.stringify(report, null, 2));

const totalErrors = report.reduce((n, r) => n + r.consoleErrors, 0);
const totalFailed = report.reduce((n, r) => n + r.failedRequests, 0);
console.log(`\ncaptures: ${report.length}`);
console.log(`console errors: ${totalErrors}`);
console.log(`failed requests: ${totalFailed}`);
console.log(`written to: ${outDir}`);

// A baseline with runtime errors is still a valid baseline - it is a record, not a gate.
// Report the state, do not fail the capture.
process.exit(0);
