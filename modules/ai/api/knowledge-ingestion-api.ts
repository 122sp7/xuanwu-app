import { AdvanceIngestionStageUseCase } from "../application/use-cases/advance-ingestion-stage.use-case";
import {
  RegisterIngestionDocumentUseCase,
  type RegisterIngestionDocumentInput,
} from "../application/use-cases/register-ingestion-document.use-case";
import type { IngestionJob, IngestionStatus } from "../domain/entities/IngestionJob";
import { InMemoryIngestionJobRepository } from "../infrastructure/InMemoryIngestionJobRepository";

export class KnowledgeIngestionApi {
  private readonly repository = new InMemoryIngestionJobRepository();
  private readonly registerUseCase = new RegisterIngestionDocumentUseCase(this.repository);
  private readonly advanceUseCase = new AdvanceIngestionStageUseCase(this.repository);

  async registerDocument(input: RegisterIngestionDocumentInput): Promise<
    | { ok: true; data: IngestionJob }
    | { ok: false; error: { code: string; message: string } }
  > {
    return this.registerUseCase.execute(input);
  }

  async advanceStage(input: {
    readonly documentId: string;
    readonly nextStatus: IngestionStatus;
    readonly statusMessage?: string;
  }): Promise<
    | { ok: true; data: IngestionJob }
    | { ok: false; error: { code: string; message: string } }
  > {
    return this.advanceUseCase.execute(input);
  }

  async listWorkspaceJobs(input: {
    readonly organizationId: string;
    readonly workspaceId: string;
  }): Promise<readonly IngestionJob[]> {
    return this.repository.listByWorkspace(input);
  }
}
