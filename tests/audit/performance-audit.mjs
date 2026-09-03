// tests/audit/performance-audit.mjs
//
// WS-15 — static performance and social-metadata budget over the built site.
//
// The collaboration directive sets Core Web Vitals targets (§29: LCP <= 2.5s, INP <= 200ms,
// CLS <= 0.1) and a warning against reaching the VCG-style photographic layout by shipping
// enormous unoptimised images. It also requires appropriate OG metadata on every indexable
// page (§31).
//
// WHAT THIS CANNOT DO. LCP, INP and CLS are measurements of a real page load in a real
// browser. Nothing here measures them. What this audits is the set of static properties that
// reliably *predict* them and that can be checked without a browser: transferred weight,
// render-blocking resources in <head>, third-party origins on the critical path, font
// strategy, inline script volume, and stylesheet scoping.
//
// Treat a pass as "no obvious structural cause of a slow load", not as "fast".
//
//   node tests/audit/performance-audit.mjs
//
// Exit code is nonzero on any ERROR. Warnings are advisory.

import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist/client');

if (!fs.existsSync(DIST)) {
  console.error('dist/client does not exist. Run "npm run build" first.');
  process.exit(1);
}

// Budgets. Deliberately generous — these flag outliers, not house style.
const BUDGET = {
  htmlBytes: 100 * 1024, // a single document over 100 KB is carrying too much
  inlineScriptBytes: 16 * 1024, // inline JS blocks parsing
  inlineStyleBytes: 24 * 1024,
  maxFontFamilies: 2, // §29: max two families unless there is a clear reason
  maxBlockingStylesheets: 3
};

const findings = [];
const error = (page, rule, detail) => findings.push({ level: 'ERROR', page, rule, detail });
const warn = (page, rule, detail) => findings.push({ level: 'WARN', page, rule, detail });

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(full);
    return entry.name.endsWith('.html') ? [full] : [];
  });
}

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;
const attrOf = (tag, name) => {
  const m = tag.match(new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, 'i'));
  return m ? m[1] : null;
};

/** Everything before </head>, which is where render-blocking resources matter. */
function headOf(html) {
  const end = html.search(/<\/head>/i);
  return end === -1 ? html : html.slice(0, end);
}

function auditPage(file) {
  const html = fs.readFileSync(file, 'utf8');
  const page = path.relative(DIST, file).replace(/\\/g, '/');
  const head = headOf(html);

  // ── Document weight ───────────────────────────────────────────────────────
  const bytes = Buffer.byteLength(html, 'utf8');
  if (bytes > BUDGET.htmlBytes) {
    warn(page, 'html-weight', `${kb(bytes)} of HTML (budget ${kb(BUDGET.htmlBytes)})`);
  }

  // ── Render-blocking stylesheets ───────────────────────────────────────────
  const stylesheets = (head.match(/<link\b[^>]*rel\s*=\s*"stylesheet"[^>]*>/gi) ?? []);
  if (stylesheets.length > BUDGET.maxBlockingStylesheets) {
    warn(
      page,
      'blocking-css',
      `${stylesheets.length} render-blocking stylesheets in <head> (budget ${BUDGET.maxBlockingStylesheets})`
    );
  }

  // Third-party CSS on the critical path is the worst kind: an extra DNS + TLS handshake
  // before the page can paint, on a connection nobody controls.
  for (const tag of stylesheets) {
    const href = attrOf(tag, 'href') ?? '';
    if (/^https?:\/\//i.test(href)) {
      const origin = new URL(href).origin;
      const preconnected = new RegExp(
        `<link\\b[^>]*rel\\s*=\\s*"(preconnect|dns-prefetch)"[^>]*href\\s*=\\s*"${origin}`,
        'i'
      ).test(head);

      warn(
        page,
        'third-party-css',
        `render-blocking stylesheet from ${origin}${preconnected ? ' (preconnected)' : ' — NOT preconnected'}`
      );
    }
  }

  // ── Font strategy ─────────────────────────────────────────────────────────
  // Each family is a separate download before text can paint in its intended face.
  const fontFamilies = new Set();
  for (const tag of stylesheets) {
    const href = attrOf(tag, 'href') ?? '';
    if (!/fonts\.googleapis\.com/i.test(href)) continue;

    for (const m of href.matchAll(/family=([^&:]+)/gi)) {
      fontFamilies.add(decodeURIComponent(m[1].replace(/\+/g, ' ')));
    }
    if (!/display=swap/i.test(href)) {
      error(page, 'font-display', 'Google Fonts request without display=swap — text is invisible while fonts load');
    }
  }

  if (fontFamilies.size > BUDGET.maxFontFamilies) {
    warn(
      page,
      'font-families',
      `${fontFamilies.size} font families (${[...fontFamilies].join(', ')}) — budget ${BUDGET.maxFontFamilies}`
    );
  }

  // ── Inline script and style volume ────────────────────────────────────────
  const inlineScripts = [...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)]
    // JSON-LD is data, not executable script; it does not block parsing the same way.
    .filter((m) => !/type\s*=\s*"application\/ld\+json"/i.test(m[0]));

  const inlineScriptBytes = inlineScripts.reduce((sum, m) => sum + Buffer.byteLength(m[1], 'utf8'), 0);
  if (inlineScriptBytes > BUDGET.inlineScriptBytes) {
    warn(
      page,
      'inline-script',
      `${kb(inlineScriptBytes)} of inline JS across ${inlineScripts.length} blocks (budget ${kb(BUDGET.inlineScriptBytes)})`
    );
  }

  const inlineStyleBytes = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].reduce(
    (sum, m) => sum + Buffer.byteLength(m[1], 'utf8'),
    0
  );
  if (inlineStyleBytes > BUDGET.inlineStyleBytes) {
    warn(page, 'inline-style', `${kb(inlineStyleBytes)} of inline CSS (budget ${kb(BUDGET.inlineStyleBytes)})`);
  }

  // ── Blocking scripts ──────────────────────────────────────────────────────
  for (const tag of head.match(/<script\b[^>]*\bsrc=[^>]*>/gi) ?? []) {
    if (!/\b(async|defer|type\s*=\s*"module")\b/i.test(tag)) {
      error(page, 'blocking-script', `synchronous <script src> in <head>: ${tag.slice(0, 80)}`);
    }
  }

  // ── Images ────────────────────────────────────────────────────────────────
  const imgs = html.match(/<img\b[^>]*>/gi) ?? [];
  imgs.forEach((tag, index) => {
    const loading = attrOf(tag, 'loading');
    // The first image is plausibly the LCP element and should not be lazy. Everything after
    // the opening screen should be.
    if (index > 2 && loading !== 'lazy') {
      warn(page, 'img-loading', `below-fold <img> without loading="lazy": ${(attrOf(tag, 'src') ?? '').slice(0, 60)}`);
    }
    if (index === 0 && loading === 'lazy') {
      warn(page, 'img-loading', 'first image is loading="lazy" — this delays LCP if it is the hero');
    }
  });

  // ── Social / OG metadata (§31) ────────────────────────────────────────────
  const ogImage = /property\s*=\s*"og:image"/i.test(head);
  const ogTitle = /property\s*=\s*"og:title"/i.test(head);
  const ogDesc = /property\s*=\s*"og:description"/i.test(head);

  if (!ogTitle) error(page, 'og-title', 'no og:title');
  if (!ogDesc) error(page, 'og-description', 'no og:description');
  if (!ogImage) {
    warn(page, 'og-image', 'no og:image — link previews will render without a card image');
  }
}

const pages = htmlFiles(DIST);
console.log(`Performance & social audit — ${pages.length} rendered pages in dist/client\n`);
pages.forEach(auditPage);

// ── Shipped asset weight ────────────────────────────────────────────────────
const assets = [];
(function collect(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collect(full);
    else if (!entry.name.endsWith('.html')) {
      assets.push({ file: path.relative(DIST, full).replace(/\\/g, '/'), bytes: fs.statSync(full).size });
    }
  }
})(DIST);

const HEAVY_ASSET = 200 * 1024;
for (const asset of assets) {
  if (asset.bytes > HEAVY_ASSET) {
    warn(asset.file, 'heavy-asset', `${kb(asset.bytes)} shipped asset`);
  }
}

// ── Report ──────────────────────────────────────────────────────────────────
const errors = findings.filter((f) => f.level === 'ERROR');
const warnings = findings.filter((f) => f.level === 'WARN');

function report(list, heading) {
  if (list.length === 0) return;
  console.log(`${heading} (${list.length})`);
  const byRule = list.reduce((acc, f) => {
    (acc[f.rule] ??= []).push(f);
    return acc;
  }, {});
  for (const [rule, items] of Object.entries(byRule)) {
    console.log(`\n  ${rule} — ${items.length}`);
    for (const item of items.slice(0, 6)) console.log(`    ${item.page}: ${item.detail}`);
    if (items.length > 6) console.log(`    ... and ${items.length - 6} more`);
  }
  console.log('');
}

report(errors, 'ERRORS');
report(warnings, 'WARNINGS');

const totalHtml = pages.reduce((sum, f) => sum + fs.statSync(f).size, 0);
const totalAssets = assets.reduce((sum, a) => sum + a.bytes, 0);

console.log('─'.repeat(72));
console.log(
  `${pages.length} pages · HTML ${kb(totalHtml)} · non-HTML assets ${kb(totalAssets)} across ${assets.length} files`
);
console.log(`${errors.length} error(s) · ${warnings.length} warning(s)`);

if (errors.length > 0) {
  console.log('\nPerformance audit FAILED.');
  process.exit(1);
}
console.log('\nPerformance audit passed. Static predictors only — no Core Web Vitals were measured.');
