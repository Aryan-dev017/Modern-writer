"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type AmbientGlowProps = {
  className?: string;
  intensity?: "subtle" | "bold";
};

const glowOrbs = [
  {
    id: "orb-1",
    className:
      "left-[-14%] top-[-18%] h-[26rem] w-[26rem] bg-[radial-gradient(circle,oklch(0.67_0.22_285/.34)_0%,transparent_65%)]",
    duration: 12,
  },
  {
    id: "orb-2",
    className:
      "right-[-18%] top-[10%] h-[24rem] w-[24rem] bg-[radial-gradient(circle,oklch(0.62_0.18_245/.3)_0%,transparent_68%)]",
    duration: 14,
  },
  {
    id: "orb-3",
    className:
      "left-[22%] bottom-[-26%] h-[22rem] w-[22rem] bg-[radial-gradient(circle,oklch(0.72_0.2_300/.22)_0%,transparent_72%)]",
    duration: 16,
  },
];

export function AmbientGlow({ className, intensity = "subtle" }: AmbientGlowProps) {
  const opacity = intensity === "bold" ? "opacity-95" : "opacity-70";

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", opacity, className)}>
      {glowOrbs.map((orb) => (
        <motion.div
          key={orb.id}
          className={cn("absolute rounded-full blur-3xl", orb.className)}
          animate={{
            scale: [1, 1.08, 0.96, 1],
            x: [0, 22, -16, 0],
            y: [0, -14, 20, 0],
          }}
          transition={{
            duration: orb.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,oklch(0.1_0.015_260/.46)_100%)]" />
    </div>
  );
}
