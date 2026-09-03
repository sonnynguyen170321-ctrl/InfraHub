---
title: "Why Two 'Diverse' Network Circuits May Not Actually Be Physically Diverse"
category: "Networks"
readTime: "7 min read"
publishDate: 2026-07-25
author: "InfraHub Network Architecture Team"
summary: "Carriers often sell path diversity at the contract level while leasing dark fiber inside the exact same municipal trench, bridge conduit, or rail crossing."
featured: true
---

## The Illusion of Carrier Diversity

When designing high-availability network architectures between critical datacenter facilities, network engineers frequently procure circuits from two distinct telecom carriers. The assumption is straightforward: if Carrier A suffers a fiber cut, Carrier B will maintain connectivity.

In practice, this assumption frequently fails. A single construction backhoe or civil engineering disruption severs both "redundant" links simultaneously.

### The Underlying Economics of Fiber Trenches

Digging physical trenches in metropolitan streets is cost-prohibitive. Obtaining municipal right-of-way permits, trenching through asphalt, and laying conduit can exceed €150,000 to €300,000 per kilometer in dense European cities like Frankfurt, London, or Paris.

Consequently, telecom carriers routinely lease dark fiber strands from municipal utility providers, transit authorities, or regional infrastructure syndicates. 

Even when Carrier A and Carrier B operate completely independent Autonomous Systems (ASNs) and maintain separate billing organizations, their optical signals may travel through adjacent fiber strands inside the exact same PVC conduit pipe.

### Common Single Points of Failure

1. **Bridges and River Crossings:** In river-bounded cities, optical cables must cross via existing bridges. Multiple carriers invariably lease conduit space on the same structural crossing.
2. **Railway Right-of-Ways:** Long-haul fiber routes predominantly follow railway tracks. A derailment or track maintenance often severs multiple carrier routes.
3. **Datacenter Zero Manholes:** Even if long-haul routes are completely separate, both carriers often enter the datacenter through the same physical street vault or building penetration point.

### How to Verify Genuine Physical Diversity

To ensure true physical separation, technical buyers should never rely on sales assurances. Demand:

- **KMZ / GIS Route Traces:** Require raw GIS mapping files illustrating the physical cable path down to street-level coordinates.
- **Minimum 500-Meter Separation:** Verify that the primary and secondary routes do not converge within 500 meters of each other outside the datacenter perimeter.
- **Dual Manhole Verification:** Confirm that each carrier enters the facility through distinct meet-me-room (MMR) entry conduits.

InfraHub audits KMZ fiber paths and facility entrance schematics before recommending redundant transport circuits.
