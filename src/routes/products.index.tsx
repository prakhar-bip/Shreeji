import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { RequestSection, ContactStrip } from "@/components/HomeSections";
import { business } from "@/data/business";
import { track } from "@/lib/analytics";
import { QuickCatalog } from "@/components/QuickCatalog";

const title = `Products — Plywood, Laminates, Hardware & Paints | ${business.name}`;
const description =
  "Browse plywood and boards, mica and laminates, hinges and hardware, wall colors, adhesives and furniture accessories available at our shop.";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/products" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  useEffect(() => track("page_view", { page: "products" }), []);

  return (
    <>
      <section className="bg-cream pt-10 pb-10 md:pt-14">
        <div className="container-page">
          <SectionHeading eyebrow="Products" title="Tap a type to see items" />
          <Link to="/inventory" className="btn btn-primary mt-4">Search all inventory</Link>
          <div className="mt-5"><QuickCatalog /></div>
        </div>
      </section>

      <RequestSection />
      <ContactStrip />
    </>
  );
}
