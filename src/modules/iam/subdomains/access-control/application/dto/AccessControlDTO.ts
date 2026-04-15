import type { AccessPolicySnapshot } from "../../domain/aggregates/AccessPolicy";

export type AccessPolicyView = Readonly<AccessPolicySnapshot>;

export interface PermissionEvaluationView {
  readonly subjectId: string;
  readonly resourceType: string;
  readonly resourceId?: string;
  readonly action: string;
  readonly allowed: boolean;
  readonly reason: string;
}
