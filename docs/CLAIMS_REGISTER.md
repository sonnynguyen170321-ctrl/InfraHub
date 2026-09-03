# InfraHub — Claims & Trust Register

**Purpose:** every factual, commercial or capability claim published on the site, with its
verification state. A claim that is not in this register with state `APPROVED` should not be
presented to the public as fact.

**Maintained by:** Agent 2 (WS-14). Seeded 2026-09-04 from `feat/vnext-master-realignment`
@ `0ce5200`.

**States**

| State | Meaning |
|---|---|
| `APPROVED` | Verified true and cleared for publication |
| `VERIFY` | Plausible, needs a source before it ships |
| `OWNER INPUT` | Only the owner can answer; blocks publication |
| `REMOVE` | Cannot be substantiated; take it down |

**Rule:** `OWNER INPUT` placeholders live here and in `WORKSTREAMS.md`. They must never be
rendered on a production page (directive §2).

---

## 1. Commercial claims — pricing and offers

| ID | Claim | Location | State | Note |
|---|---|---|---|---|
| C-01 | "From €1,450/mo" for 100G IP Transit Frankfurt | `content/offers/100g-transit-frankfurt.md` | **OWNER INPUT** | Field is named `verifiedPrice` but no source is recorded. Real and currently quotable? From whom? See A2-F3. |
| C-02 | Supplier is a "Tier-1 Carrier Network" | same | **OWNER INPUT** | A category, not a partner. If the carrier cannot be named publicly, that is itself a decision. |
| C-03 | "Sub-1ms Cross-Connect into Frankfurt MMRs" | same | VERIFY | Latency claim tied to specific facilities. |
| C-04 | "100 Gbps Port with 20G Committed Data Rate" | same | VERIFY | Commercial term; confirm it matches a real available product. |
| C-05 | Offer is `status: active` with no `expiryDate` | same | **REMOVE or fix** | Cannot expire, so it can advertise a stale price indefinitely. See A2-F6. |
| C-06 | Remaining three offers (`dell-poweredge-r650-refurbished`, `fastnetmon-ddos-detection-100g`, `singapore-bare-metal-epyc`) | `content/offers/` | VERIFY | Not yet audited line by line. Same questions apply: price real, stock real, expiry set. |

## 2. Partner relationships

A published partner profile asserts four separate things. They need separate answers.

| ID | Partner | Asserts | State | Note |
|---|---|---|---|---|
| C-10 | Gcore | relationship · public naming · logo · `strategic: true` | **OWNER INPUT** | See A2-F7. No approval recorded for the strategic designation. |
| C-11 | FastNetMon | relationship · public naming · logo · verified | **OWNER INPUT** | Published as verified. |
| C-12 | Zenlayer | relationship · public naming · logo · verified | **OWNER INPUT** | Published as verified. |
| C-13 | Vates | relationship · public naming · logo · verified | **OWNER INPUT** | Published as verified. |
| C-14 | ITcare, StormWall | in progress in the working tree | **OWNER INPUT** | Same four questions before publication. |
| C-15 | Supertrace, IPXO | named in WS-12 as candidates | **OWNER INPUT** | Agent 2 has no evidence any relationship exists. Will not author these profiles without confirmation. |

**Schema note:** `verified` currently defaults to `true` (A2-F2), so a partner file that omits
the field is published as verified. Until that default is inverted, absence of the field is not
evidence of anything.

## 3. Third-party capability claims

Claims about a partner's estate. Correctly attributed to the partner rather than to InfraHub,
but still need to be true and current.

| ID | Claim | Location | State |
|---|---|---|---|
| C-20 | Gcore "edge cloud spanning 160+ locations" | `content/partners/gcore.md` | VERIFY |
| C-21 | Gcore "NVIDIA H100 / L40S GPU AI clusters" | same | VERIFY |
| C-22 | Gcore "low-latency global CDN with live streaming optimization" | same | VERIFY |
| C-23 | Gcore "built-in web application security and DDoS scrubbing" | same | VERIFY |
| C-24 | Capabilities listed for FastNetMon, Zenlayer, Vates | `content/partners/` | VERIFY |

## 4. Capacity and infrastructure language

The risk here is implying InfraHub owns infrastructure it introduces (directive §3B).

| ID | Claim | Location | State | Note |
|---|---|---|---|---|
| C-30 | "global multi-Tbps scrubbing centers" | `pages/solutions/security.astro` | VERIFY | No provider named; can read as InfraHub's own capacity. See A2-F9. |
| C-31 | "Volumetric reflection attacks routinely top 1.5 Tbps" | `pages/ddos-protection.astro` | VERIFY | Industry statement about the threat landscape, not an InfraHub capability. Needs a citable source. |
| C-32 | "3.2 Tbps NVLink interconnect", "80GB HBM3" | `pages/gpu-ai-infrastructure.astro` | VERIFY | Vendor hardware specification. Checkable against NVIDIA documentation. |
| C-33 | "our network of verified carriers, colocation operators, and bare-metal providers" | `pages/how-we-work.astro` | VERIFY | "Network of" reads as ecosystem, which is correct. The load-bearing word is **verified** — verified by whom, against what? |

## 5. Claims explicitly checked and NOT found

Recorded because the collaboration directive §8 lists them as known problems in the legacy
site. Searched across `src/` and none appear in the VNext build:

- No "500+" or "40+" customer/partner counts
- No "99.999%" uptime claim
- No named customer success stories or testimonials
- No fabricated case studies
- No compliance or certification claims
- No `href="#"` dead links (0 found)
- No hardcoded phone numbers

Agent 1 appears to have dropped these rather than migrating them. That is the correct call and
is noted here so a future migration does not reintroduce them.

---

## Open owner questions, consolidated

1. **C-01/C-02** — Is €1,450/mo real and quotable, and may the carrier be named?
2. **C-10..C-15** — For each partner: relationship confirmed? may be named? logo approved?
   "strategic" approved?
3. **C-33** — What does "verified carrier" mean operationally, and who performs it?
4. Do any *real, verifiable* customer outcomes exist that could eventually replace the
   editorial feature slot with a genuine case study (directive §23)?
