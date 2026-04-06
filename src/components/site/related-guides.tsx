import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface RelatedGuideItem {
  title: string;
  description: string;
  href: string;
}

interface RelatedGuidesProps {
  title?: string;
  eyebrow?: string;
  items: RelatedGuideItem[];
}

export function RelatedGuides({
  title = "Povezani vodiči",
  eyebrow = "Istražite dalje",
  items,
}: RelatedGuidesProps) {
  return (
    <section className="rounded-[30px] border border-white/10 bg-white/[0.025] p-6 sm:p-7">
      <p className="text-xs uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
      <h3 className="mt-3 text-3xl text-white">{title}</h3>
      <div className="mt-6 grid gap-0 overflow-hidden rounded-[24px] border border-white/8 bg-black/20 md:grid-cols-3">
        {items.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            className="group px-5 py-5 transition hover:bg-white/[0.04] md:min-h-[180px]"
          >
            <div className={index > 0 ? "border-t border-white/8 pt-5 md:border-t-0 md:border-l md:pl-5" : ""}>
              <p className="text-base font-semibold text-white">{item.title}</p>
              <p className="mt-2 text-sm leading-7 text-zinc-300">{item.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Otvori
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
