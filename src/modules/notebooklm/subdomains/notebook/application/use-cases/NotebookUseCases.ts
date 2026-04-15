import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import { Notebook, type CreateNotebookInput } from "../../domain/entities/Notebook";
import type { NotebookRepository } from "../../domain/repositories/NotebookRepository";
import type { NotebookGenerationPort } from "../../domain/ports/NotebookGenerationPort";

export class CreateNotebookUseCase {
  constructor(private readonly repo: NotebookRepository) {}

  async execute(input: CreateNotebookInput): Promise<CommandResult> {
    try {
      const notebook = Notebook.create(input);
      await this.repo.save(notebook.getSnapshot());
      return commandSuccess(notebook.id, Date.now());
    } catch (err) {
      return commandFailureFrom("CREATE_NOTEBOOK_FAILED", err instanceof Error ? err.message : "Failed to create notebook");
    }
  }
}

export class AddDocumentToNotebookUseCase {
  constructor(private readonly repo: NotebookRepository) {}

  async execute(notebookId: string, documentId: string): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findById(notebookId);
      if (!snapshot) return commandFailureFrom("NOTEBOOK_NOT_FOUND", `Notebook ${notebookId} not found`);
      const notebook = Notebook.reconstitute(snapshot);
      notebook.addDocument(documentId);
      await this.repo.save(notebook.getSnapshot());
      return commandSuccess(notebookId, Date.now());
    } catch (err) {
      return commandFailureFrom("ADD_DOCUMENT_FAILED", err instanceof Error ? err.message : "Failed");
    }
  }
}

export class GenerateNotebookResponseUseCase {
  constructor(
    private readonly repo: NotebookRepository,
    private readonly port: NotebookGenerationPort,
  ) {}

  async execute(input: {
    notebookId: string;
    prompt: string;
    model?: string;
  }): Promise<{ ok: true; text: string; model: string } | { ok: false; error: string }> {
    try {
      const snapshot = await this.repo.findById(input.notebookId);
      if (!snapshot) return { ok: false, error: `Notebook ${input.notebookId} not found` };
      const result = await this.port.generateResponse({
        prompt: input.prompt,
        notebookId: input.notebookId,
        model: input.model ?? snapshot.model,
      });
      return { ok: true, text: result.text, model: result.model };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "Generation failed" };
    }
  }
}
