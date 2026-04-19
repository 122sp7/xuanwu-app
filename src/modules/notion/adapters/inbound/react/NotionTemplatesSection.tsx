"use client";

/**
 * NotionTemplatesSection — notion.templates tab — template library.
 * Auto-loads on mount. Supports creating new workspace-scoped templates.
 */

import { Button, Input } from "@packages";
import { Layout, Plus } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import type { Template, TemplateCategory } from "../../../subdomains/template/domain/entities/Template";
import { queryTemplatesAction, createTemplateAction } from "../server-actions/template-actions";

interface NotionTemplatesSectionProps {
  workspaceId: string;
  accountId: string;
  currentUserId: string;
}

const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  page: "頁面",
  database: "資料庫",
  workflow: "工作流程",
};

const CATEGORY_OPTIONS: TemplateCategory[] = ["page", "database", "workflow"];

export function NotionTemplatesSection({
  workspaceId,
  accountId,
  currentUserId,
}: NotionTemplatesSectionProps): React.ReactElement {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<TemplateCategory>("page");
  const [isPending, startTransition] = useTransition();

  const load = () => {
    startTransition(async () => {
      const result = await queryTemplatesAction({ workspaceId, accountId });
      setTemplates(Array.isArray(result) ? result : []);
      setLoaded(true);
    });
  };

  // Auto-load on mount
  useEffect(() => {
    load();
  }, [workspaceId, accountId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    startTransition(async () => {
      await createTemplateAction({
        workspaceId,
        accountId,
        title: newTitle.trim(),
        category: newCategory,
        createdByUserId: currentUserId,
      });
      setNewTitle("");
      const result = await queryTemplatesAction({ workspaceId, accountId });
      setTemplates(Array.isArray(result) ? result : []);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Layout className="size-4 text-primary" />
        <h2 className="text-sm font-semibold">模板</h2>
      </div>

      {loaded && (
        <>
          <div className="flex gap-2">
            <Input
              placeholder="新模板名稱…"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="h-8 text-sm"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as TemplateCategory)}
              className="h-8 rounded-md border border-input bg-background px-2 text-sm text-foreground"
              disabled={isPending}
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
            <Button size="sm" onClick={handleCreate} disabled={isPending || !newTitle.trim()}>
              <Plus className="size-3.5" />
            </Button>
          </div>

          {templates.length === 0 ? (
            <p className="text-sm text-muted-foreground">尚無模板，請建立第一個模板。</p>
          ) : (
            <ul className="space-y-2">
              {templates.map((tpl) => (
                <li
                  key={tpl.id}
                  className="rounded-lg border border-border/40 px-3 py-2 text-sm"
                >
                  <span className="font-medium">{tpl.title}</span>
                  <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                    {CATEGORY_LABELS[tpl.category]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {!loaded && isPending && (
        <p className="text-sm text-muted-foreground">載入中…</p>
      )}
    </div>
  ) as React.ReactElement;
}
