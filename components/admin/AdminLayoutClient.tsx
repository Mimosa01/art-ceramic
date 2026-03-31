"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminNavMobile, AdminNavSidebar } from "@/components/admin/AdminNav";
import { useAdminSignOut } from "@/components/admin/hooks/useAdminSignOut";
import Button from "@/components/ui/Button";
import { usePathname } from "next/navigation";

function base64UrlToUint8Array(base64Url: string) {
  // Конвертируем base64url (VAPID public key) в байты, которые ожидает Push API.
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob(base64 + padding);

  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}

export function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";
  const onSignOut = useAdminSignOut();

  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  const [pushLoading, setPushLoading] = useState(false);
  const [pushError, setPushError] = useState<string | null>(null);
  const [pushState, setPushState] = useState<
    "checking" | "unsupported" | "denied" | "not-subscribed" | "subscribed"
  >("checking");

  const canUsePush = useMemo(() => {
    return (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window
    );
  }, []);

  useEffect(() => {
    if (isLogin) return;

    if (!canUsePush) {
      setPushState("unsupported");
      return;
    }

    if (typeof Notification !== "undefined" && Notification.permission === "denied") {
      setPushState("denied");
      return;
    }

    void (async () => {
      setPushError(null);
      setPushLoading(true);

      try {
        // Регистрируем SW один раз — после этого canUsePush проверяет наличие Push API.
        const registration = await navigator.serviceWorker.register("/sw.js");
        const existing = await registration.pushManager.getSubscription();

        if (existing) {
          setPushState("subscribed");
          return;
        }

        if (vapidPublicKey == null || vapidPublicKey === "") {
          throw new Error("VAPID public key не настроен на сервере.");
        }

        if (typeof Notification === "undefined") {
          throw new Error("Notification API недоступен.");
        }

        const permission =
          Notification.permission === "granted"
            ? "granted"
            : await Notification.requestPermission();

        if (permission !== "granted") {
          setPushState("denied");
          return;
        }

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: base64UrlToUint8Array(vapidPublicKey),
        });

        const json = subscription.toJSON() as {
          endpoint: string;
          keys?: { p256dh?: string; auth?: string };
        };

        if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
          throw new Error("Не удалось получить данные подписки.");
        }

        const res = await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subscription: {
              endpoint: json.endpoint,
              keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
            },
          }),
        });

        if (!res.ok) {
          const message = (await res.json().catch(() => null))?.message;
          throw new Error(message || "Не удалось подключить уведомления.");
        }

        setPushState("subscribed");
      } catch {
        setPushState("not-subscribed");
      } finally {
        setPushLoading(false);
      }
    })();
  }, [canUsePush, isLogin, vapidPublicKey]);

  async function ensureRegistration() {
    if (!canUsePush) throw new Error("Push is not supported.");
    return navigator.serviceWorker.register("/sw.js");
  }

  async function handleTogglePush() {
    setPushError(null);
    setPushLoading(true);

    try {
      const registration = await ensureRegistration();

      if (pushState === "subscribed") {
        const subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
          setPushState("not-subscribed");
          return;
        }

        const endpoint = subscription.endpoint;
        // Сначала отписываемся в браузере, затем чистим запись на сервере.
        await subscription.unsubscribe();

        const res = await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint }),
        });

        if (!res.ok) {
          const message = (await res.json().catch(() => null))?.message;
          throw new Error(message || "Не удалось отключить уведомления.");
        }

        setPushState("not-subscribed");
        return;
      }

      if (vapidPublicKey == null || vapidPublicKey === "") {
        throw new Error("VAPID public key не настроен на сервере.");
      }

      if (typeof Notification === "undefined") {
        throw new Error("Notification API недоступен.");
      }

      const permission =
        Notification.permission === "granted"
          ? "granted"
          : await Notification.requestPermission();

      if (permission !== "granted") {
        setPushState("denied");
        return;
      }

      // Если подписки ещё нет — создаём.
      const existing = await registration.pushManager.getSubscription();
      const subscription =
        existing ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: base64UrlToUint8Array(vapidPublicKey),
        }));

      const json = subscription.toJSON() as {
        endpoint: string;
        keys?: { p256dh?: string; auth?: string };
      };

      if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
        throw new Error("Не удалось получить данные подписки.");
      }

      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: {
            endpoint: json.endpoint,
            keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
          },
        }),
      });

      if (!res.ok) {
        const message = (await res.json().catch(() => null))?.message;
        throw new Error(message || "Не удалось подключить уведомления.");
      }

      setPushState("subscribed");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error.";
      setPushError(message);
      setPushState(pushState === "subscribed" ? "subscribed" : "not-subscribed");
    } finally {
      setPushLoading(false);
    }
  }

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-mobile-vp flex flex-col bg-(--cream) md:flex-row">
      <AdminNavSidebar />

      <div className="flex min-h-mobile-vp min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-(--red-deep)/10 bg-(--cream)/95 px-4 py-3 backdrop-blur-md md:px-8">
          <p className="section-label text-(--red-mid)">Админ-панель</p>
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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-(--red-mid)">
                {pushState === "checking" && "Проверяем push-подписку..."}
                {pushState === "unsupported" && "Push-уведомления не поддерживаются в этом браузере."}
                {pushState === "denied" && "Разрешение на уведомления отклонено."}
                {pushState === "not-subscribed" && "Подключите push-уведомления для новых заявок."}
                {pushState === "subscribed" && "Push-уведомления подключены."}
              </div>

              <Button
                variant="outline"
                type="button"
                onClick={() => void handleTogglePush()}
                disabled={pushLoading || pushState === "checking" || pushState === "unsupported"}
                className="shrink-0 px-4 py-2 text-sm"
              >
                {pushLoading
                  ? "Подождите..."
                  : pushState === "subscribed"
                    ? "Отключить уведомления"
                    : "Подключить уведомления"}
              </Button>
            </div>

            {pushError ? (
              <p className="mt-2 text-xs text-(--red-mid)">{pushError}</p>
            ) : null}
          </div>
          {children}
        </main>
      </div>

      <AdminNavMobile />
    </div>
  );
}
