/**
 * ─────────────────────────────────────────────────────────────
 * GALLERY IMAGES
 * ─────────────────────────────────────────────────────────────
 * Replace these with real photos of the shop and its products.
 * Drop new files into src/assets/, import them here and update
 * the caption + alt text.
 */

import exteriorAsset from "@/assets/shop-front-enhanced.webp.asset.json";
import paintInteriorAsset from "@/assets/shop-paint-interior-enhanced.webp.asset.json";
import hardwareInteriorAsset from "@/assets/shop-hardware-interior-enhanced.webp.asset.json";
import plywoodAsset from "@/assets/shop-plywood-stock-enhanced.webp.asset.json";

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  /** `tall` items span two rows in the masonry grid */
  shape?: "tall" | "wide" | "square";
};

export const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    src: exteriorAsset.url,
    alt: "Front of Shree Ji Enterprises with Asian Paints Colourworld signage",
    caption: "Shree Ji Enterprises",
    shape: "wide",
  },
  {
    id: "g2",
    src: paintInteriorAsset.url,
    alt: "Asian Paints enamel tins and furniture hardware stocked inside the shop",
    caption: "Asian Paints & hardware",
    shape: "tall",
  },
  {
    id: "g3",
    src: hardwareInteriorAsset.url,
    alt: "Shelves filled with furniture fittings, hardware and paint products",
    caption: "Hardware stock",
    shape: "wide",
  },
  {
    id: "g4",
    src: plywoodAsset.url,
    alt: "Plywood sheets stacked inside Shree Ji Enterprises",
    caption: "Plywood stock",
    shape: "tall",
  },
];
