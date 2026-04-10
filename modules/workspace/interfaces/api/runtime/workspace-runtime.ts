import { WorkspaceCommandApplicationService } from "../../../application/services/WorkspaceCommandApplicationService";
import { WorkspaceQueryApplicationService } from "../../../application/services/WorkspaceQueryApplicationService";
import {
  makeWikiWorkspaceRepo,
  makeWorkspaceDomainEventPublisher,
  makeWorkspaceQueryRepo,
  makeWorkspaceRepo,
} from "../../../api/runtime/factories";
import { getOrganizationMembers, getOrganizationTeams } from "@/modules/platform/api";
import type { WorkspaceCommandPort } from "../../../domain/ports/input/WorkspaceCommandPort";
import type { WorkspaceQueryPort } from "../../../domain/ports/input/WorkspaceQueryPort";
import { createWorkspaceSessionContext } from "./workspace-session-context";

const workspaceRepo = makeWorkspaceRepo();
const workspaceQueryRepo = makeWorkspaceQueryRepo({ getOrganizationMembers, getOrganizationTeams });
const wikiWorkspaceRepo = makeWikiWorkspaceRepo();
const workspaceDomainEventPublisher = makeWorkspaceDomainEventPublisher();

const workspaceCommandPort: WorkspaceCommandPort = new WorkspaceCommandApplicationService({
  workspaceRepo,
  workspaceCapabilityRepo: workspaceRepo,
  workspaceAccessRepo: workspaceRepo,
  workspaceLocationRepo: workspaceRepo,
  workspaceDomainEventPublisher,
});

const workspaceQueryPort: WorkspaceQueryPort = new WorkspaceQueryApplicationService({
  workspaceRepo,
  workspaceQueryRepo,
  wikiWorkspaceRepo,
});

export const workspaceSessionContext = createWorkspaceSessionContext(
  workspaceCommandPort,
  workspaceQueryPort,
);

export const { workspaceCommandPort: commandPort, workspaceQueryPort: queryPort } =
  workspaceSessionContext;

export { commandPort as workspaceCommandPort, queryPort as workspaceQueryPort };
