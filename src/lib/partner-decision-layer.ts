// src/lib/partner-decision-layer.ts
//
// The shape of a partner's decision layer, plus the neutral fallback used when a record has
// not been populated yet.
//
// The partner-specific text lives in each record's front matter, not in the page template.
// Hundreds of lines of partner facts embedded in [slug].astro drift away from the collection
// they describe, and nothing checks them; in content they sit next to the sourceUrls that
// support them and are reachable by the content audits.

export interface DecisionLayerStep {
  num: string;
  title: string;
  desc: string;
}

export interface PartnerDecisionLayer {
  architectureTitle: string;
  architectureSubtitle: string;
  steps: DecisionLayerStep[];
  decisionQuestions: string[];
  whenFits: string;
  whenAlternative: string;
  commercialCaution: string;
  sourceRefs?: string[];
}

/**
 * Provider-neutral guidance. It states only what is true of evaluating any provider, so a
 * record without a populated decision layer still renders something defensible.
 */
export function fallbackDecisionLayer(partnerName: string): PartnerDecisionLayer {
  return {
    architectureTitle: 'Technical Fit & Operating Model',
    architectureSubtitle: `How to evaluate ${partnerName} against the requirement`,
    steps: [
      { num: '01', title: 'Requirement', desc: 'Clarify the technical and operational requirement before comparing providers.' },
      { num: '02', title: 'Capability Fit', desc: "Compare the provider's published capabilities with the actual workload and constraints." },
      { num: '03', title: 'Commercial Terms', desc: 'Confirm provider-specific pricing, support, service commitments, and contract terms.' },
      { num: '04', title: 'Delivery', desc: 'Define implementation, handoff, and ongoing operational responsibilities before contracting.' }
    ],
    decisionQuestions: [
      'What technical constraints must the provider satisfy?',
      'Which support, service, and commercial terms materially affect the decision?',
      'What responsibilities remain with your team after implementation?'
    ],
    whenFits: "Requirements that align with the provider's published capability scope and operating model.",
    whenAlternative: 'Another approach may fit better when the workload, geography, operating model, or commercial constraints point elsewhere.',
    commercialCaution: 'Confirm provider-specific commercial and service terms before contracting.',
    sourceRefs: []
  };
}
