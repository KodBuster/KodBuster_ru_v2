"use client";

import { useEffect } from "react";

const HASH = "#tarif-start";

function scrollToTarifStart() {
  if (window.location.hash !== HASH) return;
  const target = document.querySelector("#tarif-start");
  if (!(target instanceof HTMLElement)) return;
  target.scrollIntoView({ block: "start" });
}

/** Scrolls #tarif-start to the visible Start tariff preview (desktop row / mobile under card). */
export function TarifStartAnchor() {
  useEffect(() => {
    const run = () => {
      window.requestAnimationFrame(scrollToTarifStart);
    };

    run();
    window.addEventListener("hashchange", run);
    window.addEventListener("load", run);
    const mq = window.matchMedia("(min-width: 960px)");
    mq.addEventListener("change", run);
    return () => {
      window.removeEventListener("hashchange", run);
      window.removeEventListener("load", run);
      mq.removeEventListener("change", run);
    };
  }, []);

  return null;
}
