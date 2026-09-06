# Phase 7 — Release Certification Walkthrough

**Classification:** CURRENT_CANONICAL  
**Certified locally:** 2026-09-06 16:03 +07:00  
**Release branch:** `release/phase7-certification`

## Verdict

| Boundary | Verdict | Evidence |
| --- | --- | --- |
| Local release candidate | **PASS** | Build, diagnostics, eight static stages, and 161 Playwright tests are green. |
| GitHub release branch | **PENDING** | This certification commit must be pushed and pass the Node 22 CI workflow. |
| Production merge/deployment | **NOT EXECUTED** | Production is a separate authorization boundary. |

The locally certified candidate contains the cumulative Phase 1–6 release train plus the Phase 7 corrections documented below. No lead-generation or CRM code is part of this repository or release.

## Master-plan reconciliation

The six implementation branches form a linear cumulative stack over `origin/main` (`871da2e08c43`). The certification branch started from the Phase 6 head (`b58ad30907a8`), which was seven commits ahead and zero commits behind `origin/main` when certification began.

| Phase | Pull request | Scope | Remote state at certification |
| --- | --- | --- | --- |
| 1 | [#16](https://github.com/sonnynguyen170321-ctrl/InfraHub/pull/16) | Hero entry choreography | Open, mergeable, clean; 4 checks successful |
| 2 | [#17](https://github.com/sonnynguyen170321-ctrl/InfraHub/pull/17) | Hero-to-partner spatial continuity | Open, mergeable, policy-blocked; 4 checks successful |
| 3 | [#18](https://github.com/sonnynguyen170321-ctrl/InfraHub/pull/18) | Requirement discovery and architectural causality | Open, mergeable, policy-blocked; 4 checks successful |
| 4 | [#19](https://github.com/sonnynguyen170321-ctrl/InfraHub/pull/19) | Route diversity and provider-match evaluation | Open, mergeable, policy-blocked; 4 checks successful |
| 5 | [#20](https://github.com/sonnynguyen170321-ctrl/InfraHub/pull/20) | Proof, commercial truth, and evaluation | Open, mergeable, policy-blocked; 4 checks successful |
| 6 | [#21](https://github.com/sonnynguyen170321-ctrl/InfraHub/pull/21) | Final CTA and inquiry orchestration | Open, mergeable, policy-blocked; 4 checks successful |

The original Phase 7 plan understated the current test surface. The repository has **19 E2E spec files**, not 17. The final Playwright matrix contains **161 tests** across desktop and mobile projects. The `npm test` command contains eight sequential static stages: route verification plus seven audit programs.

## Defects found and corrected

1. **Unsupported commercial and operational claims**
   - Removed fabricated availability, activation, latency, MTTR, savings, response-time, and zero-downtime claims.
   - Removed the hard-coded offer term/specification inspector. No offers are currently public-approved, so its previous test was vacuous and the displayed terms had no canonical source.
   - Replaced the sector scorecard's fabricated `verified` metrics with neutral evaluation factors stored in a shared typed data module.
   - Removed “Principal Engineer Review” and “1 Business Day SLA” commitments while retaining useful inquiry pre-fill routes.

2. **Design-system violations**
   - Removed hover lift, glow, drop-shadow, blur, faux telemetry, decorative chapter labels, and dashboard-style verification badges prohibited by `DESIGN.md`.
   - Changed route failure styling from generic red alarm treatment to the project's shared-dependency amber semantics.
   - Strengthened the human-design audit so it scans component-scoped Astro styles as well as the global stylesheet.

3. **Accessibility and interaction defects**
   - Corrected the route failure control's hover and active contrast with the AA-safe amber text token.
   - Made a selected route convergence point persist after pointer exit and return after the illustrative failure state closes.
   - Added a focused regression for that restored selection.
   - Gave the multi-panel Axe test a scoped 60-second timeout after the first full run proved its previous 30-second failure was load-sensitive; the isolated scan completed successfully and the final full run remained green.

4. **Performance and evidence quality**
   - Reduced homepage HTML from 108 KB to **100,226 bytes (97.9 KiB)** by emitting styles and small generated scripts as cacheable external assets and removing duplicated inline sector JSON.
   - Removed the final performance warning without increasing the budget.
   - Updated the user-forensics audit to scroll the lazy ribbon into view and wait for all logos, eliminating misleading `0x0` image evidence.

## Final verification evidence

All commands below exited with code 0 on the exact release-candidate tree.

| Command | Result |
| --- | --- |
| `npm run check` | 104 files; 0 errors, 0 warnings, 0 hints |
| `npm run build` | Production Vercel bundle completed; 50 routes prerendered; sitemap and static output generated |
| `npm test` | All 8 static stages passed |
| `npm run test:e2e` | 161/161 tests passed across 19 spec files in 5.2 minutes |
| `git diff --check` | No whitespace errors |

### Static matrix details

- Route/SEO verification: 50 HTML pages and 51 internal links; 0 broken links.
- Static accessibility: 50 pages; 0 errors, 0 warnings.
- Content truth: 8 offers, 8 partners, 62 publishable files; 0 errors, 0 warnings.
- Performance/social: 50 pages; 0 errors, 0 warnings; homepage 97.9 KiB.
- Partner ribbon governance: 8 canonical partners, publication gates, duplicate-track accessibility, and reduced-motion fallback passed.
- Human design forensics: distinct imagery, typography, destinations, and component/global anti-pattern checks passed.
- User forensics: 8 ribbon logos, 8 ledger cards, 8 profile pages, 0 invisible-text findings, 11 screenshots.
- Partner assets: all 8 routes, source files, provenance records, and rendered assets passed.

### Browser matrix details

- WCAG A/AA Axe scans passed for representative pages, all discipline panels, both route views, the inquiry error state, and the open mobile drawer.
- Desktop and mobile navigation, focus containment, keyboard operation, and skip-link behavior passed.
- Hero choreography, canvas fallback, breakpoint behavior, reduced motion, partner continuity, and primary-action landing behavior passed.
- Discovery, qualification, process story, route diversity, sector evaluation, offer publication gates, and inquiry orchestration passed.
- Progressive enhancement passed without JavaScript and under reduced motion.
- Runtime health passed for every published page with no browser errors or failed local resources.
- Responsive overflow checks passed from 320 px through 1920 px.

## Release conditions and remaining boundary

The local machine used Node `v24.16.0` and npm `11.13.0`. The package and Vercel runtime target Node 22; Astro emitted the expected advisory that Vercel will use Node 22. The existing Phase 1–6 PR checks are green on GitHub, but this Phase 7 commit still requires its own Node 22 CI result before merge.

Recommended release path:

1. Push `release/phase7-certification` and open one final release PR to `main`.
2. Require the final branch's four CI checks to pass on Node 22.
3. Use the final release PR as the single production merge path because it already contains the cumulative Phase 1–6 history and the certification fixes. Mark PRs #16–#21 as superseded rather than merging duplicate cumulative branches separately.
4. Obtain explicit operator authorization for the production merge.
5. After merge/deployment, verify the remote `main` identity and perform a read-only production smoke test. Local certification alone is not a production sign-off.
