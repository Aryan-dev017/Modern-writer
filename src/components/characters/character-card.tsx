"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Network, ScrollText } from "lucide-react";
import { CharacterAvatar } from "@/components/characters/character-avatar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getMoodPalette } from "@/lib/characters/mood-system";
import type { UniverseCharacter } from "@/store/character-store";

type CharacterCardProps = {
  character: UniverseCharacter;
};

export function CharacterCard({ character }: CharacterCardProps) {
  const mood = getMoodPalette(character.emotionalTone);

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Link href={`/dashboard/characters/${character.id}`} className="block">
        <Card
          className={cn(
            "group relative overflow-hidden border-border/70 bg-card/70 transition duration-300 hover:border-white/40",
            mood.glow,
          )}
        >
          <div className="absolute right-0 top-0 h-20 w-24 bg-gradient-to-bl from-white/10 to-transparent" />

          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <CharacterAvatar
                seed={`${character.id}-${character.name}`}
                name={character.name}
                mood={character.emotionalTone}
              />

              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{mood.label}</p>
                <h3 className="truncate pt-1 font-serif text-2xl text-white">{character.name}</h3>
                <p className="truncate text-sm text-primary">{character.title}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {character.emotionalTags.slice(0, 3).map((tag) => (
                    <span
                      key={`${character.id}-${tag}`}
                      className="rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-[11px] uppercase tracking-[0.15em] text-white/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="mt-3 max-h-10 overflow-hidden text-sm text-muted-foreground">
                  {character.personality}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="rounded-lg border border-white/10 bg-black/20 px-2.5 py-2">
                <p className="flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-white/70">
                  <Network className="h-3 w-3" />
                  Bonds
                </p>
                <p className="pt-1 text-sm text-white">{character.relationships.length}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/20 px-2.5 py-2">
                <p className="flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-white/70">
                  <ScrollText className="h-3 w-3" />
                  Secrets
                </p>
                <p className="truncate pt-1 text-sm text-white">{character.secrets.split(" ").length} words</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
