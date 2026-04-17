"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  BadgeCheck,
  Brain,
  CalendarDays,
  ClipboardCheck,
  FileText,
  FolderOpen,
  Home,
  Inbox,
  ListTodo,
  MessageSquare,
  Notebook,
  Receipt,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";
import { Badge } from "@ui-shadcn/ui/badge";

import type { WorkspaceEntity } from "./WorkspaceContext";
import { useWorkspaceContext } from "./WorkspaceContext";
import { createClientWorkspaceLifecycleUseCases } from "../../outbound/firebase-composition";

export interface NavPreferences {
  readonly pinnedWorkspace: string[];
  readonly pinnedPersonal: string[];
  readonly showLimitedWorkspaces: boolean;
  readonly maxWorkspaces: number;
}

export type SidebarLocaleBundle = Record<string, string>;

type WorkspaceTabValue =
  | "Overview"
  | "Daily"
  | "Schedule"
  | "Audit"
  | "Files"
  | "Members"
  | "Knowledge"
  | "Notebook"
  | "AiChat"
  | "WorkspaceSettings"
  | "TaskFormation"
  | "Tasks"
  | "Quality"
  | "Approval"
  | "Settlement"
  | "Issues";

type WorkspaceDomainGroup = "workspace" | "notion" | "notebooklm";

interface WorkspaceTabItem {
  id: string;
  value: WorkspaceTabValue;
  label: string;
  domainGroup: WorkspaceDomainGroup;
}

const WORKSPACE_TAB_ITEMS: readonly WorkspaceTabItem[] = [
  { id: "overview", value: "Overview", label: "首頁", domainGroup: "workspace" },
  { id: "daily", value: "Daily", label: "每日", domainGroup: "workspace" },
  { id: "schedule", value: "Schedule", label: "排程", domainGroup: "workspace" },
  { id: "audit", value: "Audit", label: "稽核", domainGroup: "workspace" },
  { id: "files", value: "Files", label: "檔案", domainGroup: "workspace" },
  { id: "members", value: "Members", label: "成員", domainGroup: "workspace" },
  { id: "workspace-settings", value: "WorkspaceSettings", label: "工作區設定", domainGroup: "workspace" },
  { id: "knowledge", value: "Knowledge", label: "知識", domainGroup: "notion" },
  { id: "notebook", value: "Notebook", label: "RAG 查詢", domainGroup: "notebooklm" },
  { id: "ai-chat", value: "AiChat", label: "AI 對話", domainGroup: "notebooklm" },
  // Task lifecycle subdomains
  { id: "task-formation", value: "TaskFormation", label: "任務形成", domainGroup: "workspace" },
  { id: "tasks", value: "Tasks", label: "任務", domainGroup: "workspace" },
  { id: "quality", value: "Quality", label: "質檢", domainGroup: "workspace" },
  { id: "approval", value: "Approval", label: "驗收", domainGroup: "workspace" },
  { id: "settlement", value: "Settlement", label: "結算", domainGroup: "workspace" },
  { id: "issues", value: "Issues", label: "問題單", domainGroup: "workspace" },
] as const;

const WORKSPACE_DOMAIN_GROUP_LABELS: Record<WorkspaceDomainGroup, string> = {
  workspace: "Workspace",
  notion: "Notion",
  notebooklm: "NotebookLM",
};

const WORKSPACE_TAB_VALUE_SET = new Set<WorkspaceTabValue>(
  WORKSPACE_TAB_ITEMS.map((item) => item.value),
);

const WORKSPACE_TAB_ALIASES: Record<string, WorkspaceTabValue> = {
  Wiki: "Overview",
  NotionKnowledge: "Knowledge",
  NotebookConversation: "AiChat",
  NotebookSynthesis: "Notebook",
};

function resolveWorkspaceTabValue(value: string | null | undefined): WorkspaceTabValue | null {
  if (!value) return null;
  if (WORKSPACE_TAB_VALUE_SET.has(value as WorkspaceTabValue)) {
    return value as WorkspaceTabValue;
  }
  return WORKSPACE_TAB_ALIASES[value] ?? null;
}

// Bump version suffix whenever new default tab IDs are added so stale
// localStorage entries are discarded and users see the updated defaults.
const NAV_PREFS_STORAGE_KEY = "xuanwu:nav-preferences-v2";

const DEFAULT_NAV_PREFS: NavPreferences = {
  pinnedWorkspace: [
    "overview",
    "daily",
    "schedule",
    "audit",
    "knowledge",
    "files",
    "members",
    "notebook",
    "ai-chat",
    "workspace-settings",
    "dispatcher",
  ],
  pinnedPersonal: ["recent-workspaces"],
  showLimitedWorkspaces: false,
  maxWorkspaces: 8,
};

export const MAX_VISIBLE_RECENT_WORKSPACES = 8;

function sanitizeNavPreferences(input: Partial<NavPreferences> | null | undefined): NavPreferences {
  const storedPinned = Array.isArray(input?.pinnedWorkspace)
    ? input.pinnedWorkspace.filter((item): item is string => typeof item === "string")
    : DEFAULT_NAV_PREFS.pinnedWorkspace;

  // Additive merge: always include every default tab ID so that new domain
  // sections added to WORKSPACE_TAB_ITEMS remain visible even when an older
  // version of stored preferences is present.
  const pinnedWorkspace = Array.from(
    new Set([...storedPinned, ...DEFAULT_NAV_PREFS.pinnedWorkspace]),
  );

  const pinnedPersonal = Array.isArray(input?.pinnedPersonal)
    ? input.pinnedPersonal.filter((item): item is string => typeof item === "string")
    : DEFAULT_NAV_PREFS.pinnedPersonal;
  const maxWorkspaces = typeof input?.maxWorkspaces === "number"
    ? Math.min(20, Math.max(1, Math.floor(input.maxWorkspaces)))
    : DEFAULT_NAV_PREFS.maxWorkspaces;

  return {
    pinnedWorkspace: pinnedWorkspace.length > 0 ? pinnedWorkspace : DEFAULT_NAV_PREFS.pinnedWorkspace,
    pinnedPersonal: pinnedPersonal.length > 0 ? Array.from(new Set(pinnedPersonal)) : DEFAULT_NAV_PREFS.pinnedPersonal,
    showLimitedWorkspaces: input?.showLimitedWorkspaces ?? DEFAULT_NAV_PREFS.showLimitedWorkspaces,
    maxWorkspaces,
  };
}

function writeNavPreferences(prefs: NavPreferences): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(NAV_PREFS_STORAGE_KEY, JSON.stringify(prefs));
}

export function readNavPreferences(): NavPreferences {
  if (typeof window === "undefined") return DEFAULT_NAV_PREFS;
  try {
    const raw = window.localStorage.getItem(NAV_PREFS_STORAGE_KEY);
    if (!raw) return DEFAULT_NAV_PREFS;
    return sanitizeNavPreferences(JSON.parse(raw) as Partial<NavPreferences>);
  } catch {
    return DEFAULT_NAV_PREFS;
  }
}

const NON_ACCOUNT_WORKSPACE_TOP_LEVEL_ROUTES = new Set([
  "workspace",
  "organization",
  "settings",
  "dashboard",
  "dev-tools",
  "members",
  "teams",
  "permissions",
  "workspaces",
  "schedule",
  "daily",
  "audit",
]);

export function supportsWorkspaceSearchContext(pathname: string): boolean {
  return pathname === "/dashboard" || pathname === "/daily" || pathname === "/schedule";
}

export function getWorkspaceIdFromPath(pathname: string): string | null {
  const legacyMatch = pathname.match(/^\/workspace\/([^/]+)/);
  if (legacyMatch) return decodeURIComponent(legacyMatch[1]);

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length < 2) return null;

  const [firstSegment, secondSegment, thirdSegment] = segments;
  if (NON_ACCOUNT_WORKSPACE_TOP_LEVEL_ROUTES.has(firstSegment)) return null;

  if (secondSegment === "workspace") {
    if (!thirdSegment) return null;
    return decodeURIComponent(thirdSegment);
  }

  return decodeURIComponent(secondSegment);
}

export function appendWorkspaceContextQuery(
  href: string,
  context: { accountId: string | null; workspaceId: string | null },
): string {
  const { accountId, workspaceId } = context;
  if (!accountId && !workspaceId) return href;

  const [path, search = ""] = href.split("?");
  const params = new URLSearchParams(search);
  if (accountId) params.set("accountId", accountId);
  if (workspaceId) params.set("workspaceId", workspaceId);
  const query = params.toString();
  return query.length > 0 ? `${path}?${query}` : path;
}

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

const WORKSPACE_QUICK_ACCESS_TEMPLATES: readonly WorkspaceQuickAccessItem[] = [
  {
    id: "overview",
    href: "{workspaceBaseHref}?tab=Overview",
    label: "首頁",
    icon: <Home className="size-3.5" />,
    isActive: (_pathname, options) => resolveWorkspaceTabValue(options?.tab) === "Overview" && options?.panel == null,
  },
  {
    id: "knowledge-pages",
    href: "{workspaceBaseHref}?tab=Overview&panel=knowledge-pages",
    label: "知識頁面",
    icon: <FileText className="size-3.5" />,
    isActive: (_pathname, options) => resolveWorkspaceTabValue(options?.tab) === "Overview" && options?.panel === "knowledge-pages",
  },
  {
    id: "knowledge",
    href: "{workspaceBaseHref}?tab=Knowledge",
    label: "知識",
    icon: <Notebook className="size-3.5" />,
    isActive: (_pathname, options) => resolveWorkspaceTabValue(options?.tab) === "Knowledge",
  },
  {
    id: "files",
    href: "{workspaceBaseHref}?tab=Files",
    label: "檔案",
    icon: <FolderOpen className="size-3.5" />,
    isActive: (_pathname, options) => resolveWorkspaceTabValue(options?.tab) === "Files",
  },
  {
    id: "members",
    href: "{workspaceBaseHref}?tab=Members",
    label: "成員",
    icon: <Users className="size-3.5" />,
    isActive: (_pathname, options) => resolveWorkspaceTabValue(options?.tab) === "Members",
  },
  {
    id: "notebook",
    href: "{workspaceBaseHref}?tab=Notebook",
    label: "RAG",
    icon: <Brain className="size-3.5" />,
    isActive: (_pathname, options) => resolveWorkspaceTabValue(options?.tab) === "Notebook",
  },
  {
    id: "ai-chat",
    href: "{workspaceBaseHref}?tab=AiChat",
    label: "AI",
    icon: <MessageSquare className="size-3.5" />,
    isActive: (_pathname, options) => resolveWorkspaceTabValue(options?.tab) === "AiChat",
  },
  {
    id: "governance",
    href: "{workspaceBaseHref}?tab=Overview&panel=governance",
    label: "治理",
    icon: <Shield className="size-3.5" />,
    isActive: (_pathname, options) => resolveWorkspaceTabValue(options?.tab) === "Overview" && options?.panel === "governance",
  },
  // Task lifecycle quick access
  {
    id: "task-formation",
    href: "{workspaceBaseHref}?tab=TaskFormation",
    label: "任務形成",
    icon: <Inbox className="size-3.5" />,
    isActive: (_pathname, options) => resolveWorkspaceTabValue(options?.tab) === "TaskFormation",
  },
  {
    id: "tasks",
    href: "{workspaceBaseHref}?tab=Tasks",
    label: "任務",
    icon: <ListTodo className="size-3.5" />,
    isActive: (_pathname, options) => resolveWorkspaceTabValue(options?.tab) === "Tasks",
  },
  {
    id: "quality",
    href: "{workspaceBaseHref}?tab=Quality",
    label: "質檢",
    icon: <ClipboardCheck className="size-3.5" />,
    isActive: (_pathname, options) => resolveWorkspaceTabValue(options?.tab) === "Quality",
  },
  {
    id: "approval",
    href: "{workspaceBaseHref}?tab=Approval",
    label: "驗收",
    icon: <BadgeCheck className="size-3.5" />,
    isActive: (_pathname, options) => resolveWorkspaceTabValue(options?.tab) === "Approval",
  },
  {
    id: "settlement",
    href: "{workspaceBaseHref}?tab=Settlement",
    label: "結算",
    icon: <Receipt className="size-3.5" />,
    isActive: (_pathname, options) => resolveWorkspaceTabValue(options?.tab) === "Settlement",
  },
  {
    id: "issues",
    href: "{workspaceBaseHref}?tab=Issues",
    label: "問題單",
    icon: <AlertCircle className="size-3.5" />,
    isActive: (_pathname, options) => resolveWorkspaceTabValue(options?.tab) === "Issues",
  },
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

const workspaceLifecycleUseCases = createClientWorkspaceLifecycleUseCases();

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
          const active = item.isActive?.(pathname, {
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

interface CreateWorkspaceDialogRailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId: string | null;
  accountType: "user" | "organization" | null;
  creatorUserId?: string;
  onNavigate: (href: string) => void;
}

export function CreateWorkspaceDialogRail({
  open,
  onOpenChange,
  accountId,
  accountType,
  creatorUserId,
  onNavigate,
}: CreateWorkspaceDialogRailProps): React.ReactElement {
  const { createWorkspaceUseCase } = workspaceLifecycleUseCases;
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
    if (!name) {
      setError("請輸入工作區名稱。");
      return;
    }
    if (!creatorActorId) {
      setError("建立者資訊缺失，請重新登入後再試。");
      return;
    }
    if (!accountId || !accountType) {
      setError("帳號資訊已失效，請重新登入後再建立工作區。");
      return;
    }

    setIsCreating(true);
    setError(null);
    const result = await createWorkspaceUseCase.execute({
      accountId,
      accountType,
      name,
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

function getLifecycleBadgeVariant(lifecycleState: WorkspaceEntity["lifecycleState"]) {
  switch (lifecycleState) {
    case "active":
      return "default" as const;
    case "preparatory":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
}

export function AccountDashboardRouteScreen(): React.ReactElement {
  return (
    <div className="px-4 py-6 text-sm text-muted-foreground">
      Account Dashboard (stub)
    </div>
  ) as React.ReactElement;
}

export function OrganizationWorkspacesRouteScreen(): React.ReactElement {
  return (
    <div className="px-4 py-6 text-sm text-muted-foreground">
      Organization Workspaces (stub)
    </div>
  ) as React.ReactElement;
}

interface WorkspaceDetailRouteScreenProps {
  workspaceId: string;
  accountId: string;
  accountsHydrated: boolean;
  initialTab?: string;
  initialOverviewPanel?: string;
}

export function WorkspaceDetailRouteScreen({
  workspaceId,
  accountId,
  accountsHydrated,
  initialTab,
  initialOverviewPanel,
}: WorkspaceDetailRouteScreenProps): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state: workspaceState } = useWorkspaceContext();

  const activeTab = resolveWorkspaceTabValue(
    searchParams.get("tab") ?? initialTab ?? "Overview",
  ) ?? "Overview";
  const activePanel = searchParams.get("panel") ?? initialOverviewPanel ?? null;

  useEffect(() => {
    if (searchParams.get("tab")) return;
    const params = new URLSearchParams();
    params.set("tab", activeTab);
    if (activePanel) params.set("panel", activePanel);
    router.replace(`/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}?${params.toString()}`);
  }, [accountId, activePanel, activeTab, router, searchParams, workspaceId]);

  const workspace = workspaceState.workspaces[workspaceId] ?? null;
  if (!workspace) {
    if (!accountsHydrated || !workspaceState.workspacesHydrated) {
      return (
        <div className="px-4 py-6 text-sm text-muted-foreground">工作區載入中…</div>
      ) as React.ReactElement;
    }
    return (
      <div className="space-y-3 px-4 py-6 text-sm text-muted-foreground">
        <p>找不到此工作區或目前帳號沒有存取權。</p>
        <Link href={`/${encodeURIComponent(accountId)}`} className="text-primary hover:underline">
          返回工作區中心
        </Link>
      </div>
    ) as React.ReactElement;
  }

  const tabHref = (tab: WorkspaceTabValue) =>
    `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}?tab=${encodeURIComponent(tab)}`;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{workspace.name}</h1>
          <Badge variant={getLifecycleBadgeVariant(workspace.lifecycleState)}>
            {workspace.lifecycleState}
          </Badge>
          <Badge variant="outline">{workspace.visibility}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">Workspace ID: {workspace.id}</p>
      </div>

      <nav className="flex flex-wrap gap-2" aria-label="Workspace tabs">
        {WORKSPACE_TAB_ITEMS.map((tab) => {
          const active = tab.value === activeTab;
          return (
            <Link
              key={tab.id}
              href={tabHref(tab.value)}
              aria-current={active ? "page" : undefined}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border/60 text-muted-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <section className="rounded-xl border border-border/40 bg-card/30 p-4">
        {activeTab === "Overview" && (
          <div className="space-y-3">
            <p className="text-sm text-foreground">Workspace Overview</p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}?tab=Overview&panel=knowledge-pages`}
                className="rounded-md border border-border/60 px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted"
              >
                知識頁面
              </Link>
              <Link
                href={`/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}?tab=Overview&panel=knowledge-base-articles`}
                className="rounded-md border border-border/60 px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted"
              >
                文章
              </Link>
              <Link
                href={`/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}?tab=Overview&panel=settings`}
                className="rounded-md border border-border/60 px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted"
              >
                設定
              </Link>
            </div>
            {activePanel && (
              <p className="text-xs text-muted-foreground">當前 Overview panel：{activePanel}</p>
            )}
          </div>
        )}
        {activeTab !== "Overview" && (
          <p className="text-sm text-muted-foreground">
            {WORKSPACE_TAB_ITEMS.find((tab) => tab.value === activeTab)?.label ?? activeTab} 分頁內容仍在整合中，已恢復 tab 導航與 URL 狀態。
          </p>
        )}
      </section>
    </div>
  ) as React.ReactElement;
}

interface WorkspaceHubScreenProps {
  accountId: string | null;
  accountName: string | null;
  accountType: "organization" | "user" | null;
  accountsHydrated: boolean;
  isBootstrapSeeded: boolean;
  currentUserId: string | null;
}

export function WorkspaceHubScreen({
  accountId,
  accountName,
  accountType,
  accountsHydrated,
  isBootstrapSeeded,
  currentUserId: _currentUserId,
}: WorkspaceHubScreenProps): React.ReactElement {
  const router = useRouter();
  const { state: workspaceState } = useWorkspaceContext();
  const [createOpen, setCreateOpen] = useState(false);

  const workspaceList = useMemo(
    () =>
      Object.values(workspaceState.workspaces)
        .filter((workspace) => !accountId || workspace.accountId === accountId)
        .sort((left, right) => left.name.localeCompare(right.name, "zh-Hant")),
    [accountId, workspaceState.workspaces],
  );

  const stats = useMemo(
    () => ({
      total: workspaceList.length,
      active: workspaceList.filter((workspace) => workspace.lifecycleState === "active").length,
      preparatory: workspaceList.filter((workspace) => workspace.lifecycleState === "preparatory").length,
    }),
    [workspaceList],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Workspace Hub</h1>
          <p className="text-sm text-muted-foreground">
            {accountName ? `${accountName} 的工作區列表` : "目前帳號的工作區列表"}
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          disabled={!accountsHydrated || !accountId || !accountType}
        >
          {!accountsHydrated ? "同步帳號中…" : "建立工作區"}
        </Button>
      </div>

      {!accountsHydrated && (
        <div className="rounded-xl border border-border/40 px-4 py-3 text-sm text-muted-foreground">
          {isBootstrapSeeded ? "正在同步可用帳號與工作區資料…" : "正在載入帳號與工作區資料…"}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border/40 px-4 py-4">
          <p className="text-xs text-muted-foreground">Total Workspaces</p>
          <p className="mt-1 text-2xl font-semibold">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-border/40 px-4 py-4">
          <p className="text-xs text-muted-foreground">Active</p>
          <p className="mt-1 text-2xl font-semibold">{stats.active}</p>
        </div>
        <div className="rounded-xl border border-border/40 px-4 py-4">
          <p className="text-xs text-muted-foreground">Preparatory</p>
          <p className="mt-1 text-2xl font-semibold">{stats.preparatory}</p>
        </div>
      </div>

      <div className="space-y-3">
        {workspaceList.length === 0 ? (
          <div className="rounded-xl border border-border/40 px-4 py-4 text-sm text-muted-foreground">
            目前沒有可用工作區，請先建立一個工作區。
          </div>
        ) : (
          workspaceList.map((workspace) => (
            <Link
              key={workspace.id}
              href={accountId
                ? `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspace.id)}?tab=Overview`
                : "/"}
              className="block rounded-xl border border-border/40 px-4 py-4 transition hover:bg-muted/40"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{workspace.name}</p>
                  <p className="text-xs text-muted-foreground">{workspace.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getLifecycleBadgeVariant(workspace.lifecycleState)}>
                    {workspace.lifecycleState}
                  </Badge>
                  <Badge variant="outline">{workspace.visibility}</Badge>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      <CreateWorkspaceDialogRail
        open={createOpen}
        onOpenChange={setCreateOpen}
        accountId={accountId}
        accountType={accountType}
        onNavigate={(href) => {
          router.push(href);
        }}
      />
    </div>
  ) as React.ReactElement;
}

export function OrganizationTeamsRouteScreen(): React.ReactElement {
  return (
    <div className="px-4 py-6 text-sm text-muted-foreground">
      Teams (stub)
    </div>
  ) as React.ReactElement;
}

export function OrganizationScheduleRouteScreen(): React.ReactElement {
  return (
    <div className="px-4 py-6 text-sm text-muted-foreground">
      <div className="mb-2 flex items-center gap-2 text-foreground">
        <CalendarDays className="size-4" />
        <span className="font-medium">Schedule</span>
      </div>
      Schedule (stub)
    </div>
  ) as React.ReactElement;
}

export function OrganizationDailyRouteScreen(): React.ReactElement {
  return (
    <div className="px-4 py-6 text-sm text-muted-foreground">
      Daily (stub)
    </div>
  ) as React.ReactElement;
}

export function OrganizationAuditRouteScreen(): React.ReactElement {
  return (
    <div className="px-4 py-6 text-sm text-muted-foreground">
      Audit (stub)
    </div>
  ) as React.ReactElement;
}

export type { ReactNode };
