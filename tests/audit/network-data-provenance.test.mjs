// tests/audit/network-data-provenance.test.mjs
// Automated governance audit enforcing that all network footprints and capacity metrics
// used in production are verified, sourced, and dated.

import fs from 'node:fs';
import path from 'node:path';
import { VERIFIED_NETWORK_FOOTPRINTS, ECOSYSTEM_CAPACITY_METRICS } from '../../src/data/partner-network-footprints.ts';

console.log('Running Network Data Provenance & Governance Audit...\n');

let errors = [];

// 1. Verify all network footprints
if (!Array.isArray(VERIFIED_NETWORK_FOOTPRINTS) || VERIFIED_NETWORK_FOOTPRINTS.length === 0) {
  errors.push('VERIFIED_NETWORK_FOOTPRINTS is empty or missing');
} else {
  console.log(`Auditing ${VERIFIED_NETWORK_FOOTPRINTS.length} geographic network footprint records...`);

  for (const point of VERIFIED_NETWORK_FOOTPRINTS) {
    if (!point.id || !point.metro || !point.code) {
      errors.push(`Footprint point missing ID, metro, or code: ${JSON.stringify(point)}`);
    }
    if (!point.provider || typeof point.provider !== 'string') {
      errors.push(`Footprint point ${point.id} missing provider attribute`);
    }
    if (!point.sourceUrl || !point.sourceUrl.startsWith('http')) {
      errors.push(`Footprint point ${point.id} has invalid or missing source URL: ${point.sourceUrl}`);
    }
    if (!point.retrievedDate || !/^\d{4}-\d{2}-\d{2}$/.test(point.retrievedDate)) {
      errors.push(`Footprint point ${point.id} missing valid ISO retrievedDate (YYYY-MM-DD): ${point.retrievedDate}`);
    }
    if (point.precision !== 'metro-level' && point.precision !== 'facility-level') {
      errors.push(`Footprint point ${point.id} has unapproved precision: ${point.precision}`);
    }
    if (point.verificationStatus !== 'verified') {
      errors.push(`Footprint point ${point.id} has unapproved verificationStatus: ${point.verificationStatus}`);
    }
    if (typeof point.mapX !== 'number' || typeof point.mapY !== 'number') {
      errors.push(`Footprint point ${point.id} missing valid map projection coordinates (mapX, mapY)`);
    }
  }
  console.log('✓ All geographic footprint records passed strict provenance & verification checks');
}

// 2. Verify capacity metrics
if (!Array.isArray(ECOSYSTEM_CAPACITY_METRICS) || ECOSYSTEM_CAPACITY_METRICS.length === 0) {
  errors.push('ECOSYSTEM_CAPACITY_METRICS is empty or missing');
} else {
  console.log(`Auditing ${ECOSYSTEM_CAPACITY_METRICS.length} ecosystem capacity metric records...`);

  for (const metric of ECOSYSTEM_CAPACITY_METRICS) {
    if (!metric.label || !metric.value) {
      errors.push(`Metric missing label or value: ${JSON.stringify(metric)}`);
    }
    if (!metric.metricType) {
      errors.push(`Metric ${metric.label} missing metricType definition`);
    }
    if (!metric.source) {
      errors.push(`Metric ${metric.label} missing official source`);
    }
    if (!metric.retrievalDate || !/^\d{4}-\d{2}-\d{2}$/.test(metric.retrievalDate)) {
      errors.push(`Metric ${metric.label} missing valid ISO retrievalDate: ${metric.retrievalDate}`);
    }
  }
  console.log('✓ All capacity metrics passed governance definition and source checks');
}

// 3. Verify NETWORK_DATA_PROVENANCE.md exists on disk
const docPath = path.resolve('docs/NETWORK_DATA_PROVENANCE.md');
if (!fs.existsSync(docPath)) {
  errors.push('docs/NETWORK_DATA_PROVENANCE.md does not exist');
} else {
  const docContent = fs.readFileSync(docPath, 'utf8');
  for (const point of VERIFIED_NETWORK_FOOTPRINTS) {
    if (!docContent.includes(point.metro)) {
      errors.push(`docs/NETWORK_DATA_PROVENANCE.md is missing metro entry for: ${point.metro}`);
    }
  }
  console.log('✓ docs/NETWORK_DATA_PROVENANCE.md is up-to-date with all active footprint entries');
}

if (errors.length > 0) {
  console.error('\nNETWORK DATA PROVENANCE AUDIT FAILED:');
  errors.forEach(err => console.error(`  ✖ ${err}`));
  process.exit(1);
} else {
  console.log('\nSUCCESS: Network Data Provenance and Governance audit passed cleanly!\n');
}
