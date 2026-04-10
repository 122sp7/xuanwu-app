import { SharedWorkspaceDomainEventPublisher } from "../../infrastructure/events/SharedWorkspaceDomainEventPublisher";
import { FirebaseWikiWorkspaceRepository } from "../../infrastructure/firebase/FirebaseWikiWorkspaceRepository";
import { FirebaseWorkspaceQueryRepository } from "../../infrastructure/firebase/FirebaseWorkspaceQueryRepository";
import { FirebaseWorkspaceRepository } from "../../infrastructure/firebase/FirebaseWorkspaceRepository";

interface OrganizationDirectoryGateway {
  getOrganizationMembers(organizationId: string): Promise<{ id: string; name: string; email?: string; role?: string }[]>;
  getOrganizationTeams(organizationId: string): Promise<{ id: string; name: string; memberIds: string[] }[]>;
}

export function makeWorkspaceRepo() {
  return new FirebaseWorkspaceRepository();
}

export function makeWorkspaceQueryRepo(gateway: OrganizationDirectoryGateway) {
  return new FirebaseWorkspaceQueryRepository(gateway);
}

export function makeWikiWorkspaceRepo() {
  return new FirebaseWikiWorkspaceRepository();
}

export function makeWorkspaceDomainEventPublisher() {
  return new SharedWorkspaceDomainEventPublisher();
}
