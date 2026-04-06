import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-[200ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] disabled:pointer-events-none disabled:opacity-40 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.97]",
  {
    variants: {
      variant: {
        /* Primary — warm amber, feels like a lit stage spotlight */
        default:
          "border border-primary/20 bg-primary text-[#140c00] font-bold shadow-[0_12px_28px_rgba(200,154,72,0.22),0_2px_6px_rgba(200,154,72,0.14)] hover:-translate-y-px hover:bg-[#d4a850] hover:shadow-[0_18px_40px_rgba(200,154,72,0.28)]",
        /* Secondary — glass dark surface */
        secondary:
          "border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.025))] text-[#ede5d4] shadow-[0_6px_18px_rgba(0,0,0,0.22)] hover:-translate-y-px hover:border-white/[0.14] hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04))]",
        /* Quiet — text-only, minimal */
        quiet:
          "border border-transparent bg-transparent text-zinc-400 hover:bg-white/[0.05] hover:text-white",
        ghost:
          "border border-transparent bg-transparent text-[#ede5d4] hover:bg-white/[0.05]",
        destructive:
          "bg-destructive text-white shadow-[0_6px_18px_rgba(224,92,102,0.22)] hover:bg-[#ee7078] hover:-translate-y-px",
        outline:
          "border border-primary/24 bg-primary/[0.06] text-primary hover:-translate-y-px hover:border-primary/36 hover:bg-primary/[0.10]",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-8 text-[0.9375rem]",
        xl: "h-16 px-10 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
