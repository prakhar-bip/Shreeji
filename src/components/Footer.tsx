import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { business, fullAddress } from "@/data/business";
import { materialCategories } from "@/data/categories";
import { PinIcon, ClockIcon, PhoneIcon } from "@/components/Icons";

export function Footer() {
  return (
    <footer className="mt-8 border-t border-border bg-cream">
      <div className="container-page grid gap-10 py-12 md:grid-cols-3">
        <div>
          <h2 className="font-display text-xl font-semibold">{business.name}</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            {business.shortDescription}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wide uppercase">Shop</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/colors" className="font-bold text-foreground hover:text-clay">
                Asian Paints Colors
              </Link>
            </li>
            <li>
              <Link to="/materials" className="font-bold text-foreground hover:text-clay">
                Other Materials
              </Link>
            </li>
            {materialCategories.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/products/$category"
                  params={{ category: c.slug }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wide uppercase">Visit us</h3>
          <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-clay" />
              <span>{fullAddress}</span>
            </li>
            <li className="flex gap-2">
              <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-clay" />
              <span>
                {business.hours}
                {business.hoursNote ? ` · ${business.hoursNote}` : ""}
              </span>
            </li>
            <li className="flex gap-2">
              <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-clay" />
              <span>{business.phone}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70 py-6 text-xs text-muted-foreground">
        <div className="container-page flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} {business.name}. Prices and availability may vary — please contact us for current details.
          </p>

          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/95 px-4 py-2 shadow-sm transition-all hover:scale-105 hover:border-primary/50">
            <Sparkles className="h-4 w-4 text-primary animate-pulse shrink-0" />
            <span className="text-xs font-medium text-foreground">
              Created by <strong className="font-bold tracking-wide text-primary text-sm">saarthi.AI</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="h-20 md:hidden" aria-hidden="true" />
    </footer>
  );
}
