/**
 * Module: knowledge-collaboration
 * Layer: domain/repositories
 */

import type { Version } from "../entities/version.entity";

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
  create(input: CreateVersionInput): Promise<Version>;
  findById(accountId: string, versionId: string): Promise<Version | null>;
  listByContent(accountId: string, contentId: string): Promise<Version[]>;
  delete(accountId: string, versionId: string): Promise<void>;
}
