/**
 * modules/retrieval — module root barrel.
 *
 * Re-exports the full public surface including "use client" UI components.
 * "use server" code must import from "@/modules/search/api" (no UI components).
 * "use client" code and route files can import from here.
 */

export * from "./api";

// ── UI components ("use client" — safe for client-only callers) ───────────────
export { RagQueryView } from "./interfaces/components/RagQueryView";
export { RagView } from "./interfaces/components/RagView";
