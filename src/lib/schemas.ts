import { ContactMethod, LeadStatus, PublishStatus, SiteMode } from "@prisma/client";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Unesite ispravan e-mail."),
  password: z.string().min(8, "Lozinka mora imati najmanje 8 znakova."),
});

export const reservationSchema = z.object({
  fullName: z.string().min(2, "Unesite ime i prezime."),
  phone: z.string().optional().or(z.literal("")),
  whatsapp: z.string().optional(),
  instagramHandle: z.string().optional(),
  email: z.string().email("Unesite ispravan e-mail.").optional().or(z.literal("")),
  quantityRequested: z.coerce.number().int().min(1).max(6),
  preferredContactMethod: z.nativeEnum(ContactMethod),
  preferredMeetupZoneId: z.string().optional(),
  noteFromCustomer: z.string().max(500).optional(),
  source: z.string().optional(),
  landingPage: z.string().optional(),
  referrer: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
  consentAccepted: z.coerce.boolean().refine((value) => value, "Morate potvrditi saglasnost."),
  startedAt: z.string(),
  company: z.string().optional(),
});

export const leadUpdateSchema = z.object({
  leadId: z.string().min(1),
  status: z.nativeEnum(LeadStatus),
  assignedAdminId: z.string().optional(),
  promisedPrice: z.coerce.number().min(0).optional().nullable(),
  promisedPriceNote: z.string().max(300).optional().nullable(),
  reservationExpiresAt: z.string().optional().nullable(),
  meetupAt: z.string().optional().nullable(),
});

export const leadNoteSchema = z.object({
  leadId: z.string().min(1),
  body: z.string().min(2).max(2000),
  isPinned: z.coerce.boolean().optional(),
});

export const communicationLogSchema = z.object({
  leadId: z.string().min(1),
  channel: z.enum(["WHATSAPP", "PHONE", "INSTAGRAM", "EMAIL", "INTERNAL_NOTE"]),
  direction: z.enum(["INBOUND", "OUTBOUND"]).default("OUTBOUND"),
  summary: z.string().min(2).max(1200),
});

export const inventoryActionSchema = z.object({
  poolId: z.string().min(1),
  actionType: z.enum(["RESERVE", "RELEASE", "SOLD", "ADJUSTMENT", "RETURN"]),
  quantity: z.coerce.number().int().min(1).max(50),
  note: z.string().max(300).optional(),
  leadId: z.string().optional(),
});

export const pricingConfigSchema = z.object({
  currency: z.string().min(1).default("KM"),
  manualOverrideEnabled: z.coerce.boolean().optional(),
  manualOverridePrice: z.string().optional(),
  manualOverrideLabel: z.string().optional(),
  promoOverrideEnabled: z.coerce.boolean().optional(),
  promoOverridePrice: z.string().optional(),
  promoOverrideLabel: z.string().optional(),
  scarcityOverrideEnabled: z.coerce.boolean().optional(),
  scarcityOverridePrice: z.string().optional(),
  scarcityOverrideLabel: z.string().optional(),
  showNextPrice: z.coerce.boolean().optional(),
  publicUrgencyOverride: z.string().optional(),
  publicPriceMessageOverride: z.string().optional(),
  allowReservations: z.coerce.boolean().optional(),
});

export const siteSettingsSchema = z.object({
  siteMode: z.nativeEnum(SiteMode),
  siteName: z.string().min(3),
  businessLabel: z.string().min(3),
  city: z.string().min(2),
  whatsappNumber: z.string().min(6),
  phoneNumber: z.string().min(6),
  instagramHandle: z.string().min(2),
  contactEmail: z.string().email().optional().or(z.literal("")),
  businessHours: z.string().min(3),
  responseTimeText: z.string().min(3),
  primaryMeetupText: z.string().min(3),
  meetupGuidance: z.string().min(3),
  announcementEnabled: z.coerce.boolean().optional(),
  announcementText: z.string().optional(),
  heroTicketLabel: z.string().min(2),
  seoDefaultTitle: z.string().min(10),
  seoDefaultDescription: z.string().min(20),
  seoDefaultImage: z.string().optional(),
  shortDisclaimer: z.string().min(20),
  soldOutTitle: z.string().min(3),
  soldOutDescription: z.string().min(10),
  waitlistTitle: z.string().min(3),
  waitlistDescription: z.string().min(10),
  handoffCount: z.coerce.number().int().min(0),
  fastResponseMinutes: z.coerce.number().int().min(1),
});

export const homepageContentSchema = z.object({
  heroEyebrow: z.string().min(2),
  heroTitle: z.string().min(8),
  heroDescription: z.string().min(20),
  heroPrimaryLabel: z.string().min(2),
  heroSecondaryLabel: z.string().min(2),
  heroTrustLine: z.string().min(10),
  scarcityTitle: z.string().min(3),
  scarcityDescription: z.string().min(10),
  whyReserveTitle: z.string().min(3),
  whyReserveIntro: z.string().min(10),
  whyReserveItems: z.string().min(3),
  processTitle: z.string().min(3),
  processIntro: z.string().min(10),
  trustTitle: z.string().min(3),
  trustIntro: z.string().min(10),
  ticketsSectionTitle: z.string().min(3),
  ticketsSectionIntro: z.string().min(10),
  ctaStripTitle: z.string().min(3),
  ctaStripDescription: z.string().min(10),
});

export const faqSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(5),
  answer: z.string().min(10),
  section: z.string().optional(),
  sortOrder: z.coerce.number().int().min(1),
  isFeatured: z.coerce.boolean().optional(),
  isActive: z.coerce.boolean().optional(),
});

export const testimonialSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  city: z.string().min(2),
  quote: z.string().min(10),
  rating: z.coerce.number().int().min(1).max(5),
  sortOrder: z.coerce.number().int().min(1),
  isFeatured: z.coerce.boolean().optional(),
  isActive: z.coerce.boolean().optional(),
});

export const trustBadgeSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(2),
  detail: z.string().min(5),
  sortOrder: z.coerce.number().int().min(1),
  isActive: z.coerce.boolean().optional(),
});

export const meetupZoneSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  description: z.string().min(5),
  sortOrder: z.coerce.number().int().min(1),
  isPrimary: z.coerce.boolean().optional(),
  isActive: z.coerce.boolean().optional(),
});

export const legalDocumentSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(2),
  title: z.string().min(3),
  excerpt: z.string().min(10),
  contentMarkdown: z.string().min(20),
});

export const blogPostSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(2),
  title: z.string().min(8),
  excerpt: z.string().min(20),
  contentMarkdown: z.string().min(100),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  tags: z.string().optional(),
  readTimeMinutes: z.coerce.number().int().min(1).max(60),
  featured: z.coerce.boolean().optional(),
  status: z.nativeEnum(PublishStatus),
  publishedAt: z.string().optional(),
});
