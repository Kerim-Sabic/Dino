import { PublishStatus } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";
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
} from "../src/lib/default-content";
import { prisma } from "../src/lib/prisma";

async function main() {
  const email = process.env.SEED_SUPER_ADMIN_EMAIL || "admin@dino-kosevo.ba";
  const password = process.env.SEED_SUPER_ADMIN_PASSWORD;
  const name = process.env.SEED_SUPER_ADMIN_NAME || "Sarajevo Rezervacije";

  if (process.env.NODE_ENV === "production" && !password) {
    throw new Error("SEED_SUPER_ADMIN_PASSWORD must be set in production.");
  }

  const resolvedPassword = password || "PromijeniMe123!";
  const passwordHash = await hashPassword(resolvedPassword);

  if (!password) {
    console.warn(
      "Using the local default seed admin password. Set SEED_SUPER_ADMIN_PASSWORD before any shared or production deploy.",
    );
  }

  const superAdmin = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
    create: {
      name,
      email,
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: { ...defaultSiteSettings },
    create: { id: "default", ...defaultSiteSettings },
  });

  await prisma.homepageContent.upsert({
    where: { id: "default" },
    update: { ...defaultHomepageContent },
    create: { id: "default", ...defaultHomepageContent },
  });

  await prisma.inventoryPool.upsert({
    where: { slug: defaultInventoryPool.slug },
    update: { ...defaultInventoryPool },
    create: { ...defaultInventoryPool },
  });

  await prisma.pricingConfig.upsert({
    where: { id: "default" },
    update: { ...defaultPricingConfig },
    create: { id: "default", ...defaultPricingConfig },
  });

  for (const tier of defaultPriceTiers) {
    await prisma.priceTier.upsert({
      where: { id: `tier-${tier.sortOrder}` },
      update: {
        pricingConfigId: "default",
        ...tier,
      },
      create: {
        id: `tier-${tier.sortOrder}`,
        pricingConfigId: "default",
        ...tier,
      },
    });
  }

  for (const item of defaultFaqItems) {
    const existing = await prisma.faqItem.findFirst({
      where: { question: item.question },
    });

    if (!existing) {
      await prisma.faqItem.create({ data: item });
    }
  }

  for (const item of defaultTestimonials) {
    const existing = await prisma.testimonial.findFirst({
      where: { name: item.name, quote: item.quote },
    });

    if (!existing) {
      await prisma.testimonial.create({ data: item });
    }
  }

  for (const item of defaultTrustBadges) {
    const existing = await prisma.trustBadge.findFirst({
      where: { label: item.label },
    });

    if (!existing) {
      await prisma.trustBadge.create({ data: item });
    }
  }

  for (const item of defaultMeetupZones) {
    await prisma.meetupZone.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }

  for (const item of defaultLegalDocuments) {
    await prisma.legalDocument.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });
  }

  for (const post of defaultBlogPosts) {
    const postForDb = {
      ...post,
      status: post.status || PublishStatus.PUBLISHED,
      authorId: superAdmin.id,
    };
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: postForDb,
      create: postForDb,
    });
  }

  console.log("Seed completed.");
  console.log(`Super admin: ${email}`);
  console.log(`Initial password: ${resolvedPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
