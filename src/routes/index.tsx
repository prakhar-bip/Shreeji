import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { GalleryGrid } from "@/components/GalleryGrid";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import {
  WhyUsSection,
  ReviewsSection,
  RequestSection,
  LocationSection,
  ContactStrip,
} from "@/components/HomeSections";
import { featuredProducts } from "@/data/products";
import { galleryItems } from "@/data/gallery";
import { business, fullAddress } from "@/data/business";
import { track } from "@/lib/analytics";
import { ArrowIcon } from "@/components/Icons";
import { QuickCatalog } from "@/components/QuickCatalog";

const title = `${business.name} — Plywood, Mica, Hardware & Wall Colors`;
const description = business.shortDescription;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HardwareStore",
          name: business.name,
          description,
          telephone: `+${business.countryCode}${business.phone}`,
          address: { "@type": "PostalAddress", streetAddress: fullAddress },
          openingHours: business.hours,
          hasMap: business.mapsLink,
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  useEffect(() => track("page_view", { page: "home" }), []);

  return (
    <>
      <Hero />

      <section className="section">
        <div className="container-page">
          <SectionHeading eyebrow="Shop products" title="Tap a type to see items" />
          <div className="mt-5"><QuickCatalog /></div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container-page">
          <SectionHeading
            eyebrow="Popular items"
            title="Frequently asked for at the counter"
            description="Ask about any item on WhatsApp and we will confirm the current price and stock."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8">
            <Link to="/products" className="btn btn-primary btn-block sm:w-auto sm:px-7">
              See all products <ArrowIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <WhyUsSection />

      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="Gallery"
            title="A look at the shop"
            description="Our shop, the material displays and the products on our shelves."
          />
          <div className="mt-8">
            <GalleryGrid items={galleryItems.slice(0, 6)} />
          </div>
          <div className="mt-6">
            <Link to="/gallery" className="btn btn-outline btn-block sm:w-auto sm:px-7">
              View full gallery
            </Link>
          </div>
        </div>
      </section>

      <ReviewsSection />
      <RequestSection />
      <LocationSection />
      <ContactStrip />
    </>
  );
}
