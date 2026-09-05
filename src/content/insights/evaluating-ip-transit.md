---
title: "Evaluating IP Transit: 95th Percentile vs Fixed Commit Economics"
category: "Networks"
readTime: "7 min read"
publishDate: 2026-08-01
author: "InfraHub"
summary: "How 95th-percentile transit billing works, what port and commit mean, and which traffic and contract details should be compared before selecting an IP Transit service."
featured: false
---

## 95th Percentile Is a Billing Method, Not a Port Speed

Many IP Transit contracts use 95th-percentile billing for burstable traffic. A common implementation samples bandwidth at regular intervals, sorts the measurements, discards the highest five percent, and uses the next measurement as the billable percentile.

The contract still matters. Sampling interval, inbound/outbound treatment, minimum commit, burst pricing, and what happens above commit can differ by carrier.

### A 30-Day, Five-Minute Example

If a service samples every five minutes for exactly 30 days, it produces:

- 12 samples per hour
- 288 samples per day
- 8,640 samples in 30 days

Five percent of 8,640 is 432. If the samples are sorted from highest to lowest, the first 432 are excluded and the **next sample** is the 95th-percentile measurement.

That example explains the arithmetic. It is not a substitute for the billing language in the provider's contract.

## Port vs Commit

These are separate decisions.

**Port speed** is the physical or logical interface ceiling.

**Committed data rate** is the contractual bandwidth level that normally establishes the minimum recurring charge.

For example, a buyer might evaluate a 100 Gbps port with a 20 Gbps commit. If the contract permits bursting, usage can rise above the commit until another contractual or physical limit is reached. How that excess is charged depends on the service terms.

The cheapest price per committed Mbps can therefore be misleading if the port, burst rate, cross-connect, routing quality, support, or traffic profile differs.

## Inbound and Outbound Treatment

Do not assume every carrier measures directions identically.

Possible models include:

- billing against the higher of inbound or outbound percentile;
- separate directional calculations;
- other provider-specific methods.

For an outbound-heavy CDN or an inbound-heavy access network, that distinction can materially change the bill.

## What to Compare

Before comparing two transit quotes, put these items side by side:

- physical or logical port speed;
- minimum commit;
- percentile/sampling method;
- burst pricing;
- inbound/outbound treatment;
- cross-connect and installation charges;
- contract term;
- routing policy and communities;
- default route versus full-table requirements;
- DDoS and RTBH/FlowSpec options;
- local peering and upstream mix;
- support and escalation model.

A large port with a small commit can create useful burst headroom, but there is no universal “safe” commit-to-port percentage. Capacity planning should follow the customer's real traffic distribution, growth, redundancy model, and failure scenarios.

## The Commercial Question

The useful comparison is rarely:

> Which provider has the lowest headline price per Mbps?

It is closer to:

> What will this service cost for our actual traffic pattern, and what routing, resilience, support, and interconnection characteristics are included?

That is the level at which two apparently similar transit offers start to look different.
