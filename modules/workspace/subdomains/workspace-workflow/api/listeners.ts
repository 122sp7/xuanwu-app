/**
 * @module workspace-flow/api
 * @file listeners.ts
 * @description Public event listener interface for workspace-flow.
 *
 * External modules (primarily the `knowledge` module's event bus) subscribe to
 * workspace-flow through this surface.  The concrete implementation is the
 * `KnowledgeToWorkflowMaterializer` process manager.
 *
 * ## Usage
 * ```ts
 * import { createKnowledgeToWorkflowListener } from "@/modules/workspace/api";
 *
 * const listener = createKnowledgeToWorkflowListener();
 * eventBus.subscribe("notion.knowledge.page-approved", (event) => listener.handle(event));
 * ```
 *
 * @see ADR-001: docs/architecture/adr/ADR-001-knowledge-to-workflow-boundary.md
 */

import { getSharedEventBus, type SimpleEventBus } from "@shared-events";
import { KnowledgeToWorkflowMaterializer } from "../application/process-managers/knowledge-to-workflow-materializer";
import { FirebaseTaskRepository } from "../infrastructure/repositories/FirebaseTaskRepository";
import { FirebaseInvoiceRepository } from "../infrastructure/repositories/FirebaseInvoiceRepository";
import type { PageApprovedEvent } from "@/modules/notion/api";

// ── Public listener factory ───────────────────────────────────────────────────

let hasRegisteredKnowledgeToWorkflowListener = false;

/**
 * Creates a pre-wired `KnowledgeToWorkflowMaterializer` backed by Firebase repos.
 * Call `handle(event, workspaceId)` from your event bus subscriber.
 */
export function createKnowledgeToWorkflowListener(): KnowledgeToWorkflowMaterializer {
  return new KnowledgeToWorkflowMaterializer(
    new FirebaseTaskRepository(),
    new FirebaseInvoiceRepository(),
  );
}

/**
 * Registers the workspace workflow materializer on the shared in-process bus.
 * Safe to call multiple times; registration happens only once per server runtime.
 */
export function registerKnowledgeToWorkflowListener(
  bus: SimpleEventBus = getSharedEventBus(),
): void {
  if (typeof window !== "undefined" || hasRegisteredKnowledgeToWorkflowListener) {
    return;
  }

  const listener = createKnowledgeToWorkflowListener();
  bus.subscribe("notion.knowledge.page-approved", async (event) => {
    await listener.handle(event as unknown as PageApprovedEvent);
  });

  hasRegisteredKnowledgeToWorkflowListener = true;
}

registerKnowledgeToWorkflowListener();

// ── Listener type contracts ───────────────────────────────────────────────────

/** Shape of any handler that can process a `notion.knowledge.page-approved` event. */
export interface KnowledgePageApprovedHandler {
  handle(event: PageApprovedEvent, workspaceId?: string): Promise<boolean>;
}

export type { PageApprovedEvent };
 
