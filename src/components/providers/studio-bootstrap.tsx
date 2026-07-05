"use client";

import { useEffect } from "react";
import { useCharacterStore } from "@/store/character-store";
import { useProjectStore } from "@/store/project-store";
import { useRelationshipStore } from "@/store/relationship-store";
import { useSceneStore } from "@/store/scene-store";

export function StudioBootstrap() {
  const activeProjectId = useProjectStore((state) => state.activeProjectId);
  const hydrateProjects = useProjectStore((state) => state.hydrateProjects);
  const hydrateCharacters = useCharacterStore((state) => state.hydrateCharacters);
  const hydrateRelationships = useRelationshipStore((state) => state.hydrateRelationships);
  const hydrateScenes = useSceneStore((state) => state.hydrateScenes);

  useEffect(() => {
    void hydrateProjects();
  }, [hydrateProjects]);

  useEffect(() => {
    void hydrateCharacters(activeProjectId ?? undefined);
    void hydrateRelationships(activeProjectId ?? undefined);
    void hydrateScenes(activeProjectId ?? undefined);
  }, [activeProjectId, hydrateCharacters, hydrateRelationships, hydrateScenes]);

  return null;
}
