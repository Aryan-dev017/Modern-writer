"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, BookOpenText, LoaderCircle, LogOut, MoonStar, WandSparkles } from "lucide-react";
import { useUniverseStore } from "@/store/universe-store";
import { Button } from "@/components/ui/button";
import { signOut as signOutUser } from "@/lib/auth/client";

export function Navbar() {
  const router = useRouter();
  const cinematicMode = useUniverseStore((state) => state.cinematicMode);
  const toggleCinematicMode = useUniverseStore((state) => state.toggleCinematicMode);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const signOut = async () => {
    setIsSigningOut(true);
    try {
      await signOutUser();
    } finally {
      router.replace("/login");
      router.refresh();
      setIsSigningOut(false);
    }
  };

  return (
    <header
      className="glass-panel sticky top-4 z-30 mx-4 mt-4 rounded-2xl px-4 py-3 md:px-6"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Notebook header</p>
          <h1 className="truncate font-serif text-xl tracking-wide text-glow text-white">Story Ledger</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={toggleCinematicMode}
            aria-label="Toggle notebook glow"
          >
            {cinematicMode ? <WandSparkles className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            <span className="hidden sm:inline">{cinematicMode ? "Notebook Glow On" : "Notebook Glow Off"}</span>
          </Button>

          <Button variant="ghost" size="sm" className="px-3" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={signOut}
            disabled={isSigningOut}
            aria-label="Sign out"
          >
            {isSigningOut ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            <span className="hidden sm:inline">Sign Out</span>
          </Button>

          <Link href="/">
            <Button size="sm" className="gap-2">
              <BookOpenText className="h-4 w-4" />
              Return to Cover
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
