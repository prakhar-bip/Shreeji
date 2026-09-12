import { useMemo, useState } from "react";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export function InventorySearch() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const results = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return products.filter((product) => {
      if (category !== "all" && product.category !== category) return false;
      if (!needle) return true;
      const haystack = [
        product.name,
        product.brand,
        product.shortDescription,
        product.description,
        ...(product.sizes ?? []),
        ...(product.specs?.flatMap((spec) => [spec.label, spec.value]) ?? []),
      ].filter(Boolean).join(" ").toLocaleLowerCase();
      return haystack.includes(needle);
    });
  }, [category, query]);

  return (
    <div className="mt-6">
      <label htmlFor="inventory-search" className="sr-only">Search inventory</label>
      <input
        id="inventory-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search product, brand or size"
        className="min-h-11 w-full rounded-md border border-input bg-background px-4 text-base outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
      />
      <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:px-0">
        {[{ slug: "all", name: "All" }, ...categories].map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => setCategory(item.slug)}
            aria-pressed={category === item.slug}
            className={`min-h-10 shrink-0 rounded-full border px-3 text-sm font-bold ${category === item.slug ? "border-ink bg-ink text-primary-foreground" : "border-border bg-background"}`}
          >
            {item.name}
          </button>
        ))}
      </div>
      <p className="mt-2 text-sm text-muted-foreground" aria-live="polite">{results.length} {results.length === 1 ? "product" : "products"}</p>
      {results.length ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="mt-6 border-t border-border py-10 text-center">
          <h2 className="text-xl">No matching product</h2>
          <p className="mt-2 text-sm text-muted-foreground">Try another name, brand, category, or size.</p>
        </div>
      )}
    </div>
  );
}
