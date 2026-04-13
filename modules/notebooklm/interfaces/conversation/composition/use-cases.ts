/**
 * Module: notebooklm/interfaces/conversation/composition
 * Layer: interfaces/composition
 *
 * Conversation use-case composition factory.
 * Wires SaveThreadUseCase and LoadThreadUseCase with their Firestore adapter.
 * Default arguments make this self-wiring for production use.
 */

import type { ThreadRepository } from "../../../subdomains/conversation/domain/repositories/ThreadRepository";
import { SaveThreadUseCase } from "../../../subdomains/conversation/application/use-cases/save-thread.use-case";
import { LoadThreadUseCase } from "../../../subdomains/conversation/application/use-cases/load-thread.use-case";
import { makeThreadRepo } from "./adapters";

export interface ConversationUseCases {
  saveThread: SaveThreadUseCase;
  loadThread: LoadThreadUseCase;
}

export function makeConversationUseCases(
  repo: ThreadRepository = makeThreadRepo(),
): ConversationUseCases {
  return {
    saveThread: new SaveThreadUseCase(repo),
    loadThread: new LoadThreadUseCase(repo),
  };
}
