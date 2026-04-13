import { WorkspaceCommandApplicationService } from "../../../application/services/WorkspaceCommandApplicationService";
import { WorkspaceQueryApplicationService } from "../../../application/services/WorkspaceQueryApplicationService";
import {
  makeWikiWorkspaceRepo,
  makeWorkspaceDomainEventPublisher,
  makeWorkspaceQueryRepo,
  makeWorkspaceRepo,
} from "../../../api/runtime/factories";
import type { WorkspaceCommandPort } from "../../../application/dto/workspace-interfaces.dto";
import type { WorkspaceQueryPort } from "../../../application/dto/workspace-interfaces.dto";
import { createWorkspaceSessionContext } from "./workspace-session-context";

let _sessionContext: ReturnType<typeof createWorkspaceSessionContext> | undefined;

function getSessionContext() {
  if (!_sessionContext) {
    // Lazy-load the organization query functions to break the circular module
    // evaluation chain: workspace-runtime → platform/api → organization/interfaces
    // → organization/api → workspace (via barrel re-exports).
    //
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const platformApi = require("@/modules/platform/api");

    const workspaceRepo = makeWorkspaceRepo();
    const workspaceQueryRepo = makeWorkspaceQueryRepo({
      getOrganizationMembers: platformApi.getOrganizationMembers,
      getOrganizationTeams: platformApi.getOrganizationTeams,
    });
    const wikiWorkspaceRepo = makeWikiWorkspaceRepo();
    const workspaceDomainEventPublisher = makeWorkspaceDomainEventPublisher();

    const commandPort: WorkspaceCommandPort = new WorkspaceCommandApplicationService({
      workspaceRepo,
      workspaceCapabilityRepo: workspaceRepo,
      workspaceAccessRepo: workspaceRepo,
      workspaceLocationRepo: workspaceRepo,
      workspaceDomainEventPublisher,
    });

    const queryPort: WorkspaceQueryPort = new WorkspaceQueryApplicationService({
      workspaceRepo,
      workspaceQueryRepo,
      wikiWorkspaceRepo,
    });

    _sessionContext = createWorkspaceSessionContext(commandPort, queryPort);
  }
  return _sessionContext;
}

/**
 * Lazy-initialized workspace ports.
 * Proxy objects defer all property access until first actual use, breaking
 * the circular module-evaluation chain at build time while preserving the
 * same public API as the previous eager singletons.
 */
export const workspaceSessionContext = new Proxy(
  {} as ReturnType<typeof createWorkspaceSessionContext>,
  { get: (_target, prop) => getSessionContext()[prop as keyof ReturnType<typeof createWorkspaceSessionContext>] },
);

export const workspaceCommandPort: WorkspaceCommandPort = new Proxy(
  {} as WorkspaceCommandPort,
  { get: (_target, prop) => getSessionContext().workspaceCommandPort[prop as keyof WorkspaceCommandPort] },
);

export const workspaceQueryPort: WorkspaceQueryPort = new Proxy(
  {} as WorkspaceQueryPort,
  { get: (_target, prop) => getSessionContext().workspaceQueryPort[prop as keyof WorkspaceQueryPort] },
);
