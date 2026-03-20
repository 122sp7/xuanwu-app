import type { DailyEntry, PublishDailyEntryInput } from "../entities/DailyEntry";

export interface DailyEntryRepository {
  publish(input: PublishDailyEntryInput): Promise<DailyEntry>;
  findById(entryId: string): Promise<DailyEntry | null>;
  listByWorkspaceId(workspaceId: string): Promise<readonly DailyEntry[]>;
  listByOrganizationId(organizationId: string): Promise<readonly DailyEntry[]>;
}
