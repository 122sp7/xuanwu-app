"use client";

/**
 * NotionPagesSection — notion.pages tab — workspace knowledge pages.
 *
 * This surface is intentionally "Notion-like" rather than a full Notion API
 * clone. Pages carry lightweight workspace knowledge context that can be
 * forwarded into workspace.task-formation as a concrete source reference.
 */

import { Button, Input } from "@packages";
import { FileText, Plus, ListPlus, Pencil, Archive } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

import type { PageSnapshot } from "../../../subdomains/page/domain/entities/Page";
import {
  queryPages,
  createPage,
  renamePage,
  archivePage,
} from "../../../adapters/outbound/firebase-composition";

interface NotionPagesSectionProps {
  workspaceId: string;
  accountId: string;
  currentUserId: string;
}

function taskFormationHref(accountId: string, workspaceId: string, pageId: string) {
  const params = new URLSearchParams({
    tab: "TaskFormation",
    sourceKind: "page",
    sourceId: pageId,
  });
  return `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}?${params.toString()}`;
}

export function NotionPagesSection({
  workspaceId,
  accountId,
  currentUserId,
}: NotionPagesSectionProps): React.ReactElement {
  const [pages, setPages] = useState<PageSnapshot[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [newSourceLabel, setNewSourceLabel] = useState("");
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState("");
  const [isPending, startTransition] = useTransition();

  const reloadPages = async () => {
    const result = await queryPages({ workspaceId, accountId });
    setPages(Array.isArray(result) ? result : []);
  };

  const load = () => {
    startTransition(async () => {
      await reloadPages();
      setLoaded(true);
    });
  };

  useEffect(() => {
    load();
  }, [workspaceId, accountId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    startTransition(async () => {
      await createPage({
        workspaceId,
        accountId,
        title: newTitle.trim(),
        summary: newSummary.trim() || undefined,
        sourceLabel: newSourceLabel.trim() || undefined,
        createdByUserId: currentUserId,
      });
      setNewTitle("");
      setNewSummary("");
      setNewSourceLabel("");
      await reloadPages();
    });
  };

  const handleStartRename = (page: PageSnapshot) => {
    setEditingPageId(page.id);
    setRenameTitle(page.title);
  };

  const handleRename = (pageId: string) => {
    const nextTitle = renameTitle.trim();
    if (!nextTitle) return;
    startTransition(async () => {
      await renamePage(pageId, nextTitle);
      setEditingPageId(null);
      setRenameTitle("");
      await reloadPages();
    });
  };

  const handleArchive = (pageId: string) => {
    startTransition(async () => {
      await archivePage(pageId);
      if (editingPageId === pageId) {
        setEditingPageId(null);
        setRenameTitle("");
      }
      await reloadPages();
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">頁面</h2>
        </div>
      </div>

      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-xs text-muted-foreground">
        這裡的頁面是 workspace 內的知識頁面，不追求完整 Notion page 相容；目前重點是保留標題、摘要與來源脈絡，供後續任務形成使用。
      </div>

      {loaded && (
        <>
          <div className="space-y-2">
            <Input
              placeholder="新頁面標題…"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="h-8 text-sm"
            />
            <Input
              placeholder="摘要／內容預覽（可選）…"
              value={newSummary}
              onChange={(e) => setNewSummary(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="h-8 text-sm"
            />
            <div className="flex gap-2">
              <Input
                placeholder="來源標籤（例如：上傳文件、人工整理）…"
                value={newSourceLabel}
                onChange={(e) => setNewSourceLabel(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                className="h-8 text-sm"
              />
              <Button size="sm" onClick={handleCreate} disabled={isPending || !newTitle.trim()}>
                <Plus className="size-3.5" />
              </Button>
            </div>
          </div>

          {pages.length === 0 ? (
            <p className="text-sm text-muted-foreground">尚無頁面，請建立第一個知識頁面。</p>
          ) : (
            <ul className="space-y-2">
              {pages.map((page) => (
                <li
                  key={page.id}
                  className="flex items-start justify-between rounded-lg border border-border/40 px-3 py-2 text-sm"
                >
                  <div className="min-w-0 flex-1">
                    {editingPageId === page.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={renameTitle}
                          onChange={(e) => setRenameTitle(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleRename(page.id)}
                          className="h-7 text-xs"
                          disabled={isPending}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xs"
                          onClick={() => handleRename(page.id)}
                          disabled={isPending || !renameTitle.trim()}
                        >
                          儲存
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xs"
                          onClick={() => {
                            setEditingPageId(null);
                            setRenameTitle("");
                          }}
                          disabled={isPending}
                        >
                          取消
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{page.title}</span>
                          <span className="text-xs text-muted-foreground">{page.status}</span>
                        </div>
                        {page.summary ? (
                          <p className="line-clamp-2 text-xs text-muted-foreground">{page.summary}</p>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            尚未提供摘要，任務形成會先使用標題與頁面脈絡。
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                          <span>{page.blockIds.length} 個內容區塊</span>
                          {page.sourceLabel && <span>來源：{page.sourceLabel}</span>}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex items-center gap-1">
                    {editingPageId !== page.id && page.status === "active" && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2"
                          onClick={() => handleStartRename(page)}
                          disabled={isPending}
                          title="重新命名"
                        >
                          <Pencil className="size-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-muted-foreground hover:text-destructive"
                          onClick={() => handleArchive(page.id)}
                          disabled={isPending}
                          title="封存"
                        >
                          <Archive className="size-3" />
                        </Button>
                      </>
                    )}
                    <Link
                      href={taskFormationHref(accountId, workspaceId, page.id)}
                      className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                      title="發送至任務形成"
                    >
                      <ListPlus className="size-3" />
                      → 任務形成
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {pages.length > 0 && (
            <p className="text-xs text-muted-foreground">
              點擊頁面右側「→ 任務形成」可帶入具體頁面 reference，讓 task formation 讀取此頁面的摘要與來源脈絡。
            </p>
          )}
        </>
      )}
    </div>
  ) as React.ReactElement;
}
