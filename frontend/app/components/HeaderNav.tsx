"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const inactiveClass =
  "rounded-full px-4 py-2 text-white/90 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/70";

const activeClass =
  "rounded-full bg-brand-gold px-4 py-2 text-brand-purple transition-colors hover:bg-[#f2c400] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function HeaderNav() {
  const pathname = usePathname();

  const items = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
  ] as const;

  return (
    <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold">
      {items.map(({ href, label }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            className={active ? activeClass : inactiveClass}
            aria-current={active ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
