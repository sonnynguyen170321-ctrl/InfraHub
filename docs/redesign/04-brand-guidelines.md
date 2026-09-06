# InfraHub Brand Guidelines — Identity Specification & Technical Standards

**Classification:** CURRENT_CANONICAL  
**Version:** 2.0.0 (Production Master)  
**Date:** 2026-09-06  
**Branch:** `identity/phase4-production`  
**Master Plan Reference:** [MASTER_PLAN.md](MASTER_PLAN.md) §8, §27 Phase 4  
**Identity Concepts Reference:** [03-identity-concepts.md](03-identity-concepts.md)  
**Research Baseline:** [02-brand-research.md](02-brand-research.md)  

---

## 1. Executive Summary & Brand Purpose

InfraHub is a high-assurance infrastructure platform and wholesale connectivity advisory for network operators, cloud platforms, hosting providers, and large enterprises.

Our brand identity expresses **ground truth in physical connectivity**:
- Where commodity telecom and cloud brokers market vague "cloud bubbles" and abstract hexagons, InfraHub visualizes the physical conduits, fiber paths, BGP convergence points, and failover mechanics that keep networks online.
- The InfraHub identity system was engineered from first principles to meet the standard of a **$50,000 brand and digital design engagement**, anchoring an identity strong enough to stand independently as a **$5,000+ professional trademark and engineering seal**.

---

## 2. Master Symbol: The Convergence Pylon

The official brandmark of InfraHub is **The Convergence Pylon**.

```
       ┌──┐     ┌──┐
       │  │     │  │  ◀── Primary Dual Data Stems (Separate Physical Paths)
       │  │     │  │
       │  │     │  │
       │  └──┐  │  │
       │     └──┘  │  ◀── 45° Calibrated Chamfers
       │           │
       └─────┬─────┘  ◀── Convergence Pylon Anchor (Unified BGP / Transit Truth)
             │
             ▼
```

### Geometric Construction & Coordinate Matrix
The symbol is constructed on a strict **32 × 32 unit coordinate grid** with zero arbitrary curves:
1. **Left Primary Conduit:** Descends vertically from `(2, 2)` to `(11, 26)`, stepping inward with a 45° chamfer to interface directly with the central anchor base at `(16, 30)`.
2. **Right Secondary Conduit:** Descends vertically from `(21, 2)` to `(30, 26)`, anchoring the opposing physical path.
3. **The Convergence Pylon Anchor:** Forms a unified keystone between the two vertical trunks, terminating at a grounded 90° horizontal base.
4. **The Critical Optical Channel:** A calibrated 10-unit optical channel separates the two conduits at the top (`x = 11` to `x = 21`), ensuring total legibility down to 14 pixels.
5. **Inner Convergence Notch:** Cut with a sharp 45° internal fillet, reflecting physical waveguide routing and laser path divergence.

---

## 3. Clearspace, Safe Zones, and Sizing Standards

### The Unit Clearspace Formula ($X$)
Clearspace is defined proportionally by the variable $X$, where $X$ equals **25% of the symbol's total height** (e.g., for a 32px mark, $X = 8\text{px}$; for a 64px mark, $X = 16\text{px}$).

- **Mandatory Safe Zone:** No graphic element, text, border, or competing logo may encroach within the $1X$ perimeter surrounding the symbol or wordmark lockup.
- **Header Margins:** When deployed in website headers, the clearspace above and below the lockup must be at least $1.25X$.

```
     ┌───────────────────────────────────────────────┐
     │                      1X                       │
     │     ┌───────────────────────────────────┐     │
     │  1X │  [ CONVERGENCE PYLON ]  INFRAHUB  │  1X │
     │     └───────────────────────────────────┘     │
     │                      1X                       │
     └──────────────────────────────────────────────┘
```

### Minimum Sizing Thresholds
- **Digital Favicon / Micro-UI:** Minimum 14 × 14 px (optically centered without wordmark).
- **Desktop Navigation Mark:** Minimum 24 × 24 px (standard 28 × 28 px).
- **Physical Server Chassis / Hardware Faceplate:** Minimum 8.0 mm height (laser etched or anodized aluminum).
- **Print / Technical Whitepaper:** Minimum 5.0 mm height (14.2 pt).

### Absolute Prohibition: Container Independence
The mark **must never be encapsulated inside a rounded square, circle, badge, or glowing box**. It stands as a self-supporting structural architecture on the canvas background.

---

## 4. Chromatic System & Color Specifications

The InfraHub palette reflects high-assurance telemetry, submarine cable conduits, and precision instrumentation.

### Primary Brand Palette

| Color Name | Swatch Code | HEX | RGB | HSL | CMYK | Role / Usage |
|---|:---:|---|---|---|---|---|
| **Midnight Slate** | Base 950 | `#0b1120` | `11, 17, 32` | `223°, 49%, 8%` | `66, 47, 0, 87` | Master canvas, dark mode root, executive terminal background. |
| **Deep Bedrock** | Base 1000 | `#050811` | `5, 8, 17` | `225°, 55%, 4%` | `71, 53, 0, 93` | Deepest contrast layer, code blocks, navigation surfaces. |
| **Infrastructure Cobalt** | Signal Primary | `#2563eb` | `37, 99, 235` | `221°, 83%, 53%` | `84, 58, 0, 8` | Primary brand signal, main conduit path, interactive primary actions. |
| **Electric Sky** | Convergence Cyan | `#38bdf8` | `56, 189, 248` | `198°, 93%, 60%` | `77, 24, 0, 3` | Convergence focal point, telemetry pings, high-contrast highlights. |
| **Mineral White** | Paper Light | `#f8fafc` | `248, 250, 252` | `210°, 40%, 98%` | `2, 1, 0, 1` | Primary editorial typography, reverse monochrome symbol executions. |
| **Metric Amber** | Diagnostic Alert | `#f59e0b` | `245, 158, 11` | `38°, 92%, 50%` | `0, 35, 96, 4` | Route flap alerts, SLA threshold warnings, diagnostic badges. |

### Contrast Compliance Matrix (WCAG 2.2)
- `#f8fafc` on `#0b1120`: **17.8:1** (Passes WCAG AAA for all text)
- `#38bdf8` on `#0b1120`: **9.4:1** (Passes WCAG AAA for all text & UI)
- `#2563eb` on `#0b1120`: **4.8:1** (Passes WCAG AA for UI controls and large headings)
- `#0b1120` on `#f8fafc`: **17.8:1** (Passes WCAG AAA in print / light modes)

---

## 5. Typographic System & Lockup Engineering

### The Custom Wordmark: "INFRAHUB"
The wordmark is set in uppercase, derived from **IBM Plex Sans SemiBold / Bold**, with proprietary geometric modifications:
1. **Letterform Proportions:** Cap height precisely matches the optical shoulder height of the Convergence Pylon mark.
2. **Stem Weight:** Uniform 160-unit stem thickness, matching the visual weight of the mark's vertical conduits.
3. **Tracking & Kerning:** Calibrated tracking of `+0.08em` (`letter-spacing: 0.08em`) to provide maximum legibility across high-density terminal interfaces.
4. **Optical Lockup Gap:** 10px to 12px gap between symbol and wordmark (`gap: 10px; line-height: 1; vertical-align: middle;`). Sub-pixel alignment test requires mark-to-wordmark vertical delta `< 0.5px`.

### Secondary & Body Typography
- **Primary Editorial:** `IBM Plex Sans` (Light 300, Regular 400, Medium 500, SemiBold 600). Used for titles, narrative copy, case studies, and navigation.
- **Technical Telemetry & Code:** `IBM Plex Mono` (Regular 400, Medium 500). Used for ASNs, IP blocks, CIDR prefixes, latency tables, and route diversity scorecards.

---

## 6. Official Vector Master Suite Index

The master vector assets are located in the repository at `public/images/brand/` and `public/`:

| Asset File | Format | ViewBox | Palette | Usage Standard |
|---|:---:|:---:|---|---|
| [`public/images/brand/infrahub-symbol.svg`](../../public/images/brand/infrahub-symbol.svg) | SVG | `0 0 32 32` | Cobalt + Sky Gradient | Primary standalone brandmark for digital interfaces, avatars, and app icons. |
| [`public/images/brand/infrahub-symbol-mono-white.svg`](../../public/images/brand/infrahub-symbol-mono-white.svg) | SVG | `0 0 32 32` | `#f8fafc` (100% White) | Reverse mark for photography overlays, dark terminal headers, and merchandise. |
| [`public/images/brand/infrahub-symbol-mono-black.svg`](../../public/images/brand/infrahub-symbol-mono-black.svg) | SVG | `0 0 32 32` | `#0b1120` (Midnight Black) | 1-color laser engraving, thermal receipts, whitepaper print documents. |
| [`public/images/brand/infrahub-lockup-horizontal.svg`](../../public/images/brand/infrahub-lockup-horizontal.svg) | SVG | `0 0 170 32` | Cobalt/Sky + Mineral White | Primary horizontal signature for website header, social banners, and presentations. |
| [`public/images/brand/infrahub-lockup-stacked.svg`](../../public/images/brand/infrahub-lockup-stacked.svg) | SVG | `0 0 120 72` | Cobalt/Sky + Mineral White | Stacked lockup for architectural signage, square marketing cards, and splash screens. |
| [`public/logo.svg`](../../public/logo.svg) | SVG | `0 0 170 32` | Dual Tone + Mineral White | Canonical metadata logo referenced by Schema.org JSON-LD and OpenGraph tags. |
| [`public/favicon.svg`](../../public/favicon.svg) | SVG | `0 0 32 32` | Optically tuned Dual Tone | Browser tab favicon, responsive to SVG scaling down to 16px. |

---

## 7. Co-Branding & Partner Placement Governance

As an infrastructure orchestrator, InfraHub frequently appears alongside Tier-1 carriers, peering exchanges, and technology partners (e.g., Gcore, FastNetMon, IPXO, Vates, Zenlayer, StormWall).

### Co-Branding Rules
1. **The Separation Divider:** When presenting InfraHub alongside a partner or client mark, separate the lockups with a vertical dividing rule (`#334155`, 1px width, height matching the cap height of the InfraHub mark).
2. **Visual Weight Parity:** Partner logos must be scaled optically to match InfraHub's visual surface area, never exceeding InfraHub's cap height.
3. **Partner Grid Presentation:** In ecosystem and partner matrices, all partner logos must be rendered in a neutral monochrome slate (`#94a3b8`) on dark surfaces, brightening to `#f8fafc` on hover.

---

## 8. Anti-Patterns & Strict Prohibitions

To preserve the institutional authority and visual discipline of the InfraHub brand, the following usages are strictly banned:

| Anti-Pattern | Description | Reason for Prohibition |
|---|---|---|
| **No Rounded Squares** | Encapsulating the mark inside a squircle or rounded rectangle. | Destroys the architectural silhouette and evokes generic mobile app icons. |
| **No Neon Halos / Drop Shadows** | Adding blurry outer glows, cyan drop shadows, or light flares. | Cheapens the engineering authority into juvenile Web3/crypto tropes. |
| **No Distortion or Shear** | Stretching, skewing, or rotating the symbol from its 90°/45° axes. | Corrupts the calibrated geometric convergence angles. |
| **No Arbitrary Color Swaps** | Filling the conduits with magenta, neon green, or non-palette colors. | Breaks brand recognition and visual coherence. |
| **No Unverified Marketing Claims** | Placing slogans like "The World's #1 Infrastructure" next to the mark. | Violates Master Plan §18 governance (Zero unverified claims). |
