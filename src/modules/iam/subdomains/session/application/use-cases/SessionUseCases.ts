import { Session } from "../../domain/index";
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
    const session = Session.create(input);
    const snapshot = session.getSnapshot();
    await this.repo.save(snapshot);
    return snapshot;
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
    const existing = await this.repo.findById(input.sessionId);
    if (!existing) {
      return;
    }
    const aggregate = Session.reconstitute(existing);
    aggregate.revoke();
    await this.repo.save(aggregate.getSnapshot());
  }
}

export class RevokeAllSessionsUseCase {
  constructor(private readonly repo: SessionRepository) {}

  async execute(input: { uid: string }): Promise<void> {
    const sessions = await this.repo.findByUid(input.uid);
    const revoked = sessions.map((snapshot) => {
      const aggregate = Session.reconstitute(snapshot);
      aggregate.revoke();
      return aggregate.getSnapshot();
    });
    await this.repo.saveMany(revoked);
  }
}
