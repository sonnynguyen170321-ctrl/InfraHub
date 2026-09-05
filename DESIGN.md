# InfraHub Design System

**Version:** 4.0.0 — cinematic homepage
**Product:** infrahub.tech
**Business model:** infrastructure sourcing and technical advisory; partner-delivered services are contracted with the selected provider

This records what the site does, verified against the code and against measurements taken from
the built output. Where a number appears, it was measured, not intended.

---

## 1. Creative thesis: the infrastructure field guide

InfraHub is a sourcing and advisory desk, authored by people with carrier, routing and facility
judgement. The site reads as a field guide: precise, structured, and willing to say what it does
not know.

The homepage is one continuous journey rather than a stack of sections:

```
Arrival → Ecosystem → Discovery → Judgment → Reality → Market → Practice → Conversation
```

Underneath it sits the operating model the business actually runs:
**Understand → Match → Introduce → Deliver.**

---

## 2. The routing line

One line, used everywhere it means something.

| Role | Colour | Weight |
|:---|:---|:---|
| Structural path | `--border-color` | 1px |
| Active route | InfraHub cobalt `#2854C7` | 1.5–2px |
| Secondary route | Signal teal `#0D9488` | 1.5–2px |
| Shared dependency / risk | Route amber `#D97706` | 3.5px |

Where it appears, and what it means in each place:

- **Hero exit** — the requirement entering the site.
- **Partner ribbon** — the structural baseline under the ecosystem.
- **Discovery** — branches into the routes a discipline actually offers, generated from the same
  data the panels render, so the line cannot drift from the services it describes.
- **Judgment** — a vertical spine that draws as each step is reached; passed steps stay drawn.
- **Reality** — becomes the two carrier routes, and the one amber segment they share.
- **Conversation** — arrives at the CTA and terminates into the footer rule.
- **Form success** — completes, then the confirmation copy arrives.

Prohibited: connected-dot meshes, glowing nodes, circuit-board wallpaper, particle fields,
animated grid backgrounds, transit-map treatments where every element gets a node.

---

## 3. Typography

IBM Plex, self-hosted from this origin. No third-party font requests.

| Role | Family | Weights | Files |
|:---|:---|:---|:---|
| Display and headings | IBM Plex Sans | 600, 700 | `ibm-plex-sans-var.woff2` (variable, 45kb) |
| Body | IBM Plex Sans | 400, 600 | same file |
| Technical data | IBM Plex Mono | 400, 600 | `ibm-plex-mono-400.woff2`, `-600.woff2` |

**700 is the heaviest weight.** IBM Plex Sans has no 800; asking for one produced synthetic bold
in 45 files, which is why the site now asks for 700. There is no 500 either — those declarations
became 600.

Mono is for technical values: ASN, prefix, capacity, price, date, diagram labels. It is not for
marketing eyebrows or section headings.

Reading measures: lead 42–55ch, technical explanation 58–68ch, insight body 60–72ch, compact
callouts 38–46ch.

---

## 4. Palette

| Name | Hex | Use |
|:---|:---|:---|
| Carbon | `#091118` | primary text, deep bands |
| Deep navy | `#0B1120` | judgment chapter, closing CTA |
| Paper | `#F4F5F1` | editorial ground |
| Mist | `#E9ECE8` | grouping surfaces |
| Structural grey | `#D2D7D3` | hairlines, dividers |
| InfraHub cobalt | `#2854C7` | active route, interactive cue |
| Signal teal | `#0D9488` | secondary route |
| Route amber | `#D97706` | shared physical dependency, and nothing else |

Amber is reserved. If it appears, it means two things that looked separate are not.

---

## 5. Motion tokens

```css
--motion-fast: 140ms;     /* pressed states */
--motion-ui: 200ms;       /* hover, focus, toggles */
--motion-content: 420ms;  /* copy and panels */
--motion-image: 650ms;    /* image transitions */
--motion-scene: 850ms;    /* scene-level changes */
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
```

`linear` is for the marquee only. `transition: all` is not used anywhere.

---

## 6. Scroll scenes

Two scenes pin. Both are conditional:

```css
@media (min-width: 1180px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)
```

All three conditions sit in one query, so no later rule can reinstate pinning for a reader who
asked for less motion.

| Scene | Height | Progression |
|:---|:---|:---|
| Discovery (`#discoveryScene`) | 260vh | 5 disciplines, ~1.8 viewports of travel |
| Route diversity (`#routeScene`) | 300vh | 4 states, ~2.2 viewports of travel |

Rules that make a pinned scene safe:

- Scroll and click drive the same `activate()` / `setState()`. They cannot disagree.
- Clicking a control scrolls to the position that represents that state, so the next wheel event
  does not undo the click.
- `resize`, breakpoint change and reduced-motion change recompute the mapping.
- Native scrolling only: no wheel interception, no snap, no smooth-scroll library.
- Nothing else pins — not the hero, the ribbon, the offers, the insight or the CTA.

---

## 7. Image transitions

Three, site-wide:

- **A. Horizontal clip reveal** — the discovery visual: `clip-path: inset(0 100% 0 0)` out, opposite
  edge in, with a 1.5% scale change.
- **B. Crossfade with crop change** — editorial imagery.
- **C. Tonal wipe on the routing line** — where a chapter changes ground colour.

No new transition per section.

---

## 8. The route diversity exhibit

The signature scene, and the one that has to teach something.

Four states: logical, physical, risk points, conclusion. Implemented in **SVG, not WebGL**.

The Three.js option was built and measured before rejection: `three.module.js` is 263kb
uncompressed, took 402ms to load and parse, and rendered the model at 57fps with 9 draw calls.
It was rejected because the exhibit is labelled geometry — in GL the labels need extra libraries,
the amber shared segment cannot take a usable stroke width without fat-line support, and every
device tier then needs its own fallback. The SVG model carries real text, no bytes and no
lifecycle, and renders identically on a phone.

Rules for the exhibit:

- Tilt is CSS: `rotateX(11deg) rotateZ(-1.5deg)` in the physical view, flat in the logical view.
- Pointer response is at most 2.5°, only in the physical view, only with a fine pointer and only
  when motion is allowed. The model is an exhibit, not a toy.
- The inactive view is `visibility: hidden`, not transparent: nothing in it is reachable,
  hoverable or announced.
- Every point named on the model is also a list item in the document.
- The model says it is illustrative, because it is.

---

## 9. Partner motion and governance

- Marquee: 62s per cycle, linear, paused on hover and `:focus-within`, stopped entirely under
  reduced motion. The duplicate track is `aria-hidden`.
- Logos render at 30px tall, capped at 150px wide, with per-record `logoScale` for lockups whose
  aspect ratio needs it.
- Only official published assets. No recolouring, no cropping, no re-composition, no CSS
  greyscale. Delivered copies may be resized (`scripts/optimize-partner-logos.mjs`); the
  untouched originals live in `docs/brand-source/partners/`.
- Publication is fail-closed: `logoApproved` requires `logoStatus: approved`, a real non-empty
  file and a provenance entry, enforced by `tests/audit/partner-assets.test.mjs`.

---

## 10. Reduced motion

Not a degraded page — a different, deliberate one.

- No scene pins; both scenes become ordinary blocks.
- No scroll-linked camera movement, no parallax, no route drawing; every route line renders drawn.
- The marquee stops.
- Both the route exhibit and the discipline navigator still switch by click.
- Covered by `tests/e2e/progressive-enhancement.spec.ts`.

---

## 11. Without JavaScript

Every chapter renders its content: headline, all eight partner logos, the first discipline and
its routes, all four process steps, the exhibit's lesson as text, offers, industries and the
closing CTA. The inquiry form is present markup. Covered by the same spec.

---

## 12. Performance budget

Measured with `scripts/measure-perf.mjs` on a throttled profile (4× CPU, ~1.6Mbps):

| Metric | Budget | Measured |
|:---|:---|:---|
| LCP | < 2.5s | 2.02s |
| CLS | < 0.1 | 0.003 |
| Long tasks | none over 200ms | 0 |
| Page script | keep light | 0kb — Astro inlines the page's scripts into the document |
| Fonts | same-origin | 76kb across three files |

Rules: the hero goes through `astro:assets` (sized webp + srcset); fonts are preloaded from this
origin; no library is loaded for animation; nothing is hotlinked.

---

## 13. Microinteractions

- Buttons: press `scale(0.985)`, 100–130ms. No lift.
- Hover: tonal or border response. **No `translateY` lift anywhere.**
- Links: underline, or a 4px arrow movement — one, not both.
- Tabs: the active indicator travels.
- Header: compacts 12px and gains a hairline past the hero. No blur, no float, no colour change.

---

## 14. Prohibited

1. Card grids where a list would do; three equal cards.
2. Pills and badges for text that is not a status.
3. Faux terminal windows, fake dashboards, status panels, telemetry read-outs.
4. Uppercase mono as decoration, and `//` separators borrowed from code comments.
5. Hover lift, glass, blur, glow, gradient borders, pastel blobs.
6. Decorative 3D. WebGL must earn its bytes against an SVG alternative, in a measurement.
7. Scroll hijacking, forced snap, smooth-scroll engines, custom cursors, magnetic buttons.
8. Animation that makes an uncertain claim look more certain.

---

## 15. Commercial truth

Motion never upgrades a claim. Prices stay fail-closed (`src/lib/offer-pricing.ts`); partner
logos stay gated; the route model stays illustrative; banned-until-approved phrases fail the
build (`tests/audit/content-truth-audit.mjs`, allowlist in `docs/approved-claims.json`).
