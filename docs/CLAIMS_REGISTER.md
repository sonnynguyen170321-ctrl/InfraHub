# InfraHub — Claims & Trust Register

**Purpose:** track factual, commercial, relationship, and capability claims published on the site with their verification state.

Reconciled against the code on 2026-09-04 as part of the release audit. Entries that describe copy no longer present were resolved rather than left standing: a register full of claims that are not in the code teaches people to ignore it.

**States**

| State | Meaning |
|---|---|
| `APPROVED` | Verified true and cleared for publication |
| `SOURCED` | Supported by an identified primary source; wording should stay within that source |
| `VERIFY` | Plausible but needs a source before it ships as fact |
| `OWNER INPUT` | Only the owner can answer |
| `REMOVED` | Was in the code, is not any more |

**Mechanical enforcement.** `tests/audit/content-truth-audit.mjs` fails the build on a set of banned-until-approved phrases and on placeholder markers; `docs/approved-claims.json` is the only way to lift one, and an entry needs `approvedBy` and `evidence`. `tests/audit/partner-assets.test.mjs` ties every rendered logo to a real file and a provenance entry. Regex is a regression alarm, not the truth system.

---

## 1. Commercial claims — pricing and offers

All eight offer records are `status: review`, `publicApproved: false`, `priceStatus: unverified`, and display `Request current pricing`. None of them builds a public route; the offers board renders its empty state. `src/lib/offer-pricing.ts` will not display an exact price unless the record is owner-approved, its price status is `confirmed_allocation` or `partner_quote`, a non-placeholder `displayPrice` exists, and `priceSourceRef` names the source.

| ID | Claim | Location | State | Note |
|---|---|---|---|---|
| C-01 | "From €1,450/mo" for 100G IP Transit Frankfurt | `content/offers/100g-transit-frankfurt.md` | **REMOVED** | Replaced by `Request current pricing`. A public price needs owner approval plus `priceSourceRef`. |
| C-02 | Supplier is a "Tier-1 Carrier Network" | same | **REMOVED** | Body now reads "high-capacity upstream connectivity". |
| C-03 | "Sub-1ms Cross-Connect into Frankfurt MMRs" | same | **REMOVED** | Now "Cross-connect into Frankfurt MMRs; latency confirmed per facility". |
| C-04 | "100 Gbps Port with 20G Committed Data Rate" | same | VERIFY | Still in the record. It is a product description, not a price, but must match a real available product before the record is approved. |
| C-05 | FastNetMon-specific InfraHub pricing/allocation | `content/offers/fastnetmon-ddos-detection-100g.md` | **OWNER INPUT** | Held in review. Product capability wording is sourced from FastNetMon; any InfraHub commercial price must be separately confirmed. |
| C-06 | Remaining offer records | `content/offers/` | **OWNER INPUT** | Price, allocation, provider attribution and validity must be confirmed before any record moves to `active`. |
| C-07 | StormWall-specific InfraHub package/pricing | `content/offers/stormwall-ddos-scrubbing.md` | **OWNER INPUT** | Held in review. |
| C-08 | IPXO-specific InfraHub /24 price and allocation | `content/offers/ipv4-24-subnet-lease.md` | **OWNER INPUT** | Held in review. |
| C-09 | "Certified Refurbished" / "3-year advanced replacement warranty" | `content/offers/dell-poweredge-r*.md` | **REMOVED** | Supplier-specific certification and warranty terms; records now say terms are confirmed per supplier quotation. |

---

## 2. Canonical partner relationships

The owner confirmed these eight organizations as the partner list on 2026-09-04. Domains below are canonical for partner identity and capability wording.

| ID | Partner | Canonical domain | Relationship / public naming | Logo |
|---|---|---|---|---|
| C-10 | FastNetMon | `https://fastnetmon.com/` | **APPROVED** | `/images/partners/fastnetmon.png` — official brand kit, dark variant, unmodified |
| C-11 | Gcore | `https://gcore.com/` | **APPROVED** | `/images/partners/gcore.svg` — official media kit, byte-identical |
| C-12 | StormWall | `https://stormwall.network/` | **APPROVED** | `/images/partners/stormwall.svg` — official `dark-logo.svg`, unmodified |
| C-13 | Zenlayer | `https://www.zenlayer.com/` | **APPROVED** | `/images/partners/zenlayer.svg` — official site asset, byte-identical |
| C-14 | IPXO | `https://www.ipxo.com/` | **APPROVED** | `/images/partners/ipxo.svg` — official branding repo, byte-identical |
| C-15 | Vates | `https://vates.tech/` | **APPROVED** | `/images/partners/vates.png` — official marketing asset, unmodified. Vates publishes no baseline-free horizontal wordmark; see owner questions. |
| C-16 | ITcare | `https://itcare.net/` | **APPROVED** | `/images/partners/itcare.svg` — official light-background lockup, unmodified |
| C-17 | Airframe | `https://www.airframe.ai/` | **APPROVED** | `/images/partners/airframe.png` — official lockup, byte-identical |

`Supertrace` is not part of the canonical partner list and has been removed from the partner collection.

**Publication rule:** partner publication is fail-closed in the content schema. `relationshipConfirmed`, `publicNameApproved`, `logoApproved`, `homepageMarqueeEnabled` and `partnerPageEnabled` all default to `false`. Displaying a partner logo remains a claim about a relationship, and `tests/audit/partner-assets.test.mjs` now enforces that an approved logo is a real, documented file.

**Logo permission is still an owner matter.** Sourcing an asset from a partner's own brand kit is not the same as being granted permission to display it. See owner questions.

---

## 3. Partner capability claims — official-source alignment

Partner profiles use non-volatile product descriptions rather than marketing superlatives, headline statistics, or time-sensitive capacity numbers. Since the release audit, each partner's architecture guidance, decision questions, fit statements and commercial cautions live in the partner record's `decisionLayer` with `sourceRefs`, and those references render on the page.

| ID | Partner | Sourced capability scope | Primary source | State |
|---|---|---|---|---|
| C-20 | FastNetMon | DDoS traffic analysis; BGP FlowSpec; RTBH; scrubbing-centre diversion; APIs and policy-driven workflows | `https://fastnetmon.com/` | **SOURCED** |
| C-21 | Gcore | Cloud compute/bare metal; GPU/AI services; CDN/DNS/streaming; DDoS/WAF/bot protection | `https://gcore.com/` | **SOURCED** |
| C-22 | StormWall | Web DDoS/WAF; BGP-based network protection; TCP/UDP protection; antibot | `https://stormwall.network/` | **SOURCED** |
| C-23 | Zenlayer | Bare metal/elastic compute; cloud networking; IP transit/acceleration/CDN; edge colocation | `https://www.zenlayer.com/` | **SOURCED** |
| C-24 | IPXO | IPv4 leasing; monetization; IP management/governance; KYC/RPKI/abuse handling | `https://www.ipxo.com/` | **SOURCED** |
| C-25 | Vates | XCP-ng; Xen Orchestra; VM management/backup/replication/automation; commercial support | `https://vates.tech/` | **SOURCED** |
| C-26 | ITcare | Network architecture/engineering; 24/7 NOC; DevOps/network automation | `https://itcare.net/` | **SOURCED** |
| C-27 | Airframe | Technology market intelligence; vendor diligence; build-vs-buy assessment; decision support | `https://www.airframe.ai/` | **SOURCED** |

Removed from partner and service pages because they were stale, unsupported or over-precise: FastNetMon "sub-2-second" detection, Gcore's `160+` footprint wording, Zenlayer's `110+ PoP` and latency statements, StormWall multi-terabit and sub-3-second claims, ITcare sub-five-minute response language, and "leading" / "world's largest" positioning.

---

## 4. Capacity and infrastructure language

The risk is implying InfraHub owns infrastructure it introduces.

| ID | Claim | Location | State | Note |
|---|---|---|---|---|
| C-30 | "global multi-Tbps scrubbing centers" | `pages/solutions/security.astro` | **REMOVED** | Not present in the code. |
| C-32 | "3.2 Tbps NVLink interconnect", "80GB HBM3" | `pages/gpu-ai-infrastructure.astro` | **REMOVED** | Not present in the code. |
| C-33 | "our network of verified carriers…" | `pages/how-we-work.astro` | **REMOVED** | Not present in the code. |
| C-34 | "verified interconnection partners", "verified 10kW to 30kW circuits", "verified conduit diversity", "verified chain-of-custody", "verified RPKI validation" | connectivity, colocation, IPv4 and industry pages | **REMOVED** | Rewritten on 2026-09-04 to say who confirms what, rather than asserting InfraHub verified it. |

---

## 5. Promises InfraHub makes about itself

| ID | Claim | Location | State | Note |
|---|---|---|---|---|
| C-40 | "Zero Fee Guarantee" / no additional fees or markups | previously `pages/lets-talk.astro`, `about.astro`, offer template | **REMOVED** | Also on the banned-until-approved list, so it fails the build if it returns. Reinstating it requires an owner-approved entry in `docs/approved-claims.json`. |
| C-41 | "Guaranteed European legal jurisdiction … zero extraterritorial US CLOUD Act exposure" | `pages/private-cloud.astro` | **REMOVED** | The page now says where data resides, which entity provides the service, and which requirements apply must be established before treating a platform as sovereign or compliant. |
| C-42 | "commercial quote within 1 business day" | offer detail template | **REMOVED** | Replaced with what InfraHub can state: it reviews the request and confirms availability and terms with the relevant supplier or provider. |
| C-43 | "independent" / "vendor-neutral" positioning | `about.astro`, `DeliveryModel.astro`, `Footer.astro`, `FinalCTA.astro` | **REMOVED** | About now states the commercial role varies by engagement and is clarified before an introduction or transaction proceeds. |
| C-44 | "Dedicated architect support", "Direct partner contract & SLA" | offer detail template | **REMOVED** | Staffing and contract promises with no owner approval behind them. |

---

## 6. Term sweep — 2026-09-04

Every term the release directive named, searched across `src/pages`, `src/components` and `src/content`.

| Term | Occurrences | Disposition |
|---|---|---|
| independent | 5 | APPROVED — all describe third parties ("independent penetration testing", "physical paths are independent"), none claims InfraHub's independence |
| verified | remaining uses | APPROVED — schema field names, `verified: true` gates, and the partner "Published capability scope" block; the trust-claim uses were rewritten (C-34) |
| zero markup / zero fee | 0 | REMOVED, and banned until approved |
| guaranteed | 0 | REMOVED |
| strategic | remaining uses | APPROVED — schema fields (`strategicStatus`, `strategic: false`) and generic copy; no partner is labelled strategic |
| official partner | 0 | REMOVED, and banned until approved |
| Tier-1 | 0 | REMOVED |
| multi-Tbps, sub-1ms, sub-2, sub-5, 24-hour, 1 business day, carrier-grade | 0 | REMOVED |
| sovereign | 10 | APPROVED — names a service category ("sovereign cloud", "data residency"); `private-cloud.astro` states what must be established before treating a platform as sovereign |
| SLA | remaining uses | APPROVED — every use attributes the SLA to the provider, never to InfraHub |
| certified | 0 in public copy | REMOVED — supplier certification claims dropped from the hardware records |

---

## 7. Claims explicitly checked and not found

- No customer or partner counts ("500+", "40+")
- No uptime percentage claims
- No named customer stories or testimonials presented as InfraHub outcomes
- No fabricated case studies
- No hardcoded phone numbers

---

## Open owner questions, consolidated

1. **Offer truth.** Confirm pricing, supplier attribution, validity, allocation and commercial terms before any offer record moves to `active` / `publicApproved: true`. Each approved price also needs a `priceSourceRef`, or the price gate will keep it hidden.
2. **Logo permission.** All eight logos are now the partners' own published assets, sourced from their brand kits or sites. Permission to display them in InfraHub's partner ecosystem is a separate question and is still outstanding.
3. **Vates lockup.** Vates publishes only a wordmark-with-baseline and a vertical planet lockup. At ribbon size the baseline is small. Ask Vates for a baseline-free horizontal mark, or accept the current rendering.
4. **Commercial model wording.** About and the inquiry page now say InfraHub's commercial role varies by engagement and is clarified before an introduction proceeds. Confirm this is how the business actually operates, and whether a stronger statement is both true and approvable.
5. **Legal entity and privacy specifics.** The privacy policy discloses actual production facts (Vercel hosting, Vercel Web Analytics, inquiry dispatch, provider sharing). It does not name a legal entity, address, DPO, EU representative, retention period or legal basis, because none has been supplied. Legal input required.
6. **Mailbox verification.** `inquiries@infrahub.tech` and `privacy@infrahub.tech` are published on the site. Confirm both are real, monitored mailboxes before launch.
7. **"Verified" terminology.** If InfraHub wants to use "verified" as a trust claim, define what it verifies operationally; until then the word stays out of public copy.
