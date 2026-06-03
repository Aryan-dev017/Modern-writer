export type RelationshipKind =
  | "friend"
  | "enemy"
  | "lover"
  | "rival"
  | "mentor"
  | "sibling";

type RelationshipStyle = {
  label: string;
  stroke: string;
  glow: string;
  chip: string;
};

export const relationshipStyles: Record<RelationshipKind, RelationshipStyle> = {
  friend: {
    label: "Friend",
    stroke: "oklch(0.72 0.17 182 / 0.95)",
    glow: "oklch(0.75 0.2 182 / 0.42)",
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
    stroke: "oklch(0.73 0.22 336 / 0.96)",
    glow: "oklch(0.73 0.22 336 / 0.45)",
    chip: "border-fuchsia-300/35 bg-fuchsia-400/12 text-fuchsia-100",
  },
  rival: {
    label: "Rival",
    stroke: "oklch(0.76 0.19 86 / 0.96)",
    glow: "oklch(0.76 0.19 86 / 0.4)",
    chip: "border-amber-300/35 bg-amber-400/12 text-amber-100",
  },
  mentor: {
    label: "Mentor",
    stroke: "oklch(0.7 0.19 242 / 0.95)",
    glow: "oklch(0.72 0.2 242 / 0.42)",
    chip: "border-sky-300/35 bg-sky-400/12 text-sky-100",
  },
  sibling: {
    label: "Sibling",
    stroke: "oklch(0.73 0.15 154 / 0.95)",
    glow: "oklch(0.73 0.15 154 / 0.4)",
    chip: "border-teal-300/35 bg-teal-400/12 text-teal-100",
  },
};

export const relationshipKinds = Object.keys(relationshipStyles) as RelationshipKind[];
