import { defineCollection, z } from 'astro:content';

const offers = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    shortDescription: z.string(),
    category: z.enum(['hardware', 'infrastructure', 'cloud', 'connectivity', 'security']),
    location: z.string(),
    partner: z.string().optional(),
    verifiedPrice: z.string(),
    specifications: z.array(z.string()),
    status: z.enum(['draft', 'review', 'active', 'expired', 'archived']).default('active'),
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
    logo: z.string(),
    category: z.enum([
      'Infrastructure & Cloud',
      'Network & Connectivity',
      'Security',
      'Managed Operations',
      'Virtualization',
      'Hardware'
    ]),
    tagline: z.string(),
    capabilities: z.array(z.string()),
    strategic: z.boolean().default(false),
    verified: z.boolean().default(true)
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
