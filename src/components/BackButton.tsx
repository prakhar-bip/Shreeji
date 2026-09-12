import { useRouter, useRouterState } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

export function BackButton() {
  const router = useRouter();
  const routerState = useRouterState();

  // Don't show back button on home page
  if (routerState.location.pathname === "/") {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-6">
      <Button 
        variant="ghost" 
        onClick={() => router.history.back()}
        className="flex items-center gap-2 -ml-4 hover:bg-transparent hover:text-primary"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </Button>
    </div>
  );
}
