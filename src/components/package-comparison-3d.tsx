"use client";

import { useCallback, useRef, useState } from "react";
import { PackageChoiceButton } from "@/components/package-choice";
import { packageComparison, packages } from "@/data/site";
import styles from "./package-comparison-3d.module.css";

type TierKey = "start" | "growth" | "system";

const columns: { key: TierKey; title: string; subtitle: string; icon: "plane" | "bars" | "crown" }[] = [
  { key: "start", title: "Старт", subtitle: "Быстрый запуск", icon: "plane" },
  { key: "growth", title: "Рост", subtitle: "Больше клиентов", icon: "bars" },
  { key: "system", title: "Система", subtitle: "Продвижение услуг", icon: "crown" },
];

const featureIcons = [
  "target", "monitor", "chart", "message", "type", "image", "tag", "shield",
  "chart", "link", "pin", "megaphone", "layers", "gear", "clock", "coins",
] as const;

function FeatureIcon({ kind }: { kind: (typeof featureIcons)[number] }) {
  const common = { stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const shape = {
    target: <><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/></>,
    monitor: <><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></>,
    chart: <><path d="M4 20V4M4 20h17"/><path d="M8 16v-4M13 16V8M18 16V5"/></>,
    message: <><path d="M5 5h14v12H9l-4 3V5Z"/><path d="M8 9h8M8 13h6"/></>,
    type: <><path d="M4 6h16M12 6v13M8 19h8"/></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.4"/><path d="m4 17 5-5 3 3 3-3 5 5"/></>,
    tag: <><path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9-9-9Z"/><circle cx="8" cy="8" r="1.2"/></>,
    shield: <><path d="m12 2 8 3v6c0 5-3 8-8 11-5-3-8-6-8-11V5l8-3Z"/><path d="m8 12 3 3 5-6"/></>,
    link: <><path d="M9 15 15 9"/><path d="M8 11H7a4 4 0 0 0 0 8h4a4 4 0 0 0 4-4v-1M16 13h1a4 4 0 0 0 0-8h-4a4 4 0 0 0-4 4v1"/></>,
    pin: <><path d="M19 10c0 5-7 12-7 12S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    megaphone: <><path d="M4 10h5l10-5v14L9 14H4v-4Z"/><path d="m9 14 2 6"/></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5"/></>,
    gear: <><circle cx="12" cy="12" r="3"/><path d="m10 2-.5 2.3-2 1.2L5.3 4 3 6.5l1.5 2.2-.5 2.4L2 12l2 1 .5 2.3L3 17.5 5.3 20l2.2-1.5 2 1.2L10 22h4l.5-2.3 2-1.2 2.2 1.5 2.3-2.5-1.5-2.2.5-2.3 2-1-2-1 .5-2.3L21 6.5 18.7 4l-2.2 1.5-2-1.2L14 2h-4Z"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 3"/></>,
    coins: <><ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v5c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 11v5c0 1.7 3.6 3 8 3s8-1.3 8-3v-5"/></>,
  }[kind];
  return <svg viewBox="0 0 24 24" fill="none" {...common} aria-hidden="true">{shape}</svg>;
}

function TierSymbol({ kind }: { kind: "plane" | "bars" | "crown" }) {
  return <span className={styles.tierSymbol} aria-hidden="true">
    {kind === "bars" ? <span className={styles.growthBars}><i/><i/><i/></span> :
      kind === "plane" ? <svg viewBox="0 0 50 50" fill="none"><path d="m5 23 39-16-12 36-9-14-18-6Z" fill="#fff"/><path d="m23 29 21-22-12 36-9-14ZM5 23l39-16-21 22-18-6Z" stroke="#142439" strokeWidth="2" strokeLinejoin="round"/></svg> :
      <svg viewBox="0 0 52 52" fill="none"><path d="m6 14 9 11 11-15 11 15 9-11-5 24H11L6 14Z" fill="#e6eef8" stroke="#132237" strokeWidth="2"/><path d="M11 42h30" stroke="#132237" strokeWidth="3" strokeLinecap="round"/><circle cx="6" cy="14" r="3" fill="#f90"/><circle cx="26" cy="10" r="3" fill="#f90"/><circle cx="46" cy="14" r="3" fill="#f90"/></svg>}
  </span>;
}

function Value({ value }: { value: boolean | string }) {
  if (value === true) return <span className={styles.check} role="img" aria-label="Включено">✓</span>;
  if (value === false) return <span className={styles.dash} aria-label="Не включено">—</span>;
  if (value.startsWith("✓")) return <span className={styles.checkText}><span className={styles.check} aria-hidden="true">✓</span><span>{value.replace(/^✓\s*/, "")}</span></span>;
  return <>{value}</>;
}

export function PackageComparison3D() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<TierKey>("start");

  const focusTier = useCallback((tier: TierKey) => {
    setSelected(tier);
    const scrollArea = scrollRef.current;
    if (!scrollArea) return;
    const cell = scrollArea.querySelector<HTMLElement>(`[data-tier-heading="${tier}"]`);
    const firstColumn = scrollArea.querySelector<HTMLElement>(`[data-tier-heading="features"]`);
    if (!cell || !firstColumn) return;
    const dest = cell.offsetLeft - firstColumn.offsetWidth;
    scrollArea.scrollTo({ left: Math.max(0, dest), behavior: "auto" });
  }, []);

  return <div className={styles.board}>
    <p className={styles.mobileHint}>Сравните характеристики — прокрутите таблицу в сторону или выберите тариф:</p>
    <div className={styles.mobileControls} aria-label="Перейти к столбцу тарифа">
      {columns.map((col) => <button type="button" key={col.key}
        aria-label={`Показать тариф ${col.title}`} aria-pressed={selected === col.key}
        onClick={() => focusTier(col.key)}>{col.title}</button>)}
    </div>
    <div className={`pkg-table-wrap ${styles.viewport}`} ref={scrollRef} tabIndex={0} role="region" aria-label="Сравнение тарифов Старт, Рост, Система">
      <table className={`pkg-table ${styles.table}`}>
        <colgroup>
          <col className={styles.featuresCol} />
          {columns.map((col) => <col key={col.key} className={styles.planCol}/>)}
        </colgroup>
        <thead><tr>
          <th scope="col" data-tier-heading="features" className={styles.featuresHeader}><span>Возможности и услуги</span></th>
          {columns.map((col) => <th key={col.key} scope="col" data-tier-heading={col.key} className={styles[col.key]}>
            <div className={styles.topCap}>
              <TierSymbol kind={col.icon}/>
              <span className={styles.headText}><b>{col.title}</b><small>{col.subtitle}</small></span>
            </div>
          </th>)}
        </tr></thead>
        <tbody>{packageComparison.rows.map((row, index) => {
          const isPrice = row.feature === "Стоимость";
          return <tr key={row.feature} className={isPrice ? `is-price ${styles.priceRow}` : styles.standardRow}>
            <th scope="row" className={styles.featureCell}><span className={styles.featureInner}><span className={styles.featureIcon}><FeatureIcon kind={featureIcons[index]} /></span><span>{row.feature}</span></span></th>
            {columns.map((col) => <td key={col.key} className={styles[col.key]}>
              {isPrice ?
                <div className={styles.priceContents}><strong>{String(row[col.key])}</strong><PackageChoiceButton label={col.title} className={styles.priceLink}>
                  Выбрать {col.title}<span aria-hidden="true">↗</span>
                </PackageChoiceButton></div>
                : <Value value={row[col.key]}/>}
            </td>)}
          </tr>;
        })}</tbody>
      </table>
    </div>
    <p className={styles.mobileAfter}>Все характеристики и условия сохранены. Прокрутка не меняет выбранный пакет — он выбирается кнопкой под ценой.</p>
  </div>;
}
