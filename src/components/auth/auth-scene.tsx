"use client";

import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { AmbientGlow } from "@/components/visuals/ambient-glow";
import { Badge } from "@/components/ui/badge";

type AuthSceneProps = {
  children: ReactNode;
};

export function AuthScene({ children }: AuthSceneProps) {
  return (
    <div className="relative min-h-screen overflow-hidden px-6 py-16">
      <AmbientGlow intensity="bold" />

      <div className="relative mx-auto flex min-h-[80vh] w-full max-w-6xl items-center justify-center">
        <div
          className="absolute left-0 top-0 hidden max-w-sm lg:block"
        >
          <Badge glow className="mb-5">
            Secure Archive Access
          </Badge>
          <h1 className="font-serif text-5xl leading-tight text-white">
            Every notebook deserves a protected gate.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Authenticate to continue crafting emotional arcs, character destinies, and story worlds.
          </p>
          <div className="mt-8 flex items-center gap-2 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            Session continuity powered by Supabase Auth
          </div>
        </div>

        <div
          className="w-full max-w-xl lg:ml-auto"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
