## Phase: impl
## Task: identity module -> platform/subdomains/identity migration and cleanup
## Date: 2026-04-10

### Scope
- Verified modules/identity is already removed; no legacy module files remain.
- platform/subdomains/identity is fully implemented with all layers.
- Fixed Hexagonal Architecture dependency-direction violation in application/.
- Fixed boundary import violation in app/(public)/page.tsx.

### Decisions / Findings
- modules/identity was already completely removed (no longer in modules/ directory).
- platform/subdomains/identity has full implementation:
  - domain/entities: Identity.ts, TokenRefreshSignal.ts
  - domain/repositories: IdentityRepository.ts, TokenRefreshRepository.ts
  - application/use-cases: identity.use-cases.ts, token-refresh.use-cases.ts
  - application/identity-error-message.ts (pure, no infrastructure) 
  - adapters/firebase: FirebaseIdentityRepository.ts, FirebaseTokenRefreshRepository.ts
  - adapters/hooks: useTokenRefreshListener.tsx
  - adapters/server-actions: identity.actions.ts
  - adapters/identity-service.ts (new: composition root, wires repos to use cases)

### Architectural Fix Applied
- DELETED: application/identity.api.ts (violated dependency direction: application -> adapters)
- CREATED: adapters/identity-service.ts (correct: adapters -> application -> domain)
- UPDATED: adapters/index.ts now exports EmitTokenRefreshSignalInput, createClientAuthUseCases, identityApi from identity-service.ts
- UPDATED: application/index.ts removed identity.api.ts re-exports; now exports only pure application symbols (use cases, error mapping)
- FIXED:  app/(public)/page.tsx changed `createClientAccountUseCases` import from @/modules/platform/subdomains/account (violation) to @/modules/account/api (correct)

### Public API Contract (stable, no breaking change)
- @/modules/platform/api exports: createClientAuthUseCases, identityApi, EmitTokenRefreshSignalInput via adapters/identity-service.ts
- @/modules/platform/api exports: signIn, signOut, register, sendPasswordResetEmail, signInAnonymously (server actions) via adapters/server-actions
- @/modules/platform/api exports: useTokenRefreshListener via adapters/hooks
- @/modules/platform/api exports: all domain types (IdentityEntity, SignInCredentials, etc.)
- @/modules/platform/api exports: all use case classes (for composition/testing)

### Validation / Evidence
- TS errors: 0 (get_errors on modules/platform and app/(public)/page.tsx)
- Lint: 0 errors on app/(public)/page.tsx after fix
- No remaining imports from @/modules/identity (module deleted, import-free)
- Dependency direction now clean: adapters/ -> application/ -> domain/ <- adapters/firebase

### Remaining Pre-existing Warnings (NOT from identity task)
- 17 warnings in app/ for @/modules/platform/subdomains/{account,organization,notification} imports
- These are from the ongoing account/organization/notification migrations (separate tasks)

### Identity Migration Status
COMPLETE: All identity functionality lives in platform/subdomains/identity.
Legacy modules/identity module: DELETED (confirmed absent from modules/ directory).
