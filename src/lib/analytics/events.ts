export const AnalyticsEvent = {
  PAGE_VIEWED: "page_viewed",
  SESSION_STARTED: "retention_session_started",
  RETENTION_DAILY_ACTIVE: "retention_daily_active",
  RETENTION_ENGAGED_60S: "retention_engaged_60s",
  RETENTION_ENGAGED_300S: "retention_engaged_300s",
  USER_SIGNED_UP: "user_signed_up",
  USER_LOGGED_IN: "user_logged_in",
  PROJECT_CREATED: "project_created",
  CHARACTER_CREATED: "character_created",
  SCENE_CREATED: "scene_created",
  RELATIONSHIP_CREATED: "relationship_created",
  ONBOARDING_STEP_COMPLETED: "onboarding_step_completed",
  ONBOARDING_COMPLETED: "onboarding_completed",
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvent)[keyof typeof AnalyticsEvent];

export type OnboardingStep =
  | "signup"
  | "project_created"
  | "character_created"
  | "scene_created"
  | "relationship_created";

export type RelationshipTypeTracked =
  | "friend"
  | "enemy"
  | "lover"
  | "rival"
  | "mentor"
  | "sibling";

export type AnalyticsEventPayloadMap = {
  [AnalyticsEvent.PAGE_VIEWED]: {
    pathname: string;
    search: string;
  };
  [AnalyticsEvent.SESSION_STARTED]: {
    session_id: string | null;
  };
  [AnalyticsEvent.RETENTION_DAILY_ACTIVE]: {
    days_since_last_seen: number | null;
  };
  [AnalyticsEvent.RETENTION_ENGAGED_60S]: {
    session_id: string | null;
  };
  [AnalyticsEvent.RETENTION_ENGAGED_300S]: {
    session_id: string | null;
  };
  [AnalyticsEvent.USER_SIGNED_UP]: {
    method: "email" | "google";
  };
  [AnalyticsEvent.USER_LOGGED_IN]: {
    method: "email" | "google";
  };
  [AnalyticsEvent.PROJECT_CREATED]: {
    project_id: string;
    title: string;
    genre: string;
  };
  [AnalyticsEvent.CHARACTER_CREATED]: {
    character_id: string;
    emotional_tone: string;
  };
  [AnalyticsEvent.SCENE_CREATED]: {
    scene_id: string;
    emotional_tone: string;
    involved_character_count: number;
  };
  [AnalyticsEvent.RELATIONSHIP_CREATED]: {
    source_character_id: string;
    target_character_id: string;
    relationship_type: RelationshipTypeTracked;
  };
  [AnalyticsEvent.ONBOARDING_STEP_COMPLETED]: {
    step: OnboardingStep;
  };
  [AnalyticsEvent.ONBOARDING_COMPLETED]: {
    completed_steps: OnboardingStep[];
  };
};

export type AnalyticsEventPayload<TEvent extends AnalyticsEventName> = AnalyticsEventPayloadMap[TEvent];
