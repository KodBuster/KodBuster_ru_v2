"use client";

import { useEffect, useState } from "react";

const storageKey = "kb-cookie-choice";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const metrikaId = Number(process.env.NEXT_PUBLIC_YM_ID ?? "");

function loadMetrika() {
  if (!metrikaId || document.getElementById("ym-tag")) return;
  const script = document.createElement("script");
  script.id = "ym-tag";
  script.src = "https://mc.yandex.ru/metrika/tag.js";
  script.async = true;
  document.head.appendChild(script);
  window.ym = window.ym || Object.assign(function (...args: unknown[]) {
    const ym = window.ym;
    if (!ym) return;
    ym.a = ym.a || [];
    ym.a.push(args);
  }, { a: [] as unknown[], l: Date.now() });
  window.ym.l = Date.now();
  window.ym(metrikaId, "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: false,
  });
}

export function CookieNotice() {
  const [choice, setChoice] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    setChoice(saved);
    setReady(true);
    if (saved === "accept") loadMetrika();
  }, []);

  const choose = (value: "accept" | "decline") => {
    window.localStorage.setItem(storageKey, value);
    setChoice(value);
    if (value === "accept") loadMetrika();
  };

  if (!ready || choice) return null;

  return (
    <div className="cookie-notice" role="dialog" aria-label="Файлы cookie">
      <div className="cookie-notice-inner">
        <p>
          Сайт запоминает ваш выбор и включает cookie Яндекс Метрики только после согласия.
          Счётчик нужен для статистики визитов, не для рекламы.{" "}
          <a href={`${basePath}/privacy/#cookies`}>Как устроены cookie</a>
        </p>
        <div className="cookie-actions">
          <button className="button button-primary" type="button" onClick={() => choose("accept")}>Разрешить</button>
          <button className="button button-outline" type="button" onClick={() => choose("decline")}>Отказаться</button>
        </div>
      </div>
    </div>
  );
}
