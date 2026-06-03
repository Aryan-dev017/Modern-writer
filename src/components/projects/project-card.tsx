"use client";

import type { ComponentType } from "react";
import { motion } from "framer-motion";
import { BookUser, Clapperboard, Clock3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type UniverseProject, formatUpdatedTime } from "@/store/project-store";

type ProjectCardProps = {
  project: UniverseProject;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="h-full"
    >
      <Card className="glass-panel group relative h-full overflow-hidden border-white/20">
        <div
          className="absolute inset-0 opacity-85 transition duration-300 group-hover:opacity-100"
          style={{ backgroundImage: project.atmosphericGradient }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,oklch(0.06_0.01_260/.12)_0%,oklch(0.09_0.02_260/.84)_72%)]" />
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/15 blur-2xl" />

        <CardHeader className="relative pb-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/75">{project.genre}</p>
          <CardTitle className="line-clamp-2 font-serif text-2xl leading-tight text-white">
            {project.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="relative space-y-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <StatPill icon={BookUser} label="Characters" value={project.characterCount.toString()} />
            <StatPill icon={Clapperboard} label="Scenes" value={project.sceneCount.toString()} />
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs text-white/80">
            <Clock3 className="h-3.5 w-3.5" />
            Updated {formatUpdatedTime(project.updatedAt)}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

type StatPillProps = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
};

function StatPill({ icon: Icon, label, value }: StatPillProps) {
  return (
    <div className="rounded-xl border border-white/20 bg-black/28 px-3 py-2">
      <p className="flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-white/70">
        <Icon className="h-3 w-3" />
        {label}
      </p>
      <p className="pt-1 font-medium text-white">{value}</p>
    </div>
  );
}
