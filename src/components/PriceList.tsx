import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WhatsAppButton } from "@/components/ContactActions";
import { asianPaintsFamilies, asianPaintsShades } from "@/data/asianPaintsShades";
import { waMessages } from "@/lib/whatsapp";

type PriceSection = "paint" | "plywood" | "hardware";

const sections: { id: PriceSection; label: string }[] = [
  { id: "paint", label: "Asian Paints" },
  { id: "plywood", label: "Plywood" },
  { id: "hardware", label: "Hardware" },
];

const PAGE_SIZE = 120;

export function PriceList({ paintOnly = false }: { paintOnly?: boolean }) {
  const [section, setSection] = useState<PriceSection>("paint");
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const matches = useMemo(() => {
    const term = query.trim().toLowerCase();
    return asianPaintsShades.filter(
      (shade) =>
        (family === "all" || shade.family === family) &&
        (!term || shade.name.toLowerCase().includes(term) || shade.code.includes(term)),
    );
  }, [family, query]);

  const selectSection = (next: PriceSection) => {
    setSection(next);
    setQuery("");
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div>
      {paintOnly ? null : (
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
          {sections.map((item) => (
          <Button
            key={item.id}
            type="button"
            variant={section === item.id ? "default" : "outline"}
            onClick={() => selectSection(item.id)}
            aria-pressed={section === item.id}
            className="h-10 shrink-0 rounded-full px-4 font-bold"
          >
            {item.label}
          </Button>
          ))}
        </div>
      )}

      {section === "paint" ? (
        <div className="mt-5">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_14rem]">
            <label>
              <span className="sr-only">Search Asian Paints shades</span>
              <Input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                placeholder="Search shade name or code"
                className="h-11 rounded-lg bg-background px-4"
              />
            </label>
            <label>
              <span className="sr-only">Filter by colour family</span>
              <select
                value={family}
                onChange={(event) => {
                  setFamily(event.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="all">All colour families</option>
                {asianPaintsFamilies.map((name) => (
                  <option key={name} value={name} className="capitalize">
                    {name.replace("-", " ")}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-semibold">Official Asian Paints shades</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {matches.length.toLocaleString("en-IN")} shades found · search by name or code
              </p>
            </div>
            <a
              href="https://www.asianpaints.com/decorpro/shades/colour-catalogues.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-sm font-bold text-clay underline underline-offset-4 sm:block"
            >
              Official catalogue
            </a>
          </div>

          {matches.length ? (
            <ul className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {matches.slice(0, visibleCount).map((shade) => (
                <li key={shade.code} className="overflow-hidden rounded-lg border border-border bg-card">
                  <span
                    aria-hidden="true"
                    className="block aspect-[5/3] w-full border-b border-border"
                    style={{ backgroundColor: shade.hex }}
                  />
                  <div className="p-3">
                    <p className="line-clamp-2 min-h-10 text-sm font-bold leading-snug">{shade.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Code {shade.code}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground">
              No shade matches that search. Try a shorter name or four-digit code.
            </p>
          )}

          {visibleCount < matches.length ? (
            <div className="mt-6 text-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              >
                Show more shades
              </Button>
            </div>
          ) : null}

          <div className="mt-8 border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">
              Shade colours can look different on screens and walls. Visit the shop for a physical
              shade card and ask for the current paint and pack price.
            </p>
            <WhatsAppButton
              label="Ask paint price on WhatsApp"
              message={waMessages.category("Asian Paints shade and pack prices")}
              context="price_list:paint"
              className="mt-4"
            />
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-border bg-card p-5 md:p-7">
          <p className="eyebrow">Current shop prices</p>
          <h2 className="mt-2 font-display text-2xl font-semibold">
            {section === "plywood" ? "Plywood price list" : "Hardware price list"}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            We are preparing this list from the shop’s latest rates. No sample or guessed prices are
            shown. Message us now for the exact brand, size and current selling price.
          </p>
          <WhatsAppButton
            label={`Ask for ${section} prices`}
            message={waMessages.category(`${section} prices, brands and available sizes`)}
            context={`price_list:${section}`}
            className="mt-5"
          />
        </div>
      )}
    </div>
  );
}
