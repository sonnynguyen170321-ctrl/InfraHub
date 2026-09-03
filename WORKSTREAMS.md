# INFRAHUB VNEXT — MULTI-AGENT WORKSTREAMS & COORDINATION LEDGER

**Project Repository:** `sonnynguyen170321-ctrl/InfraHub`  
**Active Development Branch:** `feat/vnext-master-realignment`  
**Last Updated:** September 4, 2026  
**Architecture:** Astro 5 (Static-first with `@astrojs/vercel` serverless endpoints), Content Collections with Zod, Vanilla CSS custom design system (Outfit / Inter / Fira Code).

---

## 1. Multi-Agent Rules of Engagement

1. **GitHub is Ground Truth:** All state, workstreams, and PRs must be synced to branch `feat/vnext-master-realignment`. Pull before branching or claiming.
2. **Feature Boundary Isolation:** Agents must claim discrete workstreams before starting. Never perform simultaneous edits to the same high-conflict files (e.g. `src/styles/global.css`, `src/layouts/Layout.astro`, `src/content/config.ts`).
3. **No Competing Architectures:** The design system, typography tokens, color palette, navigation taxonomy, and Zod content schemas are canonical. Do not introduce Tailwind, external styling frameworks, or duplicate navigation structures.
4. **Decisions & Conflicts:** Surface technical disagreements as explicit decision notes in this document. Never silently implement competing solutions.
5. **Business Decisions:** When commercial details or partner permissions are ambiguous, label them as `[OWNER INPUT REQUIRED]`. Do not invent unverified claims or fake partner logos.

---

## 2. Workstream Status & Ownership

| Workstream ID | Area | Status | Owner | Description & Deliverables |
|---|---|---|---|---|
| **WS-01** | Core Foundation & Layouts | **DONE** | Agent 1 | Astro 5 setup, Design tokens, `Layout.astro`, `Header.astro` (MegaMenu), `Footer.astro`, Zod schemas. |
| **WS-02** | Homepage Rhythm (VCG Parity) | **DONE** | Agent 1 | 11 homepage modular sections (`Hero`, `AnnouncementBar`, `PartnerTrustStrip`, `SolutionExplorer`, `HowItWorks`, `FeaturedOffers`, `WhyInfraHub`, `PartnerFeature`, `IndustriesGrid`, `EditorialFeature`, `InsightsGrid`, `FinalCTA`). Verified build. |
| **WS-03** | Universal Qualification Flow | **DONE** | Agent 1 | `src/pages/lets-talk.astro` with context query parameter preselection + `src/pages/api/inquiry.ts` serverless Zod endpoint. |
| **WS-04** | Core Service Pages (12 routes) | **DONE** | Agent 1 | Rebuilt all 6 preserved routes (`/ip-transit`, `/ddos-protection`, `/wavelengths`, `/cloud-connectivity`, `/colocation`, `/managed-noc`) + 6 expansion routes (`/dedicated-servers`, `/custom-iaas`, `/gpu-ai-infrastructure`, `/enterprise-hardware`, `/private-cloud`, `/vmware-alternatives`, `/layer-2-connectivity`, `/ipv4`, `/ddos-detection-automation`, `/bgp-routing-intelligence`, `/cybersecurity`, `/ai-network-operations`). |
| **WS-05** | Solution Category Hubs | **DONE** | Agent 1 | 5 Hub pages (`/solutions/infrastructure`, `/solutions/cloud-virtualization`, `/solutions/network-connectivity`, `/solutions/security`, `/solutions/managed-services`). |
| **WS-06** | Industry Pages | **DONE** | Agent 1 | `/industries/index.astro` + 4 buyer framework pages (`isps-network-operators`, `hosting-cloud-providers`, `saas-technology`, `enterprise`). |
| **WS-07** | Partner Ecosystem System | **DONE** | Agent 1 | `/partners/index.astro` directory + dynamic `/partners/[slug].astro` template + 4 verified partner content entries (`fastnetmon`, `zenlayer`, `gcore`, `vates`). |
| **WS-08** | Commercial Offers Engine | **DONE** | Agent 1 | `/offers/index.astro` catalog + dynamic `/offers/[slug].astro` with sticky request cards + 4 live content offers. |
| **WS-09** | Technical Insights Hub | **DONE** | Agent 1 | `/insights/index.astro` + dynamic `/insights/[slug].astro` + 4 deep technical articles (Route Diversity, 95th Percentile, DDoS, VMware Exit). |
| **WS-10** | Automated Test & QA Suite | **OPEN (Agent 2)** | Agent 2 | Playwright/Vitest E2E test suite verifying: MegaMenu dropdowns, mobile drawer, form parameter preselection (`/lets-talk?offer=...`), all 32 internal routes response 200 OK. |
| **WS-11** | SEO, OpenGraph & Social Cards | **OPEN (Agent 2)** | Agent 2 | Dynamic SVG/PNG OpenGraph preview image generator or static social assets for each route; verify canonical paths; add `@astrojs/sitemap` integration and `robots.txt`. |
| **WS-12** | Partner & Offer Data Expansion | **OPEN (Agent 2)** | Agent 2 | Add additional verified partner profiles (e.g. ITcare, Supertrace, StormWall, IPXO) and additional hardware inventory offers according to the strategic brief. |
| **WS-13** | Client-Side Polish & Micro-Interactions | **OPEN (Agent 2)** | Agent 2 | Mobile navigation refinement, smooth scroll anchors, form client-side validation feedback, accessibility WCAG AA audit. |

---

## 3. Ground Truth Technical Architecture

### Design Tokens (`src/styles/global.css`)
- **Dark Primary:** `#0f172a` (Slate 900)
- **Deep Background:** `#090d16` (Body dark)
- **Light Secondary:** `#f8fafc` (Slate 50)
- **Accent Blue:** `#2563eb` (Blue 600)
- **Tech Teal:** `#0d9488` (Teal 600)
- **Borders:** `#e2e8f0` (Light) / `#1e293b` (Dark)
- **Fonts:** Heading: `'Outfit', sans-serif`, Body: `'Inter', sans-serif`, Mono: `'Fira Code', monospace`

### Three Commercial Operating Disciplines
- **Mode A (Direct Hardware):** Directly sourced servers, optical transceivers, enterprise parts.
- **Mode B (Partner-Delivered):** IP transit, cloud connectivity, colocation, DDoS scrubbing. Qualified and introduced by InfraHub, contracted directly with partner.
- **Mode C (Advisory):** Architectural evaluation, carrier benchmarking, VMware exit assessments.

---

## 4. Owner Decisions Register (Owner Input Required)

1. **[OWNER INPUT REQUIRED] Official Partner Logo Assets:**  
   Currently SVG placeholders and text treatments are used for partner badges. High-res vector SVGs for Zenlayer, Gcore, FastNetMon, Vates, ITcare, and StormWall should be reviewed and placed in `public/images/partners/`.
2. **[OWNER INPUT REQUIRED] Lead Routing Destination:**  
   `/api/inquiry.ts` currently logs lead payloads and generates UUIDs. Confirm production webhook endpoint (e.g. HubSpot, Zapier, or Telestar CRM API endpoint).
3. **[OWNER INPUT REQUIRED] Exact Company Registration Details:**  
   Legal entity name, corporate registration number, and physical billing address to be updated in `src/pages/terms.astro` and `src/pages/privacy.astro`.
