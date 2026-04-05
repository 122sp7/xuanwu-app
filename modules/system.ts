/**
 * modules/system.ts — Composition Root
 *
 * Architecture Phase 3: Interface Wiring
 *
 * Initialises and wires the singleton instances that power the
 * Content → EventBus demo loop.
 *
 * Responsibilities:
 *   1. Create the shared SimpleEventBus.
 *   2. Create KnowledgeApi (injected with the event bus).
 *
 * All state lives here — never in page files or global variables.
 *
 * MDDD boundary rule:
 *   Imports only from the api/ barrel of each module and from
 *   shared/infrastructure.  Never reaches into domain/, application/,
 *   or infrastructure/ layers of other modules.
 */

import { SimpleEventBus } from "./shared/infrastructure/SimpleEventBus";
import { KnowledgeApi } from "./knowledge/api/knowledge-api";

// ── Shared account used by the in-memory demo ──────────────────────────────

export const DEMO_ACCOUNT_ID = "demo-account";

// ── Singleton instances ────────────────────────────────────────────────────

const eventBus = new SimpleEventBus();
export const contentApi = new KnowledgeApi(eventBus);
