"use client";

import { useMemo, useState } from "react";
import { Clapperboard, GripVertical, Sparkles, TimerReset } from "lucide-react";
import { AnalyticsEvent } from "@/lib/analytics/events";
import { useAnalytics } from "@/lib/analytics/hooks";
import { markOnboardingStepCompleted } from "@/lib/analytics/onboarding";
import { SceneFormPanel } from "@/components/scenes/scene-form-panel";
import { SceneCard } from "@/components/scenes/scene-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCharacterStore, type UniverseCharacter } from "@/store/character-store";
import { useSceneStore, type SceneDraft, type UniverseScene } from "@/store/scene-store";

function sortScenesByTimeline(a: UniverseScene, b: UniverseScene) {
  return a.timelineOrder - b.timelineOrder;
}

function moveSceneBefore(
  scenes: UniverseScene[],
  draggedSceneId: string,
  targetSceneId: string,
) {
  const orderedIds = scenes.map((scene) => scene.id);
  const fromIndex = orderedIds.indexOf(draggedSceneId);
  const toIndex = orderedIds.indexOf(targetSceneId);

  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
    return orderedIds;
  }

  const nextIds = [...orderedIds];
  const [movedId] = nextIds.splice(fromIndex, 1);
  nextIds.splice(toIndex, 0, movedId);
  return nextIds;
}

export function SceneManagerView() {
  const analytics = useAnalytics();
  const characters = useCharacterStore((state) => state.characters);
  const scenes = useSceneStore((state) => state.scenes);
  const isLoading = useSceneStore((state) => state.isLoading);
  const error = useSceneStore((state) => state.error);
  const createScene = useSceneStore((state) => state.createScene);
  const updateScene = useSceneStore((state) => state.updateScene);
  const deleteScene = useSceneStore((state) => state.deleteScene);
  const reorderScenes = useSceneStore((state) => state.reorderScenes);

  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);
  const [draggedSceneId, setDraggedSceneId] = useState<string | null>(null);
  const [hoveredSceneId, setHoveredSceneId] = useState<string | null>(null);

  const timelineScenes = useMemo(() => [...scenes].sort(sortScenesByTimeline), [scenes]);
  const editingScene = useMemo(
    () => timelineScenes.find((scene) => scene.id === editingSceneId) ?? null,
    [timelineScenes, editingSceneId],
  );

  const characterMap = useMemo(
    () => new Map(characters.map((character) => [character.id, character])),
    [characters],
  );

  const upsertScene = (draft: SceneDraft) => {
    if (editingScene) {
      updateScene(editingScene.id, draft);
      return;
    }

    const createdScene = createScene(draft);
    if (!createdScene) {
      return;
    }

    analytics.track(AnalyticsEvent.SCENE_CREATED, {
      scene_id: createdScene.id,
      emotional_tone: createdScene.emotionalTone,
      involved_character_count: createdScene.involvedCharacterIds.length,
    });
    markOnboardingStepCompleted("scene_created");
  };

  const deleteEditingScene = () => {
    if (!editingScene) {
      return;
    }

    const shouldDelete = window.confirm(`Delete "${editingScene.title}" from timeline?`);
    if (!shouldDelete) {
      return;
    }

    deleteScene(editingScene.id);
    setEditingSceneId(null);
  };

  const handleDrop = (targetSceneId: string) => {
    if (!draggedSceneId || draggedSceneId === targetSceneId) {
      setDraggedSceneId(null);
      setHoveredSceneId(null);
      return;
    }

    const orderedIds = moveSceneBefore(timelineScenes, draggedSceneId, targetSceneId);
    reorderScenes(orderedIds);
    setDraggedSceneId(null);
    setHoveredSceneId(null);
  };

  return (
    <div className="relative mx-auto w-full max-w-7xl space-y-6">
      <section className="glass-panel relative overflow-hidden rounded-2xl p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,oklch(0.82_0.12_82/.12)_0%,transparent_38%),radial-gradient(circle_at_80%_74%,oklch(0.52_0.08_150/.12)_0%,transparent_38%)]" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Scene Scriptbook</p>
            <h2 className="mt-1 font-serif text-4xl text-white md:text-5xl">
              Arrange the pages of your story.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">
              Create scenes, edit them in place, and reorder the timeline as if you were moving paper
              chapters across an old writing desk.
            </p>
          </div>
          <Badge glow>{timelineScenes.length} scene pages</Badge>
        </div>
      </section>

      {error ? (
        <Card className="border-rose-300/25 bg-rose-500/10">
          <CardContent className="p-4 text-sm text-rose-100">{error}</CardContent>
        </Card>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1.04fr_1.5fr]">
        <SceneFormPanel
          key={editingScene?.id ?? "create-scene-form"}
          mode={editingScene ? "edit" : "create"}
          characters={characters}
          initialDraft={
            editingScene
              ? {
                  title: editingScene.title,
                  summary: editingScene.summary,
                  emotionalTone: editingScene.emotionalTone,
                  involvedCharacterIds: editingScene.involvedCharacterIds,
                  location: editingScene.location,
                  notes: editingScene.notes,
                }
              : undefined
          }
          onSubmit={upsertScene}
          onDelete={editingScene ? deleteEditingScene : undefined}
          onCancel={editingScene ? () => setEditingSceneId(null) : undefined}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Timeline Ordering</p>
              <h3 className="mt-1 font-serif text-2xl text-white">Drag pages to reshuffle the manuscript</h3>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-amber-200/12 bg-[linear-gradient(180deg,rgba(255,248,232,0.06),rgba(82,55,26,0.18))] px-3 py-1 text-xs text-white/70">
              <TimerReset className="h-3.5 w-3.5" />
              Smooth drag interactions enabled
            </div>
          </div>

          {isLoading && timelineScenes.length === 0 ? (
            <Card className="glass-panel border-amber-200/18">
              <CardContent className="flex min-h-72 flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="rounded-full border border-amber-200/15 bg-[linear-gradient(180deg,rgba(255,248,232,0.08),rgba(82,55,26,0.16))] p-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-serif text-2xl text-white">Loading scene archive</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We are pulling your timeline from Supabase so the manuscript reflects real user data.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : timelineScenes.length === 0 ? (
            <Card className="glass-panel border-amber-200/18">
              <CardContent className="flex min-h-72 flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="rounded-full border border-amber-200/15 bg-[linear-gradient(180deg,rgba(255,248,232,0.08),rgba(82,55,26,0.16))] p-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-serif text-2xl text-white">No scenes in timeline</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Create your first scene to begin shaping the narrative flow.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {timelineScenes.map((scene, index) => {
                const assignedCharacters = scene.involvedCharacterIds
                  .map((id) => characterMap.get(id))
                  .filter((character): character is UniverseCharacter => Boolean(character));
                const isDragged = draggedSceneId === scene.id;
                const isDropTarget = hoveredSceneId === scene.id;

                return (
                  <div
                    key={scene.id}
                    draggable
                    onDragStart={() => setDraggedSceneId(scene.id)}
                    onDragOver={(event) => {
                      event.preventDefault();
                      if (draggedSceneId && draggedSceneId !== scene.id) {
                        setHoveredSceneId(scene.id);
                      }
                    }}
                    onDragLeave={() => {
                      if (hoveredSceneId === scene.id) {
                        setHoveredSceneId(null);
                      }
                    }}
                    onDrop={() => handleDrop(scene.id)}
                    onDragEnd={() => {
                      setDraggedSceneId(null);
                      setHoveredSceneId(null);
                    }}
                    className="relative cursor-grab active:cursor-grabbing"
                  >
                    <div className="mb-2 flex items-center gap-2 text-xs text-white/60">
                      <GripVertical className="h-3.5 w-3.5" />
                      Drag to reposition in timeline
                    </div>
                    <div
                      className={[
                        "rounded-2xl transition duration-300",
                        isDragged ? "opacity-60 scale-[0.99]" : "",
                        isDropTarget ? "ring-2 ring-primary/40" : "",
                      ].join(" ")}
                    >
                      <SceneCard
                        scene={scene}
                        timelineNumber={index + 1}
                        assignedCharacters={assignedCharacters}
                        onEdit={() => setEditingSceneId(scene.id)}
                        onDelete={() => {
                          const shouldDelete = window.confirm(`Delete "${scene.title}" from timeline?`);
                          if (!shouldDelete) {
                            return;
                          }
                          deleteScene(scene.id);
                          if (editingSceneId === scene.id) {
                            setEditingSceneId(null);
                          }
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="rounded-xl border border-amber-200/12 bg-[linear-gradient(180deg,rgba(255,248,232,0.06),rgba(82,55,26,0.16))] p-3 text-xs text-muted-foreground">
            <p className="flex items-center gap-2 uppercase tracking-[0.14em] text-white/70">
              <Clapperboard className="h-3.5 w-3.5" />
              Timeline Rule
            </p>
            <p className="mt-2">
              Top scenes occur earliest. Move cards to sculpt pacing and emotional escalation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
