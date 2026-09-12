import { useRef, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { submitContactInquiry } from "@/lib/contact-inquiries.functions";

const fieldClass =
  "mt-1.5 min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base outline-none focus:border-ring focus:ring-2 focus:ring-ring/20";

export function ContactForm() {
  const submitInquiry = useServerFn(submitContactInquiry);
  const startedAt = useRef(Date.now());
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    setStatus("sending");
    setError("");
    try {
      await submitInquiry({
        data: {
          name: String(values.get("name") ?? ""),
          phone: String(values.get("phone") ?? ""),
          message: String(values.get("message") ?? ""),
          website: String(values.get("website") ?? ""),
          sourcePage: window.location.pathname,
          startedAt: startedAt.current,
        },
      });
      form.reset();
      setStatus("sent");
    } catch (cause) {
      setStatus("idle");
      setError(cause instanceof Error ? cause.message : "Your inquiry could not be sent.");
    }
  };

  if (status === "sent") {
    return (
      <div className="rounded-md border border-olive/40 bg-background p-5" role="status">
        <h3 className="text-xl">Inquiry received</h3>
        <p className="mt-2 text-sm text-muted-foreground">We have saved your message and will contact you soon.</p>
        <Button className="mt-4" variant="outline" onClick={() => { startedAt.current = Date.now(); setStatus("idle"); }}>
          Send another inquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="mt-6 grid gap-4" noValidate>
      <div className="hidden" aria-hidden="true">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <label className="text-sm font-bold">Your name
        <input className={fieldClass} name="name" autoComplete="name" minLength={2} maxLength={100} required />
      </label>
      <label className="text-sm font-bold">Phone or WhatsApp number
        <input className={fieldClass} name="phone" type="tel" inputMode="tel" autoComplete="tel" minLength={7} maxLength={20} required />
      </label>
      <label className="text-sm font-bold">What do you need?
        <textarea className={`${fieldClass} min-h-28 resize-y`} name="message" minLength={5} maxLength={1000} required />
      </label>
      {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
      <Button type="submit" size="lg" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send inquiry"}
      </Button>
      <p className="text-xs text-muted-foreground">By sending, you agree that we may contact you about this inquiry.</p>
    </form>
  );
}