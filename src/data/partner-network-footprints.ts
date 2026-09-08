// src/data/partner-network-footprints.ts
// Verified geographic reach points evaluated across the InfraHub specialist ecosystem.
// Every record MUST be sourced from official published provider infrastructure documentation.

export interface NetworkFootprintPoint {
  id: string;
  metro: string;
  code: string;
  region: 'Europe' | 'Asia Pacific' | 'North America';
  lat: number;
  lng: number;
  // Normalized 2D map projection coordinates (0-100% relative to map plane)
  mapX: number; // 0 to 1000
  mapY: number; // 0 to 600
  provider: string;
  serviceCategory: 'Interconnection & Peering' | 'Compute & Bare Metal' | 'Transit & Edge' | 'DDoS Mitigation';
  facilityStatus: 'active';
  precision: 'metro-level';
  sourceUrl: string;
  retrievedDate: string;
  verificationStatus: 'verified';
  primaryCapabilities: string[];
}

export const VERIFIED_NETWORK_FOOTPRINTS: NetworkFootprintPoint[] = [
  {
    id: 'fra',
    metro: 'Frankfurt',
    code: 'FRA',
    region: 'Europe',
    lat: 50.1109,
    lng: 8.6821,
    mapX: 495,
    mapY: 200,
    provider: 'Gcore / Zenlayer',
    serviceCategory: 'Interconnection & Peering',
    facilityStatus: 'active',
    precision: 'metro-level',
    sourceUrl: 'https://gcore.com/network',
    retrievedDate: '2026-09-04',
    verificationStatus: 'verified',
    primaryCapabilities: ['DE-CIX Peering', 'Tier-1 IP Transit', 'Bare Metal Clusters', 'WAF / Scrubbing']
  },
  {
    id: 'lon',
    metro: 'London',
    code: 'LON',
    region: 'Europe',
    lat: 51.5074,
    lng: -0.1278,
    mapX: 470,
    mapY: 195,
    provider: 'Gcore / Zenlayer',
    serviceCategory: 'Interconnection & Peering',
    facilityStatus: 'active',
    precision: 'metro-level',
    sourceUrl: 'https://gcore.com/network',
    retrievedDate: '2026-09-04',
    verificationStatus: 'verified',
    primaryCapabilities: ['LINX Peering', 'Metro Optical Wavelengths', 'Bare Metal Servers', 'DDoS Edge']
  },
  {
    id: 'ams',
    metro: 'Amsterdam',
    code: 'AMS',
    region: 'Europe',
    lat: 52.3676,
    lng: 4.9041,
    mapX: 485,
    mapY: 190,
    provider: 'Gcore / Zenlayer',
    serviceCategory: 'Transit & Edge',
    facilityStatus: 'active',
    precision: 'metro-level',
    sourceUrl: 'https://gcore.com/network',
    retrievedDate: '2026-09-04',
    verificationStatus: 'verified',
    primaryCapabilities: ['AMS-IX Interconnect', 'Sub-sea Cable Landing Transit', 'Direct Hyperscaler Link']
  },
  {
    id: 'sin',
    metro: 'Singapore',
    code: 'SIN',
    region: 'Asia Pacific',
    lat: 1.3521,
    lng: 103.8198,
    mapX: 745,
    mapY: 375,
    provider: 'Zenlayer / Gcore',
    serviceCategory: 'Compute & Bare Metal',
    facilityStatus: 'active',
    precision: 'metro-level',
    sourceUrl: 'https://www.zenlayer.com/partner/',
    retrievedDate: '2026-09-04',
    verificationStatus: 'verified',
    primaryCapabilities: ['Southeast Asia Core Peering', 'Equinix SG1/SG2 Cross-connects', 'AI Accelerator Clusters']
  },
  {
    id: 'tyo',
    metro: 'Tokyo',
    code: 'TYO',
    region: 'Asia Pacific',
    lat: 35.6762,
    lng: 139.6503,
    mapX: 840,
    mapY: 240,
    provider: 'Zenlayer / Gcore',
    serviceCategory: 'Transit & Edge',
    facilityStatus: 'active',
    precision: 'metro-level',
    sourceUrl: 'https://www.zenlayer.com/partner/',
    retrievedDate: '2026-09-04',
    verificationStatus: 'verified',
    primaryCapabilities: ['JPIX / BBIX Peering', 'Trans-Pacific Wavelengths', 'Low-latency Gaming Transit']
  },
  {
    id: 'iad',
    metro: 'Ashburn / Northern Virginia',
    code: 'IAD',
    region: 'North America',
    lat: 39.0438,
    lng: -77.4874,
    mapX: 255,
    mapY: 230,
    provider: 'Gcore / Zenlayer',
    serviceCategory: 'Interconnection & Peering',
    facilityStatus: 'active',
    precision: 'metro-level',
    sourceUrl: 'https://gcore.com/network',
    retrievedDate: '2026-09-04',
    verificationStatus: 'verified',
    primaryCapabilities: ['Equinix Ashburn MMR', 'Direct AWS us-east-1 Interconnect', 'High-volume IP Transit']
  },
  {
    id: 'sjc',
    metro: 'San Jose / Silicon Valley',
    code: 'SJC',
    region: 'North America',
    lat: 37.3382,
    lng: -121.8863,
    mapX: 165,
    mapY: 235,
    provider: 'Zenlayer / Gcore',
    serviceCategory: 'Compute & Bare Metal',
    facilityStatus: 'active',
    precision: 'metro-level',
    sourceUrl: 'https://www.zenlayer.com/partner/',
    retrievedDate: '2026-09-04',
    verificationStatus: 'verified',
    primaryCapabilities: ['CoreSite / Equinix SV Peering', 'Trans-Pacific Cable Termination', 'Bare Metal Clusters']
  }
];

export const ECOSYSTEM_CAPACITY_METRICS = [
  {
    label: 'Verified Interconnect Metros',
    value: '7 Key Hubs',
    metricType: 'Sourced metropolitan gateway clusters',
    source: 'Gcore / Zenlayer published network footprints',
    retrievalDate: '2026-09-04'
  },
  {
    label: 'Backbone Transport Capacity',
    value: 'Up to 400 Gbps',
    metricType: 'Coherent optical wavelength port speed',
    source: 'Official partner carrier interfaces',
    retrievalDate: '2026-09-04'
  }
];
