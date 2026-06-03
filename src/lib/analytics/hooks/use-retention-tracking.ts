"use client";

import { useEffect } from "react";
import {
  getOrCreateAnalyticsSessionId,
  runOncePerSession,
  trackEvent,
} from "@/lib/analytics/client";
import { AnalyticsEvent } from "@/lib/analytics/events";

const LAST_ACTIVE_DAY_KEY = "aether-analytics-retention-last-active-day";
const LAST_SEEN_AT_KEY = "aether-analytics-retention-last-seen-at";

function canUseBrowser() {
  return typeof window !== "undefined";
}

function calculateDaysSince(lastSeenAtIso: string | null) {
  if (!lastSeenAtIso) {
    return null;
  }

  const lastSeenAt = new Date(lastSeenAtIso);
  const lastSeenTimestamp = lastSeenAt.getTime();

  if (Number.isNaN(lastSeenTimestamp)) {
    return null;
  }

  const diffInMs = Date.now() - lastSeenTimestamp;
  if (diffInMs < 0) {
    return null;
  }

  return Math.floor(diffInMs / 86_400_000);
}

export function useRetentionTracking() {
  useEffect(() => {
    if (!canUseBrowser()) {
      return;
    }

    const sessionId = getOrCreateAnalyticsSessionId();

    runOncePerSession("session-started", () => {
      trackEvent(AnalyticsEvent.SESSION_STARTED, {
        session_id: sessionId,
      });
    });

    const now = new Date();
    const today = now.toISOString().slice(0, 10);

    try {
      const lastActiveDay = window.localStorage.getItem(LAST_ACTIVE_DAY_KEY);
      const lastSeenAt = window.localStorage.getItem(LAST_SEEN_AT_KEY);

      if (lastActiveDay !== today) {
        trackEvent(AnalyticsEvent.RETENTION_DAILY_ACTIVE, {
          days_since_last_seen: calculateDaysSince(lastSeenAt),
        });
        window.localStorage.setItem(LAST_ACTIVE_DAY_KEY, today);
      }

      window.localStorage.setItem(LAST_SEEN_AT_KEY, now.toISOString());
    } catch {
      trackEvent(AnalyticsEvent.RETENTION_DAILY_ACTIVE, {
        days_since_last_seen: null,
      });
    }

    const engaged60Timer = window.setTimeout(() => {
      runOncePerSession("engaged-60s", () => {
        trackEvent(AnalyticsEvent.RETENTION_ENGAGED_60S, {
          session_id: sessionId,
        });
      });
    }, 60_000);

    const engaged300Timer = window.setTimeout(() => {
      runOncePerSession("engaged-300s", () => {
        trackEvent(AnalyticsEvent.RETENTION_ENGAGED_300S, {
          session_id: sessionId,
        });
      });
    }, 300_000);

    return () => {
      window.clearTimeout(engaged60Timer);
      window.clearTimeout(engaged300Timer);
    };
  }, []);
}
