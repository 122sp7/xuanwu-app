/**
 * Module: workspace
 * Layer: domain/entities
 * Purpose: WikiBeta content-tree navigation types — the sidebar/overview tree
 *          built from workspace membership. Lives in workspace because the tree
 *          is anchored to account→workspace hierarchy.
 */

export type WikiBetaAccountType = "personal" | "organization";

export interface WikiBetaWorkspaceRef {
  id: string;
  name: string;
}

export interface WikiBetaContentItemNode {
  key: "spaces" | "pages" | "libraries" | "documents" | "vector-index" | "rag" | "ai-tools";
  label: string;
  href: string;
  enabled: boolean;
}

export interface WikiBetaWorkspaceContentNode {
  workspaceId: string;
  workspaceName: string;
  href: string;
  contentBaseItems: WikiBetaContentItemNode[];
}

export interface WikiBetaAccountContentNode {
  accountId: string;
  accountName: string;
  accountType: WikiBetaAccountType;
  isActive: boolean;
  membersHref?: string;
  teamsHref?: string;
  workspaces: WikiBetaWorkspaceContentNode[];
}

export interface WikiBetaAccountSeed {
  accountId: string;
  accountName: string;
  accountType: WikiBetaAccountType;
  isActive: boolean;
}
