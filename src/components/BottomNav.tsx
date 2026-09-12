import { Link } from "@tanstack/react-router";
import type { ReactElement } from "react";
import { HomeIcon, GridIcon, ImageIcon, PinIcon, ChatIcon } from "@/components/Icons";

const items: {
  to: "/" | "/products" | "/gallery" | "/location" | "/contact";
  label: string;
  Icon: (props: { className?: string }) => ReactElement;
  exact?: boolean;
}[] = [
  { to: "/", label: "Home", Icon: HomeIcon, exact: true },
  { to: "/products", label: "Products", Icon: GridIcon },
  { to: "/gallery", label: "Gallery", Icon: ImageIcon },
  { to: "/location", label: "Shop", Icon: PinIcon },
  { to: "/contact", label: "Contact", Icon: ChatIcon },
];

/** Fixed mobile navigation — thumb-friendly, hidden on desktop. */
export function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden"
    >
      <ul className="grid grid-cols-5">
        {items.map(({ to, label, Icon, exact }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact: Boolean(exact) }}
              activeProps={{ className: "text-clay" }}
              className="flex min-h-[3.75rem] flex-col items-center justify-center gap-1 text-muted-foreground"
            >
              <Icon className="h-[1.35rem] w-[1.35rem]" />
              <span className="text-[0.7rem] font-semibold">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
