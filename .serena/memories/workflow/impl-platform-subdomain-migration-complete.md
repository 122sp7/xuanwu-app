# Platform Subdomain Migration — Complete

## Scope
Migrated `modules/account`, `modules/notification`, `modules/organization` into `modules/platform/subdomains/` as proper Hexagonal DDD subdomains.

## Status: COMPLETE ✅

### Migrated Subdomains
- `modules/platform/subdomains/account/` — domain, application, adapters (Firebase + server actions + queries)
- `modules/platform/subdomains/notification/` — domain, application, adapters, NotificationBell UI component
- `modules/platform/subdomains/organization/` — domain, application, adapters (Firebase dual-write + server actions + queries)

### Deleted Source Modules
- `modules/account` — deleted
- `modules/notification` — deleted
- `modules/organization` — deleted
- 6 legacy bridge files in `modules/platform/subdomains/` — deleted

### Key Architectural Decisions
- TokenRefreshPort pattern: account use cases inject `TokenRefreshPort` interface; `IdentityTokenRefreshAdapter` handles the call to `identityApi.emitTokenRefreshSignal()`
- Organization dual-write: `organizations/{id}` and `accounts/{id}` kept in sync via Firestore `writeBatch`
- Cross-module import rule: all `app/` files and non-platform modules must use `@/modules/platform/api` (not `@/modules/platform/subdomains/*` directly)

### platform/api/index.ts exports
```ts
export * from "./contracts";
export * from "./facade";
export * from "../subdomains/identity";
export * from "../subdomains/account";
export * from "../subdomains/notification";
export * from "../subdomains/organization";
```

### Lint Result
0 errors, 19 warnings (all pre-existing in modules/notion and modules/workspace/subdomains, unrelated to this migration)

### Critical Fix Applied
`modules/workspace/infrastructure/firebase/FirebaseWorkspaceQueryRepository.ts` was updated:
- `organizationApi.getMembers()` → `getOrganizationMembers()` from `@/modules/platform/api`
- `organizationApi.getTeams()` → `getOrganizationTeams()` from `@/modules/platform/api`
- `OrganizationMemberDTO` → `MemberReference`
- `OrganizationTeamDTO` → `Team`

### Encoding Corruption Fix
Previous session's batch `Set-Content` without `-Encoding UTF8` corrupted Chinese strings in 11 `app/` files. Fixed by:
1. `git checkout HEAD -- <files>` to restore originals
2. Re-applying import changes using `replace_string_in_file` (proper UTF-8 safe tool)
