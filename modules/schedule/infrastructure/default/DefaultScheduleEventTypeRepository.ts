import { DEFAULT_SCHEDULE_EVENT_TYPES } from "../../domain/entities/ScheduleEventType";
import type { ScheduleEventType } from "../../domain/entities/ScheduleEventType";
import type {
  ScheduleEventTypeRepository,
  ScheduleEventTypeScope,
} from "../../domain/repositories/ScheduleEventTypeRepository";

const CREATED_AT = "2024-01-01T00:00:00.000Z";

/**
 * Returns the three canonical event types (milestone, follow-up, maintenance)
 * that mirror WorkspaceScheduleItem.type values.
 *
 * Analogous to cal.com's DEFAULT_EVENT_TYPES (thirtyMinutes, sixtyMinutes, …).
 * These are the "default event-type catalog" available in every organisation.
 */
export class DefaultScheduleEventTypeRepository
  implements ScheduleEventTypeRepository
{
  async listByScope(
    scope: ScheduleEventTypeScope,
  ): Promise<readonly ScheduleEventType[]> {
    const { organizationId, workspaceId = null } = scope;

    return Object.values(DEFAULT_SCHEDULE_EVENT_TYPES).map(
      (template): ScheduleEventType => ({
        id: `default-${template.slug}`,
        organizationId,
        workspaceId,
        title: template.title,
        slug: template.slug,
        description: template.description,
        itemType: template.itemType,
        durationLabel: template.durationLabel,
        isActive: true,
        requiredSkillIds: [],
        createdAtISO: CREATED_AT,
        updatedAtISO: CREATED_AT,
      }),
    );
  }
}
