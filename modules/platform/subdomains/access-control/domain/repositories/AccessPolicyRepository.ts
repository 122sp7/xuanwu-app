/**
 * AccessPolicyRepository — Write-side persistence port (CQRS).
 */
import type { AccessPolicySnapshot } from "../aggregates/AccessPolicy";

export interface AccessPolicyRepository {
  findById(id: string): Promise<AccessPolicySnapshot | null>;
  findBySubject(subjectId: string): Promise<AccessPolicySnapshot[]>;
  findActiveBySubjectAndResource(
    subjectId: string,
    resourceType: string,
    resourceId?: string,
  ): Promise<AccessPolicySnapshot[]>;
  save(snapshot: AccessPolicySnapshot): Promise<void>;
  update(snapshot: AccessPolicySnapshot): Promise<void>;
}
