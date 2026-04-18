/**
 * @module ui-visualization
 * Presentation-only visualization primitives.
 */

import { createElement, type ReactNode } from "react";

export interface StatCardProps {
  label: string;
  value: string | number;
  caption?: string;
  icon?: ReactNode;
}

export const StatCard = ({ label, value, caption, icon }: StatCardProps) =>
  createElement(
    "article",
    { className: "rounded-md border p-4" },
    createElement(
      "div",
      { className: "flex items-center justify-between gap-3" },
      createElement("p", { className: "text-sm text-muted-foreground" }, label),
      icon,
    ),
    createElement("p", { className: "mt-2 text-2xl font-semibold" }, String(value)),
    caption
      ? createElement("p", { className: "mt-1 text-xs text-muted-foreground" }, caption)
      : null,
  );
