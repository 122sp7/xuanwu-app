/**
 * @module workspace-flow/application/dto
 * @file materialize-from-knowledge.dto.ts
 * @description Command DTO for materializing Tasks and Invoices from a
 * `knowledge.page_approved` event payload.
 *
 * This DTO is used by both:
 *  - MaterializeTasksFromKnowledgeUseCase
 *  - KnowledgeToWorkflowMaterializer (Process Manager)
 */

import type { SourceReference } from "../../domain/value-objects/SourceReference";

export interface ExtractedTaskItem {
  readonly title: string;
  readonly dueDate?: string;
  readonly description?: string;
}

export interface ExtractedInvoiceItem {
  readonly amount: number;
  readonly description: string;
  readonly currency?: string;
}

export interface MaterializeFromKnowledgeDto {
  readonly workspaceId: string;
  /** ID of the KnowledgePage that was approved (same as sourceReference.id). */
  readonly knowledgePageId: string;
  /** Pre-built SourceReference value object to attach to every created entity. */
  readonly sourceReference: SourceReference;
  readonly extractedTasks: ReadonlyArray<ExtractedTaskItem>;
  readonly extractedInvoices: ReadonlyArray<ExtractedInvoiceItem>;
}
 
