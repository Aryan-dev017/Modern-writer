import type { EmotionalTone } from "@/store/character-store";

export const sceneToneStyles: Record<EmotionalTone, string> = {
  hopeful: "border-sky-300/35 bg-sky-400/12 text-sky-100",
  melancholic: "border-indigo-300/35 bg-indigo-400/12 text-indigo-100",
  vengeful: "border-rose-300/35 bg-rose-400/12 text-rose-100",
  haunted: "border-violet-300/35 bg-violet-400/12 text-violet-100",
  radiant: "border-cyan-300/35 bg-cyan-400/12 text-cyan-100",
  enigmatic: "border-fuchsia-300/35 bg-fuchsia-400/12 text-fuchsia-100",
};
