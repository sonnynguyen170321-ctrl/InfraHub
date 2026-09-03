// tests/audit/partner-trust-ribbon.test.mjs — Partner Trust System Technical & Governance Verification
import fs from 'fs';
import path from 'path';

const INDEX_HTML_PATH = 'dist/client/index.html';
const PARTNERS_DIR = 'src/content/partners';

const canonicalPartners = {
  fastnetmon: 'https://fastnetmon.com/',
  gcore: 'https://gcore.com/',
  stormwall: 'https://stormwall.network/',
  zenlayer: 'https://www.zenlayer.com/',
  ipxo: 'https://www.ipxo.com/',
  vates: 'https://vates.tech/',
  itcare: 'https://itcare.net/',
  airframe: 'https://www.airframe.ai/'
};

function extractQuotedField(raw, field) {
  const match = raw.match(new RegExp(`^${field}:\\s*["']([^"']+)["']`, 'm'));
  return match?.[1] ?? null;
}

function runTest() {
  console.log('Partner Trust Ribbon Audit — Validating Homepage Ecosystem Governance...\n');

  if (!fs.existsSync(INDEX_HTML_PATH)) {
    console.error(`ERROR: ${INDEX_HTML_PATH} does not exist. Run 'astro build' first.`);
    process.exit(1);
  }

  const html = fs.readFileSync(INDEX_HTML_PATH, 'utf8');

  if (!html.includes('class="partner-trust-ribbon"')) {
    console.error('FAIL: .partner-trust-ribbon element not found in index.html');
    process.exit(1);
  }
  console.log('✓ Found .partner-trust-ribbon container on homepage');

  if (!html.includes('Our partner ecosystem') && !html.includes('OUR PARTNER ECOSYSTEM')) {
    console.error('FAIL: Ribbon missing required label "Our partner ecosystem"');
    process.exit(1);
  }
  console.log('✓ Required title "Our partner ecosystem" present');

  const forbiddenLabels = ['TRUSTED BY', 'OUR STRATEGIC PARTNERS', 'TECHNOLOGY WE USE'];
  for (const forbidden of forbiddenLabels) {
    if (html.includes(forbidden)) {
      console.error(`FAIL: Forbidden label "${forbidden}" detected in homepage HTML`);
      process.exit(1);
    }
  }
  console.log('✓ No forbidden claims detected (TRUSTED BY, STRATEGIC PARTNERS, etc.)');

  const partnerFiles = fs.readdirSync(PARTNERS_DIR).filter(f => f.endsWith('.md')).sort();
  const expectedFiles = Object.keys(canonicalPartners).map(slug => `${slug}.md`).sort();

  if (JSON.stringify(partnerFiles) !== JSON.stringify(expectedFiles)) {
    console.error(`FAIL: Partner collection differs from owner-approved canonical list.\nExpected: ${expectedFiles.join(', ')}\nFound: ${partnerFiles.join(', ')}`);
    process.exit(1);
  }
  console.log(`✓ Canonical partner collection contains exactly ${expectedFiles.length} approved partner records`);

  let eligibleCount = 0;

  for (const [slug, domain] of Object.entries(canonicalPartners)) {
    const file = `${slug}.md`;
    const raw = fs.readFileSync(path.join(PARTNERS_DIR, file), 'utf8');
    const officialWebsite = extractQuotedField(raw, 'officialWebsite');

    if (officialWebsite !== domain) {
      console.error(`FAIL: ${slug} officialWebsite mismatch. Expected ${domain}; found ${officialWebsite ?? 'missing'}`);
      process.exit(1);
    }

    const isMarqueeEnabled = /homepageMarqueeEnabled:\s*true/.test(raw);
    const isRelationshipConfirmed = /relationshipConfirmed:\s*true/.test(raw);
    const isNameApproved = /publicNameApproved:\s*true/.test(raw);
    const isEligible = isMarqueeEnabled && isRelationshipConfirmed && isNameApproved;

    if (!isEligible) {
      console.error(`FAIL: Canonical partner "${slug}" is not enabled through all homepage publication gates`);
      process.exit(1);
    }

    eligibleCount++;
    if (!html.includes(`/partners/${slug}`)) {
      console.error(`FAIL: Eligible partner "${slug}" missing link in partner trust ribbon`);
      process.exit(1);
    }
  }
  console.log(`✓ All ${eligibleCount} canonical partners match official domains and render through publication gates`);

  if (!html.includes('class="marquee-track duplicate-track" aria-hidden="true"')) {
    console.error('FAIL: Visual duplicate track missing aria-hidden="true"');
    process.exit(1);
  }
  console.log('✓ Seamless duplicate track correctly marked aria-hidden="true"');

  if (!html.includes('prefers-reduced-motion') && !fs.readFileSync('src/components/PartnerTrustRibbon.astro', 'utf8').includes('prefers-reduced-motion')) {
    console.error('FAIL: PartnerTrustRibbon missing prefers-reduced-motion fallback');
    process.exit(1);
  }
  console.log('✓ Verified prefers-reduced-motion CSS fallback is declared');

  console.log('\nSUCCESS: Partner Trust Ribbon audit passed canonical-domain, technical, and governance checks.\n');
}

runTest();
