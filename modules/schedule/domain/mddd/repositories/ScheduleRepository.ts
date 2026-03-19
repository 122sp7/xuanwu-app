import type { Schedule } from "../entities/Schedule";

export interface ScheduleMdddScheduleRepository {
  findById(scheduleId: string): Promise<Schedule | null>;
  listByAssigneeAccountUserId(accountUserId: string): Promise<readonly Schedule[]>;
  save(schedule: Schedule): Promise<Schedule>;
}
