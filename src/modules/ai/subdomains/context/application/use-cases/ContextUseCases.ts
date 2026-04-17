import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import { ContextSession } from "../../domain/entities/ContextSession";
import type { ContextSessionRepository } from "../../domain/repositories/ContextSessionRepository";

export class CreateContextSessionUseCase {
  constructor(private readonly repo: ContextSessionRepository) {}

  async execute(input: { actorId?: string; workspaceId?: string; systemPrompt?: string; model?: string }): Promise<CommandResult> {
    try {
      const session = ContextSession.create(input);
      await this.repo.save(session.getSnapshot());
      return commandSuccess(session.id, Date.now());
    } catch (err) {
      return commandFailureFrom("CREATE_CONTEXT_SESSION_FAILED", err instanceof Error ? err.message : "Failed");
    }
  }
}

export class AddContextMessageUseCase {
  constructor(private readonly repo: ContextSessionRepository) {}

  async execute(input: { sessionId: string; role: "user" | "assistant" | "system"; content: string }): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findById(input.sessionId);
      if (!snapshot) return commandFailureFrom("SESSION_NOT_FOUND", `Session ${input.sessionId} not found`);
      const session = ContextSession.reconstitute(snapshot);
      session.addMessage(input.role, input.content);
      await this.repo.save(session.getSnapshot());
      return commandSuccess(input.sessionId, Date.now());
    } catch (err) {
      return commandFailureFrom("ADD_MESSAGE_FAILED", err instanceof Error ? err.message : "Failed");
    }
  }
}
