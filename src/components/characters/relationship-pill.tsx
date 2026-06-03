import { cn } from "@/lib/utils";
import { getRelationshipStyles } from "@/lib/characters/mood-system";
import type { CharacterRelationship } from "@/store/character-store";

type RelationshipPillProps = {
  relationship: CharacterRelationship;
  compact?: boolean;
};

export function RelationshipPill({ relationship, compact = false }: RelationshipPillProps) {
  return (
    <div
      className={cn(
        "rounded-full border px-3 py-1",
        compact ? "text-[11px]" : "text-xs",
        getRelationshipStyles(relationship.type, relationship.intensity),
      )}
    >
      <span className="uppercase tracking-[0.12em]">
        {relationship.type}
      </span>
      <span className="px-1.5 text-white/45">|</span>
      <span className="text-white/90">{relationship.name}</span>
    </div>
  );
}
