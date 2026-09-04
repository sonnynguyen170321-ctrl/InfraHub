# InfraHub Design System & Brand Architecture

**Version:** 3.0.0 — Category-Defining Product Experience (Final Directive)  
**Product Identity:** InfraHub.tech  
**Business Model:** Independent B2B Infrastructure Sourcing & Commercial Advisory Desk  

---

## 1. Creative Thesis: The Infrastructure Field Guide

InfraHub is an infrastructure sourcing, advisory, and specialist-partner desk. It is authored by engineers and operators with carrier, routing, and facility judgment.

The visual and architectural concept is **The Infrastructure Field Guide**:
1. **Engineering Field Guide:** Precise, structured technical analysis explaining what changes the infrastructure decision (e.g. 95th percentile billing vs committed data rates, BGP FlowSpec vs RTBH, hypervisor migration trade-offs, physical conduit route diversity).
2. **Infrastructure Atlas:** Documenting physical routes, data center fabrics, cross-connect topologies, and provider dependencies with documentary realism.
3. **Commercial Advisory Desk:** Objective market guidance, unearned marketing claims rejected, fail-closed pricing, and direct introduction to specialist operators.

---

## 2. The Signature Motif: The Routing Line

Derived from fiber paths, cross-connects, BGP autonomous system boundaries, and physical conduit trenches:
- **Structural Role:** Restrained 1px structural hairpins with defined junction points (`.routing-line-horizontal`, `.routing-junction`).
- **No Decorative Slop:** Prohibits circuit-board wallpapers, random animated dot meshes, glowing neon particle grids, or sci-fi tech holograms.
- **Purpose:** Connects decisions, stages, and technical relationships visually across pages and diagrams.

---

## 3. Typography: Engineering-Literate Sans & Monospace

Standardized on **IBM Plex** across the entire digital estate:

| Role | Typeface | Weights | Purpose & Characteristics |
|:---|:---|:---|:---|
| **Headings & Display** | `IBM Plex Sans` | 600, 700, 800 | Industrial grotesque with architectural balance. Never generic startup font. Natural tracking, relaxed line heights (1.2 to 1.35). |
| **Editorial & Body** | `IBM Plex Sans` | 400, 500, 600 | Clear legibility across technical documentation, service comparisons, and partner profiles. |
| **Data & Technical Metadata** | `IBM Plex Mono` | 400, 500, 600 | Monospaced figures for ASNs, CDRs, CIDR subnets, VLAN IDs, protocol specs, and timing telemetry. |

### Editorial Reading Measures
- **Marketing Lead:** 42–55ch (`.measure-lead`)
- **Technical Explanation:** 58–68ch (`.measure-technical`)
- **Insight Analysis Body:** 60–72ch (`.measure-insight`)
- **Metadata & Compact Callouts:** 38–46ch (`.measure-compact`)

---

## 4. Mineral & Infrastructure Palette

Bespoke palette inspired by physical telecom conduits, optical fiber, and architectural materials:

| Color Name | Hex Code | Purpose |
|:---|:---|:---|
| **Carbon** | `#091118` | Deep datacenter core, primary text, high-density dark bands |
| **Deep Navy** | `#0C1722` | Secondary dark surface, terminal backgrounds |
| **Ink** | `#17212A` | Elevated dark card surfaces, border treatments on dark |
| **Paper** | `#F4F5F1` | Architectural broadsheet light background, editorial ledger rows |
| **Mist** | `#E9ECE8` | Subtle grouping background, technical callouts |
| **Structural Grey** | `#D2D7D3` | 1px structural hairpins, dividers, junction borders |
| **InfraHub Cobalt** | `#2854C7` | Primary interactive cues, route selections, verified badges |
| **Signal Teal** | `#087D79` | Carrier telemetry, secondary indicators, status active |
| **Route Amber** | `#B86B2B` | Shared physical dependency highlights, warnings, risk advisories |

---

## 5. Surface & Radius Hierarchy

InfraHub uses fine structural rules, authentic documentary photography, and typography rather than heavy box shadows or nested cards:
- **0px:** Major architectural sections, full-width headers, divider lines.
- **2px (`--radius-sm`):** Buttons, interactive links, junction boxes, route tags.
- **4px (`--radius-md`):** Lead containers, partner ledger blocks, decision cards.
- **8px (`--radius-lg`):** Max allowable corner radius on modal dialogs or isolated callouts.
- **Shadows:** Minimalist architectural elevation (`0 1px 2px rgba(9, 17, 24, 0.04)` to `0 8px 20px rgba(9, 17, 24, 0.05)`). Never colorful button glows or heavy blurry drop-shadows.

---

## 6. Grid & Layout Composition

12-column responsive editorial grid (`max-width: 1280px`):
- **Desktop Compositions:** Asymmetrical splits reflecting editorial content: `4 / 8`, `5 / 7`, `7 / 5`, `3 / 9`. Avoids universal `6 / 6` splits.
- **Photography Bleed:** High-resolution documentary photography anchored to outer boundaries, establishing physical reality.

---

## 7. Signature Interactive Experiences

### A. Partner Directory: Editorial Ecosystem Ledger (`/partners`)
Replaces card grids with an authoritative ledger organized into 6 core disciplines:
1. **Infrastructure & Cloud:** Distributed compute, bare-metal, edge fabrics.
2. **Defensive & Routing Security:** Flow telemetry, automated mitigation, scrubbing centers.
3. **Network & IP Resources:** IPv4 leasing, transfer governance, RPKI routing health.
4. **Virtualization Architecture:** Hypervisor sovereignty, XCP-ng, Xen Orchestra.
5. **Managed Network Operations:** NOC triage, 24/7 runbook automation, carrier escalation.
6. **Technology Decision Support:** Benchmark sourcing, vendor RFP distillation.

### B. Solution Discovery: 3-Column Architectural Triad
1. **Left (Discipline Index):** Numbered typographic navigation tabs.
2. **Center (Authentic Visual):** Documentary photography capturing physical hardware, fiber conduits, or NOC operations.
3. **Right (Editorial Brief & Route Actions):** Concise problem statement and direct paths into relevant service architecture.
- **Mobile Mode:** Semantic, accessible `<details>` / `<summary>` accordion.

### C. Physical Route Diversity Explorer (`RouteDiversityExplorer.astro`)
An interactive technical exhibit demonstrating: *"Two carriers. Two contracts. One physical dependency."*
- **State 1 (Logical Path):** Carrier A and Carrier B appear independent with separate ASNs and upstream paths.
- **State 2 (Physical Path):** Reveals shared physical infrastructure (e.g. municipal bridge conduit, entrance facility) highlighted in Route Amber (`#B86B2B`).
- **Educational Value:** Teaches buyers why carrier diversity does not automatically guarantee physical route survivability. Embedded on Network & Connectivity and Wavelengths pages with zero heavy 3D penalty on initial homepage load.

---

## 8. Motion & Microinteractions (Emil Kowalski Standard)

- **Purpose:** Response, state change, and explanation only. Never decorative distraction.
- **Standard Curve:** `cubic-bezier(0.23, 1, 0.32, 1)` (ease-out).
- **Duration:** 120ms to 240ms for all UI transitions.
- **Button Feedback:** Subtle tactile press response (`transform: translateY(1px)`), no bouncy lift.
- **Marquee:** Hardware-accelerated continuous linear scroll with pause-on-hover and `:focus-within`.
- **Accessibility:** Instant layout state with `animation: none !important` under `@media (prefers-reduced-motion: reduce)`.

---

## 9. Partner Trust Governance (Fail-Closed)

All partner records in `src/content/partners/*.md` enforce strict verification gates:
- Only canonical partners with verified provenance display approved vector assets (FastNetMon, Gcore, StormWall, Zenlayer, IPXO, Vates, ITcare, Airframe).
- Never render unverified third-party logos.
- If an asset is pending, the system falls back to a clean typographic label.
- Commercial pricing is fail-closed (`displayPrice: "Request current pricing"` when variable).

---

## 10. Prohibited Anti-Patterns

1. **No Startup Template Slop:** No floating pastel blobs, no gradient borders, no 3-card equal bento boxes.
2. **No Faux Terminal Widgets:** No artificial green-screen CLI simulators or fake terminal shell windows.
3. **No Decorative 3D on Homepage:** Three.js is restricted to dedicated technical modules; the homepage relies on authentic documentary photography.
4. **No Unearned Status Badges:** No fabricated "Top Provider" or "Official Partner" pills without empirical verification.
5. **No Universal MSA Claims:** State clearly that services are contracted directly under each specialist's terms.
