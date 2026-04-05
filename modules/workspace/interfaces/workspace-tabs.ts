export type WorkspaceTabDevStatus = "🚧" | "🏗️" | "✅";

export type WorkspaceTabGroup = "primary" | "spaces" | "databases" | "library" | "modules";

export const WORKSPACE_TAB_VALUES = [
  "Overview",
  "Favorites",
  "Recent",
  "Engineering",
  "Product",
  "Design",
  "Docs",
  "SOP",
  "Meeting Notes",
  "Members",
  "Projects",
  "Notes",
  "Documents",
  "Assets",
  "CRM",
  "Roadmap",
  "Daily",
  "Tags",
  "Files",
  "Templates",
  "Wiki",
  "Schedule",
  "Audit",
  "Tasks",
  "Feed",
  "Trash",
] as const;

export type WorkspaceTabValue = (typeof WORKSPACE_TAB_VALUES)[number];

interface WorkspaceTabMeta {
  readonly label: string;
  readonly prefId: string;
  readonly group: WorkspaceTabGroup;
  readonly status: WorkspaceTabDevStatus;
}

export const WORKSPACE_TAB_META: Record<WorkspaceTabValue, WorkspaceTabMeta> = {
  Overview: { label: "Home", prefId: "home", group: "primary", status: "🏗️" },
  Favorites: { label: "Favorites", prefId: "favorites", group: "primary", status: "🚧" },
  Recent: { label: "Recent", prefId: "recent", group: "primary", status: "🚧" },
  Engineering: { label: "Engineering", prefId: "engineering", group: "spaces", status: "🚧" },
  Product: { label: "Product", prefId: "product", group: "spaces", status: "🚧" },
  Design: { label: "Design", prefId: "design", group: "spaces", status: "🚧" },
  Docs: { label: "Docs", prefId: "docs", group: "spaces", status: "🚧" },
  SOP: { label: "SOP", prefId: "sop", group: "spaces", status: "🚧" },
  "Meeting Notes": {
    label: "Meeting Notes",
    prefId: "meeting-notes",
    group: "spaces",
    status: "🚧",
  },
  Members: { label: "Members", prefId: "members", group: "library", status: "✅" },
  Projects: { label: "Projects", prefId: "projects", group: "databases", status: "🏗️" },
  Notes: { label: "Notes", prefId: "notes", group: "databases", status: "🚧" },
  Documents: { label: "Documents", prefId: "documents", group: "databases", status: "🚧" },
  Assets: { label: "Assets", prefId: "assets", group: "databases", status: "🚧" },
  CRM: { label: "CRM", prefId: "crm", group: "databases", status: "🚧" },
  Roadmap: { label: "Roadmap", prefId: "roadmap", group: "databases", status: "🚧" },
  Daily: { label: "Daily", prefId: "daily", group: "modules", status: "✅" },
  Tags: { label: "Tags", prefId: "tags", group: "library", status: "🚧" },
  Files: { label: "Files", prefId: "files", group: "library", status: "✅" },
  Templates: { label: "Templates", prefId: "templates", group: "library", status: "🚧" },
  Wiki: {
    label: "Wiki",
    prefId: "wiki",
    group: "spaces",
    status: "🏗️",
  },
  Schedule: { label: "Schedule", prefId: "schedule", group: "modules", status: "✅" },
  Audit: { label: "Audit", prefId: "audit", group: "modules", status: "✅" },
  Tasks: { label: "Tasks", prefId: "tasks", group: "modules", status: "🏗️" },
  Feed: { label: "Feed", prefId: "feed", group: "modules", status: "🏗️" },
  Trash: { label: "Trash", prefId: "trash", group: "library", status: "🚧" },
};

export const WORKSPACE_TAB_GROUPS: Record<WorkspaceTabGroup, readonly WorkspaceTabValue[]> = {
  primary: ["Overview", "Recent", "Favorites"],
  spaces: ["Docs", "Wiki", "Meeting Notes", "SOP", "Engineering", "Product", "Design"],
  databases: ["Projects", "Roadmap", "Notes", "Documents", "Assets", "CRM"],
  library: ["Files", "Tags", "Templates", "Members", "Trash"],
  modules: ["Daily", "Schedule", "Audit", "Tasks", "Feed"],
};

const WORKSPACE_TAB_VALUE_SET = new Set<string>(WORKSPACE_TAB_VALUES);

export function isWorkspaceTabValue(value: string): value is WorkspaceTabValue {
  return WORKSPACE_TAB_VALUE_SET.has(value);
}

export function getWorkspaceTabMeta(tab: WorkspaceTabValue) {
  return WORKSPACE_TAB_META[tab];
}

export function getWorkspaceTabStatus(tab: WorkspaceTabValue): WorkspaceTabDevStatus {
  return WORKSPACE_TAB_META[tab].status;
}

export function getWorkspaceTabLabel(tab: WorkspaceTabValue): string {
  return WORKSPACE_TAB_META[tab].label;
}

export function getWorkspaceTabPrefId(tab: WorkspaceTabValue): string {
  return WORKSPACE_TAB_META[tab].prefId;
}

export function getWorkspaceTabsByGroup(group: WorkspaceTabGroup): readonly WorkspaceTabValue[] {
  return WORKSPACE_TAB_GROUPS[group];
}
