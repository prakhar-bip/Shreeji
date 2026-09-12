import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { business } from "@/data/business";
import { Button } from "@/components/ui/button";

const title = `Owner sign in | ${business.name}`;
const description = "Private owner sign-in for visitor reports.";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>();
  const [working, setWorking] = useState(false);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email === "prakharbatwal98@gmail.com") void navigate({ to: "/reports" });
    });
  }, [navigate]);

  const signIn = async () => {
    setWorking(true);
    setError(undefined);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
      extraParams: { login_hint: "prakharbatwal98@gmail.com", prompt: "select_account" },
    });
    if (result.error) {
      setError(result.error.message);
      setWorking(false);
      return;
    }
    if (!result.redirected) void navigate({ to: "/reports" });
  };

  return (
    <section className="section min-h-[70vh] bg-cream">
      <div className="container-page flex justify-center">
        <div className="w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-soft">
          <p className="eyebrow">Private reports</p>
          <h1 className="mt-2 text-3xl">Owner sign in</h1>
          <p className="mt-3 text-sm text-muted-foreground">Sign in with the approved Google account to view visitor numbers.</p>
          <Button type="button" className="mt-6 w-full" onClick={() => void signIn()} disabled={working}>
            {working ? "Opening Google…" : "Continue with Google"}
          </Button>
          {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
        </div>
      </div>
    </section>
  );
}
