import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import { KnowledgeArtifact, type CreateKnowledgeArtifactInput } from "../../domain/entities/KnowledgeArtifact";
import type { KnowledgeArtifactRepository, KnowledgeArtifactQuery } from "../../domain/repositories/KnowledgeArtifactRepository";

export class CreateKnowledgeArtifactUseCase {
  constructor(private readonly repo: KnowledgeArtifactRepository) {}

  async execute(input: CreateKnowledgeArtifactInput): Promise<CommandResult> {
    try {
      const artifact = KnowledgeArtifact.create(input);
      await this.repo.save(artifact.getSnapshot());
      return commandSuccess(artifact.id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "CREATE_KNOWLEDGE_ARTIFACT_FAILED",
        err instanceof Error ? err.message : "Failed to create knowledge artifact",
      );
    }
  }
}

export class PublishKnowledgeArtifactUseCase {
  constructor(private readonly repo: KnowledgeArtifactRepository) {}

  async execute(artifactId: string): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findById(artifactId);
      if (!snapshot) return commandFailureFrom("ARTIFACT_NOT_FOUND", `Artifact ${artifactId} not found`);
      const artifact = KnowledgeArtifact.reconstitute(snapshot);
      artifact.publish();
      await this.repo.save(artifact.getSnapshot());
      return commandSuccess(artifactId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "PUBLISH_ARTIFACT_FAILED",
        err instanceof Error ? err.message : "Failed to publish artifact",
      );
    }
  }
}

export class ArchiveKnowledgeArtifactUseCase {
  constructor(private readonly repo: KnowledgeArtifactRepository) {}

  async execute(artifactId: string): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findById(artifactId);
      if (!snapshot) return commandFailureFrom("ARTIFACT_NOT_FOUND", `Artifact ${artifactId} not found`);
      const artifact = KnowledgeArtifact.reconstitute(snapshot);
      artifact.archive();
      await this.repo.save(artifact.getSnapshot());
      return commandSuccess(artifactId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "ARCHIVE_ARTIFACT_FAILED",
        err instanceof Error ? err.message : "Failed to archive artifact",
      );
    }
  }
}

export class QueryKnowledgeArtifactsUseCase {
  constructor(private readonly repo: KnowledgeArtifactRepository) {}

  async execute(params: KnowledgeArtifactQuery) {
    return this.repo.query(params);
  }
}
