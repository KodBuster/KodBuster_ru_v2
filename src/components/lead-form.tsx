"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, CheckIcon } from "@/components/icons";
import { PACKAGE_CHOICE_EVENT, readPackageChoice } from "@/components/package-choice";
import { contacts } from "@/data/contacts";
import { formatPhone, packageChoice, phoneDigits, validateLead, type PackageChoice } from "@/lib/lead-validation";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const fallbackError = "Не удалось отправить заявку. Напишите нам в мессенджер или позвоните.";

type Status = "idle" | "sending" | "success";

declare global {
  interface Window {
    ym?: ((id: number, action: string, ...args: unknown[]) => void) & { a?: unknown[]; l?: number };
  }
}

function reachGoal(goal: string) {
  const counter = Number(process.env.NEXT_PUBLIC_YM_ID ?? "");
  if (counter && typeof window.ym === "function") window.ym(counter, "reachGoal", goal);
}

export function LeadForm() {
  const id = useId();
  const startedAt = useRef(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [chosenPackage, setChosenPackage] = useState<PackageChoice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const stored = readPackageChoice();
    if (stored) setChosenPackage(stored);
    const onChoice = (event: Event) => {
      const choice = packageChoice((event as CustomEvent<string>).detail);
      if (choice) setChosenPackage(choice);
    };
    window.addEventListener(PACKAGE_CHOICE_EVENT, onChoice);
    return () => window.removeEventListener(PACKAGE_CHOICE_EVENT, onChoice);
  }, []);

  const markStart = () => {
    if (startedAt.current) return;
    startedAt.current = Date.now();
    reachGoal("form_start");
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    const payload = {
      name: name.trim(),
      phone: `+${phoneDigits(phone)}`,
      comment: comment.trim(),
      consent,
      website,
      form_started_at: startedAt.current,
      ...(chosenPackage ? { package: chosenPackage } : {}),
    };

    const problem = validateLead(payload);
    if (problem) {
      setError(problem);
      return;
    }
    if (!contacts.leadEndpoint) {
      setError(fallbackError);
      return;
    }

    setError(null);
    setStatus("sending");
    try {
      const response = await fetch(contacts.leadEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, page: window.location.href }),
      });
      const data = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!response.ok || !data?.ok) {
        setError(data?.error || fallbackError);
        setStatus("idle");
        return;
      }
      setStatus("success");
      reachGoal("lead_submit");
    } catch {
      setError(fallbackError);
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <div className="lead-card lead-success" role="status" aria-live="polite">
        <span className="lead-success-icon"><CheckIcon /></span>
        <h3>Заявка отправлена</h3>
        <p>{name.trim()}, мы получили ваш номер {formatPhone(phone)}{chosenPackage ? ` и пакет «${chosenPackage}»` : ""}. Свяжемся с вами в рабочее время.</p>
        <p className="lead-success-hint">Если удобнее написать самим:</p>
        <div className="lead-messengers">
          <a href={contacts.telegramUrl} target="_blank" rel="noreferrer">Telegram <ArrowUpRight /></a>
          {contacts.maxUrl && <a href={contacts.maxUrl} target="_blank" rel="noreferrer">MAX <ArrowUpRight /></a>}
        </div>
      </div>
    );
  }

  return (
    <form className="lead-card" onSubmit={onSubmit} onFocusCapture={markStart} onPointerDownCapture={markStart} noValidate aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`}>Оставить заявку</h3>
      <p className="lead-intro">Имя и телефон. Перезвоним или напишем — как вам удобнее.</p>
      {chosenPackage && <p className="lead-choice">Пакет: «{chosenPackage}»</p>}

      <div className="lead-field">
        <label htmlFor={`${id}-name`}>Как к вам обращаться</label>
        <input
          id={`${id}-name`}
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Имя"
          value={name}
          onChange={(event) => { markStart(); setName(event.target.value); }}
          required
        />
      </div>

      <div className="lead-field">
        <label htmlFor={`${id}-phone`}>Мобильный телефон</label>
        <input
          id={`${id}-phone`}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+7 (9__) ___-__-__"
          value={phone}
          onChange={(event) => { markStart(); setPhone(formatPhone(event.target.value)); }}
          required
        />
      </div>

      <div className="lead-field">
        <label htmlFor={`${id}-comment`}>Чем занимаетесь <span>необязательно</span></label>
        <textarea
          id={`${id}-comment`}
          name="comment"
          rows={3}
          maxLength={1000}
          placeholder="Например: детейлинг в Подольске, сайта нет"
          value={comment}
          onChange={(event) => { markStart(); setComment(event.target.value); }}
        />
      </div>

      <div className="lead-honeypot" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Сайт</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
      </div>

      <label className="lead-consent">
        <input type="checkbox" name="consent" checked={consent} onChange={(event) => { markStart(); setConsent(event.target.checked); }} required />
        <span>Соглашаюсь на обработку имени, телефона и комментария, чтобы KodBuster связался со мной по заявке, в том числе через Telegram и MAX. Подробности — в <a href={`${basePath}/privacy/`}>политике конфиденциальности</a></span>
      </label>

      {error && <p className="lead-error" role="alert">{error}</p>}

      <button className={`button button-primary lead-submit${status === "sending" ? " is-sending" : ""}`} type="submit" disabled={!consent || status === "sending"}>
        <span>{status === "sending" ? "Отправляем…" : "Отправить заявку"}</span><ArrowUpRight />
      </button>
      <p className="lead-note">Заявка приходит нам в Telegram и MAX — так же, как будет у вас.</p>
    </form>
  );
}
