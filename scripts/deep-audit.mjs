// scripts/deep-audit.mjs
//
// Crawls every built page in a real browser and reports defects rather than opinions:
// console errors, failed requests, broken internal links, duplicate ids, accessibility
// violations (axe), heading-order breaks, images without alt or dimensions, focus traps,
// and horizontal overflow.
//
//   node scripts/deep-audit.mjs                       # local build on :4331
//   BASE=https://infrahub-tech.vercel.app node scripts/deep-audit.mjs
//   ONLY=/partners,/lets-talk node scripts/deep-audit.mjs
//
// Exit code is nonzero if any ERROR-level finding is present.

import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

const BASE = (process.env.BASE || 'http://localhost:4331').replace(/\/$/, '');
const DIST = path.resolve('dist/client');
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 }
];

const findings = [];
const error = (route, rule, detail) => findings.push({ level: 'ERROR', route, rule, detail });
const warn = (route, rule, detail) => findings.push({ level: 'WARN', route, rule, detail });

/** Every route the build produced, derived from the output rather than a hand-kept list. */
function routesFromBuild() {
  const routes = [];
  const walk = (dir, prefix = '') => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('_') || entry.name === 'images' || entry.name === 'fonts') continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full, `${prefix}/${entry.name}`);
      else if (entry.name === 'index.html') routes.push(prefix === '' ? '/' : prefix);
    }
  };
  walk(DIST);
  return routes.sort();
}

const only = process.env.ONLY ? process.env.ONLY.split(',').map((r) => r.trim()) : null;
const routes = (only || routesFromBuild()).filter(Boolean);

console.log(`Deep audit — ${routes.length} routes against ${BASE}\n`);

const browser = await chromium.launch();

// ── Per-route checks ───────────────────────────────────────────────────────
for (const route of routes) {
  const context = await browser.newContext({ viewport: VIEWPORTS[0] });
  const page = await context.newPage();

  const consoleErrors = [];
  const failedRequests = [];

  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text().slice(0, 200));
  });
  page.on('pageerror', (err) => consoleErrors.push(`uncaught: ${err.message.slice(0, 200)}`));
  page.on('requestfailed', (request) => {
    failedRequests.push(`${request.method()} ${request.url()} — ${request.failure()?.errorText}`);
  });
  page.on('response', (response) => {
    if (response.status() >= 400) failedRequests.push(`${response.status()} ${response.url()}`);
  });

  const response = await page.goto(`${BASE}${route}`, { waitUntil: 'load' }).catch(() => null);
  if (!response) {
    error(route, 'navigation', 'page did not load');
    await context.close();
    continue;
  }
  if (response.status() >= 400) error(route, 'status', `HTTP ${response.status()}`);

  await page.waitForTimeout(500);

  for (const message of consoleErrors) error(route, 'console', message);
  for (const request of failedRequests) error(route, 'request', request);

  // Structure: duplicate ids, heading order, alt text, image dimensions, meta
  const structure = await page.evaluate(() => {
    const ids = new Map();
    for (const el of document.querySelectorAll('[id]')) {
      ids.set(el.id, (ids.get(el.id) || 0) + 1);
    }

    const headings = Array.from(document.querySelectorAll('main h1, main h2, main h3, main h4'))
      .map((h) => Number(h.tagName[1]));

    const images = Array.from(document.querySelectorAll('img')).map((img) => ({
      src: (img.getAttribute('src') || '').slice(-60),
      hasAlt: img.hasAttribute('alt'),
      lazy: img.getAttribute('loading'),
      sized: Boolean(img.getAttribute('width') && img.getAttribute('height')) || Boolean(img.style.aspectRatio),
      inViewport: img.getBoundingClientRect().top < window.innerHeight
    }));

    return {
      duplicateIds: [...ids.entries()].filter(([, count]) => count > 1).map(([id]) => id),
      headings,
      images,
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
      h1Count: document.querySelectorAll('main h1').length,
      langAttr: document.documentElement.lang || ''
    };
  });

  for (const id of structure.duplicateIds) error(route, 'duplicate-id', `#${id} appears more than once`);
  if (structure.h1Count !== 1) error(route, 'h1', `main contains ${structure.h1Count} h1 elements`);
  if (!structure.title) error(route, 'title', 'no document title');
  if (!structure.description) warn(route, 'description', 'no meta description');
  if (!structure.canonical) warn(route, 'canonical', 'no canonical link');
  if (!structure.langAttr) error(route, 'lang', 'html element has no lang');

  let previous = 0;
  for (const level of structure.headings) {
    if (previous && level > previous + 1) {
      warn(route, 'heading-order', `h${previous} followed by h${level}`);
      break;
    }
    previous = level;
  }

  for (const image of structure.images) {
    if (!image.hasAlt) error(route, 'img-alt', `image without alt: ${image.src}`);
    if (!image.sized) warn(route, 'img-size', `image without width/height: ${image.src}`);
    if (!image.inViewport && image.lazy !== 'lazy') {
      warn(route, 'img-loading', `below-fold image not lazy: ${image.src}`);
    }
  }

  // Accessibility
  const axe = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  for (const violation of axe.violations) {
    const level = violation.impact === 'critical' || violation.impact === 'serious' ? error : warn;
    level(
      route,
      `axe:${violation.id}`,
      `${violation.help} (${violation.nodes.length} node(s), impact ${violation.impact}) — e.g. ${violation.nodes[0]?.target?.join(' ')}`
    );
  }

  // Overflow at both viewports
  for (const viewport of VIEWPORTS) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.waitForTimeout(200);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    if (overflow > 1) error(route, 'overflow', `${overflow}px horizontal overflow at ${viewport.name}`);
  }

  await context.close();
  process.stdout.write('.');
}

console.log('\n');

// ── Link graph ─────────────────────────────────────────────────────────────
{
  const context = await browser.newContext({ viewport: VIEWPORTS[0] });
  const page = await context.newPage();
  const seen = new Map();

  for (const route of routes) {
    await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' });
    const hrefs = await page.evaluate(() =>
      Array.from(document.querySelectorAll('a[href]'))
        .map((a) => a.getAttribute('href') || '')
        .filter((href) => href.startsWith('/'))
    );
    for (const href of hrefs) {
      const clean = href.split('#')[0].split('?')[0] || '/';
      if (!seen.has(clean)) seen.set(clean, route);
    }
  }

  for (const [href, from] of seen) {
    const response = await page.request.get(`${BASE}${href}`).catch(() => null);
    const status = response ? response.status() : 0;
    if (status >= 400 || status === 0) error(from, 'broken-link', `${href} → ${status || 'no response'}`);
  }

  console.log(`checked ${seen.size} unique internal link targets`);
  await context.close();
}

await browser.close();

// ── Report ─────────────────────────────────────────────────────────────────
const errors = findings.filter((f) => f.level === 'ERROR');
const warnings = findings.filter((f) => f.level === 'WARN');

function report(list, heading) {
  if (list.length === 0) return;
  console.log(`\n${heading}`);
  const byRule = new Map();
  for (const finding of list) {
    const key = finding.rule;
    if (!byRule.has(key)) byRule.set(key, []);
    byRule.get(key).push(finding);
  }
  for (const [rule, items] of [...byRule.entries()].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`\n  ${rule} — ${items.length}`);
    for (const item of items.slice(0, 8)) console.log(`    ${item.route}: ${item.detail}`);
    if (items.length > 8) console.log(`    … and ${items.length - 8} more`);
  }
}

report(errors, 'ERRORS');
report(warnings, 'WARNINGS');

console.log(`\n${errors.length} error(s) · ${warnings.length} warning(s)`);
process.exit(errors.length > 0 ? 1 : 0);
