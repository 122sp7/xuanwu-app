export interface ShellCommandCatalogItem {
  readonly href: string;
  readonly label: string;
  readonly group: "導覽" | "Knowledge" | "Source";
}

const SHELL_COMMAND_CATALOG_ITEMS: readonly ShellCommandCatalogItem[] = [
  { href: "/workspace", label: "Workspace Hub", group: "導覽" },
  { href: "/workspace?tab=Overview&panel=knowledge-pages", label: "Knowledge Pages", group: "導覽" },
  { href: "/workspace?tab=Overview&panel=knowledge-base-articles", label: "Knowledge Base", group: "導覽" },
  { href: "/workspace?tab=Overview&panel=knowledge-databases", label: "Knowledge Database", group: "導覽" },
  { href: "/workspace?tab=Overview&panel=source-libraries", label: "Source Libraries", group: "導覽" },
  { href: "/notebook/rag-query", label: "Notebook / AI", group: "導覽" },
  { href: "/ai-chat", label: "AI Chat", group: "導覽" },
  { href: "/workspace?tab=Overview&panel=knowledge-pages", label: "頁面管理", group: "Knowledge" },
  { href: "/knowledge/block-editor", label: "區塊編輯器", group: "Knowledge" },
  { href: "/workspace?tab=Overview&panel=source-libraries", label: "Libraries 表格", group: "Source" },
] as const;

export function listShellCommandCatalogItems(): readonly ShellCommandCatalogItem[] {
  return SHELL_COMMAND_CATALOG_ITEMS;
}
