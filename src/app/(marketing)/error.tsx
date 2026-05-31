"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center gap-6 px-4 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-semibold tracking-[0.24em] text-primary uppercase">
        Something went wrong
      </p>
      <h1 className="text-5xl leading-none font-semibold text-foreground">
        We could not load this page right now.
      </h1>
      <p className="text-lg leading-8 text-muted-foreground">
        Try the request again. If it keeps happening, our team should inspect
        the current route.
      </p>
      <Button
        type="button"
        size="lg"
        className="rounded-full px-6"
        onClick={reset}
      >
        Try again
      </Button>
    </div>
  );
}
