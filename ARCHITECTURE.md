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
│       └── (mappers: Firestore ↔ Domain)
├── interfaces/
│   └── _actions/            # Next.js Server Actions (thin adapters)
│       └── <feature>.actions.ts
└── index.ts                 # Public API (barrel export)
```

---

## Implemented Modules

| Module | Domain Entities | Repository Port | Use Cases | Firebase Adapter | Server Actions |
|--------|----------------|-----------------|-----------|-----------------|----------------|
| `identity` | IdentityEntity | IdentityRepository | SignIn, Register, SignOut, ResetPassword | FirebaseIdentityRepository | identity.actions.ts |
| `account` | AccountEntity, WalletTransaction, AccountRoleRecord | AccountRepository | CreateAccount, UpdateProfile, CreditWallet, DebitWallet, AssignRole | FirebaseAccountRepository | account.actions.ts |
| `workspace` | WorkspaceEntity, Capability, WorkspaceLocation | WorkspaceRepository | CreateWorkspace, UpdateSettings, Delete, MountCapabilities, GrantAccess | FirebaseWorkspaceRepository | workspace.actions.ts |
| `finance` | FinanceAggregateEntity | FinanceRepository | SubmitClaim, AdvanceStage, RecordPayment | FirebaseFinanceRepository | finance.actions.ts |
| `organization` | OrganizationEntity, MemberReference, Team | OrganizationRepository | InviteMember, RemoveMember, UpdateRole, CreateTeam | — (stub) | — |
| `notification` | NotificationEntity | NotificationRepository | DispatchNotification, MarkRead, MarkAllRead | FirebaseNotificationRepository | notification.actions.ts |
| `task` | TaskEntity | TaskRepository | CreateTask, UpdateTaskStatus, DeleteTask | TaskRepoImpl | task.actions.ts |

---

## Layer Rules

### Domain Layer (`domain/`)
- ✅ Pure TypeScript: interfaces, types, value objects, domain logic
- ✅ Zero external dependencies (no Firebase, no React, no Next.js)
- ✅ Repository **interfaces** (ports) defined here, NOT implementations
- ❌ No `import` from infrastructure, application, or UI layers

### Application Layer (`application/use-cases/`)
- ✅ Orchestrates domain entities + repository ports
- ✅ Returns `CommandResult` (discriminated union: `CommandSuccess | CommandFailure`)
- ✅ Framework-agnostic — callable from React, server actions, tests
- ❌ No direct Firebase/Firestore calls
- ❌ No React hooks or UI code

### Infrastructure Layer (`infrastructure/firebase/`)
- ✅ Implements domain repository interfaces (the Adapter)
- ✅ Contains all Firebase SDK usage
- ✅ Includes Firestore ↔ Domain mappers
- ❌ Must NOT be imported by domain or application layers

### Interface Layer (`interfaces/_actions/`)
- ✅ Next.js `"use server"` Server Actions
- ✅ Thin wrappers: instantiate deps + call use cases
- ✅ Handle auth/session concerns
- ❌ NO business logic (delegate everything to use cases)

---

## Shared Kernel (`shared/`)

| Path | Contents |
|------|----------|
| `shared/types/index.ts` | `CommandResult`, `CommandSuccess`, `CommandFailure`, `DomainError`, `Timestamp`, primitive types |
| `shared/validators/index.ts` | Zod schemas for input validation |
| `shared/hooks/useStore.ts` | Zustand app store |
| `shared/constants/index.ts` | App-wide constants |
| `shared/utils/index.ts` | Pure utility functions |

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
const result = await createWorkspace({ name, accountId, accountType });
if (!result.success) {
  toast({ variant: "destructive", description: result.error.message });
  return;
}
// Optimistic update: result.aggregateId, result.version
```

---

## Migration from Vertical Slices

| Old (Vertical Slice) | New (MDDD) |
|---------------------|-----------|
| `src/features/identity.slice/_actions.ts` | `modules/identity/interfaces/_actions/identity.actions.ts` |
| `src/features/identity.slice/_components/` | `modules/identity/` (UI stays in Next.js `app/`) |
| Firebase calls in `_actions.ts` | Moved to `modules/<feature>/infrastructure/firebase/Firebase<Feature>Repository.ts` |
| Business logic in hooks | Moved to `modules/<feature>/application/use-cases/` |
| Types scattered in `_types.ts` | Centralized in `modules/<feature>/domain/entities/` |
| Cross-feature imports | Replaced by module `index.ts` public APIs |

---

## Validation Checklist

- [x] Domain layer has zero external dependencies
- [x] All data access goes through repository interfaces (ports)
- [x] UI does not contain business logic
- [x] Firebase only exists in `infrastructure/firebase/` directories
- [x] Use-cases are framework-agnostic (pure TypeScript)
- [x] No feature-to-feature coupling (each module exports via `index.ts`)
- [x] `CommandResult` contract used consistently across all use cases
- [x] TypeScript strict mode passes with zero errors
- [x] Next.js build succeeds
