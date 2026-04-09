/**
 * FirebasePolicyCatalogRepository — Firestore Repository (Driven Adapter)
 *
 * Implements: PolicyCatalogRepository
 * Stores:     PolicyCatalog aggregate (all revisions)
 * Collection: "policy-catalogs"
 *
 * Responsibilities:
 *   - Read/write PolicyCatalog aggregate (all revisions) documents to Firestore
 *   - Use adapters/persistence mappers for serialisation/deserialisation
 *   - Reconstitute aggregates via domain factory (create*Aggregate with reconstitute flag)
 *
 * Rules:
 *   - Must implement the PolicyCatalogRepository interface contract exactly
 *   - Must not import from application/ or interfaces/ layers
 *   - Must not expose Firestore types outside this file
 *   - Errors are translated to typed domain errors, not raw Firestore errors
 *
 * @see ports/output/index.ts — PolicyCatalogRepository interface
 * @see adapters/persistence/ — serialisation mappers
 * @see docs/repositories.md — Firestore collection contract
 */

// TODO: implement FirebasePolicyCatalogRepository Firestore repository
