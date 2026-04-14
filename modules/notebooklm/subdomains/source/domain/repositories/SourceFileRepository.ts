/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/repositories
 * Port: SourceFileRepository — persistence contract for SourceFile aggregates.
 */

import type { SourceFile } from "../entities/SourceFile";
import type { SourceFileVersion } from "../entities/SourceFileVersion";

export interface ListSourceFilesScope {
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly actorAccountId: string;
}

export interface SourceFileRepository {
  findById(fileId: string): Promise<SourceFile | null>;
  findVersion(fileId: string, versionId: string): Promise<SourceFileVersion | null>;
  listVersions(fileId: string): Promise<readonly SourceFileVersion[]>;
  listByWorkspace(scope: ListSourceFilesScope): Promise<readonly SourceFile[]>;
  save(file: SourceFile, versions?: readonly SourceFileVersion[]): Promise<void>;
}
