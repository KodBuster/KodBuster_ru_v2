import { ArrowUpRight } from "@/components/icons";

const auditSteps = [
  { number: "01", title: "Покажем, что видит посетитель", text: "Изучим ваш сайт, подачу услуг, цены, доверие и путь к записи." },
  { number: "02", title: "Сопоставим с близкими конкурентами", text: "Проверим доступные страницы сопоставимых компаний по одинаковым критериям — с ссылками, без домыслов." },
  { number: "03", title: "Предложим конкретный следующий шаг", text: "Обозначим приоритеты и объясним, нужен ли вообще новый сайт и какой формат разумнее." },
] as const;

export function FomoAudit() {
  return (
    <section className="fomo-audit section-pad" id="audit" aria-labelledby="audit-title">
      <div className="container fomo-audit-shell">
        <div className="fomo-audit-copy">
          <p className="section-kicker"><i /> 02 / Не верьте на слово</p>
          <h2 id="audit-title">Проверим,<br /><em>где теряется</em><br />ясность выбора.</h2>
          <p>Прежде чем предлагать разработку, разберём вашу цифровую презентацию. Если менять сайт не нужно, скажем об этом. Сначала факты — затем решение.</p>
          <a className="button button-primary" href="#contact"><span>Запросить разбор бизнеса</span><ArrowUpRight /></a>
        </div>
        <ol className="fomo-audit-list">
          {auditSteps.map((step) => (
            <li key={step.number}>
              <span>{step.number}</span>
              <div><strong>{step.title}</strong><p>{step.text}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
