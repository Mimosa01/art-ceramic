/* eslint-disable no-restricted-globals */
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  event.waitUntil(
    (async () => {
      let data = { title: "Уведомление", body: "", url: "/admin", icon: "" };
      try {
        if (event.data) {
          const parsed = await event.data.json();
          data = { ...data, ...parsed };
        }
      } catch {
        if (event.data) {
          data.body = event.data.text();
        }
      }
      await self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon || "/images/iza.webp",
        data: { url: data.url || "/admin" },
      });
    })(),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/admin";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          if ("navigate" in client && typeof client.navigate === "function") {
            client.navigate(url);
          }
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    }),
  );
});
