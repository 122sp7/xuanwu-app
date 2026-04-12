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
import { DatabaseTablePanel } from "./DatabaseTablePanel";
import { DatabaseBoardPanel } from "./DatabaseBoardPanel";
import { DatabaseListPanel } from "./DatabaseListPanel";
import { DatabaseCalendarPanel } from "./DatabaseCalendarPanel";
import { DatabaseGalleryPanel } from "./DatabaseGalleryPanel";
import { DatabaseAutomationPanel } from "./DatabaseAutomationPanel";
import { AddFieldDialog } from "./DatabaseAddFieldDialog";
import type { DatabaseSnapshot as Database, FieldType } from "../../../subdomains/database/application/dto/database.dto";
import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

// ?? Props ?????????????????????????????????????????????????????????????????????

export interface DatabaseDetailPanelProps {
  accountId: string;
  workspaceId: string;
  currentUserId: string;
}

// ?? Component ?????????????????????????????????????????????????????????????????

export function DatabaseDetailPanel({
  accountId,
  workspaceId,
  currentUserId,
}: DatabaseDetailPanelProps) {
  const params = useParams();
  const router = useRouter();
  const databaseId = params.databaseId as string;

  const [database, setDatabase] = useState<Database | null>(null);
  const [loading, setLoading] = useState(true);
  const [addFieldOpen, setAddFieldOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "board" | "list" | "calendar" | "gallery" | "automations">("table");
  const [isPending, startTransition] = useTransition();
  const workspaceBasePath =
    accountId && workspaceId
      ? `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}`
      : accountId
        ? `/${encodeURIComponent(accountId)}`
        : "/";
  const databasesHref =
    accountId && workspaceId
      ? `${workspaceBasePath}/knowledge-database/databases`
      : "/knowledge-database/databases";
  const formsHref =
    accountId && workspaceId
      ? `${workspaceBasePath}/knowledge-database/databases/${encodeURIComponent(databaseId)}/forms`
      : `/knowledge-database/databases/${encodeURIComponent(databaseId)}/forms`;

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
      router.push(databasesHref);
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
        <Button variant="ghost" size="sm" onClick={() => router.push(databasesHref)}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
        </Button>
        <p className="text-sm text-muted-foreground">Database not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.push(databasesHref)}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to databases
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
          {database.fields.length} fields | Updated {new Date(database.updatedAtISO).toLocaleDateString("zh-TW")}
        </p>
      </header>

      {/* View switcher + actions */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center rounded-md border border-border/60 p-0.5">
          <button
            type="button"
            onClick={() => setViewMode("table")}
            title="Table view"
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition ${viewMode === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Table2 className="h-3 w-3" /> Table
          </button>
          <button
            type="button"
            onClick={() => setViewMode("board")}
            title="Board view"
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition ${viewMode === "board" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Kanban className="h-3 w-3" /> Board
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            title="List view"
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <List className="h-3 w-3" /> List
          </button>
          <button
            type="button"
            onClick={() => setViewMode("calendar")}
            title="Calendar view"
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition ${viewMode === "calendar" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Calendar className="h-3 w-3" /> Calendar
          </button>
          <button
            type="button"
            onClick={() => setViewMode("gallery")}
            title="Gallery view"
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition ${viewMode === "gallery" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <LayoutGrid className="h-3 w-3" /> Gallery
          </button>
          <button
            type="button"
            onClick={() => setViewMode("automations")}
            title="Automations"
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition ${viewMode === "automations" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Zap className="h-3 w-3" /> Automations
          </button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(formsHref)}
            disabled={isPending}
          >
            <FileText className="mr-1.5 h-3.5 w-3.5" /> Forms
          </Button>
          <Button size="sm" variant="outline" onClick={() => setAddFieldOpen(true)} disabled={isPending}>
            <PlusCircle className="mr-1.5 h-3.5 w-3.5" /> Add field
          </Button>
          <Button size="sm" variant="outline" onClick={handleArchive} disabled={isPending}>
            <Archive className="mr-1.5 h-3.5 w-3.5" /> Archive
          </Button>
        </div>
      </div>

      {/* View */}
      {viewMode === "table" && (
        <DatabaseTablePanel
          database={database}
          accountId={accountId}
          workspaceId={workspaceId}
          currentUserId={currentUserId}
        />
      )}
      {viewMode === "board" && (
        <DatabaseBoardPanel
          database={database}
          accountId={accountId}
          workspaceId={workspaceId}
          currentUserId={currentUserId}
        />
      )}
      {viewMode === "list" && (
        <DatabaseListPanel
          database={database}
          accountId={accountId}
          workspaceId={workspaceId}
          currentUserId={currentUserId}
        />
      )}
      {viewMode === "calendar" && (
        <DatabaseCalendarPanel
          database={database}
          accountId={accountId}
        />
      )}
      {viewMode === "gallery" && (
        <DatabaseGalleryPanel
          database={database}
          accountId={accountId}
          workspaceId={workspaceId}
          currentUserId={currentUserId}
        />
      )}
      {viewMode === "automations" && (
        <DatabaseAutomationPanel
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

