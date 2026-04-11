/**
 * EnvSecretReferenceResolver — Environment-based Adapter (Driven Adapter)
 *
 * Implements: SecretReferenceResolver
 * Resolves secret references from environment variables.
 */

import type { SecretReferenceResolver } from "../../domain/ports/output";

export class EnvSecretReferenceResolver implements SecretReferenceResolver {
async resolve(secretRef: string): Promise<string> {
const envKey = secretRef.toUpperCase().replace(/-/g, "_");
return process.env[envKey] ?? "";
}
}
