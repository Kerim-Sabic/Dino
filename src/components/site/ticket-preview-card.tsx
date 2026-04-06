import { MapPin, Ticket, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { PricingSnapshot, SiteSettingsData } from "@/lib/types";

interface TicketPreviewCardProps {
  settings: SiteSettingsData;
  pricing: PricingSnapshot;
}

export function TicketPreviewCard({ settings, pricing }: TicketPreviewCardProps) {
  return (
    <Card className="section-surface-editorial overflow-hidden">
      <CardContent className="p-0">
        {/* Header with gradient */}
        <div className="relative overflow-hidden border-b border-white/[0.07] px-6 py-7 sm:px-7">
          {/* Background accent */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(228,185,110,0.14),transparent)]" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-xs">
              <Badge>Parter Zona 2</Badge>
              <p className="mt-4 text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                Sarajevo · fizička ulaznica
              </p>
              <h3 className="mt-2.5 text-2xl leading-snug text-white sm:text-3xl">
                Privatna rezervacija bez online plaćanja
              </h3>
              <p className="mt-3 text-sm leading-[1.8] text-zinc-300">
                Jedna kategorija, jasan model i završetak kupovine isključivo uživo u Sarajevu.
              </p>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-black/35 px-5 py-4 sm:min-w-[200px] sm:text-right">
              <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Aktuelno</p>
              <p className="mt-2 text-[2.5rem] font-semibold leading-none text-white">
                {pricing.source === "sold_out" ? "—" : formatCurrency(pricing.currentPrice)}
              </p>
              {pricing.source === "sold_out" ? (
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-rose-400">Rasprodano</p>
              ) : (
                <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-primary">
                  {pricing.priceLabel}
                </p>
              )}
              {pricing.nextTier && pricing.source !== "sold_out" ? (
                <p className="mt-3 text-xs text-zinc-500">
                  Sljedeći nivo: {formatCurrency(pricing.nextTier.price)}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Footer attributes */}
        <div className="grid gap-4 px-6 py-5 sm:grid-cols-3 sm:px-7">
          {[
            {
              icon: Ticket,
              label: "Model",
              value: "Zahtjev za privatnu rezervaciju",
            },
            {
              icon: MapPin,
              label: "Preuzimanje",
              value: settings.primaryMeetupText,
            },
            {
              icon: Wallet,
              label: "Plaćanje",
              value: "Tek pri ličnom sastanku",
            },
          ].map((attr) => (
            <div key={attr.label} className="flex items-start gap-2.5">
              <attr.icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">{attr.label}</p>
                <p className="mt-1 text-sm text-white">{attr.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
