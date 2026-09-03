---
title: "Always-On vs On-Demand DDoS Protection: Architecture Comparison"
category: "Security"
readTime: "8 min read"
publishDate: 2026-08-10
author: "InfraHub Security Architecture Team"
summary: "Comparing the trade-offs of continuous BGP diversion GRE tunnels against on-demand RTBH/FlowSpec activation during high-volume volumetric attacks."
featured: false
---

## The Core Trade-Off: Latency vs Protection Speed

When engineering DDoS protection for an Autonomous System (ASN), network architects face a fundamental choice between **Always-On Cloud Scrubbing** and **On-Demand BGP Diversion**.

### 1. Always-On BGP Diversion

Under this model, your public IP prefixes are permanently announced from a global scrubbing center network. Clean traffic is routed back to your origin routers via GRE tunnels or private cross-connects.

- **Advantage:** Zero delay in mitigating volumetric attacks. Malicious packets are filtered out immediately.
- **Disadvantage:** Adds permanent latency (typically 5ms to 25ms depending on scrubbing PoP proximity) and introduces potential MTU fragmentation over GRE tunnels.
- **Best For:** Financial trading platforms, gaming servers, and VoIP providers where even a 30-second disruption breaks user sessions.

### 2. On-Demand Mitigation (Telemetry-Triggered)

Under peace-time conditions, traffic flows directly to your origin edge routers without passing through a third-party scrubbing network. When out-of-band flow telemetry (such as FastNetMon) detects an attack threshold breach, BGP routes are dynamically announced to the scrubbing provider.

- **Advantage:** Lowest possible latency and pristine route quality during peace time. Eliminates high continuous scrubbing port charges.
- **Disadvantage:** BGP convergence delay. It takes between 30 and 120 seconds for upstream global carriers to propagate the new BGP route to the scrubbing center.
- **Best For:** Enterprise SaaS, hosting platforms, and corporate networks where 60 seconds of degraded latency is acceptable in exchange for lower operational costs.
