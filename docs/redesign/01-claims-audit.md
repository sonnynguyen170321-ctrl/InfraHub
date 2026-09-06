# Phase 1 — Claims Audit

**Classification:** CURRENT_CANONICAL
**Audited:** 2026-09-06
**Branch:** `redesign/phase1-truth`
**Base:** `768610c` (Phase 0 baseline)

Master plan: [MASTER_PLAN.md](MASTER_PLAN.md) §18. Register of record:
[`docs/CLAIMS_REGISTER.md`](../CLAIMS_REGISTER.md).

---

## Why this audit exists separately from the register

`docs/CLAIMS_REGISTER.md` was reconciled against the code on **2026-09-04**. Two things
have landed since:

1. The Phase 1-6 implementation train (PRs #16-#21).
2. The Phase 7 certification (PR #22), which removed a further set of fabricated
   availability, activation, latency, MTTR, savings, response-time and zero-downtime claims,
   plus "Principal Engineer Review" and "1 Business Day SLA".

Neither updated the register. So the register was accurate for the tree it was written
against and stale for the current one. §18 anticipates exactly this and requires a **manual
sweep, not a regex pass** — and the manual sweep found live claims the automated audit does
not catch, because `content-truth-audit.mjs` bans specific phrases and none of these were on
the list.

**This is the substantive finding of Phase 1: the automated content-truth gate was green
while five of the eight claims §18 names by hand were live in production copy.**

---

## Audit table

Status values per §18: `approved` · `sourced` · `owner input` · `remove / generalize`.

### Resolved in this phase — rewritten

| Page | Claim | Evidence | Status | Action taken |
|---|---|---|---|---|
| `solutions/network-connectivity.astro:42` | "reducing cloud egress fees by 60%+" | none | remove / generalize | Now states the saving depends on traffic profile and is modelled before commitment |
| `solutions/network-connectivity.astro:35` | "sub-millisecond latencies" | none | remove / generalize | Now "latency follows the physical path"; diversity evaluated against conduit |
| `solutions/cloud-virtualization.astro:19` | "sovereignty and margin control" | none | remove / generalize | Now "evaluated against where data must reside and what the licensing actually costs" |
| `solutions/cloud-virtualization.astro:27` | "zero per-core penalties" | Vates licensing is genuinely not per-core | remove / generalize | Kept the true part ("not priced per core"), dropped "zero penalties"; added that migration effort is assessed per estate |
| `solutions/cloud-virtualization.astro:34` | "GDPR-compliant European datacenters" | none — compliance is an accountable-entity question | remove / generalize | Now states which requirements apply is established per engagement |
| `cloud-connectivity.astro:20` | "60%+ cloud egress fee savings" | none | remove / generalize | Replaced with the latency-path statement, savings claim dropped |
| `cloud-connectivity.astro:37` | "60%-80% Egress Cost Reduction" (heading) | none | remove / generalize | Heading now "Egress Cost Modelling"; body explains billing differs and is modelled |
| `cloud-connectivity.astro:45` | "Zero Attack Surface Exposure" | overstated — private addressing reduces exposure, it is not zero | remove / generalize | Now "No Public Internet Exposure", describing what is actually true |
| `enterprise-hardware.astro:33` | "50%-70% Cost Reduction" | none | remove / generalize | Now "Cost Against List Pricing"; difference quoted per requirement |
| `solutions/infrastructure.astro:67` | "50% cheaper on dedicated bare metal" | none | remove / generalize | Now explains *why* the pricing model favours constant utilisation; comparison run per workload |
| `industries/saas-technology.astro:25` | "saving 50%+ on monthly compute bills" | none | remove / generalize | Now modelled against utilisation profile |
| `industries/saas-technology.astro:32` | "reduce cloud egress penalties by 60%-80%" | none | remove / generalize | Now describes the dedicated path, no percentage |
| `colocation.astro:123` | "30%+ of total monthly datacenter expenditure" | plausible, unsourced | remove / generalize | Now "frequently a material share", with the real point: it is missed when only rack price is quoted |
| `dedicated-servers.astro:33` | "100% Dedicated Hardware" / "zero hypervisor jitter" | overstated absolute | remove / generalize | Now "Single-Tenant Hardware", describing no shared hypervisor scheduling |
| `wavelengths.astro:9,21` | "sub-millisecond latencies", "deterministic sub-millisecond latency" | none | remove / generalize | Latency follows the physical route; diversity checked against conduit |
| `industries/isps-network-operators.astro:17` | "sub-second DDoS flow telemetry" | FastNetMon "sub-2-second" was already removed as unsupported (C-20) | remove / generalize | Now "flow-based DDoS telemetry" |
| `content/offers/amsterdam-100g-metro-wavelength.md:17` | "sub-millisecond latency" | none | remove / generalize | Latency confirmed for the delivered path |

**17 claims rewritten across 10 files.**

### Checked and retained

| Page | Claim | Evidence | Status |
|---|---|---|---|
| `ip-transit.astro:163` | "Top 5% burst samples excluded" | Standard 95th-percentile billing definition | **approved** — industry terminology, not a performance claim |
| `colocation.astro:100` | "Zero Hardware CapEx" | Describes the commercial model of managed bare metal: there is genuinely no hardware purchase | **approved** — factual about the billing model, not a performance promise |
| various | "24/7" NOC / remote hands | Attributed to the provider (ITcare NOC, facility remote hands), never to InfraHub | **approved** — provider attribution intact |
| various | "sovereign cloud", "data residency" | Names a service category; `private-cloud.astro` states what must be established first | **approved** — matches register §6 disposition |

### Still requiring owner input

Carried forward from the register, unchanged by this phase. None is currently published as a
public claim; all are gated fail-closed.

| ID | Question | Blocks |
|---|---|---|
| C-05 to C-08 | Offer pricing, allocation, supplier attribution, validity | Any offer moving to `publicApproved` |
| Q-2 | **Logo display permission** — assets are sourced from partners' own brand kits, but permission to display is separate and still outstanding | §17 partner ecosystem work, Phase 9 |
| Q-3 | Vates baseline-free horizontal lockup | Ribbon rendering quality |
| Q-4 | Commercial model wording — is "role varies by engagement" how the business actually operates? | §12 Act 05, About page |
| Q-5 | Legal entity, address, DPO, EU representative, retention period, legal basis | Privacy policy completeness |
| Q-6 | Are `inquiries@infrahub.tech` and `privacy@infrahub.tech` real, monitored mailboxes? | Launch |
| Q-7 | Operational definition of "verified" if it is ever to be used as a trust claim | Any future trust language |

---

## Recommendation: close the gate that let this through

The banned-phrase list in `tests/audit/content-truth-audit.mjs` caught nothing here because it
matches literal phrases. Every claim above was a **number attached to a benefit** — a shape,
not a phrase.

Proposed addition for Phase 6 or earlier: a heuristic rule that flags a percentage, a
`sub-<unit>` construction, or an absolute ("zero", "100%", "guaranteed") appearing within a
short distance of a benefit word (saving, reduction, latency, uptime, faster, cheaper) in
public copy, requiring an `approved-claims.json` entry to pass.

That converts §18 from a manual sweep somebody has to remember into a gate. Recorded here
rather than implemented now, because Phase 1's mandate is truth, not tooling.

---

## Verification

Re-run after the rewrites:

| Check | Result |
|---|---|
| `grep` for all 8 §18 named claims | **0 occurrences** across `src/` |
| Remaining percentage claims in copy | 1 — the approved 95th-percentile definition |
| `npm run check` | see [01-positioning.md](01-positioning.md) verification section |

---

## Gate

§18: *"No visual redesign is complete while high-risk copy is still unverified."*

Every claim the master plan names by hand is now either rewritten, evidenced, or explicitly
routed to owner input with nothing published in the meantime. **Phase 1 claims gate: PASS.**
