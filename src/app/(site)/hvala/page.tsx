import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin, Ticket, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/contact";
import { buildMetadata } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/public-data";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Hvala",
    description:
      "Zahtjev je zaprimljen. Sljedeći korak je ručna potvrda i direktan kontakt za lično preuzimanje u Sarajevu.",
    path: "/hvala",
  }),
  robots: {
    index: false,
    follow: false,
  },
};

const nextSteps = [
  {
    icon: CheckCircle2,
    title: "Pregledamo vaš zahtjev",
    body: "Provjeravamo aktuelnu dostupnost i nivo cijene koji je bio vidljiv u trenutku slanja.",
  },
  {
    icon: Wallet,
    title: "Javljamo se ručno",
    body: "Direktan kontakt putem odabranog kanala — WhatsApp, poziv ili Instagram. Bez automatskih poruka.",
  },
  {
    icon: MapPin,
    title: "Dogovor za preuzimanje",
    body: "Potvrđujemo Sarajevo lokaciju i termin. Plaćanje ide tek pri ličnom sastanku i pregledu ulaznice.",
  },
];

export default async function ThankYouPage() {
  const settings = await getSiteSettings();
  const whatsappUrl = buildWhatsAppLink(
    settings.whatsappNumber,
    "Zdravo, upravo sam poslao zahtjev za rezervaciju. Možete li mi potvrditi dostupnost?",
  );

  return (
    <section className="container-shell py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        {/* Status badge */}
        <div className="flex justify-center">
          <Badge variant="success">Zahtjev zaprimljen</Badge>
        </div>

        {/* Heading */}
        <div className="mt-6 text-center">
          <h1 className="text-balance text-[2.5rem] font-semibold leading-[0.96] text-white sm:text-6xl">
            Hvala. Sada ide ručna potvrda.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base leading-[1.85] text-zinc-300">
            Vaš zahtjev je evidentiran. Sljedeći korak je direktan odgovor putem odabranog kanala i
            dogovor za Sarajevo preuzimanje ako je dostupnost potvrđena.
          </p>
        </div>

        {/* Reminder box */}
        <div className="mt-8 rounded-[24px] border border-primary/16 bg-primary/[0.08] px-5 py-5">
          <div className="flex items-start gap-3">
            <Ticket className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm leading-[1.8] text-zinc-200">
              Popunjena forma{" "}
              <span className="font-semibold text-white">nije automatska kupovina.</span> Nema online
              naplate, a dogovor se završava tek uživo uz pregled fizičke ulaznice.
            </p>
          </div>
        </div>

        {/* What happens next */}
        <div className="mt-8">
          <p className="mb-4 text-center text-[10.5px] uppercase tracking-[0.2em] text-zinc-600">
            Šta se dešava dalje
          </p>
          <div className="relative space-y-0">
            {nextSteps.map((step, i) => (
              <div key={step.title} className="relative flex items-start gap-4 pb-6 last:pb-0">
                {i < nextSteps.length - 1 && (
                  <div className="absolute left-[0.9375rem] top-8 h-full w-px bg-primary/14" />
                )}
                <div className="relative z-10 mt-0.5 flex h-[1.875rem] w-[1.875rem] shrink-0 items-center justify-center rounded-full border border-primary/25 bg-[#09080b]">
                  <step.icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{step.title}</p>
                  <p className="mt-1 text-sm leading-[1.75] text-zinc-400">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              Nastavi na WhatsApp
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/kontakt">Pogledaj kontakt</Link>
          </Button>
        </div>

        {/* Reassurance footnote */}
        <p className="mt-8 text-center text-xs leading-6 text-zinc-600">
          Prosječan odgovor: {settings.fastResponseMinutes} minuta ·{" "}
          {settings.responseTimeText}
        </p>
      </div>
    </section>
  );
}
