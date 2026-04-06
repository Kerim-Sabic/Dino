import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import type { PriceTierData, PricingSnapshot } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PricingLadderProps {
  tiers: PriceTierData[];
  pricing: PricingSnapshot;
  title?: string;
  description?: string;
  className?: string;
}

function formatTierRange(tier: PriceTierData) {
  return `${tier.startSoldCount + 1}–${tier.endSoldCount + 1}. ulaznica`;
}

export function PricingLadder({
  tiers,
  pricing,
  title = "Cjenovni nivoi",
  description,
  className,
}: PricingLadderProps) {
  return (
    <section className={cn("section-surface p-6 sm:p-7", className)}>
      <div>
        <p className="text-[10.5px] uppercase tracking-[0.22em] text-primary">Cijene po nivou</p>
        <h3 className="mt-3 text-[1.875rem] text-white sm:text-[2.25rem]">{title}</h3>
        {description ? (
          <p className="mt-3 text-sm leading-[1.85] text-zinc-500">{description}</p>
        ) : null}
      </div>

      <div className="mt-6 space-y-2">
        {tiers.map((tier) => {
          const isCurrent =
            pricing.currentTier?.sortOrder === tier.sortOrder && pricing.source !== "sold_out";
          const isNext =
            pricing.nextTier?.sortOrder === tier.sortOrder && pricing.source !== "sold_out";
          const isPast =
            pricing.currentTier &&
            tier.sortOrder < pricing.currentTier.sortOrder &&
            pricing.source !== "sold_out";

          return (
            <div
              key={tier.sortOrder}
              className={cn(
                "relative flex flex-col gap-2 overflow-hidden rounded-[16px] border px-5 py-4 transition-colors sm:flex-row sm:items-center sm:justify-between",
                isCurrent
                  ? "border-primary/22 bg-primary/[0.07]"
                  : isNext
                    ? "border-white/[0.09] bg-white/[0.03]"
                    : isPast
                      ? "border-white/[0.04] bg-white/[0.01] opacity-45"
                      : "border-white/[0.06] bg-white/[0.013]",
              )}
            >
              {/* Current tier left accent bar */}
              {isCurrent && (
                <div className="absolute left-0 top-0 h-full w-[2px] rounded-l-full bg-primary/60" />
              )}

              <div className="pl-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className={cn("text-sm font-semibold", isCurrent ? "text-white" : "text-zinc-400")}>
                    {tier.publicLabel || tier.name}
                  </p>
                  {isCurrent && <Badge>Aktuelno</Badge>}
                  {isNext && <Badge variant="secondary">Sljedeće</Badge>}
                  {isPast && (
                    <span className="text-[10px] uppercase tracking-[0.14em] text-zinc-700">Zatvoreno</span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-zinc-700">{formatTierRange(tier)}</p>
              </div>

              <p className={cn(
                "text-2xl font-semibold",
                isCurrent ? "text-white" : isNext ? "text-zinc-400" : "text-zinc-600",
              )}>
                {formatCurrency(tier.price)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-[14px] border border-white/[0.06] bg-black/20 px-4 py-4 text-sm leading-[1.75] text-zinc-600">
        Cijena prati zatvoreni nivo inventara, ne datum. Konačna potvrda dolazi ručno.
      </div>
    </section>
  );
}
