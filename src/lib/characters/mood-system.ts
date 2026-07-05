import type { EmotionalTone, RelationshipIntensity, RelationshipType } from "@/store/character-store";

type MoodPalette = {
  label: string;
  aura: string;
  gradient: [string, string, string];
  border: string;
  glow: string;
  symbols: string[];
};

export const moodPalette: Record<EmotionalTone, MoodPalette> = {
  hopeful: {
    label: "Hopeful",
    aura: "A warm dawn pressed into ink.",
    gradient: ["oklch(0.9 0.08 82)", "oklch(0.78 0.1 54)", "oklch(0.54 0.08 149)"],
    border: "border-amber-300/40",
    glow: "shadow-[0_0_28px_rgba(245,201,109,0.24)]",
    symbols: ["*", "+", "^", "o"],
  },
  melancholic: {
    label: "Melancholic",
    aura: "Quiet grief with a little gold in it.",
    gradient: ["oklch(0.56 0.05 78)", "oklch(0.44 0.05 66)", "oklch(0.3 0.03 58)"],
    border: "border-stone-300/35",
    glow: "shadow-[0_0_30px_rgba(132,112,92,0.22)]",
    symbols: ["~", ".", ":", "o"],
  },
  vengeful: {
    label: "Vengeful",
    aura: "Heat, fracture, and sharpened intent.",
    gradient: ["oklch(0.66 0.13 28)", "oklch(0.53 0.12 18)", "oklch(0.36 0.06 12)"],
    border: "border-rose-300/45",
    glow: "shadow-[0_0_30px_rgba(170,88,52,0.26)]",
    symbols: ["^", "!", "/", "\\"],
  },
  haunted: {
    label: "Haunted",
    aura: "Echoes that never quite leave the page.",
    gradient: ["oklch(0.38 0.04 76)", "oklch(0.28 0.05 92)", "oklch(0.2 0.03 78)"],
    border: "border-emerald-300/25",
    glow: "shadow-[0_0_34px_rgba(73,103,70,0.24)]",
    symbols: ["#", "|", "o", "*"],
  },
  radiant: {
    label: "Radiant",
    aura: "Luminous confidence and sacred calm.",
    gradient: ["oklch(0.84 0.12 82)", "oklch(0.76 0.1 54)", "oklch(0.54 0.08 149)"],
    border: "border-amber-300/45",
    glow: "shadow-[0_0_30px_rgba(245,201,109,0.28)]",
    symbols: ["+", "*", "o", "^"],
  },
  enigmatic: {
    label: "Enigmatic",
    aura: "Seductive mystery with shifting intent.",
    gradient: ["oklch(0.58 0.08 32)", "oklch(0.46 0.06 58)", "oklch(0.3 0.04 78)"],
    border: "border-amber-300/35",
    glow: "shadow-[0_0_34px_rgba(155,110,60,0.24)]",
    symbols: ["?", ":", ";", "~"],
  },
};

export function getMoodPalette(tone: EmotionalTone) {
  return moodPalette[tone];
}

const relationshipTypeStyleMap: Record<RelationshipType, string> = {
  ally: "text-emerald-100 border-emerald-300/25 bg-emerald-400/10",
  rival: "text-rose-100 border-rose-300/25 bg-rose-400/10",
  mentor: "text-amber-100 border-amber-300/25 bg-amber-400/10",
  kin: "text-stone-100 border-stone-300/25 bg-stone-400/10",
  muse: "text-amber-100 border-amber-300/25 bg-amber-400/10",
};

const relationshipIntensityStyleMap: Record<RelationshipIntensity, string> = {
  faint: "opacity-70",
  tangled: "opacity-90",
  fated: "opacity-100 shadow-[0_0_16px_rgba(245,201,109,0.16)]",
};

export function getRelationshipStyles(type: RelationshipType, intensity: RelationshipIntensity) {
  return `${relationshipTypeStyleMap[type]} ${relationshipIntensityStyleMap[intensity]}`;
}
