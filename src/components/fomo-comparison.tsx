"use client";

import { useState } from "react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowUpRight } from "@/components/icons";

type Sector = "detailing" | "beauty" | "renovation";

const sectors: Record<Sector, {
  label: string;
  service: string;
  imageLabel: string;
  image: string | null;
  imageAlt: string;
  weakness: string;
  strength: string;
  before: string[];
  after: string[];
}> = {
  detailing: {
    label: "Детейлинг", service: "Защитная оклейка автомобиля", imageLabel: "Детейлинг / защита кузова", image: "/images/new_hero_1.png", imageAlt: "Мастер детейлинга работает с кузовом автомобиля",
    weakness: "Посетителю сложно понять, чем вы отличаетесь от соседнего центра.",
    strength: "Посетитель может оценить работы, материалы, условия и путь к записи.",
    before: ["Общий перечень услуг", "Нет понятных кейсов по оклейке", "Контакт спрятан внизу"],
    after: ["Примеры работ и детали услуги", "Материалы, гарантии, ответы на вопросы", "Понятная запись рядом с предложением"],
  },
  beauty: {
    label: "Косметология", service: "Консультация специалиста", imageLabel: "Клиника / консультация", image: "/images/hero-cosmetology-owner.webp", imageAlt: "Специалист косметологической клиники в рабочем пространстве",
    weakness: "Человеку не хватает оснований доверять процедуру и время специалисту.",
    strength: "На странице можно увидеть специалистов, подход и условия консультации.",
    before: ["Общий текст об услугах", "Непонятно, кто ведёт приём", "Нужно искать условия записи"],
    after: ["Профили и квалификация специалистов", "Прозрачные этапы консультации", "Чёткий путь к записи"],
  },
  renovation: {
    label: "Ремонт", service: "Ремонт квартиры под ключ", imageLabel: "Ремонт / квартиры", image: null, imageAlt: "Схема работ по ремонту квартиры",
    weakness: "Посетитель не видит процесс, состав работ и границы обязательств.",
    strength: "Кейсы, этапы и условия помогают заранее снять основные вопросы.",
    before: ["Фотографии без описания", "Нет этапов и условий", "Непонятно, как запросить смету"],
    after: ["Кейсы с описанием объёма работ", "Этапы и прозрачные условия", "Запрос расчёта по конкретной задаче"],
  },
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type DetailTab = "works" | "terms" | "stages";

const details: Record<Sector, Record<DetailTab, { label: string; text: string }>> = {
  detailing: {
    works: { label: "Работы", text: "Фотографии зон оклейки и примеры исполнения позволяют оценить аккуратность работы." },
    terms: { label: "Условия", text: "На странице стоит отдельно объяснить выбор плёнки, состав работ и условия гарантии." },
    stages: { label: "Этапы", text: "Осмотр кузова, подготовка поверхности, монтаж плёнки и выдача автомобиля." },
  },
  beauty: {
    works: { label: "Специалисты", text: "Квалификация и подход специалиста помогают понять, кому доверяют консультацию." },
    terms: { label: "Условия", text: "Понятные условия консультации: продолжительность, стоимость и формат приёма." },
    stages: { label: "Этапы", text: "Знакомство с запросом, консультация и согласование дальнейших рекомендаций." },
  },
  renovation: {
    works: { label: "Проекты", text: "Фото помещений, перечень работ и описание задач делают примеры сопоставимыми." },
    terms: { label: "Условия", text: "Состав работ, смета, материалы и границы ответственности до начала ремонта." },
    stages: { label: "Этапы", text: "Замер, смета, согласование, последовательное выполнение работ и приёмка." },
  },
};

function RenovationImage({ refined }: { refined: boolean }) {
  return <svg viewBox="0 0 560 230" className="fomo-renovation-art" role="img" aria-label={refined ? "Иллюстрация ремонта квартиры с готовым интерьером" : "Иллюстрация черновой отделки квартиры"}>
    <defs>
      <linearGradient id={refined ? "roomAfter" : "roomBefore"} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={refined ? "#a0bac0" : "#5a6771"} />
        <stop offset="1" stopColor={refined ? "#263d49" : "#293640"} />
      </linearGradient>
    </defs>
    <path d="M0 0h560v230H0Z" fill={refined ? "#263c4b" : "#3c4750"}/>
    <path d="M40 32 296 4l219 30-250 77Z" fill={refined ? "#e5e4dd" : "#a2a49e"}/>
    <path d="M40 32v142l225 47V111Z" fill={refined ? "#ccd3d0" : "#8e9795"}/>
    <path d="M265 111v110l250-56V34Z" fill={refined ? "#b0bfba" : "#738489"}/>
    <path d="m40 174 225 47 250-56-250-54Z" fill={refined ? "#957f66" : "#778084"}/>
    <path d="m265 112 0 109M160 6v154" stroke={refined ? "#a4a69c" : "#6d777a"} strokeWidth="2"/>
    {refined ? <>
      <path d="M95 118 175 99l69 19-77 19Z" fill="#f4f0e5"/>
      <path d="M95 118v35l72 23v-39Z" fill="#b4aaa0"/>
      <path d="M167 137v39l77-22v-36Z" fill="#82756c"/>
      <path d="M305 96 430 66v65l-125 30Z" fill="#385e71" stroke="#f5e8d2" strokeWidth="8"/>
      <path d="m305 98 125-30M367 81v65" stroke="#bacfd9" strokeWidth="3"/>
      <path d="M60 42 240 9" stroke="#e6b987" strokeWidth="5"/>
      <circle cx="365" cy="43" r="13" fill="#ffe1a7" opacity=".85"/>
    </> : <>
      <path d="m75 86 120-23M89 113l138-26M76 142l169-38" stroke="#687274" strokeWidth="3" strokeDasharray="13 10"/>
      <path d="m330 82 130-30M330 115l130-30M330 148l130-30" stroke="#5c6d73" strokeWidth="3" strokeDasharray="18 10"/>
      <path d="m94 165 79-13 53 23-71 15Z" fill="#d1c4a0" stroke="#7e6c54"/>
      <path d="M95 165v20l60 21v-16" fill="#aa9670"/>
      <path d="m175 78 41-8 10 8-40 10Z" fill="#a9b1b1"/>
    </>}
  </svg>;
}

/**
 * Screenshot-extracted detailing assets are intentionally displayed at their
 * native aspect ratio (530×240). No re-encoding, CSS stretch or hidden crop.
 * Other sectors retain their existing illustrative assets.
 */
const detailingMedia = {
  before: "/images/fomo/fomo-mercedes-service.jpg",
  after: "/images/fomo/fomo-ppf-install.jpg",
} as const;

function MockMedia({ current, sector, refined }: { current: (typeof sectors)[Sector]; sector: Sector; refined: boolean }) {
  const extracted = sector === "detailing";
  const photo = extracted ? (refined ? detailingMedia.after : detailingMedia.before) : current.image;
  const alt = extracted
    ? refined
      ? "Мастер в перчатках наносит защитную PPF-плёнку на кузов чёрного автомобиля"
      : "Чёрный Mercedes в светлом помещении автосервиса"
    : current.imageAlt;

  return <div className={`fomo-mock-photo ${refined ? "fomo-mock-photo--refined" : "fomo-mock-photo--plain"}${extracted ? " fomo-mock-photo--extracted" : ""}`}>
    {photo
      ? <Image src={`${basePath}${photo}`} alt={alt} fill
          sizes="(max-width: 640px) calc(100vw - 68px), (max-width: 1100px) 45vw, 530px"
          className="fomo-mock-image" unoptimized />
      : <RenovationImage refined={refined}/>}
    <span className="fomo-photo-caption">{current.imageLabel}</span>
    {refined && <span className="fomo-photo-service-tag" aria-hidden="true">SERVICE / FOCUS</span>}
  </div>;
}

export function FomoComparison() {
  const [sector, setSector] = useState<Sector>("detailing");
  const [emphasis, setEmphasis] = useState<"before" | "after">("after");
  const [detailTab, setDetailTab] = useState<DetailTab>("works");
  const current = sectors[sector];
  const isWideDetailingHero = sector === "detailing";
  const heroImage = !isWideDetailingHero && current.image ? `url("${basePath}${current.image}")` : "none";

  return (
    <section className="fomo-section section-pad" id="compare" aria-labelledby="fomo-title">
      <div className="container">
        <div className="fomo-header">
          <p className="section-kicker light"><i /> 01 / Сравнение до первого звонка</p>
          <h2 id="fomo-title">Ваш бизнес может быть сильнее.<br /><em>Но видно ли это клиенту?</em></h2>
          <p>Потенциальный покупатель сравнивает страницы, работы и условия ещё до общения с вами. Показываем, как подача помогает обосновать выбор — без выдуманных цифр и обещаний продаж.</p>
        </div>

        <div className="fomo-lab">
          <div className={`fomo-lab-top fomo-lab-top--media${isWideDetailingHero ? " fomo-lab-top--detailing" : ""}`} style={{ "--fomo-hero-image": heroImage } as CSSProperties}>
            {isWideDetailingHero && (
              <picture className="fomo-hero-picture" aria-hidden="true">
                <source media="(max-width: 640px)" srcSet={`${basePath}/images/fomo/mercedes-hero-wide-700.webp 1x, ${basePath}/images/fomo/mercedes-hero-wide-1000.webp 2x`} />
                <source media="(max-width: 1100px)" srcSet={`${basePath}/images/fomo/mercedes-hero-wide-1000.webp 1x, ${basePath}/images/fomo/mercedes-hero-wide-2172.webp 2x`} />
                <img
                  src={`${basePath}/images/fomo/mercedes-hero-wide-2172.webp`}
                  width={2172}
                  height={724}
                  loading="eager"
                  decoding="async"
                  alt=""
                />
              </picture>
            )}
            <div>
              <span className="fomo-micro">ИНТЕРАКТИВНЫЙ ПРИМЕР / НЕ АУДИТ КОНКРЕТНОЙ КОМПАНИИ</span>
              <h3>Одна услуга.<br /><span>Два первых впечатления.</span></h3>
            </div>
            <div className="fomo-industries" role="group" aria-label="Выберите тип бизнеса">
              {(Object.keys(sectors) as Sector[]).map((key) => (
                <button className={sector === key ? "is-active" : ""} key={key} type="button" aria-pressed={sector === key} onClick={() => { setSector(key); setDetailTab("works"); setEmphasis("after"); }}>{sectors[key].label}</button>
              ))}
            </div>
          </div>

          <div className="fomo-compare-grid">
            <article className={`fomo-preview ${emphasis === "before" ? "is-spotlight" : ""}`}>
              <div className="fomo-browser"><i /><i /><i /><span>Типовая слабая подача</span></div>
              <div className="fomo-preview-body is-before">
                <div className="fomo-preview-meta">БИЗНЕС / ПРЕЗЕНТАЦИЯ</div>
                <MockMedia current={current} sector={sector} refined={false}/>
                <h4>Мы оказываем услуги</h4>
                <p>{current.service}. Позвоните и уточните подробности.</p>
                <div className="fomo-placeholder-line" aria-hidden="true" />
                <div className="fomo-placeholder-line short" aria-hidden="true" />
                <span className="fomo-mock-link">Контакты ↓</span>
              </div>
              <div className="fomo-preview-footer"><span>01 / Без аргументов выбора</span><button type="button" aria-pressed={emphasis === "before"} onClick={() => setEmphasis("before")}>Рассмотреть подробнее ↗</button></div>
            </article>

            <article className={`fomo-preview fomo-preview-better ${emphasis === "after" ? "is-spotlight" : ""}`}>
              <div className="fomo-browser"><i /><i /><i /><span>Проработанная подача</span></div>
              <div className="fomo-preview-body is-after">
                <div className="fomo-preview-meta">УСЛУГА / РЕШЕНИЕ / ЗАПИСЬ</div>
                <MockMedia current={current} sector={sector} refined={true}/>
                <h4>{current.service}</h4>
                <p>Что входит, как проходит работа, примеры и условия — всё на одной понятной странице.</p>
                <div className="fomo-mock-chips" role="group" aria-label="Подробности услуги">
                  {(["works", "terms", "stages"] as DetailTab[]).map((tab) => (
                    <button className={detailTab === tab ? "is-active" : ""} aria-pressed={detailTab === tab} key={tab} type="button" onClick={() => setDetailTab(tab)}>{details[sector][tab].label}</button>
                  ))}
                </div>
                <p className="fomo-service-detail" aria-live="polite">{details[sector][detailTab].text}</p>
                <a className="button button-primary fomo-mock-cta" href="#contact"><span>Обсудить услугу</span><ArrowUpRight /></a>
              </div>
              <div className="fomo-preview-footer"><span>02 / Есть основания доверять</span><button type="button" aria-pressed={emphasis === "after"} onClick={() => setEmphasis("after")}>Рассмотреть подробнее ↗</button></div>
            </article>
          </div>

          <div className="fomo-insights" aria-live="polite">
            <div className="fomo-insights-top">
              <span>{emphasis === "before" ? "ЧЕГО НЕ ХВАТАЕТ ПОСЕТИТЕЛЮ" : "ЧТО ПОМОГАЕТ ПРИНЯТЬ РЕШЕНИЕ"}</span>
              <strong>{emphasis === "before" ? current.weakness : current.strength}</strong>
            </div>
            <ul>
              {(emphasis === "before" ? current.before : current.after).map((point, index) => (
                <li key={point}><span>0{index + 1}</span>{point}</li>
              ))}
            </ul>
          </div>

          <div className="fomo-lab-bottom">
            <p>Это учебное сравнение сценариев. Мы не утверждаем, что такие проблемы есть у вашей компании: их можно проверить только после изучения вашего сайта.</p>
            <a className="button button-primary" href="#contact"><span>Запросить разбор своего бизнеса</span><ArrowUpRight /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
