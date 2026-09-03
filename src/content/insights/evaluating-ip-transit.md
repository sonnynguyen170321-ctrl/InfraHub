---
title: "Evaluating IP Transit: 95th Percentile vs Fixed Commit Economics"
category: "Networks"
readTime: "6 min read"
publishDate: 2026-08-01
author: "InfraHub Network Architecture Team"
summary: "How 95th percentile billing calculations work in practice, when to commit to higher CIR rates, and how inbound-heavy profiles affect wholesale transit pricing."
featured: false
---

## Understanding 95th Percentile Billing

In wholesale IP transit contracts, bandwidth consumption is rarely billed on total gigabytes transferred. Instead, carriers utilize the **95th percentile rule** (burstable billing) sampled at 5-minute intervals throughout the monthly billing cycle.

### The Mathematical Formula

1. Every 5 minutes, your edge router measures inbound and outbound megabits per second.
2. In a 30-day billing month, this generates 8,640 discrete measurement samples.
3. For each 5-minute interval, the carrier selects the higher of the inbound or outbound measurement.
4. All 8,640 samples are sorted from highest to lowest.
5. The top 5% (approximately 432 samples, representing roughly 36 hours of peak usage) are completely discarded.
6. The 95th highest sample becomes your billable bandwidth rate.

### Committed Data Rate (CDR) vs Bursting

Carriers require a **Committed Data Rate (CDR)** — a baseline contractual commit (e.g., 20 Gbps on a 100 Gbps physical port). If your 95th percentile calculation is below 20 Gbps, you pay the minimum commit fee. If your 95th percentile reaches 35 Gbps, you pay the commit fee plus 15 Gbps of burst at the agreed burst rate.

### Key Traffic Profiling Considerations

- **Asymmetric Traffic (Inbound vs Outbound):** CDNs and streaming services push heavy outbound traffic. Eyeball ISPs pull heavy inbound traffic. Because 95th percentile only bills the higher direction, outbound-heavy networks pay nothing extra for inbound traffic up to the outbound level.
- **Port Saturation Risks:** Never run a commit rate above 70% of port capacity without planning an upgrade to the next physical interface (e.g., 10G to 40G/100G) to prevent packet drops during volumetric DDoS attacks.
