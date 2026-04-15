import type { ShareScope } from "../entities/WorkspaceShare";

export interface ShareDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface ShareGrantedEvent extends ShareDomainEvent {
  readonly type: "workspace.share.granted";
  readonly payload: { readonly shareId: string; readonly workspaceId: string; readonly scope: ShareScope };
}

export interface ShareRevokedEvent extends ShareDomainEvent {
  readonly type: "workspace.share.revoked";
  readonly payload: { readonly shareId: string; readonly workspaceId: string };
}

export type ShareDomainEventType = ShareGrantedEvent | ShareRevokedEvent;
