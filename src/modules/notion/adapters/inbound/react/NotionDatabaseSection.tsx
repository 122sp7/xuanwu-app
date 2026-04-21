"use client";

/**
 * NotionDatabaseSection — notion.database tab — workspace knowledge databases.
 *
 * Databases are local structured knowledge containers. They keep a real parent
 * page reference (or workspace root) and a lightweight schema that can be used
 * as task-formation input.
 */

import { Button, Input } from "@packages";
import { LayoutGrid, ListPlus, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

import type { DatabaseSnapshot, PropertyType } from "../../../subdomains/database/domain/entities/Database";
import type { PageSnapshot } from "../../../subdomains/page/domain/entities/Page";
import { queryDatabases, createDatabase, addDatabaseProperty, queryPages } from "../../../adapters/outbound/firebase-composition";

interface NotionDatabaseSectionProps {
  workspaceId: string;
  accountId: string;
  currentUserId: string;
}

type PropertyDraft = {
  readonly name: string;
  readonly type: PropertyType;
};

const PROPERTY_TYPES: ReadonlyArray<{ value: PropertyType; label: string }> = [
  { value: "text", label: "文字" },
  { value: "number", label: "數字" },
  { value: "select", label: "單選" },
  { value: "multi_select", label: "多選" },
  { value: "date", label: "日期" },
  { value: "checkbox", label: "勾選" },
  { value: "url", label: "連結" },
  { value: "email", label: "Email" },
  { value: "file", label: "檔案" },
  { value: "relation", label: "關聯" },
];

function taskFormationHref(accountId: string, workspaceId: string, databaseId: string) {
  const params = new URLSearchParams({
    tab: "TaskFormation",
    sourceKind: "database",
    sourceId: databaseId,
  });
  return `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}?${params.toString()}`;
}

export function NotionDatabaseSection({
  workspaceId,
  accountId,
  currentUserId,
}: NotionDatabaseSectionProps): React.ReactElement {
  const [databases, setDatabases] = useState<DatabaseSnapshot[]>([]);
  const [pages, setPages] = useState<PageSnapshot[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newParentPageId, setNewParentPageId] = useState("");
  const [propertyDrafts, setPropertyDrafts] = useState<Record<string, PropertyDraft>>({});
  const [isPending, startTransition] = useTransition();

  const reload = async () => {
    const [databaseResult, pageResult] = await Promise.all([
      queryDatabases(workspaceId),
      queryPages({ workspaceId, accountId }),
    ]);
    setDatabases(Array.isArray(databaseResult) ? databaseResult : []);
    setPages(Array.isArray(pageResult) ? pageResult : []);
  };

  const load = () => {
    startTransition(async () => {
      await reload();
      setLoaded(true);
    });
  };

  useEffect(() => {
    load();
  }, [workspaceId, accountId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = () => {
    if (!newName.trim()) return;
    startTransition(async () => {
      await createDatabase({
        workspaceId,
        accountId,
        parentPageId: newParentPageId || null,
        title: newName.trim(),
        description: newDescription.trim() || undefined,
        createdByUserId: currentUserId,
      });
      setNewName("");
      setNewDescription("");
      setNewParentPageId("");
      await reload();
    });
  };

  const updatePropertyDraft = (databaseId: string, patch: Partial<PropertyDraft>) => {
    setPropertyDrafts((prev) => ({
      ...prev,
      [databaseId]: {
        name: "",
        type: "text",
        ...prev[databaseId],
        ...patch,
      },
    }));
  };

  const handleAddProperty = (databaseId: string) => {
    const draft = propertyDrafts[databaseId];
    if (!draft?.name.trim()) return;
    startTransition(async () => {
      await addDatabaseProperty(databaseId, {
        id: crypto.randomUUID(),
        name: draft.name.trim(),
        type: draft.type,
      });
      setPropertyDrafts((prev) => ({
        ...prev,
        [databaseId]: { name: "", type: "text" },
      }));
      await reload();
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutGrid className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">資料庫</h2>
        </div>
      </div>

      <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 px-4 py-3 text-xs text-muted-foreground">
        這裡的資料庫是 workspace 內的結構化知識容器，不追求完整 Notion database 相容；重點是保留真實 parent page 與可維護的欄位 schema。
      </div>

      {loaded && (
        <>
          <div className="space-y-2">
            <Input
              placeholder="新資料庫名稱…"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="h-8 text-sm"
              disabled={isPending}
            />
            <select
              value={newParentPageId}
              onChange={(e) => setNewParentPageId(e.target.value)}
              className="h-8 w-full rounded-md border border-input bg-background px-3 text-sm"
              disabled={isPending}
            >
              <option value="">掛在 workspace 根目錄</option>
              {pages.map((page) => (
                <option key={page.id} value={page.id}>
                  掛在頁面：{page.title}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <Input
                placeholder="描述（可選）…"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                className="h-8 text-sm"
                disabled={isPending}
              />
              <Button size="sm" onClick={handleCreate} disabled={isPending || !newName.trim()}>
                <Plus className="size-3.5" />
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              新資料庫會自動初始化一個「名稱」文字欄位，之後可再新增其他 schema 欄位。
            </p>
          </div>

          {databases.length === 0 ? (
            <p className="text-sm text-muted-foreground">尚無資料庫，請建立第一個結構化知識容器。</p>
          ) : (
            <ul className="space-y-2">
              {databases.map((db) => {
                const parentPage = db.parentPageId
                  ? pages.find((page) => page.id === db.parentPageId)
                  : null;
                const propertyDraft = propertyDrafts[db.id] ?? { name: "", type: "text" as PropertyType };
                return (
                  <li
                    key={db.id}
                    className="space-y-3 rounded-lg border border-border/40 px-3 py-3 text-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{db.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {db.properties.length} 個欄位
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Parent：{parentPage?.title ?? "workspace 根目錄"}
                        </p>
                        {db.description && (
                          <p className="text-xs text-muted-foreground">{db.description}</p>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {db.properties.map((property) => (
                            <span
                              key={property.id}
                              className="rounded-md border border-border/60 px-2 py-0.5 text-[11px] text-muted-foreground"
                            >
                              {property.name} · {property.type}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Link
                        href={taskFormationHref(accountId, workspaceId, db.id)}
                        className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                        title="發送至任務形成"
                      >
                        <ListPlus className="size-3" />
                        → 任務形成
                      </Link>
                    </div>

                    <div className="flex flex-col gap-2 rounded-lg border border-dashed border-border/60 p-2 sm:flex-row">
                      <Input
                        placeholder="新增欄位名稱…"
                        value={propertyDraft.name}
                        onChange={(e) => updatePropertyDraft(db.id, { name: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && handleAddProperty(db.id)}
                        className="h-8 text-xs"
                        disabled={isPending}
                      />
                      <select
                        value={propertyDraft.type}
                        onChange={(e) => updatePropertyDraft(db.id, { type: e.target.value as PropertyType })}
                        className="h-8 rounded-md border border-input bg-background px-3 text-xs"
                        disabled={isPending}
                      >
                        {PROPERTY_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8"
                        onClick={() => handleAddProperty(db.id)}
                        disabled={isPending || !propertyDraft.name.trim()}
                      >
                        <Plus className="size-3.5" />
                        新增欄位
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          {databases.length > 0 && (
            <p className="text-xs text-muted-foreground">
              點擊資料庫右側「→ 任務形成」可帶入具體 database reference，讓 task formation 讀取欄位 schema 與描述。
            </p>
          )}
        </>
      )}

      {!loaded && isPending && (
        <p className="text-sm text-muted-foreground">載入中…</p>
      )}
    </div>
  ) as React.ReactElement;
}
