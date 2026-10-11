"use client";

import { useState } from "react";
import { ArrowUpRight } from "@/components/icons";

type Sector = "detailing" | "beauty" | "renovation";

const sectors: Record<Sector, {
  label: string;
  service: string;
  imageLabel: string;
  weakness: string;
  strength: string;
  before: string[];
  after: string[];
}> = {
  detailing: {
    label: "Детейлинг", service: "Защитная оклейка автомобиля", imageLabel: "Детейлинг / защита кузова",
    weakness: "Посетителю сложно понять, чем вы отличаетесь от соседнего центра.",
    strength: "Посетитель может оценить работы, материалы, условия и путь к записи.",
    before: ["Общий перечень услуг", "Нет понятных кейсов по оклейке", "Контакт спрятан внизу"],
    after: ["Примеры работ и детали услуги", "Материалы, гарантии, ответы на вопросы", "Понятная запись рядом с предложением"],
  },
  beauty: {
    label: "Косметология", service: "Консультация специалиста", imageLabel: "Клиника / консультация",
    weakness: "Человеку не хватает оснований доверять процедуру и время специалисту.",
    strength: "На странице можно увидеть специалистов, подход и условия консультации.",
    before: ["Общий текст об услугах", "Непонятно, кто ведёт приём", "Нужно искать условия записи"],
    after: ["Профили и квалификация специалистов", "Прозрачные этапы консультации", "Чёткий путь к записи"],
  },
  renovation: {
    label: "Ремонт", service: "Ремонт квартиры под ключ", imageLabel: "Ремонт / квартиры",
    weakness: "Посетитель не видит процесс, состав работ и границы обязательств.",
    strength: "Кейсы, этапы и условия помогают заранее снять основные вопросы.",
    before: ["Фотографии без описания", "Нет этапов и условий", "Непонятно, как запросить смету"],
    after: ["Кейсы с описанием объёма работ", "Этапы и прозрачные условия", "Запрос расчёта по конкретной задаче"],
  },
};

export function FomoComparison() {
  const [sector, setSector] = useState<Sector>("detailing");
  const [emphasis, setEmphasis] = useState<"before" | "after">("after");
  const current = sectors[sector];

  return (
    <section className="fomo-section section-pad" id="compare" aria-labelledby="fomo-title">
      <div className="container">
        <div className="fomo-header">
          <p className="section-kicker light"><i /> 01 / Сравнение до первого звонка</p>
          <h2 id="fomo-title">Ваш бизнес может быть сильнее.<br /><em>Но видно ли это клиенту?</em></h2>
          <p>Потенциальный покупатель сравнивает страницы, работы и условия ещё до общения с вами. Показываем, как подача помогает обосновать выбор — без выдуманных цифр и обещаний продаж.</p>
        </div>

        <div className="fomo-lab">
          <div className="fomo-lab-top">
            <div>
              <span className="fomo-micro">ИНТЕРАКТИВНЫЙ ПРИМЕР / НЕ АУДИТ КОНКРЕТНОЙ КОМПАНИИ</span>
              <h3>Одна услуга.<br /><span>Два первых впечатления.</span></h3>
            </div>
            <div className="fomo-industries" role="group" aria-label="Выберите тип бизнеса">
              {(Object.keys(sectors) as Sector[]).map((key) => (
                <button className={sector === key ? "is-active" : ""} key={key} type="button" aria-pressed={sector === key} onClick={() => setSector(key)}>{sectors[key].label}</button>
              ))}
            </div>
          </div>

          <div className="fomo-compare-grid">
            <article className={`fomo-preview ${emphasis === "before" ? "is-spotlight" : ""}`}>
              <div className="fomo-browser"><i /><i /><i /><span>Типовая слабая подача</span></div>
              <div className="fomo-preview-body is-before">
                <div className="fomo-preview-meta">БИЗНЕС / ПРЕЗЕНТАЦИЯ</div>
                <div className="fomo-mock-photo"><span>{current.imageLabel}</span></div>
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
                <div className="fomo-mock-photo"><span>{current.imageLabel}</span></div>
                <h4>{current.service}</h4>
                <p>Что входит, как проходит работа, примеры и условия — всё на одной понятной странице.</p>
                <div className="fomo-mock-chips"><span>Работы</span><span>Условия</span><span>Этапы</span></div>
                <span className="fomo-mock-cta">Обсудить услугу →</span>
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
