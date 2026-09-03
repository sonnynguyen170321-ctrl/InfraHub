# Agent 2 — Review Findings

**Reviewer:** Agent 2
**Reviewed:** `feat/vnext-master-realignment` @ `0ce5200`
**Date:** 2026-09-04
**Method:** Read-only inspection. No source files were modified.

This is a review of Agent 1's VNext rebuild, filed per the InfraHub collaboration directive
§32 (agents test each other's work) and §19 (the repository is the communication bus).

**The build is good.** 32 routes, the homepage rhythm matches the target flow, the legacy
service URLs are preserved, `commercialMode` correctly encodes the three commercial
disciplines, and spot checks found **zero** `href="#"` placeholders and no hardcoded phone
numbers. The findings below are specific defects, not a verdict on the work.

Severity follows the project code-review convention: **CRITICAL** blocks release, **HIGH**
should be fixed before merge, **MEDIUM** should be considered, **LOW** is a note.

---

## A2-F1 — CRITICAL — The inquiry API reports success when the lead reaches nothing

`src/pages/api/inquiry.ts`

Two independent paths return `success: true` with the message *"Inquiry received
successfully"* while the lead has not been accepted by any destination:

1. **No webhook configured.** `LEAD_WEBHOOK_URL` is optional. When unset, the lead is written
   to `console.log` and the endpoint returns success. A serverless log line is not a lead
   destination — nobody is paged by it, and Vercel log retention will discard it.
2. **Webhook configured but failing.** The `fetch` is wrapped in `try/catch`; the catch logs
   `[LEAD_WEBHOOK_ERROR]` and execution falls through to the same success response.

The directive is explicit (§9): *"If the downstream operation fails: DO NOT display 'Inquiry
received.'"* Success must mean the inquiry was actually accepted downstream.

The owner-input item already recorded in `WORKSTREAMS.md` §4.2 (confirm the production
webhook) is necessary but not sufficient — even once a URL is supplied, a failing webhook
still returns success today.

**Suggested smallest fix:** treat a missing `LEAD_WEBHOOK_URL` as a configuration error
(fail closed, HTTP 503, do not claim receipt), and let a webhook rejection or throw produce a
non-success response. Only return `success: true` after downstream acceptance is confirmed.

**Ownership:** `api/inquiry.ts` is Agent 1's file (WS-03). Not edited. Flagging for decision.

---

## A2-F2 — HIGH — Partner `verified` defaults to true, so verification fails open

`src/content/config.ts`

```ts
strategic: z.boolean().default(false),
verified: z.boolean().default(true)
```

Directive §24: *"A logo implies a relationship. Therefore partner publication requires
verification."* With `.default(true)`, a partner file that simply omits the field is published
as verified. The safe default for a trust flag is the one that requires a human to assert it.

**Suggested fix:** `verified: z.boolean().default(false)`. Any partner already relying on the
default becomes explicitly `verified: true` in its own frontmatter, which is the point — the
claim becomes visible in the content file where it can be reviewed.

**Related gap:** §24 asks for relationship status, relationship *type*, public naming
approval, logo approval, and dedicated-page approval. The schema currently carries only
`strategic` and `verified`, so "may we show their logo" and "may we call them strategic"
cannot be answered separately.

**Ownership:** `src/content/config.ts` is named in Agent 1's rule 2 as high-conflict. Not
edited.

---

## A2-F3 — HIGH — Unverified commercial pricing is published

`src/content/offers/100g-transit-frankfurt.md`

```yaml
partner: "Tier-1 Carrier Network"
verifiedPrice: "From €1,450/mo"
```

A specific monthly price is attributed to an unnamed carrier. Directive §22 forbids
fabricating prices and §25 forbids invented pricing. The field is *named* `verifiedPrice`,
which asserts verification the repository cannot evidence.

`partner: "Tier-1 Carrier Network"` is not a partner — it is a category. If the carrier cannot
be named publicly, that is itself an owner decision about what may be published.

**OWNER INPUT REQUIRED:** is €1,450/mo a real, current, quotable price, and from whom?

Until answered, the honest states are `status: draft` or `status: review` — both already exist
in the schema and neither renders as a live offer.

---

## A2-F4 — HIGH — No rate limiting on a public endpoint

`src/pages/api/inquiry.ts` implements a honeypot (`website_trap_field`) but no rate limiting.
Directive §9 requires *"anti-spam/rate protection"* and §30 requires *"Rate limit public
submissions."* A honeypot stops naive bots; it does not stop repeated submission from one
source. The repository is public, so the endpoint shape is public too.

---

## A2-F5 — MEDIUM — Contact PII is written to logs

`src/pages/api/inquiry.ts`

```js
console.log(`[INQUIRY_RECEIVED] Lead ID: ${leadId}`, JSON.stringify(leadRecord, null, 2));
```

`leadRecord` contains name, company, email and phone. Directive §30: *"Avoid sensitive PII in
analytics/logging."* Logging the lead ID plus non-identifying attribution would preserve the
operational value without putting contact details in a log store.

Note this becomes less pressing once A2-F1 is fixed and logs are no longer doing duty as the
lead destination.

---

## A2-F6 — MEDIUM — Offers cannot expire

`expiryDate` is optional in the schema and absent from
`src/content/offers/100g-transit-frankfurt.md`, which carries `status: "active"` and
`featured: true`.

Directive §25: *"An expired offer must not remain displayed as current."* The status enum is
correctly modelled, but nothing transitions an offer out of `active`, and an offer with no
expiry date can never be detected as stale. A commercial page can therefore advertise an
expired price indefinitely.

**Suggested fix:** require `expiryDate` for `status: active`, and add a build-time check that
fails when an active offer's expiry is in the past. That check is in scope for WS-10 and
Agent 2 will implement it once the schema question is settled with Agent 1.

---

## A2-F7 — MEDIUM — `strategic: true` without a recorded approval

`src/content/partners/gcore.md` sets `strategic: true` and `verified: true`.

Directive §24: *"Do not call every relationship Strategic Partner unless approved."* The
concern is not that Gcore is wrong — it is that the repository holds no record of who approved
the designation, so nobody can tell an approved claim from a default.

Partner capability lines are also third-party factual claims ("160+ locations", "NVIDIA
H100 / L40S GPU AI clusters"). These are claims about Gcore's estate rather than InfraHub's,
which is the correct framing, but they still need to be true and current.

Recorded in `docs/CLAIMS_REGISTER.md`.

---

## A2-F8 — MEDIUM — Legacy and VNext implementations both serve the same URLs

The repository root still contains `index.html`, `ip-transit.html`, `ddos-protection.html`,
`wavelengths.html`, `cloud-connectivity.html`, `colocation.html`, `managed-noc.html`, plus
`index.css` and `index.js`, alongside the Astro routes that replace them.

There is no `URL_MIGRATION.md` and no recorded cutover decision. Two implementations of the
same six public URLs is a live source of drift: a fix applied to one will silently not apply
to the other.

Directive §26 wants the public URLs preserved — which the Astro routes do — and any route
change recorded with a redirect. What is missing is the decision to retire the legacy files
and the record of it.

---

## A2-F9 — LOW — Capacity language sits close to the ownership line

`src/pages/solutions/security.astro`

> "Always-on and on-demand BGP diversion absorbing volumetric UDP/TCP floods across global
> multi-Tbps scrubbing centers."

No provider is named in the sentence, so it can read as InfraHub's own scrubbing capacity.
Directive §3B warns against making InfraHub sound like it owns a provider's DDoS network.

Elsewhere the positioning is handled well — `about.astro` says InfraHub is *"an independent
infrastructure sourcing and technical advisory partner"* — so this is a wording nit in an
otherwise correct treatment, not a systemic problem. Attributing the capacity to the partner
would close it.

---

## Coordination note — WS-11 and WS-12 are being worked by both agents

At the time of writing, the working tree contains uncommitted Agent 1 changes that implement
work `WORKSTREAMS.md` assigns to Agent 2:

- `astro.config.mjs` + `package.json` — adding `@astrojs/sitemap` (**WS-11**, assigned Agent 2)
- `src/content/partners/itcare.md`, `src/content/partners/stormwall.md` (**WS-12**, assigned Agent 2)

Agent 2 has **not** started either and will not, to avoid duplicating them. See
`WORKSTREAMS.md` §5 for the revised claim.

Flagged rather than worked around, per directive §19.

---

## Separately: WS-12 as written cannot be executed truthfully

WS-12 asks Agent 2 to *"Add additional verified partner profiles (e.g. ITcare, Supertrace,
StormWall, IPXO)."*

Agent 2 has no evidence that a relationship exists with any of these companies, nor that they
have approved being named publicly or having their logos shown. Directive §22 forbids
fabricating partners and §24 requires verification before publication.

Adding these profiles is a business act, not an implementation task. It needs owner
confirmation of, per company: relationship exists · may be named publicly · logo approved ·
"strategic" approved · capabilities accurate.

Recorded as an owner-input item.

---

## A2-F10 — MEDIUM — Heading levels skip a rank, and the fix is a design change

53 warnings from `tests/audit/accessibility-audit.mjs`, across 20 page files. Two patterns:

- `h2` followed by `h4` — card titles in `.problem-card`, `.role-point`, `.stack-card` grids
- `h1` followed by `h3` — on `/about`, the four industry pages, `/lets-talk`, and the offer,
  insight and partner detail templates

Skipping a rank breaks heading navigation for screen reader users, who move through a document
by heading level. WCAG 2.2 AA, 1.3.1 Info and Relationships.

**Attempted and reverted.** Agent 2 wrote the promotion (78 headings across 20 files, then a
generalised second pass of 47 more) and it took the audit to **0 errors, 0 warnings**. It was
then reverted, deliberately, and the reason is worth recording:

**Heading level is load-bearing for styling in this codebase.** The scoped `<style>` blocks
target headings by tag, not by class:

```css
.problem-card h4 { font-size: 1.1rem; ... }
.role-point h4   { color: #ffffff; ... }
.about-card h3   { ... }
.stack-card h3   { ... }
```

Promote the markup and every one of those rules silently matches nothing. The page still passes
the accessibility audit — heading order is markup and styling is not, so the audit cannot see
the damage it just caused. 42 orphaned selectors across 32 files were identified before the
revert.

So this is not a pure accessibility fix. It is a markup **and** CSS change across 20 pages that
needs visual verification, and Agent 2 has no browser here. Shipping it would have traded a real
visual regression for a warning count — and these were warnings, not errors.

**Recommended fix, for whoever owns the design:**

1. Promote the headings so no rank is skipped: `h4` -> `h3` where the nearest preceding section
   heading is `h2`; `h3` -> `h2` where it is `h1`. Promote a consecutive run together — those
   are sibling cards, and promoting only the first leaves siblings at different levels, which
   passes a naive skip check while still being wrong.
2. Update the matching scoped selectors in the same commit. Where a file no longer contains the
   old level at all, the rewrite is mechanical and safe. Where both levels remain, it needs
   reading.
3. Verify visually. Font sizes and colours on card titles are the thing at risk.

Better still, decouple the two: target card titles by class rather than by tag, so heading rank
becomes free to change for semantic reasons without touching appearance.

The audit will confirm the result — it reports 53 warnings today and should report 0.
