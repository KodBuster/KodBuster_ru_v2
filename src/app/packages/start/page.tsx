import type { Metadata } from "next";
import { PackageChoiceButton } from "@/components/package-choice";
import { PackageDemoShell } from "@/components/package-demo-shell";
import { packageBySlug, packageHref } from "@/data/site";
import { pageUrl } from "@/lib/site-url";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const item = packageBySlug("start")!;

export const metadata: Metadata = {
  title: `Пакет «${item.label}» — демо сайта`,
  description: `${item.title}. ${item.price}. Демонстрационный сайт в тарифе «Старт».`,
  alternates: { canonical: pageUrl(packageHref("start").replace(/^\//, "")) },
  robots: { index: true, follow: true },
};

export default function StartPackageDemoPage() {
  return (
    <PackageDemoShell
      iframeSrc={`${basePath}/demos/start/`}
      iframeTitle="Демо сайта тарифа Старт"
      bar={
        <div className="package-demo-bar-inner">
          <div className="package-demo-meta">
            <span className="package-demo-pill">Демо</span>
            <strong>Старт</strong>
            <span className="package-demo-price">
              {item.price} · {item.term}
            </span>
          </div>
          <div className="package-demo-actions">
            <PackageChoiceButton label={item.label} className="pkg-cta pkg-cta--primary">
              Выбрать «{item.label}» <span aria-hidden="true">↗</span>
            </PackageChoiceButton>
            <a className="pkg-cta pkg-cta--ghost" href={`${basePath}/#packages`}>
              К пакетам
            </a>
          </div>
        </div>
      }
    />
  );
}
