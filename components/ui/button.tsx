import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#57d4ff] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "border border-white/10 bg-white/12 px-4 py-2.5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:bg-white/16",
        secondary:
          "border border-white/8 bg-black/20 px-4 py-2.5 text-white/88 hover:bg-white/8",
        ghost: "px-3 py-2 text-white/72 hover:bg-white/6",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />;
}
