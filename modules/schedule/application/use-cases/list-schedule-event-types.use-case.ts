import type { ScheduleEventType } from "../../domain/entities/ScheduleEventType";
import type {
  ScheduleEventTypeRepository,
  ScheduleEventTypeScope,
} from "../../domain/repositories/ScheduleEventTypeRepository";

export class ListScheduleEventTypesUseCase {
  constructor(
    private readonly scheduleEventTypeRepository: ScheduleEventTypeRepository,
  ) {}

  async execute(scope: ScheduleEventTypeScope): Promise<readonly ScheduleEventType[]> {
    if (!scope.organizationId.trim()) {
      return [];
    }
    return this.scheduleEventTypeRepository.listByScope(scope);
  }
}
