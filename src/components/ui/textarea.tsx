import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[110px] w-full resize-none rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3.5 text-sm text-foreground placeholder:text-zinc-500 outline-none transition-[border-color,box-shadow,background] duration-200 hover:border-white/16 focus:border-primary/55 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(228,185,110,0.12)]",
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";
