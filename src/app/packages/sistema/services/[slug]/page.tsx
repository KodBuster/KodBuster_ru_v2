import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PackageChoiceButton } from "@/components/package-choice";
import { PackageDemoShell } from "@/components/package-demo-shell";
import {
  packageBySlug,
  sistemaDirectionBySlug,
  sistemaDirections,
  sistemaServiceHref,
} from "@/data/site";
import { pageUrl } from "@/lib/site-url";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const item = packageBySlug("sistema")!;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return sistemaDirections.map((direction) => ({ slug: direction.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const direction = sistemaDirectionBySlug(slug);
  if (!direction) return {};

  return {
    title: `${direction.title} — демо пакета «Система»`,
    description: direction.description,
    alternates: {
      canonical: pageUrl(sistemaServiceHref(direction.slug).replace(/^\//, "")),
    },
    robots: { index: true, follow: true },
  };
}

export default async function SistemaServiceDemoPage({ params }: PageProps) {
  const { slug } = await params;
  const direction = sistemaDirectionBySlug(slug);
  if (!direction) notFound();

  return (
    <PackageDemoShell
      iframeSrc={`${basePath}/demos/sistema/services/${direction.slug}.html`}
      iframeTitle={`Демо направления «${direction.title}» — пакет Система`}
      ctaSelector="#g2-configure"
      ariaLabel={`Действия пакета Система, направление ${direction.title}`}
      bar={
        <div className="package-demo-bar-inner">
          <div className="package-demo-meta">
            <span className="package-demo-pill">Демо</span>
            <strong>
              Система · {direction.title}
            </strong>
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
