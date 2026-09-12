import { Link } from "@tanstack/react-router";
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

      <div className="container-page border-t border-border/70 py-6 pb-28 text-xs text-muted-foreground md:pb-6">
        © {new Date().getFullYear()} {business.name}. Prices and availability may vary — please
        contact us for current details.
      </div>
    </footer>
  );
}
