import { Link, useLocation, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { BackIcon } from "@/components/Icons";

export function BackButton() {
  const { pathname } = useLocation();
  const router = useRouter();

  if (pathname === "/") return null;

  const goBack = () => {
    if (window.history.length > 1) {
      router.history.back();
      return;
    }
    void router.navigate({ to: "/" });
  };

  return (
    <div className="border-b border-border/70 bg-background">
      <div className="container-page flex h-10 items-center">
        <Button type="button" variant="ghost" size="sm" onClick={goBack} className="-ml-2 gap-1.5 text-muted-foreground">
          <BackIcon className="h-4 w-4" /> Back
        </Button>
        <Link to="/" className="ml-auto text-xs font-semibold text-muted-foreground hover:text-foreground">
          Home
        </Link>
      </div>
    </div>
  );
}