/**
 * Module: notebooklm/subdomains/source
 * Layer: application/use-cases
 * Use Case: RenameSourceDocumentUseCase — renames a legacy source document.
 *
 * Actor: account owner
 * Goal: update the display name of a source document in accounts/{accountId}/documents.
 * Main success: document renamed, returns ok with documentId.
 * Failure: invalid input or persistence failure.
 */

import type { ISourceDocumentCommandPort } from "../../domain/ports/ISourceDocumentPort";
import type { SourceFileCommandErrorCode } from "../dto/source-file.dto";

export interface RenameSourceDocumentInput {
  readonly accountId: string;
  readonly documentId: string;
  readonly newName: string;
}

type RenameSourceDocumentResult =
  | { ok: true; data: { documentId: string } }
  | { ok: false; error: { code: SourceFileCommandErrorCode; message: string } };

export class RenameSourceDocumentUseCase {
  constructor(
    private readonly documentPort: ISourceDocumentCommandPort,
  ) {}

  async execute(input: RenameSourceDocumentInput): Promise<RenameSourceDocumentResult> {
    const accountId = input.accountId.trim();
    const documentId = input.documentId.trim();
    const newName = input.newName.trim();

    if (!accountId || !documentId || !newName) {
      return { ok: false, error: { code: "FILE_INVALID_INPUT", message: "accountId, documentId and newName are required." } };
    }

    try {
      await this.documentPort.renameDocument(accountId, documentId, newName);
      return { ok: true, data: { documentId } };
    } catch (err) {
      return { ok: false, error: { code: "FILE_RENAME_FAILED", message: err instanceof Error ? err.message : "Rename failed." } };
    }
  }
}
