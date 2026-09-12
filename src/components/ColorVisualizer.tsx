import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CameraIcon } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import defaultRoom from "@/assets/room-visualizer-default.jpg";
import {
  asianPaintsFamilies,
  asianPaintsShades,
  type AsianPaintsShade,
} from "@/data/asianPaintsShades";
import { products } from "@/data/products";
import { visualizeRoomColor } from "@/lib/color-visualizer.functions";
import { track } from "@/lib/analytics";
import type { RoomWall, RoomWallColors } from "@/components/room3d/Room3D";

const Room3D = lazy(() => import("@/components/room3d/Room3D"));

const wallColors = products.filter(
  (product): product is typeof product & { swatch: string } =>
    product.category === "wall-colors" && Boolean(product.swatch),
);

const SHADE_BATCH = 48;
const roomWalls: Array<{ id: RoomWall; label: string }> = [
  { id: "front", label: "Front wall" },
  { id: "left", label: "Left wall" },
  { id: "right", label: "Right wall" },
  { id: "back", label: "Back wall" },
];

function hexToRgb(hex: string) {
  return [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16));
}

function closestShade(hex?: string) {
  if (!hex) return asianPaintsShades[0];
  const [red = 0, green = 0, blue = 0] = hexToRgb(hex);
  return asianPaintsShades.reduce<{ shade: AsianPaintsShade; distance: number } | undefined>(
    (closest, shade) => {
      const [shadeRed = 0, shadeGreen = 0, shadeBlue = 0] = hexToRgb(shade.hex);
      const distance =
        (red - shadeRed) ** 2 + (green - shadeGreen) ** 2 + (blue - shadeBlue) ** 2;
      return !closest || distance < closest.distance ? { shade, distance } : closest;
    },
    undefined,
  )?.shade;
}

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
  const initialProduct = wallColors.find((color) => color.slug === initialColorSlug);
  const initialShade = closestShade(initialProduct?.swatch ?? wallColors[2]?.swatch) ?? asianPaintsShades[0];
  const [activeWall, setActiveWall] = useState<RoomWall>("front");
  const [wallShadeCodes, setWallShadeCodes] = useState<Record<RoomWall, string>>(() => ({
    front: initialShade?.code ?? "",
    left: closestShade("#E7D8C7")?.code ?? initialShade?.code ?? "",
    right: closestShade("#D7E0D1")?.code ?? initialShade?.code ?? "",
    back: closestShade("#EFE3D4")?.code ?? initialShade?.code ?? "",
  }));
  const [photoShadeCode, setPhotoShadeCode] = useState(initialShade?.code ?? "");
  const [mode, setMode] = useState<"default" | "photo">("default");
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("all");
  const [visibleCount, setVisibleCount] = useState(SHADE_BATCH);
  const [status, setStatus] = useState<"idle" | "preparing" | "working">("idle");
  const [error, setError] = useState<string>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const selected = useMemo(
    () => asianPaintsShades.find((shade) => shade.code === (mode === "photo" ? photoShadeCode : wallShadeCodes[activeWall])) ?? asianPaintsShades[0],
    [activeWall, mode, photoShadeCode, wallShadeCodes],
  );

  const roomColors = useMemo<RoomWallColors>(() => ({
    front: asianPaintsShades.find((shade) => shade.code === wallShadeCodes.front)?.hex ?? "#E8DCCF",
    left: asianPaintsShades.find((shade) => shade.code === wallShadeCodes.left)?.hex ?? "#E7D8C7",
    right: asianPaintsShades.find((shade) => shade.code === wallShadeCodes.right)?.hex ?? "#D7E0D1",
    back: asianPaintsShades.find((shade) => shade.code === wallShadeCodes.back)?.hex ?? "#EFE3D4",
  }), [wallShadeCodes]);

  const matches = useMemo(() => {
    const term = query.trim().toLowerCase();
    return asianPaintsShades.filter(
      (shade) =>
        (family === "all" || shade.family === family) &&
        (!term || shade.name.toLowerCase().includes(term) || shade.code.toLowerCase().includes(term)),
    );
  }, [family, query]);

  const chooseShade = (shade: AsianPaintsShade) => {
    if (mode === "photo") {
      setPhotoShadeCode(shade.code);
    } else {
      setWallShadeCodes((current) => ({ ...current, [activeWall]: shade.code }));
    }
    setResult(undefined);
    track("color_selected", { shade: shade.code });
  };

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
      setMode("photo");
      track("color_photo_added");
    } catch {
      setError("This photo could not be opened. Please try another one.");
    } finally {
      setStatus("idle");
    }
  };

  const createPreview = async () => {
    if (!photo || !selected) return;
    try {
      setStatus("working");
      setError(undefined);
      const output = await runVisualizer({
        data: { imageDataUrl: photo, colorName: selected.name, colorHex: selected.hex },
      });
      setResult(output.imageUrl);
      track("color_preview_created", { color: selected.code });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Preview failed. Please try again.");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <section id="room-preview" className="scroll-mt-20 border-y border-border bg-background py-7 md:py-12">
      <div className="container-page">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow">Asian Paints color studio</p>
          <h2 className="mt-1 font-display text-2xl font-semibold md:text-4xl">See a color in your room</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
            Pick any Asian Paints shade below. Try it instantly in our room, or add a photo of yours.
          </p>

          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.7fr)] lg:items-start">
            <div className="min-w-0">
              <div className="mb-3 grid min-w-0 grid-cols-2 gap-1 rounded-lg bg-muted p-1" aria-label="Choose room">
                <Button
                  type="button"
                  variant={mode === "default" ? "default" : "ghost"}
                  onClick={() => setMode("default")}
                  aria-pressed={mode === "default"}
                  className="h-10 min-w-0 px-2 text-xs sm:text-sm"
                >
                  Default room
                </Button>
                <Button
                  type="button"
                  variant={mode === "photo" ? "default" : "ghost"}
                  onClick={() => (photo ? setMode("photo") : inputRef.current?.click())}
                  aria-pressed={mode === "photo"}
                  className="h-10 min-w-0 px-2 text-xs sm:text-sm"
                >
                  <CameraIcon className="h-4 w-4" />
                  My room photo
                </Button>
              </div>

              <div className="relative isolate overflow-hidden rounded-lg border border-border bg-sand shadow-soft">
                {mode === "default" ? (
                  mounted ? (
                    <Suspense fallback={<img src={defaultRoom} alt="Loading furnished 3D room" width={1200} height={912} className="aspect-[4/3] w-full object-cover" />}>
                      <Room3D colors={roomColors} selectedWall={activeWall} onSelectWall={setActiveWall} />
                    </Suspense>
                  ) : (
                    <img src={defaultRoom} alt="Furnished room color preview" width={1200} height={912} className="aspect-[4/3] w-full object-cover" />
                  )
                ) : result || photo ? (
                  <img
                    src={result ?? photo}
                    alt={result ? `Your room preview with ${selected?.name ?? "the selected shade"}` : "Your room photo"}
                    className="aspect-[4/3] w-full object-cover"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 p-6 text-center text-muted-foreground"
                  >
                    <CameraIcon className="h-8 w-8" />
                    <span className="text-sm font-bold">Add your room photo</span>
                  </button>
                )}
                <div className="absolute right-2 top-11 flex max-w-[64%] items-center gap-2 rounded-md border border-border bg-background/95 p-2 shadow-soft backdrop-blur-sm sm:right-3 sm:top-3">
                  <span
                    aria-hidden="true"
                    className="h-10 w-10 shrink-0 rounded-md border border-border"
                    style={{ backgroundColor: selected?.hex }}
                  />
                  <span className="min-w-0">
                    <strong className="block truncate text-sm">{selected?.name}</strong>
                    <span className="block text-xs text-muted-foreground">Asian Paints · {selected?.code}</span>
                  </span>
                </div>
              </div>

              {mode === "default" ? (
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Choose a wall to paint">
                  {roomWalls.map((wall) => {
                    const shade = asianPaintsShades.find((item) => item.code === wallShadeCodes[wall.id]);
                    return (
                      <Button
                        key={wall.id}
                        type="button"
                        variant={activeWall === wall.id ? "default" : "outline"}
                        onClick={() => setActiveWall(wall.id)}
                        aria-pressed={activeWall === wall.id}
                        className="h-auto min-h-11 justify-start gap-2 px-2.5 py-2 text-left"
                      >
                        <span className="h-6 w-6 shrink-0 rounded-sm border border-border" style={{ backgroundColor: shade?.hex }} />
                        <span className="min-w-0">
                          <span className="block text-xs font-bold">{wall.label}</span>
                          <span className="block truncate text-[10px] opacity-75">{shade?.name}</span>
                        </span>
                      </Button>
                    );
                  })}
                </div>
              ) : null}

              <div className="mt-3 grid min-w-0 grid-cols-2 gap-2">
                <label className="btn btn-outline min-w-0 cursor-pointer px-2 text-center text-xs sm:text-sm">
                  <CameraIcon className="h-4 w-4 shrink-0" />
                  {photo ? "Change photo" : "Add my photo"}
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="sr-only"
                    onChange={(event) => void onPhoto(event.target.files?.[0])}
                  />
                </label>
                <Button
                  type="button"
                  onClick={() => void createPreview()}
                  disabled={!photo || status !== "idle"}
                  className="h-11 min-w-0 px-2 text-xs font-bold sm:text-sm"
                >
                  {status === "working" ? "Making…" : status === "preparing" ? "Opening…" : "Preview my room"}
                </Button>
              </div>
              {error ? <p className="mt-3 text-sm font-semibold text-destructive">{error}</p> : null}
              <p className="mt-3 text-xs text-muted-foreground">
                Screen colors and AI previews are approximate. Check a physical shade card before buying.
              </p>
            </div>

            <div className="min-w-0 rounded-lg border border-border bg-card p-3 md:p-4">
              <label>
                <span className="mb-1.5 block text-sm font-bold">
                  {mode === "default" ? `Choose color for ${roomWalls.find((wall) => wall.id === activeWall)?.label.toLowerCase()}` : "Choose color for your photo"}
                </span>
                <Input
                  type="search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setVisibleCount(SHADE_BATCH);
                  }}
                  placeholder="Search name or shade code"
                  className="h-11"
                />
              </label>

              <div className="-mx-3 mt-3 flex gap-2 overflow-x-auto px-3 pb-2 md:-mx-4 md:px-4" aria-label="Color families">
                {["all", ...asianPaintsFamilies].map((name) => (
                  <Button
                    key={name}
                    type="button"
                    size="sm"
                    variant={family === name ? "default" : "outline"}
                    onClick={() => {
                      setFamily(name);
                      setVisibleCount(SHADE_BATCH);
                    }}
                    className="shrink-0 rounded-full capitalize"
                  >
                    {name === "all" ? "All colors" : name.replace("-", " ")}
                  </Button>
                ))}
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                {matches.length.toLocaleString("en-IN")} shades
              </p>
              {matches.length ? (
                <div className="mt-3 grid max-h-[24rem] grid-cols-4 gap-2 overflow-y-auto pr-1 sm:grid-cols-6 lg:grid-cols-4" aria-label="Choose an Asian Paints shade">
                  {matches.slice(0, visibleCount).map((shade) => {
                    const active = shade.code === selected?.code;
                    return (
                      <button
                        key={shade.code}
                        type="button"
                        onClick={() => chooseShade(shade)}
                        aria-pressed={active}
                        title={`${shade.name} ${shade.code}`}
                        className={`min-w-0 overflow-hidden rounded-md border bg-background text-left transition-shadow ${active ? "border-foreground ring-2 ring-ring ring-offset-1" : "border-border"}`}
                      >
                        <span className="block aspect-square w-full" style={{ backgroundColor: shade.hex }} />
                        <span className="block truncate px-1.5 pt-1 text-[11px] font-bold">{shade.name}</span>
                        <span className="block px-1.5 pb-1 text-[10px] text-muted-foreground">{shade.code}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-3 rounded-md bg-muted p-4 text-sm text-muted-foreground">No matching shade found.</p>
              )}
              {visibleCount < matches.length ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setVisibleCount((count) => count + SHADE_BATCH)}
                  className="mt-3 w-full"
                >
                  Show more colors
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
