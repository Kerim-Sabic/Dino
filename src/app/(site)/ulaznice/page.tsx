import Link from "next/link";
import { CalendarClock, Info, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IndependenceNotice } from "@/components/site/independence-notice";
import { PricingLadder } from "@/components/site/pricing-ladder";
import { SectionHeading } from "@/components/site/section-heading";
import { StructuredData } from "@/components/site/structured-data";
import { TicketPreviewCard } from "@/components/site/ticket-preview-card";
import { buildBreadcrumbSchema, buildMetadata } from "@/lib/metadata";
import { formatCurrency, formatDateShort } from "@/lib/format";
import { getPublicSiteData } from "@/lib/public-data";
import { absoluteUrl } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Ulaznice za Dino Merlin Koševo | Parter Zona 2 – aktuelna cijena i dostupnost",
  description:
    "Provjeri dostupnost i aktuelnu cijenu fizičkih ulaznica za Dino Merlin Koševo. Parter Zona 2 – privatna rezervacija uz lično preuzimanje u Sarajevu. Cijena raste po nivoima.",
  path: "/ulaznice",
  keywords: [
    "dino merlin kosevo ulaznice cijena",
    "parter zona 2 cijena",
    "dino merlin ulaznice dostupnost",
    "ulaznice kosevo sarajevo cijena",
    "dino merlin 2025 ulaznice",
  ],
});

export default async function TicketsPage() {
  const { settings, pricing, priceTiers } = await getPublicSiteData();

  return (
    <>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Početna", url: absoluteUrl("/") },
          { name: "Dostupne ulaznice", url: absoluteUrl("/ulaznice") },
        ])}
      />

      {/* Hero */}
      <section className="container-shell py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.98fr_1.02fr] lg:items-start">
          <div className="space-y-6">
            <Badge>Dostupne ulaznice</Badge>
            <SectionHeading
              title="Jedna kategorija, jedna javna cijena i jasan model preuzimanja"
              description="Ovdje je javno prikazana isključivo ponuda za Parter Zona 2. Nema kataloga, nema online kupovine i nema zbunjujućih opcija."
            />

            <IndependenceNotice />

            {/* How to read the price */}
            <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
              <p className="text-[10.5px] uppercase tracking-[0.2em] text-primary">
                Kako čitati javnu cijenu
              </p>
              <div className="mt-4 space-y-3.5">
                {[
                  "Cijena se ne mijenja po datumu nego po količini zatvorenog kontingenta.",
                  "Zahtjev bilježi cijenu koja je bila vidljiva u trenutku slanja.",
                  "Konačna potvrda dolazi ručno, uz dogovor za preuzimanje u Sarajevu.",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0 text-[10px] font-semibold text-primary">
                      0{i + 1}
                    </span>
                    <p className="text-sm leading-[1.8] text-zinc-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/rezervacija">Pošalji zahtjev za Parter Zona 2</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/kontakt">Kontakt i WhatsApp</Link>
              </Button>
            </div>

            <p className="flex items-center gap-2 text-xs text-zinc-600">
              <CalendarClock className="h-3.5 w-3.5 text-primary/60" />
              Zadnje osvježenje: {formatDateShort(new Date())}
            </p>
          </div>

          <TicketPreviewCard pricing={pricing} settings={settings} />
        </div>
      </section>

      {/* Pricing + trust */}
      <section className="container-shell py-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Why this model */}
          <Card className="section-surface-soft">
            <CardContent className="p-6 sm:p-7">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-base font-semibold text-white">
                    Zašto je ovaj model mirniji za kupca
                  </p>
                  <p className="mt-3 text-sm leading-[1.85] text-zinc-400">
                    Kupac vidi da je riječ o fizičkim ulaznicama, da nema online naplate i da se
                    završetak dogovora odvija tek uživo. To je namjerno jednostavnije i sigurnije od
                    tipičnog lokalnog oglasa.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-[20px] border border-primary/14 bg-primary/[0.07] px-5 py-4 text-sm leading-[1.8] text-zinc-300">
                <Info className="mb-2 h-3.5 w-3.5 text-primary" />
                Trenutni nivo je{" "}
                {pricing.source === "sold_out"
                  ? "zatvoren"
                  : formatCurrency(pricing.currentPrice)}
                .{" "}
                {pricing.nextTier
                  ? `Kada se zatvori prag od ${pricing.nextTier.startSoldCount} prodanih, javno se aktivira naredni nivo.`
                  : "Trenutno nema javno istaknutog narednog nivoa."}
              </div>
            </CardContent>
          </Card>

          {/* Pricing ladder */}
          <PricingLadder pricing={pricing} tiers={priceTiers} />
        </div>
      </section>
    </>
  );
}
