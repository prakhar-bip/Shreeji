import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InquiryInput = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s()-]{6,19}$/, "Please enter a valid phone or WhatsApp number."),
  message: z.string().trim().min(5, "Please tell us what you need.").max(1000),
  sourcePage: z.string().trim().min(1).max(240).default("/contact"),
  website: z.string().max(0),
  startedAt: z.number().int().positive(),
});

export const submitContactInquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InquiryInput.parse(input))
  .handler(async ({ data }) => {
    if (Date.now() - data.startedAt < 1500) throw new Error("Please wait a moment and try again.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: inquiry, error } = await supabaseAdmin
      .from("contact_inquiries")
      .insert({
        name: data.name,
        phone: data.phone,
        message: data.message,
        source_page: data.sourcePage,
      })
      .select("id")
      .single();

    if (error || !inquiry) throw new Error("Your inquiry could not be saved. Please try WhatsApp instead.");

    // The inquiry remains safely queued until an automatic WhatsApp provider is connected.
    return { ok: true, inquiryId: inquiry.id };
  });
