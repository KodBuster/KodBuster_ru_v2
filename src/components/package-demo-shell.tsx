"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const MOBILE_MQ = "(max-width: 760px)";
const SHOW_EVERY = 480;
const HIDE_MS = 5500;
const DEFAULT_CTA = "#request, #smart-lead, #main-cta, #lead";

export function PackageDemoShell({
  bar,
  iframeSrc,
  iframeTitle,
  ctaSelector = DEFAULT_CTA,
  ariaLabel = "Действия пакета",
}: {
  bar: ReactNode;
  iframeSrc: string;
  iframeTitle: string;
  ctaSelector?: string;
  ariaLabel?: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const softBtnRef = useRef<HTMLButtonElement>(null);
  const ctaSelectorRef = useRef(ctaSelector);
  const [collapsed, setCollapsed] = useState(false);
  const [softBook, setSoftBook] = useState(false);
  const [frameSrc, setFrameSrc] = useState(iframeSrc);
  const softBookRef = useRef(false);
  const hideTimerRef = useRef(0);
  const lastYRef = useRef(0);
  const lastShownYRef = useRef(Number.NEGATIVE_INFINITY);
  const didEnterRef = useRef(false);

  useEffect(() => {
    ctaSelectorRef.current = ctaSelector;
  }, [ctaSelector]);

  useEffect(() => {
    softBookRef.current = softBook;
  }, [softBook]);

  useEffect(() => {
    const base = iframeSrc.split("#")[0];
    const applyHash = () => {
      const hash = window.location.hash;
      setFrameSrc(hash && hash !== "#" ? `${base}${hash}` : base);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [iframeSrc]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let removeScroll: (() => void) | undefined;
    const mq = window.matchMedia(MOBILE_MQ);

    const findCta = (doc: Document) =>
      doc.querySelector(ctaSelectorRef.current) as HTMLElement | null;

    const applySoft = (next: boolean) => {
      softBookRef.current = next;
      setSoftBook(next);
      const btn = softBtnRef.current;
      if (btn) {
        btn.classList.toggle("is-visible", next);
        btn.setAttribute("aria-hidden", String(!next));
        btn.tabIndex = next ? 0 : -1;
      }
    };

    const showSoftBook = (next: boolean) => {
      if (!mq.matches) {
        window.clearTimeout(hideTimerRef.current);
        applySoft(false);
        return;
      }
      if (next) {
        const win = iframe.contentWindow;
        lastShownYRef.current = win?.scrollY || 0;
        window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = window.setTimeout(() => applySoft(false), HIDE_MS);
      } else {
        window.clearTimeout(hideTimerRef.current);
      }
      applySoft(next);
    };

    const bind = () => {
      removeScroll?.();
      const win = iframe.contentWindow;
      const doc = iframe.contentDocument;
      if (!win || !doc) return;

      const request = findCta(doc);
      lastYRef.current = win.scrollY || 0;
      didEnterRef.current = false;

      const nearRequest = () => {
        if (!request) return false;
        return (win.scrollY || 0) + win.innerHeight * 0.62 >= request.offsetTop;
      };

      const pastHero = () =>
        (win.scrollY || 0) > Math.min(200, win.innerHeight * 0.3);

      const canShowSoft = () => mq.matches && !nearRequest() && pastHero();

      const onScroll = () => {
        const y = win.scrollY || 0;
        const delta = y - lastYRef.current;
        lastYRef.current = y;

        if (y < 24) {
          setCollapsed(false);
        } else if (delta > 8) {
          setCollapsed(true);
        } else if (delta < -8) {
          setCollapsed(false);
        }

        if (!canShowSoft()) {
          if (softBookRef.current) showSoftBook(false);
          return;
        }

        if (!didEnterRef.current) {
          didEnterRef.current = true;
          showSoftBook(true);
          return;
        }

        if (delta < -6) {
          showSoftBook(true);
          return;
        }

        if (y - lastShownYRef.current >= SHOW_EVERY) {
          showSoftBook(true);
        }
      };

      win.addEventListener("scroll", onScroll, { passive: true });
      removeScroll = () => win.removeEventListener("scroll", onScroll);

      if (canShowSoft()) {
        didEnterRef.current = true;
        showSoftBook(true);
      }
    };

    const onLoad = () => bind();
    const onMq = () => {
      if (!mq.matches) showSoftBook(false);
    };

    iframe.addEventListener("load", onLoad);
    mq.addEventListener("change", onMq);
    if (iframe.contentDocument && findCta(iframe.contentDocument)) bind();

    return () => {
      iframe.removeEventListener("load", onLoad);
      mq.removeEventListener("change", onMq);
      removeScroll?.();
      window.clearTimeout(hideTimerRef.current);
    };
  }, []);

  const scrollToRequest = () => {
    window.clearTimeout(hideTimerRef.current);
    softBookRef.current = false;
    setSoftBook(false);
    softBtnRef.current?.classList.remove("is-visible");
    const doc = iframeRef.current?.contentDocument;
    const target = doc?.querySelector(ctaSelectorRef.current) as HTMLElement | null;
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className={`package-demo${collapsed ? " package-demo--bar-collapsed" : ""}`}>
      <div className="package-demo-bar" role="region" aria-label={ariaLabel}>
        {bar}
      </div>
      <iframe
        ref={iframeRef}
        className="package-demo-frame"
        src={frameSrc}
        title={iframeTitle}
        loading="eager"
      />
      <button
        ref={softBtnRef}
        type="button"
        className={`package-demo-soft-book${softBook ? " is-visible" : ""}`}
        aria-hidden={!softBook}
        tabIndex={softBook ? 0 : -1}
        onClick={scrollToRequest}
      >
        Записаться
      </button>
    </main>
  );
}
