import type { ReactNode } from "react";
import { ProtectedLayout } from "@/components/auth/protected-layout";

type StudioLayoutProps = {
  children: ReactNode;
};

export default function StudioLayout({ children }: StudioLayoutProps) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
