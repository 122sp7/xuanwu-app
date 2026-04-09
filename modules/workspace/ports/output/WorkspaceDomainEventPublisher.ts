import type { WorkspaceDomainEvent } from "../../domain/events/workspace.events";

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
