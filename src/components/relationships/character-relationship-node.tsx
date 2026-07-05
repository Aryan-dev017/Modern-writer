"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { cn } from "@/lib/utils";
import type { EmotionalTone } from "@/store/character-store";

export type RelationshipNodeData = {
  name: string;
  title: string;
  emotionalTone: EmotionalTone;
};

const toneRingClass: Record<EmotionalTone, string> = {
  hopeful: "ring-amber-300/40",
  melancholic: "ring-stone-300/35",
  vengeful: "ring-rose-300/40",
  haunted: "ring-emerald-300/30",
  radiant: "ring-amber-300/40",
  enigmatic: "ring-amber-300/40",
};

function CharacterRelationshipNode({ data, selected }: NodeProps<RelationshipNodeData>) {
  return (
    <div
      className={cn(
        "min-w-[220px] max-w-[240px] rounded-2xl border border-amber-200/18 bg-[linear-gradient(180deg,rgba(255,248,232,0.08),rgba(68,44,22,0.34))] p-4 shadow-[0_20px_44px_rgba(22,12,6,0.5)] ring-1",
        toneRingClass[data.emotionalTone],
        selected && "border-primary/70 shadow-[0_0_26px_rgba(245,201,109,0.22)]",
      )}
    >
      <Handle type="source" position={Position.Right} className="!h-2.5 !w-2.5 !border-0 !bg-amber-300" />
      <Handle type="target" position={Position.Left} className="!h-2.5 !w-2.5 !border-0 !bg-emerald-300" />
      <Handle type="source" position={Position.Top} className="!h-2.5 !w-2.5 !border-0 !bg-amber-300" />
      <Handle type="target" position={Position.Bottom} className="!h-2.5 !w-2.5 !border-0 !bg-emerald-300" />

      <p className="text-[10px] uppercase tracking-[0.2em] text-white/65">{data.emotionalTone}</p>
      <h4 className="pt-1 font-serif text-xl leading-tight text-white">{data.name}</h4>
      <p className="pt-1 text-xs text-primary">{data.title}</p>
    </div>
  );
}

export default memo(CharacterRelationshipNode);
