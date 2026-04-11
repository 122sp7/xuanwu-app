import type { SubjectRef } from "../value-objects/SubjectRef";
import type { ResourceRef } from "../value-objects/ResourceRef";
import type { PolicyEffect } from "../value-objects/PolicyEffect";

export interface AccessPolicyDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface AccessPolicyCreatedEvent extends AccessPolicyDomainEvent {
  readonly type: "platform.access_policy.created";
  readonly payload: {
    readonly policyId: string;
    readonly subjectRef: SubjectRef;
    readonly resourceRef: ResourceRef;
    readonly actions: readonly string[];
    readonly effect: PolicyEffect;
  };
}

export interface AccessPolicyUpdatedEvent extends AccessPolicyDomainEvent {
  readonly type: "platform.access_policy.updated";
  readonly payload: { readonly policyId: string };
}

export interface AccessPolicyDeactivatedEvent extends AccessPolicyDomainEvent {
  readonly type: "platform.access_policy.deactivated";
  readonly payload: { readonly policyId: string };
}

export type AccessPolicyDomainEventType =
  | AccessPolicyCreatedEvent
  | AccessPolicyUpdatedEvent
  | AccessPolicyDeactivatedEvent;
