import type { ContactMethod, LeadStatus, PublishStatus, SiteMode, UserRole } from "@prisma/client";

export interface SiteSettingsData {
  siteMode: SiteMode;
  siteName: string;
  businessLabel: string;
  city: string;
  whatsappNumber: string;
  phoneNumber: string;
  instagramHandle: string;
  contactEmail?: string | null;
  businessHours: string;
  responseTimeText: string;
  primaryMeetupText: string;
  meetupGuidance: string;
  announcementEnabled: boolean;
  announcementText?: string | null;
  heroTicketLabel: string;
  seoDefaultTitle: string;
  seoDefaultDescription: string;
  seoDefaultImage?: string | null;
  shortDisclaimer: string;
  soldOutTitle: string;
  soldOutDescription: string;
  waitlistTitle: string;
  waitlistDescription: string;
  handoffCount: number;
  fastResponseMinutes: number;
}

export interface HomepageContentData {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroPrimaryLabel: string;
  heroSecondaryLabel: string;
  heroTrustLine: string;
  scarcityTitle: string;
  scarcityDescription: string;
  whyReserveTitle: string;
  whyReserveIntro: string;
  whyReserveItems: string[];
  processTitle: string;
  processIntro: string;
  trustTitle: string;
  trustIntro: string;
  ticketsSectionTitle: string;
  ticketsSectionIntro: string;
  ctaStripTitle: string;
  ctaStripDescription: string;
}

export interface TrustBadgeData {
  label: string;
  detail: string;
  sortOrder: number;
  isActive: boolean;
}

export interface TestimonialData {
  name: string;
  city: string;
  quote: string;
  rating: number;
  sortOrder: number;
  isFeatured: boolean;
  isActive: boolean;
}

export interface FaqItemData {
  question: string;
  answer: string;
  section?: string | null;
  sortOrder: number;
  isFeatured: boolean;
  isActive: boolean;
}

export interface MeetupZoneData {
  id: string;
  name: string;
  description: string;
  sortOrder: number;
  isPrimary: boolean;
  isActive: boolean;
}

export interface LegalDocumentData {
  slug: string;
  title: string;
  excerpt: string;
  contentMarkdown: string;
}

export interface BlogPostData {
  slug: string;
  title: string;
  excerpt: string;
  contentMarkdown: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  tags: string[];
  readTimeMinutes: number;
  featured: boolean;
  status: PublishStatus;
  publishedAt?: Date | null;
}

export interface PriceTierData {
  id?: string;
  name: string;
  sortOrder: number;
  startSoldCount: number;
  endSoldCount: number;
  price: number;
  publicLabel?: string | null;
  isActive: boolean;
}

export interface PricingConfigData {
  currency: string;
  manualOverrideEnabled: boolean;
  manualOverridePrice?: number | null;
  manualOverrideLabel?: string | null;
  promoOverrideEnabled: boolean;
  promoOverridePrice?: number | null;
  promoOverrideLabel?: string | null;
  scarcityOverrideEnabled: boolean;
  scarcityOverridePrice?: number | null;
  scarcityOverrideLabel?: string | null;
  showNextPrice: boolean;
  publicUrgencyOverride?: string | null;
  publicPriceMessageOverride?: string | null;
  allowReservations: boolean;
}

export interface InventoryPoolData {
  id?: string;
  slug: string;
  name: string;
  categoryLabel: string;
  totalStock: number;
  reservedCount: number;
  soldCount: number;
  isPublicVisible: boolean;
  publicDisplayMode: string;
  publicLabel?: string | null;
  lowStockThreshold: number;
}

export interface PricingSnapshot {
  currentPrice: number;
  currency: string;
  currentTier?: PriceTierData | null;
  nextTier?: PriceTierData | null;
  source: "tier" | "promo" | "manual" | "scarcity" | "sold_out";
  priceLabel: string;
  priceMessage?: string | null;
  nextPriceLabel?: string | null;
  urgencyLabel: string;
  availableCount: number;
  reservedCount: number;
  soldCount: number;
  totalStock: number;
  allowReservations: boolean;
}

export interface ReservationPayload {
  fullName: string;
  phone: string;
  whatsapp?: string;
  instagramHandle?: string;
  email?: string;
  quantityRequested: number;
  preferredContactMethod: ContactMethod;
  preferredMeetupZoneId?: string;
  noteFromCustomer?: string;
  source?: string;
  landingPage?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  consentAccepted: boolean;
  startedAt: string;
  company?: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface LeadStatusOption {
  value: LeadStatus;
  label: string;
  description: string;
}
