import { defineCollection, z } from 'astro:content';

const offers = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    shortDescription: z.string(),
    category: z.enum(['hardware', 'infrastructure', 'cloud', 'connectivity', 'security']),
    location: z.string(),
    partner: z.string().optional(),
    displayPrice: z.string().optional(),
    verifiedPrice: z.string().optional(), // backward compatibility alias
    priceStatus: z.enum(['unverified', 'indicative', 'confirmed_allocation', 'partner_quote']).default('indicative'),
    priceSourceRef: z.string().optional(),
    specifications: z.array(z.string()),
    status: z.enum(['draft', 'review', 'active', 'expired', 'archived']).default('active'),
    publicApproved: z.boolean().default(false),
    featured: z.boolean().default(false),
    publishedDate: z.date(),
    expiryDate: z.date().optional(),
    campaignTag: z.string().optional()
  })
});

const partners = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    officialWebsite: z.string().url(),
    sourceUrls: z.array(z.string().url()).default([]),
    logo: z.string().optional(),
    logoDark: z.string().optional(),
    logoLight: z.string().optional(),
    logoScale: z.number().default(1),
    category: z.enum([
      'Infrastructure & Cloud',
      'Network & Connectivity',
      'Security',
      'Managed Operations',
      'Virtualization',
      'AI & Transformation',
      'Hardware'
    ]),
    tagline: z.string(),
    shortRole: z.string().optional(),
    capabilities: z.array(z.string()),
    
    // Business Verification & Approval States (Separated from Publication)
    relationshipStatus: z.enum(['unconfirmed', 'confirmed']).default('unconfirmed'),
    publicNamingStatus: z.enum(['unapproved', 'approved']).default('unapproved'),
    logoStatus: z.enum(['missing', 'sourced', 'approved']).default('missing'),
    capabilityClaimsStatus: z.enum(['unverified', 'sourced', 'approved']).default('unverified'),
    strategicStatus: z.enum(['none', 'candidate', 'approved']).default('none'),
    homepageStatus: z.enum(['hidden', 'approved']).default('hidden'),
    
    // Publication Control Gates (Fail-Closed Default = FALSE)
    relationshipConfirmed: z.boolean().default(false),
    publicNameApproved: z.boolean().default(false),
    logoApproved: z.boolean().default(false),
    homepageMarqueeEnabled: z.boolean().default(false),
    homepagePriority: z.number().default(10),
    partnerPageEnabled: z.boolean().default(false),
    strategic: z.boolean().default(false),
    verified: z.boolean().default(false)
  })
});

const solutions = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.enum([
      'infrastructure',
      'cloud-virtualization',
      'network-connectivity',
      'security',
      'managed-services'
    ]),
    commercialMode: z.enum(['Direct Hardware', 'Partner Delivered', 'Advisory']),
    shortDescription: z.string(),
    featuredImage: z.string().optional(),
    keyHighlights: z.array(z.string()),
    relevantPartners: z.array(z.string()).optional()
  })
});

const insights = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.enum(['Networks', 'Infrastructure', 'Cloud', 'Security']),
    readTime: z.string(),
    publishDate: z.date(),
    author: z.string().default('InfraHub Architecture Team'),
    summary: z.string(),
    featured: z.boolean().default(false)
  })
});

export const collections = {
  offers,
  partners,
  solutions,
  insights
};
