"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Database, FileText, Layers, RefreshCw, Search } from "lucide-react";

import { WikiBetaHubView } from "@/modules/wiki-beta";

const quickEntryItems = [
  {
    href: "/wiki-beta/rag-query",
    label: "RAG Query",
    description: "執行 RAG 問答查詢並檢視回答與引用",
    icon: Search,
  },
  {
    href: "/wiki-beta/rag-reindex",
    label: "RAG Reindex",
    description: "對文件執行手動重整，重新處理 chunk/embedding",
    icon: RefreshCw,
  },
  {
    href: "/wiki-beta/documents",
    label: "Documents",
    description: "上傳、列表、狀態觀測 account-scoped 文件",
    icon: FileText,
  },
  {
    href: "/wiki-beta/pages",
    label: "Pages",
    description: "階層頁面管理，支援建立、更名與移動",
    icon: Layers,
  },
  {
    href: "/wiki-beta/libraries",
    label: "Libraries",
    description: "結構化資料表管理，支援欄位定義與記錄",
    icon: Database,
  },
] as const;

export default function WikiBetaPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <BookOpen className="size-4 text-primary" />
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Knowledge Platform</p>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Wiki Beta</h1>
        <p className="text-sm text-muted-foreground">
          wiki-beta 入口，專注 account-scoped 知識流程與 py_fn callable 協作。
        </p>
      </header>

      <section aria-label="快捷入口">
        <h2 className="mb-3 text-sm font-semibold text-foreground">快捷入口</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickEntryItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-start gap-3 rounded-lg border border-border/60 bg-background p-4 transition hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition group-hover:bg-primary/20">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <WikiBetaHubView onGoRagTest={() => router.push("/wiki-beta/rag-query")} />
    </div>
  );
}
