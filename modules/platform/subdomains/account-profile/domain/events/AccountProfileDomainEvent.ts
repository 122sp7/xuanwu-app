export interface AccountProfileDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface AccountProfileUpdatedEvent extends AccountProfileDomainEvent {
  readonly type: "platform.account-profile.updated";
  readonly payload: {
    readonly profileId: string;
    readonly fields: string[];
  };
}

export type AccountProfileDomainEventType = AccountProfileUpdatedEvent;
