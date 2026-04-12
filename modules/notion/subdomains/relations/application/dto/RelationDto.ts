/**
 * Module: notion/subdomains/relations
 * Layer: application/dto
 * Purpose: Input/output contracts for relation operations.
 */

export interface CreateRelationDto {
  readonly sourceArtifactId: string;
  readonly targetArtifactId: string;
  readonly relationType: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
}

export interface RelationDto {
  readonly relationId: string;
  readonly sourceArtifactId: string;
  readonly targetArtifactId: string;
  readonly relationType: string;
  readonly direction: "forward" | "backward";
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly createdAtISO: string;
}
