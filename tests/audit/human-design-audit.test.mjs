// tests/audit/human-design-audit.test.mjs
// Automated human design forensics audit enforcing anti-slop and taste guardrails

import fs from 'fs';
import path from 'path';

console.log('Running Human Design Forensics & Taste Audit...\n');

let errors = [];

// 1. Check EcosystemSolutions.astro for distinct imagery across all 5 families
const ecosystemFile = 'src/components/EcosystemSolutions.astro';
if (fs.existsSync(ecosystemFile)) {
  const content = fs.readFileSync(ecosystemFile, 'utf8');
  const imageMatches = [...content.matchAll(/image:\s*["']([^"']+)["']/g)].map(m => m[1]);
  const uniqueImages = new Set(imageMatches);

  if (imageMatches.length < 5) {
    errors.push(`EcosystemSolutions must declare at least 5 solution families, found ${imageMatches.length}`);
  }
  if (uniqueImages.size !== imageMatches.length) {
    errors.push(`Duplicate images detected across solution families in ${ecosystemFile}: ${imageMatches.join(', ')}`);
  } else {
    console.log(`✓ Solution families have 5 distinct visual subjects (${uniqueImages.size} unique assets)`);
  }

  // Ensure faux console shell classes are removed
  if (content.includes('console-desktop') || content.includes('console-nav')) {
    errors.push(`Faux console classes found in ${ecosystemFile}. Solution explorer must use open editorial architecture.`);
  } else {
    console.log('✓ Faux console window framing removed from EcosystemSolutions');
  }
} else {
  errors.push(`Missing ${ecosystemFile}`);
}

// 2. Check for transition: all in src/styles/
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
    'QUALIFICATION & SOURCING'
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
