"use client";

import { type FormEvent, useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ProjectCreatePanelProps = {
  onCreate: (title: string, genre: string) => void;
};

const genreOptions = [
  "Epic Fantasy",
  "Mystic Sci-Fi",
  "Dark Adventure",
  "Mythic Drama",
  "Celestial Romance",
];

export function ProjectCreatePanel({ onCreate }: ProjectCreatePanelProps) {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState(genreOptions[0]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      return;
    }

    onCreate(cleanTitle, genre);
    setTitle("");
  };

  return (
    <Card id="create" className="glass-panel overflow-hidden border-amber-200/18">
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-amber-300 to-secondary" />
      <CardHeader>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Creation Desk</p>
        <CardTitle className="font-serif text-2xl text-white">Write a New World</CardTitle>
        <CardDescription>Name the next journal and give it its first atmosphere.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Universe Title
            </span>
            <input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. The Willow Moon Chronicle"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Genre
            </span>
            <select value={genre} onChange={(event) => setGenre(event.target.value)} className={inputClass}>
              {genreOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <div>
            <Button type="submit" size="lg" className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Forge Universe
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

const inputClass =
  "w-full rounded-xl border border-amber-200/15 bg-[linear-gradient(180deg,rgba(255,248,232,0.08),rgba(82,55,26,0.18))] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/45 focus:border-primary/60 focus:ring-2 focus:ring-primary/20";
