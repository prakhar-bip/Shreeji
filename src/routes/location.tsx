import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { LocationSection, ContactStrip } from "@/components/HomeSections";
import { SectionHeading } from "@/components/SectionHeading";
import { DirectionsButton, CallButton, WhatsAppButton } from "@/components/ContactActions";
import { business, fullAddress } from "@/data/business";
import { waMessages } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import exteriorAsset from "@/assets/shop-front-enhanced.webp";

const title = `Shop Location & Timings | ${business.name}`;
const description = `Find us at ${fullAddress}. Open ${business.hours}. Get directions, call, or message us on WhatsApp before you visit.`;

export const Route = createFileRoute("/location")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/location" },
    ],
    links: [{ rel: "canonical", href: "/location" }],
  }),
  component: LocationPage,
});

function LocationPage() {
  useEffect(() => track("page_view", { page: "location" }), []);

  return (
    <>
      <section className="pt-10 pb-2 md:pt-14">
        <div className="container-page">
          <SectionHeading
            eyebrow="Shop location"
            title="Where to find us"
            description={`${fullAddress} · Open ${business.hours}`}
          />
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <DirectionsButton context="location_page" block className="sm:w-auto sm:px-6" />
            <CallButton context="location_page" block className="sm:w-auto sm:px-6" />
            <WhatsAppButton
              label="Message before visiting"
              message={waMessages.visit}
              context="location_page"
              variant="outline"
              block
              className="sm:w-auto sm:px-6"
            />
          </div>
          <div className="card-soft mt-8 overflow-hidden">
            <img
              src={exteriorAsset.url}
              alt="Front of Shree Ji Enterprises with Asian Paints Colourworld signage"
              width={1376}
              height={768}
              loading="lazy"
              decoding="async"
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <LocationSection />
      <ContactStrip />
    </>
  );
}
