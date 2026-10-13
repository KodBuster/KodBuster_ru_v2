"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./portfolio-reel-v2.module.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const cases = [
  {
    name: "РамПадел",
    category: "Спорт · запись",
    labels: ["Спорт", "Запись"],
    description: "Сайт падел-клуба: услуги, цены и запись на игру.",
    site: "rampadel.ru",
    href: "https://rampadel.ru/",
    image: "/images/case-rampadel.webp",
    alt: "Главный экран сайта РамПадел",
    task: "Объяснить возможности клуба и сделать путь к записи заметным.",
    solution: "Крупный спортивный визуал, структура услуг и цен, точки перехода к записи.",
    result: "Информация о клубе, услугах и стоимости собрана в одном маршруте: посетитель может познакомиться с предложением и перейти к записи без лишнего поиска.",
    visual: "ring",
    accent: "#ff6426",
    accentLight: "#ffbd9d",
  },
  {
    name: "Синоним",
    category: "Украшения · E-commerce",
    labels: ["Украшения", "Каталог"],
    description: "Ювелирный интернет-магазин с каталогом и оформлением заказа.",
    site: "synonym-jewelry.ru",
    href: "https://synonym-jewelry.ru/",
    image: "/images/case-synonym.png",
    alt: "Главный экран интернет-магазина Синоним",
    task: "Передать характер бренда и облегчить знакомство с ассортиментом.",
    solution: "Редакционный визуал, навигация по категориям и выразительная подача изделий.",
    result: "Украшения и коллекции получили последовательную презентацию. Посетитель может изучать ассортимент, сравнивать позиции и двигаться к выбору изделия.",
    visual: "bars",
    accent: "#788f78",
    accentLight: "#d7e2c9",
  },
  {
    name: "Шародувы",
    category: "Праздники · Магазин",
    labels: ["Праздники", "Каталог"],
    description: "Каталог воздушных шаров с корзиной и доставкой.",
    site: "sharoduwi.ru",
    href: "https://sharoduwi.ru/",
    image: "/images/case-sharoduwi.webp",
    alt: "Главный экран магазина Шародувы",
    task: "Помочь покупателю выбрать оформление и разобраться с заказом.",
    solution: "Категории товаров, карточки композиций, корзина и информация о доставке.",
    result: "Ассортимент представлен как понятная витрина, а переход от выбора композиции к оформлению заказа выстроен последовательно.",
    visual: "path",
    accent: "#ea5d9c",
    accentLight: "#ffcbdf",
  },
  {
    name: "Я помогаю",
    category: "Недвижимость · Услуги",
    labels: ["Услуги", "Лендинг"],
    description: "Лендинг направления по выкупу долевой недвижимости.",
    site: "я-помогаю.рф/doli",
    href: "https://www.я-помогаю.рф/doli/",
    image: "/images/case-help.webp",
    alt: "Главный экран проекта Я помогаю",
    task: "Донести суть сложной услуги и сделать обращение понятным.",
    solution: "Структура с объяснением предложения, этапов и следующего шага.",
    result: "Посетитель получает последовательное объяснение услуги и понятный путь к обращению за консультацией.",
    visual: "layers",
    accent: "#6485a2",
    accentLight: "#d7e7ee",
  },
  {
    name: "ФанШар",
    category: "Праздники · Каталог",
    labels: ["Праздники", "Витрина"],
    description: "Каталог шаров и праздничных композиций.",
    site: "funshar.ru",
    href: "https://funshar.ru/",
    image: "/images/case-funshar.webp",
    alt: "Главный экран каталога ФанШар",
    task: "Показать направления ассортимента и упростить поиск идеи для праздника.",
    solution: "Выразительные изображения, группы предложений и заметные переходы к заказу.",
    result: "Праздничные предложения собраны в наглядную витрину, где посетителю легче сориентироваться и перейти к интересующей категории.",
    visual: "steps",
    accent: "#d69b47",
    accentLight: "#f7dfa9",
  },
] as const;

type Case = (typeof cases)[number];

function DirectionalArrow({ back = false }: { back?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={back ? "M19 12H5m7 7-7-7 7-7" : "M5 12h14m-7-7 7 7-7 7"} />
  </svg>;
}

function CaseScene({ kind }: { kind: Case["visual"] }) {
  return <div className={`${styles.scene} ${styles[kind]}`} aria-hidden="true">
    <span className={styles.sceneGlow} />
    {kind === "ring" ? <><span className={styles.donut}><i /></span><span className={styles.orbit} /><span className={styles.spark} /></> :
      kind === "layers" ? <><span className={styles.layerOne} /><span className={styles.layerTwo} /><span className={styles.layerThree} /><span className={styles.spark} /></> :
      <><span className={styles.chartBars}><i /><i /><i /><i /></span><span className={styles.chartArrow}>↗</span><span className={styles.spark} /></>}
  </div>;
}

function CaseDetails({ title, value }: { title: string; value: string }) {
  return <div className={styles.detailRow}>
    <span className={styles.detailIcon} aria-hidden="true">{title === "Задача" ? "◎" : "✳"}</span>
    <div><b>{title}</b><p>{value}</p></div>
  </div>;
}

export function PortfolioReelV2() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const moveTo = useCallback((index: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const max = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    const next = Math.min(cases.length - 1, Math.max(0, index));
    viewport.scrollTo({ left: max * next / (cases.length - 1), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    setActive(next);
  }, []);

  const syncScroll = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const max = viewport.scrollWidth - viewport.clientWidth;
    const index = max > 1 ? Math.round((viewport.scrollLeft / max) * (cases.length - 1)) : 0;
    setActive(index);
  }, []);

  useEffect(() => {
    if (selected === null) return;
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
      if (event.key === "Tab") {
        const dialog = closeRef.current?.closest('[role="dialog"]');
        const items = dialog?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]');
        if (!items?.length) return;
        if (event.shiftKey && document.activeElement === items[0]) {
          event.preventDefault();
          items[items.length - 1].focus();
        } else if (!event.shiftKey && document.activeElement === items[items.length - 1]) {
          event.preventDefault();
          items[0].focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      previousFocus.current?.focus();
    };
  }, [selected]);

  const current = selected === null ? null : cases[selected];

  return <section id="cases" className={styles.section} aria-labelledby="cases-title">
    <div className={styles.heading}>
      <div>
        <p className={styles.kicker}><span>05</span> реальных проектов</p>
        <h2 id="cases-title">Пять проектов.<br /><em>Пять разных задач.</em></h2>
      </div>
      <p className={styles.intro}>Разные отрасли — разные решения. Показываем структуру, визуал и путь посетителя к обращению. Без неподтверждённых цифр.</p>
    </div>

    <div className={styles.window} ref={viewportRef} onScroll={syncScroll}
      aria-label="Галерея проектов KodBuster" role="region" tabIndex={0}
      onKeyDown={(event) => { if (event.key === "ArrowRight") { event.preventDefault(); moveTo(active + 1); } if (event.key === "ArrowLeft") { event.preventDefault(); moveTo(active - 1); } }}>
      <div className={styles.track}>
        {cases.map((project, index) => <article className={styles.card} key={project.name}
          style={{ "--case-accent": project.accent, "--case-light": project.accentLight } as React.CSSProperties}>
          <div className={styles.cardTop}>
            <div className={styles.preview}>
              <div className={styles.browser}><span className={styles.browserDots}>● ● ●</span><span>{project.site}</span></div>
              <Image src={`${basePath}${project.image}`} alt={project.alt} fill sizes="(max-width: 600px) 92vw, (max-width: 1100px) 40vw, 16vw" className={styles.siteShot} loading="lazy" />
              <span className={styles.previewIndex}>{String(index + 1).padStart(2, "0")} / 05</span>
            </div>
            <div className={styles.cardCopy}>
              <div className={styles.meta}><span>{String(index + 1).padStart(2, "0")} / 05</span><span>{project.labels[0]}</span></div>
              <h3>{project.name}</h3>
              <p className={styles.description}>{project.description}</p>
              <div className={styles.details}>
                <CaseDetails title="Задача" value={project.task} />
                <CaseDetails title="Решение" value={project.solution} />
              </div>
            </div>
          </div>
          <div className={styles.result} style={{ "--case-accent": project.accent, "--case-light": project.accentLight } as React.CSSProperties}>
            <CaseScene kind={project.visual} />
            <div className={styles.resultCopy}><b><span aria-hidden="true">▥</span> Результат</b><p>{project.result}</p></div>
          </div>
          <button type="button" className={styles.caseButton} onClick={() => setSelected(index)} aria-label={`Посмотреть кейс ${project.name}`}>
            Смотреть кейс <span aria-hidden="true">↗</span>
          </button>
        </article>)}
      </div>
    </div>

    <div className={styles.controls}>
      <div className={styles.arrows}>
        <button type="button" onClick={() => moveTo(active - 1)} disabled={active === 0} aria-label="Предыдущие проекты"><DirectionalArrow back /></button>
        <button type="button" onClick={() => moveTo(active + 1)} disabled={active === cases.length - 1} aria-label="Следующие проекты"><DirectionalArrow /></button>
      </div>
      <div className={styles.progress}><span>{String(active + 1).padStart(2, "0")}</span><div role="progressbar" aria-valuemin={1} aria-valuemax={cases.length} aria-valuenow={active + 1} aria-label="Просмотр проектов"><i style={{ width: `${(active + 1) / cases.length * 100}%` }} /></div><span>05</span></div>
      <span className={styles.swipeHint}>Листайте проекты ↔</span>
    </div>

    {current && <div className={styles.overlay} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="case-dialog-title" className={styles.dialog}>
        <button className={styles.close} ref={closeRef} onClick={() => setSelected(null)} aria-label="Закрыть кейс">×</button>
        <div className={styles.dialogImage}><Image src={`${basePath}${current.image}`} alt={current.alt} fill sizes="(max-width: 700px) 90vw, 42vw" /></div>
        <div className={styles.dialogCopy}>
          <p className={styles.dialogKicker}>{current.category}</p>
          <h2 id="case-dialog-title">{current.name}</h2>
          <p>{current.description}</p>
          <dl>
            <div><dt>Задача</dt><dd>{current.task}</dd></div>
            <div><dt>Решение</dt><dd>{current.solution}</dd></div>
            <div><dt>Результат</dt><dd>{current.result}</dd></div>
          </dl>
          <a href={current.href} target="_blank" rel="noopener noreferrer" className={styles.dialogLink}>Открыть работающий сайт ↗</a>
        </div>
      </div>
    </div>}
  </section>;
}
