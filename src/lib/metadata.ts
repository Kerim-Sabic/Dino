import type { Metadata } from "next";
import type { BlogPostData, FaqItemData, SiteSettingsData } from "@/lib/types";
import { absoluteUrl } from "@/lib/utils";

const defaultTitle = "Dino Merlin Koševo ulaznice | Privatna rezervacija fizičkih ulaznica u Sarajevu";
const defaultDescription =
  "Parter Zona 2 za Dino Merlin Koševo. Privatna rezervacija fizičkih ulaznica uz lično preuzimanje u Sarajevu, bez online plaćanja i bez digitalne dostave.";

type MetadataSettings = Pick<
  SiteSettingsData,
  "siteName" | "seoDefaultTitle" | "seoDefaultDescription" | "seoDefaultImage" | "instagramHandle"
>;

function formatDate(value?: string | Date | null) {
  if (!value) {
    return undefined;
  }

  return new Date(value).toISOString();
}

function resolveTitle(title?: string, settings?: MetadataSettings) {
  if (!title) {
    return settings?.seoDefaultTitle || defaultTitle;
  }

  if (title.includes("|")) {
    return title;
  }

  const brand = settings?.siteName || "Dino Merlin Koševo ulaznice";
  return `${title} | ${brand}`;
}

function resolveDescription(description?: string, settings?: MetadataSettings) {
  return description || settings?.seoDefaultDescription || defaultDescription;
}

function resolveImage(settings?: MetadataSettings) {
  return absoluteUrl(settings?.seoDefaultImage || "/opengraph-image");
}

export function buildMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  settings,
  type = "website",
  publishedTime,
  modifiedTime,
  canonical = true,
  robots,
}: {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  settings?: MetadataSettings;
  type?: "website" | "article";
  publishedTime?: string | Date | null;
  modifiedTime?: string | Date | null;
  canonical?: boolean;
  robots?: Metadata["robots"];
}): Metadata {
  const finalTitle = resolveTitle(title, settings);
  const finalDescription = resolveDescription(description, settings);
  const url = absoluteUrl(path);
  const image = resolveImage(settings);

  return {
    title: finalTitle,
    description: finalDescription,
    metadataBase: new URL(absoluteUrl("/")),
    alternates: canonical
      ? {
          canonical: url,
        }
      : undefined,
    robots,
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url,
      locale: "bs_BA",
      siteName: settings?.siteName || "Dino Merlin Koševo ulaznice",
      type,
      images: [{ url: image, width: 1200, height: 630, alt: finalTitle }],
      ...(type === "article"
        ? {
            publishedTime: formatDate(publishedTime),
            modifiedTime: formatDate(modifiedTime || publishedTime),
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
      images: [image],
    },
    keywords,
  };
}

export function buildSiteMetadata(settings: MetadataSettings): Metadata {
  return buildMetadata({
    settings,
    canonical: false,
  });
}

export function buildArticleMetadata({
  title,
  description,
  path,
  keywords = [],
  settings,
  publishedTime,
  modifiedTime,
}: {
  title: string;
  description?: string;
  path: string;
  keywords?: string[];
  settings?: MetadataSettings;
  publishedTime?: string | Date | null;
  modifiedTime?: string | Date | null;
}): Metadata {
  return buildMetadata({
    title,
    description,
    path,
    keywords,
    settings,
    type: "article",
    publishedTime,
    modifiedTime,
  });
}

export function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildFaqSchema(faqs: FaqItemData[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildArticleSchema(post: BlogPostData) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    datePublished: formatDate(post.publishedAt),
    dateModified: formatDate(post.publishedAt),
    inLanguage: "bs-BA",
    about: post.tags.map((tag) => ({
      "@type": "Thing",
      name: tag,
    })),
    keywords: post.tags.join(", "),
    image: absoluteUrl("/opengraph-image"),
    author: {
      "@type": "Organization",
      name: "Privatna rezervacija ulaznica Sarajevo",
    },
    publisher: {
      "@type": "Organization",
      name: "Dino Merlin Koševo ulaznice",
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/opengraph-image"),
        width: 1200,
        height: 630,
      },
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  };
}

export function buildOrganizationSchema(settings: SiteSettingsData) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings.siteName,
    description: settings.businessLabel,
    url: absoluteUrl("/"),
    telephone: settings.phoneNumber,
    email: settings.contactEmail || undefined,
    openingHours: "Mo-Su 09:00-22:00",
    areaServed: {
      "@type": "City",
      name: "Sarajevo",
      "@id": "https://www.wikidata.org/wiki/Q131",
    },
    sameAs: [`https://instagram.com/${settings.instagramHandle.replace("@", "")}`],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sarajevo",
      addressCountry: "BA",
      addressRegion: "Federacija Bosne i Hercegovine",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 43.8563,
      longitude: 18.4131,
    },
    priceRange: "90–149 KM",
    currenciesAccepted: "BAM",
    paymentAccepted: "Cash",
    image: absoluteUrl("/opengraph-image"),
  };
}

/** Schema for the Dino Merlin Koševo concert event */
export function buildEventSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Dino Merlin – Koševo 2025",
    alternateName: ["Dino Merlin Sarajevo", "Dino Merlin Koševo koncert"],
    description:
      "Koncert Dine Merlina na Stadionu Koševo u Sarajevu. Privatna rezervacija Parter Zona 2 fizičkih ulaznica uz lično preuzimanje.",
    url: absoluteUrl("/"),
    image: absoluteUrl("/opengraph-image"),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "Stadion Koševo",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Ferhadija bb",
        addressLocality: "Sarajevo",
        addressCountry: "BA",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 43.8617,
        longitude: 18.3856,
      },
    },
    performer: {
      "@type": "MusicGroup",
      name: "Dino Merlin",
      sameAs: "https://www.wikidata.org/wiki/Q1199543",
    },
    organizer: {
      "@type": "Organization",
      name: "Privatna rezervacija Sarajevo",
      url: absoluteUrl("/"),
    },
    offers: {
      "@type": "Offer",
      name: "Parter Zona 2 – privatna rezervacija",
      url: absoluteUrl("/rezervacija"),
      availability: "https://schema.org/InStock",
      priceCurrency: "BAM",
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: 90,
        maxPrice: 149,
        priceCurrency: "BAM",
      },
      seller: {
        "@type": "Organization",
        name: "Privatna rezervacija ulaznica Sarajevo",
      },
    },
  };
}

/** Schema for the ticket reservation service */
export function buildServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Rezervacija ulaznica",
    name: "Privatna rezervacija fizičkih ulaznica za Dino Merlin Koševo",
    description:
      "Privatna rezervacija Parter Zona 2 fizičkih ulaznica za Dino Merlin Koševo. Zahtjev online, lično preuzimanje u Sarajevu, plaćanje gotovinom uz pregled ulaznice.",
    url: absoluteUrl("/rezervacija"),
    areaServed: {
      "@type": "City",
      name: "Sarajevo",
    },
    provider: {
      "@type": "LocalBusiness",
      name: "Privatna rezervacija ulaznica Sarajevo",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Sarajevo",
        addressCountry: "BA",
      },
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "BAM",
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: 90,
        maxPrice: 149,
        priceCurrency: "BAM",
      },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Kategorije ulaznica",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Parter Zona 2",
            description: "Fizička ulaznica za Parter Zona 2, Dino Merlin Koševo",
          },
        },
      ],
    },
  };
}

/** Aggregate rating schema from testimonials */
export function buildAggregateRatingSchema(reviewCount: number, ratingValue = 5) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Privatna rezervacija ulaznica Sarajevo",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(ratingValue),
      bestRating: "5",
      worstRating: "1",
      reviewCount: String(reviewCount),
    },
  };
}
