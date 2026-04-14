/**
 * workspace api/index.ts
 *
 * Canonical public boundary for the workspace bounded context.
 *
 * Cross-module consumers (app/, other modules) MUST import from this path:
 *   import { ... } from "@/modules/workspace/api"
 *
 * Direct imports into domain/, application/, infrastructure/, interfaces/, or
 * ports/ sub-directories from outside this bounded context are forbidden.
 *
 * Surface breakdown:
 *  - contracts.ts  → types, value-object helpers, domain event contracts
 *  - facade.ts     → commands and queries (Server Actions / query functions)
 *  - ui.ts         → web UI components, hooks, navigation, state utilities
 */

export * from "./contracts";
export * from "./facade";

// UI components, hooks, and navigation helpers live in workspace/api/ui.ts.
