/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/ports
 * Port: ActorContextPort — resolves the acting user's file context.
 */

export interface ActorFileContext {
  readonly actorAccountId: string;
  readonly actorRole: string;
  readonly organizationIds: readonly string[];
}

export interface ActorContextPort {
  getActorFileContext(actorAccountId: string): ActorFileContext | null;
}
