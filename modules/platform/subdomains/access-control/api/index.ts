/**
 * Public API boundary for the access-control subdomain.
 */
export * from "../application";
export { accessControlService } from "../infrastructure";
export type { AccessPolicySnapshot, CreateAccessPolicyInput } from "../domain/aggregates/AccessPolicy";
export type { AccessPolicyDomainEventType } from "../domain/events/AccessPolicyDomainEvent";
export type { AccessPolicyRepository } from "../domain/repositories/AccessPolicyRepository";
export type { SubjectRef } from "../domain/value-objects/SubjectRef";
export type { ResourceRef } from "../domain/value-objects/ResourceRef";
export type { PolicyEffect } from "../domain/value-objects/PolicyEffect";
export {
	isOrganizationActor,
	resolveOrganizationRouteFallback,
	type ShellAccountActor,
} from "../application/services/shell-account-access";
