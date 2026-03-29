"use client";

import Link from "next/link";

type NavItemProps = {
  children: string;
  href: string;
}

export function scrollToHashId(hash: string) {
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!id) return;
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export default function NavItem({ children, href }: NavItemProps) {
  const isSamePageHash = href.startsWith("#") && href.length > 1;

  if (isSamePageHash) {
    return (
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault();
          scrollToHashId(href);
        }}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} 
      className="section-label text-red-mid text-[0.78rem] hover:text-crimson-600 transition-colors font-jost uppercase tracking-[.3em]"
    >{children}</Link>
  )
}