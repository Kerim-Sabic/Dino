import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-[0.2rem] text-[10.5px] font-semibold uppercase tracking-[0.18em]",
  {
    variants: {
      variant: {
        default:
          "border border-primary/20 bg-primary/[0.09] text-primary",
        secondary:
          "border border-white/[0.09] bg-white/[0.035] text-zinc-300",
        success:
          "border border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-400",
        danger:
          "border border-rose-500/20 bg-rose-500/[0.08] text-rose-400",
        live:
          "border border-primary/22 bg-primary/[0.10] text-primary",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
