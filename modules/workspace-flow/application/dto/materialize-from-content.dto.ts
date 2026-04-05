/**
 * @module workspace-flow/application/dto
 * @file materialize-from-content.dto.ts
 * @description Command DTO for materializing Tasks and Invoices from a
 * `content.page_approved` event payload.
 *
 * This DTO is used by both:
 *  - MaterializeTasksFromContentUseCase
 *  - ContentToWorkflowMaterializer (Process Manager)
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

export interface MaterializeFromContentDto {
  readonly workspaceId: string;
  /** ID of the KnowledgePage that was approved (same as sourceReference.id). */
  readonly contentPageId: string;
  /** Pre-built SourceReference value object to attach to every created entity. */
  readonly sourceReference: SourceReference;
  readonly extractedTasks: ReadonlyArray<ExtractedTaskItem>;
  readonly extractedInvoices: ReadonlyArray<ExtractedInvoiceItem>;
}
