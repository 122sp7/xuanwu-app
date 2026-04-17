import { v4 as uuid } from "uuid";
import type { AccessPolicyDomainEventType } from "../events/AccessPolicyDomainEvent";
import type { SubjectRef } from "../value-objects/SubjectRef";
import type { ResourceRef } from "../value-objects/ResourceRef";
import type { PolicyEffect } from "../value-objects/PolicyEffect";

export interface AccessPolicySnapshot {
  readonly id: string;
  readonly subjectRef: SubjectRef;
  readonly resourceRef: ResourceRef;
  readonly actions: readonly string[];
  readonly effect: PolicyEffect;
  readonly conditions: readonly string[];
  readonly isActive: boolean;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateAccessPolicyInput {
  readonly subjectRef: SubjectRef;
  readonly resourceRef: ResourceRef;
  readonly actions: string[];
  readonly effect: PolicyEffect;
  readonly conditions?: string[];
}

export class AccessPolicy {
  private readonly _domainEvents: AccessPolicyDomainEventType[] = [];

  private constructor(private _props: AccessPolicySnapshot) {}

  static create(id: string, input: CreateAccessPolicyInput): AccessPolicy {
    if (!id || id.trim().length === 0) throw new Error("AccessPolicy id must not be empty");
    if (input.actions.length === 0)
      throw new Error("AccessPolicy must specify at least one action");
    const now = new Date().toISOString();
    const policy = new AccessPolicy({
      id,
      subjectRef: input.subjectRef,
      resourceRef: input.resourceRef,
      actions: input.actions,
      effect: input.effect,
      conditions: input.conditions ?? [],
      isActive: true,
      createdAtISO: now,
      updatedAtISO: now,
    });
    policy._domainEvents.push({
      type: "iam.access_policy.created",
      eventId: uuid(),
      occurredAt: now,
      payload: {
        policyId: id,
        subjectRef: input.subjectRef,
        resourceRef: input.resourceRef,
        actions: input.actions,
        effect: input.effect,
      },
    });
    return policy;
  }

  static reconstitute(snapshot: AccessPolicySnapshot): AccessPolicy {
    return new AccessPolicy({ ...snapshot });
  }

  update(input: {
    actions?: string[];
    effect?: PolicyEffect;
    conditions?: string[];
  }): void {
    if (!this._props.isActive) throw new Error("Cannot update an inactive policy.");
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      actions: input.actions ?? [...this._props.actions],
      effect: input.effect ?? this._props.effect,
      conditions: input.conditions ?? [...this._props.conditions],
      updatedAtISO: now,
    };
    this._domainEvents.push({
      type: "iam.access_policy.updated",
      eventId: uuid(),
      occurredAt: now,
      payload: { policyId: this._props.id },
    });
  }

  deactivate(): void {
    if (!this._props.isActive) throw new Error("Policy is already inactive.");
    const now = new Date().toISOString();
    this._props = { ...this._props, isActive: false, updatedAtISO: now };
    this._domainEvents.push({
      type: "iam.access_policy.deactivated",
      eventId: uuid(),
      occurredAt: now,
      payload: { policyId: this._props.id },
    });
  }

  get id(): string {
    return this._props.id;
  }
  get subjectRef(): SubjectRef {
    return this._props.subjectRef;
  }
  get resourceRef(): ResourceRef {
    return this._props.resourceRef;
  }
  get actions(): readonly string[] {
    return this._props.actions;
  }
  get effect(): PolicyEffect {
    return this._props.effect;
  }
  get conditions(): readonly string[] {
    return this._props.conditions;
  }
  get isActive(): boolean {
    return this._props.isActive;
  }

  getSnapshot(): Readonly<AccessPolicySnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): AccessPolicyDomainEventType[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }
}
