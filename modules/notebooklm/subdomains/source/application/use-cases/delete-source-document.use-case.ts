/**
 * Module: notebooklm/subdomains/source
 * Layer: application/use-cases
 * Use Case: DeleteSourceDocumentUseCase — deletes a legacy source document.
 *
 * Actor: account owner
 * Goal: remove a source document from the accounts/{accountId}/documents collection.
 * Main success: document deleted, returns ok with documentId.
 * Failure: invalid input or persistence failure.
 */

import type { SourceDocumentCommandPort } from "../../domain/ports/SourceDocumentPort";
import type { SourceFileCommandErrorCode } from "../dto/source-file.dto";

export interface DeleteSourceDocumentInput {
  readonly accountId: string;
  readonly documentId: string;
}

type DeleteSourceDocumentResult =
  | { ok: true; data: { documentId: string } }
  | { ok: false; error: { code: SourceFileCommandErrorCode; message: string } };

export class DeleteSourceDocumentUseCase {
  constructor(
    private readonly documentPort: SourceDocumentCommandPort,
  ) {}

  async execute(input: DeleteSourceDocumentInput): Promise<DeleteSourceDocumentResult> {
    const accountId = input.accountId.trim();
    const documentId = input.documentId.trim();

    if (!accountId || !documentId) {
      return { ok: false, error: { code: "FILE_INVALID_INPUT", message: "accountId and documentId are required." } };
    }

    try {
      await this.documentPort.deleteDocument(accountId, documentId);
      return { ok: true, data: { documentId } };
    } catch (err) {
      return { ok: false, error: { code: "FILE_DELETE_FAILED", message: err instanceof Error ? err.message : "Delete failed." } };
    }
  }
}
