const FALLBACK_SUPABASE_URL = "https://whidsgltimpnxhnrpnof.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoaWRzZ2x0aW1wbnhobnJwbm9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNDgwNjksImV4cCI6MjA5NTYyNDA2OX0.fUHhxUVI06y7b7uYTu0fIddlhJUyTMR_GykeW6o5k2M";

export function getSupabaseConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? FALLBACK_SUPABASE_URL,
    anonKey:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      FALLBACK_SUPABASE_ANON_KEY,
  };
}
