"use client";

import type { User } from "@supabase/supabase-js";
import { normalizeNextPath } from "@/lib/auth/navigation";
import { createClient } from "@/lib/supabase/client";

type AuthResult<T> = {
  data: T | null;
  error: string | null;
};

type RedirectOptions = {
  nextPath?: string | null;
};

function getRedirectTo(nextPath?: string | null) {
  if (typeof window === "undefined") {
    return undefined;
  }

  const normalized = normalizeNextPath(nextPath);
  return `${window.location.origin}/auth/callback?next=${encodeURIComponent(normalized)}`;
}

function formatAuthError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected authentication error occurred.";
}

export async function signInWithGoogle({ nextPath }: RedirectOptions = {}): Promise<AuthResult<null>> {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getRedirectTo(nextPath),
      },
    });

    return { data: null, error: error ? error.message : null };
  } catch (error) {
    return { data: null, error: formatAuthError(error) };
  }
}

export async function signUpWithEmail(
  email: string,
  password: string,
  { nextPath }: RedirectOptions = {},
): Promise<AuthResult<User>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: getRedirectTo(nextPath),
      },
    });

    return { data: data.user, error: error ? error.message : null };
  } catch (error) {
    return { data: null, error: formatAuthError(error) };
  }
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<AuthResult<User>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    return { data: data.user, error: error ? error.message : null };
  } catch (error) {
    return { data: null, error: formatAuthError(error) };
  }
}

export async function signOut(): Promise<AuthResult<null>> {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    return { data: null, error: error ? error.message : null };
  } catch (error) {
    return { data: null, error: formatAuthError(error) };
  }
}

export async function getCurrentUser(): Promise<AuthResult<User>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();

    return { data: data.user, error: error ? error.message : null };
  } catch (error) {
    return { data: null, error: formatAuthError(error) };
  }
}
