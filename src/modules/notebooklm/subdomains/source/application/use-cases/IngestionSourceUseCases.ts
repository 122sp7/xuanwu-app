import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import { IngestionSource, type RegisterIngestionSourceInput } from "../../domain/entities/IngestionSource";
import type { IngestionSourceRepository, IngestionSourceQuery } from "../../domain/repositories/IngestionSourceRepository";

export class RegisterIngestionSourceUseCase {
  constructor(private readonly repo: IngestionSourceRepository) {}

  async execute(input: RegisterIngestionSourceInput): Promise<CommandResult> {
    try {
      const src = IngestionSource.register(input);
      await this.repo.save(src.getSnapshot());
      return commandSuccess(src.id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "REGISTER_SOURCE_FAILED",
        err instanceof Error ? err.message : "Failed to register ingestion source",
      );
    }
  }
}

export class ArchiveIngestionSourceUseCase {
  constructor(private readonly repo: IngestionSourceRepository) {}

  async execute(sourceId: string): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findById(sourceId);
      if (!snapshot) return commandFailureFrom("SOURCE_NOT_FOUND", `Source ${sourceId} not found`);
      const src = IngestionSource.reconstitute(snapshot);
      src.archive();
      await this.repo.save(src.getSnapshot());
      return commandSuccess(sourceId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "ARCHIVE_SOURCE_FAILED",
        err instanceof Error ? err.message : "Failed to archive source",
      );
    }
  }
}

export class QueryIngestionSourcesUseCase {
  constructor(private readonly repo: IngestionSourceRepository) {}

  async execute(params: IngestionSourceQuery) {
    return this.repo.query(params);
  }
}
