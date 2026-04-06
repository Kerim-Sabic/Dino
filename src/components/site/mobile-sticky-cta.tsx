"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import type { PricingSnapshot, SiteSettingsData } from "@/lib/types";

interface MobileStickyCtaProps {
  settings: SiteSettingsData;
  pricing?: PricingSnapshot;
  label?: string;
}

const hiddenPaths = new Set([
  "/rezervacija",
  "/hvala",
  "/uslovi-koristenja",
  "/politika-privatnosti",
  "/odricanje-odgovornosti",
]);

export function MobileStickyCta({ settings, pricing, label = "Rezerviši" }: MobileStickyCtaProps) {
  const pathname = usePathname();
  if (pathname && hiddenPaths.has(pathname)) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-4 md:hidden">
      <div className="mx-auto flex max-w-lg items-center gap-3 rounded-[22px] border border-white/[0.07] bg-[#07060e]/95 px-4 py-3 shadow-[0_-2px_0_rgba(255,255,255,0.03),0_24px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
        {/* Warm top highlight */}
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(200,154,72,0.18),transparent)]" />

        <div className="min-w-0 flex-1">
          <p className="truncate font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
            {pricing?.source === "sold_out"
              ? "Lista čekanja · Sarajevo"
              : pricing
                ? `${formatCurrency(pricing.currentPrice)} · Parter Zona 2`
                : "Parter Zona 2 · Sarajevo"}
          </p>
          <p className="mt-0.5 truncate font-sans text-[10.5px] text-zinc-600">
            Fizičke ulaznice · bez online plaćanja
          </p>
        </div>
        <Button asChild size="sm" className="shrink-0">
          <Link href="/rezervacija">
            {label}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
