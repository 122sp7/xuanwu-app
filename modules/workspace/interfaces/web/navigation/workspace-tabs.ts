export type WorkspaceTabDevStatus = "🚧" | "🏗️" | "✅";

export type WorkspaceTabGroup = "primary" | "spaces" | "databases" | "library" | "modules";

export const WORKSPACE_TAB_VALUES = [
  "Overview",
  "Members",
  "Daily",
  "Files",
  "Schedule",
  "Audit",
  "Tasks",
  "Feed",
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
  Members: { label: "Members", prefId: "members", group: "library", status: "✅" },
  Daily: { label: "Daily", prefId: "daily", group: "modules", status: "✅" },
  Files: { label: "Files", prefId: "files", group: "library", status: "✅" },
  Schedule: { label: "Schedule", prefId: "schedule", group: "modules", status: "✅" },
  Audit: { label: "Audit", prefId: "audit", group: "modules", status: "✅" },
  Tasks: { label: "Tasks", prefId: "tasks", group: "modules", status: "🏗️" },
  Feed: { label: "Feed", prefId: "feed", group: "modules", status: "🏗️" },
};

export const WORKSPACE_TAB_GROUPS: Record<WorkspaceTabGroup, readonly WorkspaceTabValue[]> = {
  primary: ["Overview"],
  spaces: [],
  databases: [],
  library: ["Files", "Members"],
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