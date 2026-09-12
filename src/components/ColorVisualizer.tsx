import { useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CameraIcon } from "@/components/Icons";
import { products } from "@/data/products";
import { visualizeRoomColor } from "@/lib/color-visualizer.functions";
import { track } from "@/lib/analytics";

const wallColors = products.filter(
  (product): product is typeof product & { swatch: string } =>
    product.category === "wall-colors" && Boolean(product.swatch),
);

async function preparePhoto(file: File) {
  const source = await createImageBitmap(file);
  const maxSide = 1280;
  const scale = Math.min(1, maxSide / Math.max(source.width, source.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(source.width * scale);
  canvas.height = Math.round(source.height * scale);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("This photo could not be opened.");
  context.drawImage(source, 0, 0, canvas.width, canvas.height);
  source.close();
  return canvas.toDataURL("image/jpeg", 0.82);
}

export function ColorVisualizer({ initialColorSlug }: { initialColorSlug?: string }) {
  const runVisualizer = useServerFn(visualizeRoomColor);
  const inputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string>();
  const [result, setResult] = useState<string>();
  const [selectedSlug, setSelectedSlug] = useState(
    wallColors.some((color) => color.slug === initialColorSlug)
      ? (initialColorSlug ?? "")
      : (wallColors[0]?.slug ?? ""),
  );
  const [status, setStatus] = useState<"idle" | "preparing" | "working">("idle");
  const [error, setError] = useState<string>();

  const selected = useMemo(
    () => wallColors.find((color) => color.slug === selectedSlug),
    [selectedSlug],
  );

  const onPhoto = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose a photo from your camera or gallery.");
      return;
    }
    try {
      setStatus("preparing");
      setError(undefined);
      setResult(undefined);
      setPhoto(await preparePhoto(file));
      track("color_photo_added");
    } catch {
      setError("This photo could not be opened. Please try another one.");
    } finally {
      setStatus("idle");
    }
  };

  const createPreview = async () => {
    if (!photo || !selected?.swatch) return;
    try {
      setStatus("working");
      setError(undefined);
      const output = await runVisualizer({
        data: { imageDataUrl: photo, colorName: selected.name, colorHex: selected.swatch },
      });
      setResult(output.imageUrl);
      track("color_preview_created", { color: selected.slug });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Preview failed. Please try again.");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <section id="room-preview" className="scroll-mt-20 border-y border-border bg-background py-6 md:py-10">
      <div className="container-page">
        <div className="grid gap-5 md:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)] md:items-center">
          <div>
            <p className="eyebrow">AI color preview</p>
            <h2 className="mt-1 font-display text-2xl font-semibold md:text-3xl">
              See this color in your room
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Take one clear room photo, choose a shop shade, then tap Preview.
            </p>

            <div className="mt-4 flex gap-3 overflow-x-auto pb-2" aria-label="Choose a wall color">
              {wallColors.map((color) => {
                const active = color.slug === selectedSlug;
                return (
                  <button
                    key={color.slug}
                    type="button"
                    onClick={() => {
                      setSelectedSlug(color.slug);
                      setResult(undefined);
                    }}
                    aria-pressed={active}
                    className={`shrink-0 rounded-lg border p-2 text-left text-xs font-bold ${
                      active ? "border-foreground bg-cream" : "border-border bg-background"
                    }`}
                  >
                    <span
                      className="mb-1.5 block h-10 w-16 rounded-md border border-border"
                      style={{ backgroundColor: color.swatch }}
                    />
                    {color.name.replace("Asian Paints Royale — ", "")}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <label className="btn btn-outline cursor-pointer text-center">
                <CameraIcon className="h-4 w-4 shrink-0" />
                {photo ? "Change photo" : "Add room photo"}
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="sr-only"
                  onChange={(event) => void onPhoto(event.target.files?.[0])}
                />
              </label>
              <button
                type="button"
                onClick={() => void createPreview()}
                disabled={!photo || status !== "idle"}
                className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-45"
              >
                {status === "working" ? "Making…" : status === "preparing" ? "Opening…" : "Preview color"}
              </button>
            </div>
            {error ? <p className="mt-3 text-sm font-semibold text-destructive">{error}</p> : null}
            <p className="mt-3 text-xs text-muted-foreground">
              AI preview is approximate. Check the physical shade card before buying.
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border border-border bg-sand">
            {result || photo ? (
              <img
                src={result ?? photo}
                alt={result ? `Room preview with ${selected?.name ?? "selected color"}` : "Your room photo"}
                className="aspect-[4/3] w-full object-cover"
              />
            ) : (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 p-6 text-center text-muted-foreground"
              >
                <CameraIcon className="h-8 w-8" />
                <span className="text-sm font-bold">Your room photo appears here</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}