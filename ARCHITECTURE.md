# MDDD Architecture — Refactoring Guide

## Architecture: MDDD + Hexagonal (Ports & Adapters)

```
Dependency Direction:
  UI → Application → Domain ← Infrastructure
```

---

## Module Structure

Each feature module (`modules/<feature>/`) follows the same strict layering:

```
modules/<feature>/
├── domain/
│   ├── entities/            # Pure TypeScript entities & value objects
│   └── repositories/        # Port interfaces (NO implementations)
├── application/
│   └── use-cases/           # Business workflows (no framework, no Firebase)
├── infrastructure/
│   └── firebase/            # Firebase adapters implementing port interfaces
│       ├── Firebase<Feature>Repository.ts
│       └── (mappers: Firestore ↔ Domain — validate enum fields before mapping)
├── interfaces/
│   ├── _actions/            # Next.js "use server" Server Actions (thin adapters)
│   ├── hooks/               # "use client" React hooks (identity token-refresh hook)
│   └── queries/             # Read query wrappers (callable from React components/hooks)
└── index.ts                 # Public API (barrel export)
```

---

## Implemented Modules (Fully Complete)

| Module | Sub-Domains | Firebase Adapter | Notes |
|--------|-------------|-----------------|-------|
| `identity` | Auth (SignIn, Register, SignOut, PasswordReset) + TokenRefreshSignal [S6] | FirebaseIdentityRepository, FirebaseTokenRefreshRepository | useTokenRefreshListener hook (Party 3 [S6]) |
| `account` | Profile, Wallet (atomic Firestore txns), Role (+ token refresh), Policy | FirebaseAccountRepository, FirebaseAccountPolicyRepository, FirebaseAccountQueryRepository | CQRS: write-side repo + read-side query repo |
| `workspace` | Lifecycle, Capabilities, Locations, Grants | FirebaseWorkspaceRepository | Enum-validated mappers |
| `finance` | Claim lifecycle stages | FirebaseFinanceRepository | Domain stage-transition rules in entity |
| `organization` | Core (create/update/delete), Members, Teams, Partners, Policy | FirebaseOrganizationRepository | All sub-domains fully implemented |
| `notification` | Dispatch, MarkRead, MarkAllRead | FirebaseNotificationRepository | Single side-effect outlet pattern |
| `task` | CreateTask, UpdateStatus, DeleteTask | TaskRepoImpl | Example module |

---

## Layer Rules

### Domain Layer (`domain/`)
- ✅ Pure TypeScript: interfaces, types, value objects, domain logic
- ✅ Zero external dependencies (no Firebase, no React, no Next.js)
- ✅ Repository **interfaces** (ports) defined here, NOT implementations
- ❌ No `import` from infrastructure, application, or UI layers
- ❌ No cross-module domain imports (organization no longer imports from account domain)

### Application Layer (`application/use-cases/`)
- ✅ Orchestrates domain entities + repository ports
- ✅ Returns `CommandResult` (discriminated union: `CommandSuccess | CommandFailure`)
- ✅ Framework-agnostic — callable from React, server actions, tests
- ❌ No direct Firebase/Firestore calls
- ❌ No React hooks or UI code

### Infrastructure Layer (`infrastructure/firebase/`)
- ✅ Implements domain repository interfaces (the Adapter)
- ✅ Contains all Firebase SDK usage
- ✅ Includes Firestore ↔ Domain mappers with **enum field validation** (no silent coercion)
- ✅ Wallet credit/debit uses Firestore **transactions** (atomic balance enforcement — balance never negative)
- ❌ Must NOT be imported by domain or application layers

### Interface Layer (`interfaces/`)
- **`_actions/`** — Next.js `"use server"` Server Actions: thin wrappers, no business logic
- **`hooks/`** — `"use client"` React hooks (e.g. `useTokenRefreshListener` — [S6] Party 3)
- **`queries/`** — Read query wrappers for real-time subscriptions, callable from React components

---

## Shared Kernel (`shared/`)

| Path | Contents |
|------|----------|
| `shared/types/index.ts` | `CommandResult`, `CommandSuccess`, `CommandFailure`, `DomainError`, `Timestamp`, factory helpers |
| `shared/validators/index.ts` | Zod schemas for input validation |
| `shared/hooks/useStore.ts` | Zustand app store |
| `shared/constants/index.ts` | App-wide constants |
| `shared/utils/index.ts` | Pure utility functions |

---

## [S6] Token Refresh Claims Handshake

Three-party protocol ensuring the Frontend has up-to-date Custom Claims after role/policy changes:

```
Party 1 (Claims Handler)    ── emits TOKEN_REFRESH_SIGNAL → tokenRefreshSignals/{accountId}
Party 2 (IER CRITICAL_LANE) ── routes role:changed / policy:changed events
Party 3 (Frontend Hook)     ── onSnapshot → getIdToken(forceRefresh=true)
```

- **Party 1 use cases**: `EmitTokenRefreshSignalUseCase` + `AssignAccountRoleUseCase` + `RevokeAccountRoleUseCase` + policy use cases
- **Party 1 port**: `TokenRefreshRepository` (domain) → `FirebaseTokenRefreshRepository` (infra)
- **Party 3**: `useTokenRefreshListener(accountId)` — import from `@/modules/identity/interfaces/hooks/useTokenRefreshListener`
- Mount once per authenticated session in shell layout

---

## CommandResult Pattern [R4]

Every use case and server action returns `CommandResult`:

```ts
// Success
{ success: true, aggregateId: string, version: number }

// Failure
{ success: false, error: { code: string, message: string, context?: object } }
```

Usage in UI:
```ts
const result = await createOrganization({ organizationName, ownerId, ownerName, ownerEmail });
if (!result.success) {
  toast({ variant: "destructive", description: result.error.message });
  return;
}
// result.aggregateId = new org ID
```

---

## Validation Checklist

- [x] Domain layer has zero external dependencies
- [x] All data access goes through repository interfaces (ports)
- [x] UI does not contain business logic
- [x] Firebase only exists in `infrastructure/firebase/` directories
- [x] Use-cases are framework-agnostic (pure TypeScript)
- [x] No feature-to-feature domain coupling (each module has independent domain types)
- [x] `CommandResult` contract used consistently across all use cases
- [x] Wallet operations use Firestore transactions (atomic balance enforcement)
- [x] Token refresh signal emitted after all role/policy changes [S6]
- [x] TypeScript strict mode: zero errors
- [x] ESLint: zero warnings/errors
- [x] Next.js build: passes
