"use client";

import { useMemo } from "react";
import {
  identifyAnalyticsUser,
  resetAnalyticsUser,
  trackEvent,
  type OAuthIntent,
  setOAuthIntent,
} from "@/lib/analytics/client";
import type { AnalyticsEventName, AnalyticsEventPayload } from "@/lib/analytics/events";

export function useAnalytics() {
  return useMemo(
    () => ({
      track<TEvent extends AnalyticsEventName>(eventName: TEvent, payload: AnalyticsEventPayload<TEvent>) {
        trackEvent(eventName, payload);
      },
      identify: identifyAnalyticsUser,
      reset: resetAnalyticsUser,
      setOAuthIntent(intent: OAuthIntent) {
        setOAuthIntent(intent);
      },
    }),
    [],
  );
}
