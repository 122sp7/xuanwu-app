import { v4 as uuid } from "@lib-uuid";
/**
 * Module: notion/subdomains/relations
 * Layer: application/use-cases
 * Purpose: Use case orchestration for relation operations.
 */

import type { RelationRepository } from "../../domain/repositories/RelationRepository";
import type { Relation, CreateRelationInput } from "../../domain/entities/Relation";

export class CreateRelationUseCase {
  constructor(private readonly relationRepo: RelationRepository) {}

  async execute(input: CreateRelationInput): Promise<Relation> {
    const now = new Date().toISOString();
    const relation: Relation = {
      relationId: uuid(),
      sourceArtifactId: input.sourceArtifactId,
      targetArtifactId: input.targetArtifactId,
      relationType: input.relationType,
      direction: "forward",
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      createdAtISO: now,
    };
    await this.relationRepo.save(relation);
    return relation;
  }
}

export class RemoveRelationUseCase {
  constructor(private readonly relationRepo: RelationRepository) {}

  async execute(relationId: string): Promise<void> {
    await this.relationRepo.remove(relationId);
  }
}

export class ListRelationsBySourceUseCase {
  constructor(private readonly relationRepo: RelationRepository) {}

  async execute(sourceArtifactId: string): Promise<readonly Relation[]> {
    return this.relationRepo.listBySource(sourceArtifactId);
  }
}

export class ListRelationsByTargetUseCase {
  constructor(private readonly relationRepo: RelationRepository) {}

  async execute(targetArtifactId: string): Promise<readonly Relation[]> {
    return this.relationRepo.listByTarget(targetArtifactId);
  }
}
