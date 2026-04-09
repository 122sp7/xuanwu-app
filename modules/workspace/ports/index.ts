/**
 * Workspace Ports Surface
 *
 * This folder is the explicit hexagonal port entry for the workspace BC.
 * Keep ports as interfaces only; implementations must stay in infrastructure/.
 */

// Driven ports (domain/application core -> outside)
export type { WorkspaceCommandPort } from "./input/WorkspaceCommandPort";
export type {
  WorkspaceQueryPort,
  WorkspaceQuerySubscription,
} from "./input/WorkspaceQueryPort";

export type { WorkspaceRepository } from "./output/WorkspaceRepository";
export type { WorkspaceCapabilityRepository } from "./output/WorkspaceCapabilityRepository";
export type { WorkspaceAccessRepository } from "./output/WorkspaceAccessRepository";
export type { WorkspaceLocationRepository } from "./output/WorkspaceLocationRepository";
export type {
  WorkspaceQueryRepository,
  Unsubscribe as WorkspaceQueryUnsubscribe,
} from "./output/WorkspaceQueryRepository";
export type { WikiWorkspaceRepository } from "./output/WikiWorkspaceRepository";

// Domain event publishing port
export type {
  WorkspaceDomainEventPublisher,
  WorkspaceEventPublishMetadata,
} from "./output/WorkspaceDomainEventPublisher";
