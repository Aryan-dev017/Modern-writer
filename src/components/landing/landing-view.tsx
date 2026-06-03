"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clapperboard, Orbit, Sparkles } from "lucide-react";
import { WorldCard } from "@/components/cards/world-card";
import { AmbientGlow } from "@/components/visuals/ambient-glow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const worlds = [
  {
    name: "Umbra Crown",
    realm: "Sky Kingdom",
    description:
      "A floating metropolis of shattered mirrors where rulers trade memories instead of coin.",
  },
  {
    name: "The Violet Deep",
    realm: "Abyssal Archive",
    description:
      "An ocean trench of luminous ruins where ancient dialogue echoes from coral vaults.",
  },
  {
    name: "Ashen Meridian",
    realm: "Frontier Expanse",
    description:
      "A black-sand desert crossed by titan bones and pilgrim caravans hunting fate scripts.",
  },
];

const storyPillars = [
  "Character arcs mapped as visual constellations.",
  "Mood-first scene sequencing with cinematic pacing.",
  "Universe memory where lore, scenes, and worlds stay interconnected.",
];

export function LandingView() {
  return (
    <main className="relative min-h-screen overflow-hidden pb-20">
      <AmbientGlow intensity="bold" />

      <section className="relative mx-auto max-w-6xl px-6 pt-20 md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <Badge glow className="mb-6">
            Cinematic Story Engine
          </Badge>

          <h1 className="font-serif text-5xl leading-tight text-white sm:text-6xl md:text-7xl">
            Build a universe that feels like a living myth.
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
            Aether & Abyss blends emotional worldbuilding with premium cinematic tooling so every arc,
            scene, and character beat lands with atmosphere.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                Enter the Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Watch Universe Intro
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
          className="mt-10 grid gap-4 md:grid-cols-3"
        >
          <Card className="glass-panel">
            <CardHeader>
              <Orbit className="h-5 w-5 text-primary" />
              <CardTitle className="font-serif text-white">Connected Narratives</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Plot, lore, and timeline fragments stay synchronized as one storytelling organism.
            </CardContent>
          </Card>
          <Card className="glass-panel">
            <CardHeader>
              <Clapperboard className="h-5 w-5 text-primary" />
              <CardTitle className="font-serif text-white">Filmic Presentation</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Interface language inspired by sci-fi control rooms and fantasy codices.
            </CardContent>
          </Card>
          <Card className="glass-panel">
            <CardHeader>
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle className="font-serif text-white">Emotional Pacing</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Build tension and release through visual flow, not spreadsheet-style complexity.
            </CardContent>
          </Card>
        </motion.div>
      </section>

      <section className="relative mx-auto mt-20 max-w-6xl px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Story Realms</p>
            <h2 className="mt-2 font-serif text-3xl text-white md:text-4xl">Worlds Worth Exploring</h2>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {worlds.map((world) => (
            <WorldCard key={world.name} {...world} />
          ))}
        </div>
      </section>

      <section className="relative mx-auto mt-20 max-w-6xl px-6">
        <Card className="glass-panel overflow-hidden">
          <CardHeader>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Design Philosophy</p>
            <CardTitle className="font-serif text-3xl text-white">
              Crafted for narrative gravity, not corporate clutter.
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 pb-8 md:grid-cols-3">
            {storyPillars.map((pillar) => (
              <motion.div
                key={pillar}
                whileHover={{ y: -4 }}
                className="rounded-xl border border-border/80 bg-black/20 p-4 text-sm text-muted-foreground"
              >
                {pillar}
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
