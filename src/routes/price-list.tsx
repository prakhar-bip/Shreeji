import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { PriceList } from "@/components/PriceList";
import { ContactStrip } from "@/components/HomeSections";
import { business } from "@/data/business";
import { track } from "@/lib/analytics";

const title = `Price List & Asian Paints Shades | ${business.name}`;
const description =
  "Search the official Asian Paints shade directory and ask Shree Ji Enterprises for current paint, plywood and hardware prices.";

export const Route = createFileRoute("/price-list")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/price-list" }],
  }),
  component: PriceListPage,
});

function PriceListPage() {
  useEffect(() => track("page_view", { page: "price-list" }), []);

  return (
    <>
      <main className="bg-cream pt-8 pb-10 md:pt-14 md:pb-16">
        <div className="container-page">
          <p className="eyebrow">Compare before you visit</p>
          <h1 className="mt-2 max-w-3xl font-display text-[2rem] font-semibold md:text-5xl">
            Prices & Asian Paints shades
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
            Find an Asian Paints shade by name or code. Ask us for today’s paint, plywood and
            hardware prices on WhatsApp.
          </p>
          <div className="mt-7">
            <PriceList />
          </div>
        </div>
      </main>
      <ContactStrip />
    </>
  );
}
