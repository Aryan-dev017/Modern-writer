const FALLBACK_POSTHOG_KEY = "phc_kJNh7x79g8yBqBf6uLAJhhrQqqpfDdaeomcnJnx5nYNo";
const FALLBACK_POSTHOG_HOST = "https://us.i.posthog.com";

export function getPostHogConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY ?? FALLBACK_POSTHOG_KEY,
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? FALLBACK_POSTHOG_HOST,
  };
}

export function isPostHogEnabled() {
  return Boolean(getPostHogConfig().apiKey);
}
