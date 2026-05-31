"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/shared/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

type MobileNavProps = {
  onNavigate: () => void;
};

function MobileNav({ onNavigate }: MobileNavProps) {
  return (
    <nav aria-label="Mobile" className="flex flex-col gap-3 p-6">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onNavigate}
          className="rounded-2xl border border-border/70 bg-background/80 px-4 py-4 text-lg font-medium text-foreground transition hover:border-primary/40 hover:bg-primary/5"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 32);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        !isHome || isScrolled
          ? "border-border/80 bg-background/95 shadow-sm backdrop-blur"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold text-foreground">
          My App
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "rounded-full px-4",
                  active && "bg-primary/8 text-primary",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="icon-lg"
                className="rounded-full md:hidden"
              />
            }
            aria-label="Open mobile navigation"
          >
            <MenuIcon className="size-5" />
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full max-w-sm border-border/70"
          >
            <SheetHeader className="border-b border-border/70">
              <SheetTitle className="text-3xl">Navigate</SheetTitle>
              <SheetDescription>Browse the site.</SheetDescription>
            </SheetHeader>
            <MobileNav onNavigate={() => setIsOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
