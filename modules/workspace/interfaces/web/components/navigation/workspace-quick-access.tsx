import { BookOpen, Brain, Database, Files, FileText, FolderOpen, Home, Users } from "lucide-react";
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
    href: "/knowledge/pages?workspaceId={workspaceId}",
    label: "知識頁面",
    icon: <FileText className="size-3.5" />,
    isActive: (pathname: string) =>
      pathname === "/knowledge/pages" || pathname.startsWith("/knowledge/pages/"),
  },
  {
    href: "/knowledge-base/articles?workspaceId={workspaceId}",
    label: "文章",
    icon: <BookOpen className="size-3.5" />,
    isActive: (pathname: string) =>
      pathname === "/knowledge-base/articles" || pathname.startsWith("/knowledge-base/articles/"),
  },
  {
    href: "/workspace/{workspaceId}?tab=Files",
    label: "Files",
    icon: <FolderOpen className="size-3.5" />,
    isActive: (pathname: string, options) =>
      pathname.startsWith("/workspace/") && options?.tab === "Files",
  },
  {
    href: "/workspace/{workspaceId}?tab=Members",
    label: "Members",
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
    href: "/source/documents?workspaceId={workspaceId}",
    label: "文件",
    icon: <Files className="size-3.5" />,
    isActive: (pathname: string) =>
      pathname === "/source/documents" || pathname.startsWith("/source/documents/"),
  },
  {
    href: "/source/libraries?workspaceId={workspaceId}",
    label: "資料庫",
    icon: <Database className="size-3.5" />,
    isActive: (pathname: string) =>
      pathname === "/source/libraries" || pathname.startsWith("/source/libraries/"),
  },
];

export function buildWorkspaceQuickAccessItems(workspaceId: string): WorkspaceQuickAccessItem[] {
  const encodedWorkspaceId = encodeURIComponent(workspaceId);
  return WORKSPACE_QUICK_ACCESS_TEMPLATES.map((item) => ({
    ...item,
    href: item.href.replaceAll("{workspaceId}", encodedWorkspaceId),
  }));
}