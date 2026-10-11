import type { Metadata } from "next";
import { PackageChoiceButton } from "@/components/package-choice";
import { PackageDemoShell } from "@/components/package-demo-shell";
import { packageBySlug, packageHref } from "@/data/site";
import { pageUrl } from "@/lib/site-url";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const item = packageBySlug("sistema")!;

export const metadata: Metadata = {
  title: `Пакет «${item.label}» — демо сайта`,
  description: `${item.title}. ${item.price}. Демонстрационный сайт в тарифе «Система».`,
  alternates: { canonical: pageUrl(packageHref("sistema").replace(/^\//, "")) },
  robots: { index: true, follow: true },
};

export default function SistemaPackageDemoPage() {
  return (
    <PackageDemoShell
      iframeSrc={`${basePath}/demos/sistema/`}
      iframeTitle="Демо сайта тарифа Система"
      ctaSelector="#smart-lead"
      ariaLabel="Действия пакета Система"
      bar={
        <div className="package-demo-bar-inner">
          <div className="package-demo-meta">
            <span className="package-demo-pill">Демо</span>
            <strong>Система</strong>
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
