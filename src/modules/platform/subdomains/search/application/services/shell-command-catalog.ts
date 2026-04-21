export interface ShellCommandCatalogItem {
  readonly href: string;
  readonly label: string;
  readonly group: "導覽" | "Workspace" | "Knowledge" | "AI";
}

/**
 * SHELL_COMMAND_CATALOG_ITEMS — global command palette navigation entries.
 *
 * Account-level hrefs (/workspace, /dashboard, /schedule, …) are resolved to
 * /{accountId}/… at runtime via buildShellContextualHref from
 * platform/subdomains/platform-config/application/services/shell-navigation-catalog.
 *
 * Workspace-tab hrefs (/workspace?tab=…) are resolved to
 * /{accountId}/{workspaceId}?tab=… by the same helper.
 *
 * Tab values must stay in sync with WorkspaceTabValue in workspace-nav-model.ts.
 * Route labels must stay in sync with ROUTE_TITLES in shell-navigation-catalog.ts.
 */
const SHELL_COMMAND_CATALOG_ITEMS: readonly ShellCommandCatalogItem[] = [
  // ── Account-level routes ──────────────────────────────────────────────────
  { href: "/workspace",              label: "工作區中心",        group: "導覽" },
  { href: "/dashboard",              label: "儀表板",            group: "導覽" },
  { href: "/organization",           label: "組織治理",          group: "導覽" },
  { href: "/members",                label: "組織 · 成員",       group: "導覽" },
  { href: "/teams",                  label: "組織 · 團隊",       group: "導覽" },
  { href: "/permissions",            label: "組織 · 權限",       group: "導覽" },
  { href: "/workspaces",             label: "組織 · 工作區",     group: "導覽" },
  { href: "/daily",                  label: "帳號 · 每日",       group: "導覽" },
  { href: "/schedule",               label: "帳號 · 調度台",     group: "導覽" },
  { href: "/schedule/dispatcher",    label: "帳號 · 調度台",     group: "導覽" },
  { href: "/audit",                  label: "帳號 · 日誌",       group: "導覽" },

  // ── Workspace tabs (workspace group) ─────────────────────────────────────
  { href: "/workspace?tab=Overview",          label: "工作區 · 首頁",    group: "Workspace" },
  { href: "/workspace?tab=Daily",             label: "工作區 · 每日",    group: "Workspace" },
  { href: "/workspace?tab=Schedule",          label: "工作區 · 排程",    group: "Workspace" },
  { href: "/workspace?tab=Audit",             label: "工作區 · 日誌",    group: "Workspace" },
  { href: "/workspace?tab=Files",             label: "工作區 · 檔案",    group: "Workspace" },
  { href: "/workspace?tab=Members",           label: "工作區 · 成員",    group: "Workspace" },
  { href: "/workspace?tab=WorkspaceSettings", label: "工作區 · 設定",    group: "Workspace" },
  { href: "/workspace?tab=TaskFormation",     label: "工作區 · 任務形成", group: "Workspace" },
  { href: "/workspace?tab=Tasks",             label: "工作區 · 任務",    group: "Workspace" },
  { href: "/workspace?tab=Quality",           label: "工作區 · 質檢",    group: "Workspace" },
  { href: "/workspace?tab=Approval",          label: "工作區 · 驗收",    group: "Workspace" },
  { href: "/workspace?tab=Settlement",        label: "工作區 · 結算",    group: "Workspace" },
  { href: "/workspace?tab=Issues",            label: "工作區 · 問題單",  group: "Workspace" },

  // ── Knowledge tabs (notion group) ────────────────────────────────────────
  { href: "/workspace?tab=Knowledge",  label: "工作區 · 知識",   group: "Knowledge" },
  { href: "/workspace?tab=Pages",      label: "工作區 · 頁面",   group: "Knowledge" },
  { href: "/workspace?tab=Database",   label: "工作區 · 資料庫", group: "Knowledge" },
  { href: "/workspace?tab=Templates",  label: "工作區 · 範本",   group: "Knowledge" },

  // ── AI tabs (notebooklm group) ────────────────────────────────────────────
  { href: "/workspace?tab=Notebook",   label: "工作區 · RAG 查詢",  group: "AI" },
  { href: "/workspace?tab=AiChat",     label: "工作區 · AI 對話",   group: "AI" },
  { href: "/workspace?tab=Sources",    label: "工作區 · 來源文件",  group: "AI" },
  { href: "/workspace?tab=Research",   label: "工作區 · 研究摘要",  group: "AI" },
] as const;

export function listShellCommandCatalogItems(): readonly ShellCommandCatalogItem[] {
  return SHELL_COMMAND_CATALOG_ITEMS;
}
