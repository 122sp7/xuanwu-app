export type WorkspaceTabDevStatus = "🚧" | "🏗️" | "✅";

export type WorkspaceTabGroup = "primary" | "spaces" | "databases" | "library" | "modules";

export const WORKSPACE_TAB_SIDEBAR_GROUP_ORDER: readonly WorkspaceTabGroup[] = [
  "primary",
  "library",
  "modules",
  "spaces",
  "databases",
];

export const WORKSPACE_TAB_VALUES = [
  "Overview",
  "Files",
  "Members",
  "Daily",
  "Tasks",
  "TaskQa",
  "TaskAcceptance",
  "TaskIssues",
  "TaskFinance",
  "Schedule",
  "Audit",
  "Feed",
  "Knowledge",
  "NotionKnowledge",
  "NotionAuthoring",
  "NotionDatabase",
  "NotionCollaboration",
  "NotionRelations",
  "NotionTaxonomy",
  "Notebook",
  "NotebookConversation",
  "NotebookNotebook",
  "NotebookSource",
  "NotebookSynthesis",
  "AiChat",
  "WorkspaceSettings",
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
  TaskQa: { label: "Task QA", prefId: "task-qa", group: "modules", status: "🏗️" },
  TaskAcceptance: { label: "Task Acceptance", prefId: "task-acceptance", group: "modules", status: "🏗️" },
  TaskIssues: { label: "Task Issues", prefId: "task-issues", group: "modules", status: "🏗️" },
  TaskFinance: { label: "Task Finance", prefId: "task-finance", group: "modules", status: "🏗️" },
  Feed: { label: "Feed", prefId: "feed", group: "modules", status: "🏗️" },
  Knowledge: { label: "Knowledge", prefId: "knowledge", group: "modules", status: "🏗️" },
  WorkspaceSettings: { label: "Workspace Settings", prefId: "workspace-settings", group: "modules", status: "✅" },
  NotionKnowledge: { label: "Notion Knowledge", prefId: "notion-knowledge", group: "modules", status: "🏗️" },
  NotionAuthoring: { label: "Notion Authoring", prefId: "notion-authoring", group: "modules", status: "🏗️" },
  NotionDatabase: { label: "Notion Database", prefId: "notion-database", group: "modules", status: "🏗️" },
  NotionCollaboration: { label: "Notion Collaboration", prefId: "notion-collaboration", group: "modules", status: "🏗️" },
  NotionRelations: { label: "Notion Relations", prefId: "notion-relations", group: "modules", status: "🏗️" },
  NotionTaxonomy: { label: "Notion Taxonomy", prefId: "notion-taxonomy", group: "modules", status: "🏗️" },
  Notebook: { label: "Notebook", prefId: "notebook", group: "modules", status: "🏗️" },
  NotebookConversation: { label: "NotebookLM Conversation", prefId: "notebook-conversation", group: "modules", status: "🏗️" },
  NotebookNotebook: { label: "NotebookLM Notebook", prefId: "notebook-notebook", group: "modules", status: "🏗️" },
  NotebookSource: { label: "NotebookLM Source", prefId: "notebook-source", group: "modules", status: "🏗️" },
  NotebookSynthesis: { label: "NotebookLM Synthesis", prefId: "notebook-synthesis", group: "modules", status: "🏗️" },
  AiChat: { label: "AI Chat", prefId: "ai-chat", group: "modules", status: "🏗️" },
};

export const WORKSPACE_TAB_GROUPS: Record<WorkspaceTabGroup, readonly WorkspaceTabValue[]> = {
  primary: ["Overview"],
  spaces: [],
  databases: [],
  library: ["Files", "Members"],
  modules: [
    "Daily",
    "Tasks",
    "TaskQa",
    "TaskAcceptance",
    "TaskIssues",
    "TaskFinance",
    "Schedule",
    "Audit",
    "Feed",
    "Knowledge",
    "NotionKnowledge",
    "NotionAuthoring",
    "NotionDatabase",
    "NotionCollaboration",
    "NotionRelations",
    "NotionTaxonomy",
    "Notebook",
    "NotebookConversation",
    "NotebookNotebook",
    "NotebookSource",
    "NotebookSynthesis",
    "AiChat",
    "WorkspaceSettings",
  ],
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

export function getWorkspaceTabsInSidebarOrder(): WorkspaceTabValue[] {
  return WORKSPACE_TAB_SIDEBAR_GROUP_ORDER.flatMap((group) => getWorkspaceTabsByGroup(group));
}