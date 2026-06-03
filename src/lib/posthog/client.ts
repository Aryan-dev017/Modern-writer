import posthog from "posthog-js";
import { getPostHogConfig } from "@/lib/posthog/config";

let isInitialized = false;

export function initPostHog() {
  if (typeof window === "undefined" || isInitialized) {
    return;
  }

  const { apiKey, host } = getPostHogConfig();

  posthog.init(apiKey, {
    api_host: host,
    capture_pageview: false,
    capture_pageleave: true,
    person_profiles: "identified_only",
    loaded: () => {
      isInitialized = true;
    },
  });
}

export { posthog };
