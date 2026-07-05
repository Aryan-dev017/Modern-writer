"use client";

import { create } from "zustand";
import {
  createProject as createProjectRecord,
  deleteProject as deleteProjectRecord,
  listProjects,
  updateProject as updateProjectRecord,
} from "@/features/projects/repository";
import type { ProjectRow } from "@/types/database";

type UniverseProject = {
  id: string;
  userId?: string;
  title: string;
  description: string;
  genre: string;
  coverImage: string | null;
  characterCount: number;
  sceneCount: number;
  atmosphericGradient: string;
  createdAt: string;
  updatedAt: string;
};

type CreateUniverseInput = {
  title: string;
  genre: string;
  description?: string;
  coverImage?: string | null;
};

type ProjectStore = {
  projects: UniverseProject[];
  activeProjectId: string | null;
  isLoading: boolean;
  error: string | null;
  setActiveProjectId: (id: string | null) => void;
  hydrateProjects: () => Promise<void>;
  createProject: (input: CreateUniverseInput) => UniverseProject | null;
  updateProject: (id: string, input: Partial<CreateUniverseInput>) => void;
  deleteProject: (id: string) => void;
};

const atmosphericGradients = [
  "linear-gradient(135deg, oklch(0.78 0.12 82) 0%, oklch(0.46 0.08 150) 55%, oklch(0.26 0.05 78) 100%)",
  "linear-gradient(140deg, oklch(0.74 0.11 54) 0%, oklch(0.52 0.09 32) 45%, oklch(0.28 0.05 78) 100%)",
  "linear-gradient(125deg, oklch(0.7 0.1 82) 0%, oklch(0.44 0.08 145) 50%, oklch(0.26 0.05 78) 100%)",
  "linear-gradient(150deg, oklch(0.8 0.11 80) 0%, oklch(0.56 0.08 30) 55%, oklch(0.3 0.05 72) 100%)",
  "linear-gradient(130deg, oklch(0.72 0.1 150) 0%, oklch(0.54 0.11 82) 50%, oklch(0.28 0.05 78) 100%)",
];

function createClientId(prefix: string) {
  return globalThis.crypto?.randomUUID?.() ?? `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
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

function formatRow(row: ProjectRow): UniverseProject {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description,
    genre: row.genre,
    coverImage: row.cover_image,
    characterCount: row.character_count,
    sceneCount: row.scene_count,
    atmosphericGradient: row.atmospheric_gradient,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function nowIso() {
  return new Date().toISOString();
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

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  activeProjectId: null,
  isLoading: true,
  error: null,
  setActiveProjectId: (id) => set({ activeProjectId: id }),
  hydrateProjects: async () => {
    set({ isLoading: true, error: null });
    const { data, error } = await listProjects();

    if (error) {
      set({ isLoading: false, error });
      return;
    }

    const projects = (data ?? []).map(formatRow);
    set({
      projects,
      activeProjectId: projects[0]?.id ?? null,
      isLoading: false,
      error: null,
    });
  },
  createProject: (input) => {
    const title = input.title.trim();
    const genre = input.genre.trim();

    if (!title || !genre) {
      return null;
    }

    const now = nowIso();
    const id = createClientId("project");
    const previousProjects = get().projects;
    const previousActiveProjectId = get().activeProjectId;

    const nextProject: UniverseProject = {
      id,
      title,
      description: input.description?.trim() ?? "",
      genre,
      coverImage: input.coverImage ?? null,
      characterCount: 0,
      sceneCount: 0,
      atmosphericGradient: gradientForTitle(title),
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({
      projects: [nextProject, ...state.projects],
      activeProjectId: nextProject.id,
      error: null,
    }));

    void createProjectRecord({
      id,
      title: nextProject.title,
      description: nextProject.description,
      genre: nextProject.genre,
      coverImage: nextProject.coverImage,
      characterCount: nextProject.characterCount,
      sceneCount: nextProject.sceneCount,
      atmosphericGradient: nextProject.atmosphericGradient,
    })
      .then(({ data, error }) => {
        if (error || !data) {
          set({
            projects: previousProjects,
            activeProjectId: previousActiveProjectId,
            error: error ?? "Failed to create project.",
          });
          return;
        }

        set((state) => ({
          projects: state.projects.map((project) => (project.id === id ? formatRow(data) : project)),
        }));
      })
      .catch((error: unknown) => {
        set({
          projects: previousProjects,
          activeProjectId: previousActiveProjectId,
          error: error instanceof Error ? error.message : "Failed to create project.",
        });
      });

    return nextProject;
  },
  updateProject: (id, input) => {
    const currentProject = get().projects.find((project) => project.id === id);
    if (!currentProject) {
      return;
    }

    const previousProjects = get().projects;
    const nextUpdatedAt = nowIso();
    const nextProject: UniverseProject = {
      ...currentProject,
      title: input.title?.trim() ?? currentProject.title,
      description: input.description?.trim() ?? currentProject.description,
      genre: input.genre?.trim() ?? currentProject.genre,
      coverImage: input.coverImage ?? currentProject.coverImage,
      updatedAt: nextUpdatedAt,
    };

    set((state) => ({
      projects: state.projects.map((project) => (project.id === id ? nextProject : project)),
      error: null,
    }));

    void updateProjectRecord(id, {
      title: input.title?.trim(),
      description: input.description?.trim(),
      genre: input.genre?.trim(),
      cover_image: input.coverImage ?? undefined,
    })
      .then(({ data, error }) => {
        if (error || !data) {
          set({
            projects: previousProjects,
            error: error ?? "Failed to update project.",
          });
          return;
        }

        set((state) => ({
          projects: state.projects.map((project) => (project.id === id ? formatRow(data) : project)),
        }));
      })
      .catch((error: unknown) => {
        set({
          projects: previousProjects,
          error: error instanceof Error ? error.message : "Failed to update project.",
        });
      });
  },
  deleteProject: (id) => {
    const previousProjects = get().projects;
    const previousActiveProjectId = get().activeProjectId;

    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
      activeProjectId:
        state.activeProjectId === id
          ? state.projects.find((project) => project.id !== id)?.id ?? null
          : state.activeProjectId,
      error: null,
    }));

    void deleteProjectRecord(id)
      .then(({ error }) => {
        if (error) {
          set({
            projects: previousProjects,
            activeProjectId: previousActiveProjectId,
            error,
          });
        }
      })
      .catch((error: unknown) => {
        set({
          projects: previousProjects,
          activeProjectId: previousActiveProjectId,
          error: error instanceof Error ? error.message : "Failed to delete project.",
        });
      });
  },
}));

export type { UniverseProject };
