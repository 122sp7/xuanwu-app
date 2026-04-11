/**
 * AccessControlService — Composition root for access-control use cases.
 */
import {
  EvaluatePermissionUseCase,
  CreateAccessPolicyUseCase,
  UpdateAccessPolicyUseCase,
  DeactivateAccessPolicyUseCase,
} from "../application/use-cases/access-control.use-cases";
import { FirebaseAccessPolicyRepository } from "./firebase/FirebaseAccessPolicyRepository";
import type { SubjectRef } from "../domain/value-objects/SubjectRef";
import type { ResourceRef } from "../domain/value-objects/ResourceRef";
import type { PolicyEffect } from "../domain/value-objects/PolicyEffect";
import type { CommandResult } from "@shared-types";

let _repo: FirebaseAccessPolicyRepository | undefined;

function getRepo(): FirebaseAccessPolicyRepository {
  if (!_repo) _repo = new FirebaseAccessPolicyRepository();
  return _repo;
}

export const accessControlService = {
  evaluatePermission: (input: {
    subjectId: string;
    resourceType: string;
    resourceId?: string;
    action: string;
  }): Promise<CommandResult> => new EvaluatePermissionUseCase(getRepo()).execute(input),

  createPolicy: (input: {
    subjectRef: SubjectRef;
    resourceRef: ResourceRef;
    actions: string[];
    effect: PolicyEffect;
    conditions?: string[];
  }): Promise<CommandResult> => new CreateAccessPolicyUseCase(getRepo()).execute(input),

  updatePolicy: (
    policyId: string,
    input: { actions?: string[]; effect?: PolicyEffect; conditions?: string[] },
  ): Promise<CommandResult> => new UpdateAccessPolicyUseCase(getRepo()).execute(policyId, input),

  deactivatePolicy: (policyId: string): Promise<CommandResult> =>
    new DeactivateAccessPolicyUseCase(getRepo()).execute(policyId),
};
