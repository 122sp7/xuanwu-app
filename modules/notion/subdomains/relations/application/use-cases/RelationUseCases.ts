/**
 * Module: notion/subdomains/relations
 * Layer: application/use-cases
 * Purpose: Use case orchestration for relation operations.
 */

import type { IRelationRepository } from "../../domain/repositories/IRelationRepository";
import type { Relation, CreateRelationInput } from "../../domain/entities/Relation";

export class CreateRelationUseCase {
  constructor(private readonly relationRepo: IRelationRepository) {}

  async execute(input: CreateRelationInput): Promise<Relation> {
    const now = new Date().toISOString();
    const relation: Relation = {
      relationId: crypto.randomUUID(),
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
  constructor(private readonly relationRepo: IRelationRepository) {}

  async execute(relationId: string): Promise<void> {
    await this.relationRepo.remove(relationId);
  }
}

export class ListRelationsBySourceUseCase {
  constructor(private readonly relationRepo: IRelationRepository) {}

  async execute(sourceArtifactId: string): Promise<readonly Relation[]> {
    return this.relationRepo.listBySource(sourceArtifactId);
  }
}

export class ListRelationsByTargetUseCase {
  constructor(private readonly relationRepo: IRelationRepository) {}

  async execute(targetArtifactId: string): Promise<readonly Relation[]> {
    return this.relationRepo.listByTarget(targetArtifactId);
  }
}
