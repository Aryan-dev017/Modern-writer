import { createClient } from "@/lib/supabase/client";

export async function getAuthedSupabaseContext() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return {
    supabase,
    user,
    error: error ? error.message : null,
  };
}

export function formatSupabaseError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "A Supabase request failed.";
}
