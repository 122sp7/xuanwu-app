export type ShellNavSection =
  | "workspace"
  | "knowledge"
  | "knowledge-base"
  | "knowledge-database"
  | "source"
  | "notebook"
  | "ai-chat"
  | "account"
  | "organization"
  | "other";

export interface ShellNavItem {
  readonly id: string;
  readonly label: string;
  readonly href: string;
}

export const SHELL_ACCOUNT_SECTION_MATCHERS = [
  "/organization/daily",
  "/organization/schedule",
  "/organization/audit",
] as const;

const ROUTE_TITLES: Record<string, string> = {
  "/organization": "組織治理",
  "/organization/daily": "帳號 · 每日",
  "/organization/schedule": "帳號 · 排程",
  "/organization/schedule/dispatcher": "帳號 · 調度台",
  "/organization/audit": "帳號 · 稽核",
  "/workspace": "工作區中心",
  "/knowledge": "知識中心",
  "/knowledge/pages": "知識 · 頁面",
  "/knowledge/block-editor": "知識 · 區塊編輯器",
  "/knowledge-base/articles": "知識庫 · 文章",
  "/knowledge-database/databases": "知識資料庫 · 資料庫",
  "/source/documents": "來源 · 文件",
  "/source/libraries": "來源 · 資料庫",
  "/notebook/rag-query": "筆記本 · 問答 / 引用",
  "/ai-chat": "AI 對話",
  "/dev-tools": "開發工具",
};

const BREADCRUMB_LABELS: Record<string, string> = {
  organization: "組織",
  workspace: "工作區",
  wiki: "Account Wiki",
  "rag-query": "Ask / Cite",
  documents: "文件",
  libraries: "Libraries",
  pages: "頁面",
  "pages-dnd": "頁面 (DnD)",
  "block-editor": "區塊編輯器",
  "rag-reindex": "RAG 重新索引",
  "ai-chat": "Notebook",
  "dev-tools": "開發工具",
  namespaces: "命名空間",
  members: "成員",
  teams: "團隊",
  permissions: "權限",
  workspaces: "工作區清單",
  schedule: "排程",
  daily: "每日",
  audit: "稽核",
};

export const SHELL_ORGANIZATION_MANAGEMENT_ITEMS: readonly ShellNavItem[] = [];

export const SHELL_ACCOUNT_NAV_ITEMS: readonly ShellNavItem[] = [
  { id: "schedule", label: "排程", href: "/organization/schedule" },
  { id: "dispatcher", label: "調度台", href: "/organization/schedule/dispatcher" },
  { id: "daily", label: "每日", href: "/organization/daily" },
  { id: "audit", label: "稽核", href: "/organization/audit" },
] as const;

export const SHELL_SECTION_LABELS: Record<ShellNavSection, string> = {
  workspace: "工作區",
  knowledge: "知識",
  "knowledge-base": "知識庫",
  "knowledge-database": "知識資料庫",
  source: "來源",
  notebook: "筆記本",
  "ai-chat": "AI 對話",
  account: "帳號",
  organization: "組織",
  other: "導覽",
};

export function resolveShellNavSection(pathname: string): ShellNavSection {
  if (pathname.startsWith("/workspace")) return "workspace";
  if (pathname.startsWith("/knowledge-base")) return "knowledge-base";
  if (pathname.startsWith("/knowledge-database")) return "knowledge-database";
  if (pathname.startsWith("/knowledge")) return "knowledge";
  if (pathname.startsWith("/source")) return "source";
  if (pathname.startsWith("/notebook")) return "notebook";
  if (pathname.startsWith("/ai-chat")) return "ai-chat";
  if (
    SHELL_ACCOUNT_SECTION_MATCHERS.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
  ) {
    return "account";
  }
  if (pathname.startsWith("/organization")) return "organization";
  return "other";
}

export function resolveShellPageTitle(pathname: string): string {
  return ROUTE_TITLES[pathname] ?? "工作區";
}

export function resolveShellBreadcrumbLabel(segment: string): string {
  return BREADCRUMB_LABELS[segment] ?? segment;
}
