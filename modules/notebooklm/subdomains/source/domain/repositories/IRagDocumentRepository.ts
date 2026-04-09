/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/repositories
 * Port: IRagDocumentRepository — persistence contract for RagDocumentRecord.
 */

import type { RagDocumentRecord } from "../entities/RagDocument";

export interface IRagDocumentRepository {
  findByStoragePath(scope: {
    readonly organizationId: string;
    readonly workspaceId: string;
    readonly storagePath: string;
  }): Promise<RagDocumentRecord | null>;
  findByWorkspace(scope: {
    readonly organizationId: string;
    readonly workspaceId: string;
  }): Promise<readonly RagDocumentRecord[]>;
  saveUploaded(record: RagDocumentRecord): Promise<void>;
}
