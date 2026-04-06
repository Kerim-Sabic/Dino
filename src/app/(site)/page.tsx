import Link from "next/link";
import { ArrowRight, Check, Quote } from "lucide-react";
import { BlogCard } from "@/components/site/blog-card";
import { FaqList } from "@/components/site/faq-list";
import { IndependenceNotice } from "@/components/site/independence-notice";
import { PricingLadder } from "@/components/site/pricing-ladder";
import { SectionHeading } from "@/components/site/section-heading";
import { StructuredData } from "@/components/site/structured-data";
import { TrustBadgeStrip } from "@/components/site/trust-badge-strip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildWhatsAppLink } from "@/lib/contact";
import { formatCurrency } from "@/lib/format";
import {
  buildBreadcrumbSchema,
  buildEventSchema,
  buildFaqSchema,
  buildMetadata,
  buildOrganizationSchema,
} from "@/lib/metadata";
import { getPublicSiteData } from "@/lib/public-data";
import { absoluteUrl } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Dino Merlin Koševo ulaznice | Privatna rezervacija Parter Zona 2 u Sarajevu",
  description:
    "Privatna rezervacija fizičkih ulaznica za Dino Merlin na Stadionu Koševo. Parter Zona 2, lično preuzimanje u Sarajevu, bez online plaćanja. Pošalji zahtjev danas.",
  path: "/",
  canonical: true,
  keywords: [
    "dino merlin kosevo ulaznice",
    "dino merlin sarajevo 2025",
    "dino merlin kosevo 2025",
    "parter zona 2 ulaznice",
    "fizicke ulaznice sarajevo",
    "rezervacija ulaznica sarajevo",
    "dino merlin ulaznice kupovina",
    "ulaznice kosevo sarajevo",
    "privatna rezervacija ulaznica",
    "dino merlin koncert sarajevo",
  ],
});

const steps = [
  {
    title: "Pošaljete zahtjev",
    body: "Bez kartice i bez online naplate. Forma bilježi vaš kontakt i dostupnost.",
  },
  {
    title: "Dobijete ručni odgovor",
    body: "Javljamo se direktno putem WhatsAppa, poziva ili Instagrama.",
  },
  {
    title: "Preuzimanje uživo",
    body: "Pregledate fizičku ulaznicu u Sarajevu i tek tada završavate kupovinu.",
  },
];

const cardFeatures = [
  "Fizička ulaznica — pregled u ruku prije kupovine",
  "Bez online plaćanja ili avansne uplate",
  "Ručna potvrda, nema automatizacije",
  "Lično preuzimanje u Sarajevu",
];

export default async function HomePage() {
  const {
    settings,
    homepage,
    trustBadges,
    testimonials,
    faqs,
    pricing,
    priceTiers,
    blogPosts,
  } = await getPublicSiteData();

  const whatsappUrl = buildWhatsAppLink(
    settings.whatsappNumber,
    "Zdravo, želim provjeriti dostupnost za Parter Zona 2.",
  );

  const [featuredTestimonial, ...otherTestimonials] = testimonials;

  return (
    <>
      <StructuredData data={buildOrganizationSchema(settings)} />
      <StructuredData data={buildEventSchema()} />
      <StructuredData data={buildBreadcrumbSchema([{ name: "Početna", url: absoluteUrl("/") }])} />
      <StructuredData data={buildFaqSchema(faqs.slice(0, 4))} />

      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section className="container-shell pt-12 pb-8 sm:pt-16 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:items-start xl:grid-cols-[1fr_400px]">

          {/* ── Hero left ── */}
          <div className="space-y-9 lg:pt-2">

            {/* Eyebrows */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{homepage.heroEyebrow}</Badge>
              <Badge variant="secondary">Parter Zona 2</Badge>
            </div>

            {/* Headline */}
            <div className="space-y-5">
              <h1 className="max-w-[18ch] text-balance text-[2.75rem] leading-[0.92] text-white sm:text-[3.5rem] lg:text-[4.25rem]">
                {homepage.heroTitle}
              </h1>
              <p className="max-w-[50ch] text-pretty text-[1.0625rem] leading-[1.8] text-zinc-400">
                {homepage.heroDescription}
              </p>
            </div>

            {/* ── Stat strip replaces the old 3-card grid ── */}
            <div className="stat-strip">
              <div className="stat-strip-item">
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">Cijena</p>
                <p className="mt-1.5 text-[1.375rem] font-semibold leading-none text-white">
                  {pricing.source === "sold_out"
                    ? "Rasprodano"
                    : formatCurrency(pricing.currentPrice)}
                </p>
              </div>
              <div className="stat-strip-item">
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">Preuzimanje</p>
                <p className="mt-1.5 text-[1.375rem] font-semibold leading-none text-white">
                  Sarajevo
                </p>
              </div>
              <div className="stat-strip-item">
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">Plaćanje</p>
                <p className="mt-1.5 text-[1.375rem] font-semibold leading-none text-white">
                  Na sastanku
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/rezervacija">
                  {homepage.heroPrimaryLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <a href={whatsappUrl} target="_blank" rel="noreferrer">
                  WhatsApp upit
                </a>
              </Button>
            </div>

            {/* Micro links */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link href="/ulaznice" className="text-primary transition-colors hover:text-white">
                Dostupnost i cjenovni nivoi →
              </Link>
              <Link href="/kako-funkcionise" className="text-zinc-500 transition-colors hover:text-zinc-300">
                Kako funkcioniše preuzimanje
              </Link>
            </div>

            <IndependenceNotice />
          </div>

          {/* ── Hero right — premium offer card ── */}
          <div className="offer-card lg:sticky lg:top-24">

            {/* Price block */}
            <div className="relative overflow-hidden px-7 pb-6 pt-7">
              {/* Ambient gold glow behind the price */}
              <div className="pointer-events-none absolute inset-x-0 -top-8 h-40 bg-[radial-gradient(ellipse_70%_80%_at_50%_0%,rgba(212,168,90,0.13),transparent)]" />

              <div className="relative">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                    Parter Zona 2
                  </p>
                  <span className="eyebrow">Aktivno</span>
                </div>

                {/* Big price */}
                <p className="text-[3.5rem] font-semibold leading-none tracking-tight text-white sm:text-[4rem]">
                  {pricing.source === "sold_out"
                    ? "—"
                    : formatCurrency(pricing.currentPrice)}
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-primary">
                  {pricing.priceLabel}
                </p>

                {pricing.urgencyLabel && (
                  <p className="mt-4 text-sm leading-[1.75] text-zinc-400">
                    {pricing.urgencyLabel}
                  </p>
                )}

                {/* Next tier hint */}
                {pricing.nextTier && pricing.source !== "sold_out" && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2">
                    <p className="text-xs text-zinc-500">
                      Sljedeći nivo:{" "}
                      <span className="font-semibold text-zinc-300">
                        {formatCurrency(pricing.nextTier.price)}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="gold-rule mx-7" />

            {/* Feature checklist */}
            <div className="px-7 py-5">
              <p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                Zašto je ovo sigurnije
              </p>
              <div className="space-y-3">
                {cardFeatures.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/15">
                      <Check className="h-2.5 w-2.5 text-primary" />
                    </div>
                    <p className="text-sm leading-[1.6] text-zinc-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="gold-rule mx-7" />

            {/* Steps */}
            <div className="px-7 py-5">
              <p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                Kako izgleda proces
              </p>
              <div className="space-y-4">
                {steps.map((step, i) => (
                  <div key={step.title} className="flex items-start gap-3.5">
                    <span className="mt-[3px] shrink-0 text-[11px] font-bold tabular-nums text-primary/60">
                      0{i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{step.title}</p>
                      <p className="mt-0.5 text-xs leading-[1.7] text-zinc-500">{step.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card CTA */}
            <div className="px-7 pb-7 pt-1">
              <Button asChild size="lg" className="w-full">
                <Link href="/rezervacija">
                  {homepage.heroPrimaryLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <p className="mt-3 text-center text-[10px] uppercase tracking-[0.16em] text-zinc-700">
                Bez kartice · bez online naplate
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TRUST BADGES
      ══════════════════════════════════════════════ */}
      <section className="container-shell py-6 sm:py-10">
        <TrustBadgeStrip items={trustBadges} />
      </section>

      {/* ══════════════════════════════════════════════
          PRICING + SCARCITY
      ══════════════════════════════════════════════ */}
      <section className="container-shell py-16">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <PricingLadder
            tiers={priceTiers}
            pricing={pricing}
            title="Cijena prati nivo dostupnosti, ne kalendar"
            description={homepage.scarcityDescription}
          />

          <div className="space-y-6">
            <SectionHeading
              eyebrow="Zašto rezervisati sada"
              size="compact"
              title={homepage.scarcityTitle}
            />

            <div className="space-y-2.5">
              {homepage.whyReserveItems.map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-4 rounded-[18px] border border-white/[0.07] bg-white/[0.018] px-5 py-4"
                >
                  <span className="mt-0.5 shrink-0 text-[10px] font-bold text-primary/50">
                    0{index + 1}
                  </span>
                  <p className="text-sm leading-[1.8] text-zinc-300">{item}</p>
                </div>
              ))}
            </div>

            <div className="rounded-[18px] border border-primary/12 bg-primary/[0.06] px-5 py-4 text-sm leading-[1.8] text-zinc-300">
              {pricing.priceMessage}
            </div>

            <Button asChild variant="secondary" size="lg">
              <Link href="/ulaznice">Pogledaj potpunu javnu ponudu</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          HOW IT WORKS + TRUST / TESTIMONIALS
      ══════════════════════════════════════════════ */}
      <section className="container-shell py-16">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">

          {/* How it works */}
          <Card className="section-surface">
            <CardContent className="p-8 sm:p-9">
              <SectionHeading
                eyebrow="Kako funkcioniše"
                size="compact"
                title={homepage.processTitle}
                description={homepage.processIntro}
              />
              <div className="mt-9 space-y-0">
                {steps.map((step, index) => (
                  <div key={step.title} className="relative flex gap-5 pb-8 last:pb-0">
                    {index < steps.length - 1 && (
                      <div className="absolute left-[1.0625rem] top-7 h-full w-px bg-gradient-to-b from-primary/20 to-transparent" />
                    )}
                    <div className="relative z-10 mt-0.5 flex h-[2.125rem] w-[2.125rem] shrink-0 items-center justify-center rounded-full border border-primary/20 bg-[#080710] text-xs font-bold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl text-white">{step.title}</h3>
                      <p className="mt-2 text-sm leading-[1.85] text-zinc-500">{step.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trust + testimonials */}
          <div className="space-y-4">
            <Card className="section-surface-editorial">
              <CardContent className="p-7 sm:p-8">
                <p className="text-[10.5px] uppercase tracking-[0.22em] text-primary">
                  Povjerenje i jasnoća
                </p>
                <h2 className="mt-3 text-balance text-[1.875rem] text-white sm:text-[2.25rem]">
                  {homepage.trustTitle}
                </h2>
                <p className="mt-4 text-sm leading-[1.85] text-zinc-400">{homepage.trustIntro}</p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-[16px] border border-white/[0.07] bg-black/30 p-4">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                      Prosj. odgovor
                    </p>
                    <p className="mt-2 text-[2.25rem] font-semibold leading-none text-white">
                      {settings.fastResponseMinutes}
                      <span className="ml-1 text-base font-normal text-zinc-500">min</span>
                    </p>
                  </div>
                  <div className="rounded-[16px] border border-white/[0.07] bg-black/30 p-4">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                      Preuzimanja
                    </p>
                    <p className="mt-2 text-[2.25rem] font-semibold leading-none text-white">
                      {settings.handoffCount}
                      <span className="ml-0.5 text-base font-normal text-zinc-500">+</span>
                    </p>
                  </div>
                </div>

                {featuredTestimonial ? (
                  <div className="mt-5 rounded-[16px] border border-primary/14 bg-primary/[0.06] p-5">
                    <Quote className="mb-3 h-4 w-4 text-primary/35" />
                    <p className="text-[1.0625rem] leading-[1.75] text-zinc-100">
                      {featuredTestimonial.quote}
                    </p>
                    <p className="mt-4 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-primary">
                      {featuredTestimonial.name} · {featuredTestimonial.city}
                    </p>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {otherTestimonials.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {otherTestimonials.map((t) => (
                  <Card key={t.name} className="section-surface-soft">
                    <CardContent className="p-5">
                      <Quote className="mb-2.5 h-3.5 w-3.5 text-primary/25" />
                      <p className="text-sm leading-[1.8] text-zinc-300">{t.quote}</p>
                      <p className="mt-4 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-primary">
                        {t.name} · {t.city}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FAQ + BLOG
      ══════════════════════════════════════════════ */}
      <section className="container-shell py-16">
        <div className="grid gap-14 lg:grid-cols-[1fr_0.92fr]">
          <div>
            <SectionHeading
              eyebrow="FAQ"
              size="compact"
              title="Najvažniji odgovori prije rezervacije"
              description="Najčešće dileme rješavamo prije slanja zahtjeva — da bi odluka bila mirna i informisana."
            />
            <div className="mt-8">
              <FaqList items={faqs.slice(0, 4)} />
            </div>
            <Button asChild variant="secondary" className="mt-6">
              <Link href="/faq">Pogledaj kompletan FAQ</Link>
            </Button>
          </div>

          <div className="space-y-6">
            <SectionHeading
              eyebrow="Vodiči"
              size="compact"
              title="Korisni tekstovi za Sarajevo kupce"
            />
            <div className="grid gap-3">
              {blogPosts.slice(0, 3).map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════ */}
      <section className="container-shell py-16">
        <div className="section-surface-editorial relative overflow-hidden px-8 py-12 sm:px-12 sm:py-14">
          <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(212,168,90,0.10),transparent_65%)] blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="text-[10.5px] uppercase tracking-[0.24em] text-primary">
                Spreman naredni korak
              </p>
              <h2 className="mt-3 text-balance text-[2rem] text-white sm:text-[2.75rem]">
                {homepage.ctaStripTitle}
              </h2>
              <p className="mt-4 text-base leading-[1.85] text-zinc-400">
                {homepage.ctaStripDescription}
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/rezervacija">
                  Pošalji zahtjev
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <a href={whatsappUrl} target="_blank" rel="noreferrer">
                  WhatsApp upit
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
