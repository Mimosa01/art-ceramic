"use client";

import { useCallback, useEffect, useState } from "react";

type PermissionState = NotificationPermission | "unsupported";

const SW_URL = "/sw.js";
const SW_SCOPE = "/admin";
const NOTIFICATION_ICON = "/images/iza.webp";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replaceAll("-", "+").replaceAll("_", "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function ensureServiceWorkerRegistration(): Promise<ServiceWorkerRegistration> {
  const reg = await navigator.serviceWorker.register(SW_URL, {
    scope: SW_SCOPE,
  });
  await navigator.serviceWorker.ready;
  return reg;
}

async function fetchPushApi(
  path: string,
  body: Record<string, unknown>,
): Promise<{ ok: boolean; message?: string }> {
  const response = await fetch(path, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    throw new Error(
      response.status === 404
        ? "Маршрут API не найден. Проверьте деплой и путь /api/push."
        : `Ошибка сервера (${response.status}).`,
    );
  }

  return (await response.json()) as { ok: boolean; message?: string };
}

export function usePushNotifications() {
  const [permission, setPermission] = useState<PermissionState>("unsupported");
  const [hydrated, setHydrated] = useState(false);
  const [supported, setSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const canUsePush =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;
    setSupported(canUsePush);
    setHydrated(true);
  }, []);

  const refreshSubscriptionState = useCallback(async () => {
    if (!supported) return;
    try {
      await ensureServiceWorkerRegistration();
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(Boolean(subscription));
    } catch {
      setIsSubscribed(false);
    }
  }, [supported]);

  useEffect(() => {
    if (!hydrated || !supported) {
      setPermission("unsupported");
      return;
    }
    setPermission(Notification.permission);
    void refreshSubscriptionState();
  }, [hydrated, supported, refreshSubscriptionState]);

  const subscribe = useCallback(async () => {
    if (!supported) {
      setMessage("Push-уведомления не поддерживаются.");
      return;
    }

    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) {
      setMessage("Не задан NEXT_PUBLIC_VAPID_PUBLIC_KEY.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const isIOS = /iPad|iPhone|iPod/.test(window.navigator.userAgent);
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as Navigator & { standalone?: boolean }).standalone ===
          true;
      if (isIOS && !isStandalone) {
        setMessage(
          "На iOS push работает только после «Добавить на экран Домой» и открытия установленного приложения.",
        );
        return;
      }

      await ensureServiceWorkerRegistration();
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);

      if (permissionResult !== "granted") {
        setMessage("Разрешение на уведомления не выдано.");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        });
      } else {
        try {
          await fetchPushApi("/api/push/unsubscribe", {
            endpoint: subscription.endpoint,
          });
        } catch {
          // best-effort
        }
        await subscription.unsubscribe();
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        });
      }

      const result = await fetchPushApi("/api/push/subscribe", {
        subscription: subscription.toJSON(),
      });

      if (!result.ok) {
        throw new Error(result.message ?? "Ошибка подписки.");
      }

      setIsSubscribed(true);
      setMessage("Push-уведомления включены.");
    } catch (error) {
      const text = error instanceof Error ? error.message : "Не удалось включить push.";
      setMessage(text);
    } finally {
      setLoading(false);
    }
  }, [supported]);

  const unsubscribe = useCallback(async () => {
    if (!supported) return;

    setLoading(true);
    setMessage(null);

    try {
      await ensureServiceWorkerRegistration();
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await fetchPushApi("/api/push/unsubscribe", {
          endpoint: subscription.endpoint,
        });
        await subscription.unsubscribe();
      }

      setIsSubscribed(false);
      setMessage("Push-уведомления отключены.");
    } catch (error) {
      const text = error instanceof Error ? error.message : "Не удалось отключить push.";
      setMessage(text);
    } finally {
      setLoading(false);
    }
  }, [supported]);

  const testNotification = useCallback(async () => {
    if (!supported) {
      setMessage("Push-уведомления не поддерживаются.");
      return;
    }
    if (Notification.permission !== "granted") {
      setMessage("Сначала выдайте разрешение на уведомления.");
      return;
    }

    try {
      await ensureServiceWorkerRegistration();
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification("Тестовое уведомление", {
        body: "Локальная проверка показа уведомления в браузере.",
        icon: NOTIFICATION_ICON,
        data: { url: "/admin" },
      });
      setMessage("Тестовое уведомление отправлено локально.");
    } catch (error) {
      const text =
        error instanceof Error
          ? error.message
          : "Не удалось показать тестовое уведомление.";
      setMessage(text);
    }
  }, [supported]);

  return {
    hydrated,
    supported,
    permission,
    isSubscribed,
    loading,
    message,
    subscribe,
    unsubscribe,
    testNotification,
  };
}
