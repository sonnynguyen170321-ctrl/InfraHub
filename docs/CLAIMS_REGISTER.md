# InfraHub — Claims & Trust Register

**Purpose:** track factual, commercial, relationship, and capability claims published on the site with their verification state.

**States**

| State | Meaning |
|---|---|
| `APPROVED` | Verified true and cleared for publication |
| `SOURCED` | Supported by an identified primary source; wording should stay within that source |
| `VERIFY` | Plausible but needs a source before it ships as fact |
| `OWNER INPUT` | Only the owner can answer |
| `REMOVE` | Cannot be substantiated; take it down or rewrite it |

---

## 1. Commercial claims — pricing and offers

| ID | Claim | Location | State | Note |
|---|---|---|---|---|
| C-01 | "From €1,450/mo" for 100G IP Transit Frankfurt | `content/offers/100g-transit-frankfurt.md` | **OWNER INPUT** | Real and currently quotable? From whom? |
| C-02 | Supplier is a "Tier-1 Carrier Network" | same | **OWNER INPUT** | A category, not a named provider. If the carrier cannot be named publicly, that is itself a publishing decision. |
| C-03 | "Sub-1ms Cross-Connect into Frankfurt MMRs" | same | VERIFY | Latency claim tied to specific facilities. |
| C-04 | "100 Gbps Port with 20G Committed Data Rate" | same | VERIFY | Commercial term; confirm it matches a real available product. |
| C-06 | Other active offers | `content/offers/` | VERIFY | Price, stock/allocation, provider attribution, and validity must remain current. |

---

## 2. Canonical partner relationships

The owner confirmed the following eight organizations as the correct InfraHub partner list on 2026-09-04. The domains below are the canonical source domains for partner identity and capability wording.

| ID | Partner | Canonical domain | Relationship / public naming | Logo status |
|---|---|---|---|---|
| C-10 | FastNetMon | `https://fastnetmon.com/` | **APPROVED** | Official logo asset not yet imported/approved |
| C-11 | Gcore | `https://gcore.com/` | **APPROVED** | Official logo asset not yet imported/approved |
| C-12 | StormWall | `https://stormwall.network/` | **APPROVED** | Official logo asset not yet imported/approved |
| C-13 | Zenlayer | `https://www.zenlayer.com/` | **APPROVED** | Official logo asset not yet imported/approved |
| C-14 | IPXO | `https://www.ipxo.com/` | **APPROVED** | Official logo asset not yet imported/approved |
| C-15 | Vates | `https://vates.tech/` | **APPROVED** | Official logo asset not yet imported/approved |
| C-16 | ITcare | `https://itcare.net/` | **APPROVED** | Official logo asset not yet imported/approved |
| C-17 | Airframe | `https://www.airframe.ai/` | **APPROVED** | Official logo asset not yet imported/approved |

`Supertrace` is not part of the canonical partner list and has been removed from the partner collection.

**Publication rule:** partner publication remains fail-closed in the content schema. `relationshipConfirmed`, `publicNameApproved`, `logoApproved`, `homepageMarqueeEnabled`, and `partnerPageEnabled` all default to `false`. The eight records above explicitly opt into the relationship/public-name/homepage/page gates. Logos stay text-only until a legitimate official asset is imported and approved.

---

## 3. Partner capability claims — official-source alignment

The current partner profiles intentionally use non-volatile product descriptions rather than copying marketing superlatives, headline statistics, or time-sensitive capacity numbers.

| ID | Partner | Current sourced capability scope | Primary source | State |
|---|---|---|---|---|
| C-20 | FastNetMon | DDoS traffic analysis; BGP FlowSpec; RTBH; scrubbing-centre diversion; APIs and policy-driven workflows | `https://fastnetmon.com/` | **SOURCED** |
| C-21 | Gcore | Cloud compute/bare metal; GPU/AI services; CDN/DNS/streaming; DDoS/WAF/bot protection | `https://gcore.com/` | **SOURCED** |
| C-22 | StormWall | Web DDoS/WAF; BGP-based network protection; TCP/UDP protection; antibot | `https://stormwall.network/` | **SOURCED** |
| C-23 | Zenlayer | Bare metal/elastic compute; cloud networking; IP transit/acceleration/CDN; edge colocation and AI infrastructure | `https://www.zenlayer.com/` | **SOURCED** |
| C-24 | IPXO | IPv4 leasing; monetization; IP management/governance; KYC/RPKI/abuse/LIR-related services | `https://www.ipxo.com/` | **SOURCED** |
| C-25 | Vates | XCP-ng; Xen Orchestra; VM management/backup/replication/automation; commercial Vates VMS support | `https://vates.tech/` | **SOURCED** |
| C-26 | ITcare | Network architecture/engineering; 24/7 NOC; DevOps/network automation; HORA AI-assisted NetOps | `https://itcare.net/` | **SOURCED** |
| C-27 | Airframe | AI/software deployment mapping; spend and renewal visibility; build-vs-buy/workflow guidance; transition planning and sourced research | `https://www.airframe.ai/` | **SOURCED** |

Claims deliberately removed from partner profiles because they were stale, unsupported, overly specific, or unnecessary include examples such as "sub-2-second" FastNetMon detection, Gcore's old `160+` footprint wording, Zenlayer's old `110+ PoP` and latency statements, StormWall multi-terabit/sub-3-second claims, ITcare sub-five-minute response language, and broad "leading"/"world's largest" positioning.

---

## 4. Capacity and infrastructure language

The risk here is implying InfraHub owns infrastructure it introduces.

| ID | Claim | Location | State | Note |
|---|---|---|---|---|
| C-30 | "global multi-Tbps scrubbing centers" | `pages/solutions/security.astro` | VERIFY | No provider named; can read as InfraHub's own capacity. |
| C-31 | "Volumetric reflection attacks routinely top 1.5 Tbps" | `pages/ddos-protection.astro` | VERIFY | Industry statement about the threat landscape; needs a citable source. |
| C-32 | "3.2 Tbps NVLink interconnect", "80GB HBM3" | `pages/gpu-ai-infrastructure.astro` | VERIFY | Vendor hardware specification; should be tied to an exact GPU generation/source. |
| C-33 | "our network of verified carriers, colocation operators, and bare-metal providers" | `pages/how-we-work.astro` | VERIFY | "Network of" is fine; "verified" needs an operational definition. |

---

## 5. Promises InfraHub makes about itself

| ID | Claim | Location | State | Note |
|---|---|---|---|---|
| C-40 | "Zero Fee Guarantee" / no additional fees or markups | `pages/lets-talk.astro` and related commercial copy | **OWNER INPUT** | Needs owner confirmation that the promise holds in every applicable case. |
| C-41 | "Guaranteed European legal jurisdiction ... zero extraterritorial US CLOUD Act exposure" | `pages/private-cloud.astro` | **OWNER INPUT** | Too strong without provider- and entity-specific legal verification. |

---

## 6. Claims explicitly checked and not found

- No "500+" or "40+" customer/partner counts
- No "99.999%" uptime claim
- No named customer success stories or testimonials presented as InfraHub outcomes
- No fabricated InfraHub case studies
- No hardcoded phone numbers

---

## Open owner questions, consolidated

1. **Offer truth:** confirm pricing, supplier attribution, validity, stock/allocation, and commercial terms for active offers.
2. **Partner logos:** provide or approve official logo assets for the eight canonical partners. FastNetMon and Gcore publish official brand/media kits; IPXO also publishes brand assets. Until imported and approved, the site intentionally uses text-only partner marks.
3. **Strategic designations:** none of the eight partners is currently labeled strategic. Add such a designation only if the owner explicitly wants and can support it.
4. **"Verified" terminology:** define what InfraHub verifies operationally before using the word as a broad trust claim.
