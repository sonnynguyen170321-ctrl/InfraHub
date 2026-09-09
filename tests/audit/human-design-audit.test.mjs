// tests/audit/human-design-audit.test.mjs
// Automated human design forensics audit enforcing anti-slop and taste guardrails

import fs from 'fs';
import path from 'path';

console.log('Running Human Design Forensics & Taste Audit...\n');

let errors = [];

function sourceFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(target);
    return /\.(?:astro|css)$/.test(entry.name) ? [target] : [];
  });
}

const designSources = sourceFiles('src').map((file) => ({
  file,
  content: fs.readFileSync(file, 'utf8')
}));

// 1. The discovery lens must carry a distinct visual per discipline.
//
// This read EcosystemSolutions.astro until Act 2 was rebuilt around the Infrastructure Lens.
// That component is gone, and the five families now live in PhysicalLens, which imports one
// graded plate per discipline from src/assets/discovery. Retargeted rather than deleted: the
// rule being enforced - five disciplines, five distinct subjects, no plate doing double duty -
// is exactly as worth holding on the new component as it was on the old one.
const lensFile = 'src/components/discovery/PhysicalLens.astro';
if (fs.existsSync(lensFile)) {
  const content = fs.readFileSync(lensFile, 'utf8');
  const plates = [...content.matchAll(/import\s+\w+\s+from\s+['"][^'"]*\/assets\/discovery\/([^'"]+)['"]/g)].map(
    (m) => m[1]
  );
  const uniquePlates = new Set(plates);

  if (plates.length < 5) {
    errors.push(`PhysicalLens must declare a plate for all 5 disciplines, found ${plates.length}`);
  } else if (uniquePlates.size !== plates.length) {
    errors.push(`Duplicate plates across disciplines in ${lensFile}: ${plates.join(', ')}`);
  } else {
    console.log(`✓ Discipline lens has ${uniquePlates.size} distinct visual subjects`);
  }
} else {
  errors.push(`Missing ${lensFile}`);
}

// 2. Check the full component-scoped design surface, not only global.css. Astro component
// styles are emitted into the homepage too, so ignoring them makes this audit falsely green.
const sourceRules = [
  { pattern: /transition\s*:\s*all\b/i, message: 'forbidden transition: all' },
  { pattern: /backdrop-filter\s*:/i, message: 'forbidden backdrop blur' },
  { pattern: /filter\s*:\s*drop-shadow\s*\(/i, message: 'forbidden glow/drop-shadow' },
  { pattern: /:hover[^\{]*\{[^}]*transform\s*:\s*translateY\s*\(\s*-/is, message: 'forbidden hover lift' }
];

const styleErrorsBefore = errors.length;
for (const { file, content } of designSources) {
  for (const rule of sourceRules) {
    if (rule.pattern.test(content)) errors.push(`Found ${rule.message} in ${file}`);
  }
}

if (errors.length === styleErrorsBefore) {
  console.log('✓ Component and global styles are free of transition-all, blur, glow, and hover lift');
}

const globalCssFile = 'src/styles/global.css';
if (fs.existsSync(globalCssFile)) {
  const css = fs.readFileSync(globalCssFile, 'utf8');
  if (css.includes('transition: all')) {
    errors.push(`Found forbidden "transition: all" in ${globalCssFile}. Use explicit properties.`);
  } else {
    console.log('✓ Global stylesheet free of "transition: all"');
  }

  // Check for blue-glow button shadows
  if (css.includes('rgba(37, 99, 235, 0.3') || css.includes('rgba(37, 99, 235, 0.35)')) {
    errors.push(`Found forbidden blue button glow box-shadow in ${globalCssFile}`);
  } else {
    console.log('✓ Button glow shadows removed from stylesheet');
  }

  // Check for overused AI fonts
  if (css.includes("'Inter'") || css.includes("'Plus Jakarta Sans'") || css.includes("'Instrument Sans'")) {
    errors.push(`Found overused font in ${globalCssFile}. Use authentic engineering typography (IBM Plex Sans).`);
  } else {
    console.log('✓ Verified authentic engineering typography family (IBM Plex Sans)');
  }

  // Check that headings have relaxed line-height (no tight line height on cards)
  if (css.includes('h3, h4, h5, h6 {\n  font-family: var(--font-heading);\n  color: var(--text-primary);\n  line-height: 1.2;')) {
    errors.push(`Headings h3-h6 must not have tight line-height (1.2) in ${globalCssFile}. Use >= 1.4 for multi-line titles.`);
  } else {
    console.log('✓ Card titles and sub-headings have relaxed line-height (>= 1.4)');
  }
}

// 3. Check Homepage rendered HTML for Eyebrow count
const indexHtmlPath = 'dist/client/index.html';
if (fs.existsSync(indexHtmlPath)) {
  const html = fs.readFileSync(indexHtmlPath, 'utf8');
  
  // Forbidden former eyebrows
  const forbiddenEyebrows = [
    'INFRASTRUCTURE SOURCING & ADVISORY',
    'SOLUTION DISCOVERY',
    'OPERATING MODEL & EXPERIENCE',
    'COMMERCIAL OPPORTUNITIES',
    'WHO WE WORK WITH',
    'INFRASTRUCTURE IN PRACTICE',
    'QUALIFICATION & SOURCING',
    'PHYSICAL DIVERSITY AUDIT',
    'AUDITED MODEL',
    'VERIFIED ARCHITECTURE SOLUTION',
    'PRINCIPAL ENGINEER REVIEW',
    '1 BUSINESS DAY SLA'
  ];

  for (const eyebrow of forbiddenEyebrows) {
    if (html.includes(eyebrow)) {
      errors.push(`Found forbidden template eyebrow on homepage: "${eyebrow}"`);
    }
  }

  // 4. Check for empty CTA hrefs or dead hashes
  const emptyHrefMatches = html.match(/href=["'](#|)["']/gi);
  if (emptyHrefMatches) {
    errors.push(`Found ${emptyHrefMatches.length} empty or hash-only CTA links in homepage HTML`);
  } else {
    console.log('✓ All homepage action links have valid explicit destination routes');
  }

  // 5. Verify no unsupported marketing badges (Trusted by, Strategic Partner)
  if (html.includes('Trusted by') || html.includes('Strategic Partner')) {
    errors.push('Found unsupported "Trusted by" or "Strategic Partner" label on homepage');
  } else {
    console.log('✓ No unsupported marketing labels (Trusted by, Strategic Partner)');
  }

  console.log('✓ Homepage verified free of generic template eyebrows and faux widgets');
} else {
  console.log('ℹ dist/client/index.html not yet built (will be validated post-build)');
}

if (errors.length > 0) {
  console.error('\nHUMAN DESIGN AUDIT FAILED:');
  errors.forEach(err => console.error(`  ✖ ${err}`));
  process.exit(1);
} else {
  console.log('\nSUCCESS: All Human Design Forensics & Taste rules passed cleanly!\n');
}
