"use client";

/**
 * Route: /knowledge-database/databases/[databaseId]/forms
 * Purpose: Manage database forms ??create and embed form links for a specific database.
 */

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Plus } from "lucide-react";

import { getDatabase } from "../queries";
import { DatabaseFormPanel } from "./DatabaseFormPanel";
import type { DatabaseSnapshot as Database } from "../../../subdomains/database/application/dto/database.dto";
import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui-shadcn/ui/tabs";

// ?? Props ?????????????????????????????????????????????????????????????????????

export interface DatabaseFormsPanelProps {
  accountId: string;
  workspaceId: string;
  currentUserId: string;
}

// ?? Component ?????????????????????????????????????????????????????????????????

export function DatabaseFormsPanel({
  accountId,
  workspaceId,
  currentUserId,
}: DatabaseFormsPanelProps) {
  const params = useParams();
  const router = useRouter();
  const databaseId = params.databaseId as string;

  const [database, setDatabase] = useState<Database | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"preview" | "share">("preview");
  const databaseDetailHref =
    accountId && workspaceId
      ? `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}/knowledge-database/databases/${encodeURIComponent(databaseId)}`
      : `/knowledge-database/databases/${encodeURIComponent(databaseId)}`;

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
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> 餈?
        </Button>
        <p className="text-sm text-muted-foreground">?曆??啗??澈??/p>
      </div>
    );
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(databaseDetailHref)}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" /> 餈?鞈?摨?
        </Button>
        <div className="ml-auto">
          <Button size="sm" variant="outline" disabled>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> 撱箇??啗”??
          </Button>
        </div>
      </div>

      <header className="space-y-1 border-b border-border/60 pb-4">
        <h1 className="text-xl font-semibold">{database.name} ??銵典</h1>
        <p className="text-sm text-muted-foreground">
          雿輻銵典霈??其蝙?刻?鈭方??甇方??澈??
        </p>
      </header>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "preview" | "share")}>
        <TabsList>
          <TabsTrigger value="preview">?汗銵典</TabsTrigger>
          <TabsTrigger value="share">?澈閮剖?</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="mt-4">
          <div className="rounded-xl border border-border/60 bg-card px-6 py-2">
            <DatabaseFormPanel
              database={database}
              accountId={accountId}
              workspaceId={workspaceId}
              submitterId={currentUserId}
              title={`${database.name} 銵典`}
              description={database.description ?? undefined}
            />
          </div>
        </TabsContent>

        <TabsContent value="share" className="mt-4">
          <div className="space-y-4 rounded-xl border border-border/60 bg-card p-6">
            <div className="space-y-1.5">
              <p className="text-sm font-medium">銵典???</p>
              <div className="flex items-center gap-2 rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                <span className="flex-1 truncate">{shareUrl}</span>
                <button
                  type="button"
                  onClick={() => void navigator.clipboard.writeText(shareUrl)}
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                  title="銴ˊ???"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                ?澈甇日??霈隞犖憛怠神銵典銝血?閮??湔摮鞈?摨怒?
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

