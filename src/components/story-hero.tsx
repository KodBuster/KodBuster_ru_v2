"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "@/components/icons";
import { contactAnchor } from "@/data/contacts";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const scenes = [
  {
    number: "01",
    title: "Вас находят",
    meta: "Поиск · Карты · Нейросети",
    copy: "Помогаем поиску, картам и нейросетям правильно понять, кому и чем полезен ваш бизнес.",
    image: "/images/hero-vet-owner.webp",
    alt: "Владелица ветеринарной клиники обсуждает расписание с администратором",
  },
  {
    number: "02",
    title: "Вам доверяют",
    meta: "Структура · Работы · Цены",
    copy: "Человек видит ваш подход, примеры и условия — и понимает, почему стоит обратиться именно к вам.",
    image: "/images/hero-cosmetology-owner.webp",
    alt: "Владелица косметологической клиники обсуждает обращения с управляющей",
  },
  {
    number: "03",
    title: "К вам обращаются",
    meta: "Заявка · Telegram · MAX",
    copy: "Клиент оставляет контакты, а собственник получает уведомление прямо на смартфон.",
    image: "/images/hero-auto-owner.webp",
    alt: "Собственник автоцентра проверяет новые обращения вместе с мастером-приёмщиком",
  },
] as const;

function PrimaryLink() {
  return (
    <a className="story-cta" href={contactAnchor}>
      <span>Обсудить проект</span><ArrowUpRight />
    </a>
  );
}

export function StoryHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeScene, setActiveScene] = useState(-1);

  useEffect(() => {
    const section = sectionRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!section || reducedMotion.matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      if (window.innerWidth < 960) {
        setActiveScene(-1);
        return;
      }

      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      const next = progress < 0.14 ? -1 : progress < 0.4 ? 0 : progress < 0.7 ? 1 : 2;
      setActiveScene((current) => current === next ? current : next);
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

  const active = activeScene >= 0 ? scenes[activeScene] : null;

  return (
    <>
      <section className="story-hero story-desktop" id="top" ref={sectionRef} aria-labelledby="hero-title">
        <div className="story-sticky">
          <div className="story-panels" data-active={activeScene}>
            {scenes.map((scene, index) => (
              <article className={`story-panel ${activeScene === index ? "is-active" : ""}`} key={scene.number}>
                <Image
                  className="story-photo"
                  src={`${basePath}${scene.image}`}
                  alt={scene.alt}
                  fill
                  priority
                  sizes="(min-width: 960px) 60vw, 100vw"
                />
                <div className="story-panel-shade" aria-hidden="true" />
                <div className="story-panel-label">
                  <strong>{scene.number} / {scene.title}</strong>
                  <span>{scene.meta}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="story-intro" data-hidden={activeScene !== -1}>
            <h1 id="hero-title">Разные бизнесы.<br />Одна цель — чтобы<br /><em>выбрали вас.</em></h1>
            <div className="story-intro-bottom">
              <div>
                <p className="story-kicker">Сайты для реального бизнеса</p>
                <p className="story-lead">Создаём сайты, которые показывают ценность вашего бизнеса, помогают сделать выбор и передают новую заявку прямо на смартфон.</p>
                <a className="story-work-link" href="#cases">Смотреть наши работы <ArrowUpRight /></a>
              </div>
              <PrimaryLink />
            </div>
          </div>

          <div className="story-active-copy" data-visible={Boolean(active)}>
            {active && (
              <div key={active.number} className="story-active-inner">
                <span>{active.number} / 03</span>
                <h2>{active.title}</h2>
                <p>{active.copy}</p>
                {activeScene === 2 && <PrimaryLink />}
              </div>
            )}
          </div>

          <div className="story-progress" aria-hidden="true">
            <i /><span>{activeScene < 0 ? "Листайте" : `${String(activeScene + 1).padStart(2, "0")} / 03`}</span>
          </div>
        </div>
      </section>

      <section className="story-mobile" aria-label="Как сайт приводит обращения">
        {scenes.map((scene, index) => (
          <article className="mobile-story-slide" key={scene.number}>
            <Image
              className="story-photo"
              src={`${basePath}${scene.image}`}
              alt={scene.alt}
              fill
              priority={index === 0}
              sizes="100vw"
            />
            <div className="mobile-story-shade" aria-hidden="true" />
            {index === 0 && (
              <div className="mobile-story-label">
                <strong>{scene.number} / {scene.title}</strong>
                <span>{scene.meta}</span>
              </div>
            )}

            {index === 0 ? (
              <div className="mobile-story-content mobile-story-intro">
                <h1>Разные бизнесы.<br />Одна цель —<br /><em>чтобы выбрали вас.</em></h1>
                <p className="story-kicker">Сайты для реального бизнеса</p>
                <p>Показываем ценность бизнеса и передаём новую заявку прямо на смартфон.</p>
                <PrimaryLink />
              </div>
            ) : (
              <div className="mobile-story-content">
                <p className="mobile-story-lockup">Разные бизнесы · Одна цель</p>
                <h2>{scene.title}</h2>
                <p className="story-kicker">{scene.meta}</p>
                <p>{scene.copy}</p>
                {index === 2 && <PrimaryLink />}
              </div>
            )}
          </article>
        ))}
      </section>
    </>
  );
}
