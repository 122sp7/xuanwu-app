import { BookOpen, Brain, Database, FileText, FolderOpen, Home, Users } from "lucide-react";
import type { ReactNode } from "react";

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
      pathname.startsWith("/workspace/") &&
      (options?.tab == null || options.tab === "Overview") &&
      options?.panel !== "settings",
  },
  {
    href: "/workspace/{workspaceId}?tab=Overview&panel=knowledge-pages",
    label: "知識頁面",
    icon: <FileText className="size-3.5" />,
    isActive: (pathname: string, options) =>
      pathname.startsWith("/workspace/") && options?.tab === "Overview" && options?.panel === "knowledge-pages",
  },
  {
    href: "/workspace/{workspaceId}?tab=Overview&panel=knowledge-base-articles",
    label: "文章",
    icon: <BookOpen className="size-3.5" />,
    isActive: (pathname: string, options) =>
      pathname.startsWith("/workspace/") && options?.tab === "Overview" && options?.panel === "knowledge-base-articles",
  },
  {
    href: "/workspace/{workspaceId}?tab=Files",
    label: "檔案",
    icon: <FolderOpen className="size-3.5" />,
    isActive: (pathname: string, options) =>
      pathname.startsWith("/workspace/") && options?.tab === "Files",
  },
  {
    href: "/workspace/{workspaceId}?tab=Members",
    label: "成員",
    icon: <Users className="size-3.5" />,
    isActive: (pathname: string, options) =>
      pathname.startsWith("/workspace/") && options?.tab === "Members",
  },
  {
    href: "/notebook/rag-query?workspaceId={workspaceId}",
    label: "RAG 查詢",
    icon: <Brain className="size-3.5" />,
    isActive: (pathname: string) =>
      pathname === "/notebook/rag-query" || pathname.startsWith("/notebook/rag-query/"),
  },
  {
    href: "/workspace/{workspaceId}?tab=Overview&panel=source-libraries",
    label: "資料庫",
    icon: <Database className="size-3.5" />,
    isActive: (pathname: string, options) =>
      pathname.startsWith("/workspace/") && options?.tab === "Overview" && options?.panel === "source-libraries",
  },
];

export function buildWorkspaceQuickAccessItems(workspaceId: string): WorkspaceQuickAccessItem[] {
  const encodedWorkspaceId = encodeURIComponent(workspaceId);
  return WORKSPACE_QUICK_ACCESS_TEMPLATES.map((item) => ({
    ...item,
    href: item.href.replaceAll("{workspaceId}", encodedWorkspaceId),
  }));
}