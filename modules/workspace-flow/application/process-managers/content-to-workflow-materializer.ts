/**
 * @module workspace-flow/application/process-managers
 * @file content-to-workflow-materializer.ts
 * @description Process Manager (Saga) that listens for `content.page_approved`
 * events and orchestrates the creation of Tasks and Invoices in workspace-flow.
 *
 * ## Responsibility
 * This class is the single entry point for the cross-module event-driven
 * integration between the `content` and `workspace-flow` bounded contexts.
 *
 * ## Idempotency
 * The process manager tracks processed `causationId` values to prevent
 * duplicate materialization if the same event is delivered more than once.
 * The seen-set is in-memory by default; production implementations should
 * persist to Firestore at:
 *   `workspaces/{workspaceId}/materializedEvents/{causationId}`
 * using a Firestore transaction to provide atomic idempotency guarantees.
 *
 * ## Placement
 * - Wired in: Cloud Function trigger (Firestore `onDocumentUpdated`) or
 *   `SimpleEventBus` subscriber registered at application startup.
 * - Alternative: `modules/shared/application/sagas/` for shared saga registry.
 *
 * @see ADR-001: docs/architecture/adr/ADR-001-content-to-workflow-boundary.md
 */

import type { KnowledgePageApprovedEvent } from "@/modules/knowledge/api/events";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { MaterializeTasksFromContentUseCase } from "../use-cases/materialize-tasks-from-content.use-case";
import type { SourceReference } from "../../domain/value-objects/SourceReference";

export class ContentToWorkflowMaterializer {
  /**
   * In-memory idempotency guard.
   * Replace with a persistent store in production.
   */
  private readonly processedCausationIds = new Set<string>();

  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  /**
   * Handle a `content.page_approved` event.
   *
   * @param event - The full event payload from the content module's public API.
   * @param workspaceId - Target workspace where Tasks/Invoices will be created.
   *   Typically resolved from the event's `workspaceId` field if present.
   * @returns true if materialization succeeded, false if skipped (idempotency) or failed.
   */
  async handle(event: KnowledgePageApprovedEvent, workspaceId: string): Promise<boolean> {
    // ── Idempotency guard ──────────────────────────────────────────────────
    if (this.processedCausationIds.has(event.causationId)) {
      return false;
    }

    if (!workspaceId.trim()) return false;

    const sourceReference: SourceReference = {
      type: "KnowledgePage",
      id: event.pageId,
      causationId: event.causationId,
      correlationId: event.correlationId,
    };

    const useCase = new MaterializeTasksFromContentUseCase(
      this.taskRepository,
      this.invoiceRepository,
    );

    const result = await useCase.execute({
      workspaceId,
      contentPageId: event.pageId,
      sourceReference,
      extractedTasks: event.extractedTasks,
      extractedInvoices: event.extractedInvoices,
    });

    if (result.success) {
      // Mark as processed only after successful materialization
      this.processedCausationIds.add(event.causationId);
      return true;
    }

    return false;
  }
}
