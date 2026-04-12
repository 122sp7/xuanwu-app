/**
 * Module: notebooklm/subdomains/conversation
 * Layer: api/server
 *
 * Server-only boundary for the conversation subdomain.
 * Import this path only from Server Components, Server Actions, or route handlers.
 * Do NOT import in client components or public api/index.ts.
 */

export { FirebaseThreadRepository } from "../../../infrastructure/conversation/firebase/FirebaseThreadRepository";
export { makeThreadRepo } from "../../../interfaces/conversation/composition/adapters";
export type { ConversationUseCases } from "../../../interfaces/conversation/composition/use-cases";
export { makeConversationUseCases } from "../../../interfaces/conversation/composition/use-cases";
