export interface IndustryEvaluation {
  id: string;
  name: string;
  summary: string;
  url: string;
  kicker: string;
  challenge: string;
  solution: string;
  metrics: Array<{ label: string; value: string }>;
}

export const industries: IndustryEvaluation[] = [
  {
    id: 'isps',
    name: 'ISPs & Network Operators',
    summary: 'Transit, optical connectivity, routing and DDoS requirements.',
    url: '/industries/isps-network-operators',
    kicker: 'Carrier Peering & DDoS Filtering',
    challenge: 'Dependence on a small number of upstreams can concentrate routing, mitigation, and physical-path risk.',
    solution: 'Compare upstream diversity, BGP policy, mitigation handoff, and physical route evidence before choosing a provider.',
    metrics: [
      { label: 'Carrier path evidence', value: 'Entrance, duct, and facility route' },
      { label: 'Routing policy', value: 'BGP controls and communities' },
      { label: 'Mitigation handoff', value: 'Diversion and escalation workflow' }
    ]
  },
  {
    id: 'hosting',
    name: 'Hosting & Cloud Providers',
    summary: 'Compute, colocation, IPv4 and network capacity.',
    url: '/industries/hosting-cloud-providers',
    kicker: 'Virtualization Economics & Sourcing',
    challenge: 'Licensing changes, hardware lead times, and address capacity can shift the economics of a hosting platform.',
    solution: 'Compare platform migration, hardware lifecycle, facility fit, and address requirements together.',
    metrics: [
      { label: 'Platform migration', value: 'Workload and compatibility plan' },
      { label: 'Address policy', value: 'Allocation and routing requirements' },
      { label: 'Hardware lifecycle', value: 'Lead time, support, and replacement' }
    ]
  },
  {
    id: 'saas',
    name: 'SaaS & Technology',
    summary: 'Regional connectivity, cloud economics and private infrastructure.',
    url: '/industries/saas-technology',
    kicker: 'Edge Latency & Cloud Repatriation',
    challenge: 'Egress charges and regional latency variance can change the right balance between public and private infrastructure.',
    solution: 'Compare workload placement, interconnection, latency objectives, and egress economics by region.',
    metrics: [
      { label: 'Egress model', value: 'Traffic volume and destination' },
      { label: 'Latency objective', value: 'Application and user-region needs' },
      { label: 'Interconnection', value: 'Public, private, and hybrid paths' }
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    summary: 'Private cloud, connectivity, hardware and managed operations.',
    url: '/industries/enterprise',
    kicker: 'Physical Redundancy & Cutover Integrity',
    challenge: 'Separate carrier contracts can still share physical dependencies, while cutovers depend on clear operational ownership.',
    solution: 'Compare route evidence, escalation ownership, and cutover prerequisites before treating a design as resilient.',
    metrics: [
      { label: 'Building entry', value: 'Independent entrance evidence' },
      { label: 'Escalation path', value: 'Provider and customer ownership' },
      { label: 'Cutover plan', value: 'Dependencies and recovery steps' }
    ]
  }
];
