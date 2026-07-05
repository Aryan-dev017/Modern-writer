"use client";

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
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-amber-200/15",
        palette.glow,
        compact ? "h-16 w-16" : "h-24 w-24",
        className,
      )}
      style={{ backgroundImage: recipe.backgroundImage }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,oklch(0.12_0.03_78/.38)_100%)]" />
      <div className="absolute right-2 top-1 font-serif text-lg text-white/80">{recipe.symbol}</div>

      <div className="absolute bottom-2 left-2">
        <p className={cn("font-serif text-white drop-shadow-lg", compact ? "text-sm" : "text-xl")}>{initials}</p>
      </div>

      <div
        className="pointer-events-none absolute -right-4 -top-4 h-10 w-10 rounded-full blur-xl"
        style={{ backgroundColor: recipe.haloColor }}
      />
    </div>
  );
}
