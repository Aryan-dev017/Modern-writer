"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { StoryAct } from "@/store/universe-store";

type ActCardProps = {
  act: StoryAct;
  isActive: boolean;
  onClick: () => void;
};

export function ActCard({ act, isActive, onClick }: ActCardProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="w-full text-left"
    >
      <Card
        className={cn(
          "transition duration-300 hover:border-primary/50",
          isActive && "border-primary/55 shadow-[0_0_28px_oklch(0.67_0.22_285/.28)]",
        )}
      >
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <Badge glow={isActive}>{act.id.replace("-", " ").toUpperCase()}</Badge>
            <span className="text-xs text-muted-foreground">{act.sceneCount} scenes</span>
          </div>
          <CardTitle className="font-serif text-xl text-white">{act.title}</CardTitle>
          <CardDescription>{act.tone}</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Completion</span>
              <span>{act.completion}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${act.completion}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.button>
  );
}
