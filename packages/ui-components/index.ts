/**
 * @module ui-components
 * Shared UI primitives without business semantics.
 */

import { createElement, type HTMLAttributes, type ReactNode } from "react";

export interface PageSectionProps extends HTMLAttributes<HTMLElement> {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export const PageSection = ({
  title,
  description,
  actions,
  children,
  ...rest
}: PageSectionProps) =>
  createElement(
    "section",
    rest,
    createElement(
      "header",
      { className: "mb-3 flex items-start justify-between gap-3" },
      createElement(
        "div",
        undefined,
        createElement("h2", { className: "text-lg font-semibold" }, title),
        description
          ? createElement("p", { className: "text-sm text-muted-foreground" }, description)
          : null,
      ),
      actions,
    ),
    children,
  );

export interface EmptyStateProps {
  title: string;
  description?: string;
}

export const EmptyState = ({ title, description }: EmptyStateProps) =>
  createElement(
    "div",
    { className: "rounded-md border border-dashed p-6 text-center" },
    createElement("p", { className: "font-medium" }, title),
    description
      ? createElement("p", { className: "mt-2 text-sm text-muted-foreground" }, description)
      : null,
  );


