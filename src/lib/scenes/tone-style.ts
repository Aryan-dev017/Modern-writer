import type { EmotionalTone } from "@/store/character-store";

export const sceneToneStyles: Record<EmotionalTone, string> = {
  hopeful: "border-amber-300/35 bg-amber-400/12 text-amber-100",
  melancholic: "border-stone-300/35 bg-stone-400/12 text-stone-100",
  vengeful: "border-rose-300/35 bg-rose-400/12 text-rose-100",
  haunted: "border-emerald-300/25 bg-emerald-400/10 text-emerald-100",
  radiant: "border-amber-300/45 bg-amber-400/14 text-amber-100",
  enigmatic: "border-amber-300/35 bg-amber-400/12 text-amber-100",
};
