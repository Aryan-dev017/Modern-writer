"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Filter, LibraryBig, Search } from "lucide-react";
import { AnalyticsEvent } from "@/lib/analytics/events";
import { useAnalytics } from "@/lib/analytics/hooks";
import { markOnboardingStepCompleted } from "@/lib/analytics/onboarding";
import { CharacterCard } from "@/components/characters/character-card";
import { CharacterForm } from "@/components/characters/character-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { moodPalette } from "@/lib/characters/mood-system";
import type { EmotionalTone } from "@/store/character-store";
import { useCharacterStore } from "@/store/character-store";

export function CharacterManagerView() {
  const analytics = useAnalytics();
  const characters = useCharacterStore((state) => state.characters);
  const createCharacter = useCharacterStore((state) => state.createCharacter);
  const [query, setQuery] = useState("");
  const [toneFilter, setToneFilter] = useState<"all" | EmotionalTone>("all");

  const filteredCharacters = useMemo(() => {
    return characters.filter((character) => {
      const normalizedQuery = query.trim().toLowerCase();
      const inQuery =
        !normalizedQuery ||
        character.name.toLowerCase().includes(normalizedQuery) ||
        character.title.toLowerCase().includes(normalizedQuery) ||
        character.emotionalTags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      const inTone = toneFilter === "all" || character.emotionalTone === toneFilter;
      return inQuery && inTone;
    });
  }, [characters, query, toneFilter]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-2xl p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Character Vault</p>
            <h2 className="mt-1 font-serif text-3xl text-white">Collectible Character Codex</h2>
          </div>
          <Badge glow>{characters.length} registered presences</Badge>
        </div>
      </motion.section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_1.35fr]">
        <CharacterForm
          mode="create"
          onSubmit={(draft) => {
            const characterId = createCharacter(draft);
            analytics.track(AnalyticsEvent.CHARACTER_CREATED, {
              character_id: characterId,
              emotional_tone: draft.emotionalTone,
            });
            markOnboardingStepCompleted("character_created");
          }}
        />

        <div className="space-y-4">
          <Card className="glass-panel">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif text-2xl text-white">Character Gallery</CardTitle>
                <LibraryBig className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                <label className="relative block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search names, titles, tags"
                    className="w-full rounded-xl border border-white/15 bg-black/25 py-2.5 pl-9 pr-3 text-sm text-white outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/30"
                  />
                </label>
                <label className="relative block">
                  <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                  <select
                    value={toneFilter}
                    onChange={(event) => setToneFilter(event.target.value as "all" | EmotionalTone)}
                    className="w-full rounded-xl border border-white/15 bg-black/25 py-2.5 pl-9 pr-8 text-sm text-white outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="all">All moods</option>
                    {(Object.keys(moodPalette) as EmotionalTone[]).map((tone) => (
                      <option key={tone} value={tone}>
                        {moodPalette[tone].label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </CardContent>
          </Card>

          {filteredCharacters.length === 0 ? (
            <Card className="glass-panel">
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                No characters match this filter. Shift your emotional tone or search query.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredCharacters.map((character) => (
                <CharacterCard key={character.id} character={character} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
