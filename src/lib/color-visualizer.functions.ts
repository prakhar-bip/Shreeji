import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const VisualizerInput = z.object({
  imageDataUrl: z
    .string()
    .max(8_000_000, "The photo is too large. Please choose a smaller photo."),
  colorName: z.string().min(1).max(80),
  colorHex: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function requestHuggingFacePreview(apiKey: string, b64Image: string, prompt: string) {
  let response: Response | undefined;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    response = await fetch("https://api-inference.huggingface.co/models/timbrooks/instruct-pix2pix", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        inputs: b64Image,
        parameters: { prompt }
      }),
    });
    
    // HF returns 503 when the model is loading
    if (response.ok || (response.status !== 503 && response.status !== 429 && response.status < 500)) return response;
    
    if (attempt < 2) {
      let retryAfter = 5000;
      if (response.status === 503) {
        try {
          const resJson = await response.json();
          if (resJson.estimated_time) {
            retryAfter = resJson.estimated_time * 1000;
          }
        } catch (e) {
          // ignore
        }
      }
      await wait(retryAfter);
    }
  }
  if (!response) throw new Error("The color preview could not be reached.");
  return response;
}

export const visualizeRoomColor = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => VisualizerInput.parse(input))
  .handler(async ({ data }) => {
    // Read Hugging Face key from environment variables for security
    const apiKey = process.env["HUGGING_FACE_API_KEY"];
    
    if (!apiKey) {
      throw new Error("The Hugging Face API key is missing. Please add HUGGING_FACE_API_KEY to your environment variables.");
    }
    
    const prompt = `Repaint only the visible painted wall surfaces in ${data.colorName} (${data.colorHex}). Keep the room layout, people, furniture, ceiling, floor, doors, windows, artwork, lighting, shadows, textures, and camera angle unchanged. Make the paint result photorealistic and preserve natural light. Do not add or remove objects.`;
    
    // Extract base64 without the prefix
    const b64Image = data.imageDataUrl.split(",")[1];
    
    const response = await requestHuggingFacePreview(apiKey, b64Image, prompt);

    if (!response.ok) {
      let errorMessage = "The color preview could not be made.";
      try {
        const errorJson = await response.json();
        errorMessage = errorJson.error || errorMessage;
      } catch (e) {
        // ignore
      }
      throw new Error(`Hugging Face Error: ${errorMessage}`);
    }

    // Hugging Face returns the image directly as binary
    const arrayBuffer = await response.arrayBuffer();
    const base64Out = Buffer.from(arrayBuffer).toString('base64');
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const imageUrl = `data:${contentType};base64,${base64Out}`;

    return { imageUrl };
  });