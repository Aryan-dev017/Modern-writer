"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { PostHogProvider } from "@posthog/react";
import {
  useAuthAnalytics,
  usePageTracking,
  useRetentionTracking,
} from "@/lib/analytics/hooks";
import { isPostHogEnabled } from "@/lib/posthog/config";
import { initPostHog, posthog } from "@/lib/posthog/client";

type AppProvidersProps = {
  children: ReactNode;
};

function AnalyticsRuntime() {
  usePageTracking();
  useRetentionTracking();
  useAuthAnalytics();

  return null;
}

export function AppProviders({ children }: AppProvidersProps) {
  useEffect(() => {
    initPostHog();
  }, []);

  if (!isPostHogEnabled()) {
    return <>{children}</>;
  }

  return (
    <PostHogProvider client={posthog}>
      <AnalyticsRuntime />
      {children}
    </PostHogProvider>
  );
}
