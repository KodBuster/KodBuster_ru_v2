import { contacts } from "@/data/contacts";
import { operator } from "@/data/operator";
import { packages, services } from "@/data/site";
import { pageUrl, siteRoot } from "@/lib/site-url";

function rubles(label: string) {
  const digits = label.replace(/\D/g, "");
  return digits ? Number(digits) : undefined;
}

function organization() {
  const id = `${siteRoot()}#organization`;
  const sameAs = [contacts.telegramUrl, contacts.maxUrl].filter(Boolean);
  const data: Record<string, unknown> = {
    "@type": operator.address ? ["Organization", "ProfessionalService"] : "Organization",
    "@id": id,
    name: "KodBuster",
    url: siteRoot(),
    description: "Студия продающих сайтов для локального бизнеса. Заявка с сайта приходит владельцу в Telegram или MAX.",
    logo: pageUrl("favicon.svg"),
    image: pageUrl("images/hero-auto-owner.webp"),
    inLanguage: "ru-RU",
    knowsLanguage: "ru",
    sameAs,
    abstract: "KodBuster делает продающий сайт, с которого заявка доходит до телефона владельца в Telegram или MAX. Число заявок не обещает.",
  };

  if (operator.name) data.legalName = operator.name;
  if (operator.email) data.email = operator.email;
  if (contacts.phone) data.telephone = contacts.phone.replace(/[^\d+]/g, "");
  if (operator.address) {
    data.address = {
      "@type": "PostalAddress",
      streetAddress: operator.address,
      addressCountry: "RU",
    };
  }
  if (contacts.phone || operator.email) {
    data.contactPoint = {
      "@type": "ContactPoint",
      contactType: "sales",
      availableLanguage: "Russian",
      ...(contacts.phone ? { telephone: contacts.phone.replace(/[^\d+]/g, "") } : {}),
      ...(operator.email ? { email: operator.email } : {}),
      url: pageUrl("#contact"),
    };
  }

  return data;
}

function offers() {
  return packages.map((item) => ({
    "@type": "Offer",
    name: `${item.label}: ${item.title}`,
    description: `${item.text} Срок — ${item.term}. При предоплате в течение трёх дней после разбора: ${item.fastPrice}.`,
    price: rubles(item.price),
    priceCurrency: "RUB",
    url: pageUrl("#packages"),
    availability: "https://schema.org/InStock",
    itemOffered: {
      "@type": "Service",
      name: item.title,
      serviceType: "Создание продающего сайта",
      provider: { "@id": `${siteRoot()}#organization` },
    },
  }));
}

export function homeJsonLd() {
  const root = siteRoot();
  return {
    "@context": "https://schema.org",
    "@graph": [
      organization(),
      {
        "@type": "WebSite",
        "@id": `${root}#website`,
        url: root,
        name: "KodBuster",
        inLanguage: "ru-RU",
        description: "Продающие сайты для бизнеса: страница, заявки в мессенджер, подготовка к поиску и Яндекс Картам.",
        publisher: { "@id": `${root}#organization` },
      },
      {
        "@type": "WebPage",
        "@id": `${root}#webpage`,
        url: root,
        name: "KodBuster — продающие сайты для бизнеса",
        description: "Три пакета запуска сайта: Старт 70 000 ₽, Рост 120 000 ₽, Система 170 000 ₽. Заявка приходит в Telegram или MAX.",
        abstract: "KodBuster — студия продающих сайтов. Старт: одна страница, 70 000 ₽, до 5 рабочих дней, тексты входят. Рост: страница под нишу, 120 000 ₽, до 8 рабочих дней. Система: главная и до 5 страниц услуг, 170 000 ₽, до 12 рабочих дней. Скидка 10% при предоплате в течение трёх дней после разбора. Число заявок в цену не входит.",
        inLanguage: "ru-RU",
        isPartOf: { "@id": `${root}#website` },
        about: { "@id": `${root}#organization` },
        primaryImageOfPage: pageUrl("images/hero-auto-owner.webp"),
        mainEntity: { "@id": `${root}#organization` },
      },
      {
        "@type": "OfferCatalog",
        "@id": `${root}#packages`,
        name: "Пакеты запуска сайта",
        url: pageUrl("#packages"),
        itemListElement: offers(),
      },
      {
        "@type": "ItemList",
        "@id": `${root}#services`,
        name: "Услуги KodBuster",
        itemListElement: services.map((service, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Service",
            name: service.title,
            description: service.text,
            url: pageUrl("#services"),
            provider: { "@id": `${root}#organization` },
          },
        })),
      },
      {
        "@type": "ItemList",
        "@id": `${root}#cases`,
        name: "Проекты",
        itemListElement: [
          ["РамПадел", "Сайт падел-клуба: услуги, цены и запись на игру.", "https://rampadel.ru/"],
          ["Синоним", "Ювелирный интернет-магазин с каталогом и оформлением заказа.", "https://synonym-jewelry.ru/"],
          ["Шародувы", "Каталог воздушных шаров с корзиной и доставкой.", "https://sharoduwi.ru/"],
          ["Я помогаю", "Продающий лендинг направления по выкупу долевой недвижимости.", "https://www.я-помогаю.рф/doli/"],
          ["ФанШар", "Яркий каталог шаров и праздничных композиций.", "https://funshar.ru/"],
        ].map(([name, description, url], index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: { "@type": "CreativeWork", name, description, url },
        })),
      },
    ],
  };
}

export function privacyJsonLd() {
  const root = siteRoot();
  const url = pageUrl("privacy/");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: "Политика конфиденциальности",
        description: "Как KodBuster обрабатывает персональные данные по 152-ФЗ.",
        inLanguage: "ru-RU",
        isPartOf: { "@id": `${root}#website` },
        about: { "@id": `${root}#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: root },
          { "@type": "ListItem", position: 2, name: "Политика конфиденциальности", item: url },
        ],
      },
    ],
  };
}
