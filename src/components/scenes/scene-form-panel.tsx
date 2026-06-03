"use client";

import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import { Clapperboard, Film, Save, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { moodPalette } from "@/lib/characters/mood-system";
import type { EmotionalTone, UniverseCharacter } from "@/store/character-store";
import type { SceneDraft } from "@/store/scene-store";

type SceneFormPanelProps = {
  mode: "create" | "edit";
  characters: UniverseCharacter[];
  initialDraft?: SceneDraft;
  onSubmit: (draft: SceneDraft) => void;
  onDelete?: () => void;
  onCancel?: () => void;
};

const emptySceneDraft: SceneDraft = {
  title: "",
  summary: "",
  emotionalTone: "enigmatic",
  involvedCharacterIds: [],
  location: "",
  notes: "",
};

const emotionalTones = Object.keys(moodPalette) as EmotionalTone[];

export function SceneFormPanel({
  mode,
  characters,
  initialDraft,
  onSubmit,
  onDelete,
  onCancel,
}: SceneFormPanelProps) {
  const [draft, setDraft] = useState<SceneDraft>(initialDraft ?? emptySceneDraft);
  const selectedCharacters = useMemo(
    () => characters.filter((character) => draft.involvedCharacterIds.includes(character.id)),
    [characters, draft.involvedCharacterIds],
  );

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedDraft: SceneDraft = {
      ...draft,
      title: draft.title.trim(),
      summary: draft.summary.trim(),
      location: draft.location.trim(),
      notes: draft.notes.trim(),
      involvedCharacterIds: [...new Set(draft.involvedCharacterIds)],
    };

    onSubmit(trimmedDraft);

    if (mode === "create") {
      setDraft(emptySceneDraft);
    }
  };

  const updateField = <K extends keyof SceneDraft>(key: K, value: SceneDraft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const toggleCharacter = (characterId: string) =>
    setDraft((current) => {
      const exists = current.involvedCharacterIds.includes(characterId);
      return {
        ...current,
        involvedCharacterIds: exists
          ? current.involvedCharacterIds.filter((id) => id !== characterId)
          : [...current.involvedCharacterIds, characterId],
      };
    });

  return (
    <Card className="glass-panel overflow-hidden border-white/20">
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-violet-400 to-secondary" />
      <CardHeader>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {mode === "create" ? "Scene Forge" : "Scene Revision"}
        </p>
        <CardTitle className="font-serif text-2xl text-white">
          {mode === "create" ? "Create Cinematic Scene" : "Edit Scene"}
        </CardTitle>
        <CardDescription>
          Shape tone, cast, and timeline gravity for each story beat.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Title">
            <input
              required
              value={draft.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Scene title"
              className={inputClass}
            />
          </Field>

          <Field label="Summary">
            <textarea
              required
              value={draft.summary}
              onChange={(event) => updateField("summary", event.target.value)}
              placeholder="What emotional and narrative movement happens in this scene?"
              className={textareaClass}
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Emotional Tone">
              <select
                value={draft.emotionalTone}
                onChange={(event) => updateField("emotionalTone", event.target.value as EmotionalTone)}
                className={inputClass}
              >
                {emotionalTones.map((tone) => (
                  <option key={tone} value={tone}>
                    {moodPalette[tone].label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Location">
              <input
                required
                value={draft.location}
                onChange={(event) => updateField("location", event.target.value)}
                placeholder="Where does the scene unfold?"
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Involved Characters">
            <div className="rounded-xl border border-white/15 bg-black/20 p-3">
              <div className="flex flex-wrap gap-2">
                {characters.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No characters available yet. Create characters first to assign them to scenes.
                  </p>
                ) : (
                  characters.map((character) => {
                    const selected = draft.involvedCharacterIds.includes(character.id);
                    return (
                      <button
                        key={character.id}
                        type="button"
                        onClick={() => toggleCharacter(character.id)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.14em] transition",
                          selected
                            ? "border-primary/50 bg-primary/20 text-white"
                            : "border-white/20 bg-white/5 text-white/75 hover:border-white/35",
                        )}
                      >
                        {character.name}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </Field>

          {selectedCharacters.length > 0 ? (
            <div className="rounded-xl border border-white/15 bg-black/20 p-3">
              <p className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/65">
                <Film className="h-3.5 w-3.5" />
                Assigned Cast
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedCharacters.map((character) => (
                  <span
                    key={`${character.id}-assigned`}
                    className="rounded-full border border-white/20 bg-white/8 px-3 py-1 text-xs text-white/85"
                  >
                    {character.name}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <Field label="Notes">
            <textarea
              value={draft.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="Cinematic direction, camera language, pacing cues."
              className={textareaClass}
            />
          </Field>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" size="lg" className="gap-2">
              {mode === "create" ? <Sparkles className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {mode === "create" ? "Create Scene" : "Save Scene"}
            </Button>

            {mode === "edit" && onCancel ? (
              <Button type="button" variant="ghost" size="lg" onClick={onCancel}>
                Cancel Edit
              </Button>
            ) : null}

            {mode === "edit" && onDelete ? (
              <Button type="button" variant="outline" size="lg" className="gap-2" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            ) : null}

            <div className="ml-auto flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs text-white/70">
              <Clapperboard className="h-3.5 w-3.5" />
              {mode === "create" ? "New Timeline Entry" : "Revision Mode"}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

type FieldProps = {
  label: string;
  children: ReactNode;
};

function Field({ label, children }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/15 bg-black/25 px-3 py-2.5 text-sm text-white outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/30";
const textareaClass = `${inputClass} min-h-24 resize-y`;
