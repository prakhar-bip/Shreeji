import { createServerFn } from "@tanstack/react-start";
import { createHash } from "crypto";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const OWNER_EMAIL = "prakharbatwal98@gmail.com";

const EventInput = z.object({
  eventId: z.string().uuid(),
  eventName: z.enum([
    "page_view",
    "product_view",
    "category_view",
    "whatsapp_click",
    "phone_click",
    "directions_click",
    "product_request_click",
    "gallery_open",
    "color_photo_added",
    "color_preview_created",
    "color_selected",
  ]),
  page: z.string().min(1).max(240),
  visitorId: z.string().min(16).max(100),
  referrerHost: z.string().max(255),
  deviceType: z.enum(["mobile", "tablet", "desktop"]),
  properties: z.record(z.union([z.string(), z.number(), z.boolean()])).default({}),
});

export const recordVisitorEvent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EventInput.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const visitorHash = createHash("sha256").update(data.visitorId).digest("hex");
    const { error } = await supabaseAdmin.from("visitor_events").insert({
      event_id: data.eventId,
      event_name: data.eventName,
      page: data.page,
      visitor_hash: visitorHash,
      referrer_host: data.referrerHost,
      device_type: data.deviceType,
      properties: data.properties,
    });

    if (error && error.code !== "23505") throw new Error("Visitor event could not be recorded.");
    return { ok: true };
  });

export type VisitorAnalytics = {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  todayUnique: number;
  productViews: number;
  whatsappClicks: number;
  topPages: Array<{ page: string; visits: number }>;
  sources: Array<{ source: string; visits: number }>;
  devices: Array<{ device: string; visits: number }>;
  daily: Array<{ day: string; visits: number; visitors: number }>;
  recentWhatsappClicks: Array<{ page: string; context: string; created_at: string }>;
  inquiries: Array<{
    id: string;
    name: string;
    phone: string;
    message: string;
    source_page: string;
    notification_status: "pending" | "sent" | "failed";
    created_at: string;
  }>;
};

export const getVisitorAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    if (context.claims.email !== OWNER_EMAIL) throw new Error("This dashboard is owner-only.");
    const { data, error } = await context.supabase.rpc("get_owner_reports");
    if (error) throw new Error("Visitor reports could not be loaded.");
    return data as unknown as VisitorAnalytics;
  });
