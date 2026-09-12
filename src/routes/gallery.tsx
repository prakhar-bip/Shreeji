import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { GalleryGrid } from "@/components/GalleryGrid";
import { SectionHeading } from "@/components/SectionHeading";
import { ContactStrip } from "@/components/HomeSections";
import { business } from "@/data/business";
import { track } from "@/lib/analytics";

const title = `Gallery — Our Shop & Products | ${business.name}`;
const description =
  "Photos of our shop, material displays, plywood and laminate stock, hardware counter and wall colour shades.";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  useEffect(() => track("page_view", { page: "gallery" }), []);

  return (
    <>
      <section className="bg-cream pt-10 pb-10 md:pt-14">
        <div className="container-page">
          <SectionHeading
            eyebrow="Gallery"
            title="Our shop, up close"
            description="Have a look around before you visit — the displays, the stock and the materials we keep."
          />
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <GalleryGrid />
        </div>
      </section>

      <ContactStrip />
    </>
  );
}
