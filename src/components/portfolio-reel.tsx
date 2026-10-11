"use client";

import Image from "next/image";
import { PointerEvent, UIEvent, useRef, useState, type MouseEvent } from "react";
import { ArrowUpRight } from "@/components/icons";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const projects = [
  {
    number: "01",
    title: "РамПадел",
    category: "Спорт · Клуб",
    description: "Сайт падел-клуба: услуги, цены и запись на игру.",
    urlLabel: "rampadel.ru",
    href: "https://rampadel.ru/",
    image: "/images/case-rampadel.webp",
    imageMobile: "/images/case-rampadel-square.webp",
    alt: "Главный визуал сайта падел-клуба РамПадел",
    tone: "orange",
  },
  {
    number: "02",
    title: "Синоним",
    category: "Украшения · E-commerce",
    description: "Ювелирный интернет-магазин с каталогом и оформлением заказа.",
    urlLabel: "synonym-jewelry.ru",
    href: "https://synonym-jewelry.ru/",
    image: "/images/case-synonym.png",
    alt: "Главный экран сайта ювелирного бренда Синоним",
    shot: true,
    tone: "silver",
  },
  {
    number: "03",
    title: "Шародувы",
    category: "Праздники · Интернет-магазин",
    description: "Каталог воздушных шаров с корзиной и доставкой.",
    urlLabel: "sharoduwi.ru",
    href: "https://sharoduwi.ru/",
    image: "/images/case-sharoduwi.webp",
    imageMobile: "/images/case-sharoduwi-square.webp",
    alt: "Главный экран интернет-магазина Шародувы",
    shot: true,
    tone: "blue",
  },
  {
    number: "04",
    title: "Я помогаю",
    category: "Недвижимость · Услуги",
    description: "Продающий лендинг направления по выкупу долевой недвижимости.",
    urlLabel: "я-помогаю.рф/doli",
    href: "https://www.я-помогаю.рф/doli/",
    image: "/images/case-help.webp",
    imageMobile: "/images/case-help-square.webp",
    alt: "Главный экран сайта по выкупу долевой недвижимости",
    shot: true,
    tone: "green",
  },
  {
    number: "05",
    title: "ФанШар",
    category: "Праздники · Каталог",
    description: "Яркий каталог шаров и праздничных композиций.",
    urlLabel: "funshar.ru",
    href: "https://funshar.ru/",
    image: "/images/case-funshar.webp",
    imageMobile: "/images/case-funshar-square.webp",
    alt: "Главный экран каталога воздушных шаров ФанШар",
    shot: true,
    tone: "yellow",
  },
] as const;

export function PortfolioReel() {
  const windowRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ active: boolean; moved: boolean; startX: number; startScroll: number }>({
    active: false,
    moved: false,
    startX: 0,
    startScroll: 0,
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragging, setDragging] = useState(false);

  const updateProgress = (event: UIEvent<HTMLDivElement>) => {
    const viewport = event.currentTarget;
    const travel = Math.max(1, viewport.scrollWidth - viewport.clientWidth);
    const nextIndex = Math.min(projects.length - 1, Math.round((viewport.scrollLeft / travel) * (projects.length - 1)));
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    if ((event.target as HTMLElement).closest("a, button")) return;

    const viewport = windowRef.current;
    if (!viewport) return;

    dragRef.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startScroll: viewport.scrollLeft,
    };
    viewport.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const viewport = windowRef.current;
    if (!drag.active || !viewport) return;

    const delta = event.clientX - drag.startX;
    if (Math.abs(delta) > 4) drag.moved = true;
    viewport.scrollLeft = drag.startScroll - delta;
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const viewport = windowRef.current;
    if (!drag.active) return;

    drag.active = false;
    setDragging(false);
    if (viewport?.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }
  };

  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!dragRef.current.moved) return;
    event.preventDefault();
    event.stopPropagation();
    dragRef.current.moved = false;
  };

  return (
    <section
      className="portfolio-reel"
      id="cases"
      data-active={activeIndex}
      aria-labelledby="cases-title"
    >
      <div className="portfolio-sticky">
        <div className="portfolio-heading">
          <div>
            <p className="portfolio-kicker"><span>05</span> реальных проектов</p>
            <h2 id="cases-title">Пять проектов.<br /><em>Пять разных задач.</em></h2>
          </div>
          <div className="portfolio-heading-side">
            <p>Проекты можно открыть и проверить. Показываем реальные сайты — без выдуманных цифр и одинаковых шаблонов.</p>
          </div>
        </div>

        <div
          className={`portfolio-window${dragging ? " is-dragging" : ""}`}
          ref={windowRef}
          tabIndex={0}
          aria-label="Лента проектов. Листайте вбок перетаскиванием или полосой прокрутки."
          onScroll={updateProgress}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
        >
          <div className="portfolio-track">
            {projects.map((project, index) => (
              <article className={`portfolio-card tone-${project.tone} ${index === activeIndex ? "is-active" : ""}`} key={project.title}>
                <a href={project.href} target="_blank" rel="noreferrer" aria-label={`Открыть проект ${project.title}`}>
                  <div className={`portfolio-visual${"imageMobile" in project ? " has-mobile-cover" : ""}${"shot" in project ? " is-shot" : ""}`}>
                    <div className="browser-bar" aria-hidden="true">
                      <span><i /><i /><i /></span>
                      <b>{project.urlLabel}</b>
                    </div>
                    {"imageMobile" in project && (
                      <Image
                        className="cover-mobile"
                        src={`${basePath}${project.imageMobile}`}
                        alt={project.alt}
                        fill
                        sizes="82vw"
                        loading="lazy"
                      />
                    )}
                    <Image
                      className={"imageMobile" in project ? "cover-desktop" : undefined}
                      src={`${basePath}${project.image}`}
                      alt={project.alt}
                      fill
                      sizes="(min-width: 960px) 46vw, 82vw"
                      loading="lazy"
                    />
                    <span className="portfolio-open">Открыть<ArrowUpRight /></span>
                  </div>
                  <div className="portfolio-copy">
                    <div className="portfolio-meta"><span>{project.number} / 05</span><span>{project.category}</span></div>
                    <div className="portfolio-title">
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                    </div>
                    <span className="portfolio-link">Смотреть сайт <ArrowUpRight /></span>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </div>

        <div className="portfolio-progress" aria-hidden="true">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <i><b style={{ width: `${((activeIndex + 1) / projects.length) * 100}%` }} /></i>
          <span>05</span>
        </div>
      </div>
    </section>
  );
}
