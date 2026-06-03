"use client";

import { MapPin, Pencil, Trash2, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { moodPalette } from "@/lib/characters/mood-system";
import { sceneToneStyles } from "@/lib/scenes/tone-style";
import type { UniverseCharacter } from "@/store/character-store";
import type { UniverseScene } from "@/store/scene-store";

type SceneCardProps = {
  scene: UniverseScene;
  timelineNumber: number;
  assignedCharacters: UniverseCharacter[];
  onEdit: () => void;
  onDelete: () => void;
};

export function SceneCard({
  scene,
  timelineNumber,
  assignedCharacters,
  onEdit,
  onDelete,
}: SceneCardProps) {
  return (
    <motion.div whileHover={{ y: -3 }} className="relative">
      <Card className="glass-panel border-white/20">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <div className="rounded-lg border border-white/20 bg-black/35 px-2 py-1 text-xs text-white/85">
                #{timelineNumber}
              </div>
              <div className="min-w-0">
                <h4 className="truncate font-serif text-xl text-white">{scene.title}</h4>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{scene.summary}</p>
              </div>
            </div>

            <span
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.14em]",
                sceneToneStyles[scene.emotionalTone],
              )}
            >
              {moodPalette[scene.emotionalTone].label}
            </span>
          </div>

          <div className="grid gap-2 text-xs text-white/80 sm:grid-cols-[1fr_auto]">
            <div className="rounded-xl border border-white/15 bg-black/25 px-3 py-2">
              <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] text-white/65">
                <Users className="h-3.5 w-3.5" />
                Involved Characters
              </p>
              <p className="mt-1 truncate">
                {assignedCharacters.length === 0
                  ? "No characters assigned"
                  : assignedCharacters.map((character) => character.name).join(", ")}
              </p>
            </div>

            <div className="rounded-xl border border-white/15 bg-black/25 px-3 py-2">
              <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] text-white/65">
                <MapPin className="h-3.5 w-3.5" />
                Location
              </p>
              <p className="mt-1 truncate">{scene.location}</p>
            </div>
          </div>

          {scene.notes ? (
            <p className="rounded-xl border border-white/15 bg-black/25 p-3 text-sm text-muted-foreground">
              {scene.notes}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="ghost" className="gap-2" onClick={onEdit}>
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
            <Button size="sm" variant="ghost" className="gap-2 text-rose-200 hover:text-rose-100" onClick={onDelete}>
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
