"use client";

import Link from "next/link";
import { type ComponentType, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Crown, HeartCrack, LockKeyhole, Target } from "lucide-react";
import { CharacterAvatar } from "@/components/characters/character-avatar";
import { CharacterForm } from "@/components/characters/character-form";
import { RelationshipPill } from "@/components/characters/relationship-pill";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getMoodPalette } from "@/lib/characters/mood-system";
import { useCharacterStore } from "@/store/character-store";

type CharacterDetailViewProps = {
  characterId: string;
};

export function CharacterDetailView({ characterId }: CharacterDetailViewProps) {
  const router = useRouter();
  const characters = useCharacterStore((state) => state.characters);
  const updateCharacter = useCharacterStore((state) => state.updateCharacter);
  const deleteCharacter = useCharacterStore((state) => state.deleteCharacter);

  const character = useMemo(
    () => characters.find((item) => item.id === characterId),
    [characters, characterId],
  );

  if (!character) {
    return (
      <div className="mx-auto max-w-4xl">
        <Card className="glass-panel">
          <CardContent className="p-8 text-center">
            <p className="text-sm text-muted-foreground">
              That character could not be found. It may have been deleted.
            </p>
            <Link href="/dashboard/characters" className="mt-4 inline-flex text-sm text-primary">
              Return to character gallery
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const mood = getMoodPalette(character.emotionalTone);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div>
        <Link href="/dashboard/characters" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to gallery
        </Link>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1fr_1.3fr]">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <Card className={`glass-panel border-white/20 ${mood.border}`}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CharacterAvatar
                  seed={`${character.id}-${character.name}`}
                  mood={character.emotionalTone}
                  name={character.name}
                  className="h-28 w-28"
                />
                <Badge glow>{mood.label}</Badge>
              </div>
              <CardTitle className="pt-2 font-serif text-3xl text-white">{character.name}</CardTitle>
              <CardDescription className="text-primary">{character.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <InfoBlock icon={Crown} label="Personality" content={character.personality} />
              <InfoBlock icon={Target} label="Goals" content={character.goals} />
              <InfoBlock icon={HeartCrack} label="Fears" content={character.fears} />
              <InfoBlock icon={LockKeyhole} label="Secrets" content={character.secrets} />
              <InfoBlock icon={Crown} label="Biography" content={character.biography} />
              <InfoBlock icon={Target} label="Notes" content={character.notes || "No notes added yet."} />
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="font-serif text-2xl text-white">Relationship Indicators</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {character.relationships.length === 0 ? (
                <p className="text-sm text-muted-foreground">No relationships mapped yet.</p>
              ) : (
                character.relationships.map((relationship) => (
                  <RelationshipPill key={relationship.id} relationship={relationship} />
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
          <CharacterForm
            mode="edit"
            initialValue={{
              name: character.name,
              title: character.title,
              personality: character.personality,
              goals: character.goals,
              fears: character.fears,
              secrets: character.secrets,
              biography: character.biography,
              emotionalTone: character.emotionalTone,
              emotionalTags: character.emotionalTags,
              relationships: character.relationships,
              notes: character.notes,
            }}
            onSubmit={(draft) => updateCharacter(character.id, draft)}
            onDelete={() => {
              const shouldDelete = window.confirm(
                `Delete ${character.name}? This action cannot be undone.`,
              );
              if (!shouldDelete) {
                return;
              }

              deleteCharacter(character.id);
              router.push("/dashboard/characters");
            }}
          />
        </motion.div>
      </section>
    </div>
  );
}

type InfoBlockProps = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  content: string;
};

function InfoBlock({ icon: Icon, label, content }: InfoBlockProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
      <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/65">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className="pt-1.5 text-sm leading-relaxed text-white/90">{content}</p>
    </div>
  );
}
