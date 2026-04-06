import Link from "next/link";
import { legalNavigation, siteNavigation } from "@/lib/constants";
import { buildWhatsAppLink } from "@/lib/contact";
import type { SiteSettingsData } from "@/lib/types";

interface SiteFooterProps {
  settings: SiteSettingsData;
}

export function SiteFooter({ settings }: SiteFooterProps) {
  const whatsappUrl = buildWhatsAppLink(
    settings.whatsappNumber,
    "Zdravo, želim provjeriti dostupnost za Parter Zona 2.",
  );
  const primaryNavigation = siteNavigation.filter((item) =>
    ["/ulaznice", "/rezervacija", "/kako-funkcionise", "/faq", "/kontakt", "/blog"].includes(item.href),
  );

  return (
    <footer className="relative mt-24 border-t border-white/[0.055]">
      {/* Warm fade at top edge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent_15%,rgba(200,154,72,0.16)_50%,transparent_85%)]" />

      <div className="container-shell grid gap-10 py-14 lg:grid-cols-[1.5fr_0.8fr_0.9fr] lg:gap-16">

        {/* Brand */}
        <div className="space-y-5">
          <div>
            <p className="font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-primary">
              Dino Merlin Koševo
            </p>
            <p className="mt-0.5 font-sans text-[10px] uppercase tracking-[0.16em] text-zinc-800">
              Privatna rezervacija fizičkih ulaznica
            </p>
          </div>
          <p className="max-w-sm text-sm leading-[1.85] text-zinc-600">{settings.shortDisclaimer}</p>
          <div className="rounded-[16px] border border-white/[0.055] bg-white/[0.016] px-4 py-4">
            <p className="text-sm leading-[1.75] text-zinc-600">
              Fizičke ulaznice · ručna potvrda · preuzimanje uživo u Sarajevu.
            </p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-primary/18 bg-primary/[0.07] px-4 py-2 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-primary transition-colors hover:border-primary/28 hover:bg-primary/[0.12]"
          >
            WhatsApp kontakt
          </a>
        </div>

        {/* Nav */}
        <div>
          <p className="font-sans text-[10.5px] font-semibold uppercase tracking-[0.2em] text-zinc-700">
            Navigacija
          </p>
          <nav className="mt-4 space-y-0.5">
            {primaryNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-2 py-2 font-sans text-sm text-zinc-600 transition-colors hover:text-zinc-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact + legal */}
        <div>
          <p className="font-sans text-[10.5px] font-semibold uppercase tracking-[0.2em] text-zinc-700">
            Kontakt
          </p>
          <div className="mt-4 space-y-2 font-sans text-sm text-zinc-700">
            {settings.businessHours && <p>{settings.businessHours}</p>}
            {settings.phoneNumber && <p>{settings.phoneNumber}</p>}
            {settings.instagramHandle && <p>{settings.instagramHandle}</p>}
            {settings.contactEmail && <p>{settings.contactEmail}</p>}
          </div>

          <div className="mt-7">
            <p className="font-sans text-[10.5px] font-semibold uppercase tracking-[0.2em] text-zinc-800">
              Pravni okvir
            </p>
            <div className="mt-3 space-y-1">
              {legalNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-lg px-2 py-1.5 font-sans text-xs text-zinc-700 transition-colors hover:text-zinc-400"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.04]">
        <div className="container-shell flex flex-col items-center justify-between gap-2 py-5 sm:flex-row">
          <p className="font-sans text-[11px] text-zinc-800">
            © {new Date().getFullYear()} · Privatna rezervacija · Sarajevo
          </p>
          <p className="font-sans text-[11px] text-zinc-800">
            Nije zvanična prodaja. Nije povezano s organizatorom.
          </p>
        </div>
      </div>
    </footer>
  );
}
