import { v4 as uuid } from "uuid";
import type { WorkspaceDomainEventType } from "../events/WorkspaceDomainEvent";

export type WorkspaceLifecycleState = "preparatory" | "active" | "stopped";

export const WORKSPACE_LIFECYCLE_STATES = ["preparatory", "active", "stopped"] as const satisfies readonly WorkspaceLifecycleState[];

const LIFECYCLE_NEXT: Readonly<Record<WorkspaceLifecycleState, WorkspaceLifecycleState | null>> = {
  preparatory: "active",
  active: "stopped",
  stopped: null,
};

export function canTransitionLifecycle(from: WorkspaceLifecycleState, to: WorkspaceLifecycleState): boolean {
  return LIFECYCLE_NEXT[from] === to;
}

export type WorkspaceVisibility = "private" | "internal" | "public";

export interface WorkspaceSnapshot {
  readonly id: string;
  readonly accountId: string;
  readonly accountType: "user" | "organization";
  readonly name: string;
  readonly lifecycleState: WorkspaceLifecycleState;
  readonly visibility: WorkspaceVisibility;
  readonly photoURL: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateWorkspaceInput {
  readonly accountId: string;
  readonly accountType: "user" | "organization";
  readonly name: string;
  readonly visibility?: WorkspaceVisibility;
  readonly photoURL?: string;
}

export class Workspace {
  private readonly _domainEvents: WorkspaceDomainEventType[] = [];

  private constructor(private _props: WorkspaceSnapshot) {}

  static create(id: string, input: CreateWorkspaceInput): Workspace {
    if (!input.name.trim()) throw new Error("Workspace name is required.");
    const now = new Date().toISOString();
    const ws = new Workspace({
      id,
      accountId: input.accountId,
      accountType: input.accountType,
      name: input.name.trim(),
      lifecycleState: "preparatory",
      visibility: input.visibility ?? "private",
      photoURL: input.photoURL ?? null,
      createdAtISO: now,
      updatedAtISO: now,
    });
    ws._domainEvents.push({
      type: "workspace.lifecycle.created",
      eventId: uuid(),
      occurredAt: now,
      payload: { workspaceId: id, accountId: input.accountId, name: input.name },
    });
    return ws;
  }

  static reconstitute(snapshot: WorkspaceSnapshot): Workspace {
    return new Workspace({ ...snapshot });
  }

  activate(): void {
    if (!canTransitionLifecycle(this._props.lifecycleState, "active")) {
      throw new Error(`Cannot activate workspace in state '${this._props.lifecycleState}'.`);
    }
    const now = new Date().toISOString();
    this._props = { ...this._props, lifecycleState: "active", updatedAtISO: now };
    this._domainEvents.push({
      type: "workspace.lifecycle.activated",
      eventId: uuid(),
      occurredAt: now,
      payload: { workspaceId: this._props.id },
    });
  }

  stop(): void {
    if (!canTransitionLifecycle(this._props.lifecycleState, "stopped")) {
      throw new Error(`Cannot stop workspace in state '${this._props.lifecycleState}'.`);
    }
    const now = new Date().toISOString();
    this._props = { ...this._props, lifecycleState: "stopped", updatedAtISO: now };
    this._domainEvents.push({
      type: "workspace.lifecycle.stopped",
      eventId: uuid(),
      occurredAt: now,
      payload: { workspaceId: this._props.id },
    });
  }

  updateSettings(input: { name?: string; visibility?: WorkspaceVisibility; photoURL?: string | null }): void {
    if (this._props.lifecycleState === "stopped") {
      throw new Error("Cannot update a stopped workspace.");
    }
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      name: input.name ?? this._props.name,
      visibility: input.visibility ?? this._props.visibility,
      photoURL: input.photoURL === undefined ? this._props.photoURL : input.photoURL,
      updatedAtISO: now,
    };
  }

  get id(): string { return this._props.id; }
  get lifecycleState(): WorkspaceLifecycleState { return this._props.lifecycleState; }
  get name(): string { return this._props.name; }

  getSnapshot(): Readonly<WorkspaceSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): WorkspaceDomainEventType[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }
}
