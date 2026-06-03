import { create } from "zustand";

export type StoryAct = {
  id: string;
  title: string;
  tone: string;
  completion: number;
  sceneCount: number;
};

type UniverseState = {
  acts: StoryAct[];
  activeActId: string;
  cinematicMode: boolean;
  setActiveAct: (id: string) => void;
  toggleCinematicMode: () => void;
};

const seedActs: StoryAct[] = [
  {
    id: "act-i",
    title: "Act I - Ember Arrival",
    tone: "Wonder and unease",
    completion: 82,
    sceneCount: 12,
  },
  {
    id: "act-ii",
    title: "Act II - Fractured Oath",
    tone: "Conflict and revelation",
    completion: 54,
    sceneCount: 9,
  },
  {
    id: "act-iii",
    title: "Act III - Midnight Ascension",
    tone: "Sacrifice and transcendence",
    completion: 27,
    sceneCount: 6,
  },
];

export const useUniverseStore = create<UniverseState>((set) => ({
  acts: seedActs,
  activeActId: seedActs[0].id,
  cinematicMode: true,
  setActiveAct: (id) => set({ activeActId: id }),
  toggleCinematicMode: () =>
    set((state) => ({ cinematicMode: !state.cinematicMode })),
}));
