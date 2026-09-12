/**
 * ─────────────────────────────────────────────────────────────
 * PRODUCTS — SAMPLE DATA FOR THE UI
 * ─────────────────────────────────────────────────────────────
 * Replace these entries with the shop's real items. Only `id`,
 * `slug`, `name`, `category` and `image` are required.
 *
 * `price` is an APPROXIMATE indication only and is always shown
 * with a "prices may vary" note. Leave it out to hide it.
 *
 * `swatch` (hex colour) is used by the Asian Paints Colors section to
 * render a colour card instead of relying only on a photo.
 */

import commercialPlywood from "@/assets/product-commercial-plywood.jpg";
import waterproofPlywood from "@/assets/product-waterproof-plywood.jpg";
import mdfBoard from "@/assets/product-mdf-board.jpg";
import woodgrainLaminate from "@/assets/product-woodgrain-laminate.jpg";
import glossLaminate from "@/assets/product-gloss-laminate.jpg";
import matteLaminate from "@/assets/product-matte-laminate.jpg";
import softCloseHinge from "@/assets/product-soft-close-hinge.jpg";
import drawerChannel from "@/assets/product-drawer-channel.jpg";
import paintTerracotta from "@/assets/product-paint-terracotta.jpg";
import paintOlive from "@/assets/product-paint-olive.jpg";
import paintSand from "@/assets/product-paint-sand.jpg";
import wallPutty from "@/assets/product-wall-putty.jpg";
import woodAdhesive from "@/assets/product-fevicol-sh.png";
import contactAdhesive from "@/assets/product-fevicol-sr-998.png";
import cabinetHandles from "@/assets/product-cabinet-handles.jpg";
import knobsHooks from "@/assets/product-knobs-hooks.jpg";

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  /** must match a slug in src/data/categories.ts */
  category: string;
  shortDescription: string;
  description?: string;
  /** approximate price text, e.g. "₹85 / sq.ft" */
  price?: string;
  sizes?: string[];
  specs?: { label: string; value: string }[];
  image: string;
  imageAlt: string;
  swatch?: string;
  featured?: boolean;
};

export const products: Product[] = [
  {
    id: "p1",
    slug: "commercial-plywood-19mm",
    name: "Commercial Plywood 19 mm",
    brand: "Brand on request",
    category: "plywood-boards",
    shortDescription: "General purpose board for wardrobes, beds and cabinets.",
    description:
      "MR grade commercial plywood suited to indoor furniture work. Available in standard 8x4 sheets and cut to your requirement at the shop.",
    price: "Approx. ₹75 / sq.ft",
    sizes: ["8 x 4 ft", "7 x 4 ft", "6 x 3 ft"],
    specs: [
      { label: "Thickness", value: "19 mm" },
      { label: "Grade", value: "MR (moisture resistant)" },
      { label: "Core", value: "Hardwood" },
    ],
    image: commercialPlywood.url,
    imageAlt: "Representative 3D view of commercial plywood sheets",
    featured: true,
  },
  {
    id: "p2",
    slug: "waterproof-plywood-18mm",
    name: "Waterproof Plywood 18 mm",
    category: "plywood-boards",
    shortDescription: "BWP grade board for kitchens and bathroom units.",
    description:
      "Boiling water proof plywood for kitchen platforms, wash areas and anywhere moisture is a concern.",
    price: "Approx. ₹105 / sq.ft",
    sizes: ["8 x 4 ft", "7 x 4 ft"],
    specs: [
      { label: "Thickness", value: "18 mm" },
      { label: "Grade", value: "BWP" },
    ],
    image: waterproofPlywood.url,
    imageAlt: "Representative 3D view of waterproof plywood sheets",
  },
  {
    id: "p3",
    slug: "mdf-board-12mm",
    name: "MDF Board 12 mm",
    category: "plywood-boards",
    shortDescription: "Smooth board for panelling and painted finishes.",
    price: "Approx. ₹48 / sq.ft",
    sizes: ["8 x 4 ft"],
    image: mdfBoard.url,
    imageAlt: "Representative 3D view of MDF boards",
  },
  {
    id: "p4",
    slug: "wood-grain-laminate-1mm",
    name: "Wood Grain Laminate 1 mm",
    category: "mica-laminates",
    shortDescription: "Natural wood grain finish for doors and shutters.",
    description:
      "1 mm decorative laminate in a range of wood grain shades. Full catalogue available at the shop.",
    price: "Approx. ₹950 / sheet",
    sizes: ["8 x 4 ft"],
    specs: [
      { label: "Thickness", value: "1 mm" },
      { label: "Finish", value: "Suede / Gloss" },
    ],
    image: woodgrainLaminate.url,
    imageAlt: "Representative 3D view of wood grain laminate sheets",
    featured: true,
  },
  {
    id: "p5",
    slug: "high-gloss-laminate",
    name: "High Gloss Laminate",
    category: "mica-laminates",
    shortDescription: "Mirror-like finish for modern kitchen shutters.",
    price: "Approx. ₹1,650 / sheet",
    sizes: ["8 x 4 ft"],
    image: glossLaminate.url,
    imageAlt: "Representative 3D view of high gloss laminate sheets",
  },
  {
    id: "p6",
    slug: "matte-solid-laminate",
    name: "Matte Solid Laminate",
    category: "mica-laminates",
    shortDescription: "Soft matte solid shades in white, beige and charcoal.",
    price: "Approx. ₹1,100 / sheet",
    image: matteLaminate.url,
    imageAlt: "Representative 3D view of matte laminate samples",
  },
  {
    id: "p7",
    slug: "soft-close-hinge",
    name: "Soft Close Hinge",
    category: "hinges-hardware",
    shortDescription: "Smooth, quiet closing hinge for cabinet shutters.",
    description:
      "Hydraulic soft-close hinge available in full overlay and half overlay. Sold per piece or per box.",
    price: "Approx. ₹95 / piece",
    specs: [
      { label: "Type", value: "Hydraulic soft close" },
      { label: "Finish", value: "Nickel plated" },
    ],
    image: softCloseHinge.url,
    imageAlt: "Representative 3D view of a soft close cabinet hinge",
    featured: true,
  },
  {
    id: "p8",
    slug: "telescopic-drawer-channel",
    name: "Telescopic Drawer Channel",
    category: "hinges-hardware",
    shortDescription: "Ball bearing channels for smooth drawer movement.",
    price: "Approx. ₹230 / pair",
    sizes: ['12"', '14"', '16"', '18"', '20"'],
    image: drawerChannel.url,
    imageAlt: "Representative 3D view of telescopic drawer channels",
  },
  {
    id: "p9",
    slug: "interior-emulsion-terracotta",
    name: "Interior Emulsion — Terracotta",
    brand: "Asian Paints",
    category: "wall-colors",
    shortDescription: "Warm earthy shade with a soft sheen finish.",
    description:
      "Washable interior emulsion. Bring your room measurements and we will estimate the quantity for you.",
    price: "Approx. ₹520 / litre",
    sizes: ["1 L", "4 L", "10 L", "20 L"],
    image: paintTerracotta.url,
    imageAlt: "Representative 3D view of interior paint with a terracotta shade card",
    swatch: "#B2603C",
    featured: true,
  },
  {
    id: "p10",
    slug: "interior-emulsion-olive",
    name: "Interior Emulsion — Olive",
    brand: "Asian Paints",
    category: "wall-colors",
    shortDescription: "Deep natural green that pairs well with wood.",
    price: "Approx. ₹540 / litre",
    sizes: ["1 L", "4 L", "10 L"],
    image: paintOlive.url,
    imageAlt: "Representative 3D view of interior paint with an olive shade card",
    swatch: "#5E6437",
  },
  {
    id: "p11",
    slug: "interior-emulsion-sand",
    name: "Interior Emulsion — Sand",
    brand: "Asian Paints",
    category: "wall-colors",
    shortDescription: "Neutral warm beige for bright, calm rooms.",
    price: "Approx. ₹480 / litre",
    sizes: ["1 L", "4 L", "10 L", "20 L"],
    image: paintSand.url,
    imageAlt: "Representative 3D view of interior paint with a sand shade card",
    swatch: "#CBA98A",
  },
  {
    id: "p12",
    slug: "wall-putty",
    name: "Wall Putty",
    brand: "Asian Paints",
    category: "wall-colors",
    shortDescription: "Smooth base coat for a flawless paint finish.",
    price: "Approx. ₹680 / 20 kg",
    image: wallPutty.url,
    imageAlt: "Representative 3D view of a wall putty bag",
  },
  {
    id: "p13",
    slug: "wood-adhesive",
    name: "Fevicol SH Wood Adhesive",
    brand: "Fevicol",
    category: "adhesives",
    shortDescription: "Strong white adhesive for joinery and laminate work.",
    description: "Available in small tubs through to large packs for site work.",
    price: "Approx. ₹210 / kg",
    sizes: ["500 g", "1 kg", "5 kg", "20 kg"],
    image: woodAdhesive.url,
    imageAlt: "Genuine Fevicol SH wood adhesive container",
    featured: true,
  },
  {
    id: "p14",
    slug: "contact-adhesive",
    name: "Fevicol SR 998 Contact Adhesive",
    brand: "Fevicol",
    category: "adhesives",
    shortDescription: "Instant grip adhesive for laminate and sunmica pasting.",
    price: "Approx. ₹340 / litre",
    image: contactAdhesive.url,
    imageAlt: "Genuine Fevicol SR 998 contact adhesive container",
  },
  {
    id: "p15",
    slug: "cabinet-handles",
    name: "Cabinet Handles",
    category: "furniture-accessories",
    shortDescription: "Brass, black and steel handles in several lengths.",
    price: "From approx. ₹120 / piece",
    sizes: ['4"', '6"', '8"', '12"'],
    image: cabinetHandles.url,
    imageAlt: "Representative 3D view of cabinet handles",
    featured: true,
  },
  {
    id: "p16",
    slug: "knobs-and-hooks",
    name: "Knobs & Hooks",
    category: "furniture-accessories",
    shortDescription: "Small fittings that finish a wardrobe or kitchen neatly.",
    price: "From approx. ₹40 / piece",
    image: knobsHooks.url,
    imageAlt: "Representative 3D view of furniture knobs and hooks",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const productsByCategory = (categorySlug: string) =>
  products.filter((p) => p.category === categorySlug);
export const featuredProducts = products.filter((p) => p.featured);
