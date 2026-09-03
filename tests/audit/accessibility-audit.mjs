// tests/audit/accessibility-audit.mjs
//
// WS-13 — static accessibility audit over the built site.
//
// Complements scripts/verify-routes.mjs rather than repeating it. That script checks link
// resolution and the three head tags (title, description, canonical). This one checks the
// WCAG 2.2 AA properties that can be decided from static markup: document language, heading
// structure, accessible names, form labelling, focus order and duplicate ids.
//
// WHAT THIS CANNOT DO. A static pass cannot judge colour contrast on composed backgrounds,
// focus visibility, motion, or anything that depends on the rendered box model. It catches the
// mechanical failures that are cheap to prevent and expensive to find later — it does not
// certify WCAG conformance, and a green run here is not an accessibility sign-off.
//
//   node tests/audit/accessibility-audit.mjs
//
// Exit code is nonzero if any ERROR-level finding is present. Warnings do not fail the run.

import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist/client');

if (!fs.existsSync(DIST)) {
  console.error('dist/client does not exist. Run "npm run build" first.');
  process.exit(1);
}

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

/** Strips tags and entities so we can ask whether an element has any human-readable text. */
function textContent(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const attr = (tag, name) => {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, 'i'));
  return match ? match[1] : null;
};
const hasAttr = (tag, name) => new RegExp(`\\b${name}\\b`, 'i').test(tag);

/**
 * An element has an accessible name if it has visible text, or one of the ARIA naming
 * attributes, or (for an image) alt text. Deliberately generous: this is looking for elements
 * with NO name at all, which is unambiguous, rather than judging name quality.
 */
function hasAccessibleName(openTag, inner) {
  if (textContent(inner).length > 0) return true;
  if (attr(openTag, 'aria-label')) return true;
  if (attr(openTag, 'aria-labelledby')) return true;
  if (attr(openTag, 'title')) return true;
  // An icon-only control is still named if the image inside it carries alt text.
  const img = inner.match(/<img\b[^>]*>/i);
  if (img && attr(img[0], 'alt')) return true;
  const svgTitle = /<svg[\s\S]*?<title>[\s\S]*?<\/title>/i.test(inner);
  if (svgTitle) return true;
  return false;
}

/** Matches an element with its closing tag, non-greedy, for simple non-nesting cases. */
function elements(html, tagName) {
  const re = new RegExp(`<${tagName}\\b([^>]*)>([\\s\\S]*?)</${tagName}>`, 'gi');
  const out = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    out.push({ openTag: `<${tagName}${m[1]}>`, inner: m[2], full: m[0] });
  }
  return out;
}

function auditPage(file) {
  const html = fs.readFileSync(file, 'utf8');
  const page = path.relative(DIST, file).replace(/\\/g, '/');

  // ── Document ──────────────────────────────────────────────────────────────
  const htmlTag = html.match(/<html\b[^>]*>/i);
  const lang = htmlTag ? attr(htmlTag[0], 'lang') : null;
  if (!lang) {
    error(page, 'html-lang', '<html> has no lang attribute — screen readers cannot pick a voice');
  }

  const title = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (!title || textContent(title[1]).length === 0) {
    error(page, 'document-title', '<title> is missing or empty');
  }

  // ── Headings ──────────────────────────────────────────────────────────────
  const headings = [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({
    level: Number(m[1]),
    text: textContent(m[2])
  }));

  const h1s = headings.filter((h) => h.level === 1);
  if (h1s.length === 0) error(page, 'one-h1', 'page has no <h1>');
  if (h1s.length > 1) error(page, 'one-h1', `page has ${h1s.length} <h1> elements; expected exactly one`);

  for (const h of headings) {
    if (h.text.length === 0) error(page, 'empty-heading', `empty <h${h.level}>`);
  }

  // A skipped level (h2 -> h4) breaks the document outline for anyone navigating by heading.
  for (let i = 1; i < headings.length; i += 1) {
    const jump = headings[i].level - headings[i - 1].level;
    if (jump > 1) {
      warn(
        page,
        'heading-order',
        `h${headings[i - 1].level} is followed by h${headings[i].level} ("${headings[i].text.slice(0, 40)}")`
      );
    }
  }

  // ── Images ────────────────────────────────────────────────────────────────
  for (const tag of html.match(/<img\b[^>]*>/gi) ?? []) {
    if (!hasAttr(tag, 'alt')) {
      error(page, 'img-alt', `<img> without alt: ${tag.slice(0, 90)}`);
    }
    // Missing intrinsic size is a layout-shift (CLS) risk as well as a rendering one.
    if (!hasAttr(tag, 'width') || !hasAttr(tag, 'height')) {
      warn(page, 'img-dimensions', `<img> without width/height: ${tag.slice(0, 70)}`);
    }
  }

  // ── Links ─────────────────────────────────────────────────────────────────
  for (const { openTag, inner } of elements(html, 'a')) {
    const href = attr(openTag, 'href');

    if (href === '#') {
      error(page, 'dead-link', 'href="#" — a link that goes nowhere');
    }
    if (!hasAccessibleName(openTag, inner)) {
      error(page, 'link-name', `<a> has no accessible name: ${openTag.slice(0, 90)}`);
    }
    if (attr(openTag, 'target') === '_blank') {
      const rel = attr(openTag, 'rel') ?? '';
      if (!/noopener/i.test(rel)) {
        error(page, 'target-blank-rel', `target="_blank" without rel="noopener": ${openTag.slice(0, 80)}`);
      }
    }
  }

  // ── Buttons ───────────────────────────────────────────────────────────────
  for (const { openTag, inner } of elements(html, 'button')) {
    if (!hasAccessibleName(openTag, inner)) {
      error(page, 'button-name', `<button> has no accessible name: ${openTag.slice(0, 90)}`);
    }
  }

  // ── Form controls ─────────────────────────────────────────────────────────
  const labelFor = new Set(
    [...html.matchAll(/<label\b([^>]*)>/gi)]
      .map((m) => attr(`<label${m[1]}>`, 'for'))
      .filter(Boolean)
  );

  const controls = [
    ...(html.match(/<input\b[^>]*>/gi) ?? []),
    ...(html.match(/<select\b[^>]*>/gi) ?? []),
    ...(html.match(/<textarea\b[^>]*>/gi) ?? [])
  ];

  for (const tag of controls) {
    const type = (attr(tag, 'type') ?? '').toLowerCase();
    // Hidden inputs and submit buttons take their name from value/visible text, not a label.
    if (['hidden', 'submit', 'button', 'reset', 'image'].includes(type)) continue;

    const id = attr(tag, 'id');
    const named =
      (id && labelFor.has(id)) ||
      attr(tag, 'aria-label') ||
      attr(tag, 'aria-labelledby') ||
      attr(tag, 'title');

    if (!named) {
      error(page, 'control-label', `form control with no label: ${tag.slice(0, 90)}`);
    }
  }

  // ── Focus order ───────────────────────────────────────────────────────────
  for (const m of html.matchAll(/tabindex\s*=\s*"(\d+)"/gi)) {
    if (Number(m[1]) > 0) {
      error(page, 'positive-tabindex', `tabindex="${m[1]}" overrides natural focus order`);
    }
  }

  // ── Duplicate ids ─────────────────────────────────────────────────────────
  // Duplicates silently break label[for], aria-labelledby and in-page anchors.
  const ids = [...html.matchAll(/\bid\s*=\s*"([^"]+)"/gi)].map((m) => m[1]);
  const seen = new Set();
  const dupes = new Set();
  for (const id of ids) {
    if (seen.has(id)) dupes.add(id);
    seen.add(id);
  }
  for (const id of dupes) {
    error(page, 'duplicate-id', `id="${id}" appears more than once`);
  }
}

const pages = htmlFiles(DIST);
console.log(`Accessibility audit — ${pages.length} rendered pages in dist/client\n`);
pages.forEach(auditPage);

const errors = findings.filter((f) => f.level === 'ERROR');
const warnings = findings.filter((f) => f.level === 'WARN');

const byRule = (list) =>
  list.reduce((acc, f) => {
    (acc[f.rule] ??= []).push(f);
    return acc;
  }, {});

function report(list, heading) {
  if (list.length === 0) return;
  console.log(`${heading} (${list.length})`);
  for (const [rule, items] of Object.entries(byRule(list))) {
    console.log(`\n  ${rule} — ${items.length}`);
    for (const item of items.slice(0, 8)) {
      console.log(`    ${item.page}: ${item.detail}`);
    }
    if (items.length > 8) console.log(`    ... and ${items.length - 8} more`);
  }
  console.log('');
}

report(errors, 'ERRORS');
report(warnings, 'WARNINGS');

console.log('─'.repeat(72));
console.log(`${pages.length} pages · ${errors.length} error(s) · ${warnings.length} warning(s)`);

if (errors.length > 0) {
  console.log('\nAccessibility audit FAILED.');
  process.exit(1);
}
console.log('\nAccessibility audit passed. Static checks only — not a WCAG sign-off.');
