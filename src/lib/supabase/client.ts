"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/lib/supabase/config";

let browserClient: SupabaseClient | null = null;

export function createClient() {
  if (browserClient) {
    return browserClient;
  }

  const env = getSupabaseConfig();
  browserClient = createBrowserClient(env.url, env.anonKey);
  return browserClient;
}

export function getSupabaseBrowserClient() {
  return createClient();
}
