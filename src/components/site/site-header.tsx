import Link from "next/link";
import { Menu, MessageCircleMore } from "lucide-react";
import { legalNavigation, siteNavigation } from "@/lib/constants";
import type { SiteSettingsData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/contact";

interface SiteHeaderProps {
  settings: SiteSettingsData;
}

const primaryNavigation = [
  { href: "/ulaznice", label: "Ulaznice" },
  { href: "/kako-funkcionise", label: "Kako funkcioniše" },
  { href: "/faq", label: "FAQ" },
  { href: "/kontakt", label: "Kontakt" },
];

export function SiteHeader({ settings }: SiteHeaderProps) {
  const whatsappUrl = buildWhatsAppLink(
    settings.whatsappNumber,
    "Zdravo, želim provjeriti dostupnost za Parter Zona 2.",
  );

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[rgba(6,5,13,0.88)] backdrop-blur-2xl">
      <div className="container-shell flex h-16 items-center justify-between gap-4">

        {/* Wordmark */}
        <Link href="/" className="group min-w-0 shrink-0">
          <p className="truncate font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-primary transition-opacity group-hover:opacity-75">
            Dino Merlin Koševo
          </p>
          <p className="truncate font-sans text-[10px] uppercase tracking-[0.16em] text-zinc-700">
            Privatna rezervacija
          </p>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center lg:flex">
          {primaryNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 font-sans text-[13px] text-zinc-500 transition-colors hover:text-zinc-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button asChild variant="quiet" size="sm" className="hidden text-xs md:inline-flex">
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </Button>
          <Button asChild size="sm">
            <Link href="/rezervacija">
              <MessageCircleMore className="h-3.5 w-3.5" />
              Rezervacija
            </Link>
          </Button>

          {/* Mobile menu */}
          <details className="relative lg:hidden">
            <summary className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.03] text-zinc-400 transition-colors hover:bg-white/[0.06] [&::-webkit-details-marker]:hidden">
              <Menu className="h-3.5 w-3.5" />
            </summary>

            <div className="absolute right-0 top-11 w-[min(90vw,320px)] rounded-[22px] border border-white/[0.08] bg-[#0a0818]/97 p-4 shadow-[0_32px_80px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
              {/* Trust note */}
              <div className="rounded-[14px] border border-primary/12 bg-primary/[0.07] px-3.5 py-3 text-xs leading-6 text-zinc-300">
                Fizičke ulaznice · lično preuzimanje u Sarajevu · bez online plaćanja.
              </div>

              <div className="mt-3 space-y-0.5">
                {siteNavigation.slice(0, 6).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-xl px-3 py-2.5 font-sans text-sm text-zinc-300 transition-colors hover:bg-white/[0.05] hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-3 border-t border-white/[0.06] pt-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl border border-primary/18 bg-primary/[0.08] px-3 py-2.5 font-sans text-sm font-semibold text-primary transition-colors hover:bg-primary/[0.13]"
                >
                  Otvori WhatsApp
                </a>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 px-1">
                  {legalNavigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-[10px] uppercase tracking-[0.14em] text-zinc-700 transition-colors hover:text-zinc-400"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
