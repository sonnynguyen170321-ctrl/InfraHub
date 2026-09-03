# InfraHub Asset Provenance Register

This document tracks the origin, legal classification, ownership status, and approval state of all graphic and photographic assets in the InfraHub repository.

**Classification Taxonomy:**
- `OFFICIAL_OWNER_SUPPLIED`: Provided directly by the InfraHub owner.
- `OFFICIAL_PARTNER_BRAND_KIT`: Downloaded directly from the partner's public press/brand kit.
- `OFFICIAL_PARTNER_WEBSITE`: Sourced directly from the partner's primary corporate website.
- `UNVERIFIED`: Asset present in workspace but lacking verified source documentation.
- `SYNTHETIC_OR_REDRAWN`: Synthetic or approximated recreation (FORBIDDEN from public trademark usage).
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

> **Policy:** Any asset classified as `SYNTHETIC_OR_REDRAWN` or `UNVERIFIED` must NOT be published as an official trademark. Where official brand assets are pending owner or partner confirmation, the application fails closed to a restrained text-only partner mark (`partner-text-mark`).

| Partner Entity | Asset Path | Classification | Official Brand Source? | Usage Approval | Production Status | Action Required |
|:---|:---|:---|:---:|:---:|:---:|:---|
| **FastNetMon** | `/images/partners/fastnetmon.svg` | `SYNTHETIC_OR_REDRAWN` | No | Pending Owner/Partner | Replaced by text mark | Obtain official vector brandkit from FastNetMon Ltd |
| **Gcore** | `/images/partners/gcore.svg` | `SYNTHETIC_OR_REDRAWN` | No | Pending Owner/Partner | Replaced by text mark | Obtain official vector presskit from Gcore S.A. |
| **IPXO** | `/images/partners/ipxo.svg` | `SYNTHETIC_OR_REDRAWN` | No | Pending Owner/Partner | Replaced by text mark | Obtain official brand assets from IPXO LLC |
| **ITcare** | `/images/partners/itcare.svg` | `SYNTHETIC_OR_REDRAWN` | No | Pending Owner/Partner | Replaced by text mark | Obtain official asset from ITcare Sp. z o.o. |
| **StormWall** | `/images/partners/stormwall.svg` | `SYNTHETIC_OR_REDRAWN` | No | Pending Owner/Partner | Replaced by text mark | Obtain official SVG from StormWall PRO s.r.o. |
| **Supertrace** | `/images/partners/supertrace.svg` | `SYNTHETIC_OR_REDRAWN` | No | Pending Owner/Partner | Replaced by text mark | Obtain official asset from Supertrace B.V. |
| **Vates** | `/images/partners/vates.svg` | `SYNTHETIC_OR_REDRAWN` | No | Pending Owner/Partner | Replaced by text mark | Obtain official press logo from Vates SAS (XCP-ng/Xen Orchestra) |
| **Zenlayer** | `/images/partners/zenlayer.svg` | `SYNTHETIC_OR_REDRAWN` | No | Pending Owner/Partner | Replaced by text mark | Obtain official vector logo from Zenlayer Inc. |

---

## 3. Documentary & Infrastructure Photography

> **Policy:** Photography is strictly illustrative of infrastructure domains (optical networking, compute clusters, facility architecture, network operations). Images must never be captioned or presented in a way that implies InfraHub owns third-party facilities or equipment.

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

- **Owner Verification Required:** Review partner asset requests in `docs/FINAL_OWNER_INPUT_REGISTER.md`.
- **Pre-Release Gate:** `tests/audit/content-truth-audit.mjs` and `tests/audit/partner-trust-ribbon.test.mjs` must enforce that no unapproved or synthetic partner trademark renders in production.
