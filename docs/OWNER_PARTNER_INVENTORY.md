# InfraHub Owner Partner Ecosystem Matrix

This document tracks all 21 candidates identified by the InfraHub owner. It acts as the single commercial and technical source of truth for partner status, approval gates, and owner input requirements.

**Fail-Closed Principle:** A partner only appears publicly on the website (`homepageMarqueeEnabled: true` or `partnerPageEnabled: true`) when all required business gates are explicitly approved by the owner.

---

## Complete Ecosystem Matrix (21 Owner-Listed Candidates)

| # | Partner Candidate | Category | Content Record Exists? | Relationship Status | Public Naming Approved? | Official Logo Obtained? | Logo Usage Approved? | Partner Profile Ready? | Homepage Marquee Ready? | Strategic Status | Owner Input Needed |
|:---:|:---|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| 1 | **Zenlayer** | Infrastructure & Cloud | Yes (`zenlayer.md`) | Confirmed | Approved | Sourced | Pending | Yes | Yes (Text Mark) | None | Approve official SVG logo asset |
| 2 | **Gcore** | Infrastructure & Cloud | Yes (`gcore.md`) | Confirmed | Approved | Sourced | Pending | Yes | Yes (Text Mark) | None | Approve official SVG logo asset |
| 3 | **Limestone Networks** | Infrastructure & Cloud | No | Unconfirmed | Unapproved | Missing | No | No | No | None | Confirm relationship & scope |
| 4 | **Delta Cloud** | Infrastructure & Cloud | No | Unconfirmed | Unapproved | Missing | No | No | No | None | Confirm relationship & scope |
| 5 | **DT Cloud** | Infrastructure & Cloud | No | Unconfirmed | Unapproved | Missing | No | No | No | None | Confirm relationship & scope |
| 6 | **FlokiNET** | Infrastructure & Cloud | No | Unconfirmed | Unapproved | Missing | No | No | No | None | Confirm relationship & scope |
| 7 | **ZET.NET** | Network & Connectivity | No | Unconfirmed | Unapproved | Missing | No | No | No | None | Confirm relationship & scope |
| 8 | **IPXO** | Network & Connectivity | Yes (`ipxo.md`) | Confirmed | Approved | Sourced | Pending | Yes | Yes (Text Mark) | None | Approve official SVG logo asset |
| 9 | **FastNetMon** | Security | Yes (`fastnetmon.md`) | Confirmed | Approved | Sourced | Pending | Yes | Yes (Text Mark) | None | Approve official SVG logo asset |
| 10 | **StormWall** | Security | Yes (`stormwall.md`) | Confirmed | Approved | Sourced | Pending | Yes | Yes (Text Mark) | None | Approve official SVG logo asset |
| 11 | **Coretech** | Managed Operations | No | Unconfirmed | Unapproved | Missing | No | No | No | None | Confirm relationship & scope |
| 12 | **SoCyber** | Security | No | Unconfirmed | Unapproved | Missing | No | No | No | None | Confirm relationship & scope |
| 13 | **TLPBLACK** | Security | No | Unconfirmed | Unapproved | Missing | No | No | No | None | Confirm relationship & scope |
| 14 | **ITcare** | Managed Operations | Yes (`itcare.md`) | Confirmed | Approved | Sourced | Pending | Yes | Yes (Text Mark) | None | Approve official SVG logo asset |
| 15 | **Supertrace** | Network & Connectivity | Yes (`supertrace.md`) | Confirmed | Approved | Sourced | Pending | Yes | Yes (Text Mark) | None | Approve official SVG logo asset |
| 16 | **vExpertAI** | Cloud & Virtualization | No | Unconfirmed | Unapproved | Missing | No | No | No | None | Confirm relationship & scope |
| 17 | **Vates** | Virtualization | Yes (`vates.md`) | Confirmed | Approved | Sourced | Pending | Yes | Yes (Text Mark) | None | Approve official SVG logo asset |
| 18 | **Picxel IT** | Hardware | No | Unconfirmed | Unapproved | Missing | No | No | No | None | Confirm relationship & scope |
| 19 | **Bargain Hardware** | Hardware | No | Unconfirmed | Unapproved | Missing | No | No | No | None | Confirm relationship & scope |
| 20 | **Bytestock** | Hardware | No | Unconfirmed | Unapproved | Missing | No | No | No | None | Confirm relationship & scope |
| 21 | **Ynvolve** | Hardware | No | Unconfirmed | Unapproved | Missing | No | No | No | None | Confirm relationship & scope |

---

## Marquee Dynamic Expansion Logic

The homepage ecosystem ribbon and `/partners` directory pull dynamically from `getCollection('partners')`.
To promote any candidate from the owner inventory into the live marquee:
1. Create `src/content/partners/[slug].md`.
2. Set `relationshipConfirmed: true`.
3. Set `publicNameApproved: true`.
4. Set `homepageMarqueeEnabled: true`.
5. Provide official SVG asset in `public/images/partners/[slug].svg` and set `logoStatus: 'approved'`, `logoApproved: true` (or leave `logoApproved: false` to render the restrained carrier-grade typographic mark).
