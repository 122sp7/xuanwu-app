/**
 * notebooklm/api/ui.ts
 *
 * UI-only surface for notebooklm bounded-context components and hooks.
 * Semantic capabilities remain in notebooklm/api/index.ts.
 */

export * from "../subdomains/source/api/ui";
export * from "../subdomains/synthesis/api/ui";

// ConversationPanel remains on the direct subdomain ui path to avoid the
// synchronous evaluation cycle documented in notebooklm/api/index.ts.
