import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/public-data";
import { absoluteUrl } from "@/lib/utils";

type SitemapEntry = MetadataRoute.Sitemap[number];

const HIGH_PRIORITY_ROUTES: Array<{ path: string; changeFrequency: SitemapEntry["changeFrequency"]; priority: number }> = [
  { path: "/",                   changeFrequency: "daily",   priority: 1.0 },
  { path: "/rezervacija",        changeFrequency: "daily",   priority: 0.98 },
  { path: "/ulaznice",           changeFrequency: "daily",   priority: 0.95 },
  { path: "/kako-funkcionise",   changeFrequency: "weekly",  priority: 0.85 },
  { path: "/zasto-nama-vjeruju", changeFrequency: "weekly",  priority: 0.82 },
  { path: "/faq",                changeFrequency: "weekly",  priority: 0.80 },
  { path: "/kontakt",            changeFrequency: "monthly", priority: 0.75 },
  { path: "/blog",               changeFrequency: "weekly",  priority: 0.72 },
  { path: "/rasprodano",         changeFrequency: "weekly",  priority: 0.50 },
];

const LEGAL_ROUTES: Array<{ path: string }> = [
  { path: "/uslovi-koristenja" },
  { path: "/politika-privatnosti" },
  { path: "/odricanje-odgovornosti" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogPosts();
  const now = new Date();

  return [
    ...HIGH_PRIORITY_ROUTES.map(({ path, changeFrequency, priority }) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency,
      priority,
    })),
    ...LEGAL_ROUTES.map(({ path }) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.75,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
    })),
  ];
}
