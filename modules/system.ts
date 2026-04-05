/**
 * modules/system.ts — Composition Root
 *
 * Architecture Phase 3: Interface Wiring
 *
 * Initialises and wires the singleton instances that power the
 * Content → EventBus → Knowledge demo loop.
 *
 * Responsibilities:
 *   1. Create the shared SimpleEventBus.
 *   2. Create KnowledgeApi (injected with the event bus).
 *   3. Create KnowledgeApi (injected with the event bus; auto-subscribes
 *      LinkExtractorService so it reacts to KnowledgeUpdatedEvents).
 *
 * All state lives here — never in page files or global variables.
 *
 * MDDD boundary rule:
 *   Imports only from the api/ barrel of each module and from
 *   shared/infrastructure.  Never reaches into domain/, application/,
 *   or infrastructure/ layers of other modules.
 */

import { SimpleEventBus } from "./shared/infrastructure/SimpleEventBus";
import { KnowledgeApi } from "./content/api/knowledge-api";
import { WikiApi } from "./knowledge-graph/api/wiki-api";

// ── Shared account used by the in-memory demo ──────────────────────────────

export const DEMO_ACCOUNT_ID = "demo-account";

// ── Singleton instances ────────────────────────────────────────────────────

const eventBus = new SimpleEventBus();
export const contentApi = new KnowledgeApi(eventBus);
export const knowledgeApi = new WikiApi(eventBus);
// KnowledgeApi constructor calls linkExtractor.registerOn(eventBus), so the
// subscription is active as soon as the module is imported.
