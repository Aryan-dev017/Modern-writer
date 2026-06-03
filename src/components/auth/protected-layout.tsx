import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/session";

type ProtectedLayoutProps = {
  children: ReactNode;
};

export async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const user = await getServerUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  return <>{children}</>;
}
