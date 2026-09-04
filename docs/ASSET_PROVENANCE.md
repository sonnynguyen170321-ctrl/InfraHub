# InfraHub Asset Provenance Register

This document tracks the origin, legal classification, ownership status, and approval state of graphic and photographic assets in the InfraHub repository.

**Classification taxonomy:**
- `OFFICIAL_OWNER_SUPPLIED`: Provided directly by the InfraHub owner.
- `OFFICIAL_PARTNER_BRAND_KIT`: Downloaded directly from a partner's public brand or media kit.
- `OFFICIAL_PARTNER_WEBSITE`: Sourced directly from the partner's primary corporate website.
- `UNVERIFIED`: Asset present in the workspace but lacking verified source documentation.
- `SYNTHETIC_OR_REDRAWN`: Synthetic or approximated recreation. Forbidden from public trademark usage.
- `LICENSED_STOCK`: Commercially licensed documentary photography.

---

## 1. Brand Identity Assets

| Asset Path | Entity | Asset Type | Source | Owner Supplied? | Approval Status | Modified? | Notes |
|:---|:---|:---|:---|:---:|:---:|:---:|:---|
| `/logo.svg` | InfraHub | Primary Wordmark + Mark | InfraHub Identity Specification | Yes (Design System) | APPROVED | No | Canonical brand asset for light backgrounds |
| `/logo-light.svg` | InfraHub | Dark-mode Wordmark + Mark | InfraHub Identity Specification | Yes (Design System) | APPROVED | No | Canonical brand asset for dark backgrounds |
| `/mark.svg` | InfraHub | Symbol Mark (Cross + Node) | Header/Nav Brand Specification | Yes (Design System) | APPROVED | No | Standalone 28x28 icon mark |
| `/favicon.svg` | InfraHub | Browser Favicon | InfraHub Brand Geometry | Yes (Design System) | APPROVED | No | Multi-scale vector favicon |

---

## 2. Third-Party Partner Trademarks

> **Policy:** InfraHub must never recreate, recolour, or re-compose a partner trademark. A logo is used only as the partner publishes it, in the variant intended for the background it sits on. Until an official asset is imported and its use is approved, the production UI uses a restrained text-only partner mark.

The previously generated synthetic partner SVGs were removed from `public/images/partners/` during the canonical partner-domain correction. No third-party logo is currently rendered as an official logo unless a future record has both `logoStatus: approved` and `logoApproved: true`.

| Partner | Canonical Domain | Official Asset Source | Local Asset | Variant | Modified? | Verification |
|:---|:---|:---|:---|:---|:---:|:---|
| **FastNetMon** | https://fastnetmon.com/ | https://fastnetmon.com/wp-content/uploads/2025/10/logo_FastNetMon.png (brand kit) | `/images/partners/fastnetmon.png` | Dark wordmark + bolt (light backgrounds) | No | Verified byte-for-byte against source 2026-09-04 |
| **Gcore** | https://gcore.com/ | https://assets.gcore.pro/site-media/uploads/gcore_logo_orange_b7ea43b38e.svg (media kit) | `/images/partners/gcore.svg` | Orange horizontal logo | No | Byte-identical to source 2026-09-04 |
| **StormWall** | https://stormwall.network/ | https://content2.stormwall.network/swssn-en/dark-logo.svg | `/images/partners/stormwall.svg` | Dark variant for light backgrounds (#082554) | No | Replaced a locally recoloured white variant on 2026-09-04 |
| **Zenlayer** | https://www.zenlayer.com/ | https://www.zenlayer.com/wp-content/uploads/2023/10/zenlayer_logo-1-2.svg | `/images/partners/zenlayer.svg` | Primary horizontal logo | No | Byte-identical to source 2026-09-04 |
| **IPXO** | https://www.ipxo.com/ | https://github.com/IPXO/branding — Logo/SVG/GRD--1 light background.svg | `/images/partners/ipxo.svg` | Gradient mark, light-background variant | No | Byte-identical to source 2026-09-04 |
| **Vates** | https://vates.tech/ | https://vates.tech/assets/marketing-assets/Logos/vates-name-baseline-red.png | `/images/partners/vates.png` | Red wordmark with baseline (light backgrounds) | No | Replaced a locally assembled planet+text composite on 2026-09-04. Vates publishes no baseline-free horizontal wordmark; the baseline is small at ribbon size. OWNER ACTION: request a baseline-free horizontal mark. |
| **ITcare** | https://itcare.net/ | https://itcare.net/wp-content/uploads/logo-with-side-ITcare-removebg-preview-1.svg | `/images/partners/itcare.svg` | Dark/cyan variant for light backgrounds | No | Replaced a locally recoloured white variant on 2026-09-04 |
| **Airframe** | https://www.airframe.ai/ | https://www.airframe.ai/assets/airframe-lockup.png | `/images/partners/airframe.png` | Primary lockup | No | Byte-identical to source 2026-09-04 |

`Supertrace` is not part of the owner-confirmed canonical partner list and its old synthetic asset has been removed.

---

## 3. Documentary & Infrastructure Photography

> **Policy:** Photography is illustrative of infrastructure domains such as optical networking, compute clusters, facility architecture, and network operations. Images must never be captioned or presented in a way that implies InfraHub owns third-party facilities or equipment.

| Asset Path | Subject Domain | Source / Technique | Rights Status | Production Status | Representation Guardrail |
|:---|:---|:---|:---:|:---:|:---|
| `/images/hero-datacenter.jpg` | Enterprise Datacenter Corridor | Architectural Facility Photography | Approved for illustrative use | Active (Band 1 Hero) | Represents carrier-neutral colocation facilities; does not imply InfraHub ownership. |
| `/images/cloud-compute.jpg` | High-density compute racks | Hardware Infrastructure Photography | Approved for illustrative use | Active (Band 2 Solutions) | Illustrates private compute clusters and bare-metal environments. |
| `/images/network-fiber.jpg` | High-count optical fiber cross-connect | Telecom Cabling Photography | Approved for illustrative use | Active (Band 2 Solutions) | Illustrates dark fiber, metro wavelengths, and IP transit routing. |
| `/images/security-operations.jpg` | Security monitoring & telemetry console | Defensive Telemetry Screen | Approved for illustrative use | Active (Band 2 Solutions) | Illustrates traffic scrubbing and automated BGP DDoS telemetry. |
| `/images/managed-noc.jpg` | Network Operations Center engineering desk | Operator Facility Photography | Approved for illustrative use | Active (Band 2 Solutions) | Illustrates 24/7 proactive monitoring and escalation workflows. |
| `/images/physical-route-diversity.jpg` | Optical conduit & sub-duct route layout | Technical Network Engineering | Approved for illustrative use | Active (Wavelengths / Insights) | Illustrates physical conduit separation and bridge/rail diversity. |

---

## 4. Governance & Review Schedule

- **Canonical partner domains:** maintained in the partner content records and enforced by `tests/audit/partner-trust-ribbon.test.mjs`.
- **Logo gate:** an official logo may render only when the asset is sourced from an official partner property and explicitly approved for production use.
- **Pre-release gate:** `tests/audit/content-truth-audit.mjs` and `tests/audit/partner-trust-ribbon.test.mjs` must pass before release.
