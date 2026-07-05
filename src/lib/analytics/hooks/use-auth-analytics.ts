"use client";

import { useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import {
  consumeOAuthIntent,
  identifyAnalyticsUser,
  resetAnalyticsUser,
  trackEvent,
} from "@/lib/analytics/client";
import { AnalyticsEvent } from "@/lib/analytics/events";
import { markOnboardingStepCompleted } from "@/lib/analytics/onboarding";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth-store";

function getUserTraits(user: User) {
  const provider = user.app_metadata?.provider;
  const authProvider = typeof provider === "string" ? provider : "unknown";

  return {
    auth_provider: authProvider,
  };
}

function identifyFromUser(user: User | null) {
  if (!user) {
    return;
  }

  identifyAnalyticsUser(user.id, getUserTraits(user));
}

export function useAuthAnalytics() {
  useEffect(() => {
    let supabase;

    try {
      supabase = createSupabaseClient();
    } catch {
      return;
    }

    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) {
        return;
      }

      const session = data.session ?? null;
      useAuthStore.getState().setAuthState({
        user: session?.user ?? null,
        session,
      });
      useAuthStore.getState().setIsLoading(false);
      identifyFromUser(session?.user ?? null);
    });

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        resetAnalyticsUser();
        useAuthStore.getState().reset();
        return;
      }

      const user = session?.user ?? null;
      useAuthStore.getState().setAuthState({
        user,
        session: session ?? null,
      });
      useAuthStore.getState().setIsLoading(false);
      identifyFromUser(user);

      if (event !== "SIGNED_IN" || !user) {
        return;
      }

      const oauthIntent = consumeOAuthIntent();
      if (!oauthIntent) {
        return;
      }

      if (oauthIntent === "signup") {
        trackEvent(AnalyticsEvent.USER_SIGNED_UP, {
          method: "google",
        });
        markOnboardingStepCompleted("signup");
        return;
      }

      trackEvent(AnalyticsEvent.USER_LOGGED_IN, {
        method: "google",
      });
    });

    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, []);
}
