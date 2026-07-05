"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import {
  useCharacterStore,
  type CharacterRelationship,
  type UniverseCharacter,
} from "@/store/character-store";
import { useRelationshipStore, type UniverseRelationship } from "@/store/relationship-store";

const nodeTypes = {
  characterNode: CharacterRelationshipNode,
};

const edgeTypes = {
  relationshipEdge: RelationshipGlowEdge,
};

function mapLegacyRelationshipKind(kind: CharacterRelationship["type"]): RelationshipKind {
  switch (kind) {
    case "ally":
      return "friend";
    case "rival":
      return "rival";
    case "mentor":
      return "mentor";
    case "kin":
      return "sibling";
    case "muse":
    default:
      return "lover";
  }
}

function createNodeFromCharacter(
  character: UniverseCharacter,
  index: number,
  total: number,
): Node<RelationshipNodeData> {
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

function createRelationshipEdge(
  source: string,
  target: string,
  kind: RelationshipKind,
): Edge<RelationshipEdgeData> {
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

function pairKey(source: string, target: string, kind: RelationshipKind) {
  return [source, target].sort().join("::") + `::${kind}`;
}

function createFallbackEdges(characters: UniverseCharacter[]) {
  const byName = new Map(characters.map((character) => [character.name.toLowerCase(), character.id]));
  const seenPairs = new Set<string>();
  const edges: Edge<RelationshipEdgeData>[] = [];

  characters.forEach((character) => {
    character.relationships.forEach((relationship) => {
      const targetId = relationship.targetCharacterId ?? byName.get(relationship.name.toLowerCase());
      if (!targetId || targetId === character.id) {
        return;
      }

      const kind = mapLegacyRelationshipKind(relationship.type);
      const key = pairKey(character.id, targetId, kind);
      if (seenPairs.has(key)) {
        return;
      }

      seenPairs.add(key);
      edges.push(createRelationshipEdge(character.id, targetId, kind));
    });
  });

  return edges;
}

function createEdgesFromRelationships(relationships: UniverseRelationship[]) {
  const seenPairs = new Set<string>();
  const edges: Edge<RelationshipEdgeData>[] = [];

  relationships.forEach((relationship) => {
    const key = pairKey(
      relationship.sourceCharacterId,
      relationship.targetCharacterId,
      relationship.relationshipKind,
    );

    if (seenPairs.has(key)) {
      return;
    }

    seenPairs.add(key);
    edges.push(
      createRelationshipEdge(
        relationship.sourceCharacterId,
        relationship.targetCharacterId,
        relationship.relationshipKind,
      ),
    );
  });

  return edges;
}

export function RelationshipGraphView() {
  const analytics = useAnalytics();
  const characters = useCharacterStore((state) => state.characters);
  const isCharacterLoading = useCharacterStore((state) => state.isLoading);
  const relationships = useRelationshipStore((state) => state.relationships);
  const isRelationshipLoading = useRelationshipStore((state) => state.isLoading);
  const error = useRelationshipStore((state) => state.error);
  const createRelationship = useRelationshipStore((state) => state.createRelationship);

  const [nodes, setNodes, onNodesChange] = useNodesState<RelationshipNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<RelationshipEdgeData>([]);
  const [activeKind, setActiveKind] = useState<RelationshipKind>("friend");
  const [sourceId, setSourceId] = useState("");
  const [targetId, setTargetId] = useState("");

  useEffect(() => {
    setNodes((current) => {
      const currentById = new Map(current.map((node) => [node.id, node] as const));
      return characters.map((character, index) => {
        const existing = currentById.get(character.id);
        if (existing) {
          return {
            ...existing,
            data: {
              name: character.name,
              title: character.title,
              emotionalTone: character.emotionalTone,
            },
          };
        }

        return createNodeFromCharacter(character, index, characters.length);
      });
    });
  }, [characters, setNodes]);

  const derivedEdges = useMemo(() => {
    if (relationships.length > 0) {
      return createEdgesFromRelationships(relationships);
    }

    return createFallbackEdges(characters);
  }, [characters, relationships]);

  useEffect(() => {
    setEdges(derivedEdges);
  }, [derivedEdges, setEdges]);

  const resolvedSourceId =
    sourceId && nodes.some((node) => node.id === sourceId) ? sourceId : nodes[0]?.id ?? "";
  const resolvedTargetId =
    targetId &&
    nodes.some((node) => node.id === targetId) &&
    targetId !== resolvedSourceId
      ? targetId
      : nodes[1]?.id ?? resolvedSourceId;

  const createBond = useCallback(
    (source: string, target: string, kind: RelationshipKind) => {
      if (!source || !target || source === target) {
        return false;
      }

      const relationshipId = createRelationship({
        sourceCharacterId: source,
        targetCharacterId: target,
        relationshipKind: kind,
      });

      if (!relationshipId) {
        return false;
      }

      analytics.track(AnalyticsEvent.RELATIONSHIP_CREATED, {
        source_character_id: source,
        target_character_id: target,
        relationship_type: kind,
      });
      markOnboardingStepCompleted("relationship_created");

      return true;
    },
    [analytics, createRelationship],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) {
        return;
      }

      createBond(connection.source, connection.target, activeKind);
    },
    [activeKind, createBond],
  );

  const hasCharacters = characters.length > 0;
  const isLoading = isCharacterLoading || isRelationshipLoading;

  return (
    <div className="relative mx-auto w-full max-w-7xl space-y-6">
      <section className="glass-panel relative overflow-hidden rounded-2xl p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,oklch(0.82_0.13_82/.14)_0%,transparent_32%),radial-gradient(circle_at_80%_75%,oklch(0.49_0.08_150/.12)_0%,transparent_34%)]" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Relationship Map</p>
            <h2 className="mt-1 font-serif text-4xl text-white md:text-5xl">
              Interactive character constellation
            </h2>
            <p className="mt-3 max-w-3xl text-sm text-muted-foreground md:text-base">
              A hand-inked detective board meets a fantasy map. Drag nodes, connect arcs, and reveal
              emotional gravity in real time.
            </p>
          </div>
          <Badge glow>
            {nodes.length} nodes / {edges.length} live bonds
          </Badge>
        </div>
      </section>

      {error ? (
        <Card className="border-rose-300/25 bg-rose-500/10">
          <CardContent className="p-4 text-sm text-rose-100">{error}</CardContent>
        </Card>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <Card className="glass-panel border-amber-200/18">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-white">Create a new bond</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!hasCharacters ? (
              <div className="rounded-xl border border-amber-200/12 bg-[linear-gradient(180deg,rgba(255,248,232,0.06),rgba(82,55,26,0.16))] p-4 text-sm text-muted-foreground">
                {isLoading
                  ? "Reading characters from Supabase..."
                  : "Create characters first to reveal relationship lines."}
              </div>
            ) : (
              <>
                <label className="block">
                  <span className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    Source Character
                  </span>
                  <select
                    value={resolvedSourceId}
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
                    value={resolvedTargetId}
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
                    createBond(resolvedSourceId, resolvedTargetId, activeKind);
                  }}
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Relationship
                </Button>
              </>
            )}

            <div className="rounded-xl border border-amber-200/12 bg-[linear-gradient(180deg,rgba(255,248,232,0.06),rgba(82,55,26,0.16))] p-3">
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

        <div className="glass-panel relative h-[72vh] min-h-[520px] overflow-hidden rounded-2xl border-amber-200/18">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,oklch(0.82_0.13_82/.16)_0%,transparent_34%),radial-gradient(circle_at_82%_70%,oklch(0.49_0.08_150/.14)_0%,transparent_36%)]" />
          <div className="pointer-events-none absolute inset-0 cinematic-grid opacity-40" />

          {hasCharacters ? (
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
                  nodeStrokeColor="oklch(0.74 0.13 82 / 0.55)"
                  nodeColor="oklch(0.2 0.03 78 / 0.95)"
                  maskColor="oklch(0.1 0.03 78 / 0.72)"
                  className="!border !border-amber-200/20 !bg-[rgba(31,18,9,0.82)]"
                />
                <Controls className="[&>button]:!border-amber-200/20 [&>button]:!bg-[rgba(31,18,9,0.7)] [&>button]:!text-white" />
                <Background gap={26} color="oklch(0.56 0.05 78 / 0.3)" />
              </ReactFlow>
            </ReactFlowProvider>
          ) : (
            <div className="relative flex h-full items-center justify-center p-8 text-center">
              <div className="max-w-md rounded-2xl border border-amber-200/12 bg-[linear-gradient(180deg,rgba(255,248,232,0.06),rgba(82,55,26,0.18))] p-6 text-sm text-muted-foreground">
                {isLoading
                  ? "We are loading your character archive so the relationship map can connect real user data."
                  : "Once you create characters, their bonds will appear here as an interactive constellation."}
              </div>
            </div>
          )}
        </div>
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
  "w-full rounded-xl border border-amber-200/15 bg-[linear-gradient(180deg,rgba(255,248,232,0.08),rgba(82,55,26,0.18))] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/45 focus:border-primary/60 focus:ring-2 focus:ring-primary/20";
