/**
 * Workspace Ports Surface
 *
 * This folder is the explicit hexagonal port entry for the workspace BC.
 * Keep ports as interfaces only; implementations must stay in infrastructure/.
 */

// Driven ports (domain/application core -> outside)
export type { WorkspaceRepository } from "../domain/repositories/WorkspaceRepository";
export type { WorkspaceCapabilityRepository } from "../domain/repositories/WorkspaceCapabilityRepository";
export type { WorkspaceAccessRepository } from "../domain/repositories/WorkspaceAccessRepository";
export type { WorkspaceLocationRepository } from "../domain/repositories/WorkspaceLocationRepository";
export type {
  WorkspaceQueryRepository,
  Unsubscribe as WorkspaceQueryUnsubscribe,
} from "../domain/repositories/WorkspaceQueryRepository";
export type { WikiWorkspaceRepository } from "../domain/repositories/WikiWorkspaceRepository";

// Domain event publishing port
export type {
  WorkspaceDomainEventPublisher,
  WorkspaceEventPublishMetadata,
} from "../domain/ports/WorkspaceDomainEventPublisher";
