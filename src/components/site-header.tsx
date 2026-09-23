"use client";

import { useEffect, useState } from "react";
import { CloseIcon, MenuIcon, PhoneIcon } from "@/components/icons";
import { contactAnchor, contacts } from "@/data/contacts";
import { navigation } from "@/data/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#top" aria-label="KodBuster — на главную">
          <span>KODBUSTER</span>
          <small>сайты, которые<br />приносят клиентов</small>
        </a>

        <nav className="desktop-nav" aria-label="Основная навигация">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>

        <div className="header-actions">
          {contacts.phone && contacts.phoneHref && (
            <a className="header-phone" href={contacts.phoneHref}><PhoneIcon />{contacts.phone}</a>
          )}
          <a className="header-cta" href={contactAnchor}>
            Обсудить проект <span aria-hidden="true">→</span>
          </a>
        </div>

        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <div id="mobile-menu" className="mobile-menu" data-open={open} aria-hidden={!open}>
        <nav aria-label="Мобильная навигация">
          {navigation.map((item, index) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              <span>0{index + 1}</span>{item.label}
            </a>
          ))}
          <a className="mobile-menu-cta" href={contactAnchor} onClick={() => setOpen(false)}>
            Оставить заявку
          </a>
        </nav>
        <div className="mobile-menu-contacts">
          {contacts.phone && contacts.phoneHref && (
            <a href={contacts.phoneHref}><PhoneIcon />{contacts.phone}</a>
          )}
          <a href={contacts.telegramUrl} target="_blank" rel="noreferrer">Telegram</a>
          {contacts.maxUrl && <a href={contacts.maxUrl} target="_blank" rel="noreferrer">MAX</a>}
        </div>
      </div>
    </header>
  );
}
