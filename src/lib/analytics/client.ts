"use client";

import { posthog } from "@/lib/posthog/client";
import { isPostHogEnabled } from "@/lib/posthog/config";
import type { AnalyticsEventName, AnalyticsEventPayload } from "@/lib/analytics/events";

export type OAuthIntent = "login" | "signup";

const SESSION_ID_KEY = "aether-analytics-session-id";
const OAUTH_INTENT_KEY = "aether-analytics-oauth-intent";

function canUseBrowser() {
  return typeof window !== "undefined";
}

function analyticsEnabled() {
  return canUseBrowser() && isPostHogEnabled();
}

function createFallbackSessionId() {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getOrCreateAnalyticsSessionId() {
  if (!canUseBrowser()) {
    return null;
  }

  try {
    const existing = window.sessionStorage.getItem(SESSION_ID_KEY);
    if (existing) {
      return existing;
    }

    const nextSessionId =
      typeof window.crypto?.randomUUID === "function"
        ? window.crypto.randomUUID()
        : createFallbackSessionId();

    window.sessionStorage.setItem(SESSION_ID_KEY, nextSessionId);
    return nextSessionId;
  } catch {
    return createFallbackSessionId();
  }
}

export function trackEvent<TEvent extends AnalyticsEventName>(
  eventName: TEvent,
  payload: AnalyticsEventPayload<TEvent>,
) {
  if (!analyticsEnabled()) {
    return;
  }

  posthog.capture(eventName, payload as Record<string, unknown>);
}

export function identifyAnalyticsUser(
  userId: string,
  traits?: Record<string, string | number | boolean | null | undefined>,
) {
  if (!analyticsEnabled()) {
    return;
  }

  posthog.identify(userId, traits);
}

export function resetAnalyticsUser() {
  if (!analyticsEnabled()) {
    return;
  }

  posthog.reset();
}

export function runOncePerSession(key: string, callback: () => void) {
  if (!canUseBrowser()) {
    return;
  }

  try {
    const storageKey = `aether-analytics-once-${key}`;
    if (window.sessionStorage.getItem(storageKey) === "1") {
      return;
    }

    window.sessionStorage.setItem(storageKey, "1");
    callback();
  } catch {
    callback();
  }
}

export function setOAuthIntent(intent: OAuthIntent) {
  if (!canUseBrowser()) {
    return;
  }

  try {
    window.sessionStorage.setItem(OAUTH_INTENT_KEY, intent);
  } catch {
    // Ignore storage failures and continue auth flow.
  }
}

export function clearOAuthIntent() {
  if (!canUseBrowser()) {
    return;
  }

  try {
    window.sessionStorage.removeItem(OAUTH_INTENT_KEY);
  } catch {
    // Ignore storage failures and continue auth flow.
  }
}

export function consumeOAuthIntent() {
  if (!canUseBrowser()) {
    return null;
  }

  let intent: string | null = null;
  try {
    intent = window.sessionStorage.getItem(OAUTH_INTENT_KEY);
    window.sessionStorage.removeItem(OAUTH_INTENT_KEY);
  } catch {
    return null;
  }

  if (intent === "login" || intent === "signup") {
    return intent;
  }

  return null;
}
