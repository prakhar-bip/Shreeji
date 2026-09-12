import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CameraIcon } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Maximize, Minimize, Palette, ChevronRight, X, Smartphone, Check } from "lucide-react";
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
  { id: "front", label: "Front Wall" },
  { id: "left", label: "Left Wall" },
  { id: "right", label: "Right Wall" },
  { id: "back", label: "Back Wall" },
  { id: "ceiling", label: "Ceiling / Roof" },
  { id: "floor", label: "Floor" },
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
    ceiling: closestShade("#F3EEE6")?.code ?? "0940",
    floor: closestShade("#8F6946")?.code ?? "4224",
  }));
  const [photoShadeCode, setPhotoShadeCode] = useState(initialShade?.code ?? "");
  const [mode, setMode] = useState<"default" | "photo">("default");
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("all");
  const [visibleCount, setVisibleCount] = useState(SHADE_BATCH);
  const [status, setStatus] = useState<"idle" | "preparing" | "working">("idle");
  const [error, setError] = useState<string>();
  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPickerCollapsed, setIsPickerCollapsed] = useState(false);
  const [showRotateSuggestion, setShowRotateSuggestion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const onFullscreenChange = () => {
      const active = !!document.fullscreenElement;
      setIsFullscreen(active);
      if (!active) {
        setIsPickerCollapsed(false);
      }
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = window.innerWidth <= 768;
      const isPortrait = window.innerHeight > window.innerWidth;
      setShowRotateSuggestion(isMobile && isPortrait);
    };
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);
    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(console.error);
    } else {
      document.exitFullscreen?.().catch(console.error);
    }
  };

  const selected = useMemo(
    () => asianPaintsShades.find((shade) => shade.code === (mode === "photo" ? photoShadeCode : wallShadeCodes[activeWall])) ?? asianPaintsShades[0],
    [activeWall, mode, photoShadeCode, wallShadeCodes],
  );

  const roomColors = useMemo<RoomWallColors>(() => ({
    front: asianPaintsShades.find((shade) => shade.code === wallShadeCodes.front)?.hex ?? "#E8DCCF",
    left: asianPaintsShades.find((shade) => shade.code === wallShadeCodes.left)?.hex ?? "#E7D8C7",
    right: asianPaintsShades.find((shade) => shade.code === wallShadeCodes.right)?.hex ?? "#D7E0D1",
    back: asianPaintsShades.find((shade) => shade.code === wallShadeCodes.back)?.hex ?? "#EFE3D4",
    ceiling: asianPaintsShades.find((shade) => shade.code === wallShadeCodes.ceiling)?.hex ?? "#F3EEE6",
    floor: asianPaintsShades.find((shade) => shade.code === wallShadeCodes.floor)?.hex ?? "#8F6946",
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
            Pick any Asian Paints shade below for your walls, ceiling/roof, or floor. Try it instantly in 3D or with your photo.
          </p>

          <div 
            ref={containerRef} 
            className={`transition-all duration-300 relative ${
              isFullscreen 
                ? "fixed inset-0 z-50 bg-background overflow-hidden" 
                : "mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.7fr)] lg:items-start"
            }`}
          >
            {/* Compact bottom suggestion to rotate mobile screen in portrait */}
            {showRotateSuggestion && (
              <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 rounded-full border border-border/80 bg-background/90 px-3 py-1 text-[11px] font-medium shadow-lg backdrop-blur-md text-foreground whitespace-nowrap animate-in fade-in zoom-in-95">
                <Smartphone className="h-3.5 w-3.5 text-primary shrink-0 rotate-90 animate-pulse" />
                <span>Rotate for landscape 3D view</span>
                <button 
                  type="button" 
                  onClick={() => setShowRotateSuggestion(false)}
                  className="text-muted-foreground hover:text-foreground p-0.5 ml-1 rounded-full hover:bg-muted"
                  aria-label="Close suggestion"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {/* Always visible 'Choose Colors' floating button when collapsed or in fullscreen */}
            {isFullscreen && isPickerCollapsed && (
              <Button
                type="button"
                onClick={() => setIsPickerCollapsed(false)}
                className="absolute top-3 right-3 z-40 flex items-center gap-2 rounded-full border border-white/30 bg-primary text-primary-foreground px-4 py-2 text-xs sm:text-sm font-bold shadow-2xl hover:bg-primary/90 transition-all hover:scale-105"
              >
                <Palette className="h-4 w-4" />
                <span>Choose Colors</span>
              </Button>
            )}

            {/* 3D Room / Photo View Section */}
            <div className={`min-w-0 flex flex-col ${isFullscreen ? "absolute inset-0 z-0 w-full h-full" : ""}`}>
              <div className={`mb-3 grid min-w-0 grid-cols-2 gap-1 rounded-lg bg-muted p-1 ${isFullscreen ? "hidden" : ""}`} aria-label="Choose room">
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

              <div className={`relative isolate overflow-hidden bg-sand shadow-soft ${isFullscreen ? "w-full h-full rounded-none border-none" : "rounded-lg border border-border"}`}>
                {/* Fullscreen Toggle Button */}
                <Button 
                  type="button"
                  variant="secondary" 
                  size="icon" 
                  className="absolute top-3 left-3 z-30 bg-background/90 backdrop-blur-md shadow-md hover:bg-background border border-border/60 rounded-full h-9 w-9"
                  onClick={toggleFullscreen}
                  title={isFullscreen ? "Exit full screen" : "Full screen view"}
                >
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>

                {/* Selected Wall / Surface Visual Indicator Badge */}
                {mode === "default" && (
                  <div className={`absolute ${isFullscreen ? "top-3 left-14 sm:left-16" : "top-3 left-14 sm:left-16"} z-20 flex max-w-[65%] items-center gap-2 rounded-full border border-border/70 bg-background/90 px-3 py-1.5 shadow-md backdrop-blur-md`}>
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                    </span>
                    <span className="min-w-0 truncate text-xs font-semibold">
                      Editing: <strong className="text-primary capitalize">{roomWalls.find((w) => w.id === activeWall)?.label}</strong>
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 rounded-full border border-border shadow-inner"
                      style={{ backgroundColor: selected?.hex }}
                      title={selected?.name}
                    />
                  </div>
                )}

                {/* Active Color Info Badge (Right Side) in Window Mode */}
                {!isFullscreen && (
                  <div className="absolute right-2 top-11 flex max-w-[50%] items-center gap-2 rounded-md border border-border bg-background/95 p-2 shadow-soft backdrop-blur-sm sm:right-3 sm:top-3">
                    <span
                      aria-hidden="true"
                      className="h-8 w-8 shrink-0 rounded-md border border-border"
                      style={{ backgroundColor: selected?.hex }}
                    />
                    <span className="min-w-0">
                      <strong className="block truncate text-xs font-bold">{selected?.name}</strong>
                      <span className="block text-[10px] text-muted-foreground">{selected?.code}</span>
                    </span>
                  </div>
                )}

                {mode === "default" ? (
                  mounted ? (
                    <Suspense fallback={<img src={defaultRoom} alt="Loading furnished 3D room" width={1200} height={912} className="aspect-[4/3] w-full object-cover" />}>
                      <Room3D 
                        colors={roomColors} 
                        selectedWall={activeWall} 
                        onSelectWall={setActiveWall} 
                        className={isFullscreen ? "w-full h-full bg-sand touch-none cursor-move" : undefined} 
                      />
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
              </div>

              {/* Standard Wall & Surface Selector in Window Mode */}
              {mode === "default" ? (
                <div className={`mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 ${isFullscreen ? "hidden" : ""}`} aria-label="Choose a surface to paint">
                  {roomWalls.map((wall) => {
                    const shade = asianPaintsShades.find((item) => item.code === wallShadeCodes[wall.id]);
                    const isActive = activeWall === wall.id;
                    return (
                      <Button
                        key={wall.id}
                        type="button"
                        variant={isActive ? "default" : "outline"}
                        onClick={() => setActiveWall(wall.id)}
                        aria-pressed={isActive}
                        className={`h-auto min-h-11 justify-start gap-2 px-2.5 py-2 text-left relative transition-all ${
                          isActive ? "ring-2 ring-primary ring-offset-1 shadow-sm font-bold" : "hover:bg-muted"
                        }`}
                      >
                        <span className="h-5 w-5 shrink-0 rounded-full border border-border shadow-inner" style={{ backgroundColor: shade?.hex }} />
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs font-bold leading-tight">{wall.label}</span>
                          <span className="block truncate text-[10px] opacity-75">{shade?.name}</span>
                        </span>
                        {isActive && <Check className="h-3 w-3 shrink-0 ml-auto text-primary-foreground" />}
                      </Button>
                    );
                  })}
                </div>
              ) : null}

              {/* Photo Upload & Preview Buttons */}
              <div className={`mt-3 grid min-w-0 grid-cols-2 gap-2 ${isFullscreen ? "hidden" : ""}`}>
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
              {error && !isFullscreen ? <p className="mt-3 text-sm font-semibold text-destructive">{error}</p> : null}
              <p className={`mt-3 text-xs text-muted-foreground ${isFullscreen ? "hidden" : ""}`}>
                Screen colors and AI previews are approximate. Check a physical shade card before buying.
              </p>
            </div>

            {/* Floating Collapsible Glassmorphic Color Picker Panel */}
            <div 
              className={`min-w-0 transition-all duration-300 ${
                isFullscreen 
                  ? `absolute top-3 right-3 bottom-3 w-80 sm:w-96 max-w-[calc(100vw-1.5rem)] z-30 flex flex-col rounded-2xl border border-white/25 dark:border-white/10 bg-background/85 dark:bg-background/75 backdrop-blur-xl shadow-2xl p-3.5 sm:p-4 overflow-hidden ${
                      isPickerCollapsed ? "translate-x-[120%] opacity-0 pointer-events-none" : "translate-x-0 opacity-100"
                    }`
                  : "rounded-lg border border-border bg-card/95 backdrop-blur-sm p-3 md:p-4 shadow-soft"
              }`}
            >
              {/* Header with clear 'Choose Colors' title and collapse button */}
              <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-border/50 shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Palette className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold truncate leading-tight">Choose Colors</h3>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {mode === "default" ? `Painting: ${roomWalls.find((w) => w.id === activeWall)?.label}` : "Photo palette"}
                    </p>
                  </div>
                </div>
                {isFullscreen && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsPickerCollapsed(true)}
                    title="Collapse color panel"
                    className="h-7 px-2 text-xs rounded-full hover:bg-muted text-muted-foreground hover:text-foreground shrink-0 gap-1"
                  >
                    <span>Hide</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>

              {/* Surface / Wall Selector inside Fullscreen Drawer */}
              {isFullscreen && mode === "default" && (
                <div className="mb-2.5 shrink-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-muted-foreground">Select surface to paint:</span>
                    <span className="text-[10px] text-primary font-medium capitalize">
                      {roomWalls.find((w) => w.id === activeWall)?.label} active
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5" aria-label="Select room surface">
                    {roomWalls.map((wall) => {
                      const shade = asianPaintsShades.find((item) => item.code === wallShadeCodes[wall.id]);
                      const isActive = activeWall === wall.id;
                      return (
                        <Button
                          key={wall.id}
                          type="button"
                          variant={isActive ? "default" : "outline"}
                          onClick={() => setActiveWall(wall.id)}
                          aria-pressed={isActive}
                          className={`h-auto min-h-9 justify-start gap-1.5 px-2 py-1 text-left rounded-lg transition-all ${
                            isActive ? "ring-2 ring-primary ring-offset-1 shadow-sm font-bold" : "bg-background/40 hover:bg-background/70 text-muted-foreground border-border/70"
                          }`}
                        >
                          <span 
                            className="h-3.5 w-3.5 shrink-0 rounded-full border border-border shadow-inner" 
                            style={{ backgroundColor: shade?.hex }} 
                          />
                          <span className="min-w-0 flex-1 truncate">
                            <span className="block text-[10px] leading-tight font-semibold truncate">{wall.label}</span>
                            <span className="block truncate text-[9px] opacity-75">{shade?.name}</span>
                          </span>
                          {isActive && <Check className="h-3 w-3 shrink-0 text-primary-foreground" />}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Search input */}
              <div className="shrink-0 mb-2">
                <Input
                  type="search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setVisibleCount(SHADE_BATCH);
                  }}
                  placeholder="Search name or shade code..."
                  className="h-8 text-xs bg-background/50 backdrop-blur-sm border-border/70 rounded-lg"
                />
              </div>

              {/* Category pill bar */}
              <div className="flex gap-1.5 overflow-x-auto pb-1.5 shrink-0 no-scrollbar scrollbar-none" aria-label="Color families">
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
                    className={`h-6 shrink-0 rounded-full px-2.5 text-[10px] capitalize whitespace-nowrap transition-colors ${
                      family === name 
                        ? "shadow-sm font-semibold" 
                        : "bg-background/40 hover:bg-background/75 border-border/60 text-muted-foreground"
                    }`}
                  >
                    {name === "all" ? "All colors" : name.replace("-", " ")}
                  </Button>
                ))}
              </div>

              <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5 shrink-0">
                <span>{matches.length.toLocaleString("en-IN")} Asian Paints shades</span>
                <span className="text-primary font-medium">Click any shade to apply</span>
              </div>

              {/* Color swatch grid in single clean scrollable container */}
              {matches.length ? (
                <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2" aria-label="Choose an Asian Paints shade">
                    {matches.slice(0, visibleCount).map((shade) => {
                      const active = shade.code === selected?.code;
                      return (
                        <button
                          key={shade.code}
                          type="button"
                          onClick={() => chooseShade(shade)}
                          aria-pressed={active}
                          title={`${shade.name} ${shade.code}`}
                          className={`group min-w-0 overflow-hidden rounded-lg border text-left transition-all hover:scale-[1.02] ${
                            active 
                              ? "border-primary bg-background ring-2 ring-primary ring-offset-1 shadow-md" 
                              : "border-border/60 bg-background/60 hover:bg-background hover:border-border"
                          }`}
                        >
                          <span 
                            className="block aspect-square w-full rounded-t-sm transition-transform group-hover:brightness-95" 
                            style={{ backgroundColor: shade.hex }} 
                          />
                          <span className="block truncate px-1.5 pt-1 text-[10px] font-bold leading-tight">{shade.name}</span>
                          <span className="block truncate px-1.5 pb-1 text-[9px] text-muted-foreground">{shade.code}</span>
                        </button>
                      );
                    })}
                  </div>
                  {visibleCount < matches.length ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setVisibleCount((count) => count + SHADE_BATCH)}
                      className="mt-2.5 mb-1 w-full h-8 text-xs bg-background/50 hover:bg-background rounded-lg border-border/70"
                    >
                      Show more colors ({matches.length - visibleCount} more)
                    </Button>
                  ) : null}
                </div>
              ) : (
                <p className="mt-3 rounded-md bg-muted/50 p-4 text-xs text-muted-foreground text-center">No matching shade found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
