import type { ScheduleEventType } from "../../domain/entities/ScheduleEventType";
import type { ScheduleEventTypeScope } from "../../domain/repositories/ScheduleEventTypeRepository";
import { ListScheduleEventTypesUseCase } from "../../application/use-cases/list-schedule-event-types.use-case";
import { DefaultScheduleEventTypeRepository } from "../../infrastructure/default/DefaultScheduleEventTypeRepository";

/**
 * Returns schedule event types for the given scope.
 *
 * Analogous to cal.com's GET /event-types – lists all event type templates
 * that define what kinds of schedule items can be created in an organisation
 * or workspace.
 */
export async function getScheduleEventTypes(
  scope: ScheduleEventTypeScope,
): Promise<readonly ScheduleEventType[]> {
  const repository = new DefaultScheduleEventTypeRepository();
  const useCase = new ListScheduleEventTypesUseCase(repository);
  return useCase.execute(scope);
}

/**
 * Convenience wrapper for organisation-wide event types.
 */
export async function getOrganizationScheduleEventTypes(
  organizationId: string,
): Promise<readonly ScheduleEventType[]> {
  return getScheduleEventTypes({ organizationId });
}

/**
 * Convenience wrapper for workspace-scoped event types.
 */
export async function getWorkspaceScheduleEventTypes(
  organizationId: string,
  workspaceId: string,
): Promise<readonly ScheduleEventType[]> {
  return getScheduleEventTypes({ organizationId, workspaceId });
}
