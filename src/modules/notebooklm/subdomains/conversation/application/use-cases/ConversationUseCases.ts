import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import { Conversation, type StartConversationInput } from "../../domain/entities/Conversation";
import type { ConversationRepository } from "../../domain/repositories/ConversationRepository";

export class StartConversationUseCase {
  constructor(private readonly repo: ConversationRepository) {}

  async execute(input: StartConversationInput): Promise<CommandResult> {
    try {
      const conv = Conversation.start(input);
      await this.repo.save(conv.getSnapshot());
      return commandSuccess(conv.id, Date.now());
    } catch (err) {
      return commandFailureFrom("START_CONVERSATION_FAILED", err instanceof Error ? err.message : "Failed to start conversation");
    }
  }
}

export class AddMessageToConversationUseCase {
  constructor(private readonly repo: ConversationRepository) {}

  async execute(input: {
    conversationId: string;
    role: "user" | "assistant" | "system";
    content: string;
  }): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findById(input.conversationId);
      if (!snapshot) return commandFailureFrom("CONVERSATION_NOT_FOUND", `Conversation ${input.conversationId} not found`);
      const conv = Conversation.reconstitute(snapshot);
      const msgId = conv.addMessage(input.role, input.content);
      await this.repo.save(conv.getSnapshot());
      return commandSuccess(msgId, Date.now());
    } catch (err) {
      return commandFailureFrom("ADD_MESSAGE_FAILED", err instanceof Error ? err.message : "Failed to add message");
    }
  }
}

export class LoadConversationUseCase {
  constructor(private readonly repo: ConversationRepository) {}

  async execute(conversationId: string) {
    return this.repo.findById(conversationId);
  }
}
