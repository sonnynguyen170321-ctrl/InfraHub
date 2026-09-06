# Phase 5 — Homepage High-Fidelity Art Direction & Layout Engineering

**Classification:** CURRENT_CANONICAL  
**Date:** 2026-09-06  
**Branch:** `redesign/phase5-art-direction`  
**Master Plan Reference:** [MASTER_PLAN.md](MASTER_PLAN.md) §11, §12, §27 Phase 5  
**Brand Guidelines Reference:** [04-brand-guidelines.md](04-brand-guidelines.md)  
**Identity Concepts Reference:** [03-identity-concepts.md](03-identity-concepts.md)  
**Positioning Baseline:** [01-positioning.md](01-positioning.md)  

---

## 1. Executive Summary & Creative Direction

In accordance with Master Plan §12 and §27 Phase 5, this document and its accompanying high-fidelity concept suite establish the definitive visual and architectural art direction for the InfraHub homepage prior to full-code assembly.

### The Strategic Leap: From White SaaS Grid to Technical Editorial Field Guide
- **Previous State:** Generic white container cards, blue-purple neon gradients, decorative 3D splines, and SaaS template tropes that reduced perceived value to a commodity software directory.
- **New Creative Direction:** An authoritative **$50,000 engineering field guide and wholesale infrastructure journal**. Every section is anchored in the physical reality of global telecommunications: submarine conduits, optical fiber cores, BGP convergence mechanics, and calibrated carrier trust.
- **Zero Saturated AI Tropes:** Strictly prohibited: floating 3D spheres, particle clouds, blurry neon drop shadows, meaningless node webs, and unverified marketing superlatives.

---

## 2. Master Concept Suite Index

All high-fidelity concept frames have been generated at 16:9 widescreen and 9:16 mobile standards and committed to [`docs/redesign/visual/phase5-art-direction/`](./visual/phase5-art-direction/):

| Concept Artifact | Aspect Ratio | Act / Focus | Primary Compositional Trait |
|---|:---:|---|---|
| [`act01-hero-variant-a.jpg`](./visual/phase5-art-direction/act01-hero-variant-a.jpg) | 16:9 | Act 01: Hero (Variant A) | Asymmetric editorial lead; high-density physical optical fiber conduit terminating into precision hardware. |
| [`act01-hero-variant-b.jpg`](./visual/phase5-art-direction/act01-hero-variant-b.jpg) | 16:9 | Act 01: Hero (Variant B) | Centered architectural wireframe & subterranean facility blueprint with Swiss datum grid coordinates. |
| [`act01-hero-mobile.jpg`](./visual/phase5-art-direction/act01-hero-mobile.jpg) | 9:16 | Act 01: Hero (Mobile 390px) | Vertical smartphone viewport crop preserving typographic weight, kicker, and conduit cross-section. |
| [`act02-partner-ecosystem.jpg`](./visual/phase5-art-direction/act02-partner-ecosystem.jpg) | 16:9 | Act 02: Partner Ecosystem | Calm, authoritative engineering ledger featuring the 8 canonical partners in neutral monochrome slate. |
| [`act03-method-decision.jpg`](./visual/phase5-art-direction/act03-method-decision.jpg) | 16:9 | Act 03: Decision Framework | 4-stage operating diligence timeline (Understand → Match → Introduce → Deliver) + 6 qualification gauges. |
| [`act04-route-diversity.jpg`](./visual/phase5-art-direction/act04-route-diversity.jpg) | 16:9 | Act 04: Route Diversity Explorer | Flagship signature proof: Logical vs. Physical topology reveal with subterranean Metric Amber failure point. |
| [`act05-conversation-cta.jpg`](./visual/phase5-art-direction/act05-conversation-cta.jpg) | 16:9 | Act 05: Executive Conversation | High-trust conversion without clutter: "Tell us what you are trying to build." with discreet trust indicators. |
| [`continuous-scroll-sheet.jpg`](./visual/phase5-art-direction/continuous-scroll-sheet.jpg) | 9:16 | Full Continuous Rhythm Sheet | Complete 5-act narrative spine demonstrating visual rhythm, chapter pacing, and contrast hierarchy. |

---

## 3. Act-by-Act Architectural Breakdown

### Act 01 — Arrival / Brand Thesis (Hero Section)

#### Comparison of Hero Variants
- **Variant A (Physical Route Focus):** Uses an asymmetric layout. Left: high-contrast IBM Plex Sans headline (*"Direct Wholesale Connectivity & Physical Infrastructure Advisory"*) with Electric Sky kicker and solid Cobalt Blue CTA button (*"Evaluate Route Diversity"*). Right: physical cross-section of an armored multi-core optical fiber conduit terminating into cold-rolled steel telecom housing. Communicates tangible hardware and deep fiber investments instantly.
- **Variant B (Architectural Blueprint Focus):** Uses a centered Swiss layout. Features fine hairline coordinate grids (`#1e293b`) and a laser-etched blueprint schematic of dual subterranean fiber paths entering twin server vaults. Communicates mathematical precision and route diversity modeling.
- **Design Recommendation & Synthesis:** Adopt **Variant A's asymmetric layout and physical conduit focal point** for immediate visual power on desktop viewports, enriched with **Variant B's hairline coordinate grid** running subtly behind the hero canvas at 8% opacity.

#### Mobile Viewport Adaptation (390px)
As demonstrated in [`act01-hero-mobile.jpg`](./visual/phase5-art-direction/act01-hero-mobile.jpg):
- Top bar stacks the Convergence Pylon mark with clean wordmark and minimal navigation icon.
- Kicker text drops to `11px` uppercase with `0.12em` letter-spacing.
- H1 title scales smoothly to `32px` line-height `1.15`, maintaining 3 visual wraps maximum.
- Action button expands to full container width (`padding: 14px 20px`).
- The conduit graphic anchors the bottom half of the viewport, grounding the screen into the partner transition shelf without obscuring copy.

#### Entrance Choreography Rhythm (Master Plan §12)
| Time Offset | Interface Event | Visual State |
|---|---|---|
| `0 – 250ms` | Bedrock environment settles | Canvas background exposure establishes (`#050811`). |
| `200 – 600ms` | Convergence Pylon mark resolves | Top navigation and header branding snap to optical crispness. |
| `450 – 950ms` | Technical kicker & H1 headline appear | Smooth translate-Y (`+8px` to `0px`) with high-contrast text reveal. |
| `750 – 1150ms` | Supporting paragraph & CTA resolve | Solid Cobalt button establishes focal anchor point. |
| `900 – 1400ms` | Physical conduit cross-section settles | Directional hardware lighting illuminates core optical paths. |

---

### Act 02 — Credibility / Partner Ecosystem (Verified Specialists Ledger)

As demonstrated in [`act02-partner-ecosystem.jpg`](./visual/phase5-art-direction/act02-partner-ecosystem.jpg):
- **Governance Constraint:** Strictly restricted to the **8 canonical approved partners** verified in Master Plan §12 and `docs/CLAIMS_REGISTER.md`:
  1. **FastNetMon** — DDoS Detection & Mitigation Control Plane
  2. **Gcore** — Cloud, Edge, AI & Security Platform
  3. **StormWall** — DDoS, WAF & Application Protection
  4. **Zenlayer** — Distributed Cloud, Compute & Global Edge Connectivity
  5. **IPXO** — IPv4 Leasing & Address Management Platform
  6. **Vates** — Open-Source Virtualization & Management Stack (XCP-ng / Xen Orchestra)
  7. **ITcare** — Network Engineering, 24/7 Managed NOC & Automation
  8. **Airframe** — Technology Decision Intelligence & Vendor Diligence
- **Layout Architecture:** Rather than a chaotic endless carnival marquee, Act 02 organizes into a **disciplined architectural ledger**:
  - 2-column or 4-column balanced grid separated by 1px hairline rules (`#1e293b`).
  - Partner marks rendered in neutral monochrome slate (`#94a3b8`), transitioning to crisp `#f8fafc` on hover.
  - Paired with explicit, concise technical domain roles, proving InfraHub's coordination function without falsely claiming ownership of partner assets.

---

### Act 03 — Operating Methodology & Decision Framework

As demonstrated in [`act03-method-decision.jpg`](./visual/phase5-art-direction/act03-method-decision.jpg):
- **Core Narrative:** Replaces vague consulting timelines with the authentic operating model:
  $$\text{Understand} \longrightarrow \text{Match} \longrightarrow \text{Introduce} \longrightarrow \text{Deliver}$$
- **The 4 Diligence Stages:**
  - `01. UNDERSTAND:` Analyzing physical topology, ASNs, workloads, latency bounds, and commercial budget constraints.
  - `02. QUALIFY & MATCH:` Cross-referencing verified carrier path diversity, SLA benchmarks, and real hardware inventory.
  - `03. DIRECT INTRODUCTION:` Introducing client engineering executives directly to carrier and platform principals.
  - `04. VERIFIED DELIVERY:` Selected provider confirms official pricing, contractual SLAs, implementation, and circuit handoff.
- **The 6 Qualification Factors:**
  Presented as an editorial telemetry matrix across 6 vectors: **Workload**, **Location**, **Capacity**, **Resilience**, **Timing**, **Commercial**.

---

### Act 04 — Flagship Signature Proof: Route Diversity & Topology Explorer

As demonstrated in [`act04-route-diversity.jpg`](./visual/phase5-art-direction/act04-route-diversity.jpg):
- **The Central Engineering Thesis:** *Logical Diversity Does Not Equal Physical Diversity.*
- **Interactive Topological Reveal:**
  - **Logical Layer (The Illusion):** Carrier A and Carrier B appear as two completely isolated network paths terminating at disparate IXPs.
  - **Physical Layer (The Reality):** Revealing the physical conduits uncovers that both carriers lease fiber running through the **exact same bridge conduit or railway tunnel at Mile Marker 42.1**.
  - **The Shared Failure Point:** Highlighted in **Metric Amber** (`#f59e0b`), demonstrating a single point of failure (SPOF) that standard BGP monitoring fails to detect.
- **Telemetry Readout Deck:**
  - Live BGP convergence deltas (`+14.2ms`) rendered in `IBM Plex Mono`.
  - Failure domain risk index scoring.
  - Explanatory technical callouts formatted as engineering field notes.

---

### Act 05 — Executive Conversation & Direct Engagement CTA

As demonstrated in [`act05-conversation-cta.jpg`](./visual/phase5-art-direction/act05-conversation-cta.jpg):
- **Headline:** *"Tell us what you are trying to build."*
- **Supporting Narrative:** *"Whether evaluating redundant IP transit, provisioning custom compute clusters, or mitigating multi-terabit network threats, we structure your requirements with zero vendor lock-in."*
- **Action Hierarchy:**
  - Primary Action: Solid Infrastructure Cobalt Blue button (`#2563eb`) with arrow prompt: *"Initiate Technical Scoping \(\to\)"*.
  - Discreet Trust Ledger: `Direct Principal Access • Strict Non-Disclosure • Average Response Under 2 Hours` set in `IBM Plex Mono`.
- **Clutter Elimination:** Completely free of generic contact forms, recaptcha boxes, or marketing chatbots.

---

## 4. Continuous Rhythm & Narrative Cadence Analysis

As demonstrated in [`continuous-scroll-sheet.jpg`](./visual/phase5-art-direction/continuous-scroll-sheet.jpg):

```
┌────────────────────────────────────────────────────────┐
│ ACT 01: Deep Midnight Bedrock (#050811)               │
│ - Bold Headline + Cobalt CTA + Physical Fiber Conduit  │
└──────────────────────────┬─────────────────────────────┘
                           │  Single Gradient Shelf (100px)
┌──────────────────────────▼─────────────────────────────┐
│ ACT 02: Midnight Slate Ledger (#0b1120)                │
│ - 8 Canonical Partners in Neutral Monochrome Slate     │
└──────────────────────────┬─────────────────────────────┘
                           │  Hairline Structural Rule (#1e293b)
┌──────────────────────────▼─────────────────────────────┐
│ ACT 03: Editorial Diligence (#0b1120 / #0f172a)        │
│ - 4-Stage Methodology + 6 Qualification Vectors        │
└──────────────────────────┬─────────────────────────────┘
                           │  Hairline Coordinate Divider
┌──────────────────────────▼─────────────────────────────┐
│ ACT 04: Technical Blueprint Substrate (#050811)        │
│ - Flagship Route Diversity Explorer (Amber SPOF Reveal)│
└──────────────────────────┬─────────────────────────────┘
                           │  Calibrated Spacing (120px)
┌──────────────────────────▼─────────────────────────────┐
│ ACT 05: Executive Focus Frame (#0b1120)                │
│ - "Tell us what you are trying to build." + Cobalt CTA │
└────────────────────────────────────────────────────────┘
```

### Key Editorial Rhythm Observations:
1. **Vertical Breathing Room:** Section padding standardizes at `120px 0` on desktop (`80px 0` on mobile), preventing visual claustrophobia.
2. **Surface Contrasts:** The background oscillates between **Deep Bedrock** (`#050811`) for deep technical proofs (Hero and Route Diversity) and **Midnight Slate** (`#0b1120`) for structured ledgers (Partners, Methodology, CTA).
3. **Focal Color Discipline:** **Infrastructure Cobalt** (`#2563eb`) is strictly reserved for primary actions; **Electric Sky** (`#38bdf8`) is used solely for technical kickers and active telemetry; **Metric Amber** (`#f59e0b`) is exclusively deployed for shared physical risk and failure points.

---

## 5. Phase 6 (Design System) & Phase 7 (Build) Transition Directives

With Phase 5 art direction formally established:
1. **Phase 6 Directives:**
   - Codify CSS custom properties in `src/styles/global.css` matching the exact tokens:
     * `--color-bedrock: #050811;`
     * `--color-midnight: #0b1120;`
     * `--color-cobalt: #2563eb;`
     * `--color-sky: #38bdf8;`
     * `--color-paper: #f8fafc;`
     * `--color-amber: #f59e0b;`
     * `--color-hairline: rgba(255, 255, 255, 0.08);`
   - Implement reusable architectural ledger components, technical kicker tags, and precision mono badges.
2. **Phase 7 Directives:**
   - Reconstruct the homepage act by act, verifying each act against these approved concept comps via Playwright screenshot audits.
   - Maintain zero regression across all 8 static test gates.
