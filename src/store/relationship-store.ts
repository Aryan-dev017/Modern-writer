"use client";

import { create } from "zustand";
import {
  createRelationship as createRelationshipRecord,
  deleteRelationship as deleteRelationshipRecord,
  listRelationships,
  updateRelationship as updateRelationshipRecord,
} from "@/features/relationships/repository";
import { relationshipKinds, type RelationshipKind } from "@/lib/relationships/config";
import { useProjectStore } from "@/store/project-store";
import type {
  RelationshipInsert,
  RelationshipRow,
  RelationshipType as DatabaseRelationshipType,
  RelationshipUpdate,
} from "@/types/database";

export type UniverseRelationship = {
  id: string;
  projectId?: string;
  userId?: string;
  sourceCharacterId: string;
  targetCharacterId: string;
  relationshipKind: RelationshipKind;
  relationshipStrength: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type RelationshipDraft = {
  sourceCharacterId: string;
  targetCharacterId: string;
  relationshipKind: RelationshipKind;
  relationshipStrength?: number;
  notes?: string;
};

type RelationshipState = {
  relationships: UniverseRelationship[];
  isLoading: boolean;
  error: string | null;
  hydrateRelationships: (projectId?: string) => Promise<void>;
  createRelationship: (draft: RelationshipDraft) => string | null;
  updateRelationship: (id: string, draft: RelationshipDraft) => void;
  deleteRelationship: (id: string) => void;
};

function createRelationshipId() {
  return globalThis.crypto?.randomUUID?.() ?? `relationship-${Math.random().toString(36).slice(2, 10)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function getActiveProjectId() {
  const { activeProjectId, projects } = useProjectStore.getState();
  return activeProjectId ?? projects[0]?.id ?? null;
}

function databaseTypeFromKind(kind: RelationshipKind): DatabaseRelationshipType {
  return kind;
}

function kindFromDatabaseType(type: DatabaseRelationshipType): RelationshipKind {
  if (relationshipKinds.includes(type as RelationshipKind)) {
    return type as RelationshipKind;
  }

  return "friend";
}

function formatRow(row: RelationshipRow): UniverseRelationship {
  return {
    id: row.id,
    projectId: row.project_id,
    userId: row.user_id,
    sourceCharacterId: row.character_a,
    targetCharacterId: row.character_b,
    relationshipKind: kindFromDatabaseType(row.relationship_type),
    relationshipStrength: row.relationship_strength,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function pairKey(sourceCharacterId: string, targetCharacterId: string, kind: RelationshipKind) {
  return [sourceCharacterId, targetCharacterId].sort().join("::") + `::${kind}`;
}

function buildInsertPayload(
  id: string,
  projectId: string,
  draft: RelationshipDraft,
): Omit<RelationshipInsert, "user_id"> {
  return {
    id,
    project_id: projectId,
    character_a: draft.sourceCharacterId,
    character_b: draft.targetCharacterId,
    relationship_type: databaseTypeFromKind(draft.relationshipKind),
    relationship_strength: draft.relationshipStrength ?? 50,
    notes: draft.notes?.trim() ?? "",
  };
}

function buildUpdatePayload(draft: RelationshipDraft): RelationshipUpdate {
  return {
    character_a: draft.sourceCharacterId,
    character_b: draft.targetCharacterId,
    relationship_type: databaseTypeFromKind(draft.relationshipKind),
    relationship_strength: draft.relationshipStrength ?? 50,
    notes: draft.notes?.trim() ?? "",
  };
}

export const useRelationshipStore = create<RelationshipState>((set, get) => ({
  relationships: [],
  isLoading: true,
  error: null,
  hydrateRelationships: async (projectId) => {
    const targetProjectId = projectId ?? getActiveProjectId();

    if (!targetProjectId) {
      set({ relationships: [], isLoading: false, error: null });
      return;
    }

    set({ isLoading: true, error: null });
    const { data, error } = await listRelationships(targetProjectId);

    if (error) {
      set({ isLoading: false, error });
      return;
    }

    const relationships = (data ?? []).map(formatRow);
    set({ relationships, isLoading: false, error: null });
  },
  createRelationship: (draft) => {
    const projectId = getActiveProjectId();
    if (!projectId) {
      set({ error: "Create a universe before adding relationships." });
      return null;
    }

    if (draft.sourceCharacterId === draft.targetCharacterId) {
      return null;
    }

    const existingRelationship = get().relationships.find(
      (relationship) =>
        pairKey(
          relationship.sourceCharacterId,
          relationship.targetCharacterId,
          relationship.relationshipKind,
        ) === pairKey(draft.sourceCharacterId, draft.targetCharacterId, draft.relationshipKind),
    );

    if (existingRelationship) {
      return null;
    }

    const id = createRelationshipId();
    const now = nowIso();
    const previousRelationships = get().relationships;
    const nextRelationship: UniverseRelationship = {
      id,
      projectId,
      userId: undefined,
      sourceCharacterId: draft.sourceCharacterId,
      targetCharacterId: draft.targetCharacterId,
      relationshipKind: draft.relationshipKind,
      relationshipStrength: draft.relationshipStrength ?? 50,
      notes: draft.notes?.trim() ?? "",
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({
      relationships: [nextRelationship, ...state.relationships],
      error: null,
    }));

    void createRelationshipRecord(buildInsertPayload(id, projectId, draft))
      .then(({ data, error }) => {
        if (error || !data) {
          set({ relationships: previousRelationships, error: error ?? "Failed to create relationship." });
          return;
        }

        set((state) => ({
          relationships: state.relationships.map((relationship) =>
            relationship.id === id ? formatRow(data) : relationship,
          ),
        }));
      })
      .catch((error: unknown) => {
        set({
          relationships: previousRelationships,
          error: error instanceof Error ? error.message : "Failed to create relationship.",
        });
      });

    return id;
  },
  updateRelationship: (id, draft) => {
    const currentRelationship = get().relationships.find((relationship) => relationship.id === id);
    if (!currentRelationship) {
      return;
    }

    const projectId = currentRelationship.projectId ?? getActiveProjectId();
    if (!projectId) {
      return;
    }

    const previousRelationships = get().relationships;
    const nextRelationship: UniverseRelationship = {
      ...currentRelationship,
      sourceCharacterId: draft.sourceCharacterId,
      targetCharacterId: draft.targetCharacterId,
      relationshipKind: draft.relationshipKind,
      relationshipStrength: draft.relationshipStrength ?? 50,
      notes: draft.notes?.trim() ?? "",
      updatedAt: nowIso(),
    };

    set((state) => ({
      relationships: state.relationships.map((relationship) => (relationship.id === id ? nextRelationship : relationship)),
      error: null,
    }));

    void updateRelationshipRecord(id, buildUpdatePayload(draft))
      .then(({ data, error }) => {
        if (error || !data) {
          set({ relationships: previousRelationships, error: error ?? "Failed to update relationship." });
          return;
        }

        set((state) => ({
          relationships: state.relationships.map((relationship) =>
            relationship.id === id ? formatRow(data) : relationship,
          ),
        }));
      })
      .catch((error: unknown) => {
        set({
          relationships: previousRelationships,
          error: error instanceof Error ? error.message : "Failed to update relationship.",
        });
      });
  },
  deleteRelationship: (id) => {
    const currentRelationship = get().relationships.find((relationship) => relationship.id === id);
    if (!currentRelationship) {
      return;
    }

    const previousRelationships = get().relationships;
    const projectId = currentRelationship.projectId ?? getActiveProjectId();

    set((state) => ({
      relationships: state.relationships.filter((relationship) => relationship.id !== id),
      error: null,
    }));

    if (projectId) {
      void deleteRelationshipRecord(id)
        .then(({ error }) => {
          if (error) {
            set({ relationships: previousRelationships, error });
          }
        })
        .catch((error: unknown) => {
          set({
            relationships: previousRelationships,
            error: error instanceof Error ? error.message : "Failed to delete relationship.",
          });
        });
    }
  },
}));
