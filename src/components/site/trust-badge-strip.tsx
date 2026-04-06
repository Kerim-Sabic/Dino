import { MapPin, ShieldCheck, Ticket, Wallet } from "lucide-react";
import type { TrustBadgeData } from "@/lib/types";

const icons = [ShieldCheck, Wallet, Ticket, MapPin];

interface TrustBadgeStripProps {
  items: TrustBadgeData[];
}

export function TrustBadgeStrip({ items }: TrustBadgeStripProps) {
  return (
    <div className="relative overflow-hidden rounded-[22px] border border-white/[0.065] bg-white/[0.016]">
      {/* Warm top line — stage light bleeding down */}
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent_10%,rgba(200,154,72,0.22)_50%,transparent_90%)]" />

      <div className="grid grid-cols-1 gap-0 divide-y divide-white/[0.05] sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4">
        {items.map((item, index) => {
          const Icon = icons[index % icons.length];
          return (
            <div
              key={item.label}
              className="flex items-start gap-3 px-5 py-5 sm:px-6"
            >
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-primary/[0.09] text-primary ring-1 ring-primary/[0.12]">
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="mt-0.5 text-sm leading-[1.6] text-zinc-600">{item.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
