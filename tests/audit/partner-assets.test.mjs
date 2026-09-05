// tests/audit/partner-assets.test.mjs
//
// A rendered partner logo is a trademark claim: it says InfraHub has the asset from the
// partner and may display it. The content schema has the gates (logoStatus, logoApproved) but
// nothing checked that an approved gate corresponds to a file that exists, is non-empty, and
// has a provenance entry naming where it came from.
//
// This audit checks exactly that, plus the route coverage for the canonical eight.
//
//   node tests/audit/partner-assets.test.mjs
//
// Exit code is nonzero on any failure.

import fs from 'node:fs';
import path from 'node:path';

const PARTNERS = path.resolve('src/content/partners');
const PUBLIC = path.resolve('public');
const PROVENANCE = path.resolve('docs/ASSET_PROVENANCE.md');

const CANONICAL = [
  'fastnetmon',
  'gcore',
  'stormwall',
  'zenlayer',
  'ipxo',
  'vates',
  'itcare',
  'airframe'
];

const failures = [];
const fail = (where, detail) => failures.push({ where, detail });
const ok = (message) => console.log(`✓ ${message}`);

function frontMatterValue(raw, key) {
  const match = raw.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'));
  return match ? match[1].trim().replace(/^["']|["']$/g, '') : undefined;
}

console.log('Partner Asset Audit — verifying logo gates against real files...\n');

const provenance = fs.existsSync(PROVENANCE) ? fs.readFileSync(PROVENANCE, 'utf8') : '';
if (!provenance) fail('docs/ASSET_PROVENANCE.md', 'provenance register is missing');

const files = fs.readdirSync(PARTNERS).filter((file) => file.endsWith('.md'));

// Every canonical partner must exist as a record and produce a route.
for (const slug of CANONICAL) {
  if (!files.includes(`${slug}.md`)) {
    fail(`src/content/partners/${slug}.md`, 'canonical partner record is missing');
    continue;
  }

  const raw = fs.readFileSync(path.join(PARTNERS, `${slug}.md`), 'utf8');
  const pageEnabled = frontMatterValue(raw, 'partnerPageEnabled') === 'true';
  const relationship = frontMatterValue(raw, 'relationshipConfirmed') === 'true';
  const nameApproved = frontMatterValue(raw, 'publicNameApproved') === 'true';

  if (!(pageEnabled && relationship && nameApproved)) {
    fail(
      `src/content/partners/${slug}.md`,
      'canonical partner must have partnerPageEnabled, relationshipConfirmed and publicNameApproved set for /partners/' +
        slug +
        ' to exist'
    );
  }
}

// Logo gates must correspond to a real, non-empty, documented file.
for (const file of files) {
  const slug = path.basename(file, '.md');
  const raw = fs.readFileSync(path.join(PARTNERS, file), 'utf8');
  const where = `src/content/partners/${file}`;

  const logoApproved = frontMatterValue(raw, 'logoApproved') === 'true';
  const logoStatus = frontMatterValue(raw, 'logoStatus');
  const logo = frontMatterValue(raw, 'logo');

  if (!logoApproved) continue;

  if (logoStatus !== 'approved') {
    fail(where, `logoApproved: true requires logoStatus: approved (found "${logoStatus}")`);
  }

  if (!logo) {
    fail(where, 'logoApproved: true but no logo path is set');
    continue;
  }

  const assetPath = path.join(PUBLIC, logo.replace(/^\//, ''));
  if (!fs.existsSync(assetPath)) {
    fail(where, `logo "${logo}" does not exist at ${path.relative(process.cwd(), assetPath)}`);
    continue;
  }

  const size = fs.statSync(assetPath).size;
  if (size === 0) {
    fail(where, `logo "${logo}" is a zero-byte file`);
  }

  if (!provenance.includes(logo)) {
    fail(
      'docs/ASSET_PROVENANCE.md',
      `no provenance entry for "${logo}" (used by ${slug}); a rendered trademark needs a documented source`
    );
  }
}

// No partner may point at an asset that was assembled or recoloured locally. SVGs that embed a
// raster image are the signature of a hand-built composite.
for (const file of files) {
  const raw = fs.readFileSync(path.join(PARTNERS, file), 'utf8');
  const logo = frontMatterValue(raw, 'logo');
  if (!logo || !logo.endsWith('.svg')) continue;

  const assetPath = path.join(PUBLIC, logo.replace(/^\//, ''));
  if (!fs.existsSync(assetPath)) continue;

  const svg = fs.readFileSync(assetPath, 'utf8');
  if (/<image\b/i.test(svg) && /<text\b/i.test(svg)) {
    fail(
      `public${logo}`,
      'SVG combines an embedded raster with live text, which is the shape of a locally composed lockup rather than a published asset'
    );
  }
}

if (failures.length > 0) {
  console.error(`\nFAILED: ${failures.length} partner asset issue(s):\n`);
  for (const { where, detail } of failures) console.error(` - ${where}: ${detail}`);
  process.exit(1);
}

ok(`All ${CANONICAL.length} canonical partners have routes enabled`);
ok('Every approved logo resolves to a non-empty file');
ok('Every rendered logo has a provenance entry');
ok('No partner logo is a locally composed lockup');
console.log('\nSUCCESS: partner asset gates match the files on disk.');
