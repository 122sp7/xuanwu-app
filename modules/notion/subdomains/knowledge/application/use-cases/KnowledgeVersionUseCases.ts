import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { CreateKnowledgeVersionDto } from "../dto/KnowledgePageDto";
import { CreateKnowledgeVersionSchema } from "../dto/KnowledgePageDto";

export class PublishKnowledgeVersionUseCase {
  async execute(input: CreateKnowledgeVersionDto): Promise<CommandResult> {
    const parsed = CreateKnowledgeVersionSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_VERSION_INVALID_INPUT", parsed.error.message);
    return commandFailureFrom("CONTENT_VERSION_NOT_IMPLEMENTED", "Version persistence is not yet implemented.");
  }
}

export class ListKnowledgeVersionsUseCase {
  async execute(_accountId: string, _pageId: string): Promise<never[]> { return []; }
}
