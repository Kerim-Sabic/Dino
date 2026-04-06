import * as React from "react";
import { cn } from "@/lib/utils";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-[11.5px] font-semibold uppercase tracking-[0.16em] text-zinc-400", className)}
      {...props}
    />
  );
}
