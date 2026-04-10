import type { WorkspaceDomainEvent } from "../../events/workspace.events";

export interface WorkspaceEventPublishMetadata {
  readonly workspaceId?: string;
  readonly organizationId?: string;
}

export interface WorkspaceDomainEventPublisher {
  publish(
    event: WorkspaceDomainEvent,
    metadata?: WorkspaceEventPublishMetadata,
  ): Promise<void>;
}
