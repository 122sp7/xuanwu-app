"use server";

/**
 * modules/interfaces/_actions/demo.actions.ts
 *
 * Architecture Phase 3 — Server Actions for the /debug/arch-demo page.
 *
 * MDDD boundary rule:
 *   Imports ONLY from `modules/system` (which re-exports via api/ paths).
 *   Never reaches into domain/, application/, or infrastructure/ layers.
 */

import { revalidatePath } from "next/cache";

import { contentApi, knowledgeApi, DEMO_ACCOUNT_ID } from "../../system";
import type { GraphDataDTO } from "../../knowledge-graph/api/knowledge-graph-api";

// ── Form-bound Server Actions (return void — re-render via revalidatePath) ──

/**
 * Create a new in-memory page.
 */
export async function createPageAction(formData: FormData): Promise<void> {
  const title = (formData.get("title") as string | null)?.trim() || "Untitled";
  await contentApi.createPage(DEMO_ACCOUNT_ID, title);
  revalidatePath("/debug/arch-demo");
}

/**
 * Add a block to an existing page.
 */
export async function addBlockAction(formData: FormData): Promise<void> {
  const pageId = (formData.get("pageId") as string | null)?.trim() ?? "";
  const text = (formData.get("text") as string | null) ?? "";
  if (!pageId) return;
  await contentApi.addBlock(DEMO_ACCOUNT_ID, pageId, text);
  revalidatePath("/debug/arch-demo");
}

/**
 * Update a block's text content.
 * If the text contains [[WikiLinks]], the event bus propagates the change to
 * KnowledgeApi, which extracts new graph nodes and edges.
 */
export async function updateBlockAction(formData: FormData): Promise<void> {
  const blockId = (formData.get("blockId") as string | null)?.trim() ?? "";
  const text = (formData.get("text") as string | null) ?? "";
  if (!blockId) return;
  await contentApi.updateBlock(DEMO_ACCOUNT_ID, blockId, text);
  revalidatePath("/debug/arch-demo");
}

/**
 * Expose the current graph data for programmatic use.
 */
export async function getGraphDataAction(): Promise<GraphDataDTO> {
  return knowledgeApi.getGraphData();
}
