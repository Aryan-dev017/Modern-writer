"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bell, LoaderCircle, LogOut, MoonStar, Sparkles, WandSparkles } from "lucide-react";
import { useUniverseStore } from "@/store/universe-store";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function Navbar() {
  const router = useRouter();
  const cinematicMode = useUniverseStore((state) => state.cinematicMode);
  const toggleCinematicMode = useUniverseStore((state) => state.toggleCinematicMode);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const supabase = useMemo(() => {
    try {
      return createClient();
    } catch {
      return null;
    }
  }, []);

  const signOut = async () => {
    setIsSigningOut(true);
    try {
      await supabase?.auth.signOut();
    } finally {
      router.replace("/login");
      router.refresh();
      setIsSigningOut(false);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="glass-panel sticky top-4 z-30 mx-4 mt-4 rounded-2xl px-4 py-3 md:px-6"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Live universe feed</p>
          <h1 className="truncate font-serif text-xl tracking-wide text-glow text-white">Story Dashboard</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={toggleCinematicMode}
            aria-label="Toggle cinematic mode"
          >
            {cinematicMode ? <WandSparkles className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            <span className="hidden sm:inline">{cinematicMode ? "Cinematic On" : "Cinematic Off"}</span>
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
              <Sparkles className="h-4 w-4" />
              Return to Landing
            </Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
