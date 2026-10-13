import { PackageChoiceButton } from "@/components/package-choice";
import { packageComparison, packageHref, packages } from "@/data/site";
import { PackageShorts3D } from "@/components/package-shorts-3d";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function cellValue(value: string | boolean) {
  if (value === true) return <span className="pkg-check" aria-label="Есть">✓</span>;
  if (value === false) return <span className="pkg-empty" aria-hidden="true">—</span>;
  if (value.startsWith("✓")) {
    return (
      <span className="pkg-check-text">
        <span className="pkg-check" aria-hidden="true">✓</span>
        {value.replace(/^✓\s*/, "")}
      </span>
    );
  }
  return value;
}

export function PackageLayers() {
  return (
    <div className="pkg-stack">
      <p className="pkg-shared">
        Во всех пакетах — дизайн, тексты, мобильная версия, формы заявок, запуск сайта и техническая настройка.
        <span> Разница — в глубине маркетинговой проработки и количестве услуг, которые можно продвигать отдельно.</span>
      </p>

      <div className="pkg-chooser">
        {packages.map((item) => {
          const featured = item.featured;
          const isStart = item.label === "Старт";
          return (
            <article
              className={`pkg-card${featured ? " pkg-card--featured" : ""}`}
              key={item.label}
              id={isStart ? "tarif-start" : undefined}
              data-anchor={isStart ? "tarif-start-mobile" : undefined}
            >
              <div className="pkg-card-top">
                <div className="pkg-card-tags">
                  <span className="pkg-label">{item.label}</span>
                  {item.badge && <span className="pkg-badge">{item.badge}</span>}
                </div>
                <h3>{item.title}</h3>
                <p className="pkg-price">{item.price}</p>
                <p className="pkg-when">{item.text}</p>
              </div>

              <div className="pkg-card-body">
                <p className="pkg-list-title">{item.listTitle}</p>
                <ul className="pkg-list">
                  {item.items.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                <div className="pkg-result">
                  <span>Результат</span>
                  <p>{item.result}</p>
                </div>

                {item.upgrade && <p className="pkg-upgrade">{item.upgrade}</p>}

                <p className="pkg-term">Срок: {item.term}</p>
              </div>

              <div className="pkg-card-foot">
                <p className="pkg-price pkg-price--foot">{item.price}</p>
                <div className="pkg-card-actions">
                  <PackageChoiceButton
                    label={item.label}
                    className={featured ? "pkg-cta pkg-cta--primary" : "pkg-cta"}
                  >
                    Выбрать «{item.label}» <span aria-hidden="true">↗</span>
                  </PackageChoiceButton>
                  <a className="pkg-cta pkg-cta--ghost" href={`${basePath}${packageHref(item.slug)}`}>
                    Посмотреть
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <section className="pkg-compare" aria-labelledby="package-compare-title">
        <div className="pkg-compare-head">
          <h3 id="package-compare-title">{packageComparison.title}</h3>
          <p>{packageComparison.lead}</p>
        </div>

        <div className="pkg-table-wrap">
          <table className="pkg-table">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">Старт</th>
                <th scope="col">Рост</th>
                <th scope="col">Система</th>
              </tr>
            </thead>
            <tbody>
              {packageComparison.rows.map((row) => (
                <tr key={row.feature} className={row.feature === "Стоимость" ? "is-price" : undefined}>
                  <th scope="row">{row.feature}</th>
                  <td>{cellValue(row.start)}</td>
                  <td>{cellValue(row.growth)}</td>
                  <td>{cellValue(row.system)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PackageShorts3D />
      </section>
    </div>
  );
}
