import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import { Document, type CreateDocumentInput } from "../../domain/entities/Document";
import type { DocumentRepository, DocumentQuery } from "../../domain/repositories/DocumentRepository";

export class AddDocumentUseCase {
  constructor(private readonly repo: DocumentRepository) {}

  async execute(input: CreateDocumentInput): Promise<CommandResult> {
    try {
      const doc = Document.create(input);
      await this.repo.save(doc.getSnapshot());
      return commandSuccess(doc.id, Date.now());
    } catch (err) {
      return commandFailureFrom("ADD_DOCUMENT_FAILED", err instanceof Error ? err.message : "Failed to add document");
    }
  }
}

export class ArchiveDocumentUseCase {
  constructor(private readonly repo: DocumentRepository) {}

  async execute(documentId: string): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findById(documentId);
      if (!snapshot) return commandFailureFrom("DOCUMENT_NOT_FOUND", `Document ${documentId} not found`);
      const doc = Document.reconstitute(snapshot);
      doc.archive();
      await this.repo.save(doc.getSnapshot());
      return commandSuccess(documentId, Date.now());
    } catch (err) {
      return commandFailureFrom("ARCHIVE_DOCUMENT_FAILED", err instanceof Error ? err.message : "Failed to archive document");
    }
  }
}

export class QueryDocumentsUseCase {
  constructor(private readonly repo: DocumentRepository) {}

  async execute(params: DocumentQuery) {
    return this.repo.query(params);
  }
}
