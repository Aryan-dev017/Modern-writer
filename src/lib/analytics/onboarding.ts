"use client";

import { AnalyticsEvent, type OnboardingStep } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/client";

const COMPLETED_STEPS_KEY = "aether-analytics-onboarding-steps";
const ONBOARDING_DONE_KEY = "aether-analytics-onboarding-complete";

const onboardingSteps: OnboardingStep[] = [
  "signup",
  "project_created",
  "character_created",
  "scene_created",
  "relationship_created",
];

function canUseBrowser() {
  return typeof window !== "undefined";
}

function parseStoredSteps(value: string | null) {
  if (!value) {
    return new Set<OnboardingStep>();
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) {
      return new Set<OnboardingStep>();
    }

    const validSteps = parsed.filter((step): step is OnboardingStep =>
      onboardingSteps.includes(step as OnboardingStep),
    );
    return new Set<OnboardingStep>(validSteps);
  } catch {
    return new Set<OnboardingStep>();
  }
}

function saveSteps(steps: Set<OnboardingStep>) {
  if (!canUseBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(COMPLETED_STEPS_KEY, JSON.stringify([...steps]));
  } catch {
    // Ignore storage failures and keep UI responsive.
  }
}

export function markOnboardingStepCompleted(step: OnboardingStep) {
  if (!canUseBrowser()) {
    return;
  }

  let completedSteps = new Set<OnboardingStep>();
  let completionAlreadyTracked = false;

  try {
    completedSteps = parseStoredSteps(window.localStorage.getItem(COMPLETED_STEPS_KEY));
    completionAlreadyTracked = window.localStorage.getItem(ONBOARDING_DONE_KEY) === "1";
  } catch {
    // Continue without persisted onboarding state if storage is unavailable.
  }

  const alreadyCompleted = completedSteps.has(step);

  if (!alreadyCompleted) {
    completedSteps.add(step);
    saveSteps(completedSteps);

    trackEvent(AnalyticsEvent.ONBOARDING_STEP_COMPLETED, { step });
  }

  const isComplete = onboardingSteps.every((onboardingStep) => completedSteps.has(onboardingStep));

  if (isComplete && !completionAlreadyTracked) {
    try {
      window.localStorage.setItem(ONBOARDING_DONE_KEY, "1");
    } catch {
      // Ignore storage failures and still emit completion event.
    }
    trackEvent(AnalyticsEvent.ONBOARDING_COMPLETED, {
      completed_steps: onboardingSteps,
    });
  }
}
