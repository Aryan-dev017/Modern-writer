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

function AuthRuntime() {
  useAuthAnalytics();

  return null;
}

function AnalyticsRuntime() {
  usePageTracking();
  useRetentionTracking();

  return null;
}

export function AppProviders({ children }: AppProvidersProps) {
  useEffect(() => {
    initPostHog();
  }, []);

  return (
    <>
      <AuthRuntime />
      {isPostHogEnabled() ? (
        <PostHogProvider client={posthog}>
          <AnalyticsRuntime />
          {children}
        </PostHogProvider>
      ) : (
        children
      )}
    </>
  );
}
