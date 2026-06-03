"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { EmotionalTone } from "@/store/character-store";

export type RelationshipNodeData = {
  name: string;
  title: string;
  emotionalTone: EmotionalTone;
};

const toneRingClass: Record<EmotionalTone, string> = {
  hopeful: "ring-sky-300/40",
  melancholic: "ring-indigo-300/35",
  vengeful: "ring-rose-300/40",
  haunted: "ring-violet-300/40",
  radiant: "ring-cyan-300/40",
  enigmatic: "ring-fuchsia-300/40",
};

function CharacterRelationshipNode({ data, selected }: NodeProps<RelationshipNodeData>) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "min-w-[220px] max-w-[240px] rounded-2xl border border-white/20 bg-black/45 p-4 shadow-[0_20px_44px_oklch(0.03_0.01_260/.55)] backdrop-blur-xl ring-1",
        toneRingClass[data.emotionalTone],
        selected && "border-primary/70 shadow-[0_0_26px_oklch(0.68_0.22_285/.34)]",
      )}
    >
      <Handle type="source" position={Position.Right} className="!h-2.5 !w-2.5 !border-0 !bg-primary" />
      <Handle type="target" position={Position.Left} className="!h-2.5 !w-2.5 !border-0 !bg-secondary" />
      <Handle type="source" position={Position.Top} className="!h-2.5 !w-2.5 !border-0 !bg-primary" />
      <Handle type="target" position={Position.Bottom} className="!h-2.5 !w-2.5 !border-0 !bg-secondary" />

      <p className="text-[10px] uppercase tracking-[0.2em] text-white/65">{data.emotionalTone}</p>
      <h4 className="pt-1 font-serif text-xl leading-tight text-white">{data.name}</h4>
      <p className="pt-1 text-xs text-primary">{data.title}</p>
    </motion.div>
  );
}

export default memo(CharacterRelationshipNode);
