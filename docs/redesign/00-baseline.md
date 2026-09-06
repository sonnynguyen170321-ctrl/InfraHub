# Phase 0 — Freeze + Baseline

**Classification:** CURRENT_CANONICAL
**Captured:** 2026-09-06
**Branch:** `redesign/phase0-baseline`
**Baseline production SHA:** `768610c56b73e55a9bed60c43ebd8bb5e41017aa`

Master plan: [MASTER_PLAN.md](MASTER_PLAN.md) §27 Phase 0.

This records what the site is *before* any creative change, so every later phase can be
diffed against a known-good state. It changes no design.

---

## 1. Frozen point

| Item | Value |
|---|---|
| Production SHA | `768610c56b73e55a9bed60c43ebd8bb5e41017aa` |
| Merge commit | PR #22 — Phase 7 release certification |
| Branch base | `main`, 0 behind / 0 ahead at capture |
| Working tree | clean |

`main` at this SHA is the certified release train of the previous Phase 1-6 work plus its
certification. All redesign branches start here.

---

## 2. Route inventory

**50 built HTML pages** in `dist/client` (49 route directories plus the root index).

| Group | Count | Routes |
|---|---:|---|
| Home | 1 | `/` |
| Solution families | 5 | `/solutions/{infrastructure, cloud-virtualization, network-connectivity, security, managed-services}` |
| Individual services | 19 | `/ip-transit`, `/wavelengths`, `/layer-2-connectivity`, `/cloud-connectivity`, `/ipv4`, `/dedicated-servers`, `/custom-iaas`, `/gpu-ai-infrastructure`, `/colocation`, `/enterprise-hardware`, `/private-cloud`, `/vmware-alternatives`, `/ddos-protection`, `/ddos-detection-automation`, `/bgp-routing-intelligence`, `/cybersecurity`, `/managed-noc`, `/ai-network-operations`, `/offers` |
| Partners | 9 | `/partners` + 8 profiles (airframe, fastnetmon, gcore, ipxo, itcare, stormwall, vates, zenlayer) |
| Industries | 5 | `/industries` + enterprise, hosting-cloud-providers, isps-network-operators, saas-technology |
| Insights | 5 | `/insights` + 4 articles |
| Company / legal | 5 | `/about`, `/how-we-work`, `/lets-talk`, `/privacy`, `/terms` |

The 8 partner profile routes match the 8 canonical approved partners in the claims register
(master plan §17). No unapproved candidate from the 21-name owner inventory is published.

**Route preservation is a hard constraint.** Master plan §22 requires these routes survive the
redesign. Any removal needs an explicit redirect decision.

---

## 3. Test suite

Run on this exact tree. Each exit code captured from the tool itself, not from a pipe.

| Gate | Command | Result |
|---|---|---|
| Diagnostics | `npm run check` | **exit 0** — 104 files, 0 errors, 0 warnings, 0 hints |
| Production build | `npm run build` | **exit 0** — 50 routes prerendered |
| Static audits | `npm test` | **exit 0** — 8 sequential stages |
| End-to-end | `npm run test:e2e` | **exit 0** — 161/161 passed, 19 spec files |
| Whitespace | `git diff --check` | clean |

The 8 static stages are route/SEO verification plus seven audit programs: accessibility,
content truth, performance, partner trust ribbon, human design, user forensics, partner
assets.

CI on the merge commit `768610c` also passed, including the required `Build and verify`
check and both Vercel deployments.

---

## 4. Runtime errors

**Zero.** Across 33 captures spanning 9 pages and all 9 target viewports:

- console errors: **0**
- failed requests: **0**

One 404 surfaced during capture and was **my error, not the site's** — the first capture run
requested `/network-connectivity`, which does not exist; the real route is
`/solutions/network-connectivity`. `scripts/visual-baseline.mjs` now throws on any HTTP >= 400
so a mistyped route can never be filed as a valid baseline again.

---

## 5. Performance baseline

Measured at 1440x900 against the production build served locally, unthrottled. These are
*local* numbers — they establish relative regression detection, not the throttled field
targets in §23.

| Route | LCP | CLS | DCL | HTML |
|---|---:|---:|---:|---:|
| `/` | 832ms | 0.0002 | 648ms | 101 KiB |
| `/wavelengths` | 260ms | 0.0061 | 232ms | 36 KiB |
| `/solutions/network-connectivity` | 316ms | 0.0000 | 211ms | 33 KiB |

Page load times across all 33 captures ranged **652ms to 1614ms** (networkidle, 2x DPR).

**Against §23 targets:** CLS is far inside the 0.05 budget on every page. Local LCP is
comfortable but says nothing about throttled field LCP — Phase 11 must measure that properly.

**Homepage HTML is 101 KiB and is the number to watch.** The previous phase reduced it from
108 KB to 97.9 KiB by externalising styles and generated scripts; it has drifted back up.
The homepage is roughly 3x the weight of any other page, and §12 calls for it to become
*shorter*. Treat 101 KiB as the ceiling, not the starting point.

---

## 6. Visual baseline

Captured to `docs/redesign/visual/00-baseline/`, one folder per page.

- **33 captures** at 2x device scale
- Homepage at all **9** §25 viewports; other pages at 1440x900, 768x1024, 390x844
- Full-page captures additionally at 1440x900 and 390x844
- `capture-report.json` records load time, console errors and failed requests per capture

Pages captured: `/`, `/wavelengths`, `/partners`, `/partners/fastnetmon`, `/about`,
`/how-we-work`, `/lets-talk`, `/solutions/network-connectivity`, `/insights`.

Re-run for any later phase:

```bash
PORT=4331 node scripts/static-server.mjs &
node scripts/visual-baseline.mjs --phase 07-homepage
```

`scripts/visual-baseline.mjs` is the §26 visual QA protocol made repeatable. It is
deliberately a record, not a gate: it reports runtime errors rather than failing on them.

---

## 7. What must not regress

Carried from master plan §22 and §33. Every one of these is currently working and protected
by a test:

- Astro static-first architecture; progressive enhancement; no-JS readable content
- content-truth audit and partner provenance gates, both fail-closed
- reduced-motion behavior; keyboard accessibility; WCAG AA contrast
- all 50 routes; SEO metadata; sitemap
- Understand → Match → Introduce → Deliver model
- the six qualification factors: workload, location, capacity, resilience, timing, commercial
- logical vs physical route diversity, with named risk points and a text fallback
- 8 approved partners only, with source references and commercial-role disclosure

---

## 8. Gate

Phase 0 gate is **all baseline evidence captured**.

| Requirement | Status |
|---|---|
| Redesign branch created | done — `redesign/phase0-baseline` |
| Production SHA recorded | done — `768610c` |
| Visual baseline at all target sizes | done — 33 captures, 9 viewports |
| Test suite run | done — 4 gates, all exit 0 |
| Performance recorded | done — LCP/CLS/DCL/HTML for 3 representative routes |
| Runtime errors recorded | done — zero |
| Route count recorded | done — 50 |
| No design changed | confirmed — this phase adds docs and one capture script only |

**Gate: PASS.** Phase 1 (Truth + Positioning Audit) may begin.

---

## 9. Known open items entering Phase 1

Not blockers, but they should not be forgotten:

1. **15 merged remote branches await deletion** — permission-blocked, awaiting owner action.
2. **PRs #14 and #15 are open.** `#15 ux/hero-entry-choreography` overlaps Act 01 hero work
   and will likely be obsoleted by this redesign; `#14 motion-pinterest-study` is a motion
   study that may inform §20. Both need an explicit keep-or-close decision.
3. **Homepage HTML has drifted** from 97.9 KiB to 101 KiB since the last performance pass.
4. **Node runtime drift** — the build warns that local Node 24 is not supported by Vercel
   serverless functions, which will use Node 22. §22 calls for runtime alignment.
