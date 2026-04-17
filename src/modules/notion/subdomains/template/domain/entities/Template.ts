/**
 * Template — distilled from notion taxonomy subdomain
 * Represents a reusable page/database template.
 */
export type TemplateScope = "workspace" | "organization" | "global";
export type TemplateCategory = "page" | "database" | "workflow";

export interface Template {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly scope: TemplateScope;
  readonly category: TemplateCategory;
  readonly workspaceId?: string;
  readonly organizationId?: string;
  readonly createdByUserId: string;
  readonly pageSnapshotId?: string;
  readonly databaseSnapshotId?: string;
  readonly tags: string[];
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface TemplateRepository {
  save(template: Template): Promise<void>;
  findById(id: string): Promise<Template | null>;
  findByScope(scope: TemplateScope, contextId?: string): Promise<Template[]>;
  listByCategory(category: TemplateCategory): Promise<Template[]>;
  delete(id: string): Promise<void>;
}
