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
    aura: "Warm horizon after a long night.",
    gradient: ["oklch(0.74 0.18 220)", "oklch(0.64 0.2 265)", "oklch(0.5 0.18 295)"],
    border: "border-sky-300/40",
    glow: "shadow-[0_0_28px_oklch(0.72_0.18_225/.35)]",
    symbols: ["✦", "✧", "⟡", "◇"],
  },
  melancholic: {
    label: "Melancholic",
    aura: "Soft grief with distant beauty.",
    gradient: ["oklch(0.58 0.1 250)", "oklch(0.46 0.09 280)", "oklch(0.34 0.05 260)"],
    border: "border-indigo-300/35",
    glow: "shadow-[0_0_30px_oklch(0.52_0.1_265/.32)]",
    symbols: ["☾", "✶", "⋆", "◌"],
  },
  vengeful: {
    label: "Vengeful",
    aura: "Heat, fracture, and sharpened intent.",
    gradient: ["oklch(0.62 0.2 20)", "oklch(0.56 0.25 340)", "oklch(0.42 0.2 290)"],
    border: "border-rose-300/45",
    glow: "shadow-[0_0_30px_oklch(0.58_0.22_8/.34)]",
    symbols: ["⚶", "✹", "⛧", "✷"],
  },
  haunted: {
    label: "Haunted",
    aura: "Echoes that never truly fade.",
    gradient: ["oklch(0.45 0.08 240)", "oklch(0.39 0.11 285)", "oklch(0.26 0.05 260)"],
    border: "border-violet-300/40",
    glow: "shadow-[0_0_34px_oklch(0.44_0.13_280/.33)]",
    symbols: ["☽", "⟁", "⌁", "⟢"],
  },
  radiant: {
    label: "Radiant",
    aura: "Luminous confidence and sacred calm.",
    gradient: ["oklch(0.82 0.18 120)", "oklch(0.72 0.18 240)", "oklch(0.58 0.16 290)"],
    border: "border-cyan-300/45",
    glow: "shadow-[0_0_30px_oklch(0.8_0.16_170/.3)]",
    symbols: ["✺", "✹", "✷", "✦"],
  },
  enigmatic: {
    label: "Enigmatic",
    aura: "Seductive mystery with shifting intent.",
    gradient: ["oklch(0.63 0.2 310)", "oklch(0.54 0.21 270)", "oklch(0.44 0.12 230)"],
    border: "border-fuchsia-300/45",
    glow: "shadow-[0_0_34px_oklch(0.62_0.22_300/.36)]",
    symbols: ["⟣", "⟠", "◈", "⟡"],
  },
};

export function getMoodPalette(tone: EmotionalTone) {
  return moodPalette[tone];
}

const relationshipTypeStyleMap: Record<RelationshipType, string> = {
  ally: "text-emerald-200 border-emerald-300/30 bg-emerald-400/10",
  rival: "text-rose-200 border-rose-300/30 bg-rose-400/10",
  mentor: "text-cyan-200 border-cyan-300/30 bg-cyan-400/10",
  kin: "text-amber-200 border-amber-300/30 bg-amber-400/10",
  muse: "text-violet-200 border-violet-300/30 bg-violet-400/10",
};

const relationshipIntensityStyleMap: Record<RelationshipIntensity, string> = {
  faint: "opacity-70",
  tangled: "opacity-90",
  fated: "opacity-100 shadow-[0_0_16px_oklch(0.7_0.18_280/.25)]",
};

export function getRelationshipStyles(type: RelationshipType, intensity: RelationshipIntensity) {
  return `${relationshipTypeStyleMap[type]} ${relationshipIntensityStyleMap[intensity]}`;
}
