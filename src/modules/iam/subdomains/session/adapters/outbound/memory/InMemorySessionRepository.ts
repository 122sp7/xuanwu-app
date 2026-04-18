import type { SessionSnapshot, SessionRepository } from "../../../domain/index";

export class InMemorySessionRepository implements SessionRepository {
  private readonly store = new Map<string, SessionSnapshot>();

  async save(session: SessionSnapshot): Promise<void> {
    this.store.set(session.sessionId, session);
  }

  async saveMany(sessions: readonly SessionSnapshot[]): Promise<void> {
    for (const session of sessions) {
      this.store.set(session.sessionId, session);
    }
  }

  async findById(sessionId: string): Promise<SessionSnapshot | null> {
    return this.store.get(sessionId) ?? null;
  }

  async findByUid(uid: string): Promise<SessionSnapshot[]> {
    return Array.from(this.store.values()).filter((s) => s.uid === uid);
  }
}
