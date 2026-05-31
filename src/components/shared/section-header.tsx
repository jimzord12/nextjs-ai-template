import { cn } from "@/shared/lib/utils";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-2xl space-y-4",
        align === "center" && "mx-auto text-center",
      )}
    >
      <p className="text-sm font-semibold tracking-[0.24em] text-primary uppercase">
        {eyebrow}
      </p>
      <h2 className="text-4xl leading-none font-semibold text-foreground sm:text-5xl">
        {title}
      </h2>
      <p className="text-base leading-7 text-muted-foreground sm:text-lg">
        {description}
      </p>
    </div>
  );
}
