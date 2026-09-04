import type { APIRoute } from 'astro';
import { z } from 'zod';

export const prerender = false;

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const MAX_RATE_LIMIT_KEYS = 5000;
const MAX_BODY_BYTES = 16 * 1024;
const WEBHOOK_TIMEOUT_MS = 8000;

// Best-effort per-instance protection. This is intentionally bounded so an attacker cannot
// grow process memory without limit. Platform-level/distributed rate limiting remains the
// correct control if this endpoint needs stronger abuse protection.
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function pruneRateLimitMap(now: number) {
  if (rateLimitMap.size < 1000) return;

  for (const [key, record] of rateLimitMap) {
    if (record.resetTime <= now) rateLimitMap.delete(key);
  }

  while (rateLimitMap.size > MAX_RATE_LIMIT_KEYS) {
    const oldestKey = rateLimitMap.keys().next().value as string | undefined;
    if (!oldestKey) break;
    rateLimitMap.delete(oldestKey);
  }
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  pruneRateLimitMap(now);

  const record = rateLimitMap.get(ip);
  if (!record || now >= record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) return true;

  record.count += 1;
  return false;
}

function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
  extraHeaders: Record<string, string> = {}
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...extraHeaders
    }
  });
}

const optionalShortString = (max: number) =>
  z.string().trim().max(max).optional();

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
  targetLocation: optionalShortString(120),
  requirementsDescription: z
    .string()
    .trim()
    .min(10, 'Requirement description must be at least 10 characters.')
    .max(3000),
  timeline: z.enum(['immediate', 'under-30-days', '1-3-months', '3-plus-months', 'researching']),
  contactName: z.string().trim().min(2, 'Name is required.').max(100),
  companyName: z.string().trim().min(2, 'Company name is required.').max(120),
  workEmail: z.string().trim().email('Valid work email is required.').max(254),
  phone: optionalShortString(40),
  sourcePage: optionalShortString(300),
  serviceParam: optionalShortString(120),
  partnerParam: optionalShortString(120),
  offerSlug: optionalShortString(160),
  utmSource: optionalShortString(200),
  utmCampaign: optionalShortString(200),
  website_trap_field: optionalShortString(200)
});

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const forwardedIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    const clientIp = clientAddress || forwardedIp;

    if (clientIp && isRateLimited(clientIp)) {
      return jsonResponse(
        {
          success: false,
          message: 'Too many requests. Please wait a few minutes or email inquiries@infrahub.tech directly.'
        },
        429,
        { 'Retry-After': '600' }
      );
    }

    const declaredLength = Number(request.headers.get('content-length') || 0);
    if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
      return jsonResponse(
        { success: false, message: 'Request payload is too large.' },
        413
      );
    }

    const rawText = await request.text();
    if (new TextEncoder().encode(rawText).byteLength > MAX_BODY_BYTES) {
      return jsonResponse(
        { success: false, message: 'Request payload is too large.' },
        413
      );
    }

    let rawBody: unknown;
    try {
      rawBody = JSON.parse(rawText);
    } catch {
      return jsonResponse(
        { success: false, message: 'Invalid JSON request payload.' },
        400
      );
    }

    if (
      typeof rawBody === 'object' &&
      rawBody !== null &&
      'website_trap_field' in rawBody &&
      Boolean((rawBody as Record<string, unknown>).website_trap_field)
    ) {
      // Return a generic success to avoid teaching bots how the trap works.
      return jsonResponse({ success: true, leadId: 'INQ-RECEIVED' });
    }

    const validation = InquiryPayloadSchema.safeParse(rawBody);
    if (!validation.success) {
      const issue = validation.error.issues[0]?.message || 'Invalid form payload.';
      return jsonResponse({ success: false, message: issue }, 400);
    }

    const data = validation.data;
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();
    const leadId = `INQ-${dateStr}-${randomSuffix}`;

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

    // Operational telemetry deliberately avoids names, email addresses, domains, phone numbers,
    // free-text requirements, locations, and campaign values.
    console.log(
      `[INQUIRY_RECEIVED] Lead: ${leadId} | Category: ${data.lookingFor} | Timeline: ${data.timeline}`
    );

    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    const isProduction = import.meta.env.PROD || process.env.NODE_ENV === 'production';

    if (webhookUrl) {
      let parsedWebhook: URL;
      try {
        parsedWebhook = new URL(webhookUrl);
        if (isProduction && parsedWebhook.protocol !== 'https:') {
          throw new Error('Production webhook must use HTTPS.');
        }
      } catch {
        console.error('[CONFIG_WARNING] LEAD_WEBHOOK_URL is invalid.');
        return jsonResponse(
          {
            success: false,
            message: 'Lead dispatch is currently unavailable. Please email inquiries@infrahub.tech directly.'
          },
          503
        );
      }

      try {
        const webhookRes = await fetch(parsedWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadRecord),
          signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS)
        });

        if (!webhookRes.ok) {
          console.error(
            `[LEAD_WEBHOOK_ERROR] Webhook status ${webhookRes.status} for lead ${leadId}`
          );
          return jsonResponse(
            {
              success: false,
              message: 'Unable to deliver your requirement. Please email inquiries@infrahub.tech directly.'
            },
            502
          );
        }
      } catch (error) {
        const detail = error instanceof Error ? error.name : 'UnknownError';
        console.error(`[LEAD_WEBHOOK_ERROR] ${detail} for lead ${leadId}`);
        return jsonResponse(
          {
            success: false,
            message: 'Unable to reach the inquiry dispatch system. Please email inquiries@infrahub.tech directly.'
          },
          502
        );
      }
    } else if (isProduction) {
      console.warn('[CONFIG_WARNING] LEAD_WEBHOOK_URL is unset in production.');
      return jsonResponse(
        {
          success: false,
          message: 'Inquiry dispatch is currently unavailable. Please email inquiries@infrahub.tech directly.'
        },
        503
      );
    }

    return jsonResponse({
      success: true,
      leadId,
      message: 'Inquiry received. InfraHub will review the requirement.'
    });
  } catch (error) {
    const detail = error instanceof Error ? error.name : 'UnknownError';
    console.error(`[INQUIRY_ENDPOINT_ERROR] ${detail}`);
    return jsonResponse(
      {
        success: false,
        message: 'An internal error occurred while processing your requirement.'
      },
      500
    );
  }
};
