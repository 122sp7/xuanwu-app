/**
 * Membership Subdomain — Infrastructure Layer
 *
 * The membership subdomain uses the root-level WorkspaceQueryRepository
 * (FirebaseWorkspaceQueryRepository) injected through ports. The complex
 * member resolution logic (merging grants, teams, personnel) lives in
 * the root infrastructure adapter since it depends on the full workspace
 * document model.
 */
export {};
