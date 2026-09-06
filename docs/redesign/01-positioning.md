# Phase 1 — Positioning

**Classification:** CURRENT_CANONICAL
**Written:** 2026-09-06
**Branch:** `redesign/phase1-truth`

Master plan: [MASTER_PLAN.md](MASTER_PLAN.md) §27 Phase 1. Companion:
[01-claims-audit.md](01-claims-audit.md).

This is the stable ground the creative phases build on. §27 gates it explicitly: **no major
creative direction until positioning is stable.**

---

## 1. Positioning, in one paragraph

> InfraHub is an infrastructure sourcing and evaluation practice for teams making decisions
> they cannot easily reverse. It sits between a technical requirement and the specialists who
> deliver against it: qualifying what is actually being asked for, sourcing enterprise
> hardware directly, and coordinating introductions to the providers whose capabilities fit.
> Its distinctive competence is making the infrastructure reality underneath a requirement
> visible — that a logical route is not always a physical route, that two suppliers can share
> one dependency, and that the right provider depends on workload, location, capacity,
> resilience, timing and commercial constraints rather than on a feature comparison. InfraHub
> does not own carrier networks, data centers or cloud estates, and says so. Its value is
> knowing what should be compared, and why.

**What that paragraph deliberately does not say**, because none of it is approved: that
InfraHub is independent, vendor-neutral, zero-markup, guaranteed, officially partnered,
strategic, or verified. Every one of those is a removed or banned claim (register §5, §6).

### The single-line internal filter

> **From requirement to infrastructure reality.**

Per §4 this is the conceptual filter for identity, diagrams, motion, layout and photography.
It is not yet approved as a public tagline and must not be shipped as one without owner sign-off.

---

## 2. What is true, and what is ambition

§27 requires separating approved facts from ambitious future positioning. Conflating the two
is how the current copy acquired percentage claims nobody could evidence.

### Approved and evidenced today

- Three real delivery roles: hardware sourcing; partner-delivered services; architecture,
  evaluation and advisory.
- Eight canonical partners, each with a sourced capability scope and a canonical domain:
  FastNetMon, Gcore, StormWall, Zenlayer, IPXO, Vates, ITcare, Airframe.
- The operating model **Understand → Match → Introduce → Deliver**.
- Six qualification factors: workload, location, capacity, resilience, timing, commercial
  constraints. Present in `DeliveryModel.astro` and `EcosystemSolutions.astro`.
- Physical vs logical route diversity as a genuine analytical position, with named
  convergence points and a text equivalent.
- Commercial-role transparency: the role varies by engagement and is clarified before an
  introduction proceeds. *(Subject to owner confirmation Q-4.)*
- Fail-closed publication for both offers and partners.

### Ambition — real direction, not yet publishable as fact

- Being *the* evaluation authority for European infrastructure decisions.
- A published methodology others cite.
- Named client outcomes and case studies. **None exist.** §32 forbids inventing them.
- Any exclusivity, tiering or "strategic" language with partners.
- Any performance, savings or availability figure, until an owner-approved entry with
  `approvedBy` and `evidence` exists in `docs/approved-claims.json`.

The redesign expresses ambition through **craft** — identity, typography, art direction,
composition, restraint — not through claims. That is the entire premise of §34.

---

## 3. Audience groups

Derived from the four industry pages that already exist, plus the service architecture.

### A. ISPs and network operators
Run an ASN. Care about upstream transit economics, route diversity that is physically real,
DDoS telemetry and mitigation, clean IPv4, and NOC coverage they do not want to staff.
**Decision trigger:** a resilience or capacity commitment they must defend internally.
**What earns trust:** technical precision and a refusal to overstate. This audience detects
marketing inflation instantly, which is why the percentage claims were an active liability.

### B. Hosting and cloud providers
Resell infrastructure. Care about unit economics, hardware sourcing cost, virtualization
licensing, and margin. **Decision trigger:** a cost structure that stopped working — a VMware
licensing change, a hardware refresh.
**What earns trust:** honest comparison including where the alternative is worse.

### C. SaaS and technology companies
Run a product on someone else's platform. Care about hyperscaler cost, egress, steady-state
versus elastic workloads, and hybrid connectivity. **Decision trigger:** a cloud bill that
outgrew its value, or a latency or residency requirement.
**What earns trust:** modelling their actual profile rather than quoting a headline saving.

### D. Enterprise
Have compliance, procurement and internal stakeholders. Care about data residency,
accountability, contractual clarity, and who is responsible when something fails.
**Decision trigger:** a compliance or continuity requirement.
**What earns trust:** clarity about which entity is accountable for what. This is precisely
why "GDPR-compliant datacenters" had to go — compliance is an accountable-entity question,
not a facility attribute.

**Common thread:** every group is technical enough to detect exaggeration, and is making a
decision that is expensive to reverse. Restraint is not a stylistic preference here. It is
the commercial strategy.

---

## 4. Value proposition hierarchy

Ordered. Higher lines are more defensible and more distinctive; the design should give them
more weight.

1. **We make the infrastructure reality underneath your requirement visible.**
   The route-diversity work is the proof, not a feature. Most defensible, most ownable,
   hardest to copy. §12 Act 04 makes it the flagship.
2. **We qualify the requirement before proposing anything.**
   Understand → Match → Introduce → Deliver, and the six factors. Positions InfraHub against
   catalogue-first competitors.
3. **We know which specialists are worth introducing you to, and why.**
   Eight sourced partners with decision layers and source references. Selective, not a
   directory.
4. **We source enterprise hardware directly.**
   The most transactional line, and the least differentiating — but real revenue and real
   capability. It should not lead.
5. **We are explicit about our own commercial role.**
   A trust asset precisely because so few say it. *(Pending Q-4.)*

**Design consequence:** the current homepage weights 3 and 4 heavily — partner marquee,
offers, service cards. The redesign must weight **1 and 2**. That is the single largest
information-hierarchy change the five-act structure implies, and it is why §13 moves offers
and the evaluator off the homepage.

---

## 5. Reconciliation findings

Per §27, "reconcile About / How We Work / service pages / partner records."

| Finding | Detail | Disposition |
|---|---|---|
| Register was stale | Reconciled 2026-09-04; Phases 1-7 landed since without updating it | Recorded in [01-claims-audit.md](01-claims-audit.md); register should be re-reconciled at Phase 11 |
| Automated gate insufficient | 5 of 8 §18-named claims were live while `content-truth-audit.mjs` passed | Heuristic rule proposed in the claims audit |
| `project-overview.md` is stale | `.claude/rules/project-overview.md` describes `/index.html`, `/index.css`, `/index.js` — a pre-Astro structure that no longer exists | **Flagged, not edited.** It is precedence level 4 (§2) and will be rewritten in Phase 4 alongside the brand guidelines |
| Six factors not on How We Work | `how-we-work.astro` carries the four-step model but only 4 of 6 factors — "workload" and "timing" absent | Not a defect: the six live in `DeliveryModel.astro` and `EcosystemSolutions.astro`. Worth unifying in Phase 10 |
| About page H1 is already on-thesis | "Better infrastructure decisions begin with understanding the requirement." | **Preserve.** It states value proposition 2 directly and predates this audit |
| Partner records consistent | 8 approved partners, 8 profile routes, 8 provenance entries, 0 unapproved candidates published | No action |

---

## 6. Verification

Run on this branch after the copy rewrites, exit codes captured from the tools:

| Gate | Result |
|---|---|
| `npm run check` | **exit 0** — 104 files, 0 errors, 0 warnings, 0 hints |
| `npm run build` | **exit 0** — 50 routes prerendered |
| `npm test` | see commit message — 8 static stages including content truth |
| §18 named claims remaining | **0 of 8** |

Route count unchanged at 50. No component, layout or style was touched — this phase changed
copy only.

---

## 7. Gate

§27 Phase 1 gate: **no major creative direction until positioning is stable.**

| Requirement | Status |
|---|---|
| Reconcile About / How We Work / services / partners | done — §5 |
| Claim audit table | done — [01-claims-audit.md](01-claims-audit.md), 17 rewritten |
| Identify owner-input gaps | done — 7 open questions, none published |
| Clean unsupported service copy | done — 10 files, all 8 §18 claims clear |
| Separate approved facts from ambition | done — §2 |
| Brand positioning in one paragraph | done — §1 |
| Audience groups | done — §3, four groups |
| Value proposition hierarchy | done — §4, ordered, with the design consequence stated |

**Gate: PASS.** Phase 2 (Brand Research) may begin.

The one carried constraint: nothing in Phase 2 or later may reintroduce a performance,
savings or availability figure without an owner-approved entry in `docs/approved-claims.json`
carrying both `approvedBy` and `evidence`.
