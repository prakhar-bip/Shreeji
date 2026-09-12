import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { QuickCatalog } from "@/components/QuickCatalog";
import { ContactStrip, RequestSection } from "@/components/HomeSections";
import { materialCategories } from "@/data/categories";
import { business } from "@/data/business";
import { track } from "@/lib/analytics";
import { ArrowIcon } from "@/components/Icons";

const title = `Plywood, Hardware, Laminates & Fevicol | ${business.name}`;
const description =
  "Browse plywood, boards, laminates, furniture hardware, genuine Fevicol adhesives and accessories available at Shree Jee Enterprises.";

export const Route = createFileRoute("/materials")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/materials" }],
  }),
  component: MaterialsPage,
});

function MaterialsPage() {
  useEffect(() => track("page_view", { page: "materials" }), []);

  return (
    <>
      <section className="bg-cream py-8 md:py-14">
        <div className="container-page">
          <p className="eyebrow">Other materials</p>
          <h1 className="mt-2 max-w-3xl font-display text-[2rem] font-semibold md:text-5xl">
            Furniture and interior materials
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
            Choose a type below to see plywood, laminates, hardware, genuine Fevicol adhesives and
            finishing accessories.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
            {materialCategories.map((category) => (
              <Link
                key={category.slug}
                to="/products/$category"
                params={{ category: category.slug }}
                className="overflow-hidden rounded-lg border border-border bg-card"
              >
                <img
                  src={category.image}
                  alt={category.imageAlt}
                  width={480}
                  height={360}
                  className="aspect-[4/3] w-full object-cover"
                />
                <span className="flex items-center justify-between gap-2 p-3 text-sm font-bold">
                  {category.name}<ArrowIcon className="h-4 w-4 shrink-0" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <p className="eyebrow">Browse products</p>
          <h2 className="mt-2 font-display text-2xl font-semibold md:text-3xl">Tap a material type</h2>
          <div className="mt-5"><QuickCatalog categoryList={materialCategories} /></div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link to="/inventory" className="btn btn-outline">Search all inventory</Link>
            <Link to="/price-list" className="btn btn-outline">Plywood & hardware prices</Link>
          </div>
        </div>
      </section>
      <RequestSection />
      <ContactStrip />
    </>
  );
}
