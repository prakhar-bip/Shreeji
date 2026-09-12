/**
 * ─────────────────────────────────────────────────────────────
 * CUSTOMER REVIEWS
 * ─────────────────────────────────────────────────────────────
 * These are SAMPLE entries used to demonstrate the layout.
 * Keep `isPlaceholder: true` until you replace them with real
 * reviews — the UI shows a "sample" note while any remain.
 */

export type Review = {
  id: string;
  name: string;
  /** e.g. Carpenter, Homeowner, Contractor */
  type?: string;
  text: string;
  rating: 1 | 2 | 3 | 4 | 5;
  isPlaceholder?: boolean;
};

export const reviews: Review[] = [
  {
    id: "r1",
    name: "Sample review",
    type: "Carpenter",
    text: "Good range of plywood and laminates in one place, and the staff help you pick the right board for the job.",
    rating: 5,
    isPlaceholder: true,
  },
  {
    id: "r2",
    name: "Sample review",
    type: "Homeowner",
    text: "We chose our wall colours here and got the hardware for the wardrobes on the same visit. Very convenient.",
    rating: 5,
    isPlaceholder: true,
  },
  {
    id: "r3",
    name: "Sample review",
    type: "Interior contractor",
    text: "They arrange items on request and the WhatsApp replies are quick, which saves a trip to the shop.",
    rating: 4,
    isPlaceholder: true,
  },
];

export const hasPlaceholderReviews = reviews.some((r) => r.isPlaceholder);
