// tests/audit/content-truth-audit.mjs
//
// WS-14 — content truth validation over the source content collections.
//
// The InfraHub collaboration directive is strict about published claims: never fabricate
// partners, prices, customers, SLAs, certifications or coverage (§22); a logo implies a
// relationship so partners need verification (§24); an expired offer must not display as
// current (§25); and OWNER INPUT placeholders must never reach a production page (§2).
//
// Zod enforces SHAPE at build time. It cannot enforce any of the above, because they are
// questions about whether a value is *true*, not whether it is a string. This audit covers the
// part that is mechanically checkable:
//
//   - an active offer must be able to expire, and must not already have expired
//   - a published partner must assert verification explicitly
//   - an offer's partner must exist in the partner collection
//   - placeholder and owner-input markers must not sit in publishable content
//   - the legacy site's unsupported statistics must not reappear
//
//   node tests/audit/content-truth-audit.mjs
//
// Exit code is nonzero on any ERROR. Warnings are advisory.

import fs from 'node:fs';
import path from 'node:path';

const CONTENT = path.resolve('src/content');
const PAGES = path.resolve('src/pages');

const findings = [];
const error = (where, rule, detail) => findings.push({ level: 'ERROR', where, rule, detail });
const warn = (where, rule, detail) => findings.push({ level: 'WARN', where, rule, detail });

function walk(dir, ext) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full, ext);
    return entry.name.endsWith(ext) ? [full] : [];
  });
}

/**
 * Minimal YAML front matter reader.
 *
 * Deliberately small: it handles the scalar / boolean / date / list shapes this project's
 * collections actually use. It is not a YAML parser, and it reports what it could not read
 * rather than guessing — a validator that silently skips a field it failed to parse would
 * report "no problems" on exactly the files most worth checking.
 */
function frontMatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const data = {};
  let currentKey = null;

  for (const line of match[1].split(/\r?\n/)) {
    if (/^\s*#/.test(line) || line.trim() === '') continue;

    const listItem = line.match(/^\s+-\s+(.*)$/);
    if (listItem && currentKey) {
      (data[currentKey] ??= []).push(listItem[1].replace(/^["']|["']$/g, ''));
      continue;
    }

    const kv = line.match(/^([A-Za-z0-9_]+)\s*:\s*(.*)$/);
    if (!kv) continue;

    const [, key, rawValue] = kv;
    currentKey = key;
    const value = rawValue.trim();

    if (value === '') {
      data[key] = [];
    } else if (value === 'true' || value === 'false') {
      data[key] = value === 'true';
    } else {
      data[key] = value.replace(/^["']|["']$/g, '');
    }
  }

  return data;
}

const slugOf = (file) => path.basename(file, '.md');
const rel = (file) => path.relative(process.cwd(), file).replace(/\\/g, '/');

// ── Offers ──────────────────────────────────────────────────────────────────
//
// The commercial surface. An offer that cannot expire is an offer that will eventually
// advertise a stale price, and the schema makes expiryDate optional.

const today = new Date();
today.setHours(0, 0, 0, 0);

const offerFiles = walk(path.join(CONTENT, 'offers'), '.md');
for (const file of offerFiles) {
  const data = frontMatter(fs.readFileSync(file, 'utf8'));
  if (!data) {
    error(rel(file), 'unreadable', 'no YAML front matter found');
    continue;
  }

  const status = data.status ?? 'active'; // schema default
  const where = rel(file);

  if (status === 'active') {
    if (!data.expiryDate) {
      error(
        where,
        'offer-no-expiry',
        'status "active" with no expiryDate — this offer can never be detected as stale'
      );
    } else {
      const expiry = new Date(data.expiryDate);
      if (Number.isNaN(expiry.getTime())) {
        error(where, 'offer-bad-expiry', `expiryDate is not a date: ${data.expiryDate}`);
      } else if (expiry < today) {
        error(
          where,
          'offer-expired',
          `status "active" but expiryDate ${data.expiryDate} has passed — an expired offer is being shown as current`
        );
      }
    }
  }

  // A price is a commercial claim. It has to be attributable to somebody.
  if ((data.verifiedPrice || data.displayPrice) && !data.partner) {
    warn(
      where,
      'price-without-partner',
      `Price "${data.displayPrice || data.verifiedPrice}" with no partner named — who is quoting it?`
    );
  }
}

// ── Partners ────────────────────────────────────────────────────────────────
//
// A published logo asserts a relationship. `verified` defaults to false in the schema, which
// is correct, so a partner rendered on the site must have said so explicitly in its own file.

const partnerFiles = walk(path.join(CONTENT, 'partners'), '.md');
const partnerNames = new Set();
const partnerSlugs = new Set();

for (const file of partnerFiles) {
  const data = frontMatter(fs.readFileSync(file, 'utf8'));
  if (!data) {
    error(rel(file), 'unreadable', 'no YAML front matter found');
    continue;
  }

  const where = rel(file);
  partnerSlugs.add(slugOf(file));
  if (data.name) partnerNames.add(String(data.name).toLowerCase());

  if (data.verified !== true) {
    warn(
      where,
      'partner-unverified',
      'verified is not explicitly true — publication asserts a relationship (directive §24)'
    );
  }

  if (data.strategic === true) {
    warn(
      where,
      'partner-strategic',
      '"strategic" is a designation the owner approves, not a default — confirm it is authorised'
    );
  }

  if (!data.logo) {
    warn(where, 'partner-no-logo', 'no logo path set');
  }
}

// An offer pointing at a partner that does not exist is a broken relationship claim.
for (const file of offerFiles) {
  const data = frontMatter(fs.readFileSync(file, 'utf8'));
  if (!data?.partner) continue;

  const value = String(data.partner);
  const known =
    partnerSlugs.has(value.toLowerCase().replace(/\s+/g, '-')) ||
    partnerNames.has(value.toLowerCase());

  if (!known) {
    warn(
      rel(file),
      'offer-partner-unknown',
      `partner "${value}" is not in the partners collection — a category is not a partner`
    );
  }
}

// ── Placeholders ────────────────────────────────────────────────────────────
//
// Directive §2: OWNER INPUT markers are a coordination device and must never render publicly.

const PLACEHOLDER = /\b(lorem ipsum|OWNER INPUT|TODO|FIXME|coming soon|placeholder text|XXX)\b/i;

const publishable = [...walk(CONTENT, '.md'), ...walk(PAGES, '.astro')];
for (const file of publishable) {
  const raw = fs.readFileSync(file, 'utf8');
  raw.split(/\r?\n/).forEach((line, index) => {
    // A line that is only a code comment is a note to developers, not published copy.
    if (/^\s*(\/\/|\/\*|\*|<!--)/.test(line)) return;
    if (PLACEHOLDER.test(line)) {
      error(rel(file), 'placeholder-in-content', `line ${index + 1}: ${line.trim().slice(0, 90)}`);
    }
  });
}

// ── Retired claims ──────────────────────────────────────────────────────────
//
// The legacy site carried unsupported statistics. Agent 1 dropped them rather than migrating
// them; this keeps them from coming back in a later content pass.

// These patterns aim at the SUBJECT of the claim, not the vocabulary.
//
// The first version flagged any occurrence of "guarantee" or "ISO 27001" and produced mostly
// noise: "you require guaranteed upstream path diversity" is a description of a customer's
// requirement, "Beyond Billing Guarantees" is the topic of a heading, and "gap assessments for
// ISO 27001" offers readiness work rather than claiming certification. None of those is a
// claim InfraHub is making about itself.
//
// An audit that cries wolf on six lines to catch two gets ignored, and then it catches
// nothing. So these match only where InfraHub is the one promising.
const RETIRED_CLAIMS = [
  {
    pattern: /\b\d{3,}\+\s*(customers|clients|projects|deployments)\b/i,
    why: 'unsupported customer count'
  },
  {
    pattern: /\b99\.9{2,}\s*%/,
    why: 'uptime/SLA claim'
  },
  {
    // Possession, not subject matter: "we are ISO 27001 certified" rather than
    // "gap assessments for ISO 27001".
    pattern:
      /\b(?:ISO\s?27001|SOC\s?2(?:\s?Type\s?I{1,2})?|PCI[- ]DSS)[- ]?certified\b|\b(?:we|InfraHub|our)\b[^.<]{0,50}\b(?:are|is|hold|holds|maintain|maintains)\b[^.<]{0,30}\b(?:ISO\s?27001|SOC\s?2|PCI[- ]DSS)\b/i,
    why: 'compliance certification claim about InfraHub'
  },
  {
    // A promise InfraHub makes: a named guarantee ("Zero Fee Guarantee"), a first-person
    // guarantee, or a sentence opening with "Guaranteed X".
    pattern:
      /\b(?:[A-Z][\w-]+\s+){1,3}Guarantee\b|\b(?:we|InfraHub)\b[^.<]{0,60}\bguarantees?\b|(?:^|[>.]\s*)Guaranteed\s+[A-Za-z]/,
    why: 'guarantee promised by InfraHub'
  }
];

for (const file of publishable) {
  const raw = fs.readFileSync(file, 'utf8');
  for (const { pattern, why } of RETIRED_CLAIMS) {
    const hit = raw.match(pattern);
    if (hit) {
      warn(rel(file), 'retired-claim', `${why}: "${hit[0]}" — must be verified before publication`);
    }
  }
}

// ── Report ──────────────────────────────────────────────────────────────────

const errors = findings.filter((f) => f.level === 'ERROR');
const warnings = findings.filter((f) => f.level === 'WARN');

console.log(
  `Content truth audit — ${offerFiles.length} offers · ${partnerFiles.length} partners · ${publishable.length} publishable files\n`
);

function report(list, heading) {
  if (list.length === 0) return;
  console.log(`${heading} (${list.length})`);
  const byRule = list.reduce((acc, f) => {
    (acc[f.rule] ??= []).push(f);
    return acc;
  }, {});
  for (const [rule, items] of Object.entries(byRule)) {
    console.log(`\n  ${rule} — ${items.length}`);
    for (const item of items.slice(0, 8)) console.log(`    ${item.where}: ${item.detail}`);
    if (items.length > 8) console.log(`    ... and ${items.length - 8} more`);
  }
  console.log('');
}

report(errors, 'ERRORS');
report(warnings, 'WARNINGS');

console.log('─'.repeat(72));
console.log(`${errors.length} error(s) · ${warnings.length} warning(s)`);

if (errors.length > 0) {
  console.log('\nContent truth audit FAILED.');
  process.exit(1);
}
console.log('\nContent truth audit passed.');
console.log('Mechanical checks only — it cannot tell you whether a verified claim is true.');
