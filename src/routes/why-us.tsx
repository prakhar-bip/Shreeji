import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { WhyUsSection, ReviewsSection, ContactStrip } from "@/components/HomeSections";
import { SectionHeading } from "@/components/SectionHeading";
import { business } from "@/data/business";
import { track } from "@/lib/analytics";
import interiorAsset from "@/assets/shop-hardware-interior-enhanced.webp";

const title = `Why Choose Us | ${business.name}`;
const description =
  "A wide variety of interior materials, trusted brands, custom requirements and helpful service from a local shop you can walk into.";

export const Route = createFileRoute("/why-us")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/why-us" },
    ],
    links: [{ rel: "canonical", href: "/why-us" }],
  }),
  component: WhyUsPage,
});

function WhyUsPage() {
  useEffect(() => track("page_view", { page: "why-us" }), []);

  return (
    <>
      <section className="pt-10 pb-4 md:pt-14">
        <div className="container-page grid gap-8 md:grid-cols-2 md:items-center">
          <SectionHeading
            eyebrow="About the shop"
            title="Materials, advice and a shop you can walk into"
            description="We stock what carpenters, contractors and homeowners in the area actually use, and we are happy to explain the difference between the options."
          />
          <div className="card-soft overflow-hidden">
            <img
              src={interiorAsset}
              alt="Furniture hardware and Asian Paints products stocked inside Shree Jee Enterprises"
              width={1376}
              height={768}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <WhyUsSection />
      <ReviewsSection />
      <ContactStrip />
    </>
  );
}
