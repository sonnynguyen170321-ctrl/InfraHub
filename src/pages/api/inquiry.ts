import type { APIRoute } from 'astro';
import { z } from 'zod';

export const prerender = false;

// In-memory sliding rate limiter (per-worker instance)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  record.count++;
  return false;
}

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

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    // 1. IP Rate Limiting check
    const clientIp = clientAddress || request.headers.get('x-forwarded-for') || 'unknown-client';
    if (isRateLimited(clientIp)) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Too many requests from this IP. Please wait a few minutes or email inquiries@infrahub.tech directly.' 
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', 'Retry-After': '600' }
      });
    }

    const rawBody = await request.json();

    // 2. Honeypot check
    if (rawBody.website_trap_field) {
      // Silently discard bot requests without downstream dispatch
      return new Response(JSON.stringify({ success: true, leadId: "INQ-VERIFIED" }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. Validate payload schema
    const validation = InquiryPayloadSchema.safeParse(rawBody);
    if (!validation.success) {
      const issue = validation.error.issues[0]?.message || 'Invalid form payload.';
      return new Response(JSON.stringify({ success: false, message: issue }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = validation.data;

    // 4. Generate structured Lead ID
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const leadId = `INQ-${dateStr}-${randomSuffix}`;

    // 5. Construct Lead Record
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

    // 6. Log non-PII operational telemetry
    const emailDomain = data.workEmail.includes('@') ? data.workEmail.split('@')[1] : 'unknown';
    console.log(`[INQUIRY_RECEIVED] Lead: ${leadId} | Domain: ${emailDomain} | Service: ${data.lookingFor} | Timeline: ${data.timeline}`);

    // 7. Downstream Delivery Guarantee (A2-F1)
    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    const isProduction = import.meta.env.PROD || process.env.NODE_ENV === 'production';

    if (webhookUrl) {
      try {
        const webhookRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadRecord)
        });

        if (!webhookRes.ok) {
          console.error(`[LEAD_WEBHOOK_ERROR] Webhook responded with status ${webhookRes.status} for lead ${leadId}`);
          return new Response(JSON.stringify({ 
            success: false, 
            message: 'Unable to deliver requirement to downstream dispatch. Please email inquiries@infrahub.tech directly.' 
          }), {
            status: 502,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      } catch (webhookErr) {
        console.error(`[LEAD_WEBHOOK_ERROR] Network throw forwarding lead ${leadId}`, webhookErr);
        return new Response(JSON.stringify({ 
          success: false, 
          message: 'Unable to reach downstream qualification system. Please contact inquiries@infrahub.tech directly.' 
        }), {
          status: 502,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } else if (isProduction) {
      // In production, an unconfigured webhook must not pretend success
      console.warn(`[CONFIG_WARNING] LEAD_WEBHOOK_URL unset in production environment for lead ${leadId}`);
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Lead dispatch system is currently in maintenance mode. Please email inquiries@infrahub.tech directly.' 
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 8. Return Verified Success Response
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
