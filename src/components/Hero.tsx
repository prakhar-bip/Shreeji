import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import heroImage from "@/assets/hero-materials.jpg";
import { WhatsAppButton } from "@/components/ContactActions";
import { ArrowIcon } from "@/components/Icons";
import { business } from "@/data/business";
import { waMessages } from "@/lib/whatsapp";

const steps = ["Plywood", "Laminate", "Hardware", "Adhesive", "Colour", "Finished interior"];

/**
 * Hero with a light parallax effect (transform only, rAF-throttled)
 * and floating material chips. No 3D library, no canvas.
 */
export function Hero() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setOffset(Math.min(window.scrollY, 400));
        raf = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-cream pt-6 pb-7 md:pt-16 md:pb-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sand blur-2xl"
        style={{ transform: `translateY(${offset * 0.12}px)` }}
      />
      <div className="container-page relative grid gap-6 md:grid-cols-2 md:items-center md:gap-10">
        <div>
          <p className="eyebrow">{business.tagline}</p>
          <h1 className="mt-2 font-display text-[2rem] leading-[1.08] font-semibold md:mt-3 md:text-6xl">
            {business.name}
          </h1>
          <p className="mt-3 max-w-md text-sm text-muted-foreground md:mt-4 md:text-xl">
            Plywood, mica, hardware, Asian Paints and adhesive at your nearby shop.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:gap-3 md:mt-7">
            <Link to="/products" className="btn btn-primary btn-block sm:w-auto sm:px-7">
              See Products <ArrowIcon className="h-4 w-4" />
            </Link>
            <WhatsAppButton
              message={waMessages.general}
              context="hero"
              block
              className="sm:w-auto sm:px-7"
            />
          </div>

          <ol className="mt-5 hidden flex-wrap items-center gap-x-2 gap-y-2 text-xs font-semibold text-muted-foreground md:flex">
            {steps.map((step, i) => (
              <li key={step} className="flex items-center gap-2">
                <span className="rounded-full border border-border bg-background px-3 py-1.5">
                  {step}
                </span>
                {i < steps.length - 1 ? <span aria-hidden="true">→</span> : null}
              </li>
            ))}
          </ol>
        </div>

        <div className="relative hidden md:block">
          <div
            className="card-soft relative overflow-hidden rounded-3xl"
            style={{ transform: `translateY(${offset * -0.04}px)` }}
          >
            <img
              src={heroImage}
              alt="Plywood, laminate samples, brass handles, hinges, wall paint and adhesive arranged together"
              width={1200}
              height={1200}
              fetchPriority="high"
              decoding="async"
              className="aspect-square w-full object-cover"
            />
          </div>

          <div
            className="float-slow absolute -bottom-4 -left-2 rounded-2xl bg-background/95 px-4 py-3 shadow-lift backdrop-blur-sm md:-left-6"
            style={{ transform: `translateY(${offset * -0.08}px)` }}
          >
            <p className="font-display text-lg font-semibold">6 categories</p>
            <p className="text-xs text-muted-foreground">Everything for one interior job</p>
          </div>

          <div
            className="float-slower absolute -top-3 -right-1 rounded-2xl bg-ink px-4 py-3 text-primary-foreground shadow-lift md:-right-5"
            style={{ transform: `translateY(${offset * 0.06}px)` }}
          >
            <p className="text-xs font-semibold">Open today</p>
            <p className="text-xs opacity-80">{business.hours}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
