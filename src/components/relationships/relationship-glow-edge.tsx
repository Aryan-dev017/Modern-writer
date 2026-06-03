"use client";

import { memo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "reactflow";
import { cn } from "@/lib/utils";
import { relationshipStyles, type RelationshipKind } from "@/lib/relationships/config";

export type RelationshipEdgeData = {
  kind: RelationshipKind;
};

function RelationshipGlowEdge(props: EdgeProps<RelationshipEdgeData>) {
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd } = props;
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const kind = props.data?.kind ?? "friend";
  const style = relationshipStyles[kind];

  return (
    <>
      <BaseEdge
        id={`${id}-glow`}
        path={edgePath}
        style={{
          stroke: style.glow,
          strokeWidth: 9,
          opacity: 0.28,
          filter: "blur(4px)",
        }}
      />

      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: style.stroke,
          strokeWidth: 2.4,
          strokeDasharray: "14 8",
          animation: "relationship-edge-flow 5s linear infinite",
        }}
      />

      <EdgeLabelRenderer>
        <div
          className={cn(
            "nodrag nopan pointer-events-none absolute rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] backdrop-blur-xl",
            style.chip,
          )}
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
        >
          {style.label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default memo(RelationshipGlowEdge);
