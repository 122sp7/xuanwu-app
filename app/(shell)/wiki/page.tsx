"use client";

/**
 * Module: wiki page
 * Purpose: Enterprise knowledge hub — thin orchestrator. Manages view state and
 *   data loading; all rendering is delegated to modules/wiki components.
 * Constraints: No business logic here. All rendering in modules/wiki/interfaces/components.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { useApp } from "@/app/providers/app-provider";
import { isOrganizationAccount } from "@/app/(shell)/organization/_utils";
import type { WorkspaceEntity } from "@/modules/workspace";
import { getWorkspacesForAccount } from "@/modules/workspace";
import type { RagDocumentRecord } from "@/modules/file";
import { getWorkspaceRagDocuments } from "@/modules/file";
import { getWorkspaceKnowledgeSummary } from "@/modules/wiki";
import type { WikiPage as WikiPageEntity, WikiPageScope } from "@/modules/wiki";
import {
  type WorkspaceEntry,
  WikiHubView,
  WikiWorkspaceDocView,
  WikiPagesListView,
  WikiArchivedView,
  WikiPageView,
  getOrgWikiPages,
  getArchivedWikiPages,
  archiveWikiPage,
} from "@/modules/wiki";

// ── View state type ───────────────────────────────────────────────────────────

type MainView = "hub" | "workspace" | "pages" | "archived" | "page-detail";

// ── Main page ─────────────────────────────────────────────────────────────────

/** Map `?view=` query-param values to internal MainView keys. */
const VIEW_PARAM_MAP: Record<string, MainView> = {
  hub: "hub",
  pages: "pages",
  archived: "archived",
};

export default function WikiPage() {
  const { state: appState } = useApp();
  const { activeAccount } = appState;
  const organizationId = isOrganizationAccount(activeAccount) ? activeAccount.id : null;
  const searchParams = useSearchParams();

  // Resolve the initial view from the `?view=` query parameter (defaults to "hub").
  const initialView: MainView = VIEW_PARAM_MAP[searchParams.get("view") ?? ""] ?? "hub";

  // Knowledge state
  const [entries, setEntries] = useState<readonly WorkspaceEntry[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [refreshKey, setRefreshKey] = useState(0);

  // View state
  const [mainView, setMainView] = useState<MainView>(initialView);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);

  // Wiki pages state
  const [orgPages, setOrgPages] = useState<readonly WikiPageEntity[]>([]);
  const [archivedPages, setArchivedPages] = useState<readonly WikiPageEntity[]>([]);
  const [pagesLoadState, setPagesLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [pagesRefreshKey, setPagesRefreshKey] = useState(0);
  const [selectedPage, setSelectedPage] = useState<WikiPageEntity | null>(null);
  const [pageScopeFilter, setPageScopeFilter] = useState<WikiPageScope | "all">("all");

  // ── Load knowledge ──────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!organizationId) {
        if (!cancelled) { setEntries([]); setLoadState("loaded"); }
        return;
      }
      if (!cancelled) setLoadState("loading");
      try {
        const workspaces: WorkspaceEntity[] = await getWorkspacesForAccount(organizationId);
        const results: WorkspaceEntry[] = await Promise.all(
          workspaces.map(async (workspace) => {
            const [summary, docs] = await Promise.all([
              getWorkspaceKnowledgeSummary(workspace).catch(() => ({
                registeredAssetCount: 0,
                readyAssetCount: 0,
                supportedSourceCount: 0,
                status: "needs-input" as const,
                blockedReasons: ["摘要載入失敗"],
                nextActions: [],
                visibleSurface: "workspace-tab-live" as const,
                contractStatus: "contract-live" as const,
              })),
              getWorkspaceRagDocuments(workspace).catch(() => [] as readonly RagDocumentRecord[]),
            ]);
            return { workspace, summary, docs };
          }),
        );
        if (!cancelled) { setEntries(results); setLoadState("loaded"); }
      } catch {
        if (!cancelled) { setEntries([]); setLoadState("error"); }
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [organizationId, refreshKey]);

  // ── Load wiki pages ─────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function loadPages() {
      if (!organizationId) {
        if (!cancelled) { setOrgPages([]); setArchivedPages([]); setPagesLoadState("loaded"); }
        return;
      }
      if (!cancelled) setPagesLoadState("loading");
      try {
        const [pages, archived] = await Promise.all([
          getOrgWikiPages(organizationId),
          getArchivedWikiPages(organizationId),
        ]);
        if (!cancelled) { setOrgPages(pages); setArchivedPages(archived); setPagesLoadState("loaded"); }
      } catch {
        if (!cancelled) setPagesLoadState("error");
      }
    }
    void loadPages();
    return () => { cancelled = true; };
  }, [organizationId, pagesRefreshKey]);

  // ── Derived ─────────────────────────────────────────────────────────────────
  const selectedEntry = useMemo(
    () => entries.find((e) => e.workspace.id === selectedWorkspaceId) ?? null,
    [entries, selectedWorkspaceId],
  );

  // ── Callbacks ───────────────────────────────────────────────────────────────
  const handleSelectWorkspace = useCallback((id: string) => {
    setSelectedWorkspaceId(id);
    setMainView("workspace");
  }, []);

  const handleSelectPage = useCallback((page: WikiPageEntity) => {
    setSelectedPage(page);
    setMainView("page-detail");
  }, []);

  const handleArchivePage = useCallback(async (pageId: string) => {
    const result = await archiveWikiPage(pageId);
    if (result.success) {
      toast.success("頁面已封存");
      setSelectedPage(null);
      setMainView("pages");
      setPagesRefreshKey((k) => k + 1);
    } else {
      toast.error("封存失敗", { description: result.error?.message });
    }
  }, []);

  // ── Tab nav ─────────────────────────────────────────────────────────────────
  const tabs = [
    { key: "hub" as const, label: "知識中樞" },
    { key: "pages" as const, label: "Wiki 頁面" },
    { key: "archived" as const, label: "封存" },
  ];

  const activeTab =
    mainView === "workspace"
      ? "hub"
      : mainView === "page-detail"
        ? "pages"
        : (mainView as "hub" | "pages" | "archived");

  // ── Content ─────────────────────────────────────────────────────────────────
  let content: React.ReactNode;

  if (mainView === "workspace" && selectedEntry) {
    content = (
      <WikiWorkspaceDocView
        entry={selectedEntry}
        organizationId={organizationId ?? ""}
        onBack={() => { setMainView("hub"); setSelectedWorkspaceId(null); }}
      />
    );
  } else if (mainView === "pages") {
    content = (
      <WikiPagesListView
        organizationId={organizationId ?? ""}
        pages={orgPages}
        pagesLoadState={pagesLoadState}
        scopeFilter={pageScopeFilter}
        onScopeChange={setPageScopeFilter}
        onSelectPage={handleSelectPage}
        onCreated={() => setPagesRefreshKey((k) => k + 1)}
      />
    );
  } else if (mainView === "archived") {
    content = (
      <WikiArchivedView
        archivedPages={archivedPages}
        loadState={pagesLoadState}
        onSelectPage={handleSelectPage}
      />
    );
  } else if (mainView === "page-detail" && selectedPage) {
    const workspaceName = selectedPage.workspaceId
      ? entries.find((e) => e.workspace.id === selectedPage.workspaceId)?.workspace.name
      : undefined;
    content = (
      <WikiPageView
        page={selectedPage}
        workspaceName={workspaceName}
        onBack={() => { setSelectedPage(null); setMainView("pages"); }}
        onArchive={handleArchivePage}
      />
    );
  } else {
    // hub (default + fallback)
    content = (
      <WikiHubView
        entries={entries}
        loadState={loadState}
        organizationId={organizationId ?? ""}
        onSelectWorkspace={handleSelectWorkspace}
        onRefresh={() => setRefreshKey((k) => k + 1)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-border/40 pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={[
              "rounded-md px-3 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              activeTab === tab.key
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            ].join(" ")}
            onClick={() => { setMainView(tab.key); setSelectedPage(null); }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {content}
    </div>
  );
}
