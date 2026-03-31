import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    lang: "ru",
    name: "Изабелла — роспись кружек · админка",
    short_name: "Изабелла · заявки",
    description:
      "Админ-панель заявок на кружки ручной росписи: новые обращения, статусы и push-уведомления.",
    start_url: "/admin",
    display: "standalone",
    scope: "/admin",
    background_color: "#fff7ed", // тёплый кремовый фон
    theme_color: "#f97316", // оранжевый акцент (под сайт)
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icons/icon-192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        src: "/icons/icon-512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    categories: ["business", "productivity"],
    shortcuts: [
      {
        name: "Открыть заявки",
        short_name: "Заявки",
        url: "/admin",
        description: "Перейти сразу к списку заявок.",
      },
    ],
  };
}