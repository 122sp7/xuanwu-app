"use client";

/**
 * NotionKnowledgeSection — top-level knowledge hub for the notion.knowledge tab.
 * Shows page count summary and quick links.
 */

import { FileText, BookOpen, Layout, LayoutGrid } from "lucide-react";
import Link from "next/link";

interface NotionKnowledgeSectionProps {
  workspaceId: string;
  accountId: string;
}

export function NotionKnowledgeSection({ workspaceId, accountId }: NotionKnowledgeSectionProps): React.ReactElement {
  const base = `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}`;

  const items = [
    {
      href: `${base}?tab=Pages`,
      label: "頁面",
      description: "階層化內容頁面",
      icon: <FileText className="size-4 text-muted-foreground" />,
    },
    {
      href: `${base}?tab=Database`,
      label: "資料庫",
      description: "結構化資料集合",
      icon: <LayoutGrid className="size-4 text-muted-foreground" />,
    },
    {
      href: `${base}?tab=Templates`,
      label: "模板",
      description: "可重複使用的頁面 / 資料庫骨架",
      icon: <Layout className="size-4 text-muted-foreground" />,
    },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BookOpen className="size-4 text-primary" />
        <h2 className="text-sm font-semibold">知識中心</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col gap-2 rounded-xl border border-border/40 p-4 transition hover:bg-muted/40"
          >
            {item.icon}
            <p className="text-sm font-medium">{item.label}</p>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  ) as React.ReactElement;
}
