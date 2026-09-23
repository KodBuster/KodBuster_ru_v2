"use client";

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

export function PackageChoiceButton({ label, className = "" }: { label: string; className?: string }) {
  return (
    <a className={`button ${className}`} href={contactAnchor} onClick={() => publishPackageChoice(label)}>
      <span>Выбрать «{label}»</span>
      <ArrowUpRight />
    </a>
  );
}
