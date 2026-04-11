import type { IViewRepository } from "../../domain/repositories/IViewRepository";
import type { ViewSnapshot } from "../../domain/aggregates/View";
import { ListViewsSchema } from "../dto/DatabaseDto";
import type { ListViewsDto } from "../dto/DatabaseDto";

export class ListViewsUseCase {
  constructor(private readonly repo: IViewRepository) {}
  async execute(input: ListViewsDto): Promise<ViewSnapshot[]> {
    const parsed = ListViewsSchema.safeParse(input);
    if (!parsed.success) return [];
    return this.repo.listByDatabase(parsed.data.accountId, parsed.data.databaseId);
  }
}
