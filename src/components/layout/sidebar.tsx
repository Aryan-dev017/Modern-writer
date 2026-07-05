"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, Clapperboard, PlusCircle, Rocket, Sparkles, Users, Waypoints } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Archive", icon: Rocket },
  { href: "/dashboard/characters", label: "Characters", icon: Users },
  { href: "/dashboard/scenes", label: "Scenes", icon: Clapperboard },
  { href: "/dashboard/relationships", label: "Relationships", icon: Waypoints },
  { href: "/dashboard#create", label: "New Journal", icon: PlusCircle },
  { href: "/dashboard#library", label: "Project Shelf", icon: BookOpenText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-panel relative hidden min-h-screen w-72 shrink-0 overflow-hidden rounded-r-[2.5rem] border-r border-amber-200/16 p-6 lg:block">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/25 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-amber-200/25 to-transparent" />

      <div className="relative">
        <Link href="/" className="group flex items-center gap-3">
          <div className="rounded-xl border border-amber-200/15 bg-[linear-gradient(180deg,rgba(255,248,232,0.12),rgba(82,55,26,0.18))] p-2">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-serif text-lg tracking-wide text-white">Aether & Abyss</p>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Story Ledger</p>
          </div>
        </Link>

        <nav className="mt-10 space-y-2">
          {navItems.map((item) => {
            const isHashLink = item.href.includes("#");
            const isActive = isHashLink
              ? pathname === "/dashboard"
              : item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-sm transition duration-300",
                  isActive
                    ? "border-primary/35 bg-primary/15 text-white shadow-[0_0_20px_rgba(245,201,109,0.18)]"
                    : "text-muted-foreground hover:border-amber-200/15 hover:bg-amber-950/20 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
