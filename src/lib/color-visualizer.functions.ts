import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const VisualizerInput = z.object({
  imageDataUrl: z
    .string()
    .max(8_000_000, "The photo is too large. Please choose a smaller photo."),
  colorName: z.string().min(1).max(80),
  colorHex: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

type GatewayImage = { image_url?: { url?: string } };
type GatewayResponse = {
  choices?: Array<{ message?: { content?: string | null; images?: GatewayImage[] } }>;
  message?: string;
  error?: { message?: string };
};

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function requestPreview(apiKey: string, body: string) {
  let response: Response | undefined;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body,
    });
    if (response.ok || (response.status !== 429 && response.status < 500)) return response;
    if (attempt < 2) {
      const retryAfter = Number(response.headers.get("Retry-After"));
      await wait(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 800 * 2 ** attempt);
    }
  }
  if (!response) throw new Error("The color preview could not be reached.");
  return response;
}

export const visualizeRoomColor = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => VisualizerInput.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      throw new Error("The color preview is not configured yet.");
    }

    const response = await requestPreview(apiKey, JSON.stringify({
        model: "google/gemini-3-pro-image",
        modalities: ["image", "text"],
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Edit this room photo. Repaint only the visible painted wall surfaces in ${data.colorName} (${data.colorHex}). Keep the room layout, people, furniture, ceiling, floor, doors, windows, artwork, lighting, shadows, textures, and camera angle unchanged. Make the paint result photorealistic and preserve natural light. Do not add or remove objects.`,
              },
              { type: "image_url", image_url: { url: data.imageDataUrl } },
            ],
          },
        ],
      }));

    const result = (await response.json()) as GatewayResponse;
    if (!response.ok) {
      const message = result.error?.message ?? result.message ?? "The color preview could not be made.";
      if (response.status === 402) throw new Error(`${message} Please ask the shop owner to add AI credits.`);
      if (response.status === 403) throw new Error(`${message} The shop owner needs to enable the color preview.`);
      throw new Error(message);
    }

    const imageUrl = result.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!imageUrl) {
      throw new Error("No preview image was returned. Please try another room photo.");
    }

    return { imageUrl };
  });