import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kodbuster.github.io/KodBuster_ru_v2/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "KodBuster — продающие сайты для бизнеса",
    template: "%s — KodBuster",
  },
  description: "Создаём продающие сайты под ключ: дизайн, структура, SEO и GEO, заявки в Telegram или MAX, аналитика и продвижение в Яндексе.",
  applicationName: "KodBuster",
  alternates: { canonical: siteUrl },
  icons: { icon: "./favicon.svg" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
    siteName: "KodBuster",
    title: "KodBuster — продающие сайты для бизнеса",
    description: "Сайт под ключ, который приводит клиентов и отправляет новые заявки прямо на смартфон.",
  },
  twitter: {
    card: "summary",
    title: "KodBuster — продающие сайты для бизнеса",
    description: "Сайт под ключ, который приводит клиентов и отправляет новые заявки прямо на смартфон.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#071421",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
