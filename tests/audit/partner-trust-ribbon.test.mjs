// tests/audit/partner-trust-ribbon.test.mjs — Partner Trust System Technical & Governance Verification
import fs from 'fs';
import path from 'path';

const INDEX_HTML_PATH = 'dist/client/index.html';
const PARTNERS_DIR = 'src/content/partners';
const PARTNERS_SVG_DIR = 'public/images/partners';

function runTest() {
  console.log('Partner Trust Ribbon Audit — Validating Homepage Ecosystem Governance...\n');

  if (!fs.existsSync(INDEX_HTML_PATH)) {
    console.error(`ERROR: ${INDEX_HTML_PATH} does not exist. Run 'astro build' first.`);
    process.exit(1);
  }

  const html = fs.readFileSync(INDEX_HTML_PATH, 'utf8');

  // 1. Container exists
  if (!html.includes('class="partner-trust-ribbon"')) {
    console.error('FAIL: .partner-trust-ribbon element not found in index.html');
    process.exit(1);
  }
  console.log('✓ Found .partner-trust-ribbon container on homepage');

  // 2. Editorial title check (no screaming or fake badges)
  if (!html.includes('Our partner ecosystem') && !html.includes('OUR PARTNER ECOSYSTEM')) {
    console.error('FAIL: Ribbon missing required label "Our partner ecosystem"');
    process.exit(1);
  }
  console.log('✓ Required title "Our partner ecosystem" present');

  // 3. Prohibit unauthorized labels
  const forbiddenLabels = ['TRUSTED BY', 'OUR STRATEGIC PARTNERS', 'TECHNOLOGY WE USE'];
  for (const forbidden of forbiddenLabels) {
    if (html.includes(forbidden)) {
      console.error(`FAIL: Forbidden label "${forbidden}" detected in homepage HTML`);
      process.exit(1);
    }
  }
  console.log('✓ No forbidden claims detected (TRUSTED BY, STRATEGIC PARTNERS, etc.)');

  // 4. Validate dynamic derivation from partner collection & fail-closed publication gates
  const partnerFiles = fs.readdirSync(PARTNERS_DIR).filter(f => f.endsWith('.md'));
  let eligibleCount = 0;

  for (const file of partnerFiles) {
    const raw = fs.readFileSync(path.join(PARTNERS_DIR, file), 'utf8');
    const slug = file.replace(/\.md$/, '');
    
    // Check publication gates
    const isMarqueeEnabled = /homepageMarqueeEnabled:\s*true/.test(raw);
    const isRelationshipConfirmed = /relationshipConfirmed:\s*true/.test(raw);
    const isNameApproved = /publicNameApproved:\s*true/.test(raw);
    const isEligible = isMarqueeEnabled && isRelationshipConfirmed && isNameApproved;

    if (isEligible) {
      eligibleCount++;
      // Must have resolved link
      if (!html.includes(`/partners/${slug}`)) {
        console.error(`FAIL: Eligible partner "${slug}" missing link in partner trust ribbon`);
        process.exit(1);
      }
    } else {
      // Must NOT render if any gate is false
      if (html.includes(`/partners/${slug}`)) {
        console.error(`FAIL: Unapproved or gated partner "${slug}" was rendered in homepage ribbon`);
        process.exit(1);
      }
    }
  }
  console.log(`✓ All ${eligibleCount} eligible partners pass publication gates and render verified links`);

  // 5. Verify Duplicate Track is aria-hidden (A11y)
  if (!html.includes('class="marquee-track duplicate-track" aria-hidden="true"')) {
    console.error('FAIL: Visual duplicate track missing aria-hidden="true"');
    process.exit(1);
  }
  console.log('✓ Seamless duplicate track correctly marked aria-hidden="true"');

  // 6. Reduced-motion stylesheet support exists
  if (!html.includes('prefers-reduced-motion') && !fs.readFileSync('src/components/PartnerTrustRibbon.astro', 'utf8').includes('prefers-reduced-motion')) {
    console.error('FAIL: PartnerTrustRibbon missing prefers-reduced-motion fallback');
    process.exit(1);
  }
  console.log('✓ Verified prefers-reduced-motion CSS fallback is declared');

  console.log('\nSUCCESS: Partner Trust Ribbon audit passed technical and governance checks cleanly!\n');
}

runTest();
