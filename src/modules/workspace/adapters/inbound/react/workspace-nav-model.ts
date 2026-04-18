/**
 * workspace-nav-model — pure navigation model for the workspace context.
 *
 * Domain-aware tab/group model, URL utilities, and nav-preferences persistence.
 * No JSX, no React hooks — safe to import in Server Components or shared utils.
 *
 * Tab ID naming convention:
 *   <domainGroup>.<slug>  e.g. "notion.knowledge", "notebooklm.ai-chat"
 * Tab value naming convention (URL ?tab= query param):
 *   PascalCase, must remain stable to preserve bookmarked URLs.
 */

// ── Types & interfaces ────────────────────────────────────────────────────────

export interface NavPreferences {
  readonly pinnedWorkspace: string[];
  readonly pinnedPersonal: string[];
  readonly showLimitedWorkspaces: boolean;
  readonly maxWorkspaces: number;
}

export type SidebarLocaleBundle = Record<string, string>;

/**
 * WorkspaceTabValue — canonical URL ?tab= values.
 * These are stable URL identifiers; do not rename without a redirect layer.
 */
export type WorkspaceTabValue =
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

/**
 * WorkspaceDomainGroup — the owning domain module for a workspace tab.
 *
 * workspace   → 業務運作 (Work Execution)
 * notion      → 知識與資料結構 (Knowledge & Data)
 * notebooklm  → AI 理解與推理 (AI Reasoning)
 */
export type WorkspaceDomainGroup = "workspace" | "notion" | "notebooklm";

export interface WorkspaceTabItem {
  /**
   * id — domain-prefixed stable identifier used in localStorage preferences.
   * Format: "<domainGroup>.<slug>", e.g. "notion.knowledge", "workspace.tasks".
   */
  readonly id: string;
  /** value — canonical URL ?tab= query param value. Never rename. */
  readonly value: WorkspaceTabValue;
  readonly label: string;
  readonly domainGroup: WorkspaceDomainGroup;
}

// ── Tab catalogue ─────────────────────────────────────────────────────────────

/**
 * WORKSPACE_TAB_ITEMS — authoritative ordered tab catalogue.
 *
 * id    — domain-prefixed localStorage key (workspace.*|notion.*|notebooklm.*)
 * value — URL ?tab= query param (must never be renamed without a redirect layer)
 */
export const WORKSPACE_TAB_ITEMS: readonly WorkspaceTabItem[] = [
  // workspace group — 業務運作
  { id: "workspace.overview",       value: "Overview",          label: "首頁",       domainGroup: "workspace" },
  { id: "workspace.daily",          value: "Daily",             label: "每日",       domainGroup: "workspace" },
  { id: "workspace.schedule",       value: "Schedule",          label: "排程",       domainGroup: "workspace" },
  { id: "workspace.audit",          value: "Audit",             label: "稽核",       domainGroup: "workspace" },
  { id: "workspace.files",          value: "Files",             label: "檔案",       domainGroup: "workspace" },
  { id: "workspace.members",        value: "Members",           label: "成員",       domainGroup: "workspace" },
  { id: "workspace.settings",       value: "WorkspaceSettings", label: "工作區設定", domainGroup: "workspace" },
  { id: "workspace.task-formation", value: "TaskFormation",     label: "任務形成",   domainGroup: "workspace" },
  { id: "workspace.tasks",          value: "Tasks",             label: "任務",       domainGroup: "workspace" },
  { id: "workspace.quality",        value: "Quality",           label: "質檢",       domainGroup: "workspace" },
  { id: "workspace.approval",       value: "Approval",          label: "驗收",       domainGroup: "workspace" },
  { id: "workspace.settlement",     value: "Settlement",        label: "結算",       domainGroup: "workspace" },
  { id: "workspace.issues",         value: "Issues",            label: "問題單",     domainGroup: "workspace" },

  // notion group — 知識與資料結構
  { id: "notion.knowledge",         value: "Knowledge",         label: "知識",       domainGroup: "notion" },

  // notebooklm group — AI 理解與推理
  { id: "notebooklm.notebook",      value: "Notebook",          label: "RAG 查詢",   domainGroup: "notebooklm" },
  { id: "notebooklm.ai-chat",       value: "AiChat",            label: "AI 對話",    domainGroup: "notebooklm" },
] as const;

export const WORKSPACE_DOMAIN_GROUP_LABELS: Record<WorkspaceDomainGroup, string> = {
  workspace:  "Workspace",
  notion:     "Notion",
  notebooklm: "NotebookLM",
};

const WORKSPACE_TAB_VALUE_SET = new Set<WorkspaceTabValue>(
  WORKSPACE_TAB_ITEMS.map((item) => item.value),
);

/** Legacy aliases: allow old ?tab= values to resolve to current canonical values. */
const WORKSPACE_TAB_ALIASES: Record<string, WorkspaceTabValue> = {
  Wiki:                 "Overview",
  NotionKnowledge:      "Knowledge",
  NotebookConversation: "AiChat",
  NotebookSynthesis:    "Notebook",
};

// ── Tab resolution helpers ────────────────────────────────────────────────────

export function resolveWorkspaceTabValue(value: string | null | undefined): WorkspaceTabValue | null {
  if (!value) return null;
  if (WORKSPACE_TAB_VALUE_SET.has(value as WorkspaceTabValue)) {
    return value as WorkspaceTabValue;
  }
  return WORKSPACE_TAB_ALIASES[value] ?? null;
}

/**
 * Returns the domain group for a given workspace tab value string.
 * Falls back to "workspace" when the tab is unknown or null (so the
 * workspace-specific sidebar sections remain visible by default).
 */
export function resolveTabDomainGroup(tab: string | null | undefined): WorkspaceDomainGroup {
  const resolved = resolveWorkspaceTabValue(tab);
  if (!resolved) return "workspace";
  return WORKSPACE_TAB_ITEMS.find((item) => item.value === resolved)?.domainGroup ?? "workspace";
}

// ── Nav preferences ───────────────────────────────────────────────────────────

// Bump version suffix whenever default tab IDs change so stale localStorage
// entries are discarded and users see the updated defaults.
// v3: tab IDs are now domain-prefixed (workspace.*, notion.*, notebooklm.*)
const NAV_PREFS_STORAGE_KEY = "xuanwu:nav-preferences-v3";

export const DEFAULT_NAV_PREFS: NavPreferences = {
  pinnedWorkspace: [
    "workspace.overview",
    "workspace.daily",
    "workspace.schedule",
    "workspace.audit",
    "notion.knowledge",
    "workspace.files",
    "workspace.members",
    "notebooklm.notebook",
    "notebooklm.ai-chat",
    "workspace.settings",
    "dispatcher",
  ],
  pinnedPersonal: ["recent-workspaces"],
  showLimitedWorkspaces: false,
  maxWorkspaces: 8,
};

export const MAX_VISIBLE_RECENT_WORKSPACES = 8;

export function sanitizeNavPreferences(input: Partial<NavPreferences> | null | undefined): NavPreferences {
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

  const maxWorkspaces =
    typeof input?.maxWorkspaces === "number"
      ? Math.min(20, Math.max(1, Math.floor(input.maxWorkspaces)))
      : DEFAULT_NAV_PREFS.maxWorkspaces;

  return {
    pinnedWorkspace: pinnedWorkspace.length > 0 ? pinnedWorkspace : DEFAULT_NAV_PREFS.pinnedWorkspace,
    pinnedPersonal:
      pinnedPersonal.length > 0
        ? Array.from(new Set(pinnedPersonal))
        : DEFAULT_NAV_PREFS.pinnedPersonal,
    showLimitedWorkspaces: input?.showLimitedWorkspaces ?? DEFAULT_NAV_PREFS.showLimitedWorkspaces,
    maxWorkspaces,
  };
}

export function writeNavPreferences(prefs: NavPreferences): void {
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

// ── URL / path utilities ──────────────────────────────────────────────────────

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
