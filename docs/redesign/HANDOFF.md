# InfraHub transformation — live completion ledger

**Date:** 2026-09-06

**Classification:** CURRENT_CANONICAL

**Repository state:** Local implementation certified; production cutover pending operator authorization

**Canonical branch:** `main`

**Canonical Vercel project:** `infrahub-tech` (`prj_MD8bbk5PmBps2bU5Oz7FMSPG7gQZ`)

**Vercel dashboard:** <https://vercel.com/son-nguyen-s-projects7/infrahub-tech>

This ledger supersedes the earlier release certificate. It distinguishes locally observed
evidence from production state; `BLOCKED_EXTERNAL` and `NOT_TESTED` are never treated as green.

## Progress pinned to completion

| Workstream | Status | Observed evidence |
|---|:---:|---|
| Phases 0–11 redesign implementation | COMPLETE | Present on `main`; release branch is already an ancestor of `main` |
| Git and source-of-truth reconciliation | COMPLETE | Local `main` matched `origin/main` before the continuation changes |
| Homepage first-frame readability | COMPLETE | Hero content is legible before entrance motion; protected by Playwright |
| Primary information architecture | COMPLETE | Solutions · How We Work · Industries · Insights · About; Partners and Featured Offers removed from primary navigation |
| Progressive requirement builder | COMPLETE | InfraHub Desk supports visual and natural-language starts, relevant disclosure, a live brief, advanced technical entry, attribution, and optional company |
| Accessibility and progressive enhancement | COMPLETE | WCAG A/AA browser scans pass; no-JavaScript form remains submittable; reduced-motion flow passes |
| Responsive and visual polish | COMPLETE | Browser-inspected at desktop and mobile states; no overflow from 320–1920 px; two Impeccable passes completed |
| Local release certification | COMPLETE | All gates below observed green on 2026-09-06 |
| Canonical Vercel project reconciliation | READY, NOT APPLIED | `infrahub-tech` is Astro; local `.vercel/project.json` still links to duplicate `infra-hub` |
| Inquiry delivery configuration | BLOCKED_EXTERNAL | `LEAD_WEBHOOK_URL` is NOT SET in either Vercel project; endpoint deliberately fails closed in production |
| Custom domain cutover | BLOCKED_EXTERNAL | `infrahub.tech` and `www.infrahub.tech` still resolve to and are served by GoDaddy; neither Vercel deployment has the custom-domain alias |
| Production deployment and post-deploy smoke | NOT AUTHORIZED | Requires explicit operator approval after project linkage, webhook, and DNS decisions |

## Fresh local certification

| Gate | Result | Evidence |
|---|:---:|---|
| `npm run check` | PASS | 106 files; 0 errors, 0 warnings, 0 hints |
| `npm run build` | PASS | 51 routes, 18 optimized images, serverless bundle and sitemap complete |
| `npm test` | PASS | 51 documents and 51 internal links; all static accessibility, content, performance, partner, provenance, and human-design audits green |
| `npm run test:e2e` | PASS | 161/161 Playwright tests passed in the final run |
| Impeccable detector | PASS | No prohibited UI patterns found in the changed UI (`[]`) |
| `git diff --check` | PASS | No whitespace errors |

The only build warning is environmental: the current local shell runs Node 24 while
`package.json` pins Node 22. Vercel documents that `engines.node` overrides the dashboard
default, so deployments from this repository select the adapter-supported Node 22 runtime.

## Measured homepage runtime

Measured against the final local production artifact with `scripts/measure-perf.mjs`:

| Profile | Transfer | LCP | CLS | Long tasks |
|---|---:|---:|---:|---:|
| Unthrottled | 216.4 KB | 868 ms | 0.0002 | 2 / 550 ms |
| 4× CPU, ~1.6 Mbps | 332.8 KB | 3112 ms | 0.002 | 1 / 108 ms |

These are local synthetic observations, not field Core Web Vitals.

## Production truth observed on 2026-09-06

- Vercel contains both `infrahub-tech` and duplicate `infra-hub`; both have Ready production deployments.
- `infrahub-tech` uses the Astro preset. `infra-hub` uses the generic Other preset.
- The repository is locally linked to `infra-hub`, not the canonical project.
- GitHub `main` is protected with a strict required `Build and verify` check. The active CI
  workflow runs `npm ci`, Node 22, typecheck, build, static audits, and the full browser suite.
- Both Vercel projects produced deployments at identical timestamps. This strongly indicates
  both are connected to the same Git activity, but their Git connection was not exposed by the
  read-only CLI and must be confirmed before merge.
- Neither project has environment variables configured. `LEAD_WEBHOOK_URL` is therefore NOT SET.
- Neither latest deployment lists `infrahub.tech` or `www.infrahub.tech` as an alias, and both
  names return “Domain not found” when inspected in this Vercel account.
- Apex DNS resolves to `13.248.243.5` and `76.223.105.230`; `www` CNAMEs to the apex.
- HTTP redirects to HTTPS and `www` redirects to the apex; HTTPS is reachable with HSTS.
- The public apex still serves the legacy GoDaddy page titled “InfraHub” with “Innovative Infrastructure Solutions” and has no canonical link.
- The Vercel build has the intended title and canonical link to `https://infrahub.tech/`.
- `npm run verify:production` provides a repeatable, read-only post-cutover gate. Before
  deployment, the canonical Vercel URL passes 28/30 checks; only the new requirement entry
  point and Desk builder are absent because the certified continuation commit has not been pushed.

## Authorized cutover sequence

Do not perform these production mutations without explicit operator authorization:

1. Confirm the Git connections, disconnect the duplicate `infra-hub` project, and relink this
   repository to `infrahub-tech`; retain the repository's Node 22 engine pin.
2. Configure `LEAD_WEBHOOK_URL` for the required Vercel targets and verify delivery without exposing or logging the value.
3. Push the certified continuation commit to a release branch, open a PR into protected `main`, and wait for the strict `Build and verify` check before merging.
4. Confirm that only `infrahub-tech` receives the production deployment from the merge.
5. Attach `infrahub.tech` and `www.infrahub.tech` to `infrahub-tech`; apply the project-specific DNS records Vercel reports through the external DNS provider.
6. Run `npm run verify:production`, then verify TLS, mobile navigation, and the inquiry flow on the real deployment.
7. Only after the post-deploy smoke is green, remove or archive the duplicate `infra-hub` project.

The transformation is locally release-ready. It is not production-complete until every item
above is observed in the live environment and this ledger is updated with that evidence.
