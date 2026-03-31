import type { Metadata, Viewport } from "next";
import Modal from "@/components/ui/Modal";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://art-ceramic-psi.vercel.app/";

const previewImage = `images/hero.webp`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Кружки ручной работы — создай свой дизайн",
  description:
    "Уникальные кружки ручной работы с росписью глазурью. Создай свой дизайн онлайн и закажи персональную кружку.",
  keywords: [
    "кружки на заказ",
    "ручная работа",
    "роспись кружек",
    "уникальные кружки",
    "дизайн кружки",
  ],
  authors: [{ name: "Имя мастера" }],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Уникальные кружки ручной работы",
    description:
      "Создай свою кружку с индивидуальным дизайном. Ручная роспись глазурью.",
    url: siteUrl,
    type: "website",
    images: [{ url: "images/hero.webp", alt: "Создай свою кружку с индивидуальным дизайном" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Уникальные кружки ручной работы",
    description: "Создай свою кружку с индивидуальным дизайном.",
    images: [previewImage],
  },
  appleWebApp: {
    capable: true,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6b0f14",
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        {children}
        <Modal />
      </body>
    </html>
  );
}
