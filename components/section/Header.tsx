"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import Button from "../ui/Button";
import Logo from "../ui/Logo";
import Nav from "../ui/Nav";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed left-0 right-0 top-0 z-100 box-border flex w-full items-center justify-between gap-6 px-4 md:gap-10 md:px-8 bg-warm-white",
        "pt-[calc(0.5rem+env(safe-area-inset-top))] pb-1",
        "transition-[background-color,backdrop-filter,box-shadow] duration-300",
        scrolled &&
          "bg-[rgba(253,246,240,0.9)] backdrop-blur-lg shadow-[0_1px_0_rgba(132,19,30,0.1)]",
      )}
    >
      <Logo />
      <Nav />
      <Button variant="primary" href="#order">
        Заказать
      </Button>
    </header>
  );
}
