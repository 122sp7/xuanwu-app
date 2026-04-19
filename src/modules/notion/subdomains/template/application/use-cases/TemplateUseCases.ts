import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { Template, TemplateCategory, TemplateScope, TemplateRepository } from "../../domain/entities/Template";

export interface CreateTemplateInput {
  readonly workspaceId: string;
  readonly title: string;
  readonly category: TemplateCategory;
  readonly createdByUserId: string;
  readonly description?: string;
}

export class QueryTemplatesUseCase {
  constructor(private readonly repo: TemplateRepository) {}

  async execute(workspaceId: string): Promise<Template[]> {
    return this.repo.findByScope("workspace" as TemplateScope, workspaceId);
  }
}

export class CreateTemplateUseCase {
  constructor(private readonly repo: TemplateRepository) {}

  async execute(input: CreateTemplateInput): Promise<CommandResult> {
    try {
      const now = new Date().toISOString();
      const template: Template = {
        id: uuid(),
        title: input.title,
        description: input.description,
        scope: "workspace",
        category: input.category,
        workspaceId: input.workspaceId,
        createdByUserId: input.createdByUserId,
        tags: [],
        createdAtISO: now,
        updatedAtISO: now,
      };
      await this.repo.save(template);
      return commandSuccess(template.id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "CREATE_TEMPLATE_FAILED",
        err instanceof Error ? err.message : "Failed to create template",
      );
    }
  }
}
