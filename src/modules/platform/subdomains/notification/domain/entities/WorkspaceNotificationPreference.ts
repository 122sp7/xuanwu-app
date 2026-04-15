import type { WorkspaceNotificationEventType } from "../value-objects/WorkspaceNotificationEventType";
import { WORKSPACE_NOTIFICATION_EVENT_TYPES } from "../value-objects/WorkspaceNotificationEventType";

export interface WorkspaceNotificationPreferenceProps {
  readonly workspaceId: string;
  readonly memberId: string;
  readonly subscribedEvents: ReadonlySet<WorkspaceNotificationEventType>;
  readonly updatedAtISO: string;
}

export class WorkspaceNotificationPreference {
  private constructor(private readonly _props: WorkspaceNotificationPreferenceProps) {}

  static create(workspaceId: string, memberId: string): WorkspaceNotificationPreference {
    return new WorkspaceNotificationPreference({
      workspaceId,
      memberId,
      subscribedEvents: new Set(
        WORKSPACE_NOTIFICATION_EVENT_TYPES as unknown as WorkspaceNotificationEventType[],
      ),
      updatedAtISO: new Date().toISOString(),
    });
  }

  static reconstitute(props: WorkspaceNotificationPreferenceProps): WorkspaceNotificationPreference {
    return new WorkspaceNotificationPreference({ ...props });
  }

  withSubscriptions(events: ReadonlySet<WorkspaceNotificationEventType>): WorkspaceNotificationPreference {
    return new WorkspaceNotificationPreference({
      ...this._props,
      subscribedEvents: events,
      updatedAtISO: new Date().toISOString(),
    });
  }

  isSubscribedTo(eventType: WorkspaceNotificationEventType): boolean {
    return this._props.subscribedEvents.has(eventType);
  }

  get workspaceId(): string {
    return this._props.workspaceId;
  }

  get memberId(): string {
    return this._props.memberId;
  }

  get subscribedEvents(): ReadonlySet<WorkspaceNotificationEventType> {
    return this._props.subscribedEvents;
  }

  get updatedAtISO(): string {
    return this._props.updatedAtISO;
  }

  getSnapshot(): Readonly<WorkspaceNotificationPreferenceProps> {
    return Object.freeze({
      ...this._props,
      subscribedEvents: new Set(this._props.subscribedEvents),
    });
  }
}
