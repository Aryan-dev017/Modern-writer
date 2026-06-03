import type { EmotionalTone } from "@/store/character-store";
import { getMoodPalette } from "@/lib/characters/mood-system";

type AvatarRecipe = {
  symbol: string;
  backgroundImage: string;
  haloColor: string;
};

function hashValue(input: string) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getAvatarRecipe(seed: string, tone: EmotionalTone): AvatarRecipe {
  const palette = getMoodPalette(tone);
  const hash = hashValue(seed);
  const angle = 130 + (hash % 80);
  const pulseX = (hash % 70) + 15;
  const pulseY = ((hash / 7) % 70) + 15;
  const symbolIndex = hash % palette.symbols.length;
  const symbol = palette.symbols[symbolIndex];

  return {
    symbol,
    backgroundImage: [
      `radial-gradient(circle at ${pulseX}% ${pulseY}%, oklch(0.97 0.03 250 / 0.22) 0%, transparent 38%)`,
      `linear-gradient(${angle}deg, ${palette.gradient[0]} 0%, ${palette.gradient[1]} 52%, ${palette.gradient[2]} 100%)`,
    ].join(", "),
    haloColor: palette.gradient[1],
  };
}
