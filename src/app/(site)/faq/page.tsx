import Link from "next/link";
import { IndependenceNotice } from "@/components/site/independence-notice";
import { RelatedGuides } from "@/components/site/related-guides";
import { FaqList } from "@/components/site/faq-list";
import { SectionHeading } from "@/components/site/section-heading";
import { StructuredData } from "@/components/site/structured-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildBreadcrumbSchema, buildFaqSchema, buildMetadata } from "@/lib/metadata";
import { getFaqItems } from "@/lib/public-data";
import { absoluteUrl } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Često postavljana pitanja o rezervaciji ulaznica za Dino Merlin Koševo",
  description:
    "Odgovori na sva pitanja o privatnoj rezervaciji Parter Zona 2: cijena ulaznica, potvrda zahtjeva, lično preuzimanje u Sarajevu, sigurnost kupovine i povrat novca.",
  path: "/faq",
  keywords: [
    "pitanja rezervacija ulaznice dino merlin",
    "dino merlin kosevo cijena ulaznice",
    "sigurna kupovina ulaznica sarajevo",
    "preuzimanje ulaznica uzivo sarajevo",
    "povrat ulaznica dino merlin",
  ],
});

export default async function FaqPage() {
  const faqs = await getFaqItems();

  return (
    <section className="container-shell py-16">
      <StructuredData data={buildFaqSchema(faqs)} />
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Početna", url: absoluteUrl("/") },
          { name: "FAQ", url: absoluteUrl("/faq") },
        ])}
      />

      <Badge>FAQ</Badge>
      <SectionHeading
        size="compact"
        title="Pitanja koja kupci najčešće imaju prije slanja zahtjeva"
        description="Odgovori su napisani da unaprijed uklone sumnju oko cijene, potvrde, preuzimanja, plaćanja i stvarne prirode ove usluge."
      />

      <div className="mt-8">
        <IndependenceNotice className="border-primary/12 bg-primary/[0.05]" />
      </div>

      <div className="mt-10">
        <FaqList items={faqs} />
      </div>

      <div className="mt-10">
        <RelatedGuides
          title="Ako vam treba još konteksta"
          items={[
            {
              title: "Kako funkcioniše",
              description: "Pogledajte tačan redoslijed koraka od zahtjeva do ličnog preuzimanja.",
              href: "/kako-funkcionise",
            },
            {
              title: "Kontakt",
              description: "Direktni kanali za brži odgovor i Sarajevo dogovor.",
              href: "/kontakt",
            },
            {
              title: "Rezervacija",
              description: "Kada ste spremni, pošaljite kratak zahtjev bez online plaćanja.",
              href: "/rezervacija",
            },
          ]}
        />
      </div>

      <Card className="mt-10 section-surface-editorial">
        <CardContent className="flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.18em] text-primary">Ako vam treba brz odgovor</p>
            <h2 className="mt-3 text-4xl text-white">Pošaljite zahtjev ili otvorite direktan kontakt</h2>
            <p className="mt-4 text-sm leading-8 text-zinc-300">
              Ako su vam osnovne dileme riješene, naredni korak je jednostavan: pošaljite zahtjev za rezervaciju ili nas kontaktirajte direktno radi bržeg dogovora.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/rezervacija">Pošalji zahtjev</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/kontakt">Kontakt</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
