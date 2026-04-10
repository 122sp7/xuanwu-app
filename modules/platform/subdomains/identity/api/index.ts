/**
 * identity subdomain public API boundary.
 * Consumers (e.g. adapters in sibling subdomains) must import through this barrel.
 */
export { identityApi, type EmitTokenRefreshSignalInput } from "../adapters/identity-service";
