"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Background,
  ConnectionMode,
  Controls,
  MiniMap,
  MarkerType,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { Link2, Network, PlusCircle } from "lucide-react";
import { AnalyticsEvent } from "@/lib/analytics/events";
import { useAnalytics } from "@/lib/analytics/hooks";
import { markOnboardingStepCompleted } from "@/lib/analytics/onboarding";
import CharacterRelationshipNode, {
  type RelationshipNodeData,
} from "@/components/relationships/character-relationship-node";
import RelationshipGlowEdge, {
  type RelationshipEdgeData,
} from "@/components/relationships/relationship-glow-edge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { relationshipKinds, relationshipStyles, type RelationshipKind } from "@/lib/relationships/config";
import { useCharacterStore, type UniverseCharacter } from "@/store/character-store";

const nodeTypes = {
  characterNode: CharacterRelationshipNode,
};

const edgeTypes = {
  relationshipEdge: RelationshipGlowEdge,
};

const mapLegacyKind: Record<string, RelationshipKind> = {
  ally: "friend",
  rival: "rival",
  mentor: "mentor",
  kin: "sibling",
  muse: "lover",
};

function createNodeFromCharacter(character: UniverseCharacter, index: number, total: number): Node<RelationshipNodeData> {
  const angle = (index / Math.max(1, total)) * Math.PI * 2;
  const radius = 280 + (index % 2) * 90;
  const centerX = 420;
  const centerY = 320;

  return {
    id: character.id,
    type: "characterNode",
    position: {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    },
    data: {
      name: character.name,
      title: character.title,
      emotionalTone: character.emotionalTone,
    },
  };
}

function createRelationshipEdge(source: string, target: string, kind: RelationshipKind): Edge<RelationshipEdgeData> {
  const style = relationshipStyles[kind];

  return {
    id: `edge-${source}-${target}-${kind}-${Math.random().toString(36).slice(2, 6)}`,
    source,
    target,
    type: "relationshipEdge",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: style.stroke,
      width: 24,
      height: 24,
    },
    data: { kind },
  };
}

function seedEdges(characters: UniverseCharacter[]): Edge<RelationshipEdgeData>[] {
  const byName = new Map(characters.map((character) => [character.name.toLowerCase(), character.id]));
  const seenPairs = new Set<string>();
  const seeded: Edge<RelationshipEdgeData>[] = [];

  characters.forEach((character) => {
    character.relationships.forEach((relationship) => {
      const targetId = byName.get(relationship.name.toLowerCase());
      if (!targetId || targetId === character.id) {
        return;
      }

      const kind = mapLegacyKind[relationship.type] ?? "friend";
      const pairKey = [character.id, targetId].sort().join("::") + `::${kind}`;
      if (seenPairs.has(pairKey)) {
        return;
      }

      seenPairs.add(pairKey);
      seeded.push(createRelationshipEdge(character.id, targetId, kind));
    });
  });

  return seeded;
}

function existsSimilarEdge(
  edges: Edge<RelationshipEdgeData>[],
  source: string,
  target: string,
  kind: RelationshipKind,
) {
  return edges.some((edge) => {
    const sameDirection = edge.source === source && edge.target === target;
    const reverseDirection = edge.source === target && edge.target === source;
    return (sameDirection || reverseDirection) && edge.data?.kind === kind;
  });
}

export function RelationshipGraphView() {
  const analytics = useAnalytics();
  const characters = useCharacterStore((state) => state.characters);

  const initialNodes = useMemo(
    () =>
      characters.map((character, index) =>
        createNodeFromCharacter(character, index, characters.length),
      ),
    [characters],
  );

  const initialEdges = useMemo(() => seedEdges(characters), [characters]);

  const [nodes, , onNodesChange] = useNodesState<RelationshipNodeData>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<RelationshipEdgeData>(initialEdges);
  const edgesRef = useRef(edges);
  const [activeKind, setActiveKind] = useState<RelationshipKind>("friend");
  const [sourceId, setSourceId] = useState(initialNodes[0]?.id ?? "");
  const [targetId, setTargetId] = useState(initialNodes[1]?.id ?? initialNodes[0]?.id ?? "");

  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  const appendRelationship = useCallback(
    (source: string, target: string, kind: RelationshipKind) => {
      if (!source || !target || source === target) {
        return false;
      }

      const currentEdges = edgesRef.current;
      if (existsSimilarEdge(currentEdges, source, target, kind)) {
        return false;
      }

      const nextEdges = [...currentEdges, createRelationshipEdge(source, target, kind)];
      edgesRef.current = nextEdges;
      setEdges(nextEdges);
      return true;
    },
    [setEdges],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) {
        return;
      }

      const wasCreated = appendRelationship(connection.source, connection.target, activeKind);
      if (!wasCreated) {
        return;
      }

      analytics.track(AnalyticsEvent.RELATIONSHIP_CREATED, {
        source_character_id: connection.source,
        target_character_id: connection.target,
        relationship_type: activeKind,
      });
      markOnboardingStepCompleted("relationship_created");
    },
    [appendRelationship, activeKind, analytics],
  );

  return (
    <div className="relative mx-auto w-full max-w-7xl space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="glass-panel relative overflow-hidden rounded-2xl border-white/20 p-6"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,oklch(0.68_0.22_285/.16)_0%,transparent_32%),radial-gradient(circle_at_80%_75%,oklch(0.66_0.2_244/.15)_0%,transparent_34%)]" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Relationship Intelligence</p>
            <h2 className="mt-1 font-serif text-4xl text-white md:text-5xl">
              Interactive Character Constellation
            </h2>
            <p className="mt-3 max-w-3xl text-sm text-muted-foreground md:text-base">
              A cinematic detective board meets a neural fantasy map. Drag nodes, connect arcs, and
              reveal emotional gravity in real time.
            </p>
          </div>
          <Badge glow>{nodes.length} nodes · {edges.length} live bonds</Badge>
        </div>
      </motion.section>

      <section className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="glass-panel border-white/20">
            <CardHeader>
              <CardTitle className="font-serif text-2xl text-white">Create Dynamic Bond</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  Source Character
                </span>
                <select
                  value={sourceId}
                  onChange={(event) => setSourceId(event.target.value)}
                  className={selectClass}
                >
                  {nodes.map((node) => (
                    <option key={`source-${node.id}`} value={node.id}>
                      {node.data.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  Target Character
                </span>
                <select
                  value={targetId}
                  onChange={(event) => setTargetId(event.target.value)}
                  className={selectClass}
                >
                  {nodes.map((node) => (
                    <option key={`target-${node.id}`} value={node.id}>
                      {node.data.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  Relationship Type
                </span>
                <select
                  value={activeKind}
                  onChange={(event) => setActiveKind(event.target.value as RelationshipKind)}
                  className={selectClass}
                >
                  {relationshipKinds.map((kind) => (
                    <option key={kind} value={kind}>
                      {relationshipStyles[kind].label}
                    </option>
                  ))}
                </select>
              </label>

              <Button
                type="button"
                size="lg"
                className="w-full gap-2"
                onClick={() => {
                  const wasCreated = appendRelationship(sourceId, targetId, activeKind);
                  if (!wasCreated) {
                    return;
                  }

                  analytics.track(AnalyticsEvent.RELATIONSHIP_CREATED, {
                    source_character_id: sourceId,
                    target_character_id: targetId,
                    relationship_type: activeKind,
                  });
                  markOnboardingStepCompleted("relationship_created");
                }}
              >
                <PlusCircle className="h-4 w-4" />
                Add Relationship
              </Button>

              <div className="rounded-xl border border-white/15 bg-black/25 p-3">
                <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-white/70">
                  <Network className="h-3.5 w-3.5" />
                  Emotional Connection Colors
                </p>
                <div className="space-y-2">
                  {relationshipKinds.map((kind) => (
                    <div key={kind} className="flex items-center justify-between gap-3 text-xs">
                      <span className="text-white/90">{relationshipStyles[kind].label}</span>
                      <span
                        className="inline-block h-2.5 w-16 rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${relationshipStyles[kind].stroke}, ${relationshipStyles[kind].glow})`,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
          <div className="glass-panel relative h-[72vh] min-h-[520px] overflow-hidden rounded-2xl border-white/20">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,oklch(0.72_0.22_285/.16)_0%,transparent_34%),radial-gradient(circle_at_82%_70%,oklch(0.68_0.19_242/.16)_0%,transparent_36%)]" />
            <div className="pointer-events-none absolute inset-0 cinematic-grid opacity-40" />

            <ReactFlowProvider>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                fitViewOptions={{ padding: 0.18 }}
                connectionMode={ConnectionMode.Loose}
                defaultEdgeOptions={{ type: "relationshipEdge" }}
                proOptions={{ hideAttribution: true }}
                className="h-full w-full"
              >
                <MiniMap
                  pannable
                  zoomable
                  nodeStrokeColor="oklch(0.69 0.2 276 / 0.55)"
                  nodeColor="oklch(0.25 0.03 264 / 0.95)"
                  maskColor="oklch(0.1 0.01 260 / 0.72)"
                  className="!border !border-white/20 !bg-black/35"
                />
                <Controls className="[&>button]:!border-white/20 [&>button]:!bg-black/40 [&>button]:!text-white" />
                <Background gap={26} color="oklch(0.52 0.06 260 / 0.3)" />
              </ReactFlow>
            </ReactFlowProvider>
          </div>
        </motion.div>
      </section>

      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link2 className="h-4 w-4 text-primary" />
        Tip: drag from any node handle to quickly create a new bond using the currently selected
        relationship type.
      </p>
    </div>
  );
}

const selectClass =
  "w-full rounded-xl border border-white/15 bg-black/25 px-3 py-2.5 text-sm text-white outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/30";
