import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  glow?: boolean;
};

export function Badge({ className, glow = false, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-amber-200/20 bg-[linear-gradient(180deg,rgba(255,248,232,0.08),rgba(110,74,34,0.16))] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground",
        glow && "text-amber-100 shadow-[0_0_18px_rgba(243,196,109,0.2)]",
        className,
      )}
      {...props}
    />
  );
}
