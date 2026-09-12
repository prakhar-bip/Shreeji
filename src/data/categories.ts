/**
 * ─────────────────────────────────────────────────────────────
 * PRODUCT CATEGORIES
 * ─────────────────────────────────────────────────────────────
 * To change an image: replace the file in src/assets/ (keep the
 * same filename) or import a new one and swap the `image` value.
 */

import plywood from "@/assets/cat-plywood.jpg";
import mica from "@/assets/cat-mica.jpg";
import hardware from "@/assets/cat-hardware.jpg";
import colors from "@/assets/cat-colors.jpg";
import adhesives from "@/assets/cat-adhesives.jpg";
import accessories from "@/assets/cat-accessories.jpg";

export type Category = {
  slug: string;
  name: string;
  description: string;
  /** Longer intro shown on the category page */
  intro?: string;
  image: string;
  imageAlt: string;
};

export const categories: Category[] = [
  {
    slug: "plywood-boards",
    name: "Plywood & Boards",
    description: "Commercial and waterproof plywood, MDF, particle board and blockboard.",
    intro:
      "Boards for furniture, wardrobes, kitchens and shuttering work — in the thicknesses and grades carpenters ask for most.",
    image: plywood,
    imageAlt: "Stacked plywood sheets showing layered edges",
  },
  {
    slug: "mica-laminates",
    name: "Mica & Laminates",
    description: "Wood grain, solid, matte and high gloss laminate sheets.",
    intro:
      "Hundreds of finishes to choose from. Bring your design or come see the sample catalogues at the shop.",
    image: mica,
    imageAlt: "Laminate and mica sheet samples fanned out in different finishes",
  },
  {
    slug: "hinges-hardware",
    name: "Hinges & Hardware",
    description: "Auto hinges, soft-close hinges, channels, locks and fittings.",
    intro:
      "Hinges, drawer channels, locks, tower bolts and fittings for everyday furniture work.",
    image: hardware,
    imageAlt: "Cabinet hinges, channels and furniture fittings arranged on a cream surface",
  },
  {
    slug: "wall-colors",
    name: "Wall Colors",
    description: "Interior and exterior paints, primers, putty and shade cards.",
    intro:
      "Pick a shade from the shade card and we will help you work out how much paint your room needs.",
    image: colors,
    imageAlt: "Open paint tins and colour swatch cards in warm earthy shades",
  },
  {
    slug: "adhesives",
    name: "Adhesives & Fevicol",
    description: "Wood adhesives, contact adhesives, sealants and tapes.",
    intro: "Adhesives for laminate pasting, joinery and general interior work.",
    image: adhesives,
    imageAlt: "White wood adhesive tubs with an application knife",
  },
  {
    slug: "furniture-accessories",
    name: "Furniture Accessories",
    description: "Handles, knobs, hooks, profiles and finishing accessories.",
    intro: "The finishing touches — handles, knobs, hooks, edge profiles and more.",
    image: accessories,
    imageAlt: "Brass and black furniture handles, knobs and pulls in a neat grid",
  },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
