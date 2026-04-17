import type { ContextSessionSnapshot } from "../entities/ContextSession";

export interface ContextSessionRepository {
  save(snapshot: ContextSessionSnapshot): Promise<void>;
  findById(id: string): Promise<ContextSessionSnapshot | null>;
  findByActorId(actorId: string, limit?: number): Promise<ContextSessionSnapshot[]>;
  delete(id: string): Promise<void>;
}
