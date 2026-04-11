import type { IDatabaseRecordRepository } from "../../domain/repositories/IDatabaseRecordRepository";
import type { DatabaseRecordSnapshot } from "../../domain/aggregates/DatabaseRecord";
import { ListRecordsSchema } from "../dto/DatabaseDto";
import type { ListRecordsDto } from "../dto/DatabaseDto";

export class ListRecordsUseCase {
  constructor(private readonly repo: IDatabaseRecordRepository) {}
  async execute(input: ListRecordsDto): Promise<DatabaseRecordSnapshot[]> {
    const parsed = ListRecordsSchema.safeParse(input);
    if (!parsed.success) return [];
    return this.repo.listByDatabase(parsed.data.accountId, parsed.data.databaseId);
  }
}
