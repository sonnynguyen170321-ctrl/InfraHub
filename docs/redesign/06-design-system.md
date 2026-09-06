# Phase 6 — Design-System Implementation & Token Architecture

**Classification:** CURRENT_CANONICAL  
**Date:** 2026-09-06  
**Branch:** `redesign/phase6-design-system`  
**Master Plan Reference:** [MASTER_PLAN.md](MASTER_PLAN.md) §8, §27 Phase 6  
**Brand Guidelines Reference:** [04-brand-guidelines.md](04-brand-guidelines.md)  
**Homepage Art Direction Reference:** [05-homepage-art-direction.md](05-homepage-art-direction.md)  
**Live Sandbox Route:** `/design-system` (`src/pages/design-system.astro`)  

---

## 1. Executive Overview & System Architecture

In accordance with Master Plan §27 Phase 6, the InfraHub design system has been codified into production CSS tokens, typography hierarchies, button primitives, architectural ledger rows, and surface contrast rules.

### Core Philosophy: Engineering Precision over Marketing Decoration
- Replaces generic SaaS cards and AI gradient tropes with **calibrated hairline architecture**.
- Built on strict **WCAG 2.2 AAA accessibility compliance**, self-hosted `IBM Plex Sans` and `IBM Plex Mono` typography, and physical conduit metaphors.
- Live demonstration sandbox available at `/design-system`.

---

## 2. Master Token Architecture (`src/styles/global.css`)

### Color Tokens & Chromatic Hierarchy

| CSS Variable | Value | Role & Usage Standard |
|---|:---:|---|
| `--color-bedrock` | `#050811` | Deepest contrast layer (Base 1000); code blocks, deep hero substrates, route explorer. |
| `--color-midnight` | `#0b1120` | Primary master canvas (Base 950); executive terminal background, header surfaces. |
| `--color-cobalt` | `#2563eb` | Primary brand signal; active conduits, focal CTA buttons, interactive focus. |
| `--color-cobalt-hover` | `#1d4ed8` | Deepened cobalt for button hover states (no layout shift). |
| `--color-sky` | `#38bdf8` | Convergence cyan; technical kickers, active telemetry, latency callouts. |
| `--color-sky-hover` | `#0ea5e9` | High-visibility interactive hover tint. |
| `--color-paper` | `#f8fafc` | Mineral paper light surface; primary editorial typography, reverse marks. |
| `--color-amber` | `#f59e0b` | Diagnostic alert; single point of failure (SPOF), route flap warnings. |
| `--color-amber-hover` | `#d97706` | Deepened amber for diagnostic states. |
| `--color-amber-text` | `#d97706` | WCAG AA compliant text cut (6.65:1 on light paper). |
| `--color-hairline` | `rgba(255, 255, 255, 0.08)` | Sub-pixel borders on dark chapter surfaces. |
| `--color-hairline-light` | `rgba(11, 17, 32, 0.08)` | Sub-pixel borders on light paper surfaces. |
| `--color-slate-border` | `#1e293b` | Structural dividers and ledger bounding rules. |

---

## 3. Typographic Hierarchy & Scale

InfraHub uses exclusively self-hosted **IBM Plex Sans** (variable weights 400–700) for narrative editorial copy and **IBM Plex Mono** (weights 400 and 600) for technical telemetry.

| Level / Component | Font Family | Size | Line Height | Letter Spacing | Standard Usage |
|---|---|:---:|:---:|:---:|---|
| **H1 Display** | IBM Plex Sans | `3.5rem` (56px) | `1.15` | `-0.02em` | Homepage Hero and major section chapter leads. |
| **H2 Section** | IBM Plex Sans | `2.25rem` (36px) | `1.25` | `-0.02em` | Primary section titles and framework anchors. |
| **H3 Subsection** | IBM Plex Sans | `1.4rem` (22px) | `1.45` | `-0.01em` | Modular category headings and feature titles. |
| **Technical Kicker** | IBM Plex Sans | `0.72rem` (11.5px) | `1.0` | `+0.12em` | Uppercase section eyebrows (`.technical-kicker`). |
| **Editorial Body** | IBM Plex Sans | `1.05rem` (17px) | `1.65` | `0` | Narrative paragraphs (`max-width: 52ch`). |
| **Telemetry / Code** | IBM Plex Mono | `0.85rem` (13.6px) | `1.5` | `+0.04em` | ASNs, CIDRs, BGP latencies, failure indexes. |

---

## 4. Interaction Primitives & Button Hierarchy

Strict single-action discipline governs all interactive elements:

```
[ Solid Cobalt Button ]          [ Blueprint Outline Button ]          [ Ghost Action ]
--color-cobalt (#2563eb)        --color-slate-border (#1e293b)        1px Paper Border
White text                       White text + Sky hover tint           Slate text
Primary conversion anchor        Secondary architectural inspect       Contextual link
```

### Motion & Transition Guardrails
- **Zero Hover Lift:** `:hover { transform: translateY(-...); }` is strictly prohibited.
- **Zero `transition: all`:** Explicit transitions only: `background-color`, `border-color`, `color`, `opacity`.
- **Active State:** Tactile `transform: scale(0.985);` on `:active` provides immediate physical haptic feedback.

---

## 5. Architectural Ledger & Telemetry Primitives

Replaces commodity grid cards with high-trust engineering ledgers:

- **`.architectural-ledger`:** Full-width structural container bounded by top and bottom 1px rules (`--color-slate-border`).
- **`.ledger-row`:** Clean grid row (`grid-template-columns: 1fr auto;`) separated by `--color-hairline` dividing lines.
- **`.telemetry-badge`:** Monospace telemetry chip (`.telemetry-badge`, `.telemetry-badge-sky`, `.telemetry-badge-amber`).
- **`.blueprint-grid`:** 64px × 64px hairline grid coordinate overlay at 4% opacity, evoking technical blueprints.

---

## 6. Cleanup & Deprecation of Legacy Primitives

- **Removed:** All legacy button glow box-shadows (`rgba(37, 99, 235, 0.3)`).
- **Removed:** All faux console window wrappers (`.console-desktop`, `.console-nav`).
- **Removed:** All `backdrop-filter: blur(...)` and `filter: drop-shadow(...)`.
- **Standardized:** All border radii locked to the restrained hierarchy: `0px` (lines), `2px` (badges), `4px` (buttons/cards), `8px` (containers).

---

## 7. Sandbox Verification

The live showcase sandbox has been deployed at `/design-system`:
- Validated via `scripts/verify-routes.mjs` (51 routes verified).
- Validated via `tests/audit/accessibility-audit.mjs` (0 errors, 0 warnings, single H1 compliance).
- Validated via `tests/audit/human-design-audit.test.mjs` (anti-slop and taste guardrails 100% clean).
