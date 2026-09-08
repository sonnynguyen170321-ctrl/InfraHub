# InfraHub Network Data Provenance Register

This document provides the authoritative provenance, verification status, and official source links for all geographic locations, network footprints, and capacity metrics utilized in the InfraHub Discovery experience (Act 2) and Ecosystem Reach views.

> **Governance Policy:** No third-party network presence, PoP, facility, or capacity figure may be published or visualized on InfraHub unless it has been confirmed directly from an official provider media kit, network architecture documentation, or verified engineering source. Illustrative routes are strictly marked as illustrative.

---

## 1. Metropolitan Network Footprints (Ecosystem Reach View)

| Metro | IATA / Code | Region | Supporting Providers | Dataset Type | Official Source URL | Retrieval Date | Geographic Precision | Verification Status | Production Status |
|:---|:---:|:---|:---|:---|:---|:---:|:---:|:---:|:---:|
| **Frankfurt** | `FRA` | Europe | Gcore, Zenlayer | Metro Peering & Compute | https://gcore.com/network | 2026-09-04 | Metro-level | Verified | ACTIVE |
| **London** | `LON` | Europe | Gcore, Zenlayer | Peering & Wavelengths | https://gcore.com/network | 2026-09-04 | Metro-level | Verified | ACTIVE |
| **Amsterdam** | `AMS` | Europe | Gcore, Zenlayer | IX & Transit Gateway | https://gcore.com/network | 2026-09-04 | Metro-level | Verified | ACTIVE |
| **Singapore** | `SIN` | Asia Pacific | Zenlayer, Gcore | Bare Metal & APAC Core | https://www.zenlayer.com/partner/ | 2026-09-04 | Metro-level | Verified | ACTIVE |
| **Tokyo** | `TYO` | Asia Pacific | Zenlayer, Gcore | East Asia Transit & Edge | https://www.zenlayer.com/partner/ | 2026-09-04 | Metro-level | Verified | ACTIVE |
| **Ashburn / Northern Virginia** | `IAD` | North America | Gcore, Zenlayer | Cloud Cross-Connects & Fiber | https://gcore.com/network | 2026-09-04 | Metro-level | Verified | ACTIVE |
| **San Jose / Silicon Valley** | `SJC` | North America | Zenlayer, Gcore | Trans-Pacific Peering & Metal | https://www.zenlayer.com/partner/ | 2026-09-04 | Metro-level | Verified | ACTIVE |

---

## 2. Capacity & Metrics Definitions

| Metric Name | Published Value | Definition / Meaning | Provider Source | Retrieval Date | Comparative Guardrail | Production Status |
|:---|:---|:---|:---|:---:|:---|:---:|
| **Backbone Transport Port Capacity** | Up to 400 Gbps | Maximum coherent optical wavelength interface speed supported between primary metro facilities | Carrier partner interfaces (Gcore/Zenlayer transport specs) | 2026-09-04 | Must not be conflated with aggregate DDoS mitigation capacity or commit volume. | ACTIVE |
| **Volumetric Scrubbing Scale** | Multi-Tbps Anycast | Aggregate distributed Layer 3/4 filtering capacity across global scrubbing network | StormWall / Gcore DDoS network documentation | 2026-09-04 | Must be explicitly labeled as distributed DDoS filtering, never standard transit throughput. | ACTIVE |

---

## 3. Auditing & Compliance Standard

1. **Precision Rule:** All footprint markers are metro-level coordinates (`metro-level`). Exact street addresses or building IDs are never displayed unless explicitly confirmed by owner contract.
2. **Attribution Rule:** Footprints are displayed under the **InfraHub Ecosystem Reach** lens. Partners are cited strictly as supporting evidence for infrastructure reach, never as primary navigational anchors.
3. **Automated Verification:** Verified by `tests/audit/network-data-provenance.test.mjs` during the pre-build audit pipeline.
