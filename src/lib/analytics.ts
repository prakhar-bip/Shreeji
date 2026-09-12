/**
 * Lightweight analytics wrapper.
 *
 * Events are stored privately in Lovable Cloud and also forwarded to any
 * optional analytics script that is present:
 *  - Plausible  (set `plausibleDomain` in src/data/business.ts)
 *  - Google Analytics / gtag (add the gtag snippet in src/routes/__root.tsx)
 * In development, events are logged to the console instead.
 */

type Props = Record<string, string | number | boolean | undefined>;

import { recordVisitorEvent } from "@/lib/visitor-analytics.functions";

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Props }) => void;
    gtag?: (command: string, event: string, params?: Props) => void;
  }
}

export type AnalyticsEvent =
  | "page_view"
  | "product_view"
  | "category_view"
  | "whatsapp_click"
  | "phone_click"
  | "directions_click"
  | "product_request_click"
  | "gallery_open"
  | "color_photo_added"
  | "color_preview_created";

export function track(event: AnalyticsEvent, props: Props = {}) {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(event, { props });
    window.gtag?.("event", event, props);
    if (import.meta.env.DEV) console.info("[analytics]", event, props);

    const visitorKey = "shop_visitor_id";
    const visitorId = window.localStorage.getItem(visitorKey) ?? crypto.randomUUID();
    window.localStorage.setItem(visitorKey, visitorId);
    const pageKey = `shop_page_view:${window.location.pathname}`;
    if (event === "page_view" && window.sessionStorage.getItem(pageKey)) return;
    if (event === "page_view") window.sessionStorage.setItem(pageKey, "1");

    let referrerHost = "";
    try { referrerHost = document.referrer ? new URL(document.referrer).hostname : ""; } catch { /* empty source */ }
    const width = window.innerWidth;
    const deviceType = width < 640 ? "mobile" : width < 1024 ? "tablet" : "desktop";
    const cleanProps = Object.fromEntries(Object.entries(props).filter((entry): entry is [string, string | number | boolean] => entry[1] !== undefined));
    void recordVisitorEvent({ data: {
      eventId: crypto.randomUUID(), eventName: event, page: window.location.pathname,
      visitorId, referrerHost, deviceType, properties: cleanProps,
    } }).catch(() => undefined);
  } catch {
    /* analytics must never break the page */
  }
}
