"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  type Edge,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { useUniverseStore } from "@/store/universe-store";

type FlowNodeData = {
  label: string;
  actId: string;
};

const nodes: Node<FlowNodeData>[] = [
  {
    id: "arrival",
    position: { x: 0, y: 120 },
    data: { label: "Arrival in Umbra City", actId: "act-i" },
  },
  {
    id: "oracle",
    position: { x: 280, y: 0 },
    data: { label: "The Oracle's Oath", actId: "act-i" },
  },
  {
    id: "fracture",
    position: { x: 340, y: 230 },
    data: { label: "Fracture of the Twin Sigil", actId: "act-ii" },
  },
  {
    id: "betrayal",
    position: { x: 620, y: 80 },
    data: { label: "Betrayal at Hollow Bridge", actId: "act-ii" },
  },
  {
    id: "ascension",
    position: { x: 880, y: 180 },
    data: { label: "Midnight Ascension", actId: "act-iii" },
  },
];

const edges: Edge[] = [
  { id: "e1-2", source: "arrival", target: "oracle" },
  { id: "e2-3", source: "oracle", target: "fracture" },
  { id: "e3-4", source: "fracture", target: "betrayal" },
  { id: "e4-5", source: "betrayal", target: "ascension" },
];

export function StoryFlowMap() {
  const activeActId = useUniverseStore((state) => state.activeActId);

  const styledNodes = useMemo(
    () =>
      nodes.map((node) => {
        const isActive = node.data.actId === activeActId;

        return {
          ...node,
          style: {
            padding: "10px 14px",
            borderRadius: "14px",
            border: `1px solid ${isActive ? "oklch(0.67 0.22 285 / 0.75)" : "oklch(0.34 0.05 265 / 0.5)"}`,
            background: isActive
              ? "linear-gradient(145deg, oklch(0.34 0.08 280 / 0.9), oklch(0.2 0.04 265 / 0.9))"
              : "linear-gradient(145deg, oklch(0.24 0.04 265 / 0.88), oklch(0.17 0.03 260 / 0.9))",
            color: "oklch(0.95 0.01 260)",
            boxShadow: isActive ? "0 0 32px oklch(0.67 0.22 285 / 0.25)" : "none",
            fontSize: "13px",
            letterSpacing: "0.01em",
            width: 210,
          },
        };
      }),
    [activeActId],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="glass-panel h-[26rem] overflow-hidden rounded-2xl"
    >
      <ReactFlowProvider>
        <ReactFlow
          nodes={styledNodes}
          edges={edges}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          defaultEdgeOptions={{
            type: "smoothstep",
            style: {
              stroke: "oklch(0.66 0.14 245 / 0.82)",
              strokeWidth: 2,
            },
          }}
          className="cinematic-grid"
        >
          <MiniMap
            nodeColor={() => "oklch(0.66 0.16 280 / 0.82)"}
            maskColor="oklch(0.12 0.02 260 / 0.75)"
            pannable
            zoomable
          />
          <Controls
            position="bottom-right"
            className="[&>button]:border-border [&>button]:bg-black/40 [&>button]:text-white"
          />
          <Background color="oklch(0.46 0.04 265 / 0.2)" gap={24} />
        </ReactFlow>
      </ReactFlowProvider>
    </motion.div>
  );
}
