/**
 * Notion Module — public API surface.
 * All cross-module consumers must import from here only.
 */

// page
export * from "./subdomains/page/domain";
export * from "./subdomains/page/application";
export { InMemoryPageRepository } from "./subdomains/page/adapters/outbound/memory/InMemoryPageRepository";

// block
export * from "./subdomains/block/domain";
export * from "./subdomains/block/application";
export { InMemoryBlockRepository } from "./subdomains/block/adapters/outbound/memory/InMemoryBlockRepository";

// database
export * from "./subdomains/database/domain";
export * from "./subdomains/database/application";
export { InMemoryDatabaseRepository } from "./subdomains/database/adapters/outbound/memory/InMemoryDatabaseRepository";

// knowledge (canonical KnowledgeArtifact aggregate)
export * from "./subdomains/knowledge/domain";
export * from "./subdomains/knowledge/application";
export { InMemoryKnowledgeArtifactRepository } from "./subdomains/knowledge/adapters/outbound/memory/InMemoryKnowledgeArtifactRepository";

// view
export type {
  ViewSnapshot,
  ViewType,
  FilterCondition,
  SortCondition,
  ViewRepository,
} from "./subdomains/view/domain/entities/View";

// collaboration
export type {
  Comment,
  CommentRepository,
  PagePresence,
  PresenceStatus,
} from "./subdomains/collaboration/domain/entities/Comment";

// template
export type {
  Template,
  TemplateRepository,
  TemplateScope,
  TemplateCategory,
} from "./subdomains/template/domain/entities/Template";
