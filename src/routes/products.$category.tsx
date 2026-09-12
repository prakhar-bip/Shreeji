import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { PriceNote } from "@/components/PriceNote";
import { WhatsAppButton, CallButton } from "@/components/ContactActions";
import { RequestSection, ContactStrip } from "@/components/HomeSections";
import { getCategory, categories } from "@/data/categories";
import { productsByCategory } from "@/data/products";
import { business } from "@/data/business";
import { waMessages } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { ArrowIcon } from "@/components/Icons";
import { ColorVisualizer } from "@/components/ColorVisualizer";

export const Route = createFileRoute("/products/$category")({
  loader: ({ params }) => {
    const category = getCategory(params.category);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Category not found" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.category.name} | ${business.name}`;
    const description = loaderData.category.intro ?? loaderData.category.description;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:url", content: `/products/${params.category}` },
      ],
      links: [{ rel: "canonical", href: `/products/${params.category}` }],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const items = productsByCategory(category.slug);
  const isColors = category.slug === "wall-colors";

  useEffect(() => {
    track("category_view", { category: category.slug });
    track("page_view", { page: `category:${category.slug}` });
  }, [category.slug]);

  return (
    <>
      <section className="bg-cream pt-8 pb-10 md:pt-12">
        <div className="container-page">
          <nav aria-label="Breadcrumb" className="text-xs font-semibold text-muted-foreground">
            <Link to={isColors ? "/colors" : "/materials"} className="hover:text-foreground">
              {isColors ? "Colors" : "Materials"}
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="text-foreground">{category.name}</span>
          </nav>

          <div className="mt-4 grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-center">
            <div>
              <h1 className="font-display text-[2rem] font-semibold md:text-5xl">
                {category.name}
              </h1>
              <p className="mt-3 max-w-xl text-[1.05rem] text-muted-foreground">
                {category.intro ?? category.description}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <WhatsAppButton
                  label="Ask about this range"
                  message={waMessages.category(category.name)}
                  context={`category:${category.slug}`}
                  block
                  className="sm:w-auto sm:px-6"
                />
                <CallButton
                  context={`category:${category.slug}`}
                  block
                  className="sm:w-auto sm:px-6"
                />
              </div>
            </div>
            <div className="card-soft overflow-hidden">
              <img
                src={category.image}
                alt={category.imageAlt}
                width={1024}
                height={768}
                decoding="async"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <PriceNote />

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-10">
            <h2 className="font-display text-xl font-semibold">
              {isColors ? "Explore more" : "Other materials"}
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {categories
                .filter((c) => c.slug !== category.slug && c.section === category.section)
                .map((c) => (
                  <li key={c.slug}>
                    <Link
                      to="/products/$category"
                      params={{ category: c.slug }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-semibold"
                    >
                      {c.name} <ArrowIcon className="h-3.5 w-3.5" />
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </section>

      {isColors ? <ColorVisualizer /> : null}

      <RequestSection />
      <ContactStrip />
    </>
  );
}
