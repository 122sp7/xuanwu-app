import type {
  AccountProfileDomainEventType,
  AccountProfileUpdatedEvent,
} from "../events/AccountProfileDomainEvent";
import { createProfileId, createProfileDisplayName } from "../value-objects";
import type { ProfileId } from "../value-objects";
import type {
  AccountProfile,
  UpdateAccountProfileInput,
} from "../entities/AccountProfile";

export interface AccountProfileAggregateSnapshot {
  readonly id: string;
  readonly displayName: string;
  readonly email: string | null;
  readonly photoURL: string | null;
  readonly bio: string | null;
  readonly theme: AccountProfile["theme"] | null;
  readonly updatedAtISO: string;
}

export class AccountProfileAggregate {
  private readonly _domainEvents: AccountProfileDomainEventType[] = [];

  private constructor(private _props: AccountProfileAggregateSnapshot) {}

  static create(id: string, profile: AccountProfile): AccountProfileAggregate {
    createProfileId(id);
    createProfileDisplayName(profile.displayName);
    return new AccountProfileAggregate({
      id,
      displayName: profile.displayName,
      email: profile.email ?? null,
      photoURL: profile.photoURL ?? null,
      bio: profile.bio ?? null,
      theme: profile.theme ?? null,
      updatedAtISO: new Date().toISOString(),
    });
  }

  static reconstitute(
    snapshot: AccountProfileAggregateSnapshot,
  ): AccountProfileAggregate {
    return new AccountProfileAggregate({ ...snapshot });
  }

  update(input: UpdateAccountProfileInput): void {
    const changedFields: string[] = [];
    const now = new Date().toISOString();
    if (input.displayName !== undefined) {
      createProfileDisplayName(input.displayName);
      changedFields.push("displayName");
    }
    if (input.bio !== undefined) changedFields.push("bio");
    if (input.photoURL !== undefined) changedFields.push("photoURL");
    if (input.theme !== undefined) changedFields.push("theme");
    this._props = {
      ...this._props,
      displayName: input.displayName ?? this._props.displayName,
      bio: input.bio ?? this._props.bio,
      photoURL: input.photoURL ?? this._props.photoURL,
      theme: input.theme ?? this._props.theme,
      updatedAtISO: now,
    };
    this.recordEvent<AccountProfileUpdatedEvent>({
      type: "platform.account-profile.updated",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: { profileId: this._props.id, fields: changedFields },
    });
  }

  get id(): ProfileId {
    return createProfileId(this._props.id);
  }

  get displayName(): string {
    return this._props.displayName;
  }

  getSnapshot(): Readonly<AccountProfileAggregateSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): AccountProfileDomainEventType[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }

  private recordEvent<TEvent extends AccountProfileDomainEventType>(
    event: TEvent,
  ): void {
    this._domainEvents.push(event);
  }
}
