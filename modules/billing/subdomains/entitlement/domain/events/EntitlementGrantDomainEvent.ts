export interface EntitlementGrantDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface EntitlementGrantedEvent extends EntitlementGrantDomainEvent {
  readonly type: "platform.entitlement.granted";
  readonly payload: {
    readonly entitlementId: string;
    readonly contextId: string;
    readonly featureKey: string;
    readonly quota: number | null;
  };
}

export interface EntitlementSuspendedEvent extends EntitlementGrantDomainEvent {
  readonly type: "platform.entitlement.suspended";
  readonly payload: {
    readonly entitlementId: string;
    readonly contextId: string;
  };
}

export interface EntitlementRevokedEvent extends EntitlementGrantDomainEvent {
  readonly type: "platform.entitlement.revoked";
  readonly payload: {
    readonly entitlementId: string;
    readonly contextId: string;
  };
}

export interface EntitlementExpiredEvent extends EntitlementGrantDomainEvent {
  readonly type: "platform.entitlement.expired";
  readonly payload: {
    readonly entitlementId: string;
    readonly contextId: string;
  };
}

export type EntitlementGrantDomainEventType =
  | EntitlementGrantedEvent
  | EntitlementSuspendedEvent
  | EntitlementRevokedEvent
  | EntitlementExpiredEvent;
