"use client";

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
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left"
    >
      <Card
        className={cn(
          "transition duration-300 hover:border-primary/50",
          isActive && "border-primary/55 shadow-[0_0_28px_rgba(245,201,109,0.2)]",
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
            <div className="h-2 overflow-hidden rounded-full bg-amber-950/20">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                style={{ width: `${act.completion}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </button>
  );
}
