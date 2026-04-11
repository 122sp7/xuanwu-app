/**
 * Lifecycle Subdomain — Domain Ports
 *
 * These ports define what the lifecycle subdomain needs from the outside world.
 * They reference root domain repository interfaces since the Workspace aggregate
 * lives at the bounded-context root level.
 */

export type { WorkspaceRepository } from "../../../../domain/ports/output/WorkspaceRepository";
export type { WorkspaceCapabilityRepository } from "../../../../domain/ports/output/WorkspaceCapabilityRepository";
export type {
  WorkspaceDomainEventPublisher,
  WorkspaceEventPublishMetadata,
} from "../../../../domain/ports/output/WorkspaceDomainEventPublisher";
