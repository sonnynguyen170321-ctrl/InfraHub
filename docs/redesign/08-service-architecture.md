# Phase 8 — Service Architecture & Solution Dossiers

**Classification:** CURRENT_CANONICAL  
**Date:** 2026-09-06  
**Branch:** `redesign/phase8-inner-pages`  
**Master Plan Reference:** [MASTER_PLAN.md](MASTER_PLAN.md) §11, §12, §28 Phase 8  
**Design System Reference:** [06-design-system.md](06-design-system.md)  
**Homepage Reference:** [07-homepage-build.md](07-homepage-build.md)  

---

## 1. Executive Summary

Phase 8 elevates InfraHub's five core solution families from generic marketing overview pages into authoritative, engineering-grade solution dossiers. Each page is re-architected as an exhaustive technical field guide that speaks directly to network architects, infrastructure directors, and VP-level engineering leadership.

### The Five Solution Disciplines

1. **Discipline 01: Network & Global Connectivity** (`/solutions/network-connectivity`)
   - Optical wavelengths, dark fiber, IP transit, and Layer 2 carrier Ethernet.
   - Embedded interactive `RouteDiversityExplorer` highlighting physical path vs. logical dual-homing diversity.
   - Verified specialists: **Zenlayer**, **Gcore**.
   - Consultation CTA: `Consult a Network Architect` &rarr; `/lets-talk?service=connectivity`.

2. **Discipline 02: Cloud & Virtualization Architecture** (`/solutions/cloud-virtualization`)
   - Vates / XCP-ng open-source hypervisor alternatives to VMware, private sovereign clouds, bare metal orchestrations, and multi-cloud interconnects.
   - Diligence standards for live Xen migration, vCPU oversubscription, NVMe direct IOPS, and hypervisor software lock-in elimination.
   - Verified specialists: **Vates**, **Gcore**, **Zenlayer**.
   - Consultation CTA: `Consult a Cloud Architect` &rarr; `/lets-talk?service=cloud`.

3. **Discipline 03: Dedicated Infrastructure & Compute** (`/solutions/infrastructure`)
   - High-density bare metal fleets, wholesale enterprise hardware brokerage, liquid-cooled GPU AI training clusters, and colocation.
   - Diligence standards for dual-corded ATS power feeds, IPMI out-of-band security, carrier-neutral meet-me rooms, and secondary hardware remarketing.
   - Verified specialists: **Zenlayer**, **Gcore**, **Airframe**.
   - Consultation CTA: `Consult an Infrastructure Architect` &rarr; `/lets-talk?service=dedicated-infrastructure`.

4. **Discipline 04: Security & Network Defense** (`/solutions/security`)
   - Multi-terabit cloud scrubbing networks, FastNetMon near-real-time sFlow/NetFlow telemetry, automated BGP FlowSpec diversion, RPKI route hygiene, and perimeter audits.
   - Diligence standards for clean-traffic GRE return topologies, detection sampling rates, L4 vs L7 challenge-response depth, and attack mitigation SLAs.
   - Verified specialists: **FastNetMon**, **StormWall**, **Gcore**, **ITcare**.
   - Consultation CTA: `Discuss Security Requirements` &rarr; `/lets-talk?service=ddos-security`.

5. **Discipline 05: Managed Operations & 24/7 NOC** (`/solutions/managed-services`)
   - Round-the-clock incident monitoring, syslog event clustering, HORA AIOps telemetry, BGP routing advisory, and network automation pipelines (Ansible/NetBox).
   - Diligence standards for direct L2/L3 escalation access, monitoring runbook fidelity, Tier-1 carrier coordination, and multi-vendor OS proficiency.
   - Verified specialists: **ITcare**, **FastNetMon**, **Airframe**.
   - Consultation CTA: `Consult an Operations Architect` &rarr; `/lets-talk?service=managed-services`.

---

## 2. Nine-Part Editorial Architecture

Every solution page strictly implements a uniform, high-density editorial architecture:

| Chapter | Purpose | Architectural Implementation |
|---|---|---|
| **01. Discipline Kicker & Title** | Unambiguous domain identity | Monospace technical kicker (`Discipline 0X • ...`), single H1, and editorial thesis lead. |
| **02. Technical Telemetry Bar** | Monospace specification badges | Hard engineering metrics (e.g., `CARRIER DIVERSITY: TRUE DUAL PATH`, `LATENCY: SLA-BACKED`). |
| **03. Trigger Scenarios** | 4 concrete engineering situations | Numbered situation ledger (`01` through `04`) illustrating exact failure modes and architectural catalysts. |
| **04. Architectural Sourcing Ledger** | Available engineering disciplines | Structured ledger rows featuring monospace kickers, headline, description, and direct exploration links. |
| **05. Signature Demonstration** | Concrete engineering proof | Embedded interactive exhibit (e.g., `RouteDiversityExplorer` on Discipline 01) proving domain claims. |
| **06. Engineering Diligence Matrix** | Qualification and verification standards | 4-point matrix detailing what InfraHub inspects during supplier vetting (power, latency, routing, return models). |
| **07. Verified Ecosystem Specialists** | Curated canonical partner links | High-contrast partner cards linking directly to canonical `/partners/[slug]` profiles. |
| **08. Delivery Governance Disclosure** | Truth governance & contract transparency | Clear statement that commercial contracts, SLAs, and technical operations are held directly with providers. |
| **09. Principal Action CTA** | Contextual conversion gateway | Dual-column band featuring direct principal access, SLA response commitments, and pre-scoped query parameters. |

---

## 3. Strict Compliance & Invariants

- **Truth Governance & Partner Canonical Limits:** Mentions are strictly limited to the 8 canonical approved partners (FastNetMon, Gcore, StormWall, Zenlayer, IPXO, Vates, ITcare, Airframe). Zero unverified claims or unsupported partner badges.
- **Single H1 per Page:** Audited via `accessibility-audit.mjs` across all 51 prerendered routes with zero errors.
- **Zero Hover Lift & Transition Restraint:** Strictly no `transform: translateY(-...)` or `transition: all`, preventing UI jitter and conforming to `human-design-audit.test.mjs`.
- **Pre-Selected Inquiry Scope:** Every solution CTA pre-populates its corresponding `#context-service` and `#lookingFor` inputs on `/lets-talk` (verified via `tests/e2e/lets-talk.spec.ts`).
- **WCAG AAA Accessible Contrast:** All text, badges, borders, and controls satisfy WCAG AAA standards on both Deep Bedrock (`#050811`) and Midnight Slate (`#0b1120`) grounds.

---

## 4. Verification Evidence

- `npm run check`: **0 errors, 0 warnings, 0 hints** across 104 files.
- `npm run build`: **51 routes prerendered cleanly** into `dist/client/`.
- `npm test`: **All 8 static audits passed** (100% clean routes, accessibility, truth governance, partner assets, human design forensics).
- Playwright e2e suite: **All 157 tests passed** across desktop and mobile viewports.
