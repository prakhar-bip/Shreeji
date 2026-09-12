import { Link } from "@tanstack/react-router";
import { WhatsAppButton } from "@/components/ContactActions";
import shreeLogoAsset from "@/assets/shree-hindi-logo.png";
import asianPaintsLogoAsset from "@/assets/asian-paints-logo.webp";

const nav = [
  { to: "/colors", label: "Colors" },
  { to: "/materials", label: "Materials" },
  { to: "/gallery", label: "Gallery" },
  { to: "/location", label: "Shop" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-sm">
      <div className="container-page flex h-16 items-center gap-4">
        <Link to="/" aria-label="Shree Ji Enterprises home" className="flex min-w-0 items-center gap-3">
          <img
            src={shreeLogoAsset}
            alt="श्री — Shree Ji Enterprises"
            width={1200}
            height={608}
            className="h-11 w-28 object-contain object-left md:h-12 md:w-36"
          />
          <span className="h-8 w-px bg-border" aria-hidden="true" />
          <img src={asianPaintsLogoAsset} alt="Asian Paints" width={321} height={63} className="h-6 w-24 object-contain md:h-7 md:w-28" />
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
