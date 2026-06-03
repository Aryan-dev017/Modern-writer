"use client";

import { create } from "zustand";

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
};

export type UniverseCharacter = {
  id: string;
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
  createCharacter: (draft: CharacterDraft) => string;
  updateCharacter: (id: string, draft: CharacterDraft) => void;
  deleteCharacter: (id: string) => void;
};

const seedCharacters: UniverseCharacter[] = [
  {
    id: "kael-ashborne",
    name: "Kael Ashborne",
    title: "Exiled Flame Cartographer",
    personality:
      "Measured, observant, and unexpectedly tender when hope seems impossible.",
    goals:
      "Map the vanished ember routes and reunite the fractured city-kingdom under one sky oath.",
    fears: "Losing his memory to the abyssal hymn and forgetting the sister he swore to protect.",
    secrets:
      "He carries an illegal star-sigil beneath his pulse, linked to the empire that destroyed his house.",
    biography:
      "Kael grew up tracing forbidden constellations on ruined observatories. When the Crown banished him, he became a smuggler of stories and sacred maps.",
    emotionalTone: "haunted",
    emotionalTags: ["resilience", "sorrow", "duty"],
    relationships: [
      {
        id: "r-1",
        name: "Seris Vale",
        type: "ally",
        intensity: "fated",
      },
      {
        id: "r-2",
        name: "Regent Morra",
        type: "rival",
        intensity: "tangled",
      },
    ],
    notes:
      "His scenes land best when dialogue is short and visual beats carry the emotion.",
    createdAt: "2026-05-29T00:00:00.000Z",
    updatedAt: "2026-05-29T00:00:00.000Z",
  },
  {
    id: "seris-vale",
    name: "Seris Vale",
    title: "Oracle of the Violet Deep",
    personality: "Radiant, cunning, and ritualistic; warmth hides strategic precision.",
    goals: "Prevent the prophecy split and protect the archive of living memories.",
    fears: "Becoming a puppet oracle whose visions are scripted by the council.",
    secrets:
      "She has already seen one ending where Kael dies by her own command and hides that truth.",
    biography:
      "Seris was chosen by the Deep as a child and trained to speak with tides of memory. Her prophecies are feared because they arrive with impossible detail.",
    emotionalTone: "radiant",
    emotionalTags: ["intuition", "compassion", "ambiguity"],
    relationships: [
      {
        id: "r-3",
        name: "Kael Ashborne",
        type: "muse",
        intensity: "fated",
      },
      {
        id: "r-4",
        name: "Archivist Nyra",
        type: "mentor",
        intensity: "faint",
      },
    ],
    notes: "Use luminous imagery around water and mirrors whenever Seris enters a scene.",
    createdAt: "2026-05-29T00:00:00.000Z",
    updatedAt: "2026-05-29T00:00:00.000Z",
  },
];

function createCharacterId(name: string) {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base || "character"}-${suffix}`;
}

export const useCharacterStore = create<CharacterState>((set) => ({
  characters: seedCharacters,
  createCharacter: (draft) => {
    const now = new Date().toISOString();
    const nextCharacter: UniverseCharacter = {
      ...draft,
      id: createCharacterId(draft.name),
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({
      characters: [nextCharacter, ...state.characters],
    }));

    return nextCharacter.id;
  },
  updateCharacter: (id, draft) =>
    set((state) => ({
      characters: state.characters.map((character) =>
        character.id === id
          ? {
              ...character,
              ...draft,
              updatedAt: new Date().toISOString(),
            }
          : character,
      ),
    })),
  deleteCharacter: (id) =>
    set((state) => ({
      characters: state.characters.filter((character) => character.id !== id),
    })),
}));
