"use client";

import { create } from "zustand";

type UniverseProject = {
  id: string;
  title: string;
  genre: string;
  characterCount: number;
  sceneCount: number;
  atmosphericGradient: string;
  updatedAt: string;
};

type CreateUniverseInput = {
  title: string;
  genre: string;
};

type ProjectStore = {
  projects: UniverseProject[];
  createProject: (input: CreateUniverseInput) => UniverseProject | null;
};

const atmosphericGradients = [
  "linear-gradient(135deg, oklch(0.62 0.21 286) 0%, oklch(0.42 0.14 246) 55%, oklch(0.28 0.08 225) 100%)",
  "linear-gradient(140deg, oklch(0.67 0.19 310) 0%, oklch(0.52 0.16 264) 45%, oklch(0.35 0.08 245) 100%)",
  "linear-gradient(125deg, oklch(0.62 0.2 20) 0%, oklch(0.5 0.16 305) 50%, oklch(0.3 0.08 255) 100%)",
  "linear-gradient(150deg, oklch(0.72 0.19 225) 0%, oklch(0.54 0.15 268) 55%, oklch(0.32 0.08 260) 100%)",
  "linear-gradient(130deg, oklch(0.66 0.17 176) 0%, oklch(0.54 0.17 254) 50%, oklch(0.34 0.1 278) 100%)",
];

const seedProjects: UniverseProject[] = [
  {
    id: "umbra-crown",
    title: "Chronicles of Umbra Crown",
    genre: "Epic Fantasy",
    characterCount: 32,
    sceneCount: 118,
    atmosphericGradient: atmosphericGradients[0],
    updatedAt: "2026-05-29T14:20:00.000Z",
  },
  {
    id: "violet-deep",
    title: "The Violet Deep Archive",
    genre: "Mystic Sci-Fi",
    characterCount: 19,
    sceneCount: 74,
    atmosphericGradient: atmosphericGradients[2],
    updatedAt: "2026-05-29T10:06:00.000Z",
  },
  {
    id: "ashen-meridian",
    title: "Ashen Meridian Saga",
    genre: "Dark Adventure",
    characterCount: 24,
    sceneCount: 93,
    atmosphericGradient: atmosphericGradients[4],
    updatedAt: "2026-05-28T19:44:00.000Z",
  },
];

function idFromTitle(title: string) {
  const normalized = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${normalized || "universe"}-${Math.random().toString(36).slice(2, 6)}`;
}

function gradientForTitle(title: string) {
  let hash = 0;
  for (let index = 0; index < title.length; index += 1) {
    hash = (hash << 5) - hash + title.charCodeAt(index);
    hash |= 0;
  }

  const gradientIndex = Math.abs(hash) % atmosphericGradients.length;
  return atmosphericGradients[gradientIndex];
}

export function formatUpdatedTime(iso: string) {
  const now = Date.now();
  const updated = new Date(iso).getTime();
  const diffMinutes = Math.max(1, Math.floor((now - updated) / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: seedProjects,
  createProject: (input) => {
    let createdProject: UniverseProject | null = null;

    set((state) => {
      const title = input.title.trim();
      const genre = input.genre.trim();

      if (!title || !genre) {
        return state;
      }

      const now = new Date().toISOString();
      const nextProject: UniverseProject = {
        id: idFromTitle(title),
        title,
        genre,
        characterCount: 0,
        sceneCount: 0,
        atmosphericGradient: gradientForTitle(title),
        updatedAt: now,
      };

      createdProject = nextProject;

      return {
        projects: [nextProject, ...state.projects],
      };
    });

    return createdProject;
  },
}));

export type { UniverseProject };
