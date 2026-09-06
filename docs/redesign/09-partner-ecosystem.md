# Phase 9 — Partner Ecosystem & Decision Layer Architecture

**Classification:** CURRENT_CANONICAL  
**Date:** 2026-09-06  
**Branch:** `redesign/phase9-partners`  
**Master Plan Reference:** [MASTER_PLAN.md](MASTER_PLAN.md) §17, §27 Phase 9  
**Art Direction Reference:** [05-homepage-art-direction.md](05-homepage-art-direction.md)  
**Design System Reference:** [06-design-system.md](06-design-system.md)  

---

## 1. Executive Summary

Phase 9 establishes the definitive engineering validation, content truth enforcement, and visual elevation of the InfraHub Partner Ecosystem across both the directory ledger (`/partners`) and the individual partner decision dossiers (`/partners/[slug]`).

The ecosystem avoids generic "logo wall" tropes by operating as a curated wholesale infrastructure directory and decision framework. Every listed partner represents an active, verified commercial relationship with strict provenance validation and zero unevidenced marketing claims.

### Canonical Approved Partners (8 Records)

Only eight partners are approved for public directory display and homepage marquee placement:

1. **FastNetMon** (`/partners/fastnetmon`)
   - Role: DDoS Detection & Mitigation Control Plane
   - Core Architecture: Flow telemetry (sFlow, NetFlow, IPFIX) & sub-second BGP FlowSpec / RTBH triggers.
   - Optical scale: `1.5` (calibrated for vertical wordmark proportions).

2. **Gcore** (`/partners/gcore`)
   - Role: Cloud, Edge, AI & Security Platform
   - Core Architecture: Global edge infrastructure, GPU clusters, CDN, and volumetric DDoS scrubbing.
   - Optical scale: `1.0`.

3. **StormWall** (`/partners/stormwall`)
   - Role: DDoS, WAF & Application Protection
   - Core Architecture: Multi-terabit cloud scrubbing, symmetrical GRE tunnel returns, anti-bot challenge.
   - Optical scale: `1.0`.

4. **Zenlayer** (`/partners/zenlayer`)
   - Role: Distributed Cloud, Compute & Connectivity
   - Core Architecture: Global bare-metal edge cloud, Layer 2 Ethernet backbone, private cloud connect.
   - Optical scale: `1.0`.

5. **IPXO** (`/partners/ipxo`)
   - Role: IPv4 Leasing & Address Management Platform
   - Core Architecture: Automated IP address leasing marketplace, RPKI delegation, route authorization.
   - Optical scale: `1.0`.

6. **Vates** (`/partners/vates`)
   - Role: Open-Source Virtualization & Management Stack
   - Core Architecture: XCP-ng hypervisor & Xen Orchestra management appliance (VMware exit paths).
   - Optical scale: `1.0`.

7. **ITcare** (`/partners/itcare`)
   - Role: Network Engineering, NOC & Automation
   - Core Architecture: 24/7/365 NOC operations, L2/L3 engineering escalation, HORA AIOps telemetry.
   - Optical scale: `1.0`.

8. **Airframe** (`/partners/airframe`)
   - Role: Technology Decision Intelligence & Vendor Diligence
   - Core Architecture: Vendor due diligence, technology market intelligence, build-vs-buy evaluations.
   - Optical scale: `1.0`.

---

## 2. Directory Architecture (`/partners`)

The partner directory is organized into six authoritative technical disciplines rather than an arbitrary card grid:

- **01 Infrastructure & Cloud:** Dedicated compute, hypervisors, bare metal, distributed edge (Gcore, Zenlayer).
- **02 Defensive & Routing Security:** DDoS detection, routing controls, traffic diversion (FastNetMon, StormWall).
- **03 Network & IP Resources:** IPv4 address leasing, transfer governance, RPKI validation (IPXO).
- **04 Virtualization Architecture:** Enterprise open-source hypervisors, backup, cluster replication (Vates).
- **05 Managed Network Operations:** 24/7 NOC services, engineering advisory, automation (ITcare).
- **06 Technology Decision Support:** Market mapping, vendor diligence, build-vs-buy analysis (Airframe).

### Sourcing & Diligence Framework (Master Plan §17)

The directory incorporates a 4-stage engineering qualification framework:
- **01 Technical Diligence:** Audit network presence, public routing policy, and hypervisor architectures.
- **02 Workload Qualification:** Match buyer requirements against geographic proximity, packet size, and compliance.
- **03 Commercial Transparency:** Surface hidden constraints (egress tiers, lead times, minimum commits).
- **04 Direct Provider Introductions:** Direct MSA/SLA contracting between buyer and provider without reseller markup.

### Commercial Role & Governance Disclosure

> **Commercial Governance:** InfraHub is an independent wholesale infrastructure advisory firm. We do not take custody of network traffic, operate as an opaque billing reseller, or add intermediary markups to provider pricing. Commercial terms, master service agreements, and operational service levels are held directly with the specialist provider.

---

## 3. Decision Layer Framework (`/partners/[slug]`)

Each partner dossier implements the **Buyer-Decision Layer**, providing prospective infrastructure buyers with operational clarity before an introduction is made:

1. **Subject-Specific Architecture Flow (Steps 01–04):**
   A 4-step sequence detailing how the partner's technology operates in an enterprise network topology.
2. **Questions We Ask First:**
   Three critical technical qualification questions that change the architectural answer.
3. **Workload Suitability:**
   Explicit boundaries defining *When this fits* vs. *When an alternative fits*.
4. **Commercial & Operational Caution ("What Buyers Often Miss"):**
   Unvarnished analysis of contract minimums, hardware prerequisites, or routing dependencies.
5. **Source Provenance:**
   Clickable external citations linking directly to the partner's official documentation.
6. **Direct Advisory Gateway:**
   Contextual CTA linking to `/lets-talk?partner=[slug]` with pre-qualified parameters.

---

## 4. Optical Sizing & Asset Provenance

- **FastNetMon Optical Calibration:** Because FastNetMon's wordmark occupies only 39% of its canvas height compared to other logos, a `logoScale: 1.5` multiplier is enforced on both the homepage marquee and the `/partners` directory (`tests/e2e/partners.spec.ts` test: height > median of others).
- **Asset Integrity Audit (`tests/audit/partner-assets.test.mjs`):**
  - All 8 canonical logos resolve to non-empty files in `/public/images/partners/`.
  - Every asset has a verified entry in `docs/ASSET_PROVENANCE.md`.
  - Zero locally composed lockups or unapproved candidate brands are displayed.

---

## 5. Verification Evidence

- `npm run check`: **0 errors, 0 warnings, 0 hints** across 104 files.
- `npm run build`: **51 routes prerendered cleanly** into `dist/client/`.
- `npm test`: **All 8 static audits passed** (100% clean routes, accessibility, truth governance, partner assets, human design forensics).
- Partner Playwright Suite: **All 32/32 tests passed** across `partners.spec.ts`, `partner-trust-ribbon-premium.spec.ts`, and `partner-ribbon-geometry.spec.ts`.
- Full E2E Playwright Suite: **All 157/157 tests passed** cleanly across all viewports.
