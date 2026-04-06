import { ChevronDown } from "lucide-react";
import type { FaqItemData } from "@/lib/types";

interface FaqListProps {
  items: FaqItemData[];
}

export function FaqList({ items }: FaqListProps) {
  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <details key={item.question} className="faq-item group">
          <summary className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
            <span className="text-[1.0625rem] font-semibold leading-snug text-zinc-200 transition-colors group-open:text-white">
              {item.question}
            </span>
            <ChevronDown className="faq-chevron h-4 w-4 text-zinc-600 group-open:text-primary" />
          </summary>
          <div className="px-5 pb-5">
            <div className="dim-rule mb-4" />
            <p className="text-sm leading-[1.85] text-zinc-500">{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
