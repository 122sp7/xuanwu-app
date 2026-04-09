<!-- Purpose: Subdomain scaffold overview for platform 'organization'. -->

## Organization Subdomain

The Organization subdomain manages organizational boundaries, member roles, and team structures within the platform. It defines how tenants are organized and enforces role-based access control at the organizational level.

### Core Responsibilities

- **Organization Lifecycle**: Create, read, update, and delete organizations
- **Member Management**: Add, remove, and manage organization members
- **Role & Permission Assignment**: Define and enforce roles within an organization
- **Organization Settings**: Manage organization-wide configuration and policies

### Key Aggregates

- **Organization** (Aggregate Root): Represents a tenant organization with identity, name, and metadata
- **OrganizationMember**: Represents a member's relationship to an organization with assigned roles
- **OrganizationRole**: Defines permissions and capabilities for members within the organization

### Bounded Context Contracts

- **Published Events**:
    - `organization.created` — Organization was created
    - `organization.updated` — Organization settings were modified
    - `organization.member-invited` — A new member was invited to the organization
    - `organization.member-removed` — A member was removed from the organization

- **Repository Interfaces**:
    - `IOrganizationRepository` — Manage organization aggregates
    - `IOrganizationMemberRepository` — Manage organization membership records

### Integration Points

- **Upstream (Consumes)**: `identity`, `account` — Validates authenticated principals before member operations
- **Downstream (Provides)**: `access-control`, `workspace`, `platform-config` — Enforces organizational membership and role context for downstream access decisions

### File Structure

```
modules/platform/subdomains/organization/
├── domain/
│   ├── entities/
│   │   ├── Organization.ts
│   │   └── OrganizationMember.ts
│   ├── repositories/
│   │   ├── IOrganizationRepository.ts
│   │   └── IOrganizationMemberRepository.ts
│   └── value-objects/
│       └── OrganizationId.ts
├── application/
│   └── use-cases/
│       ├── create-organization.use-case.ts
│       ├── invite-member.use-case.ts
│       └── remove-member.use-case.ts
├── infrastructure/
│   ├── firebase/
│   │   ├── FirebaseOrganizationRepository.ts
│   │   └── FirebaseOrganizationMemberRepository.ts
│   └── memory/
│       └── InMemoryOrganizationRepository.ts
├── interfaces/
│   ├── _actions/
│   │   └── organization.actions.ts
│   └── api/
│       └── organization.routes.ts
├── api/
│   └── index.ts
└── README.md
```
