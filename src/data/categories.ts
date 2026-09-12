/**
 * ─────────────────────────────────────────────────────────────
 * PRODUCT CATEGORIES
 * ─────────────────────────────────────────────────────────────
 * To change an image: replace the file in src/assets/ (keep the
 * same filename) or import a new one and swap the `image` value.
 */

import plywoodAsset from "@/assets/shop-plywood-stock-enhanced.webp";
import mica from "@/assets/cat-mica.jpg";
import hardwareAsset from "@/assets/shop-hardware-interior-enhanced.webp";
import colorsAsset from "@/assets/shop-paint-interior-enhanced.webp";
import fevicolSh from "@/assets/product-fevicol-sh.png";
import accessories from "@/assets/cat-accessories.jpg";

export type Category = {
  slug: string;
  name: string;
  description: string;
  /** Longer intro shown on the category page */
  intro?: string;
  image: string;
  imageAlt: string;
  section: "colors" | "materials";
};

export const categories: Category[] = [
  {
    slug: "plywood-boards",
    name: "Plywood & Boards",
    description: "Commercial and waterproof plywood, MDF, particle board and blockboard.",
    intro:
      "Boards for furniture, wardrobes, kitchens and shuttering work — in the thicknesses and grades carpenters ask for most.",
    image: plywoodAsset,
    imageAlt: "Stacked plywood sheets showing layered edges",
    section: "materials",
  },
  {
    slug: "mica-laminates",
    name: "Mica & Laminates",
    description: "Wood grain, solid, matte and high gloss laminate sheets.",
    intro:
      "Hundreds of finishes to choose from. Bring your design or come see the sample catalogues at the shop.",
    image: mica,
    imageAlt: "Laminate and mica sheet samples fanned out in different finishes",
    section: "materials",
  },
  {
    slug: "hinges-hardware",
    name: "Hinges & Hardware",
    description: "Auto hinges, soft-close hinges, channels, locks and fittings.",
    intro:
      "Hinges, drawer channels, locks, tower bolts and fittings for everyday furniture work.",
    image: hardwareAsset,
    imageAlt: "Cabinet hinges, channels and furniture fittings arranged on a cream surface",
    section: "materials",
  },
  {
    slug: "wall-colors",
    name: "Asian Paints Colors",
    description: "Genuine Asian Paints interior and exterior paints, primers and putty.",
    intro:
      "Choose from Asian Paints shades and products. We will help estimate how much paint your room needs.",
    image: colorsAsset,
    imageAlt: "Asian Paints products stocked inside Shree Ji Enterprises",
    section: "colors",
  },
  {
    slug: "adhesives",
    name: "Fevicol & Adhesives",
    description: "Genuine Fevicol wood and contact adhesives for furniture work.",
    intro: "Fevicol adhesives for laminate pasting, joinery and general interior work.",
    image: fevicolSh,
    imageAlt: "Genuine Fevicol SH adhesive container",
    section: "materials",
  },
  {
    slug: "furniture-accessories",
    name: "Furniture Accessories",
    description: "Handles, knobs, hooks, profiles and finishing accessories.",
    intro: "The finishing touches — handles, knobs, hooks, edge profiles and more.",
    image: accessories,
    imageAlt: "Brass and black furniture handles, knobs and pulls in a neat grid",
    section: "materials",
  },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const colorCategories = categories.filter((category) => category.section === "colors");
export const materialCategories = categories.filter((category) => category.section === "materials");
