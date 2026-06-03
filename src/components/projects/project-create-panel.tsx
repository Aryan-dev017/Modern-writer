"use client";

import { type FormEvent, useState } from "react";
import { motion } from "framer-motion";
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
    <Card id="create" className="glass-panel overflow-hidden border-white/20">
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-violet-400 to-secondary" />
      <CardHeader>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Creation Portal</p>
        <CardTitle className="font-serif text-2xl text-white">Create New Universe</CardTitle>
        <CardDescription>Name the next world and set its narrative atmosphere.</CardDescription>
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
              placeholder="e.g. The Hollow Star Covenant"
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

          <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }}>
            <Button type="submit" size="lg" className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Forge Universe
              <Sparkles className="h-4 w-4" />
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/15 bg-black/25 px-3 py-2.5 text-sm text-white outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/30";
