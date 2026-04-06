import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { IndependenceNotice } from "@/components/site/independence-notice";
import { MarkdownContent } from "@/components/site/markdown-content";
import { StructuredData } from "@/components/site/structured-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateShort } from "@/lib/format";
import {
  buildArticleMetadata,
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildMetadata,
} from "@/lib/metadata";
import { getBlogPostBySlug, getBlogPosts, getSiteSettings } from "@/lib/public-data";
import { absoluteUrl } from "@/lib/utils";

interface BlogArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getBlogPostBySlug(slug), getSiteSettings()]);

  if (!post) {
    return buildMetadata({
      title: "Članak nije pronađen",
      path: `/blog/${slug}`,
      settings,
    });
  }

  return buildArticleMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    path: `/blog/${slug}`,
    keywords: post.tags,
    settings,
    publishedTime: post.publishedAt,
    modifiedTime: post.publishedAt,
  });
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([getBlogPostBySlug(slug), getBlogPosts()]);

  if (!post) {
    notFound();
  }

  const relatedPosts = allPosts
    .filter((item) => item.slug !== post.slug)
    .map((item) => {
      const overlap = item.tags.filter((tag) => post.tags.includes(tag)).length;
      return { item, overlap };
    })
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 2)
    .map((entry) => entry.item);

  return (
    <section className="container-shell py-16">
      <StructuredData data={buildArticleSchema(post)} />
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Početna", url: absoluteUrl("/") },
          { name: "Blog", url: absoluteUrl("/blog") },
          { name: post.title, url: absoluteUrl(`/blog/${post.slug}`) },
        ])}
      />

      <Button asChild variant="secondary">
        <Link href="/blog">
          <ArrowLeft className="h-4 w-4" />
          Nazad na blog
        </Link>
      </Button>

      <div className="mt-8">
        <Badge>Članak</Badge>
        <h1 className="mt-4 max-w-4xl text-balance text-5xl leading-none text-white sm:text-6xl">
          {post.title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">{post.excerpt}</p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-zinc-400">
          <span>{post.readTimeMinutes} min čitanja</span>
          {post.publishedAt ? <span>{formatDateShort(post.publishedAt)}</span> : null}
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        <Card className="rounded-[32px]">
          <CardContent className="p-8">
            <MarkdownContent content={post.contentMarkdown} />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <IndependenceNotice className="border-primary/12 bg-primary/[0.05]" />
          <Card className="rounded-[32px]">
            <CardContent className="space-y-4 p-8">
              <p className="text-sm uppercase tracking-[0.18em] text-primary">Povezani vodiči</p>
              {relatedPosts.length ? (
                <div className="space-y-3">
                  {relatedPosts.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/blog/${related.slug}`}
                      className="block rounded-[22px] border border-white/8 bg-white/[0.03] p-4 transition hover:bg-white/[0.05]"
                    >
                      <p className="text-base font-semibold text-white">{related.title}</p>
                      <p className="mt-2 text-sm leading-7 text-zinc-300">{related.excerpt}</p>
                    </Link>
                  ))}
                </div>
              ) : null}
              <div className="grid gap-2 pt-2 text-sm">
                <Link href="/faq" className="inline-flex items-center gap-2 text-primary transition hover:text-white">
                  Otvori FAQ
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <Link href="/kontakt" className="inline-flex items-center gap-2 text-primary transition hover:text-white">
                  Otvori kontakt
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <Link href="/rezervacija" className="inline-flex items-center gap-2 text-primary transition hover:text-white">
                  Idi na rezervaciju
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        <Card className="rounded-[28px]">
          <CardContent className="p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-primary">Sljedeći korak</p>
            <h2 className="mt-3 text-3xl text-white">Trebate Parter Zona 2?</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              Ako je odluka već donesena, pređite odmah na javnu ponudu i provjerite trenutni nivo cijene.
            </p>
            <Button asChild className="mt-5 w-full">
              <Link href="/ulaznice">Pogledaj ulaznice</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="rounded-[28px]">
          <CardContent className="p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-primary">Treba vam sigurnost</p>
            <h2 className="mt-3 text-3xl text-white">Provjerite kako funkcioniše dogovor</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              Ako vam je važan model preuzimanja, ručna potvrda i odsustvo online plaćanja, pogledajte proces.
            </p>
            <Button asChild variant="secondary" className="mt-5 w-full">
              <Link href="/kako-funkcionise">Kako funkcioniše</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="rounded-[28px]">
          <CardContent className="p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-primary">Brz odgovor</p>
            <h2 className="mt-3 text-3xl text-white">Otvorite direktan kontakt</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              Ako želite brži dogovor, kontakt stranica objedinjuje WhatsApp, poziv i Instagram.
            </p>
            <Button asChild variant="secondary" className="mt-5 w-full">
              <Link href="/kontakt">Kontakt</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
