import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { InventorySearch } from "@/components/InventorySearch";
import { SectionHeading } from "@/components/SectionHeading";
import { ContactStrip } from "@/components/HomeSections";
import { business } from "@/data/business";
import { track } from "@/lib/analytics";

const title = `Search Inventory | ${business.name}`;
const description = "Search available plywood, laminates, hardware, Asian Paints colors, adhesives and furniture accessories by product, brand or size.";

export const Route = createFileRoute("/inventory")({
  head: () => ({ meta: [
    { title }, { name: "description", content: description },
    { property: "og:title", content: title }, { property: "og:description", content: description },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/inventory" }] }),
  component: InventoryPage,
});

function InventoryPage() {
  useEffect(() => track("page_view", { page: "inventory" }), []);
  return <><section className="bg-cream pt-8 pb-10 md:pt-14"><div className="container-page"><h1 className="sr-only">Search our inventory</h1><SectionHeading eyebrow="Inventory" title="Find a product quickly" description="Search by product name, brand, category, or size." /><InventorySearch /></div></section><ContactStrip /></>;
}
