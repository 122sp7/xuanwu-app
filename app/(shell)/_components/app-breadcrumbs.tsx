"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const SEGMENT_LABELS: Record<string, string> = {
  "organization": "組織",
  "workspace": "工作區",
  "wiki": "Wiki",
  "rag-query": "RAG 查詢",
  "documents": "文件",
  "libraries": "Libraries",
  "pages": "頁面",
  "pages-dnd": "頁面 (DnD)",
  "block-editor": "區塊編輯器",
  "rag-reindex": "RAG 重新索引",
  "ai-chat": "AI 對話",
  "dev-tools": "開發工具",
  "namespaces": "命名空間",
  "members": "成員",
  "teams": "團隊",
  "permissions": "權限",
  "workspaces": "工作區清單",
  "schedule": "排程",
  "daily": "每日",
  "audit": "稽核",
};

function segmentLabel(segment: string) {
  return SEGMENT_LABELS[segment] ?? segment;
}

export function AppBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Only render when there's more than one segment (i.e., not just root page).
  if (segments.length <= 1) return null;

  const crumbs: { label: string; href: string }[] = segments.map((seg, idx) => ({
    label: segmentLabel(seg),
    href: "/" + segments.slice(0, idx + 1).join("/"),
  }));

  return (
    <nav aria-label="Breadcrumb" className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
      {crumbs.map((crumb, idx) => (
        <span key={crumb.href} className="flex items-center gap-1">
          {idx > 0 && <ChevronRight className="size-3 opacity-40" />}
          {idx < crumbs.length - 1 ? (
            <Link
              href={crumb.href}
              className="transition hover:text-foreground"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
