export function normalizeNextPath(nextPath: string | null | undefined, fallback = "/dashboard") {
  if (!nextPath) {
    return fallback;
  }

  if (!nextPath.startsWith("/")) {
    return fallback;
  }

  if (nextPath.startsWith("//")) {
    return fallback;
  }

  return nextPath;
}
