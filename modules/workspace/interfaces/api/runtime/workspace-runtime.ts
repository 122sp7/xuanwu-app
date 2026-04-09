import { WorkspaceCommandApplicationService } from "../../application/services/WorkspaceCommandApplicationService";
import { WorkspaceQueryApplicationService } from "../../application/services/WorkspaceQueryApplicationService";
import { SharedWorkspaceDomainEventPublisher } from "../../infrastructure/events/SharedWorkspaceDomainEventPublisher";
import { FirebaseWikiWorkspaceRepository } from "../../infrastructure/firebase/FirebaseWikiWorkspaceRepository";
import { FirebaseWorkspaceQueryRepository } from "../../infrastructure/firebase/FirebaseWorkspaceQueryRepository";
import { FirebaseWorkspaceRepository } from "../../infrastructure/firebase/FirebaseWorkspaceRepository";
import type { WorkspaceCommandPort } from "../../ports/input/WorkspaceCommandPort";
import type { WorkspaceQueryPort } from "../../ports/input/WorkspaceQueryPort";

const workspaceRepo = new FirebaseWorkspaceRepository();
const workspaceQueryRepo = new FirebaseWorkspaceQueryRepository();
const wikiWorkspaceRepo = new FirebaseWikiWorkspaceRepository();
const workspaceDomainEventPublisher = new SharedWorkspaceDomainEventPublisher();

export const workspaceCommandPort: WorkspaceCommandPort = new WorkspaceCommandApplicationService({
  workspaceRepo,
  workspaceCapabilityRepo: workspaceRepo,
  workspaceAccessRepo: workspaceRepo,
  workspaceLocationRepo: workspaceRepo,
  workspaceDomainEventPublisher,
});

export const workspaceQueryPort: WorkspaceQueryPort = new WorkspaceQueryApplicationService({
  workspaceRepo,
  workspaceQueryRepo,
  wikiWorkspaceRepo,
});