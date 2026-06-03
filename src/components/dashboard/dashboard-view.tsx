"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpenText, Clapperboard, Search, Sparkles, Waypoints } from "lucide-react";
import { AnalyticsEvent } from "@/lib/analytics/events";
import { useAnalytics } from "@/lib/analytics/hooks";
import { markOnboardingStepCompleted } from "@/lib/analytics/onboarding";
import { ProjectCreatePanel } from "@/components/projects/project-create-panel";
import { ProjectCard } from "@/components/projects/project-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProjectStore } from "@/store/project-store";

export function DashboardView() {
  const analytics = useAnalytics();
  const projects = useProjectStore((state) => state.projects);
  const createProject = useProjectStore((state) => state.createProject);
  const [query, setQuery] = useState("");

  const filteredProjects = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return projects;
    }

    return projects.filter((project) => {
      return (
        project.title.toLowerCase().includes(normalized) ||
        project.genre.toLowerCase().includes(normalized)
      );
    });
  }, [projects, query]);

  return (
    <div className="relative mx-auto w-full max-w-7xl space-y-6">
      <FloatingSignals />

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="glass-panel relative overflow-hidden rounded-2xl border-white/20 p-6"
      >
        <div className="absolute right-[-6%] top-[-12%] h-36 w-36 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Universe Dashboard</p>
            <h2 className="mt-2 font-serif text-4xl leading-tight text-white md:text-5xl">
              Enter your living creative cosmos.
            </h2>
            <p className="mt-3 text-base text-muted-foreground md:text-lg">
              Shape worlds, track narrative gravity, and orchestrate projects like cinematic realms.
            </p>
          </div>

          <Badge glow className="whitespace-nowrap">
            {projects.length} universes online
          </Badge>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/dashboard/scenes">
            <Button variant="outline" className="gap-2">
              <Clapperboard className="h-4 w-4" />
              Open Scene Timeline
            </Button>
          </Link>
          <Link href="/dashboard/relationships">
            <Button variant="outline" className="gap-2">
              <Waypoints className="h-4 w-4" />
              Open Relationship Graph
            </Button>
          </Link>
        </div>

        <div className="relative mt-6 max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/55" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title or genre"
            className="w-full rounded-xl border border-white/15 bg-black/25 py-3 pl-10 pr-3 text-sm text-white outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </motion.section>

      <section className="grid gap-6 xl:grid-cols-[1.02fr_1.5fr]">
        <ProjectCreatePanel
          onCreate={(title, genre) => {
            const createdProject = createProject({
              title,
              genre,
            });

            if (!createdProject) {
              return;
            }

            analytics.track(AnalyticsEvent.PROJECT_CREATED, {
              project_id: createdProject.id,
              title: createdProject.title,
              genre: createdProject.genre,
            });
            markOnboardingStepCompleted("project_created");
          }}
        />

        <div id="library" className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Project Constellation</p>
              <h3 className="mt-1 font-serif text-2xl text-white">Immersive Universe Cards</h3>
            </div>
            <BookOpenText className="h-5 w-5 text-primary" />
          </div>

          {filteredProjects.length === 0 ? (
            <Card className="glass-panel border-white/20">
              <CardContent className="flex min-h-72 flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="rounded-full border border-white/20 bg-white/6 p-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-serif text-2xl text-white">No universes match this search</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    The chamber is quiet. Adjust your query or forge a new project.
                  </p>
                </div>
                <Button variant="ghost" onClick={() => setQuery("")}>
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function FloatingSignals() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute left-[12%] top-[15%] h-28 w-28 rounded-full bg-violet-400/15 blur-3xl"
        animate={{ x: [0, 16, -8, 0], y: [0, -10, 14, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 14, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[8%] top-[38%] h-36 w-36 rounded-full bg-sky-400/14 blur-3xl"
        animate={{ x: [0, -14, 10, 0], y: [0, 12, -16, 0], scale: [1, 0.92, 1.08, 1] }}
        transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[10%] left-[40%] h-24 w-24 rounded-full bg-fuchsia-400/15 blur-3xl"
        animate={{ x: [0, 12, -10, 0], y: [0, -14, 8, 0], scale: [1, 1.12, 1, 1] }}
        transition={{ duration: 16, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
    </div>
  );
}
