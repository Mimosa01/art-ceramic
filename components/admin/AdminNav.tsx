"use client";

import clsx from "clsx";
import { ClipboardList, Images, Mail } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin/gallery" as const, label: "Галерея", icon: Images },
  { href: "/admin" as const, label: "Заявки", icon: ClipboardList },
  { href: "/admin/mailing" as const, label: "Рассылка", icon: Mail },
] as const;

function linkClassName(isActive: boolean) {
  return clsx(
    "flex min-h-[3.25rem] flex-1 flex-col items-center gap-1 transition-colors md:min-h-0 md:flex-none md:flex-row md:gap-3 md:rounded-lg md:px-3 md:py-2.5 md:text-[0.95rem]",
    isActive
      ? "text-red-mid md:bg-[rgba(193,14,30,0.08)]"
      : "text-red-deep/55 md:text-red-deep/80 hover:text-red-deep md:hover:bg-black/[0.04]",
  );
}

function isPathActive(pathname: string, href: string) {
  return pathname === href || pathname == (`${href}`);
}

function NavLinks({
  iconSize,
  labelClassName,
}: {
  iconSize: "sm" | "md";
  labelClassName?: string;
}) {
  const pathname = usePathname();
  const iconCls = iconSize === "md" ? "h-6 w-6" : "h-5 w-5";

  return (
    <>
      {items.map(({ href, label, icon: Icon }) => {
        const isActive = isPathActive(pathname, href);
        return (
          <Link key={href} href={href} className={linkClassName(isActive)}>
            <Icon className={clsx(iconCls, "shrink-0 opacity-90")} aria-hidden />
            <span
              className={
                labelClassName ??
                "text-center text-[0.65rem] font-medium leading-tight tracking-wide"
              }
            >
              {label}
            </span>
          </Link>
        );
      })}
    </>
  );
}

/** Нижняя панель на мобильных */
export function AdminNavMobile() {
  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-50 flex border-t border-red-deep/15 bg-cream/95 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_24px_rgba(72,4,11,0.06)] backdrop-blur-md md:hidden"
      aria-label="Разделы админки"
    >
      <NavLinks iconSize="md" />
    </nav>
  );
}

/** Боковое меню на md+ */
export function AdminNavSidebar() {
  return (
    <nav
      className="hidden shrink-0 border-red-deep/12 md:flex md:w-56 md:flex-col md:gap-1 md:border-r md:px-3 md:py-6"
      aria-label="Разделы админки"
    >
      <p className="section-label mb-3 px-3 text-red-mid">Разделы</p>
      <NavLinks iconSize="sm" labelClassName="md:text-[0.95rem]" />
    </nav>
  );
}
