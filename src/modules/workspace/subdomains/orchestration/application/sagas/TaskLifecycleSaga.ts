import type { IssueResolvedEvent, IssueOpenedEvent } from "../../../issue/domain/events/IssueDomainEvent";
import type { TaskStatusChangedEvent } from "../../../task/domain/events/TaskDomainEvent";
import type { ResumeTaskFlowUseCase } from "../use-cases/ResumeTaskFlowUseCase";
import type { CreateInvoiceFromAcceptedTasksUseCase } from "../../../settlement/application/use-cases/CreateInvoiceFromAcceptedTasksUseCase";

export type SagaTriggerEvent =
  | TaskStatusChangedEvent
  | IssueOpenedEvent
  | IssueResolvedEvent;

/**
 * TaskLifecycleSaga
 *
 * Reacts to domain events emitted across the task lifecycle and drives
 * cross-subdomain side effects:
 *
 * - workspace.task.status-changed → "accepted"
 *     → CreateInvoiceFromAcceptedTasksUseCase
 *
 * - workspace.issue.resolved (stage: "qa" | "acceptance")
 *     → ResumeTaskFlowUseCase (re-enters task at the blocked stage)
 *
 * The saga is an application-layer service; it never mutates domain state
 * directly but delegates to use cases that enforce domain invariants.
 *
 * Caller responsibility: wire this saga into an event bus or use-case
 * completion hook at the infrastructure/interfaces layer.
 */
export class TaskLifecycleSaga {
  constructor(
    private readonly resumeTaskFlow: ResumeTaskFlowUseCase,
    private readonly createInvoice: CreateInvoiceFromAcceptedTasksUseCase,
  ) {}

  async handle(event: SagaTriggerEvent): Promise<void> {
    switch (event.type) {
      case "workspace.task.status-changed":
        await this.onTaskStatusChanged(event);
        break;
      case "workspace.issue.resolved":
        await this.onIssueResolved(event);
        break;
      default:
        break;
    }
  }

  private async onTaskStatusChanged(event: TaskStatusChangedEvent): Promise<void> {
    if (event.payload.to !== "accepted") return;

    const { taskId, workspaceId } = event.payload;
    await this.createInvoice.execute({ workspaceId, taskIds: [taskId] });
  }

  private async onIssueResolved(event: IssueResolvedEvent): Promise<void> {
    const { stage } = event.payload;
    if (stage !== "qa" && stage !== "acceptance") return;

    await this.resumeTaskFlow.execute({
      taskId: event.payload.taskId,
      stage,
    });
  }
}
