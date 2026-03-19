import type { WorkspaceKnowledgeSummary } from "../entities/KnowledgeSummary";

export interface KnowledgeScope {
  readonly workspaceId: string;
}

export interface KnowledgeRepository {
  summarize(scope: KnowledgeScope): WorkspaceKnowledgeSummary;
}
