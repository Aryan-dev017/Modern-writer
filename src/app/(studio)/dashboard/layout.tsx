import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { AmbientGlow } from "@/components/visuals/ambient-glow";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="relative min-h-screen">
      <AmbientGlow />
      <div className="relative flex min-h-screen">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <Navbar />
          <main className="px-4 pb-8 pt-6 md:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
