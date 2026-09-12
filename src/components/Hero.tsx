import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import shopFrontAsset from "@/assets/shop-front-enhanced.webp";
import shreeLogoAsset from "@/assets/shree-hindi-logo.png";
import asianPaintsLogoAsset from "@/assets/asian-paints-logo.webp";
import { WhatsAppButton } from "@/components/ContactActions";
import { ArrowIcon } from "@/components/Icons";
import { business } from "@/data/business";
import { waMessages } from "@/lib/whatsapp";

const steps = ["Plywood", "Laminate", "Hardware", "Adhesive", "Asian Paints"];

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
    <section className="relative overflow-hidden bg-cream pt-5 pb-7 md:pt-12 md:pb-16">
      <div className="container-page relative grid gap-6 md:grid-cols-2 md:items-center md:gap-10">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <img src={shreeLogoAsset.url} alt="श्री — Shree Ji Enterprises" width={1200} height={608} className="h-16 w-40 object-contain object-left md:h-20 md:w-52" />
            <span className="h-10 w-px bg-border" aria-hidden="true" />
            <div>
              <img src={asianPaintsLogoAsset.url} alt="Asian Paints" width={321} height={63} className="h-7 w-28 object-contain object-left md:h-8 md:w-32" />
              <p className="mt-1 text-[0.65rem] font-bold text-muted-foreground">AVAILABLE HERE</p>
            </div>
          </div>
          <p className="eyebrow">Your local interior materials shop</p>
          <h1 className="mt-2 font-display text-[2rem] leading-[1.08] font-semibold md:mt-3 md:text-6xl">
            {business.name}
          </h1>
          <p className="mt-3 max-w-md text-sm text-muted-foreground md:mt-4 md:text-xl">
            Plywood, mica, hardware and genuine Asian Paints products at your nearby shop.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:gap-3 md:mt-7">
            <Link to="/colors" className="btn btn-primary btn-block sm:w-auto sm:px-7">
              See Colors <ArrowIcon className="h-4 w-4" />
            </Link>
            <Link to="/materials" className="btn btn-outline btn-block sm:w-auto sm:px-7">
              See Materials
            </Link>
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

        <div className="relative">
          <div
            className="card-soft relative overflow-hidden rounded-3xl"
            style={{ transform: `translateY(${offset * -0.04}px)` }}
          >
            <img
              src={shopFrontAsset.url}
              alt="Front of Shree Ji Enterprises shop with Asian Paints Colourworld signage"
              width={1376}
              height={768}
              fetchPriority="high"
              decoding="async"
              className="aspect-[16/9] w-full object-cover"
            />
          </div>

          <div
            className="float-slow absolute -bottom-3 left-2 rounded-xl bg-background/95 px-3 py-2 shadow-lift backdrop-blur-sm md:-left-6 md:px-4 md:py-3"
            style={{ transform: `translateY(${offset * -0.08}px)` }}
          >
            <p className="font-display text-sm font-semibold md:text-lg">Visit our real shop</p>
            <p className="text-[0.68rem] text-muted-foreground md:text-xs">Garoth Road, near ICICI Bank</p>
          </div>

          <div
            className="float-slower absolute -top-2 right-2 rounded-xl bg-asian-red px-3 py-2 text-asian-foreground shadow-lift md:-right-5 md:px-4 md:py-3"
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
