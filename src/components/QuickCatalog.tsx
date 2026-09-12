import { useState } from "react";
import { categories } from "@/data/categories";
import { productsByCategory } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export function QuickCatalog() {
  const [selected, setSelected] = useState(categories[0]?.slug ?? "");
  const items = productsByCategory(selected);

  return (
    <div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 md:mx-0 md:flex-wrap md:px-0">
        {categories.map((category) => (
          <button
            key={category.slug}
            type="button"
            onClick={() => setSelected(category.slug)}
            aria-pressed={selected === category.slug}
            className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-bold ${
              selected === category.slug
                ? "border-ink bg-ink text-primary-foreground"
                : "border-border bg-background text-foreground"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}