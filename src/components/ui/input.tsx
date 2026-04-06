import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-12 w-full rounded-2xl border border-white/10 bg-white/[0.045] px-4 text-sm text-foreground placeholder:text-zinc-500 outline-none transition-[border-color,box-shadow,background] duration-200 hover:border-white/16 focus:border-primary/55 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(228,185,110,0.12)]",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
