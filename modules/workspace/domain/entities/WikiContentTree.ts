/**
 * Workspace wiki/content tree read models owned by workspace language.
 */

export type WikiAccountType = "user" | "organization";

export interface WikiWorkspaceRef {
  id: string;
  name: string;
}

export interface WikiContentItemNode {
  key: "spaces" | "pages" | "libraries" | "documents" | "vector-index" | "rag" | "ai-tools";
  label: string;
  href: string;
  enabled: boolean;
}

export interface WikiWorkspaceContentNode {
  workspaceId: string;
  workspaceName: string;
  href: string;
  contentBaseItems: WikiContentItemNode[];
}

export interface WikiAccountContentNode {
  accountId: string;
  accountName: string;
  accountType: WikiAccountType;
  isActive: boolean;
  membersHref?: string;
  teamsHref?: string;
  workspaces: WikiWorkspaceContentNode[];
}

export interface WikiAccountSeed {
  accountId: string;
  accountName: string;
  accountType: WikiAccountType;
  isActive: boolean;
}

