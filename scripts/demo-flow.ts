/**
 * scripts/demo-flow.ts
 *
 * Architecture Phase 2 — The Proof (Occam's Razor Edition)
 *
 * Demonstrates the full Content → EventBus → Knowledge loop using only
 * in-memory adapters.  No UI, no external database required.
 *
 * Run with:
 *   npx tsx scripts/demo-flow.ts
 *
 * Expected output:
 *   [1] Initialising event bus...           ✓
 *   [2] Creating KnowledgeApi...              ✓
 *   [3] Creating KnowledgeApi (subscribed)  ✓
 *   [4] Creating page "Hello World"...      ✓  pageId=<uuid>
 *   [5] Adding block to page...             ✓  blockId=<uuid>
 *   [6] Updating block → "Hello [[World]]"  ✓
 *   [7] Asserting KnowledgeService reacted  ✓  links=[{…}]
 *   ✅  Demo flow completed successfully.
 */

import { SimpleEventBus } from "../modules/shared/infrastructure/SimpleEventBus";
import { KnowledgeApi as ContentKnowledgeApi } from "../modules/knowledge/api/knowledge-api";
import { KnowledgeApi as GraphKnowledgeApi } from "../modules/ai/api/knowledge-api";

async function main() {
  const ACCOUNT_ID = "demo-account";
  const USER_ID = "demo-user";

  // ── Step 1: Initialise Event Bus ─────────────────────────────────────────
  console.log("[1] Initialising event bus...");
  const eventBus = new SimpleEventBus();
  console.log("    ✓ SimpleEventBus ready\n");

  // ── Step 2 & 3: Wire KnowledgeApi and KnowledgeApi ──────────────────────────
  console.log("[2] Creating KnowledgeApi...");
  const contentApi = new ContentKnowledgeApi(eventBus);
  console.log("    ✓ KnowledgeApi ready\n");

  console.log("[3] Creating KnowledgeApi (subscribing to event bus)...");
  const knowledgeApi = new GraphKnowledgeApi(eventBus);
  console.log("    ✓ KnowledgeApi ready — LinkExtractorService subscribed\n");

  // ── Step 4: Create a Page ─────────────────────────────────────────────────
  console.log('[4] Creating page "Hello World"...');
  const page = await contentApi.createPage(ACCOUNT_ID, "Hello World", USER_ID);
  console.log(`    ✓ page created  id=${page.id}\n`);

  // ── Step 5: Add a Block ───────────────────────────────────────────────────
  console.log("[5] Adding an empty block to the page...");
  const block = await contentApi.addBlock(ACCOUNT_ID, page.id, "");
  console.log(`    ✓ block created  id=${block.id}\n`);

  // ── Step 6: Update Block with a WikiLink ──────────────────────────────────
  console.log('[6] Updating block → "Hello [[World]]"...');
  const updated = await contentApi.updateBlock(ACCOUNT_ID, block.id, "Hello [[World]]");
  if (!updated) {
    throw new Error("ASSERTION FAILED: updateBlock returned null");
  }
  console.log(`    ✓ block updated  content="${updated.content.text}"\n`);

  // ── Step 7: Assert KnowledgeApi reacted ──────────────────────────────────
  console.log("[7] Asserting KnowledgeApi created a Link to 'world'...");
  const links = await knowledgeApi.getOutgoingLinks(page.id);
  const nodes = await knowledgeApi.listNodes();

  if (links.length === 0) {
    throw new Error("ASSERTION FAILED: expected at least one link, got 0");
  }

  const targetLink = links.find((l) => l.targetId === "world");
  if (!targetLink) {
    throw new Error(
      `ASSERTION FAILED: expected link with targetId="world", got: ${JSON.stringify(links)}`,
    );
  }

  const targetNode = nodes.find((n) => n.id === "world");
  if (!targetNode) {
    throw new Error(
      `ASSERTION FAILED: expected node with id="world", got: ${JSON.stringify(nodes)}`,
    );
  }

  console.log("    ✓ Links created:");
  for (const l of links) {
    console.log(`        ${l.sourceId} → ${l.targetId}  (${l.type})`);
  }
  console.log("    ✓ Nodes in graph:");
  for (const n of nodes) {
    console.log(`        id="${n.id}"  label="${n.label}"  type="${n.type}"`);
  }
  console.log();

  console.log("✅  Demo flow completed successfully.");
  console.log("    The Content → EventBus → Knowledge loop is working end-to-end.");
}

main().catch((err) => {
  console.error("❌  Demo flow failed:", err);
  process.exit(1);
});
