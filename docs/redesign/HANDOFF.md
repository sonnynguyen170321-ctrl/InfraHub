# InfraHub transformation — live completion ledger

**Date:** 2026-09-06

**Classification:** CURRENT_CANONICAL

**Repository state:** Merged and deployed to canonical Vercel production; public-domain and inquiry-delivery cutover pending

**Canonical branch:** `main`

**Canonical Vercel project:** `infrahub-tech` (`prj_MD8bbk5PmBps2bU5Oz7FMSPG7gQZ`)

**Vercel dashboard:** <https://vercel.com/son-nguyen-s-projects7/infrahub-tech>

This ledger supersedes the earlier release certificate. It distinguishes observed evidence
from pending external configuration; `BLOCKED_EXTERNAL` and `NOT_TESTED` are never green.

## Progress pinned to completion

| Workstream | Status | Observed evidence |
|---|:---:|---|
| Phases 0–11 redesign implementation | COMPLETE | Transformation is merged into protected `main` |
| Homepage first-frame readability | COMPLETE | Hero value proposition is legible before entrance motion |
| Primary information architecture | COMPLETE | Solutions · How We Work · Industries · Insights · About; Partners and Featured Offers removed from primary navigation |
| Progressive requirement builder | COMPLETE | InfraHub Desk supports visual and natural-language starts, starter prompt chips, rotating placeholder guidance, persistent Desk quick-access trigger, relevant disclosure, a live brief, advanced technical entry, attribution, and optional company |
| Inbound service orchestration | COMPLETE | Every published `service=` value maps to a valid broad scope; changing scope clears internal and visible detail state together; priority inference correctly routes security/DDoS |
| Accessibility and progressive enhancement | COMPLETE | WCAG A/AA browser scans pass; no-JavaScript form remains submittable; reduced-motion flow passes |
| Responsive and visual polish | COMPLETE | No overflow from 320–1920 px; two Impeccable browser-polish passes completed |
| Local release certification | COMPLETE | All local gates below observed green |
| Protected-main release | COMPLETE | PR #24 merged after required Node 22 `Build and verify` CI and Vercel preview passed |
| Canonical Vercel deployment | COMPLETE | Ready production deployment; 30/30 smoke checks and 161/161 deployed browser tests passed |
| Vercel project reconciliation | COMPLETE | Duplicate `infra-hub` is absent; repository is locally linked to `infrahub-tech` |
| Inquiry delivery configuration | BLOCKED_EXTERNAL | `LEAD_WEBHOOK_URL` is NOT SET; endpoint deliberately fails closed in production |
| Custom-domain cutover | BLOCKED_EXTERNAL | `infrahub.tech` and `www.infrahub.tech` remain on the legacy GoDaddy site and are absent from Vercel |

## Certification evidence

| Gate | Result | Evidence |
|---|:---:|---|
| `npm run check` | PASS | 108 files; 0 errors, 0 warnings, 0 hints |
| `npm run build` | PASS | 51 routes, 18 optimized images, serverless bundle and sitemap complete |
| `npm test` | PASS | 51 documents and 51 internal links; all static accessibility, content, performance, partner, provenance, and human-design audits green |
| Local `npm run test:e2e` | PASS | 163/163 Playwright tests across desktop and mobile |
| Protected-main CI | PASS | Node 22 check, build, repository audits, and full browser suite |
| Vercel production smoke | PASS | 30/30 checks against `https://infrahub-tech.vercel.app` |
| Deployed `npm run test:e2e` | PASS | 161/161 Playwright tests against the canonical production deployment |
| Impeccable detector | PASS | No prohibited UI patterns in changed UI (`[]`) |
| `git diff --check` | PASS | No whitespace errors |

The local shell uses Node 24 while `package.json` pins Node 22. Vercel documents that
`engines.node` overrides the dashboard default, so repository deployments select the
adapter-supported Node 22 runtime.

## Measured homepage runtime

Measured against the final local production artifact with `scripts/measure-perf.mjs`:

| Profile | Transfer | LCP | CLS | Long tasks |
|---|---:|---:|---:|---:|
| Unthrottled | 216.4 KB | 868 ms | 0.0002 | 2 / 550 ms |
| 4× CPU, ~1.6 Mbps | 332.8 KB | 3112 ms | 0.002 | 1 / 108 ms |

These are local synthetic observations, not field Core Web Vitals.

## Production truth observed on 2026-09-06

- GitHub `main` is at commit `a8db4a5` (`feat(desk): add persistent desk trigger and starter example prompts`).
- The required main-branch CI (`34045594054`) completed successfully green in 2m43s.
- `infrahub-tech` has Ready production deployment `dpl_EHkYE4UiXx91z8jA2nrdTQvG2rui` aliased to `https://infrahub-tech.vercel.app`.
- The former duplicate `infra-hub` project is no longer present in the Vercel team inventory.
- Local Vercel linkage resolves to `son-nguyen-s-projects7/infrahub-tech`.
- The stable Vercel production alias serves the new requirement journey with persistent DeskTrigger and starter prompt chips, passing 30/30 read-only production checks plus the complete deployed browser suite.
- The canonical project has no environment variables. `LEAD_WEBHOOK_URL` is NOT SET.
- `infrahub.tech` and `www.infrahub.tech` return “Domain not found” in the Vercel account.
- Apex DNS resolves to `13.248.243.5` and `76.223.105.230`; `www` CNAMEs to the apex.
- HTTP redirects to HTTPS and `www` redirects to the apex; HTTPS is reachable with HSTS.
- The public apex still serves the legacy GoDaddy page with “Innovative Infrastructure
  Solutions” and no canonical link.
- The Vercel build correctly canonicalizes documents to `https://infrahub.tech/`, ready for
  the domain cutover.

## Remaining completion sequence

These steps require the webhook destination and control of the external DNS provider:

1. Configure `LEAD_WEBHOOK_URL` for the required Vercel targets without exposing or logging its value.
2. Verify a controlled inquiry reaches the intended destination exactly once.
3. Attach `infrahub.tech` and `www.infrahub.tech` to `infrahub-tech`.
4. Apply the project-specific DNS records reported by Vercel through the external DNS provider.
5. Run `npm run verify:production` against the public apex and verify TLS provisioning.
6. Run the full deployed browser suite against `https://infrahub.tech`.
7. Update this ledger with the observed apex and inquiry-delivery evidence.

The transformation is deployed on canonical Vercel production. It is not a complete public
launch until the webhook and custom-domain evidence above are green.
