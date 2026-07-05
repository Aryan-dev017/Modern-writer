import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = {
  primary:
    "border border-amber-200/25 bg-[linear-gradient(180deg,rgba(251,223,162,0.96),rgba(196,137,63,0.88))] text-stone-950 shadow-[0_16px_28px_rgba(63,38,18,0.32),inset_0_1px_0_rgba(255,248,232,0.55)] hover:brightness-105",
  ghost: "bg-transparent text-foreground hover:bg-amber-950/20 hover:text-white",
  outline:
    "border border-amber-200/20 bg-[linear-gradient(180deg,rgba(255,248,232,0.08),rgba(122,82,39,0.12))] text-foreground hover:bg-amber-950/20",
} as const;

const buttonSizes = {
  sm: "h-9 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-6 text-sm",
} as const;

type ButtonVariant = keyof typeof buttonVariants;
type ButtonSize = keyof typeof buttonSizes;

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium tracking-wide transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";
