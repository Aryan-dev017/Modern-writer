"use client";

import { create } from "zustand";
import {
  createScene as createSceneRecord,
  deleteScene as deleteSceneRecord,
  listScenes,
  updateScene as updateSceneRecord,
} from "@/features/scenes/repository";
import { useProjectStore } from "@/store/project-store";
import type { EmotionalTone } from "@/store/character-store";
import type { SceneInsert, SceneRow, SceneUpdate } from "@/types/database";

export type UniverseScene = {
  id: string;
  projectId?: string;
  userId?: string;
  title: string;
  summary: string;
  emotionalTone: EmotionalTone;
  involvedCharacterIds: string[];
  location: string;
  notes: string;
  timelineOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type SceneDraft = Omit<UniverseScene, "id" | "timelineOrder" | "createdAt" | "updatedAt">;

type SceneStore = {
  scenes: UniverseScene[];
  isLoading: boolean;
  error: string | null;
  hydrateScenes: (projectId?: string) => Promise<void>;
  createScene: (draft: SceneDraft) => UniverseScene | null;
  updateScene: (id: string, draft: SceneDraft) => void;
  deleteScene: (id: string) => void;
  reorderScenes: (orderedIds: string[]) => void;
};

function nowIso() {
  return new Date().toISOString();
}

function createSceneId(title: string) {
  const normalized = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const uuid = globalThis.crypto?.randomUUID?.();
  const suffix = uuid ? uuid.slice(0, 6) : Math.random().toString(36).slice(2, 8);
  return `${normalized || "scene"}-${suffix}`;
}

function getActiveProjectId() {
  const { activeProjectId, projects } = useProjectStore.getState();
  return activeProjectId ?? projects[0]?.id ?? null;
}

function formatRow(row: SceneRow): UniverseScene {
  return {
    id: row.id,
    projectId: row.project_id,
    userId: row.user_id,
    title: row.title,
    summary: row.summary,
    emotionalTone: row.emotional_tone,
    involvedCharacterIds: row.involved_character_ids ?? [],
    location: row.location,
    notes: row.notes,
    timelineOrder: row.order_index,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function buildInsertPayload(
  draft: SceneDraft,
  projectId: string,
  id: string,
  orderIndex: number,
): Omit<SceneInsert, "user_id"> {
  return {
    id,
    project_id: projectId,
    title: draft.title.trim(),
    summary: draft.summary.trim(),
    emotional_tone: draft.emotionalTone,
    location: draft.location.trim(),
    order_index: orderIndex,
    involved_character_ids: [...new Set(draft.involvedCharacterIds)],
    notes: draft.notes.trim(),
  };
}

function buildUpdatePayload(draft: SceneDraft): SceneUpdate {
  return {
    title: draft.title.trim(),
    summary: draft.summary.trim(),
    emotional_tone: draft.emotionalTone,
    location: draft.location.trim(),
    involved_character_ids: [...new Set(draft.involvedCharacterIds)],
    notes: draft.notes.trim(),
  };
}

function applyTimelineOrder(scenes: UniverseScene[]) {
  return [...scenes]
    .sort((a, b) => a.timelineOrder - b.timelineOrder)
    .map((scene, index) => ({
      ...scene,
      timelineOrder: index + 1,
      updatedAt: nowIso(),
    }));
}

export const useSceneStore = create<SceneStore>((set, get) => ({
  scenes: [],
  isLoading: true,
  error: null,
  hydrateScenes: async (projectId) => {
    const targetProjectId = projectId ?? getActiveProjectId();

    if (!targetProjectId) {
      set({ scenes: [], isLoading: false, error: null });
      return;
    }

    set({ isLoading: true, error: null });
    const { data, error } = await listScenes(targetProjectId);

    if (error) {
      set({ isLoading: false, error });
      return;
    }

    const scenes = (data ?? []).map(formatRow);
    set({ scenes, isLoading: false, error: null });
  },
  createScene: (draft) => {
    const projectId = getActiveProjectId();
    if (!projectId) {
      set({ error: "Create a universe before adding scenes." });
      return null;
    }

    const now = nowIso();
    const id = createSceneId(draft.title);
    const previousScenes = get().scenes;
    const nextScene: UniverseScene = {
      ...draft,
      id,
      projectId,
      userId: undefined,
      timelineOrder: [...previousScenes].sort((a, b) => a.timelineOrder - b.timelineOrder).length + 1,
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({
      scenes: [...applyTimelineOrder([...state.scenes, nextScene])],
      error: null,
    }));

    void createSceneRecord(buildInsertPayload(draft, projectId, id, nextScene.timelineOrder))
      .then(({ data, error }) => {
        if (error || !data) {
          set({ scenes: previousScenes, error: error ?? "Failed to create scene." });
          return;
        }

        set((state) => ({
          scenes: state.scenes.map((scene) => (scene.id === id ? formatRow(data) : scene)),
        }));
      })
      .catch((error: unknown) => {
        set({
          scenes: previousScenes,
          error: error instanceof Error ? error.message : "Failed to create scene.",
        });
      });

    return nextScene;
  },
  updateScene: (id, draft) => {
    const currentScene = get().scenes.find((scene) => scene.id === id);
    if (!currentScene) {
      return;
    }

    const previousScenes = get().scenes;
    const updatedScene: UniverseScene = {
      ...currentScene,
      ...draft,
      title: draft.title.trim(),
      summary: draft.summary.trim(),
      location: draft.location.trim(),
      notes: draft.notes.trim(),
      involvedCharacterIds: [...new Set(draft.involvedCharacterIds)],
      updatedAt: nowIso(),
    };

    set((state) => ({
      scenes: state.scenes.map((scene) => (scene.id === id ? updatedScene : scene)),
      error: null,
    }));

    if (currentScene.projectId) {
      void updateSceneRecord(id, buildUpdatePayload(draft))
        .then(({ data, error }) => {
          if (error || !data) {
            set({ scenes: previousScenes, error: error ?? "Failed to update scene." });
            return;
          }

          set((state) => ({
            scenes: state.scenes.map((scene) => (scene.id === id ? formatRow(data) : scene)),
          }));
        })
        .catch((error: unknown) => {
          set({
            scenes: previousScenes,
            error: error instanceof Error ? error.message : "Failed to update scene.",
          });
        });
    }
  },
  deleteScene: (id) => {
    const currentScene = get().scenes.find((scene) => scene.id === id);
    if (!currentScene) {
      return;
    }

    const previousScenes = get().scenes;
    const projectId = currentScene.projectId;

    set((state) => ({
      scenes: applyTimelineOrder(state.scenes.filter((scene) => scene.id !== id)),
      error: null,
    }));

    if (projectId) {
      void deleteSceneRecord(id)
        .then(({ error }) => {
          if (error) {
            set({ scenes: previousScenes, error });
          }
        })
        .catch((error: unknown) => {
          set({
            scenes: previousScenes,
            error: error instanceof Error ? error.message : "Failed to delete scene.",
          });
        });
    }
  },
  reorderScenes: (orderedIds) => {
    const currentScenes = get().scenes;
    const previousScenes = currentScenes;
    const byId = new Map(currentScenes.map((scene) => [scene.id, scene] as const));
    const orderedSet = new Set(orderedIds);

    const reordered = orderedIds
      .map((id) => byId.get(id))
      .filter((scene): scene is UniverseScene => Boolean(scene))
      .map((scene, index) => ({
        ...scene,
        timelineOrder: index + 1,
        updatedAt: nowIso(),
      }));

    const remaining = currentScenes
      .filter((scene) => !orderedSet.has(scene.id))
      .sort((a, b) => a.timelineOrder - b.timelineOrder)
      .map((scene) => ({
        ...scene,
        updatedAt: nowIso(),
      }));

    const nextScenes = applyTimelineOrder([...reordered, ...remaining]);
    set({ scenes: nextScenes, error: null });

    const projectId = currentScenes[0]?.projectId ?? getActiveProjectId();
    if (projectId) {
      void (async () => {
        try {
          const tempOffset = nextScenes.length + 1000;
          await Promise.all(
            nextScenes.map((scene) =>
              updateSceneRecord(scene.id, {
                order_index: scene.timelineOrder + tempOffset,
              }),
            ),
          );
          await Promise.all(
            nextScenes.map((scene) =>
              updateSceneRecord(scene.id, {
                order_index: scene.timelineOrder,
              }),
            ),
          );
        } catch (error) {
          set({
            scenes: previousScenes,
            error: error instanceof Error ? error.message : "Failed to reorder scenes.",
          });
        }
      })();
    }
  },
}));
