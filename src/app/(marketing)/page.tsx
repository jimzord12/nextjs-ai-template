import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Homepage",
  description: "Welcome.",
};

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-24 px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="text-5xl font-semibold leading-none text-foreground">
        Welcome.
      </h1>
      <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
        Replace this placeholder with your own content.
      </p>
    </div>
  );
}
