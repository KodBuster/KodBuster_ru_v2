"use client";

import Image from "next/image";
import { PointerEvent, UIEvent, useEffect, useRef, useState } from "react";
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
    image: "/images/case-synonym.webp",
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
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!section || !track || reducedMotion.matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      if (window.innerWidth < 960) return;

      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      const maxShift = Math.max(0, track.scrollWidth - window.innerWidth + window.innerWidth * 0.06);
      track.style.transform = `translate3d(${-progress * maxShift}px, 0, 0)`;
      const nextIndex = Math.min(projects.length - 1, Math.round(progress * (projects.length - 1)));
      setActiveIndex((current) => current === nextIndex ? current : nextIndex);
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const moveCursor = (event: PointerEvent<HTMLElement>) => {
    const cursor = cursorRef.current;
    const sticky = stickyRef.current;
    if (!cursor || !sticky || window.innerWidth < 960) return;
    const isOverCard = (event.target as HTMLElement).closest(".portfolio-card");
    const rect = sticky.getBoundingClientRect();
    cursor.style.transform = `translate3d(${event.clientX - rect.left - 48}px, ${event.clientY - rect.top - 48}px, 0)`;
    cursor.dataset.visible = isOverCard ? "true" : "false";
  };

  const hideCursor = () => {
    if (cursorRef.current) cursorRef.current.dataset.visible = "false";
  };

  const updateMobileProgress = (event: UIEvent<HTMLDivElement>) => {
    if (window.innerWidth >= 960) return;
    const viewport = event.currentTarget;
    const travel = Math.max(1, viewport.scrollWidth - viewport.clientWidth);
    const nextIndex = Math.min(projects.length - 1, Math.round((viewport.scrollLeft / travel) * (projects.length - 1)));
    setActiveIndex((current) => current === nextIndex ? current : nextIndex);
  };

  return (
    <section
      className="portfolio-reel"
      id="cases"
      ref={sectionRef}
      data-active={activeIndex}
      aria-labelledby="cases-title"
      onPointerMove={moveCursor}
      onPointerLeave={hideCursor}
    >
      <div className="portfolio-sticky" ref={stickyRef}>
        <div className="portfolio-heading">
          <div>
            <p className="portfolio-kicker"><span>05</span> реальных проектов</p>
            <h2 id="cases-title">Пять проектов.<br /><em>Пять разных задач.</em></h2>
          </div>
          <p>Проекты можно открыть и проверить. Показываем реальные сайты — без выдуманных цифр и одинаковых шаблонов.</p>
        </div>

        <div className="portfolio-window" tabIndex={0} aria-label="Лента проектов" onScroll={updateMobileProgress}>
          <div className="portfolio-track" ref={trackRef}>
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
        <div className="reel-cursor" ref={cursorRef} data-visible="false" aria-hidden="true">Смотреть<ArrowUpRight /></div>
      </div>
    </section>
  );
}
