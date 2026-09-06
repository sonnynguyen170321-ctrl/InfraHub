# Phase 10 — Supporting Pages & Technical Inquiry Architecture

**Classification:** CURRENT_CANONICAL  
**Date:** 2026-09-06  
**Branch:** `redesign/phase10-supporting-pages`  
**Master Plan Reference:** [MASTER_PLAN.md](MASTER_PLAN.md) §19, §22, §27 Phase 10  
**Design System Reference:** [06-design-system.md](06-design-system.md)  
**Partner Reference:** [09-partner-ecosystem.md](09-partner-ecosystem.md)  

---

## 1. Executive Summary

Phase 10 completes the architectural elevation and truth governance enforcement across InfraHub's supporting editorial and conversion pages:
- **Technical Insights Journal (`/insights` & `/insights/[slug]`):** Authoritative engineering analyses for network directors and systems architects with TechArticle Schema.org metadata.
- **About & Business Architecture (`/about`):** Detailed breakdown of InfraHub's commercial model across 3 delivery roles with explicit commercial role disclosures.
- **How We Work (`/how-we-work`):** Diligence timeline (*01 Understand &rarr; 02 Match &rarr; 03 Introduce &rarr; 04 Deliver*) and an editorial commercial FAQ broadside.
- **Technical Inquiry Gateway (`/lets-talk` & `/api/inquiry`):** Low-friction, high-trust qualification intake with context parameter ingestion, client-side validation, rate limiting, and zero PII logging.

---

## 2. Supporting Pages Architecture

### 1. Insights Journal (`/insights` & `/insights/[slug]`)
- **Journal Index:** Features a lead technical article with full architectural visual and chronological archive categorized by infrastructure domain (Routing, Virtualization, Connectivity, Security).
- **Article Dossiers:**
  - Standardized TechArticle structured data (`@type: 'TechArticle'`) and breadcrumbs.
  - Sourced technical diagrams and analysis of physical route diversity, VMware migration alternatives, and DDoS detection automation.
  - Contextual conversation gateway linking to `/lets-talk`.

### 2. About & Commercial Roles (`/about`)
- **Narrative Thesis:** Better infrastructure decisions begin with understanding the technical requirement rather than shopping a vendor catalog.
- **Three Commercial Roles:**
  1. *Hardware Sourcing:* Enterprise servers, optics, and switches through specialist distributors.
  2. *Specialist Introduction:* Direct introductions to verified carriers, cloud operators, and NOC providers.
  3. *Advisory & Evaluation:* Route diversity benchmarking, BGP strategy, and hypervisor migration models.
- **Commercial Disclosure:** Explicit statement that InfraHub does not take custody of client traffic or add hidden reseller margins.

### 3. How We Work (`/how-we-work`)
- **4-Stage Qualification Process:**
  - `01 Understand:` Traffic profiles, resilience boundaries, and commercial scope.
  - `02 Match:` Network fit, physical presence, and commercial conditions.
  - `03 Introduce:` Direct coordinator introduction to selected specialist engineers.
  - `04 Deliver:` Direct contracting and ongoing operational SLA execution.
- **Commercial FAQ Broadside:** Detailed answers addressing direct carrier engagement, contract/SLA ownership, and fee structures.

### 4. Technical Inquiry Intake (`/lets-talk` & `/api/inquiry`)
- **Inquiry Intake Form:**
  - 3-step structured input: Technical Discipline, Location & Constraints, Contact & Organization.
  - Dynamic parameter pre-population from solution pages (`service`), partner dossiers (`partner`), and wholesale offers (`offer`).
  - Strict WCAG AA accessible error alerts with `role="alert"` and focus management.
- **API Endpoint (`/api/inquiry.ts`):**
  - Per-instance bounded rate limiting (5 requests per 10 minutes).
  - Honeypot bot protection (`website_trap_field`).
  - Max body byte validation (16KB) and invalid JSON handling.
  - Telemetry isolation with zero PII logging (logs only lead ID, category, and timeline).
  - Secure HTTPS webhook dispatch with timeout resilience.

---

## 3. Verification Evidence

- `npm run check`: **0 errors, 0 warnings, 0 hints** across 104 files.
- `npm run build`: **51 routes prerendered cleanly** into `dist/client/`.
- `npm test`: **All 8 static audits passed** (100% clean routes, accessibility, truth governance, partner assets, human design forensics).
- `tests/e2e/lets-talk.spec.ts`: **All 9 test blocks passed** (validation, context pre-selection, error recovery, submission).
- `tests/e2e/process-story.spec.ts`: **All 3 tests passed** (annotation sync, route drawing, commercial model compliance).
- `tests/e2e/runtime-health.spec.ts`: **All 51 published routes verified** with 0 console errors and 0 failed resources.
- Playwright Full Suite: **All 157/157 tests passed** cleanly across all viewports.
