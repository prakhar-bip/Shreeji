import { business } from "@/data/business";

/** Build a wa.me link with a pre-filled message. */
export function whatsappLink(message: string) {
  return `https://wa.me/${business.countryCode}${business.whatsappNumber}?text=${encodeURIComponent(
    message,
  )}`;
}

/** Centralised message templates — edit the wording here. */
export const waMessages = {
  general:
    "Hi, I found your shop through your website and would like to know more about your products.",
  product: (name: string) =>
    `Hi, I found ${name} on your website. I would like to know more about this product — is it available?`,
  category: (name: string) =>
    `Hi, I would like to know what you have available in ${name}.`,
  request:
    "Hi, I am looking for a product similar to the photo I am sending. Can you help me find it?",
  visit: "Hi, I would like to visit your shop. Can you share the location and timings?",
};
