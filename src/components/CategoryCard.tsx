import { Link } from "@tanstack/react-router";
import type { Category } from "@/data/categories";
import { ArrowIcon } from "@/components/Icons";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      to="/products/$category"
      params={{ category: category.slug }}
      className="card-soft group grid grid-cols-[5.5rem_minmax(0,1fr)] transition-shadow hover:shadow-lift sm:block"
    >
      <div className="h-full min-h-28 overflow-hidden bg-sand sm:aspect-[4/3] sm:min-h-0">
        <img
          src={category.image}
          alt={category.imageAlt}
          width={1024}
          height={768}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="min-w-0 p-3 sm:p-4">
        <h3 className="font-display text-base font-semibold sm:text-lg">{category.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground sm:text-sm">{category.description}</p>
        <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-clay sm:mt-3 sm:text-sm">
          See items <ArrowIcon className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
