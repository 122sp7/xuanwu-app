export const SCHEDULE_ACKNOWLEDGEMENT_ID_DELIMITER = "__";

export interface WorkspaceScheduleAcknowledgement {
  readonly id: string;
  readonly workspaceId: string;
  readonly scheduleItemId: string;
  readonly acknowledgedByAccountId: string;
  readonly acknowledgedAtISO: string;
}

export interface AcknowledgeWorkspaceScheduleItemInput {
  readonly workspaceId: string;
  readonly scheduleItemId: string;
  readonly actorAccountId: string;
}
