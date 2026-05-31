import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/shared/lib/utils";

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center gap-6 px-4 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-semibold tracking-[0.24em] text-primary uppercase">
        404
      </p>
      <h1 className="text-6xl leading-none font-semibold text-foreground">
        Page not found.
      </h1>
      <p className="max-w-xl text-lg leading-8 text-muted-foreground">
        The page you requested does not exist. Return home and start from there.
      </p>
      <Link
        href="/"
        className={cn(buttonVariants({ size: "lg" }), "rounded-full px-6")}
      >
        Back to home
      </Link>
    </div>
  );
}
