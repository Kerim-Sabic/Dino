import {
  defaultFaqItems,
  defaultHomepageContent,
  defaultInventoryPool,
  defaultLegalDocuments,
  defaultMeetupZones,
  defaultPricingConfig,
  defaultPriceTiers,
  defaultSiteSettings,
  defaultTestimonials,
  defaultTrustBadges,
} from "@/lib/default-content";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import { resolvePricingSnapshot } from "@/lib/pricing";

export async function getAdminDashboardData() {
  if (!isDatabaseConfigured()) {
    return {
      configured: false,
      metrics: {
        leadCount: 0,
        soldCount: defaultInventoryPool.soldCount,
        reservedCount: defaultInventoryPool.reservedCount,
      },
      leadCounts: {},
      recentLeads: [],
      pricing: resolvePricingSnapshot({
        tiers: defaultPriceTiers,
        config: defaultPricingConfig,
        pool: defaultInventoryPool,
        siteMode: defaultSiteSettings.siteMode,
      }),
    };
  }

  const [leads, recentLeads, pool, config, tiers, settings] = await Promise.all([
    prisma.lead.findMany({ select: { status: true, quantityRequested: true } }),
    prisma.lead.findMany({
      orderBy: { submittedAt: "desc" },
      take: 8,
      include: {
        assignedAdmin: true,
      },
    }),
    prisma.inventoryPool.findFirst(),
    prisma.pricingConfig.findUnique({ where: { id: "default" } }),
    prisma.priceTier.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
  ]);

  const leadCounts = leads.reduce<Record<string, number>>((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  return {
    configured: true,
    metrics: {
      leadCount: leads.length,
      soldCount: pool?.soldCount ?? 0,
      reservedCount: pool?.reservedCount ?? 0,
    },
    leadCounts,
    recentLeads,
    pricing: resolvePricingSnapshot({
      tiers: tiers.map((tier) => ({ ...tier, price: Number(tier.price) })),
      config: config
        ? {
            ...config,
            manualOverridePrice: config.manualOverridePrice ? Number(config.manualOverridePrice) : null,
            promoOverridePrice: config.promoOverridePrice ? Number(config.promoOverridePrice) : null,
            scarcityOverridePrice: config.scarcityOverridePrice ? Number(config.scarcityOverridePrice) : null,
          }
        : defaultPricingConfig,
      pool: pool || defaultInventoryPool,
      siteMode: settings?.siteMode || defaultSiteSettings.siteMode,
    }),
  };
}

export async function getAdminUsers() {
  if (!isDatabaseConfigured()) {
    return [];
  }

  return prisma.user.findMany({
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
  });
}

export async function getLeadsData() {
  if (!isDatabaseConfigured()) {
    return [];
  }

  return prisma.lead.findMany({
    orderBy: { submittedAt: "desc" },
    include: {
      assignedAdmin: true,
      preferredMeetupZone: true,
    },
  });
}

export async function getLeadDetail(id: string) {
  if (!isDatabaseConfigured()) {
    return null;
  }

  return prisma.lead.findUnique({
    where: { id },
    include: {
      assignedAdmin: true,
      preferredMeetupZone: true,
      statusEvents: {
        orderBy: { changedAt: "desc" },
        include: { changedBy: true },
      },
      notes: {
        orderBy: { createdAt: "desc" },
        include: { author: true },
      },
      communicationLogs: {
        orderBy: { happenedAt: "desc" },
        include: { author: true },
      },
      priceLocks: {
        orderBy: { createdAt: "desc" },
        include: { lockedBy: true },
      },
    },
  });
}

export async function getInventoryAdminData() {
  if (!isDatabaseConfigured()) {
    return {
      pool: defaultInventoryPool,
      movements: [],
    };
  }

  const pool = await prisma.inventoryPool.findFirst();
  const movements = await prisma.inventoryMovement.findMany({
    orderBy: { createdAt: "desc" },
    take: 40,
    include: {
      lead: true,
      actor: true,
    },
  });

  return {
    pool: pool || defaultInventoryPool,
    movements,
  };
}

export async function getPricingAdminData() {
  if (!isDatabaseConfigured()) {
    return {
      config: defaultPricingConfig,
      tiers: defaultPriceTiers,
      pool: defaultInventoryPool,
    };
  }

  const [config, tiers, pool] = await Promise.all([
    prisma.pricingConfig.findUnique({ where: { id: "default" } }),
    prisma.priceTier.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.inventoryPool.findFirst(),
  ]);

  return {
    config: config
      ? {
          ...config,
          manualOverridePrice: config.manualOverridePrice ? Number(config.manualOverridePrice) : null,
          promoOverridePrice: config.promoOverridePrice ? Number(config.promoOverridePrice) : null,
          scarcityOverridePrice: config.scarcityOverridePrice ? Number(config.scarcityOverridePrice) : null,
        }
      : defaultPricingConfig,
    tiers: tiers.length ? tiers.map((tier) => ({ ...tier, price: Number(tier.price) })) : defaultPriceTiers,
    pool: pool || defaultInventoryPool,
  };
}

export async function getCmsAdminData() {
  if (!isDatabaseConfigured()) {
    return {
      settings: defaultSiteSettings,
      homepage: defaultHomepageContent,
      faqs: defaultFaqItems,
      testimonials: defaultTestimonials,
      trustBadges: defaultTrustBadges,
      meetupZones: defaultMeetupZones,
      legalDocuments: defaultLegalDocuments,
    };
  }

  const [settings, homepage, faqs, testimonials, trustBadges, meetupZones, legalDocuments] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.homepageContent.findUnique({ where: { id: "default" } }),
    prisma.faqItem.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.trustBadge.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.meetupZone.findMany({ orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }] }),
    prisma.legalDocument.findMany({ orderBy: { title: "asc" } }),
  ]);

  return {
    settings: settings || defaultSiteSettings,
    homepage: homepage
      ? {
          ...homepage,
          whyReserveItems: Array.isArray(homepage.whyReserveItems)
            ? homepage.whyReserveItems.map(String)
            : defaultHomepageContent.whyReserveItems,
        }
      : defaultHomepageContent,
    faqs: faqs.length ? faqs : defaultFaqItems,
    testimonials: testimonials.length ? testimonials : defaultTestimonials,
    trustBadges: trustBadges.length ? trustBadges : defaultTrustBadges,
    meetupZones: meetupZones.length ? meetupZones : defaultMeetupZones,
    legalDocuments: legalDocuments.length ? legalDocuments : defaultLegalDocuments,
  };
}

export async function getBlogAdminData() {
  if (!isDatabaseConfigured()) {
    return [];
  }

  return prisma.blogPost.findMany({
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
    include: { author: true },
  });
}

export async function getBlogAdminPost(id: string) {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: { author: true },
  });

  if (!post) return null;
  return { ...post, tags: Array.isArray(post.tags) ? (post.tags as string[]) : [] };
}

export async function getAuditLogData() {
  if (!isDatabaseConfigured()) {
    return [];
  }

  return prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 120,
    include: { actor: true },
  });
}
