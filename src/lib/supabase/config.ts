const FALLBACK_SUPABASE_URL = "https://whidsgltimpnxhnrpnof.supabase.co";
const FALLBACK_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_eOYUzJ7l6Bw84I211lu8yg__1SXEhLf";

export function getSupabaseConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? FALLBACK_SUPABASE_URL,
    publishableKey:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      FALLBACK_SUPABASE_PUBLISHABLE_KEY,
  };
}
