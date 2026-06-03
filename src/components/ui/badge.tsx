import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  glow?: boolean;
};

export function Badge({ className, glow = false, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border/80 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground",
        glow && "text-primary shadow-[0_0_22px_oklch(0.62_0.22_285/.32)]",
        className,
      )}
      {...props}
    />
  );
}
