"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, LoaderCircle, MailCheck, Sparkles } from "lucide-react";
import { clearOAuthIntent } from "@/lib/analytics/client";
import { AnalyticsEvent } from "@/lib/analytics/events";
import { useAnalytics } from "@/lib/analytics/hooks";
import { markOnboardingStepCompleted } from "@/lib/analytics/onboarding";
import { signInWithEmail, signInWithGoogle, signUpWithEmail } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { normalizeNextPath } from "@/lib/auth/navigation";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthMode;
  nextPath?: string | null;
  initialError?: string | null;
};

export function AuthForm({ mode, nextPath, initialError }: AuthFormProps) {
  const router = useRouter();
  const analytics = useAnalytics();
  const destination = normalizeNextPath(nextPath);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(initialError ?? "");
  const [successMessage, setSuccessMessage] = useState("");

  const submitEmailPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (mode === "signup" && password !== confirmPassword) {
      setErrorMessage("Password confirmation does not match.");
      return;
    }

    if (mode === "signup" && password.length < 8) {
      setErrorMessage("Use a stronger password with at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await signInWithEmail(email, password);

        if (error) {
          setErrorMessage(error);
          return;
        }

        analytics.track(AnalyticsEvent.USER_LOGGED_IN, {
          method: "email",
        });
        router.replace(destination);
        router.refresh();
        return;
      }

      const { error } = await signUpWithEmail(email, password, { nextPath: destination });

      if (error) {
        setErrorMessage(error);
        return;
      }

      analytics.track(AnalyticsEvent.USER_SIGNED_UP, {
        method: "email",
      });
      markOnboardingStepCompleted("signup");
      setSuccessMessage(
        "A confirmation link has been sent. Verify your email, then continue into the universe.",
      );
    } finally {
      setLoading(false);
    }
  };

  const submitGoogleAuth = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    setGoogleLoading(true);
    try {
      analytics.setOAuthIntent(mode);
      const { error } = await signInWithGoogle({ nextPath: destination });

      if (error) {
        clearOAuthIntent();
        setErrorMessage(error);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const isLoginMode = mode === "login";
  const alternateHref = isLoginMode
    ? `/signup?next=${encodeURIComponent(destination)}`
    : `/login?next=${encodeURIComponent(destination)}`;

  return (
    <Card className="glass-panel w-full max-w-xl overflow-hidden">
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-amber-300 to-secondary" />
      <CardHeader>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {isLoginMode ? "Portal Access" : "Journal Enrollment"}
        </p>
        <CardTitle className="font-serif text-3xl text-white">
          {isLoginMode ? "Enter the Reading Room" : "Create Your Chronicle ID"}
        </CardTitle>
        <CardDescription>
          {isLoginMode
            ? "Resume your archive with secure session continuity."
            : "Register your identity to shape worlds, arcs, and emotional constellations."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <button
          type="button"
          disabled={googleLoading || loading}
          onClick={submitGoogleAuth}
          className="w-full rounded-xl border border-amber-200/15 bg-[linear-gradient(180deg,rgba(255,248,232,0.08),rgba(82,55,26,0.16))] px-4 py-3 text-sm text-white transition hover:bg-amber-950/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="flex items-center justify-center gap-2">
            {googleLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Continue with Google
          </span>
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-amber-200/15" />
          <span className="text-xs uppercase tracking-[0.14em] text-white/60">or</span>
          <div className="h-px flex-1 bg-amber-200/15" />
        </div>

        <form onSubmit={submitEmailPassword} className="space-y-3">
          <label className="block">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Email</span>
            <input
              required
              autoComplete="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClass}
              placeholder="you@storyrealm.com"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Password</span>
            <input
              required
              autoComplete={isLoginMode ? "current-password" : "new-password"}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClass}
              placeholder="Enter secure phrase"
            />
          </label>

          {!isLoginMode ? (
            <label className="block">
              <span className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Confirm Password
              </span>
              <input
                required
                autoComplete="new-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className={inputClass}
                placeholder="Repeat secure phrase"
              />
            </label>
          ) : null}

          {errorMessage ? (
            <div className="rounded-xl border border-rose-300/35 bg-rose-500/10 p-3 text-sm text-rose-100">
              <p className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                {errorMessage}
              </p>
            </div>
          ) : null}

          {successMessage ? (
            <div className="rounded-xl border border-emerald-300/35 bg-emerald-500/10 p-3 text-sm text-emerald-100">
              <p className="flex items-start gap-2">
                <MailCheck className="mt-0.5 h-4 w-4 shrink-0" />
                {successMessage}
              </p>
            </div>
          ) : null}

          <Button type="submit" size="lg" className="w-full gap-2" disabled={loading || googleLoading}>
            {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {isLoginMode ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {isLoginMode ? "New to the archive?" : "Already have access?"}{" "}
          <Link href={alternateHref} className="text-primary underline-offset-4 transition hover:underline">
            {isLoginMode ? "Create account" : "Sign in"}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

const inputClass =
  "w-full rounded-xl border border-amber-200/15 bg-[linear-gradient(180deg,rgba(255,248,232,0.08),rgba(82,55,26,0.18))] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/45 focus:border-primary/60 focus:ring-2 focus:ring-primary/20";
