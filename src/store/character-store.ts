"use client";

import { create } from "zustand";
import {
  createCharacter as createCharacterRecord,
  deleteCharacter as deleteCharacterRecord,
  listCharacters,
  updateCharacter as updateCharacterRecord,
} from "@/features/characters/repository";
import { useProjectStore } from "@/store/project-store";
import type {
  CharacterInsert,
  CharacterRow,
  CharacterUpdate,
  EmotionalTone as DatabaseEmotionalTone,
  Json,
} from "@/types/database";

export type EmotionalTone =
  | "hopeful"
  | "melancholic"
  | "vengeful"
  | "haunted"
  | "radiant"
  | "enigmatic";

export type RelationshipType = "ally" | "rival" | "mentor" | "kin" | "muse";
export type RelationshipIntensity = "faint" | "tangled" | "fated";

export type CharacterRelationship = {
  id: string;
  name: string;
  type: RelationshipType;
  intensity: RelationshipIntensity;
  targetCharacterId?: string;
};

export type UniverseCharacter = {
  id: string;
  projectId?: string;
  userId?: string;
  name: string;
  title: string;
  personality: string;
  goals: string;
  fears: string;
  secrets: string;
  biography: string;
  emotionalTone: EmotionalTone;
  emotionalTags: string[];
  relationships: CharacterRelationship[];
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type CharacterDraft = Omit<UniverseCharacter, "id" | "createdAt" | "updatedAt">;

type CharacterState = {
  characters: UniverseCharacter[];
  isLoading: boolean;
  error: string | null;
  hydrateCharacters: (projectId?: string) => Promise<void>;
  createCharacter: (draft: CharacterDraft) => string;
  updateCharacter: (id: string, draft: CharacterDraft) => void;
  deleteCharacter: (id: string) => void;
};

function createCharacterId(name: string) {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const uuid = globalThis.crypto?.randomUUID?.();
  const suffix = uuid ? uuid.slice(0, 6) : Math.random().toString(36).slice(2, 8);
  return `${base || "character"}-${suffix}`;
}

function createRelationshipId() {
  return globalThis.crypto?.randomUUID?.() ?? `relationship-${Math.random().toString(36).slice(2, 10)}`;
}

function mapDatabaseTone(tone: DatabaseEmotionalTone): EmotionalTone {
  return tone;
}

function isRelationshipType(value: unknown): value is RelationshipType {
  return value === "ally" || value === "rival" || value === "mentor" || value === "kin" || value === "muse";
}

function isRelationshipIntensity(value: unknown): value is RelationshipIntensity {
  return value === "faint" || value === "tangled" || value === "fated";
}

function parseRelationshipIndicators(value: Json): CharacterRelationship[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return [];
    }

    const record = item as Record<string, unknown>;
    const name = typeof record.name === "string" ? record.name.trim() : "";

    if (!name) {
      return [];
    }

    return [
      {
        id:
          typeof record.id === "string" && record.id.trim()
            ? record.id
            : createRelationshipId(),
        name,
        type: isRelationshipType(record.type) ? record.type : "ally",
        intensity: isRelationshipIntensity(record.intensity) ? record.intensity : "tangled",
        targetCharacterId:
          typeof record.targetCharacterId === "string" && record.targetCharacterId.trim()
            ? record.targetCharacterId
            : undefined,
      } satisfies CharacterRelationship,
    ];
  });
}

function formatCharacterRow(row: CharacterRow): UniverseCharacter {
  return {
    id: row.id,
    projectId: row.project_id,
    userId: row.user_id,
    name: row.name,
    title: row.title,
    personality: row.personality,
    goals: row.goals,
    fears: row.fears,
    secrets: row.secrets,
    biography: row.bio,
    emotionalTone: mapDatabaseTone(row.emotional_tone),
    emotionalTags: row.emotional_tags ?? [],
    relationships: parseRelationshipIndicators(row.relationship_indicators),
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function getActiveProjectId() {
  const { activeProjectId, projects } = useProjectStore.getState();
  return activeProjectId ?? projects[0]?.id ?? null;
}

function getGradientForTone(tone: EmotionalTone) {
  switch (tone) {
    case "hopeful":
      return "linear-gradient(135deg, rgba(251,191,36,0.82), rgba(34,197,94,0.56))";
    case "melancholic":
      return "linear-gradient(135deg, rgba(120,113,108,0.82), rgba(87,83,78,0.54))";
    case "vengeful":
      return "linear-gradient(135deg, rgba(190,24,93,0.84), rgba(180,83,9,0.54))";
    case "haunted":
      return "linear-gradient(135deg, rgba(55,65,81,0.86), rgba(22,101,52,0.54))";
    case "radiant":
      return "linear-gradient(135deg, rgba(251,191,36,0.82), rgba(245,158,11,0.54))";
    case "enigmatic":
    default:
      return "linear-gradient(135deg, rgba(146,64,14,0.82), rgba(120,53,15,0.54))";
  }
}

function getSymbolForTone(tone: EmotionalTone) {
  switch (tone) {
    case "hopeful":
      return "*";
    case "melancholic":
      return "o";
    case "vengeful":
      return "^";
    case "haunted":
      return "#";
    case "radiant":
      return "+";
    case "enigmatic":
    default:
      return "?";
  }
}

function buildInsertPayload(draft: CharacterDraft, projectId: string, id: string): Omit<CharacterInsert, "user_id"> {
  return {
    id,
    project_id: projectId,
    name: draft.name.trim(),
    title: draft.title.trim(),
    bio: draft.biography.trim(),
    personality: draft.personality.trim(),
    goals: draft.goals.trim(),
    fears: draft.fears.trim(),
    secrets: draft.secrets.trim(),
    emotional_tone: draft.emotionalTone,
    avatar_gradient: getGradientForTone(draft.emotionalTone),
    symbol: getSymbolForTone(draft.emotionalTone),
    emotional_tags: [...draft.emotionalTags],
    relationship_indicators: [...draft.relationships],
    notes: draft.notes.trim(),
  };
}

function buildUpdatePayload(draft: CharacterDraft, projectId: string): CharacterUpdate {
  return {
    project_id: projectId,
    name: draft.name.trim(),
    title: draft.title.trim(),
    bio: draft.biography.trim(),
    personality: draft.personality.trim(),
    goals: draft.goals.trim(),
    fears: draft.fears.trim(),
    secrets: draft.secrets.trim(),
    emotional_tone: draft.emotionalTone,
    avatar_gradient: getGradientForTone(draft.emotionalTone),
    symbol: getSymbolForTone(draft.emotionalTone),
    emotional_tags: [...draft.emotionalTags],
    relationship_indicators: [...draft.relationships],
    notes: draft.notes.trim(),
  };
}

export const useCharacterStore = create<CharacterState>((set, get) => ({
  characters: [],
  isLoading: true,
  error: null,
  hydrateCharacters: async (projectId) => {
    const targetProjectId = projectId ?? getActiveProjectId();

    if (!targetProjectId) {
      set({ characters: [], isLoading: false, error: null });
      return;
    }

    set({ isLoading: true, error: null });
    const { data, error } = await listCharacters(targetProjectId);

    if (error) {
      set({ isLoading: false, error });
      return;
    }

    const characters = (data ?? []).map(formatCharacterRow);
    set({ characters, isLoading: false, error: null });
  },
  createCharacter: (draft) => {
    const now = new Date().toISOString();
    const projectId = getActiveProjectId();
    if (!projectId) {
      set({ error: "Create a universe before adding characters." });
      return "";
    }

    const id = createCharacterId(draft.name);
    const previousCharacters = get().characters;

    const nextCharacter: UniverseCharacter = {
      ...draft,
      id,
      projectId,
      userId: undefined,
      biography: draft.biography.trim(),
      emotionalTags: [...draft.emotionalTags],
      relationships: [...draft.relationships],
      notes: draft.notes.trim(),
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({
      characters: [nextCharacter, ...state.characters],
      error: null,
    }));

    if (projectId) {
      void createCharacterRecord(buildInsertPayload(draft, projectId, id))
        .then(({ data, error }) => {
          if (error || !data) {
            set({ characters: previousCharacters, error: error ?? "Failed to create character." });
            return;
          }

          set((state) => ({
            characters: state.characters.map((character) =>
              character.id === id ? formatCharacterRow(data) : character,
            ),
          }));
        })
        .catch((error: unknown) => {
          set({
            characters: previousCharacters,
            error: error instanceof Error ? error.message : "Failed to create character.",
          });
        });
    }

    return nextCharacter.id;
  },
  updateCharacter: (id, draft) => {
    const currentCharacter = get().characters.find((character) => character.id === id);
    if (!currentCharacter) {
      return;
    }

    const previousCharacters = get().characters;
    const projectId = currentCharacter.projectId ?? getActiveProjectId();
    if (!projectId) {
      set({ error: "Create a universe before editing characters." });
      return;
    }
    const updatedAt = new Date().toISOString();

    const nextCharacters = get().characters.map((character) =>
      character.id === id
        ? {
            ...character,
            ...draft,
            biography: draft.biography.trim(),
            emotionalTags: [...draft.emotionalTags],
            relationships: [...draft.relationships],
            notes: draft.notes.trim(),
            updatedAt,
          }
        : character,
    );

    set({ characters: nextCharacters, error: null });

    if (projectId) {
      void updateCharacterRecord(id, buildUpdatePayload(draft, projectId))
        .then(({ data, error }) => {
          if (error || !data) {
            set({ characters: previousCharacters, error: error ?? "Failed to update character." });
            return;
          }

          set((state) => ({
            characters: state.characters.map((character) =>
              character.id === id ? formatCharacterRow(data) : character,
            ),
          }));
        })
        .catch((error: unknown) => {
          set({
            characters: previousCharacters,
            error: error instanceof Error ? error.message : "Failed to update character.",
          });
        });
    }
  },
  deleteCharacter: (id) => {
    const currentCharacter = get().characters.find((character) => character.id === id);
    if (!currentCharacter) {
      return;
    }

    const previousCharacters = get().characters;
    const projectId = currentCharacter.projectId ?? getActiveProjectId();
    if (!projectId) {
      set({ error: "Create a universe before deleting characters." });
      return;
    }

    set((state) => ({
      characters: state.characters.filter((character) => character.id !== id),
      error: null,
    }));

    if (projectId) {
      void deleteCharacterRecord(id)
        .then(({ error }) => {
          if (error) {
            set({ characters: previousCharacters, error });
          }
        })
        .catch((error: unknown) => {
          set({
            characters: previousCharacters,
            error: error instanceof Error ? error.message : "Failed to delete character.",
          });
        });
    }
  },
}));

export type { CharacterState };
