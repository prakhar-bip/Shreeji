import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { getProduct, productsByCategory } from "@/data/products";
import { getCategory } from "@/data/categories";
import { business } from "@/data/business";
import { PriceNote } from "@/components/PriceNote";
import { ProductCard } from "@/components/ProductCard";
import { WhatsAppButton, CallButton } from "@/components/ContactActions";
import { ContactStrip } from "@/components/HomeSections";
import { waMessages } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { CameraIcon } from "@/components/Icons";
import { ColorVisualizer } from "@/components/ColorVisualizer";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Product not found" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.product;
    const title = `${p.name} | ${business.name}`;
    const description = `${p.shortDescription} Ask us on WhatsApp for current price and availability.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:url", content: `/product/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/product/${params.slug}` }],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const category = getCategory(product.category);
  const related = productsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  useEffect(() => {
    track("product_view", { product: product.slug, category: product.category });
    track("page_view", { page: `product:${product.slug}` });
  }, [product.slug, product.category]);

  return (
    <>
      <article className="pt-6 pb-4">
        <div className="container-page">
          <nav aria-label="Breadcrumb" className="text-xs font-semibold text-muted-foreground">
            <Link to={category?.section === "colors" ? "/colors" : "/materials"} className="hover:text-foreground">
              {category?.section === "colors" ? "Colors" : "Materials"}
            </Link>
            {category ? (
              <>
                <span aria-hidden="true"> / </span>
                <Link
                  to="/products/$category"
                  params={{ category: category.slug }}
                  className="hover:text-foreground"
                >
                  {category.name}
                </Link>
              </>
            ) : null}
          </nav>

          <div className="mt-4 grid gap-7 md:grid-cols-2 md:gap-10">
            <div className="card-soft overflow-hidden">
              <img
                src={product.image}
                alt={product.imageAlt}
                width={768}
                height={576}
                decoding="async"
                className="aspect-square w-full object-cover"
              />
              <p className="border-t border-border bg-cream px-3 py-2 text-center text-xs text-muted-foreground">
                {product.brand === "Fevicol" ? "Official product image" : "Representative 3D product view"}
              </p>
            </div>

            <div>
              {category ? (
                <p className="eyebrow">{category.name}</p>
              ) : null}
              <h1 className="mt-2 font-display text-[1.9rem] font-semibold md:text-4xl">
                {product.name}
              </h1>
              {product.brand ? (
                <p className="mt-1 text-sm text-muted-foreground">Brand: {product.brand}</p>
              ) : null}
              {product.swatch ? (
                <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold">
                  <span className="h-6 w-6 rounded-full border border-border" style={{ backgroundColor: product.swatch }} aria-hidden="true" />
                  Selected wall shade
                </p>
              ) : null}
              {product.price ? (
                <p className="mt-4 font-display text-xl font-semibold">{product.price}</p>
              ) : null}
              <p className="mt-3 text-[1.02rem] text-muted-foreground">
                {product.description ?? product.shortDescription}
              </p>

              {product.sizes?.length ? (
                <div className="mt-6">
                  <h2 className="text-sm font-bold tracking-wide uppercase">Available sizes</h2>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <li
                        key={size}
                        className="rounded-full border border-border bg-cream px-3.5 py-2 text-sm font-semibold"
                      >
                        {size}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {product.specs?.length ? (
                <div className="mt-6">
                  <h2 className="text-sm font-bold tracking-wide uppercase">Specifications</h2>
                  <dl className="mt-2 divide-y divide-border overflow-hidden rounded-xl border border-border">
                    {product.specs.map((spec) => (
                      <div key={spec.label} className="flex justify-between gap-4 px-4 py-3 text-sm">
                        <dt className="text-muted-foreground">{spec.label}</dt>
                        <dd className="font-semibold">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                {product.swatch ? (
                  <a href="#room-preview" className="btn btn-primary btn-block">
                    <CameraIcon className="h-4 w-4" /> Try in my room
                  </a>
                ) : null}
                <WhatsAppButton
                  label="Ask on WhatsApp"
                  message={waMessages.product(product.name)}
                  context={`product_detail:${product.slug}`}
                  block
                />
                <CallButton context={`product_detail:${product.slug}`} block />
              </div>

              <PriceNote className="mt-4" />
            </div>
          </div>
        </div>
      </article>

      {product.swatch ? <ColorVisualizer initialColorSlug={product.slug} /> : null}

      {related.length ? (
        <section className="section">
          <div className="container-page">
            <h2 className="font-display text-2xl font-semibold">You may also need</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <ContactStrip />
    </>
  );
}
