import { BookOpen, Brain, Database, FileText, FolderOpen, Home, Library, MessageSquare, Notebook, Shield, User, Users } from "lucide-react";
import type { ReactNode } from "react";

const NON_ACCOUNT_WORKSPACE_TOP_LEVEL_ROUTES = new Set([
  "workspace",
  "organization",
  "settings",
  "dashboard",
  "dev-tools",
]);

function isWorkspaceScopedPath(pathname: string) {
  if (pathname.startsWith("/workspace/")) {
    return true;
  }

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length < 2) {
    return false;
  }

  return !NON_ACCOUNT_WORKSPACE_TOP_LEVEL_ROUTES.has(segments[0]);
}

export interface WorkspaceQuickAccessMatcherOptions {
  panel: string | null;
  tab: string | null;
}

export interface WorkspaceQuickAccessItem {
  href: string;
  label: string;
  icon: ReactNode;
  isActive?: (pathname: string, options?: WorkspaceQuickAccessMatcherOptions) => boolean;
}

const WORKSPACE_QUICK_ACCESS_TEMPLATES: readonly WorkspaceQuickAccessItem[] = [
  {
    href: "/workspace/{workspaceId}?tab=Overview",
    label: "首頁",
    icon: <Home className="size-3.5" />,
    isActive: (pathname: string, options) =>
      isWorkspaceScopedPath(pathname) &&
      (options?.tab == null || options.tab === "Overview") &&
      options?.panel == null,
  },
  {
    href: "/workspace/{workspaceId}?tab=Overview&panel=knowledge-pages",
    label: "知識頁面",
    icon: <FileText className="size-3.5" />,
    isActive: (pathname: string, options) =>
      isWorkspaceScopedPath(pathname) && options?.tab === "Overview" && options?.panel === "knowledge-pages",
  },
  {
    href: "/workspace/{workspaceId}?tab=Overview&panel=knowledge-base-articles",
    label: "文章",
    icon: <BookOpen className="size-3.5" />,
    isActive: (pathname: string, options) =>
      isWorkspaceScopedPath(pathname) && options?.tab === "Overview" && options?.panel === "knowledge-base-articles",
  },
  {
    href: "/workspace/{workspaceId}?tab=Files",
    label: "檔案",
    icon: <FolderOpen className="size-3.5" />,
    isActive: (pathname: string, options) =>
      isWorkspaceScopedPath(pathname) && options?.tab === "Files",
  },
  {
    href: "/workspace/{workspaceId}?tab=Members",
    label: "成員",
    icon: <Users className="size-3.5" />,
    isActive: (pathname: string, options) =>
      isWorkspaceScopedPath(pathname) && options?.tab === "Members",
  },
  {
    href: "/workspace/{workspaceId}?tab=Knowledge",
    label: "知識庫",
    icon: <Notebook className="size-3.5" />,
    isActive: (pathname: string, options) =>
      isWorkspaceScopedPath(pathname) && options?.tab === "Knowledge",
  },
  {
    href: "/workspace/{workspaceId}?tab=Notebook",
    label: "RAG 查詢",
    icon: <Brain className="size-3.5" />,
    isActive: (pathname: string, options) =>
      isWorkspaceScopedPath(pathname) && options?.tab === "Notebook",
  },
  {
    href: "/workspace/{workspaceId}?tab=AiChat",
    label: "AI 對話",
    icon: <MessageSquare className="size-3.5" />,
    isActive: (pathname: string, options) =>
      isWorkspaceScopedPath(pathname) && options?.tab === "AiChat",
  },
  {
    href: "/workspace/{workspaceId}?tab=Overview&panel=knowledge-databases",
    label: "資料庫",
    icon: <Database className="size-3.5" />,
    isActive: (pathname: string, options) =>
      isWorkspaceScopedPath(pathname) && options?.tab === "Overview" && options?.panel === "knowledge-databases",
  },
  {
    href: "/workspace/{workspaceId}?tab=Overview&panel=source-libraries",
    label: "來源庫",
    icon: <Library className="size-3.5" />,
    isActive: (pathname: string, options) =>
      isWorkspaceScopedPath(pathname) && options?.tab === "Overview" && options?.panel === "source-libraries",
  },
  {
    href: "/workspace/{workspaceId}?tab=Overview&panel=governance",
    label: "治理",
    icon: <Shield className="size-3.5" />,
    isActive: (pathname: string, options) =>
      isWorkspaceScopedPath(pathname) && options?.tab === "Overview" && options?.panel === "governance",
  },
  {
    href: "/workspace/{workspaceId}?tab=Overview&panel=profile",
    label: "工作區資料",
    icon: <User className="size-3.5" />,
    isActive: (pathname: string, options) =>
      isWorkspaceScopedPath(pathname) && options?.tab === "Overview" && options?.panel === "profile",
  },
];

export function buildWorkspaceQuickAccessItems(
  workspaceId: string,
  accountId?: string | null,
): WorkspaceQuickAccessItem[] {
  const encodedWorkspaceId = encodeURIComponent(workspaceId);
  const encodedAccountId = accountId ? encodeURIComponent(accountId) : "";
  const workspaceBaseHref = accountId
    ? `/${encodedAccountId}/workspace/${encodedWorkspaceId}`
    : "/";

  return WORKSPACE_QUICK_ACCESS_TEMPLATES.map((item) => ({
    ...item,
    href: item.href
      .replaceAll("/workspace/{workspaceId}", workspaceBaseHref)
      .replaceAll("{workspaceId}", encodedWorkspaceId),
  }));
}