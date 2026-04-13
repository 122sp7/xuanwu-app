/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/repositories
 * Port: RagDocumentRepository — persistence contract for RagDocumentRecord.
 */

import type { RagDocumentRecord } from "../entities/RagDocument";

export interface RagDocumentRepository {
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
