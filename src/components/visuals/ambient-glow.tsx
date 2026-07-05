"use client";

import { cn } from "@/lib/utils";

type AmbientGlowProps = {
  className?: string;
  intensity?: "subtle" | "bold";
};

const glowOrbs = [
  {
    id: "orb-1",
    className:
      "left-[-14%] top-[-18%] h-[26rem] w-[26rem] bg-[radial-gradient(circle,oklch(0.84_0.13_82/.22)_0%,transparent_66%)]",
  },
  {
    id: "orb-2",
    className:
      "right-[-18%] top-[10%] h-[24rem] w-[24rem] bg-[radial-gradient(circle,oklch(0.47_0.08_149/.16)_0%,transparent_68%)]",
  },
  {
    id: "orb-3",
    className:
      "left-[22%] bottom-[-26%] h-[22rem] w-[22rem] bg-[radial-gradient(circle,oklch(0.62_0.12_34/.18)_0%,transparent_72%)]",
  },
];

export function AmbientGlow({ className, intensity = "subtle" }: AmbientGlowProps) {
  const opacity = intensity === "bold" ? "opacity-95" : "opacity-70";

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", opacity, className)}>
      {glowOrbs.map((orb) => (
        <div
          key={orb.id}
          className={cn("absolute rounded-full blur-3xl", orb.className)}
        />
      ))}

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,oklch(0.12_0.03_78/.58)_100%)]" />
    </div>
  );
}
