export interface WikiBetaCitation {
  provider?: "vector" | "search";
  chunk_id?: string;
  doc_id?: string;
  filename?: string;
  json_gcs_uri?: string;
  search_id?: string;
  score?: number;
  text?: string;
}

export interface WikiBetaRagQueryResult {
  answer: string;
  citations: WikiBetaCitation[];
  cache: "hit" | "miss";
  vectorHits: number;
  searchHits: number;
  accountScope: string;
}

export interface WikiBetaParsedDocument {
  id: string;
  filename: string;
  workspaceId: string;
  sourceGcsUri: string;
  jsonGcsUri: string;
  pageCount: number;
  status: string;
  ragStatus: string;
  uploadedAt: Date | null;
}

export interface WikiBetaReindexInput {
  accountId: string;
  docId: string;
  jsonGcsUri: string;
  sourceGcsUri: string;
  filename: string;
  pageCount: number;
}

export type WikiBetaAccountType = "personal" | "organization";

export interface WikiBetaWorkspaceRef {
  id: string;
  name: string;
}

export interface WikiBetaKnowledgeItemNode {
  key: "spaces" | "pages" | "libraries" | "documents" | "vector-index" | "rag" | "ai-tools";
  label: string;
  href: string;
  enabled: boolean;
}

export interface WikiBetaWorkspaceKnowledgeNode {
  workspaceId: string;
  workspaceName: string;
  href: string;
  knowledgeBaseItems: WikiBetaKnowledgeItemNode[];
}

export interface WikiBetaAccountKnowledgeNode {
  accountId: string;
  accountName: string;
  accountType: WikiBetaAccountType;
  isActive: boolean;
  membersHref?: string;
  teamsHref?: string;
  workspaces: WikiBetaWorkspaceKnowledgeNode[];
}

export interface WikiBetaAccountSeed {
  accountId: string;
  accountName: string;
  accountType: WikiBetaAccountType;
  isActive: boolean;
}