"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
  const isLoading = useProjectStore((state) => state.isLoading);
  const error = useProjectStore((state) => state.error);
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

  const isInitialLoading = isLoading && projects.length === 0;

  return (
    <div className="relative mx-auto w-full max-w-7xl space-y-6">
      <FloatingSignals />

      <section className="glass-panel relative overflow-hidden rounded-2xl p-6">
        <div className="absolute right-[-6%] top-[-12%] h-36 w-36 rounded-full bg-amber-300/14 blur-3xl" />

        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Story Archive</p>
            <h2 className="mt-2 font-serif text-4xl leading-tight text-white md:text-5xl">
              Open the ledger of your worlds.
            </h2>
            <p className="mt-3 text-base text-muted-foreground md:text-lg">
              Shape worlds, track narrative gravity, and keep every project stored like a page in a
              treasured notebook.
            </p>
          </div>

          <Badge glow className="whitespace-nowrap">
            {projects.length} journals shelved
          </Badge>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/dashboard/scenes">
            <Button variant="outline" className="gap-2">
              <Clapperboard className="h-4 w-4" />
              Open Scene Pages
            </Button>
          </Link>
          <Link href="/dashboard/relationships">
            <Button variant="outline" className="gap-2">
              <Waypoints className="h-4 w-4" />
              Open Relationship Map
            </Button>
          </Link>
        </div>

        <div className="relative mt-6 max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/55" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title or genre"
            className="w-full rounded-xl border border-amber-200/15 bg-[linear-gradient(180deg,rgba(255,248,232,0.08),rgba(82,55,26,0.18))] py-3 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-white/45 focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </section>

      {error ? (
        <Card className="border-rose-300/25 bg-rose-500/10">
          <CardContent className="p-4 text-sm text-rose-100">{error}</CardContent>
        </Card>
      ) : null}

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
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Project Shelf</p>
              <h3 className="mt-1 font-serif text-2xl text-white">Collectible story journals</h3>
            </div>
            <BookOpenText className="h-5 w-5 text-primary" />
          </div>

          {isInitialLoading ? (
            <Card className="glass-panel border-amber-200/18">
              <CardContent className="flex min-h-72 flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="rounded-full border border-amber-200/15 bg-[linear-gradient(180deg,rgba(255,248,232,0.08),rgba(82,55,26,0.16))] p-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-serif text-2xl text-white">Loading your archive</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We are reading your Supabase projects so the shelf reflects real user data.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : filteredProjects.length === 0 ? (
            <Card className="glass-panel border-amber-200/18">
              <CardContent className="flex min-h-72 flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="rounded-full border border-amber-200/15 bg-[linear-gradient(180deg,rgba(255,248,232,0.08),rgba(82,55,26,0.16))] p-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-serif text-2xl text-white">
                    {query.trim() ? "No journals match this search" : "Your shelf is still empty"}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {query.trim()
                      ? "Adjust the query or clear it to see every journal again."
                      : "Open the creation panel and write the first world into existence."}
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
      <div className="absolute left-[12%] top-[15%] h-28 w-28 rounded-full bg-amber-300/14 blur-3xl" />
      <div className="absolute right-[8%] top-[38%] h-36 w-36 rounded-full bg-emerald-400/12 blur-3xl" />
      <div className="absolute bottom-[10%] left-[40%] h-24 w-24 rounded-full bg-rose-300/12 blur-3xl" />
    </div>
  );
}
