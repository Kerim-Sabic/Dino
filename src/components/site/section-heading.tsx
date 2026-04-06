import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  size?: "default" | "compact" | "hero";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  size = "default",
}: SectionHeadingProps) {
  const titleClassName =
    size === "hero"
      ? "mt-4 text-balance text-5xl leading-[0.95] font-semibold text-white sm:text-6xl"
      : size === "compact"
        ? "mt-3 text-balance text-[1.875rem] leading-[1.02] font-semibold text-white sm:text-4xl"
        : "mt-4 text-balance text-[2.25rem] leading-[1.02] font-semibold text-white sm:text-5xl";

  const descriptionClassName =
    size === "compact"
      ? "mt-3 max-w-2xl text-pretty text-sm leading-[1.85] text-muted"
      : "mt-4 max-w-2xl text-pretty text-base leading-[1.85] text-muted";

  return (
    <div
      className={cn(
        "max-w-3xl",
        size === "hero" && "max-w-4xl",
        align === "center" && "mx-auto text-center",
      )}
    >
      {eyebrow ? (
        <span className="eyebrow">
          {eyebrow}
        </span>
      ) : null}
      <h2 className={titleClassName}>{title}</h2>
      {description ? <p className={descriptionClassName}>{description}</p> : null}
    </div>
  );
}
