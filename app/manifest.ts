import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";

/**
 * Web App Manifest для установки на экран «Домой» (PWA) и корректного standalone.
 * Иконки — из `public/images/iza.webp`; при желании замените на PNG 192/512 (maskable).
 */
export default function manifest(): MetadataRoute.Manifest {
  const iconSrc = "/images/iza.webp";

  return {
    id: siteUrl ? `${siteUrl}/` : "/",
    name: "Кружки ручной работы — создай свой дизайн",
    short_name: "Кружки ИЗА",
    description:
      "Уникальные кружки с росписью глазурью. Создай дизайн онлайн и закажи персональную кружку.",
    lang: "ru",
    dir: "ltr",
    start_url: "/admin",
    scope: "/admin",
    display: "standalone",
    display_override: ["standalone", "browser"],
    orientation: "portrait-primary",
    background_color: "#fdf6f0",
    theme_color: "#6b0f14",
    categories: ["shopping", "lifestyle"],
    icons: [
      {
        src: iconSrc,
        type: "image/webp",
        sizes: "192x192",
        purpose: "any",
      },
      {
        src: iconSrc,
        type: "image/webp",
        sizes: "512x512",
        purpose: "any",
      },
      {
        src: iconSrc,
        type: "image/webp",
        sizes: "512x512",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Главная",
        short_name: "Главная",
        url: "/",
        description: "Лендинг и заказ кружки",
      },
    ],
  };
}
