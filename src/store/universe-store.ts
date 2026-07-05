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

export const useUniverseStore = create<UniverseState>((set) => ({
  acts: [],
  activeActId: "",
  cinematicMode: true,
  setActiveAct: (id) => set({ activeActId: id }),
  toggleCinematicMode: () =>
    set((state) => ({ cinematicMode: !state.cinematicMode })),
}));
