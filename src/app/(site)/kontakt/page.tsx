import Link from "next/link";
import { AtSign, MapPin, MessageCircleMore, Phone } from "lucide-react";
import { IndependenceNotice } from "@/components/site/independence-notice";
import { RelatedGuides } from "@/components/site/related-guides";
import { SectionHeading } from "@/components/site/section-heading";
import { StructuredData } from "@/components/site/structured-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildWhatsAppLink } from "@/lib/contact";
import { buildBreadcrumbSchema, buildMetadata } from "@/lib/metadata";
import { getPublicSiteData } from "@/lib/public-data";
import { absoluteUrl } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Kontakt | Privatna rezervacija ulaznica za Dino Merlin Koševo Sarajevo",
  description:
    "Kontaktiraj direktno za provjeru dostupnosti i dogovor. WhatsApp, telefon i Instagram. Lično preuzimanje fizičkih ulaznica u Sarajevu, odgovaramo u roku od 30 minuta.",
  path: "/kontakt",
  keywords: [
    "kontakt ulaznice dino merlin sarajevo",
    "whatsapp rezervacija ulaznice",
    "preuzimanje ulaznica sarajevo kontakt",
    "privatna rezervacija kontakt sarajevo",
  ],
});

export default async function ContactPage() {
  const { settings, meetupZones } = await getPublicSiteData();

  const whatsappUrl = buildWhatsAppLink(
    settings.whatsappNumber,
    "Zdravo, želim provjeriti dostupnost za Parter Zona 2.",
  );

  return (
    <section className="container-shell py-16">
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Početna", url: absoluteUrl("/") },
          { name: "Kontakt", url: absoluteUrl("/kontakt") },
        ])}
      />

      <Badge>Kontakt</Badge>
      <SectionHeading
        size="compact"
        title="Kontakt za brz odgovor i dogovor u Sarajevu"
        description="Ako vam je najvažnije ko odgovara, gdje se preuzima i koliko brzo dolazi potvrda, sve ključne informacije su na jednom mjestu."
      />

      <div className="mt-8">
        <IndependenceNotice className="border-primary/12 bg-primary/[0.05]" />
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: MessageCircleMore, title: "WhatsApp", body: settings.whatsappNumber, href: whatsappUrl },
          { icon: Phone, title: "Telefon", body: settings.phoneNumber, href: `tel:${settings.phoneNumber}` },
          {
            icon: AtSign,
            title: "Instagram",
            body: settings.instagramHandle,
            href: `https://instagram.com/${settings.instagramHandle.replace("@", "")}`,
          },
          { icon: MapPin, title: "Model preuzimanja", body: settings.primaryMeetupText, href: "/rezervacija" },
        ].map((item) => (
          <Card key={item.title} className="rounded-[28px]">
            <CardContent className="p-6">
              <item.icon className="h-5 w-5 text-primary" />
              <p className="mt-4 text-sm uppercase tracking-[0.18em] text-zinc-500">{item.title}</p>
              <p className="mt-2 text-lg text-white">{item.body}</p>
              <Button asChild variant="secondary" className="mt-5">
                <Link href={item.href}>Otvori</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <Card className="section-surface">
          <CardContent className="space-y-4 p-8">
            <h2 className="text-4xl text-white">Preuzimanje u Sarajevu</h2>
            <p className="text-sm leading-8 text-zinc-300">{settings.meetupGuidance}</p>
            <div className="space-y-3">
              {meetupZones.map((zone) => (
                <div key={zone.id} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-base font-semibold text-white">{zone.name}</p>
                  <p className="mt-2 text-sm leading-7 text-zinc-300">{zone.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="section-surface-soft">
          <CardContent className="space-y-5 p-8">
            <h2 className="text-4xl text-white">Radno vrijeme i brzina odgovora</h2>
            <p className="text-sm leading-8 text-zinc-300">{settings.businessHours}</p>
            <p className="text-sm leading-8 text-zinc-300">{settings.responseTimeText}</p>
            <div className="rounded-[24px] border border-primary/15 bg-primary/10 p-5 text-sm leading-7 text-zinc-200">
              Ako dolazite izvan Sarajeva ili dogovarate preko osobe iz grada, napišite to odmah u poruci. Tako brže predlažemo realan termin i lokaciju.
            </div>
            <Button asChild size="lg">
              <Link href="/rezervacija">Idi na rezervaciju</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <RelatedGuides
          items={[
            {
              title: "Rezervacija",
              description: "Kratka forma za slanje zahtjeva i bilježenje cijene koju ste vidjeli.",
              href: "/rezervacija",
            },
            {
              title: "Kako funkcioniše",
              description: "Proces od zahtjeva do ličnog preuzimanja u četiri jasna koraka.",
              href: "/kako-funkcionise",
            },
            {
              title: "Zašto nama vjeruju",
              description: "Zašto je fizičko preuzimanje sigurnije od daljinskog dogovora.",
              href: "/zasto-nama-vjeruju",
            },
          ]}
        />
      </div>
    </section>
  );
}
