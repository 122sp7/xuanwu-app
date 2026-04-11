"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Archive,
  FileText,
  PlusCircle,
  Table2,
  Kanban,
  List,
  Calendar,
  LayoutGrid,
  Zap,
} from "lucide-react";

import { getDatabase } from "../queries";
import { addDatabaseField, archiveDatabase } from "../_actions/database.actions";
import { DatabaseTableView } from "./DatabaseTableView";
import { DatabaseBoardView } from "./DatabaseBoardView";
import { DatabaseListView } from "./DatabaseListView";
import { DatabaseCalendarView } from "./DatabaseCalendarView";
import { DatabaseGalleryView } from "./DatabaseGalleryView";
import { DatabaseAutomationView } from "./DatabaseAutomationView";
import { AddFieldDialog } from "./DatabaseAddFieldDialog";
import type { DatabaseSnapshot as Database, FieldType } from "../../application/dto/database.dto";
import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

// ── Props ─────────────────────────────────────────────────────────────────────

export interface DatabaseDetailPageProps {
  accountId: string;
  workspaceId: string;
  currentUserId: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function DatabaseDetailPage({
  accountId,
  workspaceId,
  currentUserId,
}: DatabaseDetailPageProps) {
  const params = useParams();
  const router = useRouter();
  const databaseId = params.databaseId as string;

  const [database, setDatabase] = useState<Database | null>(null);
  const [loading, setLoading] = useState(true);
  const [addFieldOpen, setAddFieldOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "board" | "list" | "calendar" | "gallery" | "automations">("table");
  const [isPending, startTransition] = useTransition();

  const load = useCallback(async () => {
    if (!accountId || !databaseId) { setLoading(false); return; }
    setLoading(true);
    try {
      const db = await getDatabase(accountId, databaseId);
      setDatabase(db);
    } finally {
      setLoading(false);
    }
  }, [accountId, databaseId]);

  useEffect(() => { void load(); }, [load]);

  function handleAddField(name: string, type: FieldType, required: boolean) {
    startTransition(async () => {
      await addDatabaseField({
        databaseId,
        accountId,
        name,
        type,
        config: {},
        required,
      });
      await load();
    });
  }

  function handleArchive() {
    startTransition(async () => {
      await archiveDatabase({ id: databaseId, accountId });
      router.push("/knowledge-database/databases");
    });
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (!database) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/knowledge-database/databases")}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> 返回
        </Button>
        <p className="text-sm text-muted-foreground">找不到資料庫。</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.push("/knowledge-database/databases")}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> 資料庫列表
        </Button>
      </div>

      {/* Page header */}
      <header className="space-y-1 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          {database.icon && <span className="text-xl">{database.icon}</span>}
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{database.name}</h1>
        </div>
        {database.description && (
          <p className="text-sm text-muted-foreground">{database.description}</p>
        )}
        <p className="text-xs text-muted-foreground/70">
          {database.fields.length} 個欄位 · 更新於 {new Date(database.updatedAtISO).toLocaleDateString("zh-TW")}
        </p>
      </header>

      {/* View switcher + actions */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center rounded-md border border-border/60 p-0.5">
          <button
            type="button"
            onClick={() => setViewMode("table")}
            title="表格視圖"
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition ${viewMode === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Table2 className="h-3 w-3" /> 表格
          </button>
          <button
            type="button"
            onClick={() => setViewMode("board")}
            title="看板視圖"
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition ${viewMode === "board" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Kanban className="h-3 w-3" /> 看板
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            title="清單視圖"
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <List className="h-3 w-3" /> 清單
          </button>
          <button
            type="button"
            onClick={() => setViewMode("calendar")}
            title="日曆視圖"
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition ${viewMode === "calendar" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Calendar className="h-3 w-3" /> 日曆
          </button>
          <button
            type="button"
            onClick={() => setViewMode("gallery")}
            title="圖庫視圖"
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition ${viewMode === "gallery" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <LayoutGrid className="h-3 w-3" /> 圖庫
          </button>
          <button
            type="button"
            onClick={() => setViewMode("automations")}
            title="自動化規則"
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition ${viewMode === "automations" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Zap className="h-3 w-3" /> 自動化
          </button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/knowledge-database/databases/${databaseId}/forms`)}
            disabled={isPending}
          >
            <FileText className="mr-1.5 h-3.5 w-3.5" /> 表單
          </Button>
          <Button size="sm" variant="outline" onClick={() => setAddFieldOpen(true)} disabled={isPending}>
            <PlusCircle className="mr-1.5 h-3.5 w-3.5" /> 新增欄位
          </Button>
          <Button size="sm" variant="outline" onClick={handleArchive} disabled={isPending}>
            <Archive className="mr-1.5 h-3.5 w-3.5" /> 封存
          </Button>
        </div>
      </div>

      {/* View */}
      {viewMode === "table" && (
        <DatabaseTableView
          database={database}
          accountId={accountId}
          workspaceId={workspaceId}
          currentUserId={currentUserId}
        />
      )}
      {viewMode === "board" && (
        <DatabaseBoardView
          database={database}
          accountId={accountId}
          workspaceId={workspaceId}
          currentUserId={currentUserId}
        />
      )}
      {viewMode === "list" && (
        <DatabaseListView
          database={database}
          accountId={accountId}
          workspaceId={workspaceId}
          currentUserId={currentUserId}
        />
      )}
      {viewMode === "calendar" && (
        <DatabaseCalendarView
          database={database}
          accountId={accountId}
        />
      )}
      {viewMode === "gallery" && (
        <DatabaseGalleryView
          database={database}
          accountId={accountId}
          workspaceId={workspaceId}
          currentUserId={currentUserId}
        />
      )}
      {viewMode === "automations" && (
        <DatabaseAutomationView
          databaseId={databaseId}
          accountId={accountId}
          currentUserId={currentUserId}
        />
      )}

      <AddFieldDialog
        open={addFieldOpen}
        onOpenChange={setAddFieldOpen}
        onAdd={handleAddField}
        isPending={isPending}
      />
    </div>
  );
}
