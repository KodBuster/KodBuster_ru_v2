import Image from "next/image";
import { ArrowUpRight, PhoneIcon } from "@/components/icons";
import { LeadForm } from "@/components/lead-form";
import { PackageChoiceButton } from "@/components/package-choice";
import { PortfolioReel } from "@/components/portfolio-reel";
import { SiteHeader } from "@/components/site-header";
import { StoryHero } from "@/components/story-hero";
import { contactAnchor, contacts } from "@/data/contacts";
import { JsonLd } from "@/components/json-ld";
import { packages, packageTerms, processSteps, services } from "@/data/site";
import { homeJsonLd } from "@/lib/json-ld";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function ArrowButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <a className={`button ${className}`} href={contactAnchor}><span>{children}</span><ArrowUpRight /></a>;
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeJsonLd()} />
      <a className="skip-link" href="#content">Перейти к содержанию</a>
      <SiteHeader />
      <main id="content">
        <StoryHero />

        <PortfolioReel />

        <section className="service-intro section-pad" id="services" aria-labelledby="services-title">
          <div className="container">
            <div className="section-heading heading-split">
              <div><p className="section-kicker"><i /> Наши услуги</p><h2 id="services-title">Всё, что нужно<br />для роста бизнеса</h2></div>
              <p>Не просто красивый экран. Собираем цифровой маршрут, который объясняет ценность, отвечает на вопросы и ведёт к заявке.</p>
            </div>
            <div className="service-grid">
              {services.map((service) => (
                <article className={`service-card accent-${service.accent}`} key={service.index}>
                  <div className="service-visual">
                    <Image src={service.image} alt={service.alt} width={900} height={900} sizes="(min-width: 960px) 25vw, (min-width: 700px) 50vw, 100vw" />
                    <span className="service-number">{service.index}</span>
                  </div>
                  <div className="service-body">
                    <h3>{service.title}</h3>
                    <p>{service.text}</p>
                  </div>
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

        <section className="process section-pad" id="process" aria-labelledby="process-title">
          <div className="container process-layout">
            <div className="process-title-block"><p className="section-kicker light"><i /> Как работаем</p><h2 id="process-title">Без магии<br />и чёрного ящика</h2><p>Вы понимаете, что происходит на каждом этапе, что уже готово и какой следующий результат.</p></div>
            <ol className="process-list">{processSteps.map((step) => <li key={step.number}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol>
          </div>
        </section>

        <section className="packages section-pad" id="packages" aria-labelledby="packages-title">
          <div className="container">
            <div className="section-heading heading-split">
              <div><p className="section-kicker"><i /> Пакеты и цены</p><h2 id="packages-title">Три пакета.<br />Одна задача — заявка.</h2></div>
              <p>Не конструктор и не шаблон за пять тысяч: своя страница и тексты, домен и хостинг оформлены на вас, заявки доходят до телефона. Цены фиксированные, без «от».</p>
            </div>
            <div className="package-grid">
              {packages.map((item) => {
                const featured = "featured" in item && item.featured;
                return (
                  <article className={`package-card ${featured ? "package-featured" : ""}`} key={item.label}>
                    <div className="package-top">
                      <div className="package-tags">
                        <span className="package-label">{item.label}</span>
                        {featured && <span className="package-badge">Чаще выбирают</span>}
                      </div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                    <div className="package-price">
                      <strong>{item.price}</strong>
                      <small><b>{item.fastPrice}</b> при быстрой предоплате</small>
                      <span className="package-term">Срок — {item.term}</span>
                    </div>
                    <ul>{item.items.map((feature) => <li key={feature}><span aria-hidden="true">✓</span>{feature}</li>)}</ul>
                    <p className="package-note">{item.note}</p>
                    <PackageChoiceButton label={item.label} className={featured ? "button-primary" : "button-outline"} />
                  </article>
                );
              })}
            </div>
            <dl className="package-terms">
              {packageTerms.map((term) => (
                <div key={term.title}><dt>{term.title}</dt><dd>{term.text}</dd></div>
              ))}
            </dl>
            <p className="package-after">Реклама в Яндекс Директе, отслеживание звонков и сбор заявок в CRM подключаем отдельно после запуска. Обсудим на разборе, когда будет понятно, что нужно именно вам.</p>
          </div>
        </section>

        <section className="final-cta" id="contact" aria-labelledby="contact-title">
          <div className="container final-card">
            <div className="final-copy">
              <p className="section-kicker light"><i /> Старт проекта</p>
              <h2 id="contact-title">Ваш следующий клиент<br /><em>уже ищет вас.</em></h2>
              <p>Расскажите, чем занимаетесь и что нужно запустить. Ответим по существу и предложим следующий шаг.</p>
              <ul className="contact-list" aria-label="Другие способы связи">
                {contacts.phone && contacts.phoneHref && (
                  <li><span>Позвонить</span><a href={contacts.phoneHref}><PhoneIcon />{contacts.phone}</a></li>
                )}
                <li><span>Telegram</span><a href={contacts.telegramUrl} target="_blank" rel="noreferrer">{contacts.telegramLabel} <ArrowUpRight /></a></li>
                {contacts.maxUrl && (
                  <li><span>MAX</span><a href={contacts.maxUrl} target="_blank" rel="noreferrer">Написать в MAX <ArrowUpRight /></a></li>
                )}
              </ul>
            </div>
            <LeadForm />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand"><a className="brand" href="#top"><span>KODBUSTER</span></a><p>Сайты, которые приносят клиентов.</p></div>
          <nav className="footer-contacts" aria-label="Контакты">
            {contacts.phone && contacts.phoneHref && <a href={contacts.phoneHref}><PhoneIcon />{contacts.phone}</a>}
            <a href={contacts.telegramUrl} target="_blank" rel="noreferrer">Telegram</a>
            {contacts.maxUrl && <a href={contacts.maxUrl} target="_blank" rel="noreferrer">MAX</a>}
            <a href={`${basePath}/privacy/`}>Политика конфиденциальности</a>
          </nav>
          <p className="footer-copy">© {new Date().getFullYear()} KodBuster</p>
        </div>
      </footer>
    </>
  );
}
