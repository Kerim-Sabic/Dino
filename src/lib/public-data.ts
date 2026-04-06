import { PublishStatus } from "@prisma/client";
import {
  defaultBlogPosts,
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
import { prisma, withDbFallback } from "@/lib/prisma";
import { resolvePricingSnapshot } from "@/lib/pricing";
import type {
  BlogPostData,
  FaqItemData,
  HomepageContentData,
  InventoryPoolData,
  LegalDocumentData,
  MeetupZoneData,
  PricingConfigData,
  PriceTierData,
  SiteSettingsData,
  TestimonialData,
  TrustBadgeData,
} from "@/lib/types";

function decimalToNumber(value: unknown) {
  if (typeof value === "number") {
    return value;
  }

  return Number(value || 0);
}

export async function getSiteSettings() {
  return withDbFallback<SiteSettingsData>(
    async () => {
      const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
      return settings ? { ...defaultSiteSettings, ...settings } : defaultSiteSettings;
    },
    defaultSiteSettings,
  );
}

export async function getHomepageContent() {
  return withDbFallback<HomepageContentData>(
    async () => {
      const content = await prisma.homepageContent.findUnique({ where: { id: "default" } });

      if (!content) {
        return defaultHomepageContent;
      }

      const whyReserveItems = Array.isArray(content.whyReserveItems)
        ? (content.whyReserveItems as string[])
        : defaultHomepageContent.whyReserveItems;

      return { ...defaultHomepageContent, ...content, whyReserveItems };
    },
    defaultHomepageContent,
  );
}

export async function getTrustBadges() {
  return withDbFallback<TrustBadgeData[]>(
    async () => {
      const items = await prisma.trustBadge.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      });

      return items.length ? items : defaultTrustBadges;
    },
    defaultTrustBadges,
  );
}

export async function getTestimonials() {
  return withDbFallback<TestimonialData[]>(
    async () => {
      const items = await prisma.testimonial.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      });

      return items.length ? items : defaultTestimonials;
    },
    defaultTestimonials,
  );
}

export async function getFaqItems() {
  return withDbFallback<FaqItemData[]>(
    async () => {
      const items = await prisma.faqItem.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      });

      return items.length ? items : defaultFaqItems;
    },
    defaultFaqItems,
  );
}

export async function getMeetupZones() {
  return withDbFallback<MeetupZoneData[]>(
    async () => {
      const items = await prisma.meetupZone.findMany({
        where: { isActive: true },
        orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
      });

      return items.length ? items : defaultMeetupZones;
    },
    defaultMeetupZones,
  );
}

export async function getLegalDocument(slug: string) {
  return withDbFallback<LegalDocumentData | null>(
    async () => {
      const document = await prisma.legalDocument.findUnique({ where: { slug } });
      return document ?? defaultLegalDocuments.find((item) => item.slug === slug) ?? null;
    },
    defaultLegalDocuments.find((item) => item.slug === slug) ?? null,
  );
}

export async function getBlogPosts() {
  return withDbFallback<BlogPostData[]>(
    async () => {
      const items = await prisma.blogPost.findMany({
        where: { status: PublishStatus.PUBLISHED },
        orderBy: { publishedAt: "desc" },
      });

      if (!items.length) return defaultBlogPosts;
      return items.map((item) => ({ ...item, tags: Array.isArray(item.tags) ? item.tags as string[] : [] }));
    },
    defaultBlogPosts,
  );
}

export async function getBlogPostBySlug(slug: string) {
  return withDbFallback<BlogPostData | null>(
    async () => {
      const item = await prisma.blogPost.findUnique({ where: { slug } });
      if (!item) return defaultBlogPosts.find((post) => post.slug === slug) ?? null;
      return { ...item, tags: Array.isArray(item.tags) ? item.tags as string[] : [] };
    },
    defaultBlogPosts.find((post) => post.slug === slug) ?? null,
  );
}

export async function getPriceTiers() {
  return withDbFallback<PriceTierData[]>(
    async () => {
      const tiers = await prisma.priceTier.findMany({ orderBy: { sortOrder: "asc" } });
      return tiers.length
        ? tiers.map((tier) => ({
            ...tier,
            price: decimalToNumber(tier.price),
          }))
        : defaultPriceTiers;
    },
    defaultPriceTiers,
  );
}

export async function getPricingConfig() {
  return withDbFallback<PricingConfigData>(
    async () => {
      const config = await prisma.pricingConfig.findUnique({ where: { id: "default" } });

      if (!config) {
        return defaultPricingConfig;
      }

      return {
        ...config,
        manualOverridePrice: config.manualOverridePrice ? decimalToNumber(config.manualOverridePrice) : null,
        promoOverridePrice: config.promoOverridePrice ? decimalToNumber(config.promoOverridePrice) : null,
        scarcityOverridePrice: config.scarcityOverridePrice ? decimalToNumber(config.scarcityOverridePrice) : null,
      };
    },
    defaultPricingConfig,
  );
}

export async function getInventoryPool() {
  return withDbFallback<InventoryPoolData>(
    async () => {
      const pool = await prisma.inventoryPool.findUnique({ where: { slug: defaultInventoryPool.slug } });
      return pool ?? defaultInventoryPool;
    },
    defaultInventoryPool,
  );
}

export async function getPublicSiteData() {
  const [settings, homepage, trustBadges, testimonials, faqs, meetupZones, priceTiers, pricingConfig, inventoryPool, blogPosts] =
    await Promise.all([
      getSiteSettings(),
      getHomepageContent(),
      getTrustBadges(),
      getTestimonials(),
      getFaqItems(),
      getMeetupZones(),
      getPriceTiers(),
      getPricingConfig(),
      getInventoryPool(),
      getBlogPosts(),
    ]);

  const pricing = resolvePricingSnapshot({
    tiers: priceTiers,
    config: pricingConfig,
    pool: inventoryPool,
    siteMode: settings.siteMode,
  });

  return {
    settings,
    homepage,
    trustBadges,
    testimonials,
    faqs,
    meetupZones,
    priceTiers,
    pricingConfig,
    inventoryPool,
    pricing,
    blogPosts,
  };
}
