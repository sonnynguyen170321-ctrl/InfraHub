# InfraHub Design System & Brand Architecture

**Version:** 2.0.0 — Authored, Verified, Commercial, Premium  
**Product Identity:** InfraHub.tech  
**Business Model:** Independent B2B Infrastructure Sourcing & Technical Advisory Desk  

---

## 1. Design Philosophy: Authored Engineering Clarity

InfraHub is the digital operating front door of an experienced infrastructure sourcing advisory. It exists to solve the disconnect between complex enterprise requirements (autonomous system routing, committed data rates, physical conduit diversity, private hypervisors) and specialized global infrastructure operators.

The visual and interactive execution rejects generic SaaS templates, AI-generated slop, and artificial "detector gaming." Every element on InfraHub is:
1. **Authored:** Considered editorial prose with natural English grammar and punctuation.
2. **Authoritative:** Grounded in genuine networking, transit, and virtualization realities without invented technical claims or fake SLAs.
3. **Restrained:** Calm typography, generous negative space, minimal card nesting, and quiet micro-interactions that respect technical buyers.

---

## 2. Typography System

The typographical identity pairs editorial warmth with technical precision:

| Role | Typeface | Weights | Purpose & Characteristics |
|:---|:---|:---|:---|
| **Headings & Display** | `Outfit` | 700, 800 | Geometric neo-grotesque with clean apertures; authoritative, structured, and confident across major display bands (`h1`–`h3`). |
| **Editorial & Body** | `Instrument Sans` | 400, 500, 600 | Contemporary humanist grotesque designed for editorial depth, warm cadence, and sustained technical legibility without generic template fingerprints. |
| **Technical Parameters** | `JetBrains Mono` | 500, 600, 700 | Monospaced figures for autonomous system numbers (ASNs), committed data rates (CDRs), BGP communities, and port interfaces. |

### Typographic Measures & Pacing
- **Primary Body Reading Measure:** Max 68 characters (`max-width: 68ch`) to preserve optimal ocular tracking.
- **Editorial Leads & Subheads:** Max 58 characters (`max-width: 58ch`).
- **Heading Line Heights:** Relaxed leading on multi-line titles (`line-height: 1.25` to `1.42`) to prevent cramped card titles.

---

## 3. Color Foundations & Contrast Hierarchy

InfraHub balances deep infrastructure core tones with bright, architectural broadsheet surfaces:

### Dark Core Tones (Hero, Delivery Model, Final CTA)
- `--bg-dark-core`: `#070b14` — Deep datacenter floor base
- `--bg-dark-surface`: `#0b1120` — Architectural section background
- `--text-dark-primary`: `#ffffff` — Crisp high-contrast display text
- `--text-dark-secondary`: `#cbd5e1` — Slate 300 body text (10.4:1 contrast ratio, WCAG AAA certified)
- `--border-dark`: `rgba(255, 255, 255, 0.08)` to `rgba(255, 255, 255, 0.12)`

### Light Broadsheet Tones (Solution Selector, Offers, Directory, Index Pages)
- `--bg-light-primary`: `#ffffff` — Pure white card and section surfaces
- `--bg-light-secondary`: `#f8fafc` — Subtle cool slate tint for grouping and visual anchors
- `--text-light-primary`: `#0f172a` — Slate 900 high-contrast headings
- `--text-light-secondary`: `#475569` — Slate 600 editorial body copy
- `--border-light`: `#e2e8f0` — Crisp structural hairpins

### Functional Accents
- `--accent-blue`: `#0284c7` / `#2563eb` — Primary interactive cue and verified route indicator
- `--accent-emerald`: `#10b981` — Settlement-free IXP and uptime signals
- `--accent-amber`: `#f59e0b` — BGP FlowSpec, DDoS diversion, and warning status

---

## 4. Homepage Spatial Architecture (6 Canonical Bands)

The homepage follows a disciplined 6-band narrative calibrated so that technical buyers immediately grasp InfraHub's capability within the first 1.5 viewports:

1. **Band 1: Calibrated Hero (`Hero.astro`)**
   - **Height:** Scaled to ~64–70dvh (`max-height: 680px` on desktop) ensuring the top of Band 2 is immediately visible above the fold on typical laptops (1366x768 / 1440x900).
   - **Visuals:** Authentic documentary datacenter photography with a deep directional scrim.
   - **Headline:** *"The right infrastructure. / The right partner."* (second line in muted platinum `#e2e8f0` rather than aggressive SaaS blue).

2. **Band 2: Partner Ecosystem Ribbon (`PartnerTrustRibbon.astro`)**
   - **Position:** Anchored directly beneath the Hero.
   - **Left Anchor:** *"Our partner ecosystem"* in confident editorial sentence case.
   - **Moving Rail:** Continuous compositor-friendly marquee track, paused automatically on hover and keyboard focus (`:focus-within`), with full `prefers-reduced-motion` horizontal scroll fallback.
   - **Fail-Closed Fallback:** Displays official SVG logos only when explicitly approved. Unapproved/pending assets automatically render safe typographic brand marks (`<span class="partner-text-mark">`).

3. **Band 3: Solution Discovery (`EcosystemSolutions.astro`)**
   - **Headline:** *"Start with the requirement."*
   - **Selector:** Asymmetrical layout with left-hand discipline navigation and right-hand contextual visual + service links.
   - **Quiet Interaction:** Service row arrows remain hidden/quiet when idle and slide into view on hover (`opacity: 0` -> `opacity: 1`), eliminating repetitive clutter.

4. **Band 4: Delivery Model (`DeliveryModel.astro`)**
   - **Asymmetric Split:** 40% business narrative vs. 60% process sequence.
   - **Canonical 4 Steps:** *01 Understand* -> *02 Match* -> *03 Introduce* -> *04 Deliver*.
   - **Field Wisdom:** *"What changes the answer?"* highlighting non-obvious truths (Price isn't total cost; Logical diversity isn't physical diversity; The strongest provider depends on the requirement).

5. **Band 5: Commercial Opportunities (`FeaturedOffers.astro`)**
   - **Composition:** 1 prominent primary opportunity + 2 compact secondary rows.
   - **Empty State Guard:** If active offers reach zero, renders a clean advisory notice rather than breaking the layout.
   - **Governance:** Prices displayed via `displayPrice` with origin attribution; no unverified marketing claims.

6. **Band 6: Target Sectors & Engineering Analysis (`AudienceAndEditorial.astro`)**
   - **Asymmetric Split:** Left column sectors (ISPs, Hosting, SaaS, Enterprise) paired with right column featured technical analysis.

7. **Band 7: Final Conversion Transition (`FinalCTA.astro`)**
   - **Architecture:** Open asymmetrical conversion band transitioning directly into the footer.
   - **No Centered Box:** Free of the "dark section + centered rounded inner card" template trap.

---

## 5. Partner & Asset Governance (Fail-Closed)

### Publication Gates
All partner content records (`src/content/partners/*.md`) default to `false`:
```typescript
relationshipConfirmed: false,
publicNameApproved: false,
logoApproved: false,
homepageMarqueeEnabled: false,
partnerPageEnabled: false,
strategic: false
```

### Trademark & Asset Provenance Policy
- **No Synthetic Trademarks:** Agents and contributors must never ship synthetic, redrawn, or AI-hallucinated partner logos as official vector files.
- **Safe Typographic Fallback:** When `logoApproved` is false or `logoStatus !== 'approved'`, all UI components render a clean, carrier-grade typographic mark showing the partner's name and discipline role.
- **Asset Register:** All repo assets and their legal origin are tracked in `docs/ASSET_PROVENANCE.md`.
- **Ecosystem Matrix:** All 21 owner-identified partner candidates are tracked in `docs/OWNER_PARTNER_INVENTORY.md`.

---

## 6. Prohibited Anti-Patterns

1. **No Detector Gaming:** Do not distort natural English grammar, replace legitimate punctuation (em-dashes `—`) with awkward spaces (`  -  `), or make UI decisions to satisfy third-party heuristic tools.
2. **No Unearned Status Badges:** Never display words like *"Verified"*, *"Strategic"*, *"Approved"*, or *"Official Partner"* unless the underlying business verification is explicitly true in the data model.
3. **No Decorative Button Glows:** Interactive buttons use crisp 1px borders, subtle tonal hover shifts, and standard elevation. Heavy radial glows, neon drop-shadows, and pulsing halos are prohibited.
4. **No Faux Terminal / CLI Widgets:** InfraHub is a serious commercial infrastructure advisory, not a developer tool sandbox. Do not render artificial Linux consoles, fake shell prompts, or simulated ping telemetry.
5. **No Universal MSA Claims:** Contract structures vary by provider; do not claim every transaction uses an identical Master Service Agreement. State clearly that services are contracted directly under the selected specialist's standard terms.
