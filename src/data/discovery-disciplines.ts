// src/data/discovery-disciplines.ts
// Authoritative definitions for InfraHub Homepage Act 2 Infrastructure Lens

export interface ServiceRoute {
  name: string;
  url: string;
  desc: string;
  minCapacity?: '10G' | '100G' | '400G';
}

export interface CapacityTier {
  id: '10G' | '100G' | '400G';
  label: string;
  routeWeight: number; // stroke width in px (1.5, 2.5, 3.5)
  trafficDesc: string;
  architectureConstraint: string;
}

export interface DisciplineDefinition {
  id: 'network' | 'compute' | 'cloud' | 'security' | 'operations';
  number: string;
  label: string;
  sublabel: string;
  headline: string;
  technicalExplanation: string;
  whatChangesTitle: string;
  whatChangesObservation: string;
  serviceRoutes: ServiceRoute[];
  capacityTiers: CapacityTier[];
  imageAlt: string;
  imageCaption: string;
  primaryCta: {
    label: string;
    url: string;
  };
  briefServiceParam: string;
  svgPathAnchor: {
    entryPoint: [number, number]; // [x, y] in viewBox 0 0 800 500
    controlPoints: [number, number][];
    exitPoint: [number, number];
  };
}

export const DISCIPLINARY_DATA: Record<string, DisciplineDefinition> = {
  network: {
    id: 'network',
    number: '01',
    label: 'Network',
    sublabel: 'Transit & optical',
    headline: 'Move data reliably between users, facilities and clouds.',
    technicalExplanation: 'Transit and wavelengths are easy to list. Presence, path quality, committed data rate, and physical diversity are what shape the architecture.',
    whatChangesTitle: 'WHAT CHANGES THE ANSWER',
    whatChangesObservation: 'Physical presence, route quality, traffic commitment, capacity and physical path diversity requirements.',
    serviceRoutes: [
      { name: 'IP Transit', url: '/ip-transit', desc: 'Upstream multi-homed Tier-1 BGP transit with deterministic routing.', minCapacity: '10G' },
      { name: 'Dedicated Wavelengths', url: '/wavelengths', desc: 'Point-to-point unmetered optical waves with sub-millisecond latency.', minCapacity: '100G' },
      { name: 'Layer 2 Connectivity', url: '/solutions/network-connectivity', desc: 'Private deterministic Ethernet bridging between data centers.', minCapacity: '10G' },
      { name: 'Cloud Interconnects', url: '/solutions/network-connectivity', desc: 'Dedicated private cross-connects into AWS, GCP, and Azure fabrics.', minCapacity: '10G' }
    ],
    capacityTiers: [
      {
        id: '10G',
        label: '10G Commit',
        routeWeight: 1.5,
        trafficDesc: 'Standard production peering & multi-homed BGP transit.',
        architectureConstraint: 'Single or redundant 10G optical cross-connects with regional route optimization.'
      },
      {
        id: '100G',
        label: '100G Backbone',
        routeWeight: 2.5,
        trafficDesc: 'Heavy metro interconnect, cloud exchange & wholesale transport.',
        architectureConstraint: 'Physical fiber conduit separation and diverse carrier MMR entrances mandatory.'
      },
      {
        id: '400G',
        label: '400G Core',
        routeWeight: 3.5,
        trafficDesc: 'Hyper-scale data replication, AI cluster fabric & regional transit core.',
        architectureConstraint: 'QSFP-DD coherent optical transceivers with dedicated sub-duct paths.'
      }
    ],
    imageAlt: 'High-density optical fiber cross-connect patch panels and carrier routing frame',
    imageCaption: 'Optical transport & carrier routing frame',
    primaryCta: {
      label: 'Explore Network',
      url: '/solutions/network-connectivity'
    },
    briefServiceParam: 'connectivity',
    svgPathAnchor: {
      entryPoint: [40, 240],
      controlPoints: [[220, 240], [380, 200], [540, 260]],
      exitPoint: [760, 220]
    }
  },
  compute: {
    id: 'compute',
    number: '02',
    label: 'Compute',
    sublabel: 'Hardware & facilities',
    headline: 'High-density bare-metal, accelerator fabrics, and colocation.',
    technicalExplanation: 'Chassis availability is only the starting point. Power density, thermal dissipation, hardware lifecycle, and facility interconnect dictate real uptime.',
    whatChangesTitle: 'WHAT CHANGES THE ANSWER',
    whatChangesObservation: 'Power availability per rack, GPU thermal envelopes, hardware lead times, and facility tier certifications.',
    serviceRoutes: [
      { name: 'Dedicated Bare Metal', url: '/dedicated-servers', desc: 'Single-tenant physical servers configured for high-concurrency workloads.', minCapacity: '10G' },
      { name: 'GPU & AI Fabrics', url: '/gpu-ai-infrastructure', desc: 'High-density accelerator clusters with InfiniBand or RoCE interconnects.', minCapacity: '100G' },
      { name: 'Colocation Cages', url: '/colocation', desc: 'Private secure rack space with dual redundant A+B utility power feeds.', minCapacity: '10G' },
      { name: 'Enterprise Sourcing', url: '/enterprise-hardware', desc: 'Custom server chassis, optics, and switching procured to specification.', minCapacity: '10G' }
    ],
    capacityTiers: [
      {
        id: '10G',
        label: '10G Uplink',
        routeWeight: 1.5,
        trafficDesc: 'Standard enterprise compute nodes and virtualization clusters.',
        architectureConstraint: 'Dual Top-of-Rack LACP bonded uplinks with redundant power supplies.'
      },
      {
        id: '100G',
        label: '100G Fabric',
        routeWeight: 2.5,
        trafficDesc: 'Storage cluster replication and high-throughput database tiers.',
        architectureConstraint: 'Non-blocking leaf-spine network architecture with RoCEv2 support.'
      },
      {
        id: '400G',
        label: '400G Interconnect',
        routeWeight: 3.5,
        trafficDesc: 'Distributed AI model training and GPU memory pool synchronization.',
        architectureConstraint: 'High-density liquid-cooled rack distribution requiring 30kW+ per cabinet.'
      }
    ],
    imageAlt: 'High-density server rack corridor in carrier-neutral facility with structured overhead busways',
    imageCaption: 'Tier-3 datacenter compute corridor',
    primaryCta: {
      label: 'Explore Compute',
      url: '/solutions/infrastructure'
    },
    briefServiceParam: 'compute',
    svgPathAnchor: {
      entryPoint: [40, 180],
      controlPoints: [[200, 180], [360, 310], [560, 210]],
      exitPoint: [760, 240]
    }
  },
  cloud: {
    id: 'cloud',
    number: '03',
    label: 'Cloud',
    sublabel: 'Virtualization & data location',
    headline: 'Sovereign private hypervisors and predictable cloud economics.',
    technicalExplanation: 'Public cloud scale often introduces runaway egress fees and opaque hypervisors. Sovereign private clusters restore cost control and data jurisdiction.',
    whatChangesTitle: 'WHAT CHANGES THE ANSWER',
    whatChangesObservation: 'Workload predictability, licensing portability (e.g. VMware exit), data sovereignty, and egress volumes.',
    serviceRoutes: [
      { name: 'Private Cloud Virtualization', url: '/private-cloud', desc: 'Dedicated hypervisor clusters with zero noisy neighbors and flat economics.', minCapacity: '10G' },
      { name: 'VMware Migration Architecture', url: '/vmware-alternatives', desc: 'Seamless migration paths to open hypervisors (Proxmox VE & XCP-ng / Vates).', minCapacity: '10G' },
      { name: 'Direct Hyperscaler Links', url: '/solutions/cloud-virtualization', desc: 'Bypass public internet to route hybrid workloads directly into AWS or Azure.', minCapacity: '100G' },
      { name: 'Off-site Disaster Recovery', url: '/solutions/cloud-virtualization', desc: 'Continuous block-level replication to an independent physical failure zone.', minCapacity: '10G' }
    ],
    capacityTiers: [
      {
        id: '10G',
        label: '10G Fabric',
        routeWeight: 1.5,
        trafficDesc: 'Standard virtual machine traffic and scheduled off-peak backups.',
        architectureConstraint: 'Virtual switch isolation with VLAN tagging and automated failover routing.'
      },
      {
        id: '100G',
        label: '100G Mesh',
        routeWeight: 2.5,
        trafficDesc: 'Synchronous Ceph/SAN storage replication and low-latency VM migration.',
        architectureConstraint: 'Dedicated storage backplane isolated from public egress interfaces.'
      },
      {
        id: '400G',
        label: '400G Core',
        routeWeight: 3.5,
        trafficDesc: 'Multi-region sovereign cloud synchronization and high-volume data ingest.',
        architectureConstraint: 'BGP EVPN VXLAN overlay fabric running across diverse physical transit paths.'
      }
    ],
    imageAlt: 'Clustered private cloud enterprise servers with redundant fiber backplane',
    imageCaption: 'Sovereign private cloud compute cluster',
    primaryCta: {
      label: 'Explore Cloud',
      url: '/solutions/cloud-virtualization'
    },
    briefServiceParam: 'cloud',
    svgPathAnchor: {
      entryPoint: [40, 280],
      controlPoints: [[240, 280], [420, 160], [580, 270]],
      exitPoint: [760, 190]
    }
  },
  security: {
    id: 'security',
    number: '04',
    label: 'Security',
    sublabel: 'Mitigation & routing defence',
    headline: 'Multi-Tbps volumetric scrubbing and edge routing defence.',
    technicalExplanation: 'Attacks strike unexpected interfaces. Automated BGP diversion, anycast edge scrubbing, and route-leak prevention protect critical applications.',
    whatChangesTitle: 'WHAT CHANGES THE ANSWER',
    whatChangesObservation: 'Peak attack volume, diversion latency requirements, SSL inspection needs, and clean-traffic backhaul routes.',
    serviceRoutes: [
      { name: 'DDoS Volumetric Scrubbing', url: '/solutions/security', desc: 'Anycast scrubbing centers filtering Layer 3/4 flood vectors before uplink saturation.', minCapacity: '10G' },
      { name: 'BGP FlowSpec Automation', url: '/solutions/security', desc: 'Sub-second edge diversion rules injected directly into upstream carrier routers.', minCapacity: '10G' },
      { name: 'Route Leak Intelligence', url: '/solutions/security', desc: 'Real-time RPKI validation and autonomous system route-hijack monitoring.', minCapacity: '10G' },
      { name: 'Edge Perimeter Defense', url: '/solutions/security', desc: 'Layer 7 application firewalls and rate-limiting at nearest metropolitan PoPs.', minCapacity: '100G' }
    ],
    capacityTiers: [
      {
        id: '10G',
        label: '10G Protected',
        routeWeight: 1.5,
        trafficDesc: 'Continuous inline scrubbing for mission-critical web APIs and enterprise portals.',
        architectureConstraint: 'GRE tunnel backhaul with automated threshold-based traffic diversion.'
      },
      {
        id: '100G',
        label: '100G Scrubbing',
        routeWeight: 2.5,
        trafficDesc: 'Multi-hundred Gigabit volumetric attack mitigation for gaming and fintech hosts.',
        architectureConstraint: 'Direct BGP peering with scrubbing nodes over dedicated physical cross-connects.'
      },
      {
        id: '400G',
        label: '400G Defense',
        routeWeight: 3.5,
        trafficDesc: 'Terabit-scale distributed denial-of-service mitigation for carrier networks.',
        architectureConstraint: 'Hardware-accelerated edge filtering chips with zero-latency symmetric clean return.'
      }
    ],
    imageAlt: 'Network edge routing protection console and packet filtering hardware',
    imageCaption: 'Edge security scrubbing & defensive routing fabric',
    primaryCta: {
      label: 'Explore Security',
      url: '/solutions/security'
    },
    briefServiceParam: 'security',
    svgPathAnchor: {
      entryPoint: [40, 210],
      controlPoints: [[220, 210], [390, 320], [550, 180]],
      exitPoint: [760, 260]
    }
  },
  operations: {
    id: 'operations',
    number: '05',
    label: 'Operations',
    sublabel: 'Engineering & lifecycle',
    headline: '24/7 technical operations and automated lifecycle support.',
    technicalExplanation: 'Hardware fails and routes degrade. Proactive NOC telemetry, automated ticket escalation, and principal engineer oversight protect SLAs.',
    whatChangesTitle: 'WHAT CHANGES THE ANSWER',
    whatChangesObservation: 'Escalation response tiers, multi-vendor support scope, configuration change management, and engineering coverage.',
    serviceRoutes: [
      { name: '24/7 Managed NOC', url: '/solutions/managed-services', desc: 'Continuous proactive monitoring with guaranteed 15-minute engineer response.', minCapacity: '10G' },
      { name: 'Network Engineering', url: '/solutions/managed-services', desc: 'Senior carrier architects handling BGP optimization, peering, and troubleshooting.', minCapacity: '10G' },
      { name: 'Telemetry & Triage', url: '/solutions/managed-services', desc: 'Deep SNMP, telemetry, and NetFlow monitoring with automated alert filtering.', minCapacity: '10G' },
      { name: 'Migration Execution', url: '/solutions/managed-services', desc: 'Turnkey data migration and zero-downtime cutovers across facility borders.', minCapacity: '100G' }
    ],
    capacityTiers: [
      {
        id: '10G',
        label: 'Standard SLA',
        routeWeight: 1.5,
        trafficDesc: 'Business-hours monitoring and standard engineering ticket escalation.',
        architectureConstraint: 'Webhook telemetry integration with automated incident notifications.'
      },
      {
        id: '100G',
        label: 'Priority SLA',
        routeWeight: 2.5,
        trafficDesc: '24/7/365 active NOC with 15-minute first-response guarantees.',
        architectureConstraint: 'Direct escalation hotline to Level 3 network and systems engineers.'
      },
      {
        id: '400G',
        label: 'Mission Critical',
        routeWeight: 3.5,
        trafficDesc: 'Continuous real-time traffic policing and dedicated standby engineering squad.',
        architectureConstraint: 'Bespoke runbooks, proactive BGP traffic re-routing, and monthly architecture review.'
      }
    ],
    imageAlt: 'Serious network operations center engineering desk with topology monitors',
    imageCaption: '24/7 network operations center & engineering desk',
    primaryCta: {
      label: 'Explore Operations',
      url: '/solutions/managed-services'
    },
    briefServiceParam: 'operations',
    svgPathAnchor: {
      entryPoint: [40, 260],
      controlPoints: [[210, 260], [380, 190], [570, 280]],
      exitPoint: [760, 210]
    }
  }
};

export const DISCIPLINE_KEYS = ['network', 'compute', 'cloud', 'security', 'operations'] as const;
