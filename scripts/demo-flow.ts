/**
 * scripts/demo-flow.ts
 *
 * Architecture Phase 2 — The Proof (Occam's Razor Edition)
 *
 * Demonstrates the Content → EventBus loop using only in-memory adapters.
 * Note: modules/wiki has been removed; graph steps are no longer included.
 *
 * Run with:
 *   npx tsx scripts/demo-flow.ts
 */

import { SimpleEventBus } from "../modules/shared/infrastructure/SimpleEventBus";
import { KnowledgeApi as ContentKnowledgeApi } from "../modules/knowledge/api/knowledge-api";

async function main() {
  const ACCOUNT_ID = "demo-account";
  const USER_ID = "demo-user";

  console.log("[1] Initialising event bus...");
  const eventBus = new SimpleEventBus();
  console.log("    ✓ SimpleEventBus ready\n");

  console.log("[2] Creating KnowledgeApi...");
  const contentApi = new ContentKnowledgeApi(eventBus);
  console.log("    ✓ KnowledgeApi ready\n");

  console.log('[3] Creating page "Hello World"...');
  const page = await contentApi.createPage(ACCOUNT_ID, "Hello World", USER_ID);
  console.log(`    ✓ page created  id=${page.id}\n`);

  console.log("[4] Adding an empty block to the page...");
  const block = await contentApi.addBlock(ACCOUNT_ID, page.id, "");
  console.log(`    ✓ block created  id=${block.id}\n`);

  console.log('[5] Updating block → "Hello [[World]]"...');
  const updated = await contentApi.updateBlock(ACCOUNT_ID, block.id, "Hello [[World]]");
  if (!updated) {
    throw new Error("ASSERTION FAILED: updateBlock returned null");
  }
  console.log(`    ✓ block updated  content="${updated.content.text}"\n`);

  console.log("✅  Demo flow completed successfully.");
}

main().catch((err) => {
  console.error("❌  Demo flow failed:", err);
  process.exit(1);
});
