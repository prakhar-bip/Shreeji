import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import {
  WhatsAppButton,
  CallButton,
  DirectionsButton,
  ProductRequestButton,
} from "@/components/ContactActions";
import { LocationSection } from "@/components/HomeSections";
import { business, fullAddress } from "@/data/business";
import { waMessages } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { ClockIcon, PinIcon, PhoneIcon, ArrowIcon } from "@/components/Icons";
import { ContactForm } from "@/components/ContactForm";

const title = `Contact Us — WhatsApp, Call or Visit | ${business.name}`;
const description = `Message us on WhatsApp, call ${business.phone}, or visit the shop at ${fullAddress}. Open ${business.hours}.`;

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  useEffect(() => track("page_view", { page: "contact" }), []);

  return (
    <>
      <section className="pt-10 pb-6 md:pt-14">
        <div className="container-page">
          <SectionHeading
            eyebrow="Contact"
            title="Talk to us — the quickest way is WhatsApp"
            description="Ask about a product, check if something is in stock, or send a photo of what you need."
          />

          <div className="mt-7 grid max-w-xl gap-3">
            <WhatsAppButton message={waMessages.general} context="contact_page" block />
            <CallButton label="Call Now" context="contact_page" block variant="primary" />
            <DirectionsButton
              label="Visit Our Shop"
              context="contact_page"
              block
              variant="outline"
            />
          </div>

          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            <li className="card-soft p-5">
              <PhoneIcon className="h-5 w-5 text-clay" />
              <h2 className="mt-2 text-sm font-bold tracking-wide uppercase">Phone</h2>
              <p className="mt-1 text-muted-foreground">{business.phone}</p>
            </li>
            <li className="card-soft p-5">
              <ClockIcon className="h-5 w-5 text-clay" />
              <h2 className="mt-2 text-sm font-bold tracking-wide uppercase">Timings</h2>
              <p className="mt-1 text-muted-foreground">
                {business.hours}
                {business.hoursNote ? ` · ${business.hoursNote}` : ""}
              </p>
            </li>
            <li className="card-soft p-5">
              <PinIcon className="h-5 w-5 text-clay" />
              <h2 className="mt-2 text-sm font-bold tracking-wide uppercase">Address</h2>
              <p className="mt-1 text-muted-foreground">{fullAddress}</p>
            </li>
          </ul>
        </div>
      </section>

      <section className="section border-y border-border bg-background">
        <div className="container-page max-w-2xl">
          <SectionHeading eyebrow="Send an inquiry" title="Tell us what you are looking for" description="Leave your number and a short message. We will contact you about price and availability." />
          <ContactForm />
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container-page max-w-2xl">
          <SectionHeading
            eyebrow="Request a product"
            title="Not sure what the product is called?"
            description="Send a photo on WhatsApp and we will tell you what it is, whether we have it, and what it costs."
          />
          <div className="mt-6">
            <ProductRequestButton />
          </div>
          <Link
            to="/products"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-clay"
          >
            Browse products instead <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <LocationSection />
    </>
  );
}
