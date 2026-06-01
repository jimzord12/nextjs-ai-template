import React from "react";

const Link = ({
  href,
  children,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href?: string;
}) => {
  return (
    <a href={typeof href === "string" ? href : "#"} {...rest}>
      {children}
    </a>
  );
};

function useRouter() {
  return {
    push: () => {},
    replace: () => {},
    back: () => {},
    prefetch: () => {},
    pathname: "/",
    query: {},
    asPath: "/",
    locale: "en",
  };
}

function usePathname() {
  return "/";
}

function useSearchParams() {
  return new URLSearchParams();
}

export { Link, useRouter, usePathname, useSearchParams };
