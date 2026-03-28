/**
 * @module workspace-flow/api
 * @file listeners.ts
 * @description Public event listener interface for workspace-flow.
 *
 * External modules (primarily the `content` module's event bus) subscribe to
 * workspace-flow through this surface.  The concrete implementation is the
 * `ContentToWorkflowMaterializer` process manager.
 *
 * ## Usage
 * ```ts
 * import { createContentToWorkflowListener } from "@/modules/workspace-flow/api";
 *
 * const listener = createContentToWorkflowListener(workspaceId);
 * eventBus.subscribe("content.page_approved", (event) => listener.handle(event));
 * ```
 *
 * @see ADR-001: docs/architecture/adr/ADR-001-content-to-workflow-boundary.md
 */

import { ContentToWorkflowMaterializer } from "../application/process-managers/content-to-workflow-materializer";
import { FirebaseTaskRepository } from "../infrastructure/repositories/FirebaseTaskRepository";
import { FirebaseInvoiceRepository } from "../infrastructure/repositories/FirebaseInvoiceRepository";
import type { ContentPageApprovedEvent } from "@/modules/content/api/events";

// ── Public listener factory ───────────────────────────────────────────────────

/**
 * Creates a pre-wired `ContentToWorkflowMaterializer` backed by Firebase repos.
 * Call `handle(event, workspaceId)` from your event bus subscriber.
 */
export function createContentToWorkflowListener(): ContentToWorkflowMaterializer {
  return new ContentToWorkflowMaterializer(
    new FirebaseTaskRepository(),
    new FirebaseInvoiceRepository(),
  );
}

// ── Listener type contracts ───────────────────────────────────────────────────

/** Shape of any handler that can process a `content.page_approved` event. */
export interface ContentPageApprovedHandler {
  handle(event: ContentPageApprovedEvent, workspaceId: string): Promise<boolean>;
}

export type { ContentPageApprovedEvent };
