---
title: "Always-On vs On-Demand DDoS Protection: Architecture Comparison"
category: "Security"
readTime: "8 min read"
publishDate: 2026-08-10
author: "InfraHub"
summary: "A practical comparison of always-on protection and telemetry-triggered diversion, including routing, latency, operational control, and failure-mode trade-offs."
featured: false
---

## Start With the Traffic Path

The useful distinction between always-on and on-demand DDoS protection is not simply “more protection” versus “less protection.” It is **where traffic normally flows, what has to change during an attack, and who owns the mitigation decision**.

Provider implementations differ, so the exact routing method, detection model, return path, support process, and commercial structure should be confirmed for the service being considered.

### Always-On Protection

In a common always-on design, protected traffic is continuously steered through the mitigation provider or its application edge. The provider filters malicious traffic before legitimate traffic reaches the origin.

**Where it can fit**

- Services with very little tolerance for a diversion or routing change after an attack begins.
- Environments that prefer the mitigation provider to remain continuously in the traffic path.
- Application-protection designs where proxying or edge security is already part of normal delivery.

**What to check**

- How traffic is attracted and returned.
- Whether the design changes routing, MTU, source visibility, TLS termination, or application behavior.
- The clean-traffic capacity and connectivity between the protection service and the origin.
- What happens if the mitigation path itself becomes unavailable.

Always-on does not automatically mean “zero latency impact” or “instant mitigation.” The effect depends on topology, provider presence, routing, and the protection layer involved.

### On-Demand Diversion

In an on-demand design, traffic normally follows the customer's usual network path. Detection systems or operators trigger a routing or service change when mitigation is required.

A network-layer implementation may use BGP announcements, communities, FlowSpec, RTBH, or diversion toward a scrubbing provider. The exact mechanism depends on the network and provider.

**Where it can fit**

- Operators that want the normal traffic path to remain direct when no mitigation event is active.
- Networks that already operate routing policy and telemetry.
- Designs where the buyer wants separate detection/control and mitigation layers.

**What to check**

- How an attack is detected.
- Who is authorized to trigger diversion.
- How quickly the relevant routing change is expected to propagate in the actual network.
- What prefixes can be diverted and how route ownership is validated.
- How traffic returns from the mitigation service.
- How the design is tested before a real incident.

There is no universal convergence time. Propagation depends on the routing design, provider, peers, prefix policy, and the mechanism used.

## The Better Question

Instead of asking which model is “best,” establish:

1. **Normal traffic path** — where does legitimate traffic flow before an incident?
2. **Detection ownership** — customer, specialist platform, protection provider, or a combination?
3. **Mitigation control** — who can change routing or filtering policy?
4. **Failure tolerance** — how much disruption can the application tolerate during activation?
5. **Operational capability** — does the buyer want to operate BGP and mitigation policy internally?
6. **Commercial model** — what is charged continuously and what changes during an attack?

The answer can also be hybrid: local telemetry and routing controls can coexist with an external mitigation provider. The architecture should follow the traffic, operational responsibilities, and failure modes rather than a label.
