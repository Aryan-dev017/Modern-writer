"use client";

import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import { Plus, Sparkles, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getMoodPalette, moodPalette } from "@/lib/characters/mood-system";
import type {
  CharacterDraft,
  CharacterRelationship,
  EmotionalTone,
  RelationshipIntensity,
  RelationshipType,
} from "@/store/character-store";

type CharacterFormProps = {
  mode: "create" | "edit";
  initialValue?: CharacterDraft;
  onSubmit: (draft: CharacterDraft) => void;
  onDelete?: () => void;
};

const relationshipTypes: RelationshipType[] = ["ally", "rival", "mentor", "kin", "muse"];
const relationshipIntensityOptions: RelationshipIntensity[] = ["faint", "tangled", "fated"];
const emotionalTones = Object.keys(moodPalette) as EmotionalTone[];

const emptyDraft: CharacterDraft = {
  name: "",
  title: "",
  personality: "",
  goals: "",
  fears: "",
  secrets: "",
  biography: "",
  emotionalTone: "enigmatic",
  emotionalTags: [],
  relationships: [],
  notes: "",
};

function relationId() {
  return `rel-${Math.random().toString(36).slice(2, 8)}`;
}

export function CharacterForm({ mode, initialValue, onSubmit, onDelete }: CharacterFormProps) {
  const [draft, setDraft] = useState<CharacterDraft>(initialValue ?? emptyDraft);
  const [tagInput, setTagInput] = useState("");
  const [relationshipName, setRelationshipName] = useState("");
  const [relationshipType, setRelationshipType] = useState<RelationshipType>("ally");
  const [relationshipIntensity, setRelationshipIntensity] =
    useState<RelationshipIntensity>("tangled");

  const mood = useMemo(() => getMoodPalette(draft.emotionalTone), [draft.emotionalTone]);

  const addTag = () => {
    const normalized = tagInput.trim().toLowerCase();
    if (!normalized || draft.emotionalTags.includes(normalized)) {
      setTagInput("");
      return;
    }

    setDraft((current) => ({
      ...current,
      emotionalTags: [...current.emotionalTags, normalized],
    }));
    setTagInput("");
  };

  const removeTag = (tag: string) =>
    setDraft((current) => ({
      ...current,
      emotionalTags: current.emotionalTags.filter((item) => item !== tag),
    }));

  const addRelationship = () => {
    const name = relationshipName.trim();
    if (!name) {
      return;
    }

    const nextRelationship: CharacterRelationship = {
      id: relationId(),
      name,
      type: relationshipType,
      intensity: relationshipIntensity,
    };

    setDraft((current) => ({
      ...current,
      relationships: [...current.relationships, nextRelationship],
    }));
    setRelationshipName("");
  };

  const removeRelationship = (id: string) =>
    setDraft((current) => ({
      ...current,
      relationships: current.relationships.filter((relationship) => relationship.id !== id),
    }));

  const updateField = <K extends keyof CharacterDraft>(key: K, value: CharacterDraft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      ...draft,
      name: draft.name.trim(),
      title: draft.title.trim(),
      personality: draft.personality.trim(),
      goals: draft.goals.trim(),
      fears: draft.fears.trim(),
      secrets: draft.secrets.trim(),
      biography: draft.biography.trim(),
      notes: draft.notes.trim(),
    });

    if (mode === "create") {
      setDraft(emptyDraft);
      setRelationshipName("");
      setTagInput("");
    }
  };

  return (
    <Card className="glass-panel overflow-hidden">
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-amber-300 to-secondary" />
      <CardHeader>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {mode === "create" ? "Character Codex" : "Character Revision"}
        </p>
        <CardTitle className="font-serif text-2xl text-white">
          {mode === "create" ? "Write a New Presence" : "Refine This Presence"}
        </CardTitle>
        <CardDescription>{mood.aura}</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name">
              <input
                required
                value={draft.name}
                onChange={(event) => updateField("name", event.target.value)}
                className={inputClass}
                placeholder="Name your character"
              />
            </Field>
            <Field label="Title">
              <input
                required
                value={draft.title}
                onChange={(event) => updateField("title", event.target.value)}
                className={inputClass}
                placeholder="e.g. Keeper of Silent Suns"
              />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_1.1fr]">
            <Field label="Emotional Tone">
              <select
                value={draft.emotionalTone}
                onChange={(event) => updateField("emotionalTone", event.target.value as EmotionalTone)}
                className={inputClass}
              >
                {emotionalTones.map((tone) => (
                  <option key={tone} value={tone}>
                    {getMoodPalette(tone).label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Emotional Tags">
              <div className="rounded-xl border border-amber-200/12 bg-[linear-gradient(180deg,rgba(255,248,232,0.06),rgba(82,55,26,0.16))] p-2">
                <div className="flex gap-2">
                  <input
                    value={tagInput}
                    onChange={(event) => setTagInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addTag();
                      }
                    }}
                    className={cn(inputClass, "border-none bg-transparent px-2 py-1.5")}
                    placeholder="Add tag and press Enter"
                  />
                  <Button type="button" variant="ghost" size="sm" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {draft.emotionalTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full border border-amber-300/25 bg-amber-400/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-amber-100"
                    >
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </Field>
          </div>

          <Field label="Personality">
            <textarea
              required
              value={draft.personality}
              onChange={(event) => updateField("personality", event.target.value)}
              className={textareaClass}
              placeholder="How they think, react, and love."
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Goals">
              <textarea
                required
                value={draft.goals}
                onChange={(event) => updateField("goals", event.target.value)}
                className={textareaClass}
                placeholder="What they move toward."
              />
            </Field>
            <Field label="Fears">
              <textarea
                required
                value={draft.fears}
                onChange={(event) => updateField("fears", event.target.value)}
                className={textareaClass}
                placeholder="What can break them."
              />
            </Field>
          </div>

          <Field label="Secrets">
            <textarea
              required
              value={draft.secrets}
              onChange={(event) => updateField("secrets", event.target.value)}
              className={textareaClass}
              placeholder="Truths they hide."
            />
          </Field>

          <Field label="Biography">
            <textarea
              required
              value={draft.biography}
              onChange={(event) => updateField("biography", event.target.value)}
              className={cn(textareaClass, "min-h-28")}
              placeholder="Their journey in your universe."
            />
          </Field>

          <Field label="Relationship Indicators">
            <div className="rounded-xl border border-amber-200/12 bg-[linear-gradient(180deg,rgba(255,248,232,0.06),rgba(82,55,26,0.16))] p-3">
              <div className="grid gap-2 md:grid-cols-[1.3fr_.8fr_.8fr_auto]">
                <input
                  value={relationshipName}
                  onChange={(event) => setRelationshipName(event.target.value)}
                  placeholder="Name or faction"
                  className={inputClass}
                />
                <select
                  value={relationshipType}
                  onChange={(event) => setRelationshipType(event.target.value as RelationshipType)}
                  className={inputClass}
                >
                  {relationshipTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <select
                  value={relationshipIntensity}
                  onChange={(event) =>
                    setRelationshipIntensity(event.target.value as RelationshipIntensity)
                  }
                  className={inputClass}
                >
                  {relationshipIntensityOptions.map((intensity) => (
                    <option key={intensity} value={intensity}>
                      {intensity}
                    </option>
                  ))}
                </select>
                <Button type="button" variant="ghost" size="sm" onClick={addRelationship}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {draft.relationships.map((relationship) => (
                  <div
                    key={relationship.id}
                    className="inline-flex items-center gap-2 rounded-full border border-amber-200/15 bg-[linear-gradient(180deg,rgba(255,248,232,0.08),rgba(82,55,26,0.16))] px-3 py-1 text-xs text-white/90"
                  >
                    <span className="uppercase tracking-[0.12em] text-white/65">
                      {relationship.type}
                    </span>
                    <span>{relationship.name}</span>
                    <span className="text-white/45">({relationship.intensity})</span>
                    <button
                      type="button"
                      onClick={() => removeRelationship(relationship.id)}
                      aria-label={`Remove relationship ${relationship.name}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Field>

          <Field label="Notes">
            <textarea
              value={draft.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              className={textareaClass}
              placeholder="Directing notes, casting notes, scene triggers."
            />
          </Field>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" size="lg" className="gap-2">
              <Sparkles className="h-4 w-4" />
              {mode === "create" ? "Create Character" : "Save Character"}
            </Button>

            {mode === "edit" && onDelete ? (
              <Button type="button" variant="outline" size="lg" className="gap-2" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
                Delete Character
              </Button>
            ) : null}
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
      <span className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-amber-200/15 bg-[linear-gradient(180deg,rgba(255,248,232,0.08),rgba(82,55,26,0.18))] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/45 focus:border-primary/60 focus:ring-2 focus:ring-primary/20";
const textareaClass = `${inputClass} min-h-24 resize-y`;
