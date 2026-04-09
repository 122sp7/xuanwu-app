/**
 * Module: notion/subdomains/collaboration
 * Layer: domain/repositories
 * Contract: IVersionRepository
 */

import type { VersionSnapshot } from "../aggregates/Version";

export interface CreateVersionInput {
  readonly contentId: string;
  readonly contentType: "page" | "article";
  readonly workspaceId: string;
  readonly accountId: string;
  readonly snapshotBlocks: unknown[];
  readonly label?: string | null;
  readonly description?: string | null;
  readonly createdByUserId: string;
}

export interface IVersionRepository {
  create(input: CreateVersionInput): Promise<VersionSnapshot>;
  delete(accountId: string, versionId: string): Promise<void>;
  findById(accountId: string, versionId: string): Promise<VersionSnapshot | null>;
  listByContent(accountId: string, contentId: string): Promise<VersionSnapshot[]>;
}
