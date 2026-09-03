// tests/audit/partner-trust-ribbon.test.mjs — Premium Partner Trust System Verification
import fs from 'fs';
import path from 'path';

const INDEX_HTML_PATH = 'dist/client/index.html';
const PARTNERS_SVG_DIR = 'public/images/partners';

function runTest() {
  console.log('Partner Trust Ribbon Audit — Validating Homepage Ecosystem System...\n');

  if (!fs.existsSync(INDEX_HTML_PATH)) {
    console.error(`ERROR: ${INDEX_HTML_PATH} does not exist. Run 'astro build' first.`);
    process.exit(1);
  }

  const html = fs.readFileSync(INDEX_HTML_PATH, 'utf8');

  // 1. Check container exists
  if (!html.includes('class="partner-trust-ribbon"')) {
    console.error('FAIL: .partner-trust-ribbon element not found in index.html');
    process.exit(1);
  }
  console.log('✓ Found .partner-trust-ribbon container on homepage');

  // 2. Check title copy rule (Directive §4)
  if (!html.includes('OUR PARTNER ECOSYSTEM')) {
    console.error('FAIL: Ribbon missing required label "OUR PARTNER ECOSYSTEM"');
    process.exit(1);
  }
  console.log('✓ Required title "OUR PARTNER ECOSYSTEM" present');

  // 3. Prohibit unauthorized labels (Directive §4)
  const forbiddenLabels = ['TRUSTED BY', 'OUR STRATEGIC PARTNERS', 'TECHNOLOGY WE USE'];
  for (const forbidden of forbiddenLabels) {
    if (html.includes(forbidden)) {
      console.error(`FAIL: Forbidden label "${forbidden}" detected in homepage HTML`);
      process.exit(1);
    }
  }
  console.log('✓ No forbidden labels detected (TRUSTED BY, STRATEGIC PARTNERS, etc.)');

  // 4. Verify Approved Partners Rendered (Directive §5 & §17)
  const requiredSlugs = [
    'fastnetmon',
    'gcore',
    'zenlayer',
    'stormwall',
    'ipxo',
    'vates',
    'itcare',
    'supertrace'
  ];

  for (const slug of requiredSlugs) {
    if (!html.includes(`/partners/${slug}`)) {
      console.error(`FAIL: Missing partner link for "${slug}" in partner trust ribbon`);
      process.exit(1);
    }
  }
  console.log(`✓ All ${requiredSlugs.length} approved partners rendered with verified /partners/[slug] links`);

  // 5. Verify Accessibility & Seamless Duplicate Track (Directive §13 & §20)
  if (!html.includes('aria-hidden="true"')) {
    console.error('FAIL: Visual duplicate track missing aria-hidden="true"');
    process.exit(1);
  }
  console.log('✓ Seamless duplicate track correctly marked aria-hidden="true"');

  // 6. Verify Local SVG Assets on Disk (Directive §21 & §22)
  for (const slug of requiredSlugs) {
    const svgPath = path.join(PARTNERS_SVG_DIR, `${slug}.svg`);
    if (!fs.existsSync(svgPath)) {
      console.error(`FAIL: Missing partner SVG asset: ${svgPath}`);
      process.exit(1);
    }
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    if (!svgContent.startsWith('<svg') || !svgContent.includes('</svg>')) {
      console.error(`FAIL: Invalid SVG content for ${svgPath}`);
      process.exit(1);
    }
  }
  console.log(`✓ All ${requiredSlugs.length} partner SVG vector assets verified on disk`);

  console.log('\nSUCCESS: Partner Trust Ribbon audit passed all commercial and technical checks cleanly!\n');
}

runTest();
