/**
 * Public API boundary for the IAM bounded context.
 *
 * This barrel is the canonical migration target for identity, authentication,
 * authorization, session, federation, tenant, and security-policy concerns.
 * Legacy Platform-owned implementations may still back some exports while the
 * repo converges on IAM as the single owner.
 */

export * from "../subdomains/identity/api";
export * from "../subdomains/access-control/api";
export * from "../subdomains/authentication/api";
export * from "../subdomains/authorization/api";
export * from "../subdomains/federation/api";
export * from "../subdomains/session/api";
export * from "../subdomains/tenant/api";
export * from "../subdomains/security-policy/api";
