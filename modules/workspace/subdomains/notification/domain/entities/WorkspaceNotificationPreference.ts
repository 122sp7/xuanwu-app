/**
 * WorkspaceNotificationPreference — entity modelling per-member notification
 * subscriptions within a single workspace.
 *
 * Design notes:
 * - Framework-free; no Firebase, React, or HTTP imports.
 * - Immutable snapshot pattern: all mutations return a new entity value.
 * - Equality is identity-based: workspaceId + memberId uniquely identify a record.
 */

import type { WorkspaceNotificationEventType } from "../value-objects/WorkspaceNotificationEventType";
import { WORKSPACE_NOTIFICATION_EVENT_TYPES } from "../value-objects/WorkspaceNotificationEventType";

export interface WorkspaceNotificationPreferenceProps {
  readonly workspaceId: string;
  readonly memberId: string;
  /** Set of workspace event types the member has opted into. */
  readonly subscribedEvents: ReadonlySet<WorkspaceNotificationEventType>;
  readonly updatedAtISO: string;
}

export class WorkspaceNotificationPreference {
  private constructor(
    private readonly _props: WorkspaceNotificationPreferenceProps,
  ) {}

  /** Factory: create a new preference record with full defaults (all events on). */
  static create(
    workspaceId: string,
    memberId: string,
  ): WorkspaceNotificationPreference {
    return new WorkspaceNotificationPreference({
      workspaceId,
      memberId,
      subscribedEvents: new Set(
        WORKSPACE_NOTIFICATION_EVENT_TYPES as unknown as WorkspaceNotificationEventType[],
      ),
      updatedAtISO: new Date().toISOString(),
    });
  }

  /** Factory: reconstitute from persisted snapshot. */
  static reconstitute(
    props: WorkspaceNotificationPreferenceProps,
  ): WorkspaceNotificationPreference {
    return new WorkspaceNotificationPreference({ ...props });
  }

  /** Returns a new entity with the subscription set replaced. */
  withSubscriptions(
    events: ReadonlySet<WorkspaceNotificationEventType>,
  ): WorkspaceNotificationPreference {
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
