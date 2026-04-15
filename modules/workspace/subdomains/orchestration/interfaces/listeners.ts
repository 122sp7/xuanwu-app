/**
 * @module orchestration/interfaces
 * @file listeners.ts
 * @description Public event listener surface for the orchestration subdomain.
 *
 * External modules subscribe through this surface to integrate the
 * knowledge → workspace-flow materialization path.
 *
 * @see knowledge-to-workflow-materializer.ts (process manager)
 */

import { getSharedEventBus, type SimpleEventBus } from "@shared-events";
import { KnowledgeToWorkflowMaterializer } from "../application/process-managers/knowledge-to-workflow-materializer";
import { makeTaskRepo } from "../../task/api/factories";
import { makeInvoiceRepo } from "../../settlement/api/factories";
import type { PageApprovedEvent } from "@/modules/notion/api";

// ── Public listener factory ───────────────────────────────────────────────────

let hasRegisteredKnowledgeToWorkflowListener = false;

/**
 * Creates a pre-wired `KnowledgeToWorkflowMaterializer` backed by Firebase repos.
 * Call `handle(event)` from your event bus subscriber.
 */
export function createKnowledgeToWorkflowListener(): KnowledgeToWorkflowMaterializer {
  return new KnowledgeToWorkflowMaterializer(
    makeTaskRepo(),
    makeInvoiceRepo(),
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
