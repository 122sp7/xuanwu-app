"use client";

/**
 * shell-breadcrumbs.tsx
 * Purpose: Render breadcrumb navigation in the shell header based on current pathname.
 * Responsibilities: parse URL segments into labelled crumbs, render clickable trail.
 * Constraints: client-only; must not import domain logic.
 */

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

/** Map of URL path segments to human-readable labels. */
const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "儀表板",
  organization: "組織",
  members: "成員",
  teams: "團隊",
  permissions: "權限",
  workspaces: "工作區",
  schedule: "排程",
  daily: "每日",
  audit: "稽核",
  workspace: "工作區中心",
  "wiki-beta": "Wiki-Beta",
  "rag-query": "RAG 查詢",
  "rag-reindex": "RAG 重新索引",
  documents: "文件",
  pages: "頁面",
  libraries: "Libraries",
  namespaces: "命名空間",
  "block-editor": "區塊編輯器",
  "ai-chat": "AI 對話",
  settings: "個人設定",
  "dev-tools": "開發工具",
};

interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent: boolean;
}

function buildCrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = SEGMENT_LABELS[segment] ?? segment;
    return { label, href, isCurrent: index === segments.length - 1 };
  });
}

interface ShellBreadcrumbsProps {
  pathname: string;
}

export function ShellBreadcrumbs({ pathname }: ShellBreadcrumbsProps) {
  const crumbs = buildCrumbs(pathname);

  if (crumbs.length <= 1) {
    // Single-segment paths don't need a breadcrumb trail
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 rounded transition hover:text-foreground"
        aria-label="首頁"
      >
        <Home className="size-3 shrink-0" />
      </Link>

      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1">
          <ChevronRight className="size-3 shrink-0 opacity-50" />
          {crumb.isCurrent ? (
            <span aria-current="page" className="font-medium text-foreground">
              {crumb.label}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className="rounded transition hover:text-foreground"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
