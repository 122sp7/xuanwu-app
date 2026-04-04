# Permissions — Xuanwu App

This document describes the role-based access control (RBAC) model used in Xuanwu App.

## Role Hierarchy

### Organization Roles

Roles are stored on organization membership records (`OrganizationRole`):

| Role | Description |
|------|-------------|
| `Owner` | Full control — manage members, settings, billing, and all resources |
| `Admin` | Manage members and workspaces; cannot transfer ownership |
| `Member` | Standard access — create and use workspaces |
| `Guest` | Limited read-only access to shared resources |

### Workspace Roles

Workspace membership carries a role string (convention mirrors org roles):

| Role | Description |
|------|-------------|
| `owner` | Full workspace control |
| `admin` | Manage workspace members and settings |
| `member` | Read/write access to workspace content |
| `viewer` | Read-only access |

## Access Control Patterns

### Organization Actions

```ts
// Check organization role in a Server Action
const member = await orgRepo.getMember(orgId, userId);
if (member?.role !== "Owner" && member?.role !== "Admin") {
  return { success: false, error: "Insufficient permissions" };
}
```

### Workspace Actions

```ts
// Check workspace membership before mutation
const member = await workspaceRepo.getMember(workspaceId, userId);
if (!member) return { success: false, error: "Not a workspace member" };
```

### RAG Document Access Control

Documents carry an `accessControl` array (`string[]`) listing the roles or member IDs that can retrieve chunks from that document during RAG retrieval:

```ts
// RagDocumentRepository — accessControl field
readonly accessControl?: readonly string[];
```

The `FirebaseRagRetrievalRepository` filters vector search results by checking `userRoles` against the document's `accessControl` array.

## Firestore Security Rules

Security rules are defined in `firestore.rules` at the repository root.

> **Note**: Rules are currently permissive during active development. Tighten rules before production deployment.

## Module Ownership

| Module | Permission Concern |
|--------|-------------------|
| `organization` | `OrganizationRole` — Owner/Admin/Member/Guest |
| `workspace` | Workspace membership and role |
| `account` | User account policies |
| `identity` | Firebase Auth, token refresh |
| `asset` | `accessControl` array on RAG documents |
| `retrieval` | `userRoles` filtering in RAG retrieval |
| `agent` | Orchestrated query context and actor-aware access flow |

## Adding New Permission Checks

1. Define the role check in the relevant `application/use-cases/` file.
2. Keep all permission logic in the application layer — never in `domain/` or UI components.
3. Return a typed `CommandResult` with a descriptive error message on failure.
4. Document new roles or resources in this file.

