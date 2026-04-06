import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { LeadStatus } from "@prisma/client";
import { reservationSchema } from "@/lib/schemas";
import { createAuditLog } from "@/lib/audit";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import { getInventoryPool, getPricingConfig, getPriceTiers, getSiteSettings } from "@/lib/public-data";
import { resolvePricingSnapshot } from "@/lib/pricing";

function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        error: "Baza još nije konfigurirana. Privremeno koristite direktni WhatsApp kontakt.",
      },
      { status: 503 },
    );
  }

  const body = await request.json();
  const parsed = reservationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Forma nije ispravno popunjena." },
      { status: 400 },
    );
  }

  const payload = parsed.data;

  if (payload.company) {
    return NextResponse.json({ ok: true });
  }

  const elapsed = Date.now() - Number(payload.startedAt || Date.now());
  if (elapsed < 2500) {
    return NextResponse.json({ error: "Zahtjev izgleda nevažeći. Pokušajte ponovo." }, { status: 400 });
  }

  const ip = getClientIp(request);
  const fingerprintHash = hashValue(`${ip}:${payload.phone ?? payload.email ?? ""}:${payload.fullName}`);
  const windowStart = new Date(Date.now() - 15 * 60 * 1000);

  const attemptCount = await prisma.reservationAttempt.count({
    where: {
      fingerprintHash,
      createdAt: { gte: windowStart },
    },
  });

  if (attemptCount >= 5) {
    return NextResponse.json(
      { error: "Previše pokušaja u kratkom periodu. Sačekajte nekoliko minuta." },
      { status: 429 },
    );
  }

  await prisma.reservationAttempt.create({
    data: {
      fingerprintHash,
      landingPage: payload.landingPage,
      wasAccepted: false,
    },
  });

  const [settings, tiers, config, pool] = await Promise.all([
    getSiteSettings(),
    getPriceTiers(),
    getPricingConfig(),
    getInventoryPool(),
  ]);

  const pricing = resolvePricingSnapshot({
    tiers,
    config,
    pool,
    siteMode: settings.siteMode,
  });

  const lead = await prisma.lead.create({
    data: {
      fullName: payload.fullName,
      phone: payload.phone || undefined,
      whatsapp: payload.whatsapp || undefined,
      instagramHandle: payload.instagramHandle || undefined,
      email: payload.email || undefined,
      noteFromCustomer: payload.noteFromCustomer || undefined,
      quantityRequested: payload.quantityRequested,
      preferredContactMethod: payload.preferredContactMethod,
      preferredMeetupZoneId: payload.preferredMeetupZoneId || undefined,
      source: payload.source || "website",
      landingPage: payload.landingPage || "/rezervacija",
      referrer: payload.referrer || undefined,
      utmSource: payload.utmSource || undefined,
      utmMedium: payload.utmMedium || undefined,
      utmCampaign: payload.utmCampaign || undefined,
      utmContent: payload.utmContent || undefined,
      utmTerm: payload.utmTerm || undefined,
      ipHash: hashValue(ip),
      userAgent: request.headers.get("user-agent") || undefined,
      priceSeen: pricing.currentPrice,
      priceLabelSeen: pricing.priceLabel,
      consentAt: new Date(),
      status: LeadStatus.NEW,
      statusChangedAt: new Date(),
      statusEvents: {
        create: {
          fromStatus: null,
          toStatus: LeadStatus.NEW,
          note: pricing.allowReservations
            ? "Lead kreiran sa javne forme."
            : "Lead kreiran u sold-out/waitlist modu.",
        },
      },
    },
  });

  await prisma.reservationAttempt.updateMany({
    where: {
      fingerprintHash,
      wasAccepted: false,
      createdAt: { gte: windowStart },
    },
    data: {
      wasAccepted: true,
    },
  });

  await createAuditLog({
    action: "lead.created",
    entityType: "LEAD",
    entityId: lead.id,
    summary: `Novi lead s javne forme: ${lead.fullName}.`,
  });

  return NextResponse.json({
    ok: true,
    leadId: lead.id,
  });
}
