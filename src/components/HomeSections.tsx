import { Link } from "@tanstack/react-router";
import { business, fullAddress } from "@/data/business";
import { reviews, hasPlaceholderReviews } from "@/data/reviews";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import {
  CallButton,
  DirectionsButton,
  ProductRequestButton,
  WhatsAppButton,
} from "@/components/ContactActions";
import { CheckIcon, ClockIcon, PinIcon, StarIcon, ArrowIcon } from "@/components/Icons";
import { waMessages } from "@/lib/whatsapp";

/* ── Why choose us ─────────────────────────────────────────── */

const reasons = [
  {
    title: "Wide Variety",
    text: "Plywood, laminates, hardware, Asian Paints colors and adhesives under one roof — fewer trips for your job.",
  },
  {
    title: "Quality Products",
    text: "Materials we are comfortable recommending, in the grades and finishes people actually ask for.",
  },
  {
    title: "Trusted Brands",
    text: "Genuine Asian Paints products alongside dependable furniture and hardware materials.",
  },
  {
    title: "Local & Convenient",
    text: "A short trip away, with easy parking and quick answers on WhatsApp before you come.",
  },
  {
    title: "Custom Requirements",
    text: "Need a specific size, shade or fitting? Tell us and we will try to arrange it for you.",
  },
  {
    title: "Helpful Service",
    text: "Carpenters, contractors and homeowners all get a straight answer about what suits the work.",
  },
];

export function WhyUsSection() {
  return (
    <section className="section bg-cream">
      <div className="container-page">
        <SectionHeading
          eyebrow="Why choose us"
          title="A local shop that makes your job easier"
          description="We keep the everyday interior materials in stock and help you pick what fits the work and the budget."
        />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <Reveal as="li" key={r.title} delay={i * 60} className="card-soft p-5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-olive/10 text-olive">
                <CheckIcon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold">{r.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{r.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── Reviews ───────────────────────────────────────────────── */

export function ReviewsSection() {
  return (
    <section className="section">
      <div className="container-page">
        <SectionHeading
          eyebrow="Customer reviews"
          title="What customers say"
          {...(hasPlaceholderReviews
            ? {
                description:
                  "Sample entries shown below — real customer reviews will replace these.",
              }
            : {})}
        />
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {reviews.map((review, i) => (
            <Reveal as="li" key={review.id} delay={i * 70} className="card-soft p-5">
              <div className="flex items-center gap-1 text-clay" aria-label={`${review.rating} out of 5`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <StarIcon key={n} className="h-4 w-4" filled={n <= review.rating} />
                ))}
              </div>
              <p className="mt-3 text-[0.95rem]">“{review.text}”</p>
              <p className="mt-4 text-sm font-bold">
                {review.name}
                {review.isPlaceholder ? (
                  <span className="ml-2 rounded-full bg-sand px-2 py-0.5 text-[0.65rem] font-bold tracking-wide uppercase">
                    Sample
                  </span>
                ) : null}
              </p>
              {review.type ? (
                <p className="text-xs text-muted-foreground">{review.type}</p>
              ) : null}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── Request a product ─────────────────────────────────────── */

export function RequestSection() {
  return (
    <section id="request" className="section bg-ink text-primary-foreground">
      <div className="container-page max-w-3xl text-center">
        <p className="eyebrow text-sand">Request a product</p>
        <h2 className="mt-2 font-display text-[1.75rem] font-semibold md:text-4xl">
          Can’t find what you’re looking for?
        </h2>
        <p className="mt-3 text-[1.05rem] opacity-85">
          Send us a photo of the product you need and we’ll help you find it — you don’t need to
          know the brand or the exact name.
        </p>
        <div className="mx-auto mt-7 flex max-w-sm flex-col gap-3">
          <ProductRequestButton />
          <CallButton label="Or call the shop" context="request" block variant="outline" className="border-white/30 !text-primary-foreground" />
        </div>
      </div>
    </section>
  );
}

/* ── Shop location ─────────────────────────────────────────── */

export function LocationSection({ withMap = true }: { withMap?: boolean }) {
  return (
    <section className="section bg-cream">
      <div className="container-page grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <SectionHeading
            eyebrow="Shop location"
            title="Visit our shop"
            description="Come and see the laminate catalogues, shade cards and board samples in person."
          />
          <ul className="mt-6 space-y-4 text-[0.975rem]">
            <li className="flex gap-3">
              <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-clay" />
              <span>{fullAddress}</span>
            </li>
            <li className="flex gap-3">
              <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-clay" />
              <span>
                {business.hours}
                {business.hoursNote ? ` · ${business.hoursNote}` : ""}
              </span>
            </li>
          </ul>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <DirectionsButton context="location_section" block className="sm:w-auto sm:px-6" />
            <CallButton context="location_section" block className="sm:w-auto sm:px-6" />
          </div>
        </div>

        {withMap ? (
          <div className="card-soft overflow-hidden">
            {business.mapsEmbedUrl ? (
              <iframe
                title={`Map showing ${business.name}`}
                src={business.mapsEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="aspect-[4/3] w-full border-0"
              />
            ) : (
              <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 bg-sand p-6 text-center">
                <PinIcon className="h-8 w-8 text-clay" />
                <p className="text-sm text-muted-foreground">
                  Map placeholder — add your Google Maps embed link in{" "}
                  <code className="rounded bg-background px-1.5 py-0.5 text-xs">
                    src/data/business.ts
                  </code>
                </p>
                <DirectionsButton label="Open in Google Maps" context="map_placeholder" />
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* ── Bottom contact strip ──────────────────────────────────── */

export function ContactStrip() {
  return (
    <section className="section">
      <div className="container-page">
        <div className="card-soft grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <h2 className="font-display text-2xl font-semibold md:text-3xl">
              Have a question about a product?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Message us on WhatsApp, call the shop, or come and see the materials yourself.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:w-64">
            <WhatsAppButton message={waMessages.general} context="contact_strip" block />
            <CallButton context="contact_strip" block />
            <Link to="/location" className="btn btn-outline btn-block">
              Visit Our Shop <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
