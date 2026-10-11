"use client";

import type { ReactNode } from "react";
import { ArrowUpRight } from "@/components/icons";
import { contactAnchor } from "@/data/contacts";
import { packageChoice, type PackageChoice } from "@/lib/lead-validation";

export const PACKAGE_CHOICE_KEY = "kb-package";
export const PACKAGE_CHOICE_EVENT = "kb-package-choice";

export function readPackageChoice(): PackageChoice | null {
  if (typeof window === "undefined") return null;
  return packageChoice(sessionStorage.getItem(PACKAGE_CHOICE_KEY));
}

export function publishPackageChoice(label: string) {
  const choice = packageChoice(label);
  if (!choice) return;
  sessionStorage.setItem(PACKAGE_CHOICE_KEY, choice);
  window.dispatchEvent(new CustomEvent<PackageChoice>(PACKAGE_CHOICE_EVENT, { detail: choice }));
}

export function PackageChoiceButton({
  label,
  className = "button button-outline",
  children,
}: {
  label: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <a className={className} href={contactAnchor} onClick={() => publishPackageChoice(label)}>
      {children ?? (
        <>
          <span>Выбрать «{label}»</span>
          <ArrowUpRight />
        </>
      )}
    </a>
  );
}
