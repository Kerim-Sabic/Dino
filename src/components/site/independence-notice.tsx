import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface IndependenceNoticeProps {
  className?: string;
  compact?: boolean;
}

export function IndependenceNotice({ className, compact = false }: IndependenceNoticeProps) {
  return (
    <div
      className={cn(
        "rounded-[18px] border border-primary/[0.12] bg-[linear-gradient(145deg,rgba(200,154,72,0.07),rgba(10,8,18,0.96))]",
        compact ? "px-4 py-3.5" : "px-4 py-4 sm:px-5",
        className,
      )}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={cn(
            "shrink-0 rounded-[10px] bg-primary/[0.10] text-primary ring-1 ring-primary/10",
            compact
              ? "flex h-7 w-7 items-center justify-center"
              : "flex h-8 w-8 items-center justify-center",
          )}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-200">Važno: ovo nije zvanična prodaja</p>
          <p className={cn("text-sm text-zinc-500", compact ? "mt-0.5 leading-[1.6]" : "mt-1 leading-[1.7]")}>
            Nezavisna privatna rezervacija fizičkih ulaznica. Zahtjev ide online, a potvrda i
            završetak kupovine isključivo uživo u Sarajevu.
          </p>
        </div>
      </div>
    </div>
  );
}
