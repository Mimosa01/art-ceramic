"use client";

import Button from "@/components/ui/Button";
import { usePushNotifications } from "@/hooks/usePushNotifications";

export default function AdminOrderPushPanel() {
  const {
    hydrated,
    supported,
    permission,
    isSubscribed,
    loading,
    message,
    subscribe,
    unsubscribe,
    testNotification,
  } = usePushNotifications();

  if (!hydrated) {
    return (
      <div className="rounded-xl border border-(--red-deep)/12 bg-white/60 px-3 py-2.5 text-xs text-(--red-dark)/60">
        Загрузка…
      </div>
    );
  }

  if (!supported) {
    return (
      <div className="rounded-xl border border-(--red-deep)/12 bg-white/60 px-3 py-2.5 text-xs text-(--red-dark)/80">
        <p className="font-medium text-(--red-deep)">Уведомления о заявках</p>
        <p className="mt-1 leading-snug">
          Push в этом браузере недоступен. На iPhone: «Поделиться» → «На экран
          „Домой“», затем откройте сайт с иконки и включите уведомления в
          админке (iOS 16.4+).
        </p>
      </div>
    );
  }

  const denied = permission === "denied";

  return (
    <div className="rounded-xl border border-(--red-deep)/12 bg-white/60 px-3 py-2.5">
      <p className="text-xs font-medium text-(--red-deep)">
        Уведомления о заявках
      </p>
      <p className="mt-1 text-[0.7rem] leading-snug text-(--red-dark)/75">
        При новой заявке придёт push (если в проекте вызывается{" "}
        <code className="rounded bg-black/5 px-0.5">/api/push/notify-lead</code>
        ). На iOS удобнее открыть админку из установки на экран «Домой».
      </p>

      {denied ? (
        <p className="mt-2 text-[0.7rem] text-red-700" role="alert">
          Уведомления заблокированы в настройках браузера для этого сайта.
        </p>
      ) : null}

      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {!isSubscribed ? (
          <Button
            variant="primary"
            type="button"
            className="min-h-10 flex-1 justify-center text-sm sm:min-w-48"
            disabled={loading || denied}
            onClick={() => void subscribe()}
          >
            {loading ? "Подключение…" : "Включить уведомления"}
          </Button>
        ) : (
          <Button
            variant="outline"
            type="button"
            className="min-h-10 flex-1 justify-center text-sm sm:min-w-48"
            disabled={loading}
            onClick={() => void unsubscribe()}
          >
            {loading ? "Отключение…" : "Отключить уведомления"}
          </Button>
        )}
        <Button
          variant="outline"
          type="button"
          className="min-h-10 flex-1 justify-center text-sm sm:min-w-40"
          disabled={loading || permission !== "granted"}
          onClick={() => void testNotification()}
        >
          Тест показа
        </Button>
      </div>

      {message ? (
        <p className="mt-2 text-xs text-(--red-dark)/85" role="status">
          {message}
        </p>
      ) : null}

      {isSubscribed ? (
        <p className="mt-1.5 text-[0.65rem] text-(--red-deep)/50">
          Подписка активна — сервер рассылает через VAPID и таблицу{" "}
          <code className="rounded bg-black/5 px-0.5">push_subscriptions</code>.
        </p>
      ) : null}
    </div>
  );
}
