/**
 * ─────────────────────────────────────────────────────────────
 * SHOP INFORMATION — REPLACE THE PLACEHOLDER VALUES BELOW
 * ─────────────────────────────────────────────────────────────
 * Everything about the shop (name, phone, WhatsApp, address, map
 * link, timings, socials) lives here and nowhere else.
 */

export const business = {
  /** Shop display name */
  name: "Shree Jee Enterprises",
  tagline: "Plywood, Hardware & Asian Paints",

  /** One-line description used in SEO + hero support text */
  shortDescription:
    "Plywood, mica, furniture hardware and genuine Asian Paints products — everything you need for furniture and beautiful interiors at one local shop.",

  /** PLACEHOLDER — replace with the real phone number */
  phone: "8989622296",
  /** Country code without "+" (91 = India) */
  countryCode: "91",

  /** PLACEHOLDER — replace with the real WhatsApp number (digits only, no +) */
  whatsappNumber: "8989622296",

  /** PLACEHOLDER — replace with the real address */
  address: "Garoth Road, near ICICI Bank",
  city: "",
  state: "",
  pincode: "",

  /** PLACEHOLDER — replace with the real Google Maps share link */
  mapsLink: "https://maps.app.goo.gl/MoacJefByk3fiJWc6",
  /** PLACEHOLDER — replace with a real Google Maps embed URL (Share → Embed a map) */
  mapsEmbedUrl: "https://maps.google.com/maps?q=24.1924782,75.6360827&hl=en&z=16&output=embed",

  /** PLACEHOLDER — replace with real opening hours */
  hours: "10:00 AM – 8:00 PM",
  hoursNote: "Open all days",

  /** Optional social links — leave empty to hide */
  facebook: "",
  instagram: "",

  /**
   * Optional analytics domain for Plausible (lightweight, cookie-free).
   * Leave empty to disable. See src/lib/analytics.ts
   */
  plausibleDomain: "",
} as const;

export const phoneHref = `tel:+${business.countryCode}${business.phone}`;

export const fullAddress = [
  business.address,
  business.city,
  business.state,
  business.pincode,
]
  .filter(Boolean)
  .join(", ");
