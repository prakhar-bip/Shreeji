import { Link } from "@tanstack/react-router";
import { business } from "@/data/business";
import { WhatsAppButton } from "@/components/ContactActions";
import { SELogo } from "./Logo";

const nav = [
  { to: "/products", label: "Products" },
  { to: "/gallery", label: "Gallery" },
  { to: "/why-us", label: "Why Us" },
  { to: "/location", label: "Shop" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-sm">
      <div className="container-page flex h-16 items-center gap-4">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <SELogo className="h-10 w-10 shrink-0" />
          <span className="min-w-0">
            <span className="block truncate font-display text-[1.05rem] leading-tight font-semibold">
              {business.name}
            </span>
            <span className="block truncate text-[0.7rem] tracking-wide text-muted-foreground uppercase">
              {business.tagline}
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
          <WhatsAppButton label="WhatsApp" className="h-11 min-h-11 text-sm" context="header" />
        </nav>
      </div>
    </header>
  );
}
