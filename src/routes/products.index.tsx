import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { RequestSection, ContactStrip } from "@/components/HomeSections";
import { business } from "@/data/business";
import { track } from "@/lib/analytics";
import asianPaintsLogo from "@/assets/asian-paints-logo.webp";
import colorsImage from "@/assets/shop-paint-interior-enhanced.webp";
import materialsImage from "@/assets/shop-hardware-interior-enhanced.webp";
import { ArrowIcon } from "@/components/Icons";

const title = `Products — Plywood, Laminates, Hardware & Paints | ${business.name}`;
const description =
  "Browse plywood and boards, mica and laminates, hinges and hardware, Asian Paints colors, adhesives and furniture accessories available at our shop.";

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
          <SectionHeading eyebrow="Products" title="What are you looking for?" />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Link to="/colors" className="group overflow-hidden rounded-lg border border-border bg-card">
              <img src={colorsImage.url} alt="Asian Paints products in the shop" className="aspect-[16/9] w-full object-cover" />
              <div className="p-4">
                <img src={asianPaintsLogo.url} alt="Asian Paints" className="h-6 w-32 object-contain object-left" />
                <span className="mt-3 flex items-center justify-between text-xl font-semibold">Colors <ArrowIcon className="h-5 w-5" /></span>
                <p className="mt-1 text-sm text-muted-foreground">Shades, paint products and room preview</p>
              </div>
            </Link>
            <Link to="/materials" className="group overflow-hidden rounded-lg border border-border bg-card">
              <img src={materialsImage.url} alt="Furniture hardware and interior materials in the shop" className="aspect-[16/9] w-full object-cover" />
              <div className="p-4">
                <span className="flex items-center justify-between text-xl font-semibold">Other Materials <ArrowIcon className="h-5 w-5" /></span>
                <p className="mt-1 text-sm text-muted-foreground">Plywood, laminates, hardware, Fevicol and accessories</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <RequestSection />
      <ContactStrip />
    </>
  );
}
