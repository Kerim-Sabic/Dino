import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, MapPin, Shield, Ticket, Wallet } from "lucide-react";
import { SiteMode } from "@prisma/client";
import { ReservationForm } from "@/components/site/reservation-form";
import { IndependenceNotice } from "@/components/site/independence-notice";
import { StructuredData } from "@/components/site/structured-data";
import { Badge } from "@/components/ui/badge";
import { buildBreadcrumbSchema, buildMetadata, buildServiceSchema } from "@/lib/metadata";
import { formatCurrency } from "@/lib/format";
import { getPublicSiteData } from "@/lib/public-data";
import { absoluteUrl } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Rezervacija ulaznica za Dino Merlin Koševo | Pošalji zahtjev za Parter Zona 2",
  description:
    "Rezerviši Parter Zona 2 za Dino Merlin na Koševu. Popuni kratku formu, dobij direktan odgovor u roku od 30 minuta. Bez online plaćanja — preuzimanje i plaćanje uživo u Sarajevu.",
  path: "/rezervacija",
  keywords: [
    "rezervacija ulaznica dino merlin",
    "dino merlin kosevo rezervacija",
    "kupiti ulaznice dino merlin sarajevo",
    "parter zona 2 rezervacija",
    "privatna rezervacija ulaznica sarajevo",
    "ulaznice dino merlin bez online placanja",
  ],
});

const trustPoints = [
  {
    icon: Wallet,
    title: "Bez online plaćanja",
    body: "Forma ne završava kupovinu. Nema unosa kartice ni avansne uplate.",
  },
  {
    icon: Ticket,
    title: "Fizička ulaznica",
    body: "Pregledate ulaznicu u ruku prije nego što se kupovina završi.",
  },
  {
    icon: MapPin,
    title: "Sarajevo dogovor",
    body: "Lokacija i termin potvrđuju se ručno, direktnim kontaktom.",
  },
  {
    icon: Shield,
    title: "Ručna obrada",
    body: "Svaki zahtjev se obrađuje individualno — nema automatizacije.",
  },
];

const afterSteps = [
  "Pregledamo vaš zahtjev i aktuelnu dostupnost.",
  "Javljamo se ručno putem odabranog kanala i dogovaramo detalje.",
  "Dogovorite Sarajevo lokaciju, pregledate ulaznicu i tek tada završavate kupovinu.",
];

export default async function ReservationPage() {
  const { settings, pricing, meetupZones } = await getPublicSiteData();
  const soldOut = settings.siteMode === SiteMode.SOLD_OUT || !pricing.allowReservations;

  return (
    <>
    <StructuredData data={buildServiceSchema()} />
    <StructuredData data={buildBreadcrumbSchema([
      { name: "Početna", url: absoluteUrl("/") },
      { name: "Rezervacija", url: absoluteUrl("/rezervacija") },
    ])} />
    <section className="container-shell py-10 sm:py-14 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-start">
        {/* ─── Left: form + intro ─── */}
        <div className="space-y-7">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Privatna rezervacija</Badge>
              <Badge variant="secondary">Parter Zona 2</Badge>
            </div>
            <h1 className="text-balance text-4xl font-semibold leading-[0.96] text-white sm:text-5xl">
              {soldOut ? "Lista čekanja za Parter Zona 2" : "Zahtjev za rezervaciju"}
            </h1>
            <p className="max-w-xl text-base leading-8 text-zinc-300">
              {soldOut
                ? "Javni kontingent je trenutno zatvoren. Vaš kontakt ide na prioritetnu listu za oslobođene rezervacije i naredni otvoreni nivo."
                : "Forma bilježi vaš zahtjev. Bez kartice, bez automatske potvrde i bez online naplate. Javljamo se ručno i potvrđujemo dostupnost."}
            </p>
          </div>

          <IndependenceNotice />

          <div className="rounded-[32px] border border-white/10 bg-white/[0.025] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)] backdrop-blur-md sm:p-8">
            <Suspense>
              <ReservationForm meetupZones={meetupZones} pricing={pricing} settings={settings} />
            </Suspense>
          </div>
        </div>

        {/* ─── Right: sticky context sidebar ─── */}
        <div className="space-y-4 lg:sticky lg:top-24">
          {/* Price snapshot */}
          <div className="rounded-[28px] border border-primary/18 bg-[linear-gradient(160deg,rgba(228,186,122,0.10),rgba(255,255,255,0.02))] p-5 shadow-[0_16px_50px_rgba(0,0,0,0.18)]">
            <p className="text-xs uppercase tracking-[0.22em] text-primary">Aktuelni nivo</p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Parter Zona 2</p>
                <p className="mt-1.5 text-[2.2rem] font-semibold leading-none text-white">
                  {soldOut ? "Rasprodano" : formatCurrency(pricing.currentPrice)}
                </p>
              </div>
              {pricing.nextTier && !soldOut ? (
                <div className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-right">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Sljedeći</p>
                  <p className="mt-0.5 text-base font-semibold text-zinc-200">
                    {formatCurrency(pricing.nextTier.price)}
                  </p>
                </div>
              ) : null}
            </div>
            {pricing.urgencyLabel ? (
              <p className="mt-3 text-sm leading-6 text-zinc-300">{pricing.urgencyLabel}</p>
            ) : null}
          </div>

          {/* Why it's safer */}
          <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Zašto je ovo mirniji put</p>
            <div className="mt-4 space-y-4">
              {trustPoints.map((point) => (
                <div key={point.title} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <point.icon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{point.title}</p>
                    <p className="mt-0.5 text-sm leading-6 text-zinc-400">{point.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* After-submit steps */}
          <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Šta se dešava dalje</p>
            <div className="relative mt-4 space-y-0">
              {afterSteps.map((step, i) => (
                <div key={i} className="relative flex items-start gap-3 pb-4 last:pb-0">
                  {i < afterSteps.length - 1 && (
                    <div className="absolute left-[0.9rem] top-5 h-full w-px bg-primary/15" />
                  )}
                  <div className="relative z-10 mt-0.5 flex h-[1.125rem] w-[1.125rem] shrink-0 items-center justify-center rounded-full border border-primary/30 bg-[#0a090c] text-[9px] font-semibold text-primary">
                    {i + 1}
                  </div>
                  <p className="text-sm leading-6 text-zinc-300">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="px-1 text-center text-xs leading-6 text-zinc-500">
            Imate pitanja?{" "}
            <Link href="/faq" className="text-primary transition-colors hover:text-white">
              Pogledajte FAQ
            </Link>{" "}
            ili{" "}
            <Link href="/kontakt" className="text-primary transition-colors hover:text-white">
              kontaktirajte nas direktno
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
    </>
  );
}
