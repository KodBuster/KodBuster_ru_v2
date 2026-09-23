import type { Metadata, Viewport } from "next";
import { CookieNotice } from "@/components/cookie-notice";
import { pageUrl, siteRoot } from "@/lib/site-url";
import "./globals.css";

const description = "Продающие сайты для локального бизнеса. Старт — 70 000 ₽, Рост — 120 000 ₽, Система — 170 000 ₽. Заявка приходит в Telegram или MAX.";

export const metadata: Metadata = {
  metadataBase: new URL(siteRoot()),
  title: {
    default: "KodBuster — продающие сайты для бизнеса",
    template: "%s — KodBuster",
  },
  description,
  applicationName: "KodBuster",
  authors: [{ name: "KodBuster", url: siteRoot() }],
  alternates: {
    canonical: siteRoot(),
    types: { "text/plain": [{ url: pageUrl("llms.txt"), title: "Краткие факты для агентов нейросетей" }] },
  },
  icons: { icon: "./favicon.svg" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteRoot(),
    siteName: "KodBuster",
    title: "KodBuster — продающие сайты для бизнеса",
    description,
    images: [{ url: pageUrl("images/hero-auto-owner.webp"), alt: "Собственник проверяет новую заявку с сайта на смартфоне" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KodBuster — продающие сайты для бизнеса",
    description,
    images: [pageUrl("images/hero-auto-owner.webp")],
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
      <body>{children}<CookieNotice /></body>
    </html>
  );
}
