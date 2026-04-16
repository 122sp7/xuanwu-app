import type { SessionSnapshot, SessionRepository } from "../../../domain/index";

export class InMemorySessionRepository implements SessionRepository {
  private readonly store = new Map<string, SessionSnapshot>();

  async create(session: SessionSnapshot): Promise<void> {
    this.store.set(session.sessionId, session);
  }

  async findById(sessionId: string): Promise<SessionSnapshot | null> {
    return this.store.get(sessionId) ?? null;
  }

  async findByUid(uid: string): Promise<SessionSnapshot[]> {
    return Array.from(this.store.values()).filter((s) => s.uid === uid);
  }

  async revoke(sessionId: string): Promise<void> {
    const session = this.store.get(sessionId);
    if (session) {
      this.store.set(sessionId, { ...session, isRevoked: true });
    }
  }

  async revokeAllByUid(uid: string): Promise<void> {
    for (const [id, session] of this.store.entries()) {
      if (session.uid === uid) {
        this.store.set(id, { ...session, isRevoked: true });
      }
    }
  }
}
