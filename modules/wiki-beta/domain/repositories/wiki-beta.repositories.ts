/**
 * Module: wiki-beta
 * Layer: domain/repositories
 *
 * Repository interfaces have been migrated to their canonical bounded-context modules:
 *   WikiBetaPageRepository      → modules/content (internal)
 *   WikiBetaLibraryRepository   → modules/asset (internal)
 *   WikiBetaContentRepository   → modules/retrieval (internal)
 *   WikiBetaWorkspaceRepository → modules/workspace (internal)
 *
 * Cross-module consumers should import from the target module's api/ boundary.
 * This file is kept as a tombstone to aid in code archaeology.
 */
