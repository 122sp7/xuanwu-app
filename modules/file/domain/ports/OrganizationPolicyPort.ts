import type { RetentionPolicy } from "../entities/RetentionPolicy";

export interface OrganizationFilePolicySnapshot {
  readonly organizationId: string;
  readonly policyVersion: number;
  readonly denyRead: boolean;
  readonly denyUpload: boolean;
  readonly denyDownload: boolean;
  readonly denyArchive: boolean;
  readonly denyRestore: boolean;
  readonly retentionPolicy?: RetentionPolicy;
}

export interface OrganizationPolicyPort {
  getOrganizationFilePolicy(organizationId: string): OrganizationFilePolicySnapshot | null;
}

