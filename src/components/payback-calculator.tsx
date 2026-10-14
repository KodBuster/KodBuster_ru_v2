"use client";

import { useState } from "react";
import { ArrowUpRight } from "@/components/icons";
import { packages } from "@/data/site";

const tiers = packages.map((item) => ({
  label: item.label,
  price: Number(item.price.replace(/[^\d]/g, "")),
}));

const money = (value: number) => new Intl.NumberFormat("ru-RU").format(value);

export function PaybackCalculator() {
  const [tier, setTier] = useState("Рост");
  const [profit, setProfit] = useState("20000");
  const unitProfit = Number(profit);
  const price = tiers.find((item) => item.label === tier)?.price ?? 120000;
  const validProfit = Number.isFinite(unitProfit) && unitProfit > 0 && unitProfit <= 1000000000;
  const count = validProfit ? Math.ceil(price / unitProfit) : null;

  return (
    <section className="fomo-economy section-pad" id="economy" aria-labelledby="economy-title">
      <div className="container fomo-economy-grid">
        <div className="fomo-economy-intro">
          <p className="section-kicker"><i /> 04 / Экономика решения</p>
          <h2 id="economy-title">«Дорого» — не расчёт.<br /><em>Давайте посчитаем.</em></h2>
          <p>Задайте прибыль с одного дополнительного заказа. Калькулятор покажет, сколько таких заказов нужно для покрытия стоимости разработки.</p>
          <p className="fomo-economy-disclaimer">Это математическая модель, а не прогноз. Сайт сам по себе не гарантирует дополнительные заказы; реклама, сопровождение и прочие расходы здесь не учитываются.</p>
        </div>
        <div className="fomo-economy-card roi-flow-card">
          <p className="fomo-micro">ПРОВЕРЬТЕ НА СВОИХ ЧИСЛАХ</p>
          <fieldset className="fomo-economy-tiers">
            <legend>Стоимость проекта</legend>
            <div className="fomo-tier-controls">
              {tiers.map((item) => <button key={item.label} type="button" className={item.label === tier ? "is-selected" : ""} aria-pressed={item.label === tier} onClick={() => setTier(item.label)}><span>{item.label}</span><b>{money(item.price)} ₽</b></button>)}
            </div>
          </fieldset>
          <label className="fomo-economy-input" htmlFor="fomo-profit">Прибыль с одного дополнительного заказа, ₽
            <input id="fomo-profit" type="number" min="1" max="1000000000" step="1000" inputMode="numeric" value={profit} onChange={(event) => setProfit(event.target.value)} placeholder="Например, 20 000" />
          </label>
          <div className="fomo-economy-result roi-flow-result" role="status" aria-live="polite">
            <span>Чтобы покрыть стоимость разработки, потребуется</span>
            <div className="roi-flow-track" aria-label="Стоимость проекта разделить на прибыль с заказа равно количеству дополнительных заказов">
              <div className="roi-flow-stage"><small>Стоимость</small><b>{money(price)} ₽</b></div>
              <span className="roi-flow-operator" aria-hidden="true">÷</span>
              <div className="roi-flow-stage"><small>Прибыль</small><b>{validProfit ? money(unitProfit) + " ₽" : "—"}</b></div>
              <span className="roi-flow-operator" aria-hidden="true">=</span>
              <div className="roi-flow-stage roi-flow-answer"><small>Заказы</small><strong>{count === null ? "—" : money(count)}</strong></div>
            </div>
            <p>{count === null ? "Укажите положительную прибыль с заказа." : "дополнительных заказов за весь период окупаемости"}</p>
          </div>
          <a className="fomo-economy-link button button-primary roi-flow-cta" href="#contact">Разобрать мой бизнес <ArrowUpRight /></a>
        </div>
      </div>
    </section>
  );
}
