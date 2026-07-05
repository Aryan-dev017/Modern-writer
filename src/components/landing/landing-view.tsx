"use client";

import Link from "next/link";
import { ArrowRight, BookOpenText, Clapperboard, HeartHandshake, Sparkles, UserRound } from "lucide-react";
import { AmbientGlow } from "@/components/visuals/ambient-glow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const notebookSections = [
  {
    href: "/dashboard",
    icon: BookOpenText,
    title: "Open Your Journal",
    description: "Step into the archive where every project feels like a page turned by candlelight.",
  },
  {
    href: "/dashboard/characters",
    icon: UserRound,
    title: "Character Codex",
    description: "Collect collectible character pages, emotional tags, and handwritten notes.",
  },
  {
    href: "/dashboard/scenes",
    icon: Clapperboard,
    title: "Scene Pages",
    description: "Arrange scenes like chapters in a manuscript and reorder the emotional rhythm.",
  },
  {
    href: "/dashboard/relationships",
    icon: HeartHandshake,
    title: "Relationship Map",
    description: "Trace living bonds across an enchanted board of glowing ink connections.",
  },
] as const;

const storyPillars = [
  "Warm parchment surfaces and wood-toned panels.",
  "Collectible cards with emotional mood styling.",
  "Supabase-backed data so your notebook stays in sync everywhere.",
];

export function LandingView() {
  return (
    <main className="relative min-h-screen overflow-hidden pb-20">
      <AmbientGlow intensity="bold" />

      <section className="relative mx-auto max-w-7xl px-6 pt-20 md:pt-28">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
          <Card className="glass-panel overflow-hidden border-amber-200/16 p-0">
            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-amber-300 to-secondary" />
            <div className="p-8 md:p-10">
              <Badge glow className="mb-6">
                Enchanted Storybook
              </Badge>

              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                Welcome, Storyteller.
              </p>

              <h1 className="mt-4 font-serif text-5xl leading-tight text-white sm:text-6xl md:text-7xl">
                Every world you imagine lives here.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                Open an enchanted journal, preserve your worlds like treasured manuscript pages,
                and keep every character, scene, and bond alive in one warm archive.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/dashboard">
                  <Button size="lg" className="gap-2">
                    Open Your Journal
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline" size="lg">
                    Begin A New Chronicle
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
          {notebookSections.map((section) => {
            const Icon = section.icon;

            return (
              <Link key={section.href} href={section.href} className="group block">
                <Card className="glass-panel h-full border-amber-200/15 transition duration-300 group-hover:-translate-y-1 group-hover:border-primary/35">
                  <CardHeader>
                    <div className="inline-flex rounded-full border border-amber-200/15 bg-[linear-gradient(180deg,rgba(255,248,232,0.08),rgba(82,55,26,0.16))] p-3 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="font-serif text-2xl text-white">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-6 text-muted-foreground">
                    {section.description}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
          </div>
        </div>
      </section>

      <section className="relative mx-auto mt-20 max-w-7xl px-6">
        <Card className="glass-panel overflow-hidden border-amber-200/16">
          <CardHeader>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">What this feels like</p>
            <CardTitle className="font-serif text-3xl text-white">
              A rainy evening, a wooden desk, and a notebook that remembers everything.
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 pb-8 md:grid-cols-3">
            {storyPillars.map((pillar) => (
              <div
                key={pillar}
                className="rounded-xl border border-amber-200/12 bg-[linear-gradient(180deg,rgba(255,248,232,0.06),rgba(82,55,26,0.16))] p-4 text-sm leading-6 text-muted-foreground"
              >
                {pillar}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="relative mx-auto mt-20 max-w-7xl px-6">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <Card className="glass-panel border-amber-200/16">
            <CardHeader>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">A living archive</p>
              <CardTitle className="font-serif text-3xl text-white">
                Projects, characters, scenes, and bonds all stay synced to Supabase.
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-muted-foreground">
              The app stores real user data, keeps sessions fresh, and lets you move between the
              archive, character pages, scene pages, and relationship boards without losing the story.
            </CardContent>
          </Card>

          <Card className="glass-panel border-amber-200/16">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Start here</p>
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="font-serif text-2xl text-white">Enter the archive in seconds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/login">
                <Button className="w-full">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" className="w-full">
                  Create Account
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
