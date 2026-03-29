"use client";

import AdminOrderPushPanel from "@/components/admin/AdminOrderPushPanel";
import { AdminNavMobile, AdminNavSidebar } from "@/components/admin/AdminNav";
import { useAdminSignOut } from "@/components/admin/hooks/useAdminSignOut";
import Button from "@/components/ui/Button";
import { usePathname } from "next/navigation";

export function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";
  const onSignOut = useAdminSignOut();

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-mobile-vp flex flex-col bg-(--cream) md:flex-row">
      <AdminNavSidebar />

      <div className="flex min-h-mobile-vp min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-(--red-deep)/10 bg-(--cream)/95 px-4 py-3 backdrop-blur-md md:px-8">
          <div className="min-w-0">
            <p className="section-label text-(--red-mid)">Админ-панель</p>
          </div>
          <Button
            variant="outline"
            type="button"
            onClick={() => void onSignOut()}
            className="shrink-0 px-4 py-2 text-sm"
          >
            Выйти
          </Button>
        </header>

        <main className="flex-1 overflow-auto pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
          <div className="border-b border-(--red-deep)/10 bg-(--cream) px-4 py-3 md:px-8">
            <AdminOrderPushPanel />
          </div>
          {children}
        </main>
      </div>

      <AdminNavMobile />
    </div>
  );
}
