import type {
  AccessPolicyRepository,
} from "../../../domain/repositories/AccessPolicyRepository";
import type { AccessPolicySnapshot } from "../../../domain/aggregates/AccessPolicy";

export class InMemoryAccessPolicyRepository implements AccessPolicyRepository {
  private readonly store = new Map<string, AccessPolicySnapshot>();

  async findById(id: string): Promise<AccessPolicySnapshot | null> {
    return this.store.get(id) ?? null;
  }

  async findBySubject(subjectId: string): Promise<AccessPolicySnapshot[]> {
    return [...this.store.values()].filter((p) => p.subjectRef.subjectId === subjectId);
  }

  async findActiveBySubjectAndResource(
    subjectId: string,
    resourceType: string,
    resourceId?: string,
  ): Promise<AccessPolicySnapshot[]> {
    return [...this.store.values()].filter(
      (p) =>
        p.isActive &&
        p.subjectRef.subjectId === subjectId &&
        p.resourceRef.resourceType === resourceType &&
        (resourceId === undefined || p.resourceRef.resourceId === resourceId),
    );
  }

  async save(snapshot: AccessPolicySnapshot): Promise<void> {
    this.store.set(snapshot.id, { ...snapshot });
  }

  async update(snapshot: AccessPolicySnapshot): Promise<void> {
    this.store.set(snapshot.id, { ...snapshot });
  }
}
