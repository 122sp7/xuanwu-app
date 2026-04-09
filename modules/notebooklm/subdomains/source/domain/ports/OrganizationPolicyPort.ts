/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/ports
 * Port: OrganizationPolicyPort — resolves org-level file access policies.
 */

import type { SourceRetentionPolicy } from "../entities/SourceRetentionPolicy";

export interface OrganizationFilePolicySnapshot {
  readonly organizationId: string;
  readonly policyVersion: number;
  readonly denyRead: boolean;
  readonly denyUpload: boolean;
  readonly denyDownload: boolean;
  readonly denyArchive: boolean;
  readonly denyRestore: boolean;
  readonly retentionPolicy?: SourceRetentionPolicy;
}

export interface OrganizationPolicyPort {
  getOrganizationFilePolicy(organizationId: string): OrganizationFilePolicySnapshot | null;
}
