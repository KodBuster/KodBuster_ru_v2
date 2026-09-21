import Image from "next/image";
import { ArrowUpRight } from "@/components/icons";
import { SiteHeader } from "@/components/site-header";
import { cases, packages, processSteps, services } from "@/data/site";

const telegramUrl = "https://t.me/kodbuster";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function ArrowButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <a className={`button ${className}`} href={telegramUrl} target="_blank" rel="noreferrer"><span>{children}</span><ArrowUpRight /></a>;
}

function CaseVisual({ type }: { type: (typeof cases)[number]["visual"] }) {
  if (type === "padel") return <div className="case-art art-padel" aria-hidden="true"><span>COURT / 05</span><b>PADEL</b><i /></div>;
  if (type === "jewelry") return <div className="case-art art-jewelry" aria-hidden="true"><span>925 / LAB</span><b>СИНОНИМ</b><i /></div>;
  if (type === "balloons") return <div className="case-art art-balloons" aria-hidden="true"><span>ДОСТАВКА</span><b>ШАРОДУВЫ</b><i /><i /><i /></div>;
  return <div className="case-art art-commerce" aria-hidden="true"><span>SHOP / 24·7</span><b>FUNШАР</b><i /></div>;
}

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#content">Перейти к содержанию</a>
      <SiteHeader />
      <main id="content">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <Image className="hero-photo" src={`${basePath}/images/kodbuster-hero-28.webp`} alt="Владельцы бизнеса получают новые обращения на смартфоны" fill priority sizes="100vw" />
          <div className="hero-scrim" aria-hidden="true" />
          <div className="container hero-inner">
            <div className="hero-copy">
              <p className="kicker"><span>28</span><i /> Веб-решения для реального бизнеса</p>
              <h1 id="hero-title">Каждая заявка —<br /><em>сразу на смартфоне</em></h1>
              <p className="hero-subtitle">Продающий сайт под ключ</p>
              <p className="hero-lead">Создаём сайты, которые приводят клиентов. Новая заявка с сайта сразу приходит вам — на один смартфон или всей команде.</p>
              <div className="hero-actions">
                <ArrowButton className="button-primary">Обсудить проект</ArrowButton>
                <a className="text-link" href="#cases">Посмотреть кейсы <ArrowUpRight /></a>
              </div>
              <ul className="hero-benefits" aria-label="Ключевые преимущества">
                <li><span className="benefit-icon">↗</span><b>Мгновенные<br />уведомления</b></li>
                <li><span className="benefit-icon shield-icon">✓</span><b>Надёжное<br />решение</b></li>
                <li><span className="benefit-icon people-icon">2+</span><b>Вся команда<br />на связи</b></li>
              </ul>
            </div>

            <div className="notification-stage" aria-label="Пример уведомления о новой заявке">
              <div className="signal-line signal-one" aria-hidden="true" />
              <div className="signal-line signal-two" aria-hidden="true" />
              <div className="phone-card phone-back" aria-hidden="true">
                <div className="phone-speaker" /><div className="phone-time">09:41</div>
                <div className="notification"><i /><div><b>Новая заявка</b><span>с вашего сайта · сейчас</span></div></div>
              </div>
              <div className="phone-card phone-front">
                <div className="phone-speaker" aria-hidden="true" /><div className="phone-time" aria-hidden="true">09:41</div>
                <div className="notification"><i /><div><b>Новая заявка</b><span>с вашего сайта · сейчас</span></div></div>
                <div className="phone-copy"><span>Заявка получена</span><strong>Клиент уже ждёт ответа</strong></div>
              </div>
            </div>
          </div>
        </section>

        <section className="service-intro section-pad" id="services" aria-labelledby="services-title">
          <div className="container">
            <div className="section-heading heading-split">
              <div><p className="section-kicker"><i /> Наши услуги</p><h2 id="services-title">Всё, что нужно<br />для роста бизнеса</h2></div>
              <p>Не просто красивый экран. Собираем цифровой маршрут, который объясняет ценность, отвечает на вопросы и ведёт к заявке.</p>
            </div>
            <div className="service-grid">
              {services.map((service) => (
                <article className={`service-card accent-${service.accent}`} key={service.index}>
                  <span className="service-number">{service.index}</span>
                  <div className="service-symbol" aria-hidden="true">{service.index === "01" ? "Aa" : service.index === "02" ? "UX" : service.index === "03" ? "SEO" : "Я"}</div>
                  <h3>{service.title}</h3><p>{service.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="route section-pad" aria-labelledby="route-title">
          <div className="container route-grid">
            <div className="route-copy">
              <p className="section-kicker light"><i /> Один маршрут</p>
              <h2 id="route-title">От первого экрана<br />до сообщения на вашем телефоне.</h2>
              <p>Посетитель понимает предложение, выбирает услугу и оставляет контакты. Вы сразу узнаёте об обращении в привычном мессенджере.</p>
              <ArrowButton className="button-primary">Получить консультацию</ArrowButton>
            </div>
            <ol className="route-flow">
              <li><span>01</span><div><b>Клиент открывает сайт</b><small>С первого экрана понимает, чем вы полезны.</small></div></li>
              <li><span>02</span><div><b>Выбирает услугу</b><small>Видит работы, цены и подходящий пакет.</small></div></li>
              <li><span>03</span><div><b>Оставляет заявку</b><small>Кнопка действия всегда находится рядом.</small></div></li>
              <li className="route-active"><span>04</span><div><b>Вы получаете уведомление</b><small>Telegram или MAX · один или несколько смартфонов.</small></div></li>
            </ol>
          </div>
        </section>

        <section className="cases section-pad" id="cases" aria-labelledby="cases-title">
          <div className="container">
            <div className="section-heading heading-split">
              <div><p className="section-kicker"><i /> Кейсы</p><h2 id="cases-title">Проекты можно<br />открыть и проверить</h2></div>
              <p>Показываем реальные сайты, а не выдуманные цифры. Каждый проект решает свою задачу и говорит на языке своего бизнеса.</p>
            </div>
            <div className="case-grid">
              {cases.map((item, index) => (
                <a className={`case-card case-${item.tone}`} href={item.href} target="_blank" rel="noreferrer" key={item.title}>
                  <div className="case-top"><span>0{index + 1}</span><small>{item.category}</small><ArrowUpRight /></div>
                  <CaseVisual type={item.visual} />
                  <div className="case-copy"><h3>{item.title}</h3><p>{item.summary}</p><ul>{item.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul></div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="process section-pad" id="process" aria-labelledby="process-title">
          <div className="container process-layout">
            <div className="process-title-block"><p className="section-kicker light"><i /> Как работаем</p><h2 id="process-title">Без магии<br />и чёрного ящика</h2><p>Вы понимаете, что происходит на каждом этапе, что уже готово и какой следующий результат.</p></div>
            <ol className="process-list">{processSteps.map((step) => <li key={step.number}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol>
          </div>
        </section>

        <section className="packages section-pad" id="packages" aria-labelledby="packages-title">
          <div className="container">
            <div className="section-heading heading-split">
              <div><p className="section-kicker"><i /> Форматы работы</p><h2 id="packages-title">Выберите масштаб<br />вашего запуска</h2></div>
              <p>Точная стоимость зависит от структуры и материалов. Сначала коротко разбираем задачу, затем фиксируем состав и смету.</p>
            </div>
            <div className="package-grid">
              {packages.map((item, index) => (
                <article className={`package-card ${index === 0 ? "package-featured" : ""}`} key={item.label}>
                  <div><span className="package-label">{item.label}</span><h3>{item.title}</h3><strong>{item.price}</strong><p>{item.text}</p></div>
                  <ul>{item.items.map((feature) => <li key={feature}><span>✓</span>{feature}</li>)}</ul>
                  <ArrowButton className={index === 0 ? "button-primary" : "button-outline"}>Обсудить проект</ArrowButton>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="final-cta" id="contact" aria-labelledby="contact-title">
          <div className="container final-card">
            <div><p className="section-kicker light"><i /> Старт проекта</p><h2 id="contact-title">Ваш следующий клиент<br /><em>уже ищет вас.</em></h2></div>
            <div className="final-action"><p>Расскажите, что нужно запустить или переделать. Ответим по существу и предложим следующий шаг.</p><ArrowButton className="button-primary">Написать в Telegram</ArrowButton></div>
          </div>
        </section>
      </main>

      <footer className="footer"><div className="container footer-inner"><a className="brand" href="#top"><span>KODBUSTER</span></a><p>Сайты, которые приносят клиентов.</p><p>© {new Date().getFullYear()}</p></div></footer>
    </>
  );
}
