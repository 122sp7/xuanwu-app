// iam shared events — union of all domain events emitted by iam subdomains
export type { AccountDomainEventType } from "../../subdomains/account/domain/events/AccountDomainEvent";
export type { OrganizationDomainEventType } from "../../subdomains/organization/domain/events/OrganizationDomainEvent";
export type { OrganizationTeamDomainEvent } from "../../subdomains/organization/domain/events/OrganizationTeamDomainEvent";
export type { AccessPolicyDomainEventType } from "../../subdomains/access-control/domain/events/AccessPolicyDomainEvent";
