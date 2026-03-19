export type {
  WorkspaceKnowledgeStatus,
  WorkspaceKnowledgeSummary,
} from "./entities/KnowledgeSummary";
export type { KnowledgeRepository, KnowledgeScope } from "./repositories/KnowledgeRepository";
export {
  deriveKnowledgeSummary,
  type KnowledgeSummaryCopy,
  type KnowledgeWorkspaceSnapshot,
} from "./services/derive-knowledge-summary";
