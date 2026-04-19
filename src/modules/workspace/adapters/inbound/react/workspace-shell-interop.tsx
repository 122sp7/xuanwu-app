"use client";

/**
 * workspace-shell-interop — workspace shell integration components & hooks.
 *
 * Bridges the workspace module with the platform shell:
 *   - WorkspaceQuickAccessRow   (icon strip in sidebar header)
 *   - WorkspaceSectionContent   (domain-grouped tab nav in sidebar body)
 *   - CustomizeNavigationDialog (user nav-preference editor)
 *   - CreateWorkspaceDialogRail (workspace creation triggered from app rail)
 *   - useRecentWorkspaces       (recent workspace list hook)
 *   - useSidebarLocale          (locale bundle stub hook)
 *   - buildWorkspaceQuickAccessItems (URL builder for quick-access items)
 *
 * All pure navigation data (types, constants, URL helpers) lives in
 * workspace-nav-model.ts — import from there for non-React consumers.
 */

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Button, Input } from "@packages";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  BadgeCheck,
  BookOpen,
  Brain,
  ClipboardCheck,
  FileStack,
  FileText,
  FolderOpen,
  Home,
  Inbox,
  LayoutTemplate,
  ListTodo,
  MessageSquare,
  Notebook,
  Receipt,
  Settings,
  Shield,
  Table2,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";

import type { WorkspaceEntity } from "./WorkspaceContext";
import { createClientWorkspaceLifecycleUseCases } from "../../outbound/firebase-composition";
import {
  DEFAULT_NAV_PREFS,
  WORKSPACE_DOMAIN_GROUP_LABELS,
  WORKSPACE_TAB_ITEMS,
  getWorkspaceIdFromPath,
  readNavPreferences,
  resolveWorkspaceTabValue,
  sanitizeNavPreferences,
  writeNavPreferences,
  type NavPreferences,
  type SidebarLocaleBundle,
  type WorkspaceDomainGroup,
} from "./workspace-nav-model";

// Re-export types so callers that previously imported from workspace-ui-stubs
// can keep working without change when workspace-ui-stubs becomes a barrel.
export type { NavPreferences, SidebarLocaleBundle };

// ── WorkspaceQuickAccessItem ──────────────────────────────────────────────────

interface WorkspaceQuickAccessMatcherOptions {
  panel: string | null;
  tab: string | null;
}

interface WorkspaceQuickAccessItem {
  id: string;
  href: string;
  label: string;
  icon: ReactNode;
  isActive?: (pathname: string, options?: WorkspaceQuickAccessMatcherOptions) => boolean;
}

/**
 * WORKSPACE_TAB_ICONS — icon for each WorkspaceTabValue.
 *
 * This is the ONLY UI-specific data that cannot live in workspace-nav-model.ts
 * (nav-model is JSX-free). All other tab metadata (label, id, value, group)
 * is owned by WORKSPACE_TAB_ITEMS — never duplicate it here.
 */
const WORKSPACE_TAB_ICONS: Record<string, ReactNode> = {
  // workspace group
  Overview:          <Home className="size-3.5" />,
  Daily:             <Inbox className="size-3.5" />,
  Schedule:          <Inbox className="size-3.5" />,
  Audit:             <Shield className="size-3.5" />,
  Files:             <FolderOpen className="size-3.5" />,
  Members:           <Users className="size-3.5" />,
  WorkspaceSettings: <Settings className="size-3.5" />,
  TaskFormation:     <Inbox className="size-3.5" />,
  Tasks:             <ListTodo className="size-3.5" />,
  Quality:           <ClipboardCheck className="size-3.5" />,
  Approval:          <BadgeCheck className="size-3.5" />,
  Settlement:        <Receipt className="size-3.5" />,
  Issues:            <AlertCircle className="size-3.5" />,
  // notion group
  Knowledge:         <Notebook className="size-3.5" />,
  Pages:             <FileText className="size-3.5" />,
  Database:          <Table2 className="size-3.5" />,
  Templates:         <LayoutTemplate className="size-3.5" />,
  // notebooklm group
  Notebook:          <Brain className="size-3.5" />,
  AiChat:            <MessageSquare className="size-3.5" />,
  Sources:           <FileStack className="size-3.5" />,
  Research:          <BookOpen className="size-3.5" />,
};

/**
 * WORKSPACE_QUICK_ACCESS_TEMPLATES — quick-access icon strip items.
 *
 * Tab-based items are auto-derived from WORKSPACE_TAB_ITEMS so that
 * labels and IDs always stay in sync with workspace-nav-model.ts.
 * Only non-tab panel shortcuts (e.g. governance panel) are defined manually.
 */
const WORKSPACE_QUICK_ACCESS_TEMPLATES: readonly WorkspaceQuickAccessItem[] = [
  // Non-tab panel shortcut — not backed by a top-level WorkspaceTabValue
  {
    id: "governance",
    href: "{workspaceBaseHref}?tab=Overview&panel=governance",
    label: "治理",
    icon: <Shield className="size-3.5" />,
    isActive: (_pathname, options) =>
      resolveWorkspaceTabValue(options?.tab) === "Overview" && options?.panel === "governance",
  },
  // All tab-based items — derived from WORKSPACE_TAB_ITEMS; labels stay in sync
  ...WORKSPACE_TAB_ITEMS
    .filter((item) => item.value in WORKSPACE_TAB_ICONS)
    .map((item) => ({
      id: item.id,
      href: `{workspaceBaseHref}?tab=${item.value}`,
      label: item.label,
      icon: WORKSPACE_TAB_ICONS[item.value],
      isActive: (_pathname: string, options?: WorkspaceQuickAccessMatcherOptions) =>
        resolveWorkspaceTabValue(options?.tab) === item.value,
    })),
];

export function buildWorkspaceQuickAccessItems(
  workspaceId: string,
  accountId: string | undefined,
): WorkspaceQuickAccessItem[] {
  const workspaceBaseHref = accountId
    ? `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}`
    : "/";

  return WORKSPACE_QUICK_ACCESS_TEMPLATES.map((item) => ({
    ...item,
    href: item.href.replaceAll("{workspaceBaseHref}", workspaceBaseHref),
  }));
}

// ── useRecentWorkspaces ───────────────────────────────────────────────────────

interface WorkspaceLink {
  id: string;
  name: string;
  href: string;
}

const RECENT_WORKSPACES_STORAGE_PREFIX = "xuanwu:recent-workspaces:";

function getRecentStorageKey(accountId: string): string {
  return `${RECENT_WORKSPACES_STORAGE_PREFIX}${accountId}`;
}

function readRecentWorkspaceIds(accountId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(getRecentStorageKey(accountId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string" && item.length > 0);
  } catch {
    return [];
  }
}

function persistRecentWorkspaceIds(accountId: string, workspaceIds: string[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getRecentStorageKey(accountId), JSON.stringify(workspaceIds));
}

function trackWorkspaceFromPath(pathname: string, accountId: string): void {
  const workspaceId = getWorkspaceIdFromPath(pathname);
  if (!workspaceId) return;
  const recentIds = readRecentWorkspaceIds(accountId);
  const deduped = [workspaceId, ...recentIds.filter((id) => id !== workspaceId)].slice(0, 50);
  persistRecentWorkspaceIds(accountId, deduped);
}

export function useRecentWorkspaces(
  accountId: string | undefined,
  pathname: string,
  workspaces: WorkspaceEntity[],
): {
  isExpanded: boolean;
  setIsExpanded: (fn: (prev: boolean) => boolean) => void;
  recentWorkspaceLinks: WorkspaceLink[];
} {
  const [isExpanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!accountId) return;
    trackWorkspaceFromPath(pathname, accountId);
  }, [accountId, pathname]);

  const workspacesById = useMemo(
    () => Object.fromEntries(workspaces.map((workspace) => [workspace.id, workspace])),
    [workspaces],
  );

  const recentWorkspaceIds = useMemo(() => {
    if (!accountId) return [] as string[];
    const stored = readRecentWorkspaceIds(accountId);
    const currentId = getWorkspaceIdFromPath(pathname);
    if (!currentId) return stored;
    return [currentId, ...stored.filter((id) => id !== currentId)];
  }, [accountId, pathname]);

  const recentWorkspaceLinks = useMemo<WorkspaceLink[]>(() => {
    return recentWorkspaceIds
      .map<WorkspaceLink | null>((workspaceId) => {
        const workspace = workspacesById[workspaceId];
        if (!workspace) return null;
        const href = accountId
          ? `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspace.id)}`
          : "/";
        return { id: workspace.id, name: workspace.name, href };
      })
      .filter((item): item is WorkspaceLink => item !== null);
  }, [accountId, recentWorkspaceIds, workspacesById]);

  return {
    isExpanded,
    setIsExpanded: (fn) => setExpanded((prev) => fn(prev)),
    recentWorkspaceLinks,
  };
}

export function useSidebarLocale(): SidebarLocaleBundle | null {
  return null;
}

// ── Module-level instantiation ────────────────────────────────────────────────

const workspaceLifecycleUseCases = createClientWorkspaceLifecycleUseCases();

// ── WorkspaceQuickAccessRow ───────────────────────────────────────────────────

interface WorkspaceQuickAccessRowProps {
  items: WorkspaceQuickAccessItem[];
  pathname: string;
  currentPanel: string | null;
  currentWorkspaceTab: string | null;
  workspaceSettingsHref: string;
  isActiveRoute: (href: string) => boolean;
}

export function WorkspaceQuickAccessRow({
  items,
  pathname,
  currentPanel,
  currentWorkspaceTab,
  workspaceSettingsHref,
  isActiveRoute,
}: WorkspaceQuickAccessRowProps): React.ReactElement | null {
  if (items.length === 0) return null;

  return (
    <div className="shrink-0 border-b border-border/30 px-2 py-2">
      <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const active =
            item.isActive?.(pathname, {
              panel: currentPanel,
              tab: currentWorkspaceTab,
            }) ?? isActiveRoute(item.href);

          return (
            <Link
              key={item.id}
              href={item.href}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={`flex size-7 shrink-0 items-center justify-center rounded-md transition ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              }`}
            >
              {item.icon}
              <span className="sr-only">{item.label}</span>
            </Link>
          );
        })}

        {workspaceSettingsHref ? (
          <Link
            href={workspaceSettingsHref}
            aria-label="工作區設定"
            aria-current={currentPanel === "settings" ? "page" : undefined}
            className={`ml-auto flex size-7 shrink-0 items-center justify-center rounded-md transition ${
              currentPanel === "settings"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            }`}
          >
            <Settings className="size-3.5" />
            <span className="sr-only">工作區設定</span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}

// ── WorkspaceSectionContent ───────────────────────────────────────────────────

interface WorkspaceSectionContentProps {
  workspacePathId: string | null;
  navPrefs: NavPreferences;
  localeBundle: SidebarLocaleBundle | null;
  showRecentWorkspaces: boolean;
  visibleRecentWorkspaceLinks: WorkspaceLink[];
  hasOverflow: boolean;
  isExpanded: boolean;
  activeWorkspaceId: string | null;
  isActiveRoute: (href: string) => boolean;
  onSelectWorkspace: (id: string | null) => void;
  onToggleExpanded: () => void;
  getItemClassName: (active: boolean) => string;
  sectionTitleClassName: string;
}

export function WorkspaceSectionContent({
  workspacePathId,
  navPrefs,
  localeBundle: _localeBundle,
  showRecentWorkspaces,
  visibleRecentWorkspaceLinks,
  hasOverflow,
  isExpanded,
  activeWorkspaceId,
  isActiveRoute,
  onSelectWorkspace,
  onToggleExpanded,
  getItemClassName,
  sectionTitleClassName,
}: WorkspaceSectionContentProps): React.ReactElement | null {
  const searchParams = useSearchParams();
  const activeTab = resolveWorkspaceTabValue(searchParams.get("tab")) ?? "Overview";

  if (workspacePathId) {
    const enabledTabs = WORKSPACE_TAB_ITEMS.filter((tab) => {
      if (navPrefs.pinnedWorkspace.length === 0) return true;
      return navPrefs.pinnedWorkspace.includes(tab.id);
    });

    const domainOrder: WorkspaceDomainGroup[] = ["workspace", "notion", "notebooklm"];

    return (
      <nav className="space-y-3" aria-label="Workspace navigation">
        {domainOrder.map((group) => {
          const groupTabs = enabledTabs.filter((tab) => tab.domainGroup === group);
          if (groupTabs.length === 0) return null;
          return (
            <div key={group} className="space-y-0.5">
              <p className={sectionTitleClassName}>{WORKSPACE_DOMAIN_GROUP_LABELS[group]}</p>
              {groupTabs.map((tab) => {
                const href = `?tab=${encodeURIComponent(tab.value)}`;
                const active = activeTab === tab.value;
                return (
                  <Link
                    key={tab.id}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={getItemClassName(active)}
                  >
                    {WORKSPACE_TAB_ICONS[tab.value]}
                    {tab.label}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>
    );
  }

  if (!showRecentWorkspaces) return null;

  return (
    <div className="space-y-0.5">
      <p className={sectionTitleClassName}>最近工作區</p>
      {visibleRecentWorkspaceLinks.length === 0 ? (
        <p className="px-2 py-2 text-[11px] text-muted-foreground">尚無最近開啟的工作區。</p>
      ) : (
        visibleRecentWorkspaceLinks.map((workspace) => (
          <Link
            key={workspace.id}
            href={workspace.href}
            onClick={() => {
              onSelectWorkspace(workspace.id);
            }}
            className={`flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${
              activeWorkspaceId === workspace.id || isActiveRoute(workspace.href)
                ? "border border-primary/30 bg-primary/10 text-primary"
                : "border border-transparent text-foreground/80 hover:border-border/60 hover:bg-muted/70 hover:text-foreground"
            }`}
            title={workspace.name}
          >
            <span className="truncate">{workspace.name}</span>
          </Link>
        ))
      )}
      {hasOverflow && (
        <button
          type="button"
          onClick={onToggleExpanded}
          className="px-2 py-1 text-[11px] font-medium text-primary hover:underline"
        >
          {isExpanded ? "收起" : "顯示更多"}
        </button>
      )}
    </div>
  );
}

// ── CustomizeNavigationDialog ─────────────────────────────────────────────────

interface CustomizeNavigationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPreferencesChange: (prefs: NavPreferences) => void;
}

export function CustomizeNavigationDialog({
  open,
  onOpenChange,
  onPreferencesChange,
}: CustomizeNavigationDialogProps): React.ReactElement {
  const [draft, setDraft] = useState<NavPreferences>(() => readNavPreferences());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Customize navigation</DialogTitle>
          <DialogDescription>
            調整工作區側欄顯示偏好，僅影響你的個人介面。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.showLimitedWorkspaces}
              onChange={(event) => {
                setDraft((prev) => ({ ...prev, showLimitedWorkspaces: event.target.checked }));
              }}
            />
            側欄僅顯示固定數量的最近工作區
          </label>

          <div className="space-y-1.5">
            <label htmlFor="max-workspaces" className="text-xs font-medium text-muted-foreground">
              工作區數量上限
            </label>
            <Input
              id="max-workspaces"
              type="number"
              min={1}
              max={20}
              value={draft.maxWorkspaces}
              onChange={(event) => {
                const nextValue = Number.parseInt(event.target.value, 10);
                setDraft((prev) => ({
                  ...prev,
                  maxWorkspaces: Number.isNaN(nextValue)
                    ? prev.maxWorkspaces
                    : Math.max(1, Math.min(20, nextValue)),
                }));
              }}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setDraft(DEFAULT_NAV_PREFS);
            }}
          >
            重設預設
          </Button>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button
              type="button"
              onClick={() => {
                const normalized = sanitizeNavPreferences(draft);
                writeNavPreferences(normalized);
                onPreferencesChange(normalized);
                onOpenChange(false);
              }}
            >
              套用
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── CreateWorkspaceDialogRail ─────────────────────────────────────────────────

interface CreateWorkspaceDialogRailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId: string | null;
  accountType: "user" | "organization" | null;
  creatorUserId?: string;
  creatorDisplayName?: string;
  creatorEmail?: string;
  onNavigate: (href: string) => void;
}

export function CreateWorkspaceDialogRail({
  open,
  onOpenChange,
  accountId,
  accountType,
  creatorUserId,
  creatorDisplayName,
  creatorEmail,
  onNavigate,
}: CreateWorkspaceDialogRailProps): React.ReactElement {
  const { createWorkspaceWithOwnerUseCase } = workspaceLifecycleUseCases;
  const [workspaceName, setWorkspaceName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  function reset() {
    setWorkspaceName("");
    setError(null);
    setIsCreating(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = workspaceName.trim();
    const creatorActorId = creatorUserId ?? accountId;
    const ownerDisplayName = creatorDisplayName?.trim();
    if (!name) {
      setError("請輸入工作區名稱。");
      return;
    }
    if (!creatorActorId || !ownerDisplayName) {
      setError("建立者名稱缺失，請重新登入後再試。");
      return;
    }
    if (!accountId || !accountType) {
      setError("帳號資訊已失效，請重新登入後再建立工作區。");
      return;
    }

    setIsCreating(true);
    setError(null);
    const result = await createWorkspaceWithOwnerUseCase.execute({
      workspace: {
        accountId,
        accountType,
        name,
      },
      owner: {
        actorId: creatorActorId,
        displayName: ownerDisplayName,
        email: creatorEmail?.trim() || undefined,
      },
    });
    if (!result.success) {
      setError(result.error.message);
      setIsCreating(false);
      return;
    }

    reset();
    onOpenChange(false);
    onNavigate(`/${encodeURIComponent(accountId)}/${encodeURIComponent(result.aggregateId)}?tab=Overview`);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) reset();
      }}
    >
      <DialogContent aria-describedby="rail-create-workspace-description">
        <DialogHeader>
          <DialogTitle>建立新工作區</DialogTitle>
          <DialogDescription id="rail-create-workspace-description">
            輸入名稱後會直接建立工作區並加入目前帳號的工作區清單中。
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="rail-workspace-name">
              工作區名稱
            </label>
            <Input
              id="rail-workspace-name"
              value={workspaceName}
              onChange={(event) => {
                setWorkspaceName(event.target.value);
                if (error) setError(null);
              }}
              placeholder="例如：Project Alpha"
              disabled={isCreating}
              maxLength={80}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              disabled={isCreating}
            >
              取消
            </Button>
            <Button type="submit" disabled={isCreating || !accountId || !accountType}>
              {isCreating ? "建立中…" : "直接建立"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export type { ReactNode };
