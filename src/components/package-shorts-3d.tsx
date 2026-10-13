import { contactAnchor } from "@/data/contacts";
import styles from "./package-shorts-3d.module.css";

/**
 * FOMO option 01 ("Внимание клиента").
 * Six concise cards — three service options and three practical purchase terms.
 * Keep terms and qualifications visible; no invented outcomes or scarcity claims.
 */
export const shortCards = [
  {
    title: "Старт",
    text: "Пока клиент знакомится с вашей компанией, он уже решает, стоит ли обращаться. Помогите ему увидеть ваш уровень.",
    art: "start",
  },
  {
    title: "Рост",
    text: "Реклама привлекает внимание. Важно не потерять его в момент, когда человек сравнивает вас с другими.",
    art: "growth",
  },
  {
    title: "Система",
    text: "У каждой вашей услуги есть причины для выбора. Дайте клиенту возможность увидеть их отдельно.",
    art: "system",
  },
  {
    title: "Оплата в три шага",
    text: "Не нужно оплачивать всё сразу. 50% до старта, 30% после согласования макета, 20% перед публикацией.",
    art: "payment",
  },
  {
    title: "Скидка 10%",
    text: "Если после разбора решите действовать, скидка 10% сохранится при первой оплате в течение трёх рабочих дней.",
    art: "discount",
  },
  {
    title: "От вас — минимум",
    text: "Фото, доступ к карточке на Картах и телефон для кодов регистратора. Остальное настроим мы.",
    art: "minimum",
  },
] as const;

type Art = (typeof shortCards)[number]["art"];

function Illustration({ kind }: { kind: Art }) {
  const pic = {
    start: (
      <svg viewBox="0 0 138 116" fill="none">
        <path className={styles.base} d="M13 93 74 80l53 15-62 14Z" />
        <g className={styles.solid}>
          <path fill="#7f8b98" d="M25 25 104 16l7 66-78 13Z"/>
          <path fill="#354556" d="M22 22 102 13l7 67-80 11Z"/>
          <path fill="#f8f9f8" d="M28 29 98 22l5 53-69 8Z"/>
          <path fill="#f77d37" d="M34 38 96 32l2 22-62 7Z"/>
          <path fill="#adb8c2" d="M39 67 81 62l1 4-43 6Z"/>
          <path fill="#c6cfd5" d="M40 76 90 70l1 4-51 6Z"/>
          <path fill="#ccd5dc" d="m29 91 82-12 19 17-88 14Z"/>
          <path fill="#929fac" d="m42 110 88-14v5l-88 13Z"/>
          <path fill="#f9fafb" d="m35 91 76-11 17 14-83 13Z"/>
          <path fill="#ff8b43" d="M91 56h15v7H92Z"/>
        </g>
        <circle cx="40" cy="25" r="1.7" fill="#f85f24"/><circle cx="45" cy="24.4" r="1.7" fill="#b0bbc5"/>
      </svg>
    ),
    growth: (
      <svg viewBox="0 0 138 116" fill="none">
        <path className={styles.base} d="M10 97 68 81l62 17-63 13Z"/>
        <g className={styles.solid}>
          <path fill="#ccd3d9" d="m27 71 18-5v32l-18 5Z"/>
          <path fill="#a3adb8" d="m45 66 6 5v31l-6-4Z"/>
          <path fill="#e5e9ec" d="m27 71 18-5 6 5-18 6Z"/>
          <path fill="#d3d9dd" d="m55 49 19-5v49l-19 5Z"/>
          <path fill="#9faab4" d="m74 44 6 6v47l-6-4Z"/>
          <path fill="#e9edf0" d="m55 49 19-5 6 6-19 5Z"/>
          <path fill="#ff8c43" d="m87 26 20-5v68l-20 5Z"/>
          <path fill="#d8591b" d="m107 21 7 6v66l-7-4Z"/>
          <path fill="#ffb06e" d="m87 26 20-5 7 6-20 5Z"/>
        </g>
        <path d="M17 64c25-2 30-19 54-27 15-5 26-6 38-19" stroke="#ff772c" strokeWidth="7" strokeLinecap="round"/>
        <path d="m99 15 14-2-1 14" stroke="#ff772c" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    system: (
      <svg viewBox="0 0 138 116" fill="none">
        <path className={styles.base} d="M10 96 69 80l59 15-59 14Z"/>
        <g className={styles.solid}>
          {[16,55,94].map((x,i)=><g key={x}>
            <rect x={x+3} y={27+i%2*7} width="34" height="65" rx="6" fill="#a4b0ba"/>
            <rect x={x} y={23+i%2*7} width="33" height="65" rx="6" fill="#f1f3f4" stroke="#c6ced4"/>
            <rect x={x+8} y={38+i%2*7} width="17" height="15" rx="4" fill="#fff0e2"/>
            <rect x={x+8} y={61+i%2*7} width="17" height="4" rx="2" fill="#a9b8c4"/>
            <rect x={x+8} y={68+i%2*7} width="12" height="4" rx="2" fill="#cad1d8"/>
            <rect x={x+8} y={78+i%2*7} width="17" height="4" rx="2" fill="#ff7833"/>
          </g>)}
        </g>
        <path d="M32 41h9M36.5 36.5v9" stroke="#ff7730" strokeWidth="3" strokeLinecap="round"/>
        <path d="M70 43h9M74.5 38.5v9" stroke="#ff7730" strokeWidth="3" strokeLinecap="round"/>
        <path d="M110 42h9M114.5 37.5v9" stroke="#ff7730" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
    payment: (
      <svg viewBox="0 0 138 116" fill="none">
        <path className={styles.base} d="M12 99 73 82l53 16-57 12Z"/>
        <g className={styles.solid}>
          {[22,58,94].map((x,i)=><g key={x}>
            <rect x={x+5} y={20+i*9} width="28" height="60" rx="5" fill={i===0?"#c75b24":"#abb5bf"}/>
            <rect x={x} y={16+i*9} width="28" height="60" rx="5" fill={i===0?"#ff8e47":"#edf0f3"} stroke={i===0?"#f4a777":"#ccd3da"}/>
            <text x={x+14} y={54+i*9} textAnchor="middle" fontSize="23" fontWeight="900" fill={i===0?"white":"#67798b"}>{i+1}</text>
          </g>)}
        </g>
        <ellipse cx="33" cy="95" rx="16" ry="6" fill="#ed9d44"/><path d="M17 91v8c0 8 32 8 32 0v-8" fill="#f59a28"/><ellipse cx="33" cy="91" rx="16" ry="6" fill="#ffd076"/>
        <ellipse cx="80" cy="99" rx="13" ry="5" fill="#e59a45"/><path d="M67 96v5c0 6 26 6 26 0v-5" fill="#f39a33"/><ellipse cx="80" cy="96" rx="13" ry="5" fill="#ffca6a"/>
      </svg>
    ),
    discount: (
      <svg viewBox="0 0 138 116" fill="none">
        <path className={styles.base} d="M11 95 75 79l51 19-63 11Z"/>
        <g className={styles.solid}>
          <path d="m30 49 51-32 40 25-6 52-54 12-31-57Z" fill="#c65219"/>
          <path d="m24 43 53-32 40 25-8 51-54 12-31-56Z" fill="#ff842d"/>
          <path d="m31 44 47-26 31 21-6 42-46 10-26-47Z" stroke="#ffc17d" strokeWidth="2" />
          <circle cx="80" cy="30" r="6" fill="#fff3df"/>
          <path d="M79 24q-3-17 12-17" stroke="#71818d" strokeWidth="6" strokeLinecap="round"/>
          <text x="73" y="72" textAnchor="middle" fontSize="29" fontWeight="900" fill="white" transform="rotate(-11 73 72)">10%</text>
        </g>
      </svg>
    ),
    minimum: (
      <svg viewBox="0 0 138 116" fill="none">
        <path className={styles.base} d="M12 97 78 80l50 16-64 15Z"/>
        <g className={styles.solid}>
          <path fill="#b8c4cc" d="M22 41h61v55H22Z" transform="rotate(-9 22 41)"/>
          <rect x="17" y="34" width="66" height="52" rx="7" transform="rotate(-9 17 34)" fill="#f2f4f4" stroke="#c1cbd2"/>
          <circle cx="39" cy="53" r="10" fill="#ff8c45"/>
          <path d="M24 78q14-17 27-2" stroke="#aab7c2" strokeWidth="5"/>
          <path d="M55 46h17M57 54h13M58 62h12" stroke="#a5b3bd" strokeWidth="4" strokeLinecap="round"/>
          <rect x="85" y="13" width="41" height="84" rx="10" fill="#82939f"/>
          <rect x="81" y="10" width="41" height="84" rx="10" fill="#2e4050" stroke="#576979" strokeWidth="3"/>
          <rect x="86" y="20" width="31" height="65" rx="5" fill="#d6e0e4"/>
          <circle cx="101.5" cy="50" r="14" fill="#ff7e36"/>
          <path d="M96 44c2-1 3-1 4 2l-1 2c2 3 4 5 7 6l2-2c3 1 3 3 2 5-6 3-16-7-16-12l2-1Z" fill="white"/>
          <path d="M95 14h15" stroke="#aab8c1" strokeWidth="3" strokeLinecap="round"/>
        </g>
      </svg>
    ),
  }[kind];
  return <div className={styles.illustration} aria-hidden="true"><span className={styles.halo} />{pic}</div>;
}

export function PackageShorts3D() {
  return <section className={styles.section} aria-labelledby="package-short-title" data-variant="attention">
    <h4 id="package-short-title" className={styles.title}>Если совсем коротко</h4>
    <ul className={styles.grid}>
      {shortCards.map(({ title, text, art }) =>
        <li className={styles.card} key={title}>
          <div className={styles.copy}>
            <h5>{title}</h5>
            <p>{text}</p>
          </div>
          <Illustration kind={art}/>
        </li>
      )}
    </ul>
    <div className={styles.footer}>
      <div className={styles.notes}>
        <p>Реклама в Яндекс Директе, отслеживание звонков и сбор заявок в CRM подключаем отдельно после запуска.</p>
        <p>Обсудим на разборе, когда будет понятно, что нужно именно вам.</p>
      </div>
      <a className={styles.cta} href={contactAnchor}>Посмотреть на мой сайт глазами клиента <span aria-hidden="true">↗</span></a>
    </div>
  </section>;
}
