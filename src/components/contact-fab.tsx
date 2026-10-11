"use client";

import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { CloseIcon, PhoneIcon } from "@/components/icons";
import { contacts } from "@/data/contacts";

declare global {
  interface Window {
    ym?: ((id: number, action: string, ...args: unknown[]) => void) & { a?: unknown[]; l?: number };
  }
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const metrikaId = Number(process.env.NEXT_PUBLIC_YM_ID ?? "");

function trackGoal(goal: string) {
  if (!metrikaId || typeof window.ym !== "function") return;
  window.ym(metrikaId, "reachGoal", goal);
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20.7 3.8 2.9 10.7c-1.2.5-1.2 1.1-.2 1.4l4.6 1.4 1.8 5.4c.2.6.4.8 1 .8.5 0 .7-.2 1-.6l2.7-2.6 5.6 4.1c1 .6 1.8.3 2-.9L22 5.1c.3-1.3-.5-1.9-1.3-1.3Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.5 5.5h15a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H9l-3.8 3.2a.6.6 0 0 1-1 .45V16.5H4.5A1.5 1.5 0 0 1 3 15V7A1.5 1.5 0 0 1 4.5 5.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type FabItem = {
  id: string;
  href: string;
  label: string;
  className: string;
  goal: string;
  external: boolean;
  icon: ReactNode;
};

export function ContactFab() {
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const root = rootRef.current;
      if (!root || root.contains(event.target as Node)) return;
      setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const items: FabItem[] = [];

  if (contacts.phoneHref) {
    items.push({
      id: "call",
      href: contacts.phoneHref,
      label: "Позвонить",
      className: "is-call",
      goal: "messenger_call",
      external: false,
      icon: <PhoneIcon />,
    });
  }

  items.push({
    id: "telegram",
    href: contacts.telegramUrl,
    label: "Telegram",
    className: "is-telegram",
    goal: "messenger_telegram",
    external: true,
    icon: <TelegramIcon />,
  });

  if (contacts.maxUrl) {
    items.push({
      id: "max",
      href: contacts.maxUrl,
      label: "MAX",
      className: "is-max",
      goal: "messenger_max",
      external: true,
      icon: (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`${basePath}/images/maxxx.svg`} alt="" width={28} height={28} aria-hidden="true" />
      ),
    });
  }

  if (!items.length) return null;

  return (
    <div
      id="contact-fab"
      ref={rootRef}
      className={`contact-fab${open ? " open" : ""}`}
    >
      <div id={menuId} className="contact-fab-menu" role="menu" aria-label="Связаться">
        {items.map((item) => (
          <a
            key={item.id}
            className={`contact-fab-item ${item.className}`}
            href={item.href}
            role="menuitem"
            aria-label={item.label}
            title={item.label}
            {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            onClick={() => {
              trackGoal(item.goal);
              setOpen(false);
            }}
          >
            <span className="contact-fab-label">{item.label}</span>
            <span className="contact-fab-icon">{item.icon}</span>
          </a>
        ))}
      </div>

      <button
        type="button"
        className="contact-fab-toggle"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? "Закрыть контакты" : "Открыть контакты"}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="contact-fab-toggle-icon is-open" aria-hidden="true"><MessageIcon /></span>
        <span className="contact-fab-toggle-icon is-close" aria-hidden="true"><CloseIcon /></span>
      </button>
    </div>
  );
}
