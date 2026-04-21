import type { KnowledgeArtifactSnapshot, KnowledgeArtifactStatus, KnowledgeArtifactType } from "../entities/KnowledgeArtifact";

export interface KnowledgeArtifactQuery {
  readonly workspaceId?: string;
  readonly accountId?: string;
  readonly status?: KnowledgeArtifactStatus;
  readonly type?: KnowledgeArtifactType;
  readonly authorId?: string;
  readonly limit?: number;
  readonly offset?: number;
}

export interface KnowledgeArtifactRepository {
  save(snapshot: KnowledgeArtifactSnapshot): Promise<void>;
  findById(id: string): Promise<KnowledgeArtifactSnapshot | null>;
  query(params: KnowledgeArtifactQuery): Promise<KnowledgeArtifactSnapshot[]>;
  delete(id: string): Promise<void>;
}
