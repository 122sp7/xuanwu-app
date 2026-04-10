/**
 * SecretReference — Reference Value Object
 *
 * A stable, opaque reference to a secret, credential, or token stored
 * in an external secret manager. Resolved at runtime by SecretReferenceResolver output port.
 *
 * Contains: secretId, vault/provider hint
 * Does NOT contain: the actual secret value
 *
 * Used by: IntegrationContract aggregate
 * @see docs/aggregates.md — 主要識別值與狀態值
 * @see docs/repositories.md — SecretReferenceResolver
 */

// TODO: implement SecretReference value object
