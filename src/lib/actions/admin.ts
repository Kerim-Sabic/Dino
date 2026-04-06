"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CommunicationChannel, LeadStatus, PublishStatus, UserRole } from "@prisma/client";
import { createAuditLog } from "@/lib/audit";
import { hashPassword, requireSession } from "@/lib/auth";
import { canManageContent, canManageOperations, canManageSensitiveSettings } from "@/lib/permissions";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import {
  blogPostSchema,
  communicationLogSchema,
  faqSchema,
  homepageContentSchema,
  inventoryActionSchema,
  leadNoteSchema,
  leadUpdateSchema,
  legalDocumentSchema,
  meetupZoneSchema,
  pricingConfigSchema,
  siteSettingsSchema,
  testimonialSchema,
  trustBadgeSchema,
} from "@/lib/schemas";

function ensureDatabase() {
  if (!isDatabaseConfigured()) {
    throw new Error("Database is not configured.");
  }
}

function parseOptionalNumber(value: FormDataEntryValue | null) {
  if (!value || value === "") {
    return null;
  }

  return Number(value);
}

function checkboxValue(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

export async function updateLeadAction(formData: FormData) {
  ensureDatabase();
  const session = await requireSession();
  if (!canManageOperations(session.role)) redirect("/admin");

  const parsed = leadUpdateSchema.parse({
    leadId: formData.get("leadId"),
    status: formData.get("status"),
    assignedAdminId: formData.get("assignedAdminId") || undefined,
    promisedPrice: parseOptionalNumber(formData.get("promisedPrice")),
    promisedPriceNote: formData.get("promisedPriceNote") || undefined,
    reservationExpiresAt: formData.get("reservationExpiresAt") || undefined,
    meetupAt: formData.get("meetupAt") || undefined,
  });

  const existing = await prisma.lead.findUniqueOrThrow({ where: { id: parsed.leadId } });
  const before = {
    status: existing.status,
    assignedAdminId: existing.assignedAdminId,
    promisedPrice: existing.promisedPrice ? Number(existing.promisedPrice) : null,
    promisedPriceNote: existing.promisedPriceNote,
    reservationExpiresAt: existing.reservationExpiresAt,
    meetupAt: existing.meetupAt,
    finalSoldPrice: existing.finalSoldPrice ? Number(existing.finalSoldPrice) : null,
  };
  const shouldLockPrice = parsed.promisedPrice !== null && parsed.promisedPrice !== undefined;
  const nextPromisedPrice = shouldLockPrice ? parsed.promisedPrice : null;
  const nextPromisedPriceNote = parsed.promisedPriceNote || null;

  await prisma.$transaction(async (tx) => {
    await tx.lead.update({
      where: { id: parsed.leadId },
      data: {
        status: parsed.status,
        statusChangedAt: parsed.status === existing.status ? existing.statusChangedAt : new Date(),
        assignedAdminId: parsed.assignedAdminId || null,
        promisedPrice: nextPromisedPrice,
        promisedPriceNote: nextPromisedPriceNote,
        reservationExpiresAt: parsed.reservationExpiresAt ? new Date(parsed.reservationExpiresAt) : null,
        meetupAt: parsed.meetupAt ? new Date(parsed.meetupAt) : null,
        statusEvents:
          parsed.status !== existing.status
            ? {
                create: {
                  fromStatus: existing.status,
                  toStatus: parsed.status,
                  changedById: session.id,
                  note: "Status promijenjen iz admin panela.",
                },
              }
            : undefined,
      },
    });

    if (shouldLockPrice) {
      await tx.priceLock.create({
        data: {
          leadId: parsed.leadId,
          price: parsed.promisedPrice!,
          note: nextPromisedPriceNote,
          expiresAt: parsed.reservationExpiresAt ? new Date(parsed.reservationExpiresAt) : null,
          lockedById: session.id,
        },
      });
    }
  });

  await createAuditLog({
    actorId: session.id,
    action: "lead.updated",
    entityType: "LEAD",
    entityId: parsed.leadId,
    summary: `Lead ${existing.fullName} ažuriran na status ${parsed.status}.`,
    before,
    after: {
      status: parsed.status,
      assignedAdminId: parsed.assignedAdminId || null,
      promisedPrice: nextPromisedPrice,
      promisedPriceNote: nextPromisedPriceNote,
      reservationExpiresAt: parsed.reservationExpiresAt || null,
      meetupAt: parsed.meetupAt || null,
    },
  });

  revalidatePath("/admin/leadovi");
  revalidatePath(`/admin/leadovi/${parsed.leadId}`);
}

export async function addLeadNoteAction(formData: FormData) {
  ensureDatabase();
  const session = await requireSession();
  if (!canManageOperations(session.role)) redirect("/admin");

  const parsed = leadNoteSchema.parse({
    leadId: formData.get("leadId"),
    body: formData.get("body"),
    isPinned: checkboxValue(formData, "isPinned"),
  });

  await prisma.leadNote.create({
    data: {
      leadId: parsed.leadId,
      body: parsed.body,
      isPinned: parsed.isPinned || false,
      authorId: session.id,
    },
  });

  revalidatePath(`/admin/leadovi/${parsed.leadId}`);
}

export async function addCommunicationLogAction(formData: FormData) {
  ensureDatabase();
  const session = await requireSession();
  if (!canManageOperations(session.role)) redirect("/admin");

  const parsed = communicationLogSchema.parse({
    leadId: formData.get("leadId"),
    channel: formData.get("channel"),
    direction: formData.get("direction"),
    summary: formData.get("summary"),
  });

  await prisma.communicationLog.create({
    data: {
      leadId: parsed.leadId,
      channel: parsed.channel as CommunicationChannel,
      direction: parsed.direction,
      summary: parsed.summary,
      authorId: session.id,
    },
  });

  revalidatePath(`/admin/leadovi/${parsed.leadId}`);
}

export async function applyInventoryActionAction(formData: FormData) {
  ensureDatabase();
  const session = await requireSession();
  if (!canManageOperations(session.role)) redirect("/admin");

  const parsed = inventoryActionSchema.parse({
    poolId: formData.get("poolId"),
    actionType: formData.get("actionType"),
    quantity: formData.get("quantity"),
    note: formData.get("note"),
    leadId: formData.get("leadId") || undefined,
  });

  const pool = await prisma.inventoryPool.findUniqueOrThrow({ where: { id: parsed.poolId } });
  const before = {
    totalStock: pool.totalStock,
    reservedCount: pool.reservedCount,
    soldCount: pool.soldCount,
  };

  const next = {
    totalStock: pool.totalStock,
    reservedCount: pool.reservedCount,
    soldCount: pool.soldCount,
  };

  const availableCount = Math.max(pool.totalStock - pool.reservedCount - pool.soldCount, 0);
  let priceAtAction: number | null = null;
  let leadAfter: Record<string, unknown> | null = null;

  await prisma.$transaction(async (tx) => {
    if (parsed.actionType === "RESERVE") {
      if (parsed.quantity > availableCount) {
        throw new Error("Nema dovoljno slobodnih ulaznica za rezervaciju.");
      }
      next.reservedCount += parsed.quantity;
    }

    if (parsed.actionType === "RELEASE") {
      if (parsed.quantity > pool.reservedCount) {
        throw new Error("Ne možete osloboditi više nego što je rezervisano.");
      }
      next.reservedCount -= parsed.quantity;
    }

    if (parsed.actionType === "SOLD") {
      if (parsed.quantity > pool.reservedCount) {
        throw new Error("Ne možete prodati više nego što je trenutno rezervisano.");
      }

      next.reservedCount -= parsed.quantity;
      next.soldCount += parsed.quantity;

      if (parsed.leadId) {
        const lead = await tx.lead.findUniqueOrThrow({
          where: { id: parsed.leadId },
          select: {
            id: true,
            fullName: true,
            status: true,
            priceSeen: true,
            promisedPrice: true,
            finalSoldPrice: true,
          },
        });

        const effectivePrice = lead.promisedPrice ? Number(lead.promisedPrice) : Number(lead.priceSeen);
        priceAtAction = effectivePrice;

        await tx.lead.update({
          where: { id: lead.id },
          data: {
            status: LeadStatus.SOLD,
            statusChangedAt: lead.status === LeadStatus.SOLD ? undefined : new Date(),
            finalSoldPrice: effectivePrice,
            statusEvents:
              lead.status !== LeadStatus.SOLD
                ? {
                    create: {
                      fromStatus: lead.status,
                      toStatus: LeadStatus.SOLD,
                      changedById: session.id,
                      note: "Inventar označen kao prodan iz admin panela.",
                    },
                  }
                : undefined,
          },
        });

        leadAfter = {
          id: lead.id,
          status: LeadStatus.SOLD,
          finalSoldPrice: effectivePrice,
        };
      }
    }

    if (parsed.actionType === "RETURN") {
      if (parsed.quantity > pool.soldCount) {
        throw new Error("Ne možete vratiti više nego što je prodano.");
      }
      next.soldCount -= parsed.quantity;
    }

    if (parsed.actionType === "ADJUSTMENT") {
      next.totalStock = Math.max(0, next.totalStock + parsed.quantity);
    }

    await tx.inventoryPool.update({
      where: { id: parsed.poolId },
      data: next,
    });

    await tx.inventoryMovement.create({
      data: {
        poolId: parsed.poolId,
        leadId: parsed.leadId || undefined,
        actorId: session.id,
        actionType: parsed.actionType,
        quantity: parsed.quantity,
        note: parsed.note || undefined,
        priceAtAction,
      },
    });
  });

  revalidatePath("/admin/inventar");
  revalidatePath("/admin/cijene");
  if (parsed.leadId) revalidatePath(`/admin/leadovi/${parsed.leadId}`);

  await createAuditLog({
    actorId: session.id,
    action: "inventory.mutated",
    entityType: "INVENTORY_POOL",
    entityId: parsed.poolId,
    summary: `${parsed.actionType} ${parsed.quantity} kom. na inventaru ${pool.name}.`,
    before,
    after: {
      totalStock: next.totalStock,
      reservedCount: next.reservedCount,
      soldCount: next.soldCount,
      lead: leadAfter,
      priceAtAction,
    },
  });
}

export async function updatePricingConfigAction(formData: FormData) {
  ensureDatabase();
  const session = await requireSession();
  if (!canManageOperations(session.role)) redirect("/admin");

  const parsed = pricingConfigSchema.parse({
    currency: formData.get("currency"),
    manualOverrideEnabled: checkboxValue(formData, "manualOverrideEnabled"),
    manualOverridePrice: formData.get("manualOverridePrice"),
    manualOverrideLabel: formData.get("manualOverrideLabel"),
    promoOverrideEnabled: checkboxValue(formData, "promoOverrideEnabled"),
    promoOverridePrice: formData.get("promoOverridePrice"),
    promoOverrideLabel: formData.get("promoOverrideLabel"),
    scarcityOverrideEnabled: checkboxValue(formData, "scarcityOverrideEnabled"),
    scarcityOverridePrice: formData.get("scarcityOverridePrice"),
    scarcityOverrideLabel: formData.get("scarcityOverrideLabel"),
    showNextPrice: checkboxValue(formData, "showNextPrice"),
    publicUrgencyOverride: formData.get("publicUrgencyOverride"),
    publicPriceMessageOverride: formData.get("publicPriceMessageOverride"),
    allowReservations: checkboxValue(formData, "allowReservations"),
  });

  await prisma.pricingConfig.upsert({
    where: { id: "default" },
    update: {
      currency: parsed.currency,
      manualOverrideEnabled: parsed.manualOverrideEnabled || false,
      manualOverridePrice: parsed.manualOverridePrice ? Number(parsed.manualOverridePrice) : null,
      manualOverrideLabel: parsed.manualOverrideLabel || null,
      promoOverrideEnabled: parsed.promoOverrideEnabled || false,
      promoOverridePrice: parsed.promoOverridePrice ? Number(parsed.promoOverridePrice) : null,
      promoOverrideLabel: parsed.promoOverrideLabel || null,
      scarcityOverrideEnabled: parsed.scarcityOverrideEnabled || false,
      scarcityOverridePrice: parsed.scarcityOverridePrice ? Number(parsed.scarcityOverridePrice) : null,
      scarcityOverrideLabel: parsed.scarcityOverrideLabel || null,
      showNextPrice: parsed.showNextPrice || false,
      publicUrgencyOverride: parsed.publicUrgencyOverride || null,
      publicPriceMessageOverride: parsed.publicPriceMessageOverride || null,
      allowReservations: parsed.allowReservations || false,
    },
    create: {
      id: "default",
      currency: parsed.currency,
      manualOverrideEnabled: parsed.manualOverrideEnabled || false,
      manualOverridePrice: parsed.manualOverridePrice ? Number(parsed.manualOverridePrice) : null,
      manualOverrideLabel: parsed.manualOverrideLabel || null,
      promoOverrideEnabled: parsed.promoOverrideEnabled || false,
      promoOverridePrice: parsed.promoOverridePrice ? Number(parsed.promoOverridePrice) : null,
      promoOverrideLabel: parsed.promoOverrideLabel || null,
      scarcityOverrideEnabled: parsed.scarcityOverrideEnabled || false,
      scarcityOverridePrice: parsed.scarcityOverridePrice ? Number(parsed.scarcityOverridePrice) : null,
      scarcityOverrideLabel: parsed.scarcityOverrideLabel || null,
      showNextPrice: parsed.showNextPrice || false,
      publicUrgencyOverride: parsed.publicUrgencyOverride || null,
      publicPriceMessageOverride: parsed.publicPriceMessageOverride || null,
      allowReservations: parsed.allowReservations || false,
    },
  });

  revalidatePath("/admin/cijene");
  revalidatePath("/");
  revalidatePath("/ulaznice");
}

export async function upsertPriceTierAction(formData: FormData) {
  ensureDatabase();
  const session = await requireSession();
  if (!canManageOperations(session.role)) redirect("/admin");

  const id = String(formData.get("id") || "");
  await prisma.priceTier.upsert({
    where: { id: id || "new-tier" },
    update: {
      name: String(formData.get("name") || ""),
      sortOrder: Number(formData.get("sortOrder") || 1),
      startSoldCount: Number(formData.get("startSoldCount") || 0),
      endSoldCount: Number(formData.get("endSoldCount") || 0),
      price: Number(formData.get("price") || 0),
      publicLabel: String(formData.get("publicLabel") || "") || null,
      isActive: checkboxValue(formData, "isActive"),
    },
    create: {
      id: id || undefined,
      pricingConfigId: "default",
      name: String(formData.get("name") || ""),
      sortOrder: Number(formData.get("sortOrder") || 1),
      startSoldCount: Number(formData.get("startSoldCount") || 0),
      endSoldCount: Number(formData.get("endSoldCount") || 0),
      price: Number(formData.get("price") || 0),
      publicLabel: String(formData.get("publicLabel") || "") || null,
      isActive: checkboxValue(formData, "isActive"),
    },
  });

  revalidatePath("/admin/cijene");
}

export async function updateSiteSettingsAction(formData: FormData) {
  ensureDatabase();
  const session = await requireSession();
  if (!canManageContent(session.role)) redirect("/admin");

  const parsed = siteSettingsSchema.parse({
    siteMode: formData.get("siteMode"),
    siteName: formData.get("siteName"),
    businessLabel: formData.get("businessLabel"),
    city: formData.get("city"),
    whatsappNumber: formData.get("whatsappNumber"),
    phoneNumber: formData.get("phoneNumber"),
    instagramHandle: formData.get("instagramHandle"),
    contactEmail: formData.get("contactEmail"),
    businessHours: formData.get("businessHours"),
    responseTimeText: formData.get("responseTimeText"),
    primaryMeetupText: formData.get("primaryMeetupText"),
    meetupGuidance: formData.get("meetupGuidance"),
    announcementEnabled: checkboxValue(formData, "announcementEnabled"),
    announcementText: formData.get("announcementText"),
    heroTicketLabel: formData.get("heroTicketLabel"),
    seoDefaultTitle: formData.get("seoDefaultTitle"),
    seoDefaultDescription: formData.get("seoDefaultDescription"),
    seoDefaultImage: formData.get("seoDefaultImage"),
    shortDisclaimer: formData.get("shortDisclaimer"),
    soldOutTitle: formData.get("soldOutTitle"),
    soldOutDescription: formData.get("soldOutDescription"),
    waitlistTitle: formData.get("waitlistTitle"),
    waitlistDescription: formData.get("waitlistDescription"),
    handoffCount: formData.get("handoffCount"),
    fastResponseMinutes: formData.get("fastResponseMinutes"),
  });

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      ...parsed,
      announcementEnabled: parsed.announcementEnabled || false,
      contactEmail: parsed.contactEmail || null,
      seoDefaultImage: parsed.seoDefaultImage || null,
    },
    create: {
      id: "default",
      ...parsed,
      announcementEnabled: parsed.announcementEnabled || false,
      contactEmail: parsed.contactEmail || null,
      seoDefaultImage: parsed.seoDefaultImage || null,
    },
  });

  revalidatePath("/admin/sadrzaj");
  revalidatePath("/admin/postavke");
  revalidatePath("/");
}

export async function updateHomepageContentAction(formData: FormData) {
  ensureDatabase();
  const session = await requireSession();
  if (!canManageContent(session.role)) redirect("/admin");

  const parsed = homepageContentSchema.parse({
    heroEyebrow: formData.get("heroEyebrow"),
    heroTitle: formData.get("heroTitle"),
    heroDescription: formData.get("heroDescription"),
    heroPrimaryLabel: formData.get("heroPrimaryLabel"),
    heroSecondaryLabel: formData.get("heroSecondaryLabel"),
    heroTrustLine: formData.get("heroTrustLine"),
    scarcityTitle: formData.get("scarcityTitle"),
    scarcityDescription: formData.get("scarcityDescription"),
    whyReserveTitle: formData.get("whyReserveTitle"),
    whyReserveIntro: formData.get("whyReserveIntro"),
    whyReserveItems: formData.get("whyReserveItems"),
    processTitle: formData.get("processTitle"),
    processIntro: formData.get("processIntro"),
    trustTitle: formData.get("trustTitle"),
    trustIntro: formData.get("trustIntro"),
    ticketsSectionTitle: formData.get("ticketsSectionTitle"),
    ticketsSectionIntro: formData.get("ticketsSectionIntro"),
    ctaStripTitle: formData.get("ctaStripTitle"),
    ctaStripDescription: formData.get("ctaStripDescription"),
  });

  await prisma.homepageContent.upsert({
    where: { id: "default" },
    update: {
      ...parsed,
      whyReserveItems: parsed.whyReserveItems
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean),
    },
    create: {
      id: "default",
      ...parsed,
      whyReserveItems: parsed.whyReserveItems
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean),
    },
  });

  revalidatePath("/admin/sadrzaj");
  revalidatePath("/");
}

async function upsertById({
  formData,
  schema,
  model,
  path,
}: {
  formData: FormData;
  schema: typeof faqSchema | typeof testimonialSchema | typeof trustBadgeSchema | typeof meetupZoneSchema | typeof legalDocumentSchema;
  model: {
    update(args: { where: { id: string }; data: Record<string, unknown> }): Promise<unknown>;
    create(args: { data: Record<string, unknown> }): Promise<unknown>;
  };
  path: string;
}) {
  const parsed = schema.parse(Object.fromEntries(formData.entries()));
  const id = "id" in parsed && parsed.id ? parsed.id : undefined;

  if (id) {
    await model.update({
      where: { id },
      data: { ...parsed, id: undefined },
    });
  } else {
    await model.create({
      data: { ...parsed, id: undefined },
    });
  }

  revalidatePath(path);
}

export async function upsertFaqAction(formData: FormData) {
  ensureDatabase();
  const session = await requireSession();
  if (!canManageContent(session.role)) redirect("/admin");
  await upsertById({ formData, schema: faqSchema, model: prisma.faqItem, path: "/admin/sadrzaj" });
  revalidatePath("/faq");
}

export async function upsertTestimonialAction(formData: FormData) {
  ensureDatabase();
  const session = await requireSession();
  if (!canManageContent(session.role)) redirect("/admin");
  await upsertById({ formData, schema: testimonialSchema, model: prisma.testimonial, path: "/admin/sadrzaj" });
  revalidatePath("/");
}

export async function upsertTrustBadgeAction(formData: FormData) {
  ensureDatabase();
  const session = await requireSession();
  if (!canManageContent(session.role)) redirect("/admin");
  await upsertById({ formData, schema: trustBadgeSchema, model: prisma.trustBadge, path: "/admin/sadrzaj" });
  revalidatePath("/");
}

export async function upsertMeetupZoneAction(formData: FormData) {
  ensureDatabase();
  const session = await requireSession();
  if (!canManageContent(session.role)) redirect("/admin");

  const parsed = meetupZoneSchema.parse(Object.fromEntries(formData.entries()));

  await prisma.$transaction(async (tx) => {
    const saved = parsed.id
      ? await tx.meetupZone.upsert({
          where: { id: parsed.id },
          update: {
            name: parsed.name,
            description: parsed.description,
            sortOrder: parsed.sortOrder,
            isPrimary: parsed.isPrimary || false,
            isActive: parsed.isActive ?? true,
          },
          create: {
            id: parsed.id,
            name: parsed.name,
            description: parsed.description,
            sortOrder: parsed.sortOrder,
            isPrimary: parsed.isPrimary || false,
            isActive: parsed.isActive ?? true,
          },
        })
      : await tx.meetupZone.create({
          data: {
            name: parsed.name,
            description: parsed.description,
            sortOrder: parsed.sortOrder,
            isPrimary: parsed.isPrimary || false,
            isActive: parsed.isActive ?? true,
          },
        });

    if (parsed.isPrimary) {
      await tx.meetupZone.updateMany({
        where: {
          id: { not: saved.id },
        },
        data: {
          isPrimary: false,
        },
      });
    }

    const primaryCount = await tx.meetupZone.count({
      where: { isActive: true, isPrimary: true },
    });

    if (primaryCount === 0) {
      const fallbackZone = await tx.meetupZone.findFirst({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });

      if (fallbackZone) {
        await tx.meetupZone.update({
          where: { id: fallbackZone.id },
          data: { isPrimary: true },
        });
      }
    }
  });

  await createAuditLog({
    actorId: session.id,
    action: "meetup_zone.updated",
    entityType: "MEETUP_ZONE",
    entityId: parsed.id || parsed.name,
    summary: `Meetup zona ${parsed.name} ažurirana.`,
    after: {
      name: parsed.name,
      description: parsed.description,
      sortOrder: parsed.sortOrder,
      isPrimary: parsed.isPrimary || false,
      isActive: parsed.isActive ?? true,
    },
  });

  revalidatePath("/admin/sadrzaj");
  revalidatePath("/kontakt");
  revalidatePath("/rezervacija");
}

export async function upsertLegalDocumentAction(formData: FormData) {
  ensureDatabase();
  const session = await requireSession();
  if (!canManageContent(session.role)) redirect("/admin");

  const parsed = legalDocumentSchema.parse(Object.fromEntries(formData.entries()));

  if (parsed.id) {
    await prisma.legalDocument.update({
      where: { id: parsed.id },
      data: {
        slug: parsed.slug,
        title: parsed.title,
        excerpt: parsed.excerpt,
        contentMarkdown: parsed.contentMarkdown,
      },
    });
  } else {
    await prisma.legalDocument.create({
      data: {
        slug: parsed.slug,
        title: parsed.title,
        excerpt: parsed.excerpt,
        contentMarkdown: parsed.contentMarkdown,
      },
    });
  }

  revalidatePath("/admin/sadrzaj");
  revalidatePath(`/${parsed.slug}`);
}

export async function upsertBlogPostAction(formData: FormData) {
  ensureDatabase();
  const session = await requireSession();
  if (!canManageContent(session.role)) redirect("/admin");

  const parsed = blogPostSchema.parse({
    id: formData.get("id"),
    slug: formData.get("slug"),
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    contentMarkdown: formData.get("contentMarkdown"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    tags: formData.get("tags"),
    readTimeMinutes: formData.get("readTimeMinutes"),
    featured: checkboxValue(formData, "featured"),
    status: formData.get("status"),
    publishedAt: formData.get("publishedAt"),
  });

  const values = {
    slug: parsed.slug,
    title: parsed.title,
    excerpt: parsed.excerpt,
    contentMarkdown: parsed.contentMarkdown,
    seoTitle: parsed.seoTitle || null,
    seoDescription: parsed.seoDescription || null,
    tags: (parsed.tags || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    readTimeMinutes: parsed.readTimeMinutes,
    featured: parsed.featured || false,
    status: parsed.status,
    publishedAt:
      parsed.status === PublishStatus.PUBLISHED
        ? parsed.publishedAt
          ? new Date(parsed.publishedAt)
          : new Date()
        : null,
    authorId: session.id,
  };

  if (parsed.id) {
    await prisma.blogPost.update({
      where: { id: parsed.id },
      data: values,
    });
  } else {
    await prisma.blogPost.create({ data: values });
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function upsertAdminUserAction(formData: FormData) {
  ensureDatabase();
  const session = await requireSession();
  if (!canManageSensitiveSettings(session.role)) redirect("/admin");

  const id = String(formData.get("id") || "");
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const name = String(formData.get("name") || "").trim();
  const role = String(formData.get("role") || UserRole.EDITOR) as UserRole;
  const password = String(formData.get("password") || "");
  const isActive = checkboxValue(formData, "isActive");

  const payload = {
    email,
    name,
    role,
    isActive,
    ...(password ? { passwordHash: await hashPassword(password) } : {}),
  };

  if (id) {
    await prisma.user.update({
      where: { id },
      data: payload,
    });
  } else {
    await prisma.user.create({
      data: {
        ...payload,
        passwordHash: await hashPassword(password || "PromijeniMe123!"),
      },
    });
  }

  revalidatePath("/admin/postavke");
}
