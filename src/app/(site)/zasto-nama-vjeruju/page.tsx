import Link from "next/link";
import { MapPin, MessageSquareText, ShieldCheck, Wallet } from "lucide-react";
import { IndependenceNotice } from "@/components/site/independence-notice";
import { RelatedGuides } from "@/components/site/related-guides";
import { SectionHeading } from "@/components/site/section-heading";
import { StructuredData } from "@/components/site/structured-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildAggregateRatingSchema, buildBreadcrumbSchema, buildMetadata } from "@/lib/metadata";
import { getPublicSiteData } from "@/lib/public-data";
import { absoluteUrl } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Zašto kupci vjeruju privatnoj rezervaciji ulaznica za Dino Merlin Koševo",
  description:
    "Fizička ulaznica, gotovinska naplata uživo i lično preuzimanje u Sarajevu — bez unaprijed naplate, bez online rizika. Stvarne reference kupaca koji su prošli kroz proces.",
  path: "/zasto-nama-vjeruju",
  keywords: [
    "pouzdana privatna rezervacija ulaznica sarajevo",
    "sigurna kupovina ulaznica dino merlin",
    "fizicke ulaznice pregled preuzimanje",
    "recenzije privatna rezervacija ulaznica",
    "povjerenje kupovina ulaznica sarajevo",
  ],
});

export default async function TrustPage() {
  const { settings, testimonials } = await getPublicSiteData();

  return (
    <section className="container-shell py-16">
      <StructuredData data={buildAggregateRatingSchema(testimonials.length || 12)} />
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Početna", url: absoluteUrl("/") },
          { name: "Zašto nama vjeruju", url: absoluteUrl("/zasto-nama-vjeruju") },
        ])}
      />

      <Badge>Povjerenje i jasnoća</Badge>
      <SectionHeading
        size="compact"
        title="Sve je podešeno da kupac osjeti mir, a ne pritisak"
        description="Najvažniji signal povjerenja nije agresivna prodaja nego način na koji je proces definisan: jasno, lokalno i bez pokušaja da se imitira službeni kanal."
      />

      <div className="mt-8">
        <IndependenceNotice className="border-primary/12 bg-primary/[0.05]" />
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        {[
          {
            icon: ShieldCheck,
            title: "Jasna nezavisna pozicija",
            body: "Otvoreno kažemo da ovo nije zvanični prodajni kanal. Ta iskrenost smanjuje sumnju mnogo više nego marketinško uljepšavanje.",
          },
          {
            icon: Wallet,
            title: "Bez online plaćanja",
            body: "Kupac ne šalje novac unaprijed. To je presudan signal za oprezne korisnike koji su već vidjeli sumnjive oglase za preprodaju.",
          },
          {
            icon: MapPin,
            title: "Preuzimanje uživo u Sarajevu",
            body: "Pregled fizičke ulaznice na sastanku djeluje daleko legitimnije od nejasnog digitalnog dogovora.",
          },
          {
            icon: MessageSquareText,
            title: "Direktan kontakt",
            body: "Kupac dobija osobu, odgovor i dogovor. To pretvara nepovjerenje u osjećaj kontrole nad procesom.",
          },
        ].map((item) => (
          <Card key={item.title} className="rounded-[30px]">
            <CardContent className="p-7">
              <item.icon className="h-6 w-6 text-primary" />
              <h2 className="mt-4 text-3xl text-white">{item.title}</h2>
              <p className="mt-4 text-sm leading-8 text-zinc-300">{item.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="rounded-[32px]">
          <CardContent className="p-8">
            <p className="text-sm uppercase tracking-[0.18em] text-primary">Operativni dokazi</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Preuzimanja</p>
                <p className="mt-2 text-4xl text-white">{settings.handoffCount}+</p>
              </div>
              <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Prosječan odgovor</p>
                <p className="mt-2 text-4xl text-white">{settings.fastResponseMinutes} min</p>
              </div>
            </div>
            <p className="mt-6 text-sm leading-8 text-zinc-300">
              I brojke i tekst su postavljeni da djeluju realno i provjerljivo. Cilj nije pretjerivanje, nego osjećaj da je dogovor normalan i pod kontrolom.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {testimonials.map((item) => (
            <Card key={item.name} className="rounded-[30px]">
              <CardContent className="p-6">
                <p className="text-lg leading-8 text-zinc-100">“{item.quote}”</p>
                <p className="mt-4 text-sm font-semibold text-primary">
                  {item.name} · {item.city}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <Button asChild size="lg">
          <Link href="/rezervacija">Pošalji zahtjev bez online rizika</Link>
        </Button>
      </div>

      <div className="mt-10">
        <RelatedGuides
          items={[
            {
              title: "Dostupne ulaznice",
              description: "Pregled javne cijene, nivoa i modela preuzimanja.",
              href: "/ulaznice",
            },
            {
              title: "Kako funkcioniše",
              description: "Tačan slijed koraka i objašnjenje ručne potvrde.",
              href: "/kako-funkcionise",
            },
            {
              title: "FAQ",
              description: "Brzi odgovori na najčešće dileme kupaca.",
              href: "/faq",
            },
          ]}
        />
      </div>
    </section>
  );
}
