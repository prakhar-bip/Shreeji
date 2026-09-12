import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/products";
import { getCategory } from "@/data/categories";
import { WhatsAppButton } from "@/components/ContactActions";
import { waMessages } from "@/lib/whatsapp";

export function ProductCard({ product }: { product: Product }) {
  const category = getCategory(product.category);

  return (
    <article className="card-soft grid grid-cols-[6.5rem_minmax(0,1fr)] sm:flex sm:flex-col">
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="block h-full min-h-36 overflow-hidden bg-sand sm:aspect-[4/3] sm:min-h-0"
      >
        {product.swatch ? (
          <span
            aria-hidden="true"
            className="block h-full w-full"
            style={{ backgroundColor: product.swatch }}
          />
        ) : (
          <img
            src={product.image}
            alt={product.imageAlt}
            width={1024}
            height={768}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col p-3.5 sm:p-4">
        {category ? (
          <span className="text-[0.7rem] font-bold tracking-wider text-muted-foreground uppercase">
            {category.name}
          </span>
        ) : null}
        <h3 className="mt-1 font-display text-base leading-snug font-semibold sm:text-lg">
          <Link to="/product/$slug" params={{ slug: product.slug }}>
            {product.name}
          </Link>
        </h3>
        {product.brand ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{product.brand}</p>
        ) : null}
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground sm:mt-2 sm:text-sm">
          {product.shortDescription}
        </p>
        {product.price ? (
          <p className="mt-2 text-xs font-bold text-foreground sm:mt-3 sm:text-sm">{product.price}</p>
        ) : null}

        <div className="mt-auto pt-3">
          <WhatsAppButton
            label="Ask on WhatsApp"
            message={waMessages.product(product.name)}
            context={`product:${product.slug}`}
            block
          />
        </div>
      </div>
    </article>
  );
}
