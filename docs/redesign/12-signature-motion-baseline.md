# Phase 12 — Signature Motion & Premium Experience: Baseline

Frozen before any visual edit, per the Signature Motion directive §3–§5.

## Baseline identity

| Field | Value |
|---|---|
| Branch | `redesign/signature-motion-polish` |
| Base commit | `2639246145fef74f91a0c058d74815d168578192` |
| Base branch | `main`, identical to `origin/main` at fetch time |
| Working tree at branch creation | clean |
| Rollback | `git checkout main` — base commit is unmoved |
| Vercel project (local link) | `infrahub-tech`, `prj_MD8bbk5PmBps2bU5Oz7FMSPG7gQZ`, org `team_pid8F1dujiQjsscKbaFSw5Gf` |

## Baseline verification results

Every gate run against the base commit before editing. All green.

| Gate | Command | Result |
|---|---|---|
| Type/content check | `npm run check` | 0 errors, 0 warnings, 3 hints (115 files) |
| Production build | `npm run build` | exit 0, server built in 12.02s |
| Audit suite (7) | `npm test` | pass |
| E2E | `npm run test:e2e` | **155 passed** (3.0m), exit 0 |

The 3 check hints are pre-existing and confined to test files: an ineffective `await` in
`final-cta-orchestration.spec.ts:54`, and two unused declarations in `homepage-scenes.spec.ts`.
They are recorded rather than fixed here so this commit changes no behaviour.

Audit highlights worth keeping as regression anchors:

- Header brand mark vs wordmark vertical delta: **0.01px** (gate: < 0.5px)
- Invisible / low-contrast text violations: **0**
- Partner ribbon logos: 8, all resolving to non-empty files with provenance entries
- Responsive: no horizontal overflow at 320–1920px

## Homepage composition at baseline

`src/pages/index.astro` renders six components:

1. `Hero` — `#hero`
2. `PartnerTrustRibbon` — `.partner-trust-ribbon`
3. `SolutionSelector` — `#what-you-need`
4. `ConvergenceVisual` — `#why-infrahub`
5. `RouteDiversityExplorer` — `#route-explorer` (teaser mode)
6. `FinalCTA` — `#start-requirement`

## Motion architecture at baseline

Two modules, both preserved and extended rather than replaced:

- **`src/scripts/homepage-scheduler.ts`** — one scroll listener, one rAF, one set of viewport
  measurements shared by every scene. Exposes `pinnedProgress`, `passageProgress`, and a
  progress-source registry so a scene that knows its own travel is the authority on it.
- **`src/scripts/homepage-scene-system.ts`** — scene registry over `SCENE_SELECTORS`, plus three
  cross-scene handoffs (discovery→judgment, judgment→routeReality, routeReality→market).

The hero publishes `--hero-progress` through the scheduler's progress-source registry. This is
the extension point the Living Infrastructure Lens is built on: no new animation runtime is
required, and none is introduced.

## Findings carried into the audit

Recorded at baseline, fixed in later commits.

| ID | Severity | Finding |
|---|---|---|
| F1 | P1 | Customer-facing screenplay labels: `Act 2 • Capabilities`, `Act 3 • The Model`, `Act 5 • Start` (directive §18) |
| F2 | P1 | `ConvergenceVisual` hardcodes five arbitrary hex colours and spends **amber on "Hardware Chassis"**, breaking the reservation of amber for dependency/risk (§12, §21) |
| F3 | P1 | `homepage-scene-system.ts` `update()` returns early when `reducedMotion` is set, so `--scene-progress` is never written and reduced-motion visitors get no resolved scene states at all (§26) |
| F4 | P3 | `scripts/capture-matrix.mjs` still names `discovery-sticky`, `step-match` and `featured-offers` scenes, from components no longer imported by `index.astro` |

## Constraints accepted for this phase

- **Hero composition.** The full-bleed facility photograph is kept and becomes Scene 0 of the
  lens — the physical infrastructure the sequence resolves *from*. The directive's §9 preference
  for a split composition is set aside under its own measured-evidence exemption: the scrim stops
  in `Hero.astro` were chosen from contrast measurements to hold 4.5:1 AA over the copy column,
  and the LCP strategy depends on that single eager image.
- **Deployment.** Sections 38, 41 and 42 are out of scope for this pass. The connected Vercel
  credential authenticates to a team that does not own `infrahub-tech` and returns 403 on the
  owning org, so preview and production verification cannot be performed honestly from here.
  Work is verified locally against the built output and handed over as a pushed branch.
- **No new runtime dependency.** No GSAP, Three.js, React or animation library is introduced.
  The lens is CSS, SVG and the existing scheduler.
