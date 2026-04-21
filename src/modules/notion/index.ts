/**
 * Notion Module — public API surface.
 * All cross-module consumers must import from here only.
 */

import type { DatabaseProperty, DatabaseSnapshot } from "./subdomains/database/domain";
import type { PageSnapshot } from "./subdomains/page/domain";
import type { CommandResult } from "../shared";

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

export async function listWorkspaceKnowledgePages(params: {
  accountId: string;
  workspaceId: string;
}): Promise<ReadonlyArray<PageSnapshot>> {
  const { queryPages } = await import("./adapters/outbound/firebase-composition");
  return queryPages(params);
}

export async function listWorkspaceKnowledgeDatabases(
  workspaceId: string,
): Promise<ReadonlyArray<DatabaseSnapshot>> {
  const { queryDatabases } = await import("./adapters/outbound/firebase-composition");
  return queryDatabases(workspaceId);
}

export async function addWorkspaceKnowledgeDatabaseProperty(
  databaseId: string,
  property: DatabaseProperty,
): Promise<CommandResult> {
  const { addDatabaseProperty } = await import("./adapters/outbound/firebase-composition");
  return addDatabaseProperty(databaseId, property);
}
