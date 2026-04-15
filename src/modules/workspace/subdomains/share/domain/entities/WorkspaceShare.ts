import { v4 as uuid } from "@lib-uuid";
import type { ShareDomainEventType } from "../events/ShareDomainEvent";

export type ShareScope = "read" | "write" | "admin";

export const SHARE_SCOPES = ["read", "write", "admin"] as const satisfies readonly ShareScope[];

export interface WorkspaceShareSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly grantedToId: string;
  readonly grantedToType: "user" | "team";
  readonly scope: ShareScope;
  readonly grantedByActorId: string;
  readonly expiresAtISO: string | null;
  readonly createdAtISO: string;
}

export interface GrantShareInput {
  readonly workspaceId: string;
  readonly grantedToId: string;
  readonly grantedToType: "user" | "team";
  readonly scope: ShareScope;
  readonly grantedByActorId: string;
  readonly expiresAtISO?: string;
}

export class WorkspaceShare {
  private readonly _domainEvents: ShareDomainEventType[] = [];

  private constructor(private readonly _props: WorkspaceShareSnapshot) {}

  static grant(id: string, input: GrantShareInput): WorkspaceShare {
    const now = new Date().toISOString();
    const share = new WorkspaceShare({
      id,
      workspaceId: input.workspaceId,
      grantedToId: input.grantedToId,
      grantedToType: input.grantedToType,
      scope: input.scope,
      grantedByActorId: input.grantedByActorId,
      expiresAtISO: input.expiresAtISO ?? null,
      createdAtISO: now,
    });
    share._domainEvents.push({
      type: "workspace.share.granted",
      eventId: uuid(),
      occurredAt: now,
      payload: { shareId: id, workspaceId: input.workspaceId, scope: input.scope },
    });
    return share;
  }

  static reconstitute(snapshot: WorkspaceShareSnapshot): WorkspaceShare {
    return new WorkspaceShare({ ...snapshot });
  }

  isExpired(): boolean {
    if (!this._props.expiresAtISO) return false;
    return new Date() > new Date(this._props.expiresAtISO);
  }

  get id(): string { return this._props.id; }
  get workspaceId(): string { return this._props.workspaceId; }
  get scope(): ShareScope { return this._props.scope; }

  getSnapshot(): Readonly<WorkspaceShareSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): ShareDomainEventType[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }
}
