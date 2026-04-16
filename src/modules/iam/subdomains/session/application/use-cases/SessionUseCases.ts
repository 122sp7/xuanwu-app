import type { SessionSnapshot, SessionRepository } from "../../domain/index";

export class CreateSessionUseCase {
  constructor(private readonly repo: SessionRepository) {}

  async execute(input: {
    sessionId: string;
    uid: string;
    idToken: string;
    refreshToken: string | null;
    expiresAtISO: string;
  }): Promise<SessionSnapshot> {
    const session: SessionSnapshot = {
      ...input,
      createdAtISO: new Date().toISOString(),
      isRevoked: false,
    };
    await this.repo.create(session);
    return session;
  }
}

export class GetSessionUseCase {
  constructor(private readonly repo: SessionRepository) {}

  async execute(input: { sessionId: string }): Promise<SessionSnapshot | null> {
    return this.repo.findById(input.sessionId);
  }
}

export class RevokeSessionUseCase {
  constructor(private readonly repo: SessionRepository) {}

  async execute(input: { sessionId: string }): Promise<void> {
    await this.repo.revoke(input.sessionId);
  }
}

export class RevokeAllSessionsUseCase {
  constructor(private readonly repo: SessionRepository) {}

  async execute(input: { uid: string }): Promise<void> {
    await this.repo.revokeAllByUid(input.uid);
  }
}
