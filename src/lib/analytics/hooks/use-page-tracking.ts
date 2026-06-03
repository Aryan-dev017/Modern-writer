"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics/client";
import { AnalyticsEvent } from "@/lib/analytics/events";

export function usePageTracking() {
  const pathname = usePathname();
  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) {
      return;
    }

    const search = typeof window === "undefined" ? "" : window.location.search.slice(1);
    const routeKey = search ? `${pathname}?${search}` : pathname;

    if (previousPathRef.current === routeKey) {
      return;
    }

    previousPathRef.current = routeKey;
    trackEvent(AnalyticsEvent.PAGE_VIEWED, {
      pathname,
      search,
    });
  }, [pathname]);
}
