"use client";

/**
 * Module: WorkspaceWikiTab
 * Purpose: workspace-level wiki (pages) tab — list, search, and navigate to wiki documents.
 * Responsibilities: render page list, handle search/filter, and expose stub create action.
 * Constraints: stub implementation — no backend integration yet. Keep UI-only concerns here.
 */

import { FileTextIcon, LockIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";

import type { WorkspaceEntity } from "@/modules/workspace";
import { Badge } from "@/ui/shadcn/ui/badge";
import { Button } from "@/ui/shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/shadcn/ui/card";
import { Input } from "@/ui/shadcn/ui/input";

interface WorkspaceWikiTabProps {
  readonly workspace: WorkspaceEntity;
}

type PageVisibility = "public" | "private" | "archived";

interface WikiPage {
  id: string;
  title: string;
  visibility: PageVisibility;
  updatedAt: string;
  updatedByName: string;
}

const VISIBILITY_LABELS: Record<PageVisibility, string> = {
  public: "公開",
  private: "私人",
  archived: "封存",
};

const VISIBILITY_TABS: Array<{ key: PageVisibility | "all"; label: string }> = [
  { key: "all", label: "全部" },
  { key: "public", label: "公開" },
  { key: "private", label: "私人" },
  { key: "archived", label: "封存" },
];

/** Stub pages — replace with real Firestore query when wiki domain is ready. */
const STUB_PAGES: WikiPage[] = [];

export function WorkspaceWikiTab({ workspace }: WorkspaceWikiTabProps) {
  const [search, setSearch] = useState("");
  const [activeVisibility, setActiveVisibility] = useState<PageVisibility | "all">("all");

  const filteredPages = useMemo(() => {
    let pages = STUB_PAGES;

    if (activeVisibility !== "all") {
      pages = pages.filter((p) => p.visibility === activeVisibility);
    }

    const trimmed = search.trim().toLowerCase();
    if (trimmed) {
      pages = pages.filter((p) => p.title.toLowerCase().includes(trimmed));
    }

    return pages;
  }, [search, activeVisibility]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold">Wiki</h2>
          <p className="text-xs text-muted-foreground">
            {workspace.name} 的共用知識頁面與文件。
          </p>
        </div>

        <Button size="sm" className="gap-1.5 self-start sm:self-auto" disabled>
          <PlusIcon className="size-4" />
          新增頁面
        </Button>
      </div>

      {/* Search + filter row */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="搜尋頁面…"
            className="h-8 pl-8 text-sm"
          />
        </div>

        <div className="flex gap-1 rounded-lg border border-border/50 bg-card/50 p-1" role="tablist" aria-label="頁面可見性篩選">
          {VISIBILITY_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeVisibility === tab.key}
              onClick={() => {
                setActiveVisibility(tab.key);
              }}
              className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                activeVisibility === tab.key
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Page list */}
      {filteredPages.length === 0 ? (
        <Card className="border border-border/50">
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <FileTextIcon className="size-10 text-muted-foreground/40" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {search.trim()
                  ? "找不到符合的頁面"
                  : activeVisibility === "all"
                    ? "尚未建立任何 Wiki 頁面"
                    : `尚未建立任何${VISIBILITY_LABELS[activeVisibility as PageVisibility]}頁面`}
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                點擊「新增頁面」以開始撰寫工作區知識文件。
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">頁面列表</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border/40">
              {filteredPages.map((page) => (
                <li
                  key={page.id}
                  className="flex items-center gap-3 px-4 py-3 transition hover:bg-muted/50"
                >
                  <FileTextIcon className="size-4 shrink-0 text-muted-foreground" />
                  <span className="flex-1 truncate text-sm font-medium">{page.title}</span>
                  <Badge variant="outline" className="shrink-0 text-xs">
                    <span className="flex items-center gap-1">
                      {page.visibility === "private" && <LockIcon className="size-3" />}
                      {VISIBILITY_LABELS[page.visibility]}
                    </span>
                  </Badge>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {page.updatedByName} · {page.updatedAt}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
