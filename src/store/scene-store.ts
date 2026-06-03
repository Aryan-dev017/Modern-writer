"use client";

import { create } from "zustand";
import type { EmotionalTone } from "@/store/character-store";

export type UniverseScene = {
  id: string;
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
  createScene: (draft: SceneDraft) => UniverseScene | null;
  updateScene: (id: string, draft: SceneDraft) => void;
  deleteScene: (id: string) => void;
  reorderScenes: (orderedIds: string[]) => void;
};

function nowIso() {
  return new Date().toISOString();
}

function sceneIdFromTitle(title: string) {
  const normalized = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${normalized || "scene"}-${Math.random().toString(36).slice(2, 6)}`;
}

function sortByTimelineOrder(a: UniverseScene, b: UniverseScene) {
  return a.timelineOrder - b.timelineOrder;
}

function applyTimelineOrder(scenes: UniverseScene[]) {
  return [...scenes]
    .sort(sortByTimelineOrder)
    .map((scene, index) => ({
      ...scene,
      timelineOrder: index + 1,
    }));
}

const seedScenes: UniverseScene[] = [
  {
    id: "scene-ember-arrival",
    title: "Ember Gate Arrival",
    summary:
      "Kael enters Umbra Crown under false credentials as the sky-city trembles under eclipse alarms.",
    emotionalTone: "haunted",
    involvedCharacterIds: ["kael-ashborne"],
    location: "Umbra Crown - Ember Gate",
    notes: "Start with distant bells and low strings. Keep camera language wide and lonely.",
    timelineOrder: 1,
    createdAt: "2026-05-29T00:00:00.000Z",
    updatedAt: "2026-05-29T00:00:00.000Z",
  },
  {
    id: "scene-violet-oath",
    title: "Oath in the Violet Deep",
    summary:
      "Seris receives a fractured prophecy revealing the cost of unifying the twin sigils.",
    emotionalTone: "radiant",
    involvedCharacterIds: ["seris-vale", "kael-ashborne"],
    location: "Violet Deep - Oracle Vault",
    notes: "Use mirrored reflections as visual foreshadowing for betrayal.",
    timelineOrder: 2,
    createdAt: "2026-05-29T00:00:00.000Z",
    updatedAt: "2026-05-29T00:00:00.000Z",
  },
  {
    id: "scene-bridge-betrayal",
    title: "Betrayal at Hollow Bridge",
    summary:
      "Regent forces close in while Kael and Seris face a choice between loyalty and survival.",
    emotionalTone: "vengeful",
    involvedCharacterIds: ["kael-ashborne", "seris-vale"],
    location: "Hollow Bridge",
    notes: "Build pace with intercut closeups and sparse dialogue before the confrontation.",
    timelineOrder: 3,
    createdAt: "2026-05-29T00:00:00.000Z",
    updatedAt: "2026-05-29T00:00:00.000Z",
  },
];

export const useSceneStore = create<SceneStore>((set) => ({
  scenes: seedScenes,
  createScene: (draft) => {
    let createdScene: UniverseScene | null = null;

    set((state) => {
      const sortedScenes = [...state.scenes].sort(sortByTimelineOrder);
      const timestamp = nowIso();
      const nextScene: UniverseScene = {
        ...draft,
        id: sceneIdFromTitle(draft.title),
        timelineOrder: sortedScenes.length + 1,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      createdScene = nextScene;

      return {
        scenes: [...sortedScenes, nextScene],
      };
    });

    return createdScene;
  },
  updateScene: (id, draft) =>
    set((state) => ({
      scenes: state.scenes.map((scene) =>
        scene.id === id
          ? {
              ...scene,
              ...draft,
              updatedAt: nowIso(),
            }
          : scene,
      ),
    })),
  deleteScene: (id) =>
    set((state) => ({
      scenes: applyTimelineOrder(state.scenes.filter((scene) => scene.id !== id)),
    })),
  reorderScenes: (orderedIds) =>
    set((state) => {
      const mapById = new Map(state.scenes.map((scene) => [scene.id, scene]));
      const knownIds = new Set(state.scenes.map((scene) => scene.id));

      const reordered = orderedIds
        .filter((id) => knownIds.has(id))
        .map((id, index) => {
          const scene = mapById.get(id);
          if (!scene) {
            return null;
          }
          return {
            ...scene,
            timelineOrder: index + 1,
            updatedAt: nowIso(),
          } satisfies UniverseScene;
        })
        .filter((scene): scene is UniverseScene => scene !== null);

      if (reordered.length !== state.scenes.length) {
        const remaining = state.scenes.filter((scene) => !orderedIds.includes(scene.id));
        return {
          scenes: applyTimelineOrder([...reordered, ...remaining]),
        };
      }

      return { scenes: reordered };
    }),
}));
