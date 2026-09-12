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
 * `swatch` (hex colour) is used by the Wall Colors section to
 * render a colour card instead of relying only on a photo.
 */

import plywood from "@/assets/cat-plywood.jpg";
import mica from "@/assets/cat-mica.jpg";
import hardware from "@/assets/cat-hardware.jpg";
import colors from "@/assets/cat-colors.jpg";
import adhesives from "@/assets/cat-adhesives.jpg";
import accessories from "@/assets/cat-accessories.jpg";

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
    image: plywood,
    imageAlt: "Commercial plywood sheet 19 mm thickness",
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
    image: plywood,
    imageAlt: "Waterproof plywood board stack",
  },
  {
    id: "p3",
    slug: "mdf-board-12mm",
    name: "MDF Board 12 mm",
    category: "plywood-boards",
    shortDescription: "Smooth board for panelling and painted finishes.",
    price: "Approx. ₹48 / sq.ft",
    sizes: ["8 x 4 ft"],
    image: plywood,
    imageAlt: "MDF board sheet",
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
    image: mica,
    imageAlt: "Wood grain laminate sheet sample",
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
    image: mica,
    imageAlt: "High gloss laminate sheet sample",
  },
  {
    id: "p6",
    slug: "matte-solid-laminate",
    name: "Matte Solid Laminate",
    category: "mica-laminates",
    shortDescription: "Soft matte solid shades in white, beige and charcoal.",
    price: "Approx. ₹1,100 / sheet",
    image: mica,
    imageAlt: "Matte solid colour laminate sheet sample",
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
    image: hardware,
    imageAlt: "Soft close cabinet hinge",
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
    image: hardware,
    imageAlt: "Telescopic drawer channel pair",
  },
  {
    id: "p9",
    slug: "interior-emulsion-terracotta",
    name: "Asian Paints Royale — Terracotta",
    brand: "Asian Paints",
    category: "wall-colors",
    shortDescription: "Warm earthy shade with a soft sheen finish.",
    description:
      "Washable interior emulsion. Bring your room measurements and we will estimate the quantity for you.",
    price: "Approx. ₹520 / litre",
    sizes: ["1 L", "4 L", "10 L", "20 L"],
    image: colors,
    imageAlt: "Terracotta interior wall paint tin with shade card",
    swatch: "#B2603C",
    featured: true,
  },
  {
    id: "p10",
    slug: "interior-emulsion-olive",
    name: "Asian Paints Royale — Olive",
    brand: "Asian Paints",
    category: "wall-colors",
    shortDescription: "Deep natural green that pairs well with wood.",
    price: "Approx. ₹540 / litre",
    sizes: ["1 L", "4 L", "10 L"],
    image: colors,
    imageAlt: "Olive green interior wall paint",
    swatch: "#5E6437",
  },
  {
    id: "p11",
    slug: "interior-emulsion-sand",
    name: "Asian Paints Royale — Sand",
    brand: "Asian Paints",
    category: "wall-colors",
    shortDescription: "Neutral warm beige for bright, calm rooms.",
    price: "Approx. ₹480 / litre",
    sizes: ["1 L", "4 L", "10 L", "20 L"],
    image: colors,
    imageAlt: "Sand beige interior wall paint",
    swatch: "#CBA98A",
  },
  {
    id: "p12",
    slug: "wall-putty",
    name: "Asian Paints TruCare Wall Putty",
    brand: "Asian Paints",
    category: "wall-colors",
    shortDescription: "Smooth base coat for a flawless paint finish.",
    price: "Approx. ₹680 / 20 kg",
    image: colors,
    imageAlt: "Wall putty bag",
  },
  {
    id: "p13",
    slug: "wood-adhesive",
    name: "Wood Adhesive (Fevicol type)",
    category: "adhesives",
    shortDescription: "Strong white adhesive for joinery and laminate work.",
    description: "Available in small tubs through to large packs for site work.",
    price: "Approx. ₹210 / kg",
    sizes: ["500 g", "1 kg", "5 kg", "20 kg"],
    image: adhesives,
    imageAlt: "White wood adhesive tub",
    featured: true,
  },
  {
    id: "p14",
    slug: "contact-adhesive",
    name: "Contact Adhesive",
    category: "adhesives",
    shortDescription: "Instant grip adhesive for laminate and sunmica pasting.",
    price: "Approx. ₹340 / litre",
    image: adhesives,
    imageAlt: "Contact adhesive container",
  },
  {
    id: "p15",
    slug: "cabinet-handles",
    name: "Cabinet Handles",
    category: "furniture-accessories",
    shortDescription: "Brass, black and steel handles in several lengths.",
    price: "From approx. ₹120 / piece",
    sizes: ['4"', '6"', '8"', '12"'],
    image: accessories,
    imageAlt: "Brass and black cabinet handles",
    featured: true,
  },
  {
    id: "p16",
    slug: "knobs-and-hooks",
    name: "Knobs & Hooks",
    category: "furniture-accessories",
    shortDescription: "Small fittings that finish a wardrobe or kitchen neatly.",
    price: "From approx. ₹40 / piece",
    image: accessories,
    imageAlt: "Furniture knobs and hooks",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const productsByCategory = (categorySlug: string) =>
  products.filter((p) => p.category === categorySlug);
export const featuredProducts = products.filter((p) => p.featured);
