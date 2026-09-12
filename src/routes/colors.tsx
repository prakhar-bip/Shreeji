import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ColorVisualizer } from "@/components/ColorVisualizer";
import { ProductCard } from "@/components/ProductCard";
import { ContactStrip } from "@/components/HomeSections";
import asianPaintsLogo from "@/assets/asian-paints-logo.webp";
import colorsImage from "@/assets/shop-paint-interior-enhanced.webp";
import { productsByCategory } from "@/data/products";
import { business } from "@/data/business";
import { track } from "@/lib/analytics";

const title = `Asian Paints Colors & Room Preview | ${business.name}`;
const description =
  "Browse Asian Paints products and official shades, then upload a room photo to preview a selected wall color.";

export const Route = createFileRoute("/colors")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/colors" }],
  }),
  component: ColorsPage,
});

function ColorsPage() {
  const paintProducts = productsByCategory("wall-colors");

  useEffect(() => track("page_view", { page: "colors" }), []);

  return (
    <>
      <section className="bg-cream py-8 md:py-14">
        <div className="container-page grid gap-6 md:grid-cols-[minmax(0,1fr)_22rem] md:items-center">
          <div>
            <img
              src={asianPaintsLogo.url}
              alt="Asian Paints"
              width={321}
              height={63}
              className="h-8 w-40 object-contain object-left"
            />
            <h1 className="mt-4 font-display text-[2rem] font-semibold md:text-5xl">
              Choose your wall color
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
              See available paint products, search official shades and preview a color on your own
              room photo.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href="#room-preview" className="btn btn-primary">Find a shade</a>
              <a href="#room-preview" className="btn btn-outline">Try in my room</a>
            </div>
          </div>
          <img
            src={colorsImage.url}
            alt="Asian Paints products inside Shree Ji Enterprises"
            width={768}
            height={576}
            className="aspect-[4/3] w-full rounded-lg border border-border object-cover"
          />
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <p className="eyebrow">Paint products</p>
          <div className="mt-2 flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-semibold md:text-3xl">Asian Paints range</h2>
            <Link
              to="/products/$category"
              params={{ category: "wall-colors" }}
              className="text-sm font-bold text-clay"
            >
              See all
            </Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {paintProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      <ColorVisualizer />

      <ContactStrip />
    </>
  );
}
