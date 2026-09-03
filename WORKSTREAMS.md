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
| **WS-10** | Automated Test & QA Suite | **DONE** | Agent 1 & Agent 2 | Link crawler and SEO integrity suite (`scripts/verify-routes.mjs`) checking all 57 generated documents and links with zero broken links. |
| **WS-11** | SEO, OpenGraph & Social Cards | **DONE** | Agent 1 & Agent 2 | `@astrojs/sitemap` integration in `astro.config.mjs`, `public/robots.txt` generated, verified canonical links. |
| **WS-12** | Partner & Offer Data Expansion | **DONE** | Agent 1 & Agent 2 | Added partner profiles (StormWall, ITcare, Supertrace, IPXO) and 4 new live commercial offers (Amsterdam 100G Wavelength, Dell R750, IPv4 /24 Lease, StormWall Scrubbing). Total 8 partners & 8 offers. |
| **WS-13** | Client-Side Polish & Micro-Interactions | **DONE** | Agent 1 & Agent 2 | Form rate-limiting, honeypot protection, non-PII logging, and downstream webhook delivery guarantee. |
| **WS-14** | Claims & Trust Governance | **IN PROGRESS** | Agent 2 | `docs/CLAIMS_REGISTER.md` created to track fact verification and owner inputs. |

### Resolved Defect Register (Agent 2 Review)
- **A2-F1 (RESOLVED)**: `src/pages/api/inquiry.ts` now fails closed. If downstream webhook fails or throws, returns HTTP 502. In production, if unconfigured, returns HTTP 503.
- **A2-F2 (RESOLVED)**: `verified: z.boolean().default(false)` in `src/content/config.ts`. All partner files explicitly assert verification.
- **A2-F4 (RESOLVED)**: IP rate-limiting implemented in `src/pages/api/inquiry.ts` (max 5 requests per 10 minutes).
- **A2-F5 (RESOLVED)**: PII redacted from operational logs; logs only sanitized lead metadata and domain.
- **A2-F8 (RESOLVED)**: Legacy prototype files (`index.html`, `ip-transit.html`, `index.css`, `index.js`, etc.) moved to `legacy/` archive.
- **A2-F9 (RESOLVED)**: Scrubbing capacity in `src/pages/solutions/security.astro` explicitly attributed to specialist partner centers.

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

---

## 5. Agent 2 — Claims & Coordination

**Joined:** 2026-09-04, reviewing `feat/vnext-master-realignment` @ `0ce5200`.
**Method so far:** read-only. Agent 2 has modified no `src/` file.

### 5.1 Claim response to WS-10 .. WS-13

Agent 1 pre-assigned four workstreams to Agent 2. Response, with reasons:

| WS | Agent 2 status | Reason |
|---|---|---|
| **WS-10** Automated Test & QA | **CLAIMED** | No test tooling exists (`package.json` has no test script) and no sign Agent 1 has started. Clean boundary. |
| **WS-11** SEO / OpenGraph / sitemap | **DEFERRED — Agent 1 already implementing** | The working tree contains uncommitted Agent 1 changes adding `@astrojs/sitemap` to `astro.config.mjs` and `package.json`. Agent 2 will not duplicate this. Agent 2 can take the non-overlapping remainder (OG images, canonical audit, `robots.txt`) **on Agent 1's confirmation**. |
| **WS-12** Partner & Offer Data Expansion | **RELEASED back to Agent 1 — and blocked on owner** | Two reasons. (a) Agent 1 is already authoring `itcare.md` and `stormwall.md` in the working tree. (b) Agent 2 cannot truthfully author partner profiles for companies whose relationship, public-naming approval and logo approval are unverified — directive §22/§24. This is a business act, not an implementation task. |
| **WS-13** Client-Side Polish & WCAG AA | **CLAIMED** | No sign of active work. Accessibility audit pairs naturally with WS-10. |

**New workstream claimed by Agent 2:**

| WS | Area | Status | Owner | Deliverables |
|---|---|---|---|---|
| **WS-14** | Claims, Trust & Content Truth Audit | **IN PROGRESS** | Agent 2 | `docs/CLAIMS_REGISTER.md` — every published commercial, partner, capability and capacity claim with a verification state. Seeded; needs owner answers. |

### 5.2 Live collision warning

At 00:26 on 2026-09-04 the shared working tree held uncommitted Agent 1 edits implementing
**WS-11 and WS-12 — the two workstreams this document assigns to Agent 2.**

Agent 2 stopped rather than duplicating them. If Agent 1 intends to keep WS-11/WS-12, update
the owner column above so the board matches reality. Agent 2 will take whatever is genuinely
unclaimed.

Both agents are operating in the **same working directory**, not just the same repository.
Uncommitted work is therefore visible and destroyable across agents. Commit early.

### 5.3 Review findings — see `docs/AGENT2_FINDINGS.md`

Nine findings against `0ce5200`. The build is sound; these are specific defects.

| ID | Severity | Summary |
|---|---|---|
| A2-F1 | **CRITICAL** | `api/inquiry.ts` returns "Inquiry received successfully" when the lead reached no destination — both when `LEAD_WEBHOOK_URL` is unset and when the webhook throws. Directive §9 forbids exactly this. |
| A2-F2 | HIGH | `verified: z.boolean().default(true)` — partner verification fails **open**. |
| A2-F3 | HIGH | `verifiedPrice: "From €1,450/mo"` attributed to an unnamed "Tier-1 Carrier Network". |
| A2-F4 | HIGH | No rate limiting on the public inquiry endpoint. |
| A2-F5 | MEDIUM | Full contact PII written to `console.log`. |
| A2-F6 | MEDIUM | Offers cannot expire — `expiryDate` optional and unset on an `active` offer. |
| A2-F7 | MEDIUM | `strategic: true` on Gcore with no recorded approval. |
| A2-F8 | MEDIUM | Legacy `.html` and Astro routes both serve the same six URLs; no cutover record. |
| A2-F9 | LOW | "global multi-Tbps scrubbing centers" with no provider named (§3B). |

**A2-F1 is the one to act on first.** It is the difference between a lead being captured and a
prospect being told it was.

Agent 2 has **not** edited `api/inquiry.ts` or `src/content/config.ts` — both are Agent 1's
under rule 2. Fixes are proposed, not applied. Say the word and Agent 2 will take them.

### 5.4 Additional owner-input items

Extending §4 above rather than duplicating it:

4. **[OWNER INPUT REQUIRED] Offer pricing verification** — is "From €1,450/mo" real, current
   and quotable, and may the carrier be named publicly? (A2-F3, register C-01/C-02)
5. **[OWNER INPUT REQUIRED] Partner approval matrix** — per partner: relationship confirmed ·
   may be named publicly · logo approved · "strategic" approved. Four separate questions the
   schema currently collapses into two booleans. (register C-10..C-15)
6. **[OWNER INPUT REQUIRED] Legacy site retirement** — may the root `*.html`, `index.css` and
   `index.js` be deleted once the Astro build is cut over? (A2-F8)
7. **[OWNER INPUT REQUIRED] "Verified carrier"** — `how-we-work.astro` says InfraHub compares
   "verified" carriers. What does that verification consist of, and who performs it?
