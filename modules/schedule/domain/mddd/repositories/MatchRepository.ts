import type { Match } from "../entities/Match";

export interface ScheduleMdddMatchRepository {
  listByTaskId(taskId: string): Promise<readonly Match[]>;
  saveAll(matches: readonly Match[]): Promise<readonly Match[]>;
}
