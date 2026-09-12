/**
 * ─────────────────────────────────────────────────────────────
 * GALLERY IMAGES
 * ─────────────────────────────────────────────────────────────
 * Replace these with real photos of the shop and its products.
 * Drop new files into src/assets/, import them here and update
 * the caption + alt text.
 */

import exterior from "@/assets/shop-exterior.jpg";
import interior from "@/assets/shop-interior.jpg";
import plywood from "@/assets/cat-plywood.jpg";
import mica from "@/assets/cat-mica.jpg";
import hardware from "@/assets/cat-hardware.jpg";
import colors from "@/assets/cat-colors.jpg";
import adhesives from "@/assets/cat-adhesives.jpg";
import accessories from "@/assets/cat-accessories.jpg";

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
    src: exterior,
    alt: "Shop exterior with plywood and laminate sheets on display",
    caption: "Our shop",
    shape: "wide",
  },
  {
    id: "g2",
    src: interior,
    alt: "Inside the shop — laminate racks, plywood stacks and shelves of hardware",
    caption: "Inside the shop",
    shape: "tall",
  },
  {
    id: "g3",
    src: mica,
    alt: "Laminate and mica sample sheets in different finishes",
    caption: "Laminate finishes",
  },
  {
    id: "g4",
    src: plywood,
    alt: "Plywood sheets stacked showing layered edges",
    caption: "Plywood stock",
  },
  {
    id: "g5",
    src: hardware,
    alt: "Hinges, channels and furniture fittings",
    caption: "Hardware counter",
  },
  {
    id: "g6",
    src: colors,
    alt: "Paint tins and shade cards in warm earthy colours",
    caption: "Wall colours",
    shape: "tall",
  },
  {
    id: "g7",
    src: accessories,
    alt: "Handles, knobs and pulls displayed in a grid",
    caption: "Handles & knobs",
  },
  {
    id: "g8",
    src: adhesives,
    alt: "Wood adhesive tubs of different sizes",
    caption: "Adhesives",
  },
];
