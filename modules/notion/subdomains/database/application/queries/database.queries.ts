import type { DatabaseRepository } from "../../domain/repositories/DatabaseRepository";
import type { DatabaseSnapshot } from "../../domain/aggregates/Database";
import { GetDatabaseSchema, ListDatabasesSchema } from "../dto/DatabaseDto";
import type { GetDatabaseDto, ListDatabasesDto } from "../dto/DatabaseDto";

export class GetDatabaseUseCase {
  constructor(private readonly repo: DatabaseRepository) {}
  async execute(input: GetDatabaseDto): Promise<DatabaseSnapshot | null> {
    const parsed = GetDatabaseSchema.safeParse(input);
    if (!parsed.success) return null;
    return this.repo.findById(parsed.data.id, parsed.data.accountId);
  }
}

export class ListDatabasesUseCase {
  constructor(private readonly repo: DatabaseRepository) {}
  async execute(input: ListDatabasesDto): Promise<DatabaseSnapshot[]> {
    const parsed = ListDatabasesSchema.safeParse(input);
    if (!parsed.success) return [];
    return this.repo.listByWorkspace(parsed.data.accountId, parsed.data.workspaceId);
  }
}
