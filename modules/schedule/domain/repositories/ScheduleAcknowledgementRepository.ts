import type {
  AcknowledgeWorkspaceScheduleItemInput,
  WorkspaceScheduleAcknowledgement,
} from "../entities/ScheduleAcknowledgement";

export interface ScheduleAcknowledgementRepository {
  acknowledge(
    input: AcknowledgeWorkspaceScheduleItemInput,
  ): Promise<WorkspaceScheduleAcknowledgement>;
}
