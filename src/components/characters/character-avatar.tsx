"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getMoodPalette } from "@/lib/characters/mood-system";
import { getAvatarRecipe } from "@/lib/characters/avatar-system";
import type { EmotionalTone } from "@/store/character-store";

type CharacterAvatarProps = {
  seed: string;
  mood: EmotionalTone;
  name: string;
  className?: string;
  compact?: boolean;
};

export function CharacterAvatar({ seed, mood, name, className, compact = false }: CharacterAvatarProps) {
  const palette = getMoodPalette(mood);
  const recipe = getAvatarRecipe(seed, mood);
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((piece) => piece[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <motion.div
      whileHover={{ scale: 1.03, rotate: 0.4 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/20",
        palette.glow,
        compact ? "h-16 w-16" : "h-24 w-24",
        className,
      )}
      style={{ backgroundImage: recipe.backgroundImage }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,oklch(0.12_0.02_260/.35)_100%)]" />
      <div className="absolute right-2 top-1 font-serif text-lg text-white/70">{recipe.symbol}</div>

      <div className="absolute bottom-2 left-2">
        <p className={cn("font-serif text-white drop-shadow-lg", compact ? "text-sm" : "text-xl")}>{initials}</p>
      </div>

      <motion.div
        className="pointer-events-none absolute -right-4 -top-4 h-10 w-10 rounded-full blur-xl"
        style={{ backgroundColor: recipe.haloColor }}
        animate={{ opacity: [0.2, 0.5, 0.25], scale: [0.9, 1.15, 0.95] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
