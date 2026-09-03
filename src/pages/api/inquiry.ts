import type { APIRoute } from 'astro';
import { z } from 'zod';

export const prerender = false;

const InquiryPayloadSchema = z.object({
  lookingFor: z.enum([
    'hardware',
    'dedicated-infrastructure',
    'cloud',
    'connectivity',
    'ddos-security',
    'cybersecurity',
    'managed-services',
    'ipv4',
    'other'
  ]),
  targetLocation: z.string().max(120).optional(),
  requirementsDescription: z.string().min(10, "Requirement description must be at least 10 characters.").max(3000),
  timeline: z.enum(['immediate', 'under-30-days', '1-3-months', '3-plus-months', 'researching']),
  contactName: z.string().min(2, "Name is required.").max(100),
  companyName: z.string().min(2, "Company name is required.").max(100),
  workEmail: z.string().email("Valid work email is required."),
  phone: z.string().max(40).optional(),
  sourcePage: z.string().optional(),
  serviceParam: z.string().optional(),
  partnerParam: z.string().optional(),
  offerSlug: z.string().optional(),
  utmSource: z.string().optional(),
  utmCampaign: z.string().optional(),
  website_trap_field: z.string().optional()
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const rawBody = await request.json();

    // 1. Honeypot check
    if (rawBody.website_trap_field) {
      // Silently accept bots without processing
      return new Response(JSON.stringify({ success: true, leadId: "INQ-BOT-TRAPPED" }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Validate payload schema
    const validation = InquiryPayloadSchema.safeParse(rawBody);
    if (!validation.success) {
      const issue = validation.error.issues[0]?.message || 'Invalid form payload.';
      return new Response(JSON.stringify({ success: false, message: issue }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = validation.data;

    // 3. Generate structured Lead ID
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const leadId = `INQ-${dateStr}-${randomSuffix}`;

    // 4. Construct Lead Record
    const leadRecord = {
      leadId,
      receivedAt: new Date().toISOString(),
      lookingFor: data.lookingFor,
      location: data.targetLocation || 'Not specified',
      timeline: data.timeline,
      description: data.requirementsDescription,
      contact: {
        name: data.contactName,
        company: data.companyName,
        email: data.workEmail,
        phone: data.phone || 'N/A'
      },
      attribution: {
        sourcePage: data.sourcePage || '/lets-talk',
        serviceParam: data.serviceParam,
        partnerParam: data.partnerParam,
        offerSlug: data.offerSlug,
        utmSource: data.utmSource,
        utmCampaign: data.utmCampaign
      }
    };

    // 5. Downstream Dispatching (Webhook / Logger)
    console.log(`[INQUIRY_RECEIVED] Lead ID: ${leadId}`, JSON.stringify(leadRecord, null, 2));

    // Optional webhook dispatch if configured
    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadRecord)
        });
      } catch (webhookErr) {
        console.error(`[LEAD_WEBHOOK_ERROR] Failed forwarding lead ${leadId}`, webhookErr);
      }
    }

    // 6. Return Success Response
    return new Response(JSON.stringify({ 
      success: true, 
      leadId,
      message: 'Inquiry received successfully. An architect will review your requirement.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[INQUIRY_ENDPOINT_ERROR]', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'An internal server error occurred while processing your requirement.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
