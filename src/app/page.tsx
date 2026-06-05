import Link from "next/link";
import { ArrowRight, Clapperboard, Network, Sparkles, UserRound } from "lucide-react";

const featureCards = [
  {
    href: "/dashboard",
    label: "Dashboard",
    title: "Universe Console",
    description: "Open the creative command center and see every project at a glance.",
    icon: Sparkles,
  },
  {
    href: "/dashboard/characters",
    label: "Characters",
    title: "Character Codex",
    description: "Create, edit, and shape collectible characters with emotional depth.",
    icon: UserRound,
  },
  {
    href: "/dashboard/scenes",
    label: "Scenes",
    title: "Scene Timeline",
    description: "Build cinematic scenes, reorder beats, and guide emotional pacing.",
    icon: Clapperboard,
  },
  {
    href: "/dashboard/relationships",
    label: "Relationships",
    title: "Relationship Graph",
    description: "Map living bonds with glowing connections and draggable nodes.",
    icon: Network,
  },
] as const;

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.32),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.16),transparent_32%)]" />
      <div className="absolute inset-0 cinematic-grid opacity-30" />
      <div className="absolute left-[10%] top-[16%] h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="absolute right-[12%] bottom-[14%] h-64 w-64 rounded-full bg-sky-400/15 blur-3xl" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-20">
        <div className="w-full">
          <div className="max-w-3xl">
            <p className="mb-6 text-sm uppercase tracking-[0.3em] text-zinc-500">
              A Universe Begins
            </p>

            <h1 className="text-5xl font-semibold tracking-tight text-white md:text-7xl lg:text-8xl">
              Aether & Abyss
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400 md:text-xl">
              Every story begins with someone.
              <span className="mx-2 text-zinc-600">•</span>
              Every universe begins with a connection.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-medium text-black transition-transform duration-300 hover:scale-105"
              >
                Enter Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/dashboard/characters"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-4 font-medium text-white transition hover:bg-white/10"
              >
                View Characters
              </Link>
            </div>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/8"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative">
                    <div className="mb-4 inline-flex rounded-full border border-white/10 bg-black/30 p-3 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                      {card.label}
                    </p>
                    <h2 className="mt-2 text-xl font-medium text-white">{card.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">{card.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          <p className="mt-10 max-w-2xl text-sm leading-6 text-zinc-500">
            If you are not signed in yet, the protected routes will smoothly redirect you to the
            login flow and then bring you right back to the page you chose.
          </p>
        </div>
      </section>
    </main>
  );
}
