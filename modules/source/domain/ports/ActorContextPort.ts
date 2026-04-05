export interface ActorFileContext {
  readonly actorAccountId: string;
  readonly actorRole: string;
  readonly organizationIds: readonly string[];
}

export interface ActorContextPort {
  getActorFileContext(actorAccountId: string): ActorFileContext | null;
}

