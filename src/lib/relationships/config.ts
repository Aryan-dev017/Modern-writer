export type RelationshipKind =
  | "friend"
  | "enemy"
  | "lover"
  | "rival"
  | "mentor"
  | "sibling"
  | "stranger";

type RelationshipStyle = {
  label: string;
  stroke: string;
  glow: string;
  chip: string;
};

export const relationshipStyles: Record<RelationshipKind, RelationshipStyle> = {
  friend: {
    label: "Friend",
    stroke: "oklch(0.68 0.1 150 / 0.95)",
    glow: "oklch(0.72 0.12 150 / 0.42)",
    chip: "border-emerald-300/35 bg-emerald-400/12 text-emerald-100",
  },
  enemy: {
    label: "Enemy",
    stroke: "oklch(0.67 0.24 26 / 0.96)",
    glow: "oklch(0.67 0.24 26 / 0.44)",
    chip: "border-rose-300/35 bg-rose-400/12 text-rose-100",
  },
  lover: {
    label: "Lover",
    stroke: "oklch(0.65 0.12 32 / 0.96)",
    glow: "oklch(0.7 0.13 32 / 0.45)",
    chip: "border-amber-300/35 bg-amber-400/12 text-amber-100",
  },
  rival: {
    label: "Rival",
    stroke: "oklch(0.76 0.19 86 / 0.96)",
    glow: "oklch(0.76 0.19 86 / 0.4)",
    chip: "border-amber-300/35 bg-amber-400/12 text-amber-100",
  },
  mentor: {
    label: "Mentor",
    stroke: "oklch(0.64 0.08 150 / 0.95)",
    glow: "oklch(0.66 0.08 150 / 0.42)",
    chip: "border-emerald-300/35 bg-emerald-400/12 text-emerald-100",
  },
  sibling: {
    label: "Sibling",
    stroke: "oklch(0.68 0.08 92 / 0.95)",
    glow: "oklch(0.68 0.08 92 / 0.4)",
    chip: "border-stone-300/35 bg-stone-400/12 text-stone-100",
  },
  stranger: {
    label: "Stranger",
    stroke: "oklch(0.7 0.07 82 / 0.9)",
    glow: "oklch(0.7 0.07 82 / 0.34)",
    chip: "border-stone-300/35 bg-stone-400/12 text-stone-100",
  },
};

export const relationshipKinds = Object.keys(relationshipStyles) as RelationshipKind[];
