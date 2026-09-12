import { business, phoneHref } from "@/data/business";
import { track } from "@/lib/analytics";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { WhatsAppIcon, PhoneIcon, PinIcon, CameraIcon } from "@/components/Icons";

type Common = { className?: string; label?: string; block?: boolean };

/**
 * Reusable WhatsApp CTA. Pass a contextual `message`
 * (see waMessages in src/lib/whatsapp.ts).
 */
export function WhatsAppButton({
  message = waMessages.general,
  label = "Chat on WhatsApp",
  context = "general",
  className = "",
  block,
  variant = "whatsapp",
}: Common & {
  message?: string;
  context?: string;
  variant?: "whatsapp" | "outline";
}) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("whatsapp_click", { context })}
      className={`btn ${variant === "whatsapp" ? "btn-whatsapp" : "btn-outline"} ${
        block ? "btn-block" : ""
      } ${className}`}
    >
      <WhatsAppIcon className="h-5 w-5 shrink-0" />
      <span>{label}</span>
    </a>
  );
}

export function CallButton({
  label = "Call Now",
  className = "",
  block,
  context = "general",
  variant = "outline",
}: Common & { context?: string; variant?: "outline" | "primary" }) {
  return (
    <a
      href={phoneHref}
      onClick={() => track("phone_click", { context })}
      className={`btn ${variant === "primary" ? "btn-primary" : "btn-outline"} ${
        block ? "btn-block" : ""
      } ${className}`}
    >
      <PhoneIcon className="h-5 w-5 shrink-0" />
      <span>{label}</span>
    </a>
  );
}

export function DirectionsButton({
  label = "Get Directions",
  className = "",
  block,
  context = "general",
  variant = "primary",
}: Common & { context?: string; variant?: "primary" | "outline" }) {
  return (
    <a
      href={business.mapsLink}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("directions_click", { context })}
      className={`btn ${variant === "primary" ? "btn-primary" : "btn-outline"} ${
        block ? "btn-block" : ""
      } ${className}`}
    >
      <PinIcon className="h-5 w-5 shrink-0" />
      <span>{label}</span>
    </a>
  );
}

/** "Send us a photo of what you need" CTA. */
export function ProductRequestButton({
  label = "Send Product Photo on WhatsApp",
  className = "",
  block = true,
}: Common) {
  return (
    <a
      href={whatsappLink(waMessages.request)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        track("product_request_click");
        track("whatsapp_click", { context: "product_request" });
      }}
      className={`btn btn-whatsapp ${block ? "btn-block" : ""} ${className}`}
    >
      <CameraIcon className="h-5 w-5 shrink-0" />
      <span>{label}</span>
    </a>
  );
}

/** Floating WhatsApp bubble, sits above the mobile bottom nav. */
export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink(waMessages.general)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("whatsapp_click", { context: "float" })}
      aria-label="Chat with us on WhatsApp"
      className="fixed right-4 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-40 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lift active:scale-95 md:bottom-6"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
