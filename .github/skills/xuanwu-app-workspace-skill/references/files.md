# Files

## File: modules/workspace/AGENT.md
````markdown
# Workspace Agent

> Strategic agent documentation: [docs/contexts/workspace/AGENT.md](../../docs/contexts/workspace/AGENT.md)

## Mission

保護 workspace 主域作為協作容器、工作區範疇與 workspaceId 錨點。

## Route Here When

- 問題的中心是 workspaceId、工作區建立封存、工作區內角色與參與關係。
- 問題的中心是工作區共享、存在感、活動流、排程與工作流執行。
- 問題需要提供其他主域運作所需的 workspace scope。

## Route Elsewhere When

- 身份、組織、授權、權益、憑證、通知治理屬於 platform。
- 知識頁面、文章、資料庫、分類、內容發布屬於 notion。
- notebook、conversation、source、retrieval、synthesis 屬於 notebooklm。

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order (Strangler Pattern)

New features:
1. Define Domain (entities, value objects, aggregates, events)
2. Define Application (use cases, DTOs)
3. Define Ports (only if boundary isolation needed)
4. Implement Infrastructure (adapters, persistence)
5. Implement Interfaces (UI, actions, hooks)

Legacy migration:
1. Find a Use Case to extract
2. Build Domain model for that use case
3. Converge Application layer
4. Isolate legacy via Ports
5. Replace Infrastructure adapter
````

## File: modules/workspace/api/api.instructions.md
````markdown
---
description: 'Workspace API boundary rules: cross-module entry surface, workspaceId published language, facade/contract/runtime separation, and downstream consumer contracts.'
applyTo: 'modules/workspace/api/**/*.{ts,tsx}'
---

# Workspace API Layer (Local)

Use this file as execution guardrails for `modules/workspace/api/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/workspace/context-map.md`.

## Core Rules

- `api/` is the **only** cross-module entry surface; never expose `domain/`, `application/`, or `infrastructure/` internals.
- `contracts.ts` defines stable cross-module types; `facade.ts` exposes callable service methods; `ui.ts` exposes UI-safe view tokens only.
- Published language tokens for cross-module use: `workspaceId`, `membershipRef`, `workspaceCapabilitySignal`, `wikiContentTreeRef`.
- `runtime/factories.ts` wires workspace services for server-side consumption — keep wiring thin, delegate to application services.
- Never expose `Workspace` aggregate or `WorkspaceMemberView` entity directly across the boundary; translate to contract types.
- `notebooklm` and `notion` must receive `workspaceId` as a scope token, never as a full workspace object.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
````

## File: modules/workspace/api/contracts.ts
````typescript
/**
 * workspace api/contracts.ts
 *
 * Canonical public type surface for the workspace bounded context.
 * Cross-module and app-layer consumers should import types from here.
 *
 * Internal source: interfaces/api/contracts/
 */

export type {
  Address,
  AddressInput,
  Capability,
  CapabilitySpec,
  CreateWorkspaceCommand,
  UpdateWorkspaceSettingsCommand,
  WorkspaceEntity,
  WorkspaceGrant,
  WorkspaceLifecycleState,
  WorkspaceLifecycleStateInput,
  WorkspaceLocation,
  WorkspaceName,
  WorkspaceNameInput,
  WorkspacePersonnel,
  WorkspacePersonnelCustomRole,
  WorkspaceVisibility,
  WorkspaceVisibilityInput,
} from "../domain/aggregates/Workspace";

export type {
  WorkspaceMemberAccessChannel,
  WorkspaceMemberAccessSource,
  WorkspaceMemberPresence,
  WorkspaceMemberView,
} from "../domain/entities/WorkspaceMemberView";

export type {
  WikiAccountContentNode,
  WikiAccountSeed,
  WikiAccountType,
  WikiContentItemNode,
  WikiWorkspaceContentNode,
  WikiWorkspaceRef,
} from "../domain/entities/WikiContentTree";

export {
  WORKSPACE_LIFECYCLE_STATES,
  WORKSPACE_VISIBILITIES,
  createAddress,
  createWorkspaceLifecycleState,
  createWorkspaceName,
  createWorkspaceVisibility,
  formatAddress,
  isTerminalWorkspaceLifecycleState,
  isWorkspaceVisible,
  workspaceNameEquals,
} from "../domain/value-objects";

export type {
  WorkspaceCreatedEvent,
  WorkspaceDomainEvent,
  WorkspaceLifecycleTransitionedEvent,
  WorkspaceVisibilityChangedEvent,
} from "../domain/events/workspace.events";

export {
  WORKSPACE_CREATED_EVENT_TYPE,
  WORKSPACE_LIFECYCLE_TRANSITIONED_EVENT_TYPE,
  WORKSPACE_VISIBILITY_CHANGED_EVENT_TYPE,
  createWorkspaceCreatedEvent,
  createWorkspaceLifecycleTransitionedEvent,
  createWorkspaceVisibilityChangedEvent,
} from "../domain/events/workspace.events";

export type {
  AuditAction,
  AuditLog,
  AuditLogEntity,
  AuditLogSource,
  AuditSeverity,
  ChangeRecord,
} from "../subdomains/audit/api";

export { AuditLogSchema, AUDIT_ACTIONS, AUDIT_SEVERITIES } from "../subdomains/audit/api";

export type {
  WorkspaceFeedPost,
  WorkspaceFeedPostType,
} from "../subdomains/feed/api";

export { WORKSPACE_FEED_POST_TYPES } from "../subdomains/feed/api";

export type {
  AssignWorkDemandCommand,
  CreateWorkDemandCommand,
  DemandPriority,
  DemandStatus,
  WorkDemand,
  WorkDemandDomainEvent,
} from "../subdomains/scheduling/api";

export {
  DEMAND_PRIORITIES,
  DEMAND_PRIORITY_LABELS,
  DEMAND_STATUSES,
  DEMAND_STATUS_LABELS,
} from "../subdomains/scheduling/api";

export type {
  Task,
  Issue,
  Invoice,
  InvoiceItem,
  TaskStatus,
  IssueStatus,
  IssueStage,
  InvoiceStatus,
  TaskSummary,
  IssueSummary,
  InvoiceSummary,
  InvoiceItemSummary,
  CreateTaskDto,
  UpdateTaskDto,
  OpenIssueDto,
  ResolveIssueDto,
  AddInvoiceItemDto,
  UpdateInvoiceItemDto,
  RemoveInvoiceItemDto,
  TaskQueryDto,
  IssueQueryDto,
  InvoiceQueryDto,
  PaginationDto,
  PagedResult,
  CommandResult,
} from "../subdomains/workspace-workflow/api";

export {
  TASK_STATUSES,
  ISSUE_STATUSES,
  ISSUE_STAGES,
  INVOICE_STATUSES,
  toTaskSummary,
  toIssueSummary,
  toInvoiceSummary,
  toInvoiceItemSummary,
} from "../subdomains/workspace-workflow/api";
````

## File: modules/workspace/api/index.ts
````typescript
/**
 * workspace api/index.ts
 *
 * Canonical public boundary for the workspace bounded context.
 *
 * Cross-module consumers (app/, other modules) MUST import from this path:
 *   import { ... } from "@/modules/workspace/api"
 *
 * Direct imports into domain/, application/, infrastructure/, interfaces/, or
 * ports/ sub-directories from outside this bounded context are forbidden.
 *
 * Surface breakdown:
 *  - contracts.ts  → types, value-object helpers, domain event contracts
 *  - facade.ts     → commands and queries (Server Actions / query functions)
 *  - ui.ts         → web UI components, hooks, navigation, state utilities
 */

export * from "./contracts";
export * from "./facade";
export * from "./ui";
````

## File: modules/workspace/api/runtime/factories.ts
````typescript
import { SharedWorkspaceDomainEventPublisher } from "../../infrastructure/events/SharedWorkspaceDomainEventPublisher";
import { FirebaseWikiWorkspaceRepository } from "../../infrastructure/firebase/FirebaseWikiWorkspaceRepository";
import { FirebaseWorkspaceQueryRepository } from "../../infrastructure/firebase/FirebaseWorkspaceQueryRepository";
import { FirebaseWorkspaceRepository } from "../../infrastructure/firebase/FirebaseWorkspaceRepository";

interface OrganizationDirectoryGateway {
  getOrganizationMembers(organizationId: string): Promise<{ id: string; name: string; email?: string; role?: string }[]>;
  getOrganizationTeams(organizationId: string): Promise<{ id: string; name: string; memberIds: string[] }[]>;
}

export function makeWorkspaceRepo() {
  return new FirebaseWorkspaceRepository();
}

export function makeWorkspaceQueryRepo(gateway: OrganizationDirectoryGateway) {
  return new FirebaseWorkspaceQueryRepository(gateway);
}

export function makeWikiWorkspaceRepo() {
  return new FirebaseWikiWorkspaceRepository();
}

export function makeWorkspaceDomainEventPublisher() {
  return new SharedWorkspaceDomainEventPublisher();
}
````

## File: modules/workspace/application/application.instructions.md
````markdown
---
description: 'Workspace application layer rules: use-case orchestration, command/query application services, event publishing order, and DTO contracts.'
applyTo: 'modules/workspace/application/**/*.{ts,tsx}'
---

# Workspace Application Layer (Local)

Use this file as execution guardrails for `modules/workspace/application/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/workspace/*`.

## Core Rules

- `WorkspaceCommandApplicationService` and `WorkspaceQueryApplicationService` are the primary dispatch entry points — do not bypass them from interfaces.
- Use cases orchestrate flow only; lifecycle invariants, capability rules, and access checks stay in `domain/`.
- After persisting, call `pullDomainEvents()` and publish via `WorkspaceDomainEventPublisher` — never publish before persistence.
- DTOs (`workspace-interfaces.dto.ts`, `workspace-member-view.dto.ts`, `wiki-content-tree.dto.ts`) are application-layer contracts; never expose domain aggregates across the boundary.
- Pure reads (workspace queries, member views, wiki tree) belong in **query handlers** — `WorkspaceQueryApplicationService` owns these.
- Use case ordering for new workspace features: lifecycle → member → capabilities → access.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
````

## File: modules/workspace/application/dtos/wiki-content-tree.dto.ts
````typescript
export type {
  WikiAccountContentNode,
  WikiAccountSeed,
  WikiAccountType,
  WikiContentItemNode,
  WikiWorkspaceContentNode,
  WikiWorkspaceRef,
} from "../../domain/entities/WikiContentTree";
````

## File: modules/workspace/application/dtos/workspace-interfaces.dto.ts
````typescript
/**
 * Application-layer DTO re-exports for workspace root interfaces.
 * Interfaces must import from here, not from domain/ directly.
 */

// --- Aggregate types ---
export type {
  Address,
  AddressInput,
  Capability,
  CapabilitySpec,
  CreateWorkspaceCommand,
  UpdateWorkspaceSettingsCommand,
  WorkspaceEntity,
  WorkspaceGrant,
  WorkspaceLifecycleState,
  WorkspaceLifecycleStateInput,
  WorkspaceLocation,
  WorkspaceName,
  WorkspaceNameInput,
  WorkspacePersonnel,
  WorkspacePersonnelCustomRole,
  WorkspaceVisibility,
  WorkspaceVisibilityInput,
} from "../../domain/aggregates/Workspace";

// --- Value-object helpers (values, not just types) ---
export {
  WORKSPACE_LIFECYCLE_STATES,
  WORKSPACE_VISIBILITIES,
  createAddress,
  createWorkspaceLifecycleState,
  createWorkspaceName,
  createWorkspaceVisibility,
  formatAddress,
  isTerminalWorkspaceLifecycleState,
  isWorkspaceVisible,
  workspaceNameEquals,
} from "../../domain/value-objects";

// --- Domain events ---
export type {
  WorkspaceCreatedEvent,
  WorkspaceDomainEvent,
  WorkspaceLifecycleTransitionedEvent,
  WorkspaceVisibilityChangedEvent,
} from "../../domain/events/workspace.events";

export {
  WORKSPACE_CREATED_EVENT_TYPE,
  WORKSPACE_LIFECYCLE_TRANSITIONED_EVENT_TYPE,
  WORKSPACE_VISIBILITY_CHANGED_EVENT_TYPE,
  createWorkspaceCreatedEvent,
  createWorkspaceLifecycleTransitionedEvent,
  createWorkspaceVisibilityChangedEvent,
} from "../../domain/events/workspace.events";

// --- Ports ---
export type { WorkspaceCommandPort } from "../../domain/ports/input/WorkspaceCommandPort";
export type { WorkspaceQueryPort } from "../../domain/ports/input/WorkspaceQueryPort";
````

## File: modules/workspace/application/dtos/workspace-member-view.dto.ts
````typescript
export type {
  WorkspaceMemberAccessChannel,
  WorkspaceMemberAccessSource,
  WorkspaceMemberPresence,
  WorkspaceMemberView,
} from "../../domain/entities/WorkspaceMemberView";
````

## File: modules/workspace/application/queries/workspace.queries.ts
````typescript
/**
 * Module: workspace
 * Layer: application/queries
 * Purpose: Workspace read query handlers — pure reads with input normalization.
 *
 * DDD Rule 5:  Pure reads without business logic → Query, not Use Case.
 * DDD Rule 13: Read → queries/
 * DDD Rule 16: GetXxxUseCase → should be Query.
 * DDD Rule 18: Use Case wrapping a single call → over-design.
 */

import type { WorkspaceEntity } from "../../domain/aggregates/Workspace";
import type { WorkspaceRepository } from "../../domain/ports/output/WorkspaceRepository";
import type {
  Unsubscribe,
  WorkspaceQueryRepository,
} from "../../domain/ports/output/WorkspaceQueryRepository";

// ─── Input Normalization ──────────────────────────────────────────────────────

function normalizeId(value: string): string {
  return value.trim();
}

// ─── Query Handlers ───────────────────────────────────────────────────────────

export function listWorkspacesForAccount(
  workspaceRepo: WorkspaceRepository,
  accountId: string,
): Promise<WorkspaceEntity[]> {
  const normalized = normalizeId(accountId);
  if (!normalized) return Promise.resolve([]);
  return workspaceRepo.findAllByAccountId(normalized);
}

export function subscribeToWorkspacesForAccount(
  workspaceQueryRepo: WorkspaceQueryRepository,
  accountId: string,
  onUpdate: (workspaces: WorkspaceEntity[]) => void,
): Unsubscribe {
  const normalized = normalizeId(accountId);
  if (!normalized) {
    onUpdate([]);
    return () => {};
  }
  return workspaceQueryRepo.subscribeToWorkspacesForAccount(normalized, onUpdate);
}

export function getWorkspaceById(
  workspaceRepo: WorkspaceRepository,
  workspaceId: string,
): Promise<WorkspaceEntity | null> {
  const normalized = normalizeId(workspaceId);
  if (!normalized) return Promise.resolve(null);
  return workspaceRepo.findById(normalized);
}

export function getWorkspaceByIdForAccount(
  workspaceRepo: WorkspaceRepository,
  accountId: string,
  workspaceId: string,
): Promise<WorkspaceEntity | null> {
  const normalizedAccountId = normalizeId(accountId);
  const normalizedWorkspaceId = normalizeId(workspaceId);
  if (!normalizedAccountId || !normalizedWorkspaceId) return Promise.resolve(null);
  return workspaceRepo.findByIdForAccount(normalizedAccountId, normalizedWorkspaceId);
}
````

## File: modules/workspace/application/services/WorkspaceCommandApplicationService.ts
````typescript
import { commandFailureFrom, type CommandResult } from "@shared-types";

import {
  MountCapabilitiesUseCase,
  CreateWorkspaceLocationUseCase,
} from "../use-cases/workspace.use-cases";
import type { WorkspaceCommandPort } from "../../domain/ports/input/WorkspaceCommandPort";
import type {
  WorkspaceAccessRepository,
  WorkspaceCapabilityRepository,
  WorkspaceDomainEventPublisher,
  WorkspaceLocationRepository,
  WorkspaceRepository,
} from "../../domain/ports";
import type {
  Capability,
  CreateWorkspaceCommand,
  UpdateWorkspaceSettingsCommand,
  WorkspaceGrant,
  WorkspaceLocation,
} from "../../domain/aggregates/Workspace";
import { WorkspaceLifecycleApplicationService } from "../../subdomains/lifecycle/api";
import { WorkspaceSharingApplicationService } from "../../subdomains/sharing/api";

interface WorkspaceCommandApplicationServiceDependencies {
  workspaceRepo: WorkspaceRepository;
  workspaceCapabilityRepo: WorkspaceCapabilityRepository;
  workspaceAccessRepo: WorkspaceAccessRepository;
  workspaceLocationRepo: WorkspaceLocationRepository;
  workspaceDomainEventPublisher: WorkspaceDomainEventPublisher;
}

export class WorkspaceCommandApplicationService implements WorkspaceCommandPort {
  private readonly lifecycleService: WorkspaceLifecycleApplicationService;
  private readonly sharingService: WorkspaceSharingApplicationService;

  constructor(
    private readonly dependencies: WorkspaceCommandApplicationServiceDependencies,
  ) {
    this.lifecycleService = new WorkspaceLifecycleApplicationService({
      workspaceRepo: dependencies.workspaceRepo,
      workspaceCapabilityRepo: dependencies.workspaceCapabilityRepo,
      eventPublisher: dependencies.workspaceDomainEventPublisher,
    });
    this.sharingService = new WorkspaceSharingApplicationService({
      workspaceAccessRepo: dependencies.workspaceAccessRepo,
    });
  }

  // ─── Lifecycle (delegated to lifecycle subdomain) ───────────────────────────

  async createWorkspace(command: CreateWorkspaceCommand): Promise<CommandResult> {
    return this.lifecycleService.createWorkspace(command);
  }

  async createWorkspaceWithCapabilities(
    command: CreateWorkspaceCommand,
    capabilities: Capability[],
  ): Promise<CommandResult> {
    return this.lifecycleService.createWorkspaceWithCapabilities(command, capabilities);
  }

  async updateWorkspaceSettings(
    command: UpdateWorkspaceSettingsCommand,
  ): Promise<CommandResult> {
    return this.lifecycleService.updateWorkspaceSettings(command);
  }

  async deleteWorkspace(workspaceId: string): Promise<CommandResult> {
    return this.lifecycleService.deleteWorkspace(workspaceId);
  }

  // ─── Sharing (delegated to sharing subdomain) ──────────────────────────────

  async authorizeWorkspaceTeam(workspaceId: string, teamId: string): Promise<CommandResult> {
    return this.sharingService.authorizeWorkspaceTeam(workspaceId, teamId);
  }

  async grantIndividualWorkspaceAccess(
    workspaceId: string,
    grant: WorkspaceGrant,
  ): Promise<CommandResult> {
    return this.sharingService.grantIndividualWorkspaceAccess(workspaceId, grant);
  }

  // ─── Capabilities (root-level, pending subdomain assignment) ────────────────

  async mountCapabilities(
    workspaceId: string,
    capabilities: Capability[],
  ): Promise<CommandResult> {
    try {
      return await new MountCapabilitiesUseCase(this.dependencies.workspaceCapabilityRepo).execute(
        workspaceId,
        capabilities,
      );
    } catch (err) {
      return commandFailureFrom(
        "CAPABILITIES_MOUNT_FAILED",
        err instanceof Error ? err.message : "Unexpected error",
      );
    }
  }

  // ─── Location (root-level, part of Workspace operational profile) ───────────

  async createWorkspaceLocation(
    workspaceId: string,
    location: Omit<WorkspaceLocation, "locationId">,
  ): Promise<CommandResult> {
    try {
      return await new CreateWorkspaceLocationUseCase(this.dependencies.workspaceLocationRepo).execute(
        workspaceId,
        location,
      );
    } catch (err) {
      return commandFailureFrom(
        "WORKSPACE_LOCATION_CREATE_FAILED",
        err instanceof Error ? err.message : "Unexpected error",
      );
    }
  }
}
````

## File: modules/workspace/application/services/WorkspaceQueryApplicationService.ts
````typescript
import type {
  WikiAccountContentNode,
  WikiAccountSeed,
} from "../../domain/entities/WikiContentTree";
import type { WorkspaceMemberView } from "../../domain/entities/WorkspaceMemberView";
import {
  getWorkspaceByIdForAccount,
  getWorkspaceById,
  listWorkspacesForAccount,
  subscribeToWorkspacesForAccount,
} from "../queries/workspace.queries";
import { fetchWorkspaceMembers } from "../../subdomains/membership/api";
import { buildWikiContentTree } from "../queries/wiki-content-tree.queries";
import type { WorkspaceQueryPort } from "../../domain/ports/input/WorkspaceQueryPort";
import type { WorkspaceEntity } from "../../domain/aggregates/Workspace";
import type { WorkspaceQueryRepository } from "../../domain/ports/output/WorkspaceQueryRepository";
import type { WorkspaceRepository } from "../../domain/ports/output/WorkspaceRepository";
import type { WikiWorkspaceRepository } from "../../domain/ports/output/WikiWorkspaceRepository";

interface WorkspaceQueryApplicationServiceDependencies {
  workspaceRepo: WorkspaceRepository;
  workspaceQueryRepo: WorkspaceQueryRepository;
  wikiWorkspaceRepo: WikiWorkspaceRepository;
}

export class WorkspaceQueryApplicationService implements WorkspaceQueryPort {
  constructor(
    private readonly dependencies: WorkspaceQueryApplicationServiceDependencies,
  ) {}

  getWorkspacesForAccount(accountId: string): Promise<WorkspaceEntity[]> {
    return listWorkspacesForAccount(this.dependencies.workspaceRepo, accountId);
  }

  subscribeToWorkspacesForAccount(
    accountId: string,
    onUpdate: (workspaces: WorkspaceEntity[]) => void,
  ) {
    return subscribeToWorkspacesForAccount(
      this.dependencies.workspaceQueryRepo,
      accountId,
      onUpdate,
    );
  }

  getWorkspaceById(workspaceId: string): Promise<WorkspaceEntity | null> {
    return getWorkspaceById(this.dependencies.workspaceRepo, workspaceId);
  }

  getWorkspaceByIdForAccount(
    accountId: string,
    workspaceId: string,
  ): Promise<WorkspaceEntity | null> {
    return getWorkspaceByIdForAccount(this.dependencies.workspaceRepo, accountId, workspaceId);
  }

  getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMemberView[]> {
    return fetchWorkspaceMembers(this.dependencies.workspaceQueryRepo, workspaceId);
  }

  buildWikiContentTree(seeds: WikiAccountSeed[]): Promise<WikiAccountContentNode[]> {
    return buildWikiContentTree(seeds, this.dependencies.wikiWorkspaceRepo);
  }
}
````

## File: modules/workspace/application/use-cases/workspace-capabilities.use-cases.ts
````typescript
/**
 * Module: workspace
 * Layer: application/use-cases
 * Purpose: Workspace capabilities use case — mount feature flags.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { WorkspaceCapabilityRepository } from "../../domain/ports/output/WorkspaceCapabilityRepository";
import type { Capability } from "../../domain/aggregates/Workspace";

// ─── Mount Capabilities ───────────────────────────────────────────────────────

export class MountCapabilitiesUseCase {
  constructor(private readonly capabilityRepo: WorkspaceCapabilityRepository) {}

  async execute(workspaceId: string, capabilities: Capability[]): Promise<CommandResult> {
    try {
      await this.capabilityRepo.mountCapabilities(workspaceId, capabilities);
      return commandSuccess(workspaceId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "CAPABILITIES_MOUNT_FAILED",
        err instanceof Error ? err.message : "Failed to mount capabilities",
      );
    }
  }
}
````

## File: modules/workspace/application/use-cases/workspace-location.use-cases.ts
````typescript
/**
 * Module: workspace
 * Layer: application/use-cases
 * Purpose: Workspace location use case — part of workspace operational profile.
 *
 * DDD Rule 1: Has business behavior (location creation within workspace scope)
 * DDD Rule 8: One use case = one business intent (verb: Create)
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { WorkspaceLocationRepository } from "../../domain/ports/output/WorkspaceLocationRepository";
import type { WorkspaceLocation } from "../../domain/aggregates/Workspace";

export class CreateWorkspaceLocationUseCase {
  constructor(private readonly workspaceLocationRepo: WorkspaceLocationRepository) {}

  async execute(
    workspaceId: string,
    location: Omit<WorkspaceLocation, "locationId">,
  ): Promise<CommandResult> {
    try {
      const locationId = await this.workspaceLocationRepo.createLocation(workspaceId, location);
      return commandSuccess(locationId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "WORKSPACE_LOCATION_CREATE_FAILED",
        err instanceof Error ? err.message : "Failed to create workspace location",
      );
    }
  }
}
````

## File: modules/workspace/application/use-cases/workspace.use-cases.ts
````typescript
/**
 * Module: workspace
 * Layer: application/use-cases
 * Purpose: Re-export barrel for workspace command use cases that remain at root level.
 *          Lifecycle use cases → subdomains/lifecycle/
 *          Sharing use cases → subdomains/sharing/
 *          Queries → application/queries/
 *
 * DDD Rule 12: Command → use-cases/
 * DDD Rule 13: Read → queries/
 */

export { MountCapabilitiesUseCase } from "./workspace-capabilities.use-cases";

export { CreateWorkspaceLocationUseCase } from "./workspace-location.use-cases";
````

## File: modules/workspace/docs/docs.instructions.md
````markdown
---
description: 'Workspace documentation rules: strategic doc authority, subdomain list sync, and ubiquitous language enforcement.'
applyTo: 'modules/workspace/docs/**/*.md'
---

# Workspace Docs Layer (Local)

Use this file as execution guardrails for `modules/workspace/docs/*`.
For full reference, align with `.github/instructions/docs-authority-and-language.instructions.md` and `docs/contexts/workspace/*`.

## Core Rules

- `modules/workspace/docs/` holds **links and local summaries only** — authoritative content lives in `docs/contexts/workspace/`.
- Do not duplicate strategic knowledge here; point to the canonical source instead.
- Any new architectural decision affecting workspace must have a corresponding ADR in `docs/decisions/`.
- Use ubiquitous language from `docs/contexts/workspace/ubiquitous-language.md`; do not introduce synonyms.
- Keep this directory in sync with `docs/contexts/workspace/README.md` whenever the subdomain list changes.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
````

## File: modules/workspace/docs/README.md
````markdown
# Workspace Documentation

Implementation-level documentation for the workspace bounded context.

## Strategic Documentation (Authority)

Strategic architecture documentation lives in `docs/contexts/workspace/`:

- [README.md](../../../docs/contexts/workspace/README.md) — Context overview
- [subdomains.md](../../../docs/contexts/workspace/subdomains.md) — Subdomain inventory
- [bounded-contexts.md](../../../docs/contexts/workspace/bounded-contexts.md) — Ownership map
- [context-map.md](../../../docs/contexts/workspace/context-map.md) — Relationships
- [ubiquitous-language.md](../../../docs/contexts/workspace/ubiquitous-language.md) — Terminology

## Architecture Reference

- [Bounded Context Template](../../../docs/bounded-context-subdomain-template.md) — Standard structure
- [Architecture Overview](../../../docs/architecture-overview.md) — System-wide architecture
- [Integration Guidelines](../../../docs/integration-guidelines.md) — Cross-context rules

## Conflict Resolution

- Strategic docs in `docs/contexts/workspace/` are the authority for naming, ownership, and boundaries.
- This `docs/` folder is for implementation-aligned detail only.
````

## File: modules/workspace/domain/aggregates/Workspace.test.ts
````typescript
import { describe, expect, it } from "vitest";

import { Workspace } from "./Workspace";

describe("Workspace aggregate", () => {
  it("creates a workspace with canonical defaults", () => {
    const workspace = Workspace.create({
      name: "  Demo Workspace  ",
      accountId: "  account-1  ",
      accountType: "organization",
    });

    const snapshot = workspace.toSnapshot();

    expect(snapshot.name).toBe("Demo Workspace");
    expect(snapshot.accountId).toBe("account-1");
    expect(snapshot.accountType).toBe("organization");
    expect(snapshot.lifecycleState).toBe("preparatory");
    expect(snapshot.visibility).toBe("visible");
    expect(snapshot.capabilities).toEqual([]);
    expect(snapshot.grants).toEqual([]);
    expect(snapshot.teamIds).toEqual([]);
  });

  it("enforces canonical lifecycle transitions", () => {
    const workspace = Workspace.create({
      name: "Demo Workspace",
      accountId: "account-1",
      accountType: "user",
    });

    workspace.activate();
    workspace.stop();

    expect(workspace.lifecycleState).toBe("stopped");
  });

  it("rejects invalid lifecycle transitions", () => {
    const workspace = Workspace.create({
      name: "Demo Workspace",
      accountId: "account-1",
      accountType: "user",
    });

    expect(() => workspace.stop()).toThrow(
      "Invalid workspace lifecycle transition: preparatory -> stopped",
    );
  });

  it("applies settings through aggregate rules", () => {
    const workspace = Workspace.create({
      name: "Demo Workspace",
      accountId: "account-1",
      accountType: "organization",
    });

    workspace.applySettings({
      name: "  Renamed Workspace  ",
      lifecycleState: "active",
      visibility: "hidden",
      address: {
        street: " 1 Infinite Loop ",
        city: "Cupertino",
        state: "CA",
        postalCode: "95014",
        country: "USA",
      },
      personnel: {
        managerId: "manager-1",
        customRoles: [
          {
            roleId: "ops",
            roleName: "Operations",
            role: "ops-manager",
          },
        ],
      },
    });

    const snapshot = workspace.toSnapshot();

    expect(snapshot.name).toBe("Renamed Workspace");
    expect(snapshot.lifecycleState).toBe("active");
    expect(snapshot.visibility).toBe("hidden");
    expect(snapshot.address?.street).toBe("1 Infinite Loop");
    expect(snapshot.personnel?.managerId).toBe("manager-1");
    expect(snapshot.personnel?.customRoles?.[0]?.roleName).toBe("Operations");
  });
});
````

## File: modules/workspace/domain/domain-modeling.instructions.md
````markdown
---
description: 'Workspace domain tactical modeling rules (local mirror of root domain-modeling guidance).'
applyTo: '*.{ts,tsx}'
---

# Domain Modeling (Workspace Local)

Use this local file as execution guardrails for `modules/workspace/domain/*`.
For full reference, align with `.github/instructions/domain-modeling.instructions.md` and `docs/contexts/workspace/*`.

## Core Rules

- Keep aggregate invariants inside aggregate methods.
- Use immutable value objects with Zod schemas and inferred types.
- Keep domain framework-free (no Firebase/React/transport imports).
- Emit domain events on state transitions and publish via application orchestration.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
````

## File: modules/workspace/domain/entities/WikiContentTree.ts
````typescript
/**
 * Workspace wiki/content tree read models owned by workspace language.
 */

export type WikiAccountType = "personal" | "organization";

export interface WikiWorkspaceRef {
  id: string;
  name: string;
}

export interface WikiContentItemNode {
  key: "spaces" | "pages" | "libraries" | "documents" | "vector-index" | "rag" | "ai-tools";
  label: string;
  href: string;
  enabled: boolean;
}

export interface WikiWorkspaceContentNode {
  workspaceId: string;
  workspaceName: string;
  href: string;
  contentBaseItems: WikiContentItemNode[];
}

export interface WikiAccountContentNode {
  accountId: string;
  accountName: string;
  accountType: WikiAccountType;
  isActive: boolean;
  membersHref?: string;
  teamsHref?: string;
  workspaces: WikiWorkspaceContentNode[];
}

export interface WikiAccountSeed {
  accountId: string;
  accountName: string;
  accountType: WikiAccountType;
  isActive: boolean;
}
````

## File: modules/workspace/domain/entities/WorkspaceAccess.ts
````typescript
export interface WorkspaceGrant {
  userId?: string;
  teamId?: string;
  role: string;
  protocol?: string;
}

export interface WorkspaceAccessPolicy {
  grants: WorkspaceGrant[];
  teamIds: string[];
}
````

## File: modules/workspace/domain/entities/WorkspaceCapability.ts
````typescript
export interface CapabilitySpec {
  id: string;
  name: string;
  type: "ui" | "api" | "data" | "governance" | "monitoring";
  status: "stable" | "beta";
  description: string;
}

export interface Capability extends CapabilitySpec {
  config?: object;
}

export interface WorkspaceCapabilityAssignments {
  capabilities: Capability[];
}
````

## File: modules/workspace/domain/entities/WorkspaceLocation.ts
````typescript
export interface WorkspaceLocation {
  locationId: string;
  label: string;
  description?: string;
  capacity?: number;
}

export interface WorkspaceLocationCatalog {
  locations?: WorkspaceLocation[];
}
````

## File: modules/workspace/domain/entities/WorkspaceMemberView.ts
````typescript
/**
 * Workspace member read models owned by the workspace domain language.
 */

export type WorkspaceMemberPresence = "active" | "away" | "offline" | "unknown";

export type WorkspaceMemberAccessSource = "owner" | "direct" | "team" | "personnel";

export interface WorkspaceMemberAccessChannel {
  readonly source: WorkspaceMemberAccessSource;
  readonly label: string;
  readonly role?: string;
  readonly protocol?: string;
  readonly teamId?: string;
}

export interface WorkspaceMemberView {
  readonly id: string;
  readonly displayName: string;
  readonly email?: string;
  readonly organizationRole?: string;
  readonly presence: WorkspaceMemberPresence;
  readonly isExternal: boolean;
  readonly accessChannels: WorkspaceMemberAccessChannel[];
}
````

## File: modules/workspace/domain/entities/WorkspaceProfile.ts
````typescript
import type { WorkspaceLocationCatalog } from "./WorkspaceLocation";
import type { Address } from "../value-objects/Address";

export interface WorkspacePersonnel {
  managerId?: string;
  supervisorId?: string;
  safetyOfficerId?: string;
  customRoles?: WorkspacePersonnelCustomRole[];
}

export interface WorkspacePersonnelCustomRole {
  roleId: string;
  roleName: string;
  role: string;
}

export interface WorkspaceOperationalProfile extends WorkspaceLocationCatalog {
  address?: Address;
  personnel?: WorkspacePersonnel;
}

export type { Address, AddressInput } from "../value-objects/Address";
````

## File: modules/workspace/domain/events/workspace.events.ts
````typescript
import { v7 } from "@lib-uuid";
import type { DomainEvent } from "@shared-types";

import type {
  WorkspaceLifecycleState,
  WorkspaceVisibility,
} from "../aggregates/Workspace";

export const WORKSPACE_CREATED_EVENT_TYPE = "workspace.created" as const;
export const WORKSPACE_LIFECYCLE_TRANSITIONED_EVENT_TYPE = "workspace.lifecycle_transitioned" as const;
export const WORKSPACE_VISIBILITY_CHANGED_EVENT_TYPE = "workspace.visibility_changed" as const;

interface WorkspaceEventBase extends DomainEvent {
  readonly workspaceId: string;
  readonly accountId: string;
}

export interface WorkspaceCreatedEvent extends WorkspaceEventBase {
  readonly type: typeof WORKSPACE_CREATED_EVENT_TYPE;
  readonly accountType: "user" | "organization";
  readonly name: string;
}

export interface WorkspaceLifecycleTransitionedEvent extends WorkspaceEventBase {
  readonly type: typeof WORKSPACE_LIFECYCLE_TRANSITIONED_EVENT_TYPE;
  readonly fromState: WorkspaceLifecycleState;
  readonly toState: WorkspaceLifecycleState;
}

export interface WorkspaceVisibilityChangedEvent extends WorkspaceEventBase {
  readonly type: typeof WORKSPACE_VISIBILITY_CHANGED_EVENT_TYPE;
  readonly fromVisibility: WorkspaceVisibility;
  readonly toVisibility: WorkspaceVisibility;
}

export type WorkspaceDomainEvent =
  | WorkspaceCreatedEvent
  | WorkspaceLifecycleTransitionedEvent
  | WorkspaceVisibilityChangedEvent;

export function createWorkspaceCreatedEvent(input: {
  workspaceId: string;
  accountId: string;
  accountType: "user" | "organization";
  name: string;
}): WorkspaceCreatedEvent {
  return {
    eventId: v7(),
    type: WORKSPACE_CREATED_EVENT_TYPE,
    aggregateId: input.workspaceId,
    occurredAt: new Date().toISOString(),
    workspaceId: input.workspaceId,
    accountId: input.accountId,
    accountType: input.accountType,
    name: input.name,
  };
}

export function createWorkspaceLifecycleTransitionedEvent(input: {
  workspaceId: string;
  accountId: string;
  fromState: WorkspaceLifecycleState;
  toState: WorkspaceLifecycleState;
}): WorkspaceLifecycleTransitionedEvent {
  return {
    eventId: v7(),
    type: WORKSPACE_LIFECYCLE_TRANSITIONED_EVENT_TYPE,
    aggregateId: input.workspaceId,
    occurredAt: new Date().toISOString(),
    workspaceId: input.workspaceId,
    accountId: input.accountId,
    fromState: input.fromState,
    toState: input.toState,
  };
}

export function createWorkspaceVisibilityChangedEvent(input: {
  workspaceId: string;
  accountId: string;
  fromVisibility: WorkspaceVisibility;
  toVisibility: WorkspaceVisibility;
}): WorkspaceVisibilityChangedEvent {
  return {
    eventId: v7(),
    type: WORKSPACE_VISIBILITY_CHANGED_EVENT_TYPE,
    aggregateId: input.workspaceId,
    occurredAt: new Date().toISOString(),
    workspaceId: input.workspaceId,
    accountId: input.accountId,
    fromVisibility: input.fromVisibility,
    toVisibility: input.toVisibility,
  };
}
````

## File: modules/workspace/domain/factories/WorkspaceFactory.ts
````typescript
import {
  Workspace,
  type CreateWorkspaceCommand,
  type WorkspaceEntity,
} from "../aggregates/Workspace";

export function createWorkspaceAggregate(command: CreateWorkspaceCommand): Workspace {
  return Workspace.create(command);
}

export function reconstituteWorkspaceAggregate(snapshot: WorkspaceEntity): Workspace {
  return Workspace.reconstitute(snapshot);
}

export function toWorkspaceSnapshot(workspace: Workspace): WorkspaceEntity {
  return workspace.toSnapshot();
}
````

## File: modules/workspace/domain/ports/index.ts
````typescript
/**
 * Workspace Ports Surface
 *
 * This folder is the explicit hexagonal port entry for the workspace BC.
 * Keep ports as interfaces only; implementations must stay in infrastructure/.
 */

// Driven ports (domain/application core -> outside)
export type { WorkspaceCommandPort } from "./input/WorkspaceCommandPort";
export type {
  WorkspaceQueryPort,
  WorkspaceQuerySubscription,
} from "./input/WorkspaceQueryPort";

export type { WorkspaceRepository } from "./output/WorkspaceRepository";
export type { WorkspaceCapabilityRepository } from "./output/WorkspaceCapabilityRepository";
export type { WorkspaceAccessRepository } from "./output/WorkspaceAccessRepository";
export type { WorkspaceLocationRepository } from "./output/WorkspaceLocationRepository";
export type {
  WorkspaceQueryRepository,
  Unsubscribe as WorkspaceQueryUnsubscribe,
} from "./output/WorkspaceQueryRepository";
export type { WikiWorkspaceRepository } from "./output/WikiWorkspaceRepository";

// Domain event publishing port
export type {
  WorkspaceDomainEventPublisher,
  WorkspaceEventPublishMetadata,
} from "./output/WorkspaceDomainEventPublisher";
````

## File: modules/workspace/domain/ports/input/WorkspaceCommandPort.ts
````typescript
import type { CommandResult } from "@shared-types";

import type {
  Capability,
  CreateWorkspaceCommand,
  UpdateWorkspaceSettingsCommand,
  WorkspaceGrant,
  WorkspaceLocation,
} from "../../aggregates/Workspace";

export interface WorkspaceCommandPort {
  createWorkspace(command: CreateWorkspaceCommand): Promise<CommandResult>;
  createWorkspaceWithCapabilities(
    command: CreateWorkspaceCommand,
    capabilities: Capability[],
  ): Promise<CommandResult>;
  updateWorkspaceSettings(command: UpdateWorkspaceSettingsCommand): Promise<CommandResult>;
  deleteWorkspace(workspaceId: string): Promise<CommandResult>;
  mountCapabilities(workspaceId: string, capabilities: Capability[]): Promise<CommandResult>;
  authorizeWorkspaceTeam(workspaceId: string, teamId: string): Promise<CommandResult>;
  grantIndividualWorkspaceAccess(
    workspaceId: string,
    grant: WorkspaceGrant,
  ): Promise<CommandResult>;
  createWorkspaceLocation(
    workspaceId: string,
    location: Omit<WorkspaceLocation, "locationId">,
  ): Promise<CommandResult>;
}
````

## File: modules/workspace/domain/ports/input/WorkspaceQueryPort.ts
````typescript
import type { WorkspaceEntity } from "../../aggregates/Workspace";
import type { WorkspaceMemberView } from "../../entities/WorkspaceMemberView";
import type {
  WikiAccountContentNode,
  WikiAccountSeed,
} from "../../entities/WikiContentTree";

export type WorkspaceQuerySubscription = () => void;

export interface WorkspaceQueryPort {
  getWorkspacesForAccount(accountId: string): Promise<WorkspaceEntity[]>;
  subscribeToWorkspacesForAccount(
    accountId: string,
    onUpdate: (workspaces: WorkspaceEntity[]) => void,
  ): WorkspaceQuerySubscription;
  getWorkspaceById(workspaceId: string): Promise<WorkspaceEntity | null>;
  getWorkspaceByIdForAccount(
    accountId: string,
    workspaceId: string,
  ): Promise<WorkspaceEntity | null>;
  getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMemberView[]>;
  buildWikiContentTree(seeds: WikiAccountSeed[]): Promise<WikiAccountContentNode[]>;
}
````

## File: modules/workspace/domain/ports/output/WikiWorkspaceRepository.ts
````typescript
/**
 * Module: workspace
 * Layer: ports/output
 * Purpose: Repository port for fetching workspace refs used by the
 *          Wiki content-tree use-case.
 */

import type { WikiWorkspaceRef } from "../../entities/WikiContentTree";

export interface WikiWorkspaceRepository {
  listByAccountId(accountId: string): Promise<WikiWorkspaceRef[]>;
}
````

## File: modules/workspace/domain/ports/output/WorkspaceAccessRepository.ts
````typescript
import type { WorkspaceGrant } from "../../aggregates/Workspace";

export interface WorkspaceAccessRepository {
  grantTeamAccess(workspaceId: string, teamId: string): Promise<void>;
  revokeTeamAccess(workspaceId: string, teamId: string): Promise<void>;
  grantIndividualAccess(workspaceId: string, grant: WorkspaceGrant): Promise<void>;
  revokeIndividualAccess(workspaceId: string, userId: string): Promise<void>;
}
````

## File: modules/workspace/domain/ports/output/WorkspaceCapabilityRepository.ts
````typescript
import type { Capability } from "../../aggregates/Workspace";

export interface WorkspaceCapabilityRepository {
  mountCapabilities(workspaceId: string, capabilities: Capability[]): Promise<void>;
  unmountCapability(workspaceId: string, capabilityId: string): Promise<void>;
}
````

## File: modules/workspace/domain/ports/output/WorkspaceDomainEventPublisher.ts
````typescript
import type { WorkspaceDomainEvent } from "../../events/workspace.events";

export interface WorkspaceEventPublishMetadata {
  readonly workspaceId?: string;
  readonly organizationId?: string;
}

export interface WorkspaceDomainEventPublisher {
  publish(
    event: WorkspaceDomainEvent,
    metadata?: WorkspaceEventPublishMetadata,
  ): Promise<void>;
}
````

## File: modules/workspace/domain/ports/output/WorkspaceLocationRepository.ts
````typescript
import type { WorkspaceLocation } from "../../aggregates/Workspace";

export interface WorkspaceLocationRepository {
  createLocation(workspaceId: string, location: Omit<WorkspaceLocation, "locationId">): Promise<string>;
  updateLocation(workspaceId: string, location: WorkspaceLocation): Promise<void>;
  deleteLocation(workspaceId: string, locationId: string): Promise<void>;
}
````

## File: modules/workspace/domain/ports/output/WorkspaceQueryRepository.ts
````typescript
/**
 * WorkspaceQueryRepository — Port for workspace read projections.
 */

import type { WorkspaceMemberView } from "../../entities/WorkspaceMemberView";
import type { WorkspaceEntity } from "../../aggregates/Workspace";

export type Unsubscribe = () => void;

export interface WorkspaceQueryRepository {
  subscribeToWorkspacesForAccount(
    accountId: string,
    onUpdate: (workspaces: WorkspaceEntity[]) => void,
  ): Unsubscribe;
  getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMemberView[]>;
}
````

## File: modules/workspace/domain/ports/output/WorkspaceRepository.ts
````typescript
/**
 * WorkspaceRepository — Port for workspace persistence.
 */

import type {
  WorkspaceEntity,
  UpdateWorkspaceSettingsCommand,
} from "../../aggregates/Workspace";

export interface WorkspaceRepository {
  findById(id: string): Promise<WorkspaceEntity | null>;
  findByIdForAccount(accountId: string, workspaceId: string): Promise<WorkspaceEntity | null>;
  findAllByAccountId(accountId: string): Promise<WorkspaceEntity[]>;
  save(workspace: WorkspaceEntity): Promise<string>;
  updateSettings(command: UpdateWorkspaceSettingsCommand): Promise<void>;
  delete(id: string): Promise<void>;
}
````

## File: modules/workspace/domain/value-objects/Address.ts
````typescript
import { z } from "@lib-zod";

export const AddressSchema = z
  .object({
    street: z.string().trim(),
    city: z.string().trim(),
    state: z.string().trim(),
    postalCode: z.string().trim(),
    country: z.string().trim(),
    details: z.string().trim().optional(),
  })
  .brand<"Address">();

export type Address = z.infer<typeof AddressSchema>;
export type AddressInput = z.input<typeof AddressSchema>;

export function createAddress(value: AddressInput): Address {
  const parsed = AddressSchema.parse(value);
  return Object.freeze({ ...parsed }) as Address;
}

export function formatAddress(address: Address): string[] {
  return [
    address.street,
    [address.city, address.state, address.postalCode].filter(Boolean).join(", "),
    address.country,
    address.details,
  ].filter((line): line is string => Boolean(line));
}
````

## File: modules/workspace/domain/value-objects/index.ts
````typescript
export type {
  Address,
  AddressInput,
} from "./Address";
export {
  AddressSchema,
  createAddress,
  formatAddress,
} from "./Address";

export type {
  WorkspaceLifecycleState,
  WorkspaceLifecycleStateInput,
} from "./WorkspaceLifecycleState";
export {
  WORKSPACE_LIFECYCLE_STATES,
  WorkspaceLifecycleStateSchema,
  canTransitionWorkspaceLifecycleState,
  createWorkspaceLifecycleState,
  isTerminalWorkspaceLifecycleState,
} from "./WorkspaceLifecycleState";

export type {
  WorkspaceName,
  WorkspaceNameInput,
} from "./WorkspaceName";
export {
  WorkspaceNameSchema,
  createWorkspaceName,
  workspaceNameEquals,
} from "./WorkspaceName";

export type {
  WorkspaceVisibility,
  WorkspaceVisibilityInput,
} from "./WorkspaceVisibility";
export {
  WORKSPACE_VISIBILITIES,
  WorkspaceVisibilitySchema,
  createWorkspaceVisibility,
  isWorkspaceVisible,
} from "./WorkspaceVisibility";
````

## File: modules/workspace/domain/value-objects/workspace-value-objects.test.ts
````typescript
import { describe, expect, it } from "vitest";

import { createAddress, formatAddress } from "./Address";
import {
  createWorkspaceLifecycleState,
  isTerminalWorkspaceLifecycleState,
} from "./WorkspaceLifecycleState";
import { createWorkspaceName } from "./WorkspaceName";
import { createWorkspaceVisibility } from "./WorkspaceVisibility";

describe("workspace value objects", () => {
  it("normalizes and validates workspace names", () => {
    expect(createWorkspaceName("  Demo Workspace  ")).toBe("Demo Workspace");
    expect(() => createWorkspaceName("   ")).toThrow();
  });

  it("accepts only supported lifecycle states", () => {
    expect(createWorkspaceLifecycleState("active")).toBe("active");
    expect(isTerminalWorkspaceLifecycleState("stopped")).toBe(true);
    expect(() => createWorkspaceLifecycleState("archived" as never)).toThrow();
  });

  it("accepts only supported visibility values", () => {
    expect(createWorkspaceVisibility("visible")).toBe("visible");
    expect(() => createWorkspaceVisibility("private" as never)).toThrow();
  });

  it("creates frozen address snapshots and formats lines", () => {
    const address = createAddress({
      street: " 1 Infinite Loop ",
      city: "Cupertino",
      state: "CA",
      postalCode: "95014",
      country: "USA",
      details: "  Building A ",
    });

    expect(Object.isFrozen(address)).toBe(true);
    expect(formatAddress(address)).toEqual([
      "1 Infinite Loop",
      "Cupertino, CA, 95014",
      "USA",
      "Building A",
    ]);
  });
});
````

## File: modules/workspace/domain/value-objects/WorkspaceLifecycleState.ts
````typescript
import { z } from "@lib-zod";

export const WORKSPACE_LIFECYCLE_STATES = [
  "preparatory",
  "active",
  "stopped",
] as const;

export const WorkspaceLifecycleStateSchema = z.enum(WORKSPACE_LIFECYCLE_STATES);

export type WorkspaceLifecycleState = z.infer<typeof WorkspaceLifecycleStateSchema>;
export type WorkspaceLifecycleStateInput = z.input<typeof WorkspaceLifecycleStateSchema>;

const WORKSPACE_LIFECYCLE_NEXT: Readonly<
  Record<WorkspaceLifecycleState, WorkspaceLifecycleState | null>
> = {
  preparatory: "active",
  active: "stopped",
  stopped: null,
};

export function createWorkspaceLifecycleState(
  value: WorkspaceLifecycleStateInput,
): WorkspaceLifecycleState {
  return WorkspaceLifecycleStateSchema.parse(value);
}

export function canTransitionWorkspaceLifecycleState(
  from: WorkspaceLifecycleState,
  to: WorkspaceLifecycleState,
): boolean {
  return WORKSPACE_LIFECYCLE_NEXT[from] === to;
}

export function isTerminalWorkspaceLifecycleState(
  state: WorkspaceLifecycleState,
): boolean {
  return WORKSPACE_LIFECYCLE_NEXT[state] === null;
}
````

## File: modules/workspace/domain/value-objects/WorkspaceName.ts
````typescript
import { z } from "@lib-zod";

export const WorkspaceNameSchema = z
  .string()
  .trim()
  .min(1, "Workspace name is required")
  .max(80, "Workspace name must be 80 characters or less")
  .brand<"WorkspaceName">();

export type WorkspaceName = z.infer<typeof WorkspaceNameSchema>;
export type WorkspaceNameInput = z.input<typeof WorkspaceNameSchema>;

export function createWorkspaceName(value: WorkspaceNameInput): WorkspaceName {
  return WorkspaceNameSchema.parse(value);
}

export function workspaceNameEquals(left: WorkspaceName, right: WorkspaceName): boolean {
  return left === right;
}
````

## File: modules/workspace/domain/value-objects/WorkspaceVisibility.ts
````typescript
import { z } from "@lib-zod";

export const WORKSPACE_VISIBILITIES = ["visible", "hidden"] as const;

export const WorkspaceVisibilitySchema = z.enum(WORKSPACE_VISIBILITIES);

export type WorkspaceVisibility = z.infer<typeof WorkspaceVisibilitySchema>;
export type WorkspaceVisibilityInput = z.input<typeof WorkspaceVisibilitySchema>;

export function createWorkspaceVisibility(
  value: WorkspaceVisibilityInput,
): WorkspaceVisibility {
  return WorkspaceVisibilitySchema.parse(value);
}

export function isWorkspaceVisible(visibility: WorkspaceVisibility): boolean {
  return visibility === "visible";
}
````

## File: modules/workspace/infrastructure/events/SharedWorkspaceDomainEventPublisher.ts
````typescript
import {
  InMemoryEventStoreRepository,
  NoopEventBusRepository,
  PublishDomainEventUseCase,
  QStashEventBusRepository,
} from "@shared-events";
import type {
  WorkspaceDomainEventPublisher,
  WorkspaceEventPublishMetadata,
} from "../../domain/ports/output/WorkspaceDomainEventPublisher";
import type { WorkspaceDomainEvent } from "../../domain/events/workspace.events";

function toEventPayload(event: WorkspaceDomainEvent) {
  const {
    eventId: _eventId,
    type: _type,
    aggregateId: _aggregateId,
    occurredAt: _occurredAt,
    ...payload
  } = event;

  return payload as Record<string, unknown>;
}

export class SharedWorkspaceDomainEventPublisher
  implements WorkspaceDomainEventPublisher
{
  private readonly publishDomainEventUseCase: PublishDomainEventUseCase;

  constructor() {
    const eventBus = process.env.QSTASH_TOKEN
      ? new QStashEventBusRepository()
      : new NoopEventBusRepository();

    this.publishDomainEventUseCase = new PublishDomainEventUseCase(
      new InMemoryEventStoreRepository(),
      eventBus,
    );
  }

  async publish(
    event: WorkspaceDomainEvent,
    metadata?: WorkspaceEventPublishMetadata,
  ): Promise<void> {
    try {
      await this.publishDomainEventUseCase.execute({
        id: event.eventId,
        eventName: event.type,
        aggregateType: "Workspace",
        aggregateId: event.aggregateId,
        occurredAt: new Date(event.occurredAt),
        payload: toEventPayload(event),
        metadata,
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[workspace.events] Failed to publish workspace domain event:", error);
      }
    }
  }
}
````

## File: modules/workspace/infrastructure/firebase/FirebaseWikiWorkspaceRepository.ts
````typescript
import { FirebaseWorkspaceRepository } from "./FirebaseWorkspaceRepository";

import type { WikiWorkspaceRepository } from "../../domain/ports/output/WikiWorkspaceRepository";
import type { WikiWorkspaceRef } from "../../domain/entities/WikiContentTree";

const workspaceRepo = new FirebaseWorkspaceRepository();

export class FirebaseWikiWorkspaceRepository implements WikiWorkspaceRepository {
  async listByAccountId(accountId: string): Promise<WikiWorkspaceRef[]> {
    const workspaces = await workspaceRepo.findAllByAccountId(accountId);
    return workspaces.map((workspace) => ({
      id: workspace.id,
      name: workspace.name,
    }));
  }
}
````

## File: modules/workspace/interfaces/api/contracts/index.ts
````typescript
/**
 * workspace API contracts.
 *
 * Pure public type/contracts surface for cross-module and adapter consumption.
 */

export * from "./workspace.contract";
export * from "./workspace-member.contract";
export * from "./wiki-content.contract";
````

## File: modules/workspace/interfaces/api/contracts/wiki-content.contract.ts
````typescript
export type {
  WikiAccountContentNode,
  WikiAccountSeed,
  WikiAccountType,
  WikiContentItemNode,
  WikiWorkspaceContentNode,
  WikiWorkspaceRef,
} from "../../../application/dtos/wiki-content-tree.dto";
````

## File: modules/workspace/interfaces/api/contracts/workspace-member.contract.ts
````typescript
export type {
  WorkspaceMemberAccessChannel,
  WorkspaceMemberAccessSource,
  WorkspaceMemberPresence,
  WorkspaceMemberView,
} from "../../../application/dtos/workspace-member-view.dto";
````

## File: modules/workspace/interfaces/api/contracts/workspace.contract.ts
````typescript
export type {
  Address,
  AddressInput,
  Capability,
  CapabilitySpec,
  CreateWorkspaceCommand,
  UpdateWorkspaceSettingsCommand,
  WorkspaceEntity,
  WorkspaceGrant,
  WorkspaceLifecycleState,
  WorkspaceLifecycleStateInput,
  WorkspaceLocation,
  WorkspaceName,
  WorkspaceNameInput,
  WorkspacePersonnel,
  WorkspacePersonnelCustomRole,
  WorkspaceVisibility,
  WorkspaceVisibilityInput,
} from "../../../application/dtos/workspace-interfaces.dto";

export {
  WORKSPACE_LIFECYCLE_STATES,
  WORKSPACE_VISIBILITIES,
  createAddress,
  createWorkspaceLifecycleState,
  createWorkspaceName,
  createWorkspaceVisibility,
  formatAddress,
  isTerminalWorkspaceLifecycleState,
  isWorkspaceVisible,
  workspaceNameEquals,
} from "../../../application/dtos/workspace-interfaces.dto";

export type {
  WorkspaceCreatedEvent,
  WorkspaceDomainEvent,
  WorkspaceLifecycleTransitionedEvent,
  WorkspaceVisibilityChangedEvent,
} from "../../../application/dtos/workspace-interfaces.dto";

export {
  WORKSPACE_CREATED_EVENT_TYPE,
  WORKSPACE_LIFECYCLE_TRANSITIONED_EVENT_TYPE,
  WORKSPACE_VISIBILITY_CHANGED_EVENT_TYPE,
  createWorkspaceCreatedEvent,
  createWorkspaceLifecycleTransitionedEvent,
  createWorkspaceVisibilityChangedEvent,
} from "../../../application/dtos/workspace-interfaces.dto";
````

## File: modules/workspace/interfaces/api/facades/index.ts
````typescript
/**
 * workspace API facade.
 *
 * Public behavior entrypoints (commands/queries) exposed to callers.
 */

export * from "./workspace.facade";
export * from "./workspace-member.facade";
````

## File: modules/workspace/interfaces/api/facades/workspace-member.facade.ts
````typescript
import type { WorkspaceMemberView } from "../contracts";
import { getWorkspaceMembers as getWorkspaceMembersQuery } from "../queries/workspace-member.query";

export async function getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMemberView[]> {
	return getWorkspaceMembersQuery(workspaceId);
}
````

## File: modules/workspace/interfaces/api/facades/workspace.facade.ts
````typescript
import type {
  WikiAccountContentNode,
  WikiAccountSeed,
  WorkspaceEntity,
} from "../contracts";
import {
  getWorkspaceById as getWorkspaceByIdQuery,
  getWorkspaceByIdForAccount as getWorkspaceByIdForAccountQuery,
  getWorkspacesForAccount as getWorkspacesForAccountQuery,
  subscribeToWorkspacesForAccount as subscribeToWorkspacesForAccountQuery,
} from "../queries/workspace.query";
import { buildWikiContentTree as buildWikiContentTreeQuery } from "../queries/wiki-content-tree.query";

export async function getWorkspacesForAccount(accountId: string): Promise<WorkspaceEntity[]> {
  return getWorkspacesForAccountQuery(accountId);
}

export function subscribeToWorkspacesForAccount(
  accountId: string,
  onUpdate: (workspaces: WorkspaceEntity[]) => void,
) {
  return subscribeToWorkspacesForAccountQuery(accountId, onUpdate);
}

export async function getWorkspaceById(workspaceId: string): Promise<WorkspaceEntity | null> {
  return getWorkspaceByIdQuery(workspaceId);
}

export async function getWorkspaceByIdForAccount(
  accountId: string,
  workspaceId: string,
): Promise<WorkspaceEntity | null> {
  return getWorkspaceByIdForAccountQuery(accountId, workspaceId);
}

export function buildWikiContentTree(
  seeds: WikiAccountSeed[],
): Promise<WikiAccountContentNode[]> {
  return buildWikiContentTreeQuery(seeds);
}

export {
  authorizeWorkspaceTeam,
  createWorkspace,
  createWorkspaceLocation,
  createWorkspaceWithCapabilities,
  deleteWorkspace,
  grantIndividualWorkspaceAccess,
  mountCapabilities,
  updateWorkspaceSettings,
} from "../actions/workspace.command";
````

## File: modules/workspace/interfaces/api/index.ts
````typescript
/**
 * workspace interfaces/api aggregate export.
 *
 * Public API boundary for contracts, facades, queries, actions, and runtime.
 * App-layer and cross-module consumers should import from this path for
 * domain contracts, facades, and server-side query/command surfaces.
 *
 * For web UI components, hooks, and navigation helpers, use
 * modules/workspace/interfaces/web instead.
 */

export * from "./contracts";
export * from "./facades";
````

## File: modules/workspace/interfaces/api/queries/wiki-content-tree.query.ts
````typescript
import type {
  WikiAccountContentNode,
  WikiAccountSeed,
} from "../contracts";
import { workspaceQueryPort } from "../runtime";

export function buildWikiContentTree(
  seeds: WikiAccountSeed[],
): Promise<WikiAccountContentNode[]> {
  return workspaceQueryPort.buildWikiContentTree(seeds);
}
````

## File: modules/workspace/interfaces/api/queries/workspace-member.query.ts
````typescript
import type { WorkspaceMemberView } from "../contracts";
import { workspaceQueryPort } from "../runtime";

export async function getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMemberView[]> {
  const normalizedWorkspaceId = workspaceId.trim();
  if (!normalizedWorkspaceId) {
    return [];
  }

  return workspaceQueryPort.getWorkspaceMembers(normalizedWorkspaceId);
}
````

## File: modules/workspace/interfaces/api/queries/workspace.query.ts
````typescript
/**
 * Workspace Read Queries — thin wrappers exposing read operations through the input port.
 */

import type { WorkspaceEntity } from "../contracts";
import { workspaceQueryPort } from "../runtime";

export async function getWorkspacesForAccount(accountId: string): Promise<WorkspaceEntity[]> {
  return workspaceQueryPort.getWorkspacesForAccount(accountId);
}

export function subscribeToWorkspacesForAccount(
  accountId: string,
  onUpdate: (workspaces: WorkspaceEntity[]) => void,
) {
  return workspaceQueryPort.subscribeToWorkspacesForAccount(accountId, onUpdate);
}

export async function getWorkspaceById(workspaceId: string): Promise<WorkspaceEntity | null> {
  return workspaceQueryPort.getWorkspaceById(workspaceId);
}

export async function getWorkspaceByIdForAccount(
  accountId: string,
  workspaceId: string,
): Promise<WorkspaceEntity | null> {
  return workspaceQueryPort.getWorkspaceByIdForAccount(accountId, workspaceId);
}
````

## File: modules/workspace/interfaces/api/runtime/index.ts
````typescript
export * from "./workspace-runtime";
export * from "./workspace-session-context";
````

## File: modules/workspace/interfaces/api/runtime/workspace-runtime.ts
````typescript
import { WorkspaceCommandApplicationService } from "../../../application/services/WorkspaceCommandApplicationService";
import { WorkspaceQueryApplicationService } from "../../../application/services/WorkspaceQueryApplicationService";
import {
  makeWikiWorkspaceRepo,
  makeWorkspaceDomainEventPublisher,
  makeWorkspaceQueryRepo,
  makeWorkspaceRepo,
} from "../../../api/runtime/factories";
import type { WorkspaceCommandPort } from "../../../application/dtos/workspace-interfaces.dto";
import type { WorkspaceQueryPort } from "../../../application/dtos/workspace-interfaces.dto";
import { createWorkspaceSessionContext } from "./workspace-session-context";

let _sessionContext: ReturnType<typeof createWorkspaceSessionContext> | undefined;

function getSessionContext() {
  if (!_sessionContext) {
    // Lazy-load the organization query functions to break the circular module
    // evaluation chain: workspace-runtime → platform/api → organization/interfaces
    // → organization/api → workspace (via barrel re-exports).
    //
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const platformApi = require("@/modules/platform/api");

    const workspaceRepo = makeWorkspaceRepo();
    const workspaceQueryRepo = makeWorkspaceQueryRepo({
      getOrganizationMembers: platformApi.getOrganizationMembers,
      getOrganizationTeams: platformApi.getOrganizationTeams,
    });
    const wikiWorkspaceRepo = makeWikiWorkspaceRepo();
    const workspaceDomainEventPublisher = makeWorkspaceDomainEventPublisher();

    const commandPort: WorkspaceCommandPort = new WorkspaceCommandApplicationService({
      workspaceRepo,
      workspaceCapabilityRepo: workspaceRepo,
      workspaceAccessRepo: workspaceRepo,
      workspaceLocationRepo: workspaceRepo,
      workspaceDomainEventPublisher,
    });

    const queryPort: WorkspaceQueryPort = new WorkspaceQueryApplicationService({
      workspaceRepo,
      workspaceQueryRepo,
      wikiWorkspaceRepo,
    });

    _sessionContext = createWorkspaceSessionContext(commandPort, queryPort);
  }
  return _sessionContext;
}

/**
 * Lazy-initialized workspace ports.
 * Proxy objects defer all property access until first actual use, breaking
 * the circular module-evaluation chain at build time while preserving the
 * same public API as the previous eager singletons.
 */
export const workspaceSessionContext = new Proxy(
  {} as ReturnType<typeof createWorkspaceSessionContext>,
  { get: (_target, prop) => getSessionContext()[prop as keyof ReturnType<typeof createWorkspaceSessionContext>] },
);

export const workspaceCommandPort: WorkspaceCommandPort = new Proxy(
  {} as WorkspaceCommandPort,
  { get: (_target, prop) => getSessionContext().workspaceCommandPort[prop as keyof WorkspaceCommandPort] },
);

export const workspaceQueryPort: WorkspaceQueryPort = new Proxy(
  {} as WorkspaceQueryPort,
  { get: (_target, prop) => getSessionContext().workspaceQueryPort[prop as keyof WorkspaceQueryPort] },
);
````

## File: modules/workspace/interfaces/api/runtime/workspace-session-context.ts
````typescript
import type { WorkspaceCommandPort } from "../../../application/dtos/workspace-interfaces.dto";
import type { WorkspaceQueryPort } from "../../../application/dtos/workspace-interfaces.dto";

export interface WorkspaceSessionContext {
  readonly workspaceCommandPort: WorkspaceCommandPort;
  readonly workspaceQueryPort: WorkspaceQueryPort;
}

export function createWorkspaceSessionContext(
  workspaceCommandPort: WorkspaceCommandPort,
  workspaceQueryPort: WorkspaceQueryPort,
): WorkspaceSessionContext {
  return {
    workspaceCommandPort,
    workspaceQueryPort,
  };
}
````

## File: modules/workspace/interfaces/interfaces.instructions.md
````markdown
---
description: 'Workspace interfaces layer rules: input/output translation, Server Actions, workspace UI components, hooks, view-models, and session state wiring.'
applyTo: 'modules/workspace/interfaces/**/*.{ts,tsx}'
---

# Workspace Interfaces Layer (Local)

Use this file as execution guardrails for `modules/workspace/interfaces/*`.
For full reference, align with `.github/instructions/nextjs-server-actions.instructions.md`, `.github/instructions/shadcn-ui.instructions.md`, and `docs/contexts/workspace/*`.

## Core Rules

- This layer owns **input/output translation only** — no workspace lifecycle rules, no capability policy.
- Server Actions (`interfaces/api/actions/`) must be thin: validate input, call the application service, return a stable result shape.
- Never call repositories directly from components, hooks, or actions.
- View-models (`view-models/`) translate DTOs into UI-specific shapes — keep them in `interfaces/`, not in `application/`.
- Session state (`state/workspace-session.ts`, `state/workspace-settings.ts`) is UI state only; do not persist domain decisions here.
- `interfaces/api/` exposes tRPC facades and query handlers for workspace — keep route and action wiring separate from business logic.
- Use shadcn/ui primitives before creating new components; maintain semantic markup and accessibility.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
#use skill next-devtools-mcp
#use skill vercel-react-best-practices
````

## File: modules/workspace/interfaces/web/components/cards/WorkspaceContextCard.tsx
````typescript
"use client";

/**
 * WorkspaceContextCard
 * Purpose: display the active workspace context in notebook/ai-chat sidebar.
 * Shows workspace name + navigation links when a workspace is active,
 * otherwise shows an empty-state hint.
 */

import Link from "next/link";
import { FolderKanban } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import type { WorkspaceEntity } from "../../../api/contracts";

interface WorkspaceContextCardProps {
  readonly workspace: WorkspaceEntity | null;
}

export function WorkspaceContextCard({ workspace }: WorkspaceContextCardProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <FolderKanban className="size-4 text-primary" />
          Workspace context
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        {workspace ? (
          <>
            <div>
              <p className="font-medium text-foreground">{workspace.name}</p>
              <p className="mt-1 text-xs">
                Notebook 會優先消費這個工作區的 Knowledge、知識頁面與 RAG Query 結果。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/workspace/${workspace.id}`}>Workspace</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href={`/knowledge/pages?workspaceId=${encodeURIComponent(workspace.id)}`}>知識頁面</Link>
              </Button>
            </div>
          </>
        ) : (
          <p className="text-xs">
            尚未帶入工作區。建議從 Workspace Hub 或工作區頁面進入，讓 Notebook 綁定知識上下文。
          </p>
        )}
      </CardContent>
    </Card>
  );
}
````

## File: modules/workspace/interfaces/web/components/cards/WorkspaceInformationCard.tsx
````typescript
"use client";

import type { ReactNode } from "react";

import { Badge } from "@ui-shadcn/ui/badge";

export interface WorkspaceInformationRoleItem {
  readonly id: string;
  readonly roleName: ReactNode;
  readonly roleValue: ReactNode;
  readonly roleActions?: ReactNode;
}

interface WorkspaceInformationCardProps {
  readonly workspaceName: ReactNode;
  readonly workspaceAddress: ReactNode;
  readonly workspaceRoles: WorkspaceInformationRoleItem[];
  readonly rolesAction?: ReactNode;
  readonly emptyRolesState?: ReactNode;
  readonly className?: string;
}

export function WorkspaceInformationCard({
  workspaceName,
  workspaceAddress,
  workspaceRoles,
  rolesAction,
  emptyRolesState,
  className,
}: WorkspaceInformationCardProps) {
  return (
    <div className={["space-y-6", className].filter(Boolean).join(" ")}>
      <section className="space-y-2">
        <p className="text-sm font-medium text-foreground">工作區名稱</p>
        <div className="rounded-xl border border-border/40 bg-card/70 p-4 shadow-sm">
          {workspaceName}
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-sm font-medium text-foreground">工作區地址</p>
        <div className="rounded-xl border border-border/40 bg-card/70 p-4 shadow-sm">
          {workspaceAddress}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">工作區角色</p>
            <Badge variant="secondary">{workspaceRoles.length}</Badge>
          </div>
          {rolesAction}
        </div>

        <div className="space-y-3 rounded-xl border border-border/40 bg-card/70 p-4 shadow-sm">
          {workspaceRoles.length > 0 ? (
            workspaceRoles.map((item) => (
              <div
                key={item.id}
                className="grid gap-3 rounded-lg border border-border/30 bg-background/80 p-3 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)_auto]"
              >
                <div className="min-w-0 space-y-1.5">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    角色名稱
                  </p>
                  <div className="min-w-0">{item.roleName}</div>
                </div>

                <div className="min-w-0 space-y-1.5">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    角色
                  </p>
                  <div className="min-w-0">{item.roleValue}</div>
                </div>

                {item.roleActions ? (
                  <div className="flex items-start justify-end">{item.roleActions}</div>
                ) : null}
              </div>
            ))
          ) : (
            emptyRolesState ?? (
              <p className="text-sm text-muted-foreground">尚未設定任何工作區角色。</p>
            )
          )}
        </div>
      </section>
    </div>
  );
}
````

## File: modules/workspace/interfaces/web/components/cards/WorkspaceOverviewSummaryCard.tsx
````typescript
"use client";

import type { WorkspaceEntity } from "../../../api/contracts";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@ui-shadcn/ui/avatar";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent } from "@ui-shadcn/ui/card";

import {
  formatTimestamp,
  getWorkspaceInitials,
  lifecycleBadgeVariant,
} from "../layout/workspace-detail-helpers";
import { getWorkspaceGovernanceSummary } from "../../view-models/workspace-supporting-records";

interface WorkspaceOverviewSummaryCardProps {
  readonly workspace: WorkspaceEntity;
  readonly activeWorkspaceId: string | null | undefined;
  readonly onEditClick: () => void;
  readonly onSetActiveWorkspace: () => void;
}

export function WorkspaceOverviewSummaryCard({
  workspace,
  activeWorkspaceId,
  onEditClick,
  onSetActiveWorkspace,
}: WorkspaceOverviewSummaryCardProps) {
  const governanceSummary = getWorkspaceGovernanceSummary(workspace);

  return (
    <Card className="border border-border/50">
      <CardContent className="flex flex-col gap-6 px-6 py-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <Avatar size="lg">
            <AvatarImage src={workspace.photoURL} alt={workspace.name} />
            <AvatarFallback>{getWorkspaceInitials(workspace.name)}</AvatarFallback>
          </Avatar>

          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-2xl font-semibold tracking-tight">{workspace.name}</p>
              <p className="text-sm text-muted-foreground">
                {workspace.accountType === "organization" ? "Organization" : "Personal"} workspace ·
                account {workspace.accountId}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={lifecycleBadgeVariant[workspace.lifecycleState]}>
                {workspace.lifecycleState}
              </Badge>
              <Badge variant="outline">{workspace.visibility}</Badge>
              <Badge variant="outline">Created {formatTimestamp(workspace.createdAt)}</Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onEditClick}>
                編輯工作區
              </Button>
              {activeWorkspaceId !== workspace.id && (
                <Button type="button" variant="default" size="sm" onClick={onSetActiveWorkspace}>
                  設為目前工作區
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[20rem]">
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Capabilities</p>
            <p className="mt-1 text-xl font-semibold">{governanceSummary.capabilityCount}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Teams</p>
            <p className="mt-1 text-xl font-semibold">{governanceSummary.teamCount}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Locations</p>
            <p className="mt-1 text-xl font-semibold">{governanceSummary.locationCount}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Grants</p>
            <p className="mt-1 text-xl font-semibold">{governanceSummary.grantCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
````

## File: modules/workspace/interfaces/web/components/cards/WorkspaceProductSpineCard.tsx
````typescript
"use client";

import Link from "next/link";
import type { WorkspaceEntity } from "../../../api/contracts";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { WorkspaceInformationCard } from "./WorkspaceInformationCard";
import {
  getWorkspaceAddressLines,
  getWorkspaceRoleAssignments,
} from "../../view-models/workspace-supporting-records";

interface WorkspaceProductSpineCardProps {
  readonly workspace: WorkspaceEntity;
}

export function WorkspaceProductSpineCard({ workspace }: WorkspaceProductSpineCardProps) {
  const addressLines = getWorkspaceAddressLines(workspace);
  const workspaceRoles = getWorkspaceRoleAssignments(workspace);

  return (
    <Card className="border border-border/50 xl:col-span-2">
      <CardHeader>
        <CardTitle>Workspace Product Spine</CardTitle>
        <CardDescription>
          從這個工作區穩定分流到 Knowledge、知識頁面、Notebook / AI；Search、Source、Sync
          則作為底層支撐能力。
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 xl:grid-cols-[1fr_1fr_1fr_0.9fr]">
        <div className="xl:col-span-4">
          <WorkspaceInformationCard
            workspaceName={<p className="text-sm font-medium text-foreground">{workspace.name}</p>}
            workspaceAddress={
              addressLines.length > 0 ? (
                <div className="space-y-1.5 text-sm text-foreground">
                  {addressLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">尚未設定工作區地址。</p>
              )
            }
            workspaceRoles={
              workspaceRoles.length > 0
                ? workspaceRoles.map((entry) => ({
                    id: entry.id,
                    roleName: <p className="text-sm font-medium text-foreground">{entry.roleName}</p>,
                    roleValue: entry.role ? (
                      <p className="text-sm text-foreground break-all">{entry.role}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">未設定</p>
                    ),
                  }))
                : []
            }
          />
        </div>

        <div className="rounded-xl border border-border/40 px-4 py-4">
          <p className="text-sm font-semibold text-foreground">Knowledge</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            先用文件、來源與資料庫建立工作區知識基底，再讓知識頁面與 AI 消費。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href={`/workspace/${workspace.id}?tab=Files`}>Files 分頁</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border/40 px-4 py-4">
          <p className="text-sm font-semibold text-foreground">Knowledge Pages</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            以工作區知識頁面與文章結構承接知識脈絡，不再透過獨立 Wiki tab 中轉。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href={`/knowledge/pages?workspaceId=${encodeURIComponent(workspace.id)}`}>知識頁面</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={`/knowledge-base/articles?workspaceId=${encodeURIComponent(workspace.id)}`}>
                文章
              </Link>
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border/40 px-4 py-4">
          <p className="text-sm font-semibold text-foreground">Notebook / AI</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            用 AI 對話與 RAG 查詢消費這個工作區的知識，不再把 AI 當成獨立產品島。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href={`/ai-chat?workspaceId=${encodeURIComponent(workspace.id)}`}>AI 對話</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={`/notebook/rag-query?workspaceId=${encodeURIComponent(workspace.id)}`}>
                RAG Query
              </Link>
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-border/50 px-4 py-4">
          <p className="text-sm font-semibold text-foreground">Supporting layers</p>
          <ul className="mt-2 space-y-2 text-xs leading-relaxed text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Search</span>：用 RAG Query 承接查詢、引用與回答。
            </li>
            <li>
              <span className="font-medium text-foreground">Source</span>：Files / Documents
              是來源接入與 metadata 宿主。
            </li>
            <li>
              <span className="font-medium text-foreground">Sync</span>：upload → ingest → index 流程持續把來源同步成可查詢知識。
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
````

## File: modules/workspace/interfaces/web/components/cards/WorkspaceQuickstartCard.tsx
````typescript
"use client";

import Link from "next/link";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";

interface WorkspaceQuickstartCardProps {
  readonly workspaceId: string;
}

export function WorkspaceQuickstartCard({ workspaceId }: WorkspaceQuickstartCardProps) {
  return (
    <Card className="border border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle>🚀 開始使用這個工作區</CardTitle>
        <CardDescription>完成以下步驟，讓工作區進入運作狀態。</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border/40 px-4 py-4">
          <p className="text-sm font-semibold">Step 1 · 上傳文件</p>
          <p className="mt-1 text-xs text-muted-foreground">
            先把原始文件上傳到 Files 分頁，作為知識基底。
          </p>
          <Button asChild size="sm" variant="outline" className="mt-3">
            <Link href={`/workspace/${workspaceId}?tab=Files`}>前往 Files</Link>
          </Button>
        </div>
        <div className="rounded-xl border border-border/40 px-4 py-4">
          <p className="text-sm font-semibold">Step 2 · 建立頁面</p>
          <p className="mt-1 text-xs text-muted-foreground">
            直接在工作區知識頁面建立第一個頁面，整理結構。
          </p>
          <Button asChild size="sm" variant="outline" className="mt-3">
            <Link href={`/knowledge/pages?workspaceId=${encodeURIComponent(workspaceId)}`}>前往知識頁面</Link>
          </Button>
        </div>
        <div className="rounded-xl border border-border/40 px-4 py-4">
          <p className="text-sm font-semibold">Step 3 · AI 查詢</p>
          <p className="mt-1 text-xs text-muted-foreground">
            用 RAG Query 對工作區知識提問，驗證內容可被檢索。
          </p>
          <Button asChild size="sm" variant="outline" className="mt-3">
            <Link href={`/notebook/rag-query?workspaceId=${encodeURIComponent(workspaceId)}`}>
              前往 RAG Query
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
````

## File: modules/workspace/interfaces/web/components/dialogs/CreateWorkspaceDialog.tsx
````typescript
"use client";

import { type FormEvent } from "react";

import { Button } from "@ui-shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";

interface CreateWorkspaceDialogProps {
  readonly open: boolean;
  readonly workspaceName: string;
  readonly createError: string | null;
  readonly isCreatingWorkspace: boolean;
  readonly accountId: string | null | undefined;
  readonly onOpenChange: (open: boolean) => void;
  readonly onWorkspaceNameChange: (name: string) => void;
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function CreateWorkspaceDialog({
  open,
  workspaceName,
  createError,
  isCreatingWorkspace,
  accountId,
  onOpenChange,
  onWorkspaceNameChange,
  onSubmit,
}: CreateWorkspaceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="create-workspace-description">
        <DialogHeader>
          <DialogTitle>建立工作區</DialogTitle>
          <DialogDescription id="create-workspace-description">
            建立後會直接出現在目前帳號的工作區清單中。
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="workspace-name"
            >
              工作區名稱
            </label>
            <Input
              id="workspace-name"
              value={workspaceName}
              onChange={(event) => onWorkspaceNameChange(event.target.value)}
              placeholder="例如：北區營運中心"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              disabled={isCreatingWorkspace}
              maxLength={80}
            />
            {createError && (
              <p className="text-sm text-destructive">{createError}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isCreatingWorkspace}
            >
              取消
            </Button>
            <Button type="submit" disabled={isCreatingWorkspace || !accountId}>
              {isCreatingWorkspace ? "建立中…" : "直接建立"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
````

## File: modules/workspace/interfaces/web/components/dialogs/CustomizeNavigationDialog.tsx
````typescript
"use client";

/**
 * CustomizeNavigationDialog – workspace interfaces/web component.
 * Lets users pick which nav items stay pinned in the secondary sidebar.
 */

import { useMemo, useState, useEffect } from "react";

import { reorder, type Edge } from "@lib-dragdrop";

import { Button } from "@ui-shadcn/ui/button";
import { Checkbox } from "@ui-shadcn/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { Separator } from "@ui-shadcn/ui/separator";

import { CheckRow, WorkspaceCheckRow } from "./NavCheckRow";
import { type WorkspaceNavItem, WORKSPACE_NAV_ITEMS } from "../../navigation/workspace-nav-items";
import {
  DIALOG_TEXT,
  ORGANIZATION_NAV_ITEMS,
  PERSONAL_ITEMS,
  readNavPreferences,
  writeNavPreferences,
  type NavPreferences,
  type SidebarLocaleBundle,
} from "../../navigation/nav-preferences-data";

export type { NavPreferences };
export { readNavPreferences };

// ── Props ──────────────────────────────────────────────────────────────────

interface CustomizeNavigationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPreferencesChange?: (prefs: NavPreferences) => void;
}

// ── Component ──────────────────────────────────────────────────────────────

export function CustomizeNavigationDialog({
  open,
  onOpenChange,
  onPreferencesChange,
}: CustomizeNavigationDialogProps) {
  const [prefs, setPrefs] = useState<NavPreferences>(() => readNavPreferences());
  const [dragTarget, setDragTarget] = useState<{ id: string; edge: Edge | null } | null>(null);

  const uiLocale = useMemo<"zh" | "en">(() => {
    if (typeof navigator === "undefined") return "zh";
    const language = navigator.language?.toLowerCase() ?? "";
    return language.startsWith("zh") ? "zh" : "en";
  }, []);

  const [localeBundle, setLocaleBundle] = useState<SidebarLocaleBundle | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const localeFile =
      uiLocale === "zh" ? "/localized-files/zh-TW.json" : "/localized-files/en.json";
    let canceled = false;
    fetch(localeFile)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load locale file: ${res.status}`);
        return res.json() as Promise<SidebarLocaleBundle>;
      })
      .then((json) => { if (!canceled) setLocaleBundle(json); })
      .catch(() => { if (!canceled) setLocaleBundle(null); });
    return () => { canceled = true; };
  }, [uiLocale]);

  const text = DIALOG_TEXT[uiLocale];

  const workspaceItemsById = useMemo(
    () => Object.fromEntries(WORKSPACE_NAV_ITEMS.map((item) => [item.id, item])),
    [],
  );

  const orderedWorkspaceItems = useMemo(
    () =>
      prefs.workspaceOrder
        .map((id) => workspaceItemsById[id])
        .filter((item): item is WorkspaceNavItem => item != null),
    [prefs.workspaceOrder, workspaceItemsById],
  );

  const getWorkspaceLabel = (item: WorkspaceNavItem) =>
    localeBundle?.workspace?.tabLabels?.[item.tabKey] ?? item.fallbackLabel;

  const getOrganizationLabel = (item: (typeof ORGANIZATION_NAV_ITEMS)[number]) =>
    uiLocale === "zh" ? item.zhLabel : item.enLabel;

  function updatePrefs(update: Partial<NavPreferences>) {
    const next = { ...prefs, ...update };
    writeNavPreferences(next);
    setPrefs(next);
    onPreferencesChange?.(next);
  }

  function togglePersonal(id: string) {
    const next = prefs.pinnedPersonal.includes(id)
      ? prefs.pinnedPersonal.filter((x) => x !== id)
      : [...prefs.pinnedPersonal, id];
    updatePrefs({ pinnedPersonal: next });
  }

  function toggleWorkspace(id: string) {
    const next = prefs.pinnedWorkspace.includes(id)
      ? prefs.pinnedWorkspace.filter((x) => x !== id)
      : [...prefs.pinnedWorkspace, id];
    updatePrefs({ pinnedWorkspace: next });
  }

  function reorderWorkspaceItems(sourceId: string, targetId: string, edge: Edge | null) {
    const startIndex = prefs.workspaceOrder.indexOf(sourceId);
    const targetIndex = prefs.workspaceOrder.indexOf(targetId);
    if (startIndex === -1 || targetIndex === -1) return;
    const destinationIndex = edge === "bottom" ? targetIndex + 1 : targetIndex;
    const nextOrder = reorder({ list: prefs.workspaceOrder, startIndex, finishIndex: destinationIndex });
    updatePrefs({ workspaceOrder: nextOrder });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{text.title}</DialogTitle>
          <DialogDescription>{text.description}</DialogDescription>
        </DialogHeader>

        {/* ── Personal items ─────────────────────────────────────────── */}
        <div className="mt-2 space-y-1">
          <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {text.sectionPersonal}
          </p>
          <div className="rounded-lg border border-border/60 bg-background/50">
            {PERSONAL_ITEMS.map((item) => (
              <CheckRow
                key={item.id}
                id={item.id}
                label={text[item.labelKey]}
                checked={prefs.pinnedPersonal.includes(item.id)}
                onToggle={() => { togglePersonal(item.id); }}
              />
            ))}
          </div>
        </div>

        <Separator className="my-2" />

        {/* ── Workspace items ────────────────────────────────────────── */}
        <div className="space-y-1">
          <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {text.sectionWorkspace}
          </p>
          <div className="rounded-lg border border-border/60 bg-background/50">
            {orderedWorkspaceItems.map((item) => (
              <WorkspaceCheckRow
                key={item.id}
                id={item.id}
                label={getWorkspaceLabel(item)}
                checked={prefs.pinnedWorkspace.includes(item.id)}
                isDropTarget={dragTarget?.id === item.id}
                activeDropEdge={dragTarget?.id === item.id ? dragTarget.edge : null}
                onToggle={() => { toggleWorkspace(item.id); }}
                onDragOverItem={(targetId, edge) => { setDragTarget({ id: targetId, edge }); }}
                onDragLeaveItem={(targetId) => {
                  setDragTarget((current) => (current?.id === targetId ? null : current));
                }}
                onReorder={reorderWorkspaceItems}
              />
            ))}
          </div>
        </div>

        <Separator className="my-2" />

        {/* ── Organization items ──────────────────────────────────────── */}
        <div className="space-y-1">
          <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {text.sectionOrganization}
          </p>
          <div className="rounded-lg border border-border/60 bg-background/50">
            {ORGANIZATION_NAV_ITEMS.map((item) => (
              <CheckRow
                key={item.id}
                id={item.id}
                label={getOrganizationLabel(item)}
                checked={prefs.pinnedWorkspace.includes(item.id)}
                onToggle={() => { toggleWorkspace(item.id); }}
              />
            ))}
          </div>
        </div>

        <Separator className="my-2" />

        {/* ── Display settings ───────────────────────────────────────── */}
        <div className="space-y-3">
          <p className="px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {text.sectionDisplay}
          </p>
          <div className="rounded-lg border border-border/60 bg-background/50 px-4 py-3 space-y-3">
            <div className="flex items-center gap-3">
              <Checkbox
                id="nav-limit-workspaces"
                checked={prefs.showLimitedWorkspaces}
                onCheckedChange={(checked) => { updatePrefs({ showLimitedWorkspaces: Boolean(checked) }); }}
              />
              <Label htmlFor="nav-limit-workspaces" className="cursor-pointer text-sm font-medium">
                {text.limitedLabel}
              </Label>
            </div>
            {prefs.showLimitedWorkspaces && (
              <div className="space-y-1.5 pl-7">
                <Label htmlFor="nav-max-workspaces" className="text-xs text-muted-foreground">
                  {text.limitedInputLabel}
                </Label>
                <Input
                  id="nav-max-workspaces"
                  type="number"
                  min={1}
                  max={50}
                  value={prefs.maxWorkspaces}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val >= 1) updatePrefs({ maxWorkspaces: Math.min(val, 50) });
                  }}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <div className="flex justify-end pt-2">
          <Button type="button" onClick={() => { onOpenChange(false); }}>
            {text.done}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
````

## File: modules/workspace/interfaces/web/components/dialogs/NavCheckRow.tsx
````typescript
"use client";

/**
 * nav-check-row.tsx
 * Owns: CheckRow (static) and WorkspaceCheckRow (drag-and-drop) row components
 *   used inside the CustomizeNavigationDialog.
 */

import { GripVertical } from "lucide-react";
import { useEffect, useRef } from "react";

import {
  attachClosestEdge,
  combine,
  draggable,
  DropIndicator,
  dropTargetForElements,
  extractClosestEdge,
  type Edge,
} from "@lib-dragdrop";
import { Checkbox } from "@ui-shadcn/ui/checkbox";
import { Label } from "@ui-shadcn/ui/label";

// ── CheckRow ───────────────────────────────────────────────────────────────

interface CheckRowProps {
  id: string;
  label: string;
  checked: boolean;
  onToggle: () => void;
}

export function CheckRow({ id, label, checked, onToggle }: CheckRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-muted/50">
      <GripVertical className="size-4 shrink-0 cursor-grab text-muted-foreground/40 active:cursor-grabbing" />
      <Checkbox
        id={`nav-check-${id}`}
        checked={checked}
        onCheckedChange={onToggle}
        className="shrink-0"
      />
      <Label
        htmlFor={`nav-check-${id}`}
        className="cursor-pointer select-none text-sm font-normal"
      >
        {label}
      </Label>
    </div>
  );
}

// ── WorkspaceCheckRow ──────────────────────────────────────────────────────

interface WorkspaceCheckRowProps {
  id: string;
  label: string;
  checked: boolean;
  activeDropEdge: Edge | null;
  isDropTarget: boolean;
  onToggle: () => void;
  onDragOverItem: (targetId: string, edge: Edge | null) => void;
  onDragLeaveItem: (targetId: string) => void;
  onReorder: (sourceId: string, targetId: string, edge: Edge | null) => void;
}

export function WorkspaceCheckRow({
  id,
  label,
  checked,
  activeDropEdge,
  isDropTarget,
  onToggle,
  onDragOverItem,
  onDragLeaveItem,
  onReorder,
}: WorkspaceCheckRowProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    return combine(
      draggable({
        element,
        getInitialData: () => ({ type: "workspace-nav-item", itemId: id }),
      }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) =>
          source.data.type === "workspace-nav-item" && source.data.itemId !== id,
        getData: ({ input, element: dropElement }) =>
          attachClosestEdge(
            { type: "workspace-nav-item", itemId: id },
            { input, element: dropElement, allowedEdges: ["top", "bottom"] },
          ),
        onDragEnter: ({ self }) => { onDragOverItem(id, extractClosestEdge(self.data)); },
        onDrag: ({ self }) => { onDragOverItem(id, extractClosestEdge(self.data)); },
        onDragLeave: () => { onDragLeaveItem(id); },
        onDrop: ({ source, self }) => {
          const sourceId =
            typeof source.data.itemId === "string" ? source.data.itemId : null;
          if (!sourceId || sourceId === id) {
            onDragLeaveItem(id);
            return;
          }
          onReorder(sourceId, id, extractClosestEdge(self.data));
          onDragLeaveItem(id);
        },
      }),
    );
  }, [id, onDragLeaveItem, onDragOverItem, onReorder]);

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-muted/50">
        <GripVertical className="size-4 shrink-0 cursor-grab text-muted-foreground/40 active:cursor-grabbing" />
        <Checkbox
          id={`nav-check-${id}`}
          checked={checked}
          onCheckedChange={onToggle}
          className="shrink-0"
        />
        <Label
          htmlFor={`nav-check-${id}`}
          className="cursor-pointer select-none text-sm font-normal"
        >
          {label}
        </Label>
      </div>

      {isDropTarget && activeDropEdge && (
        <div className="pointer-events-none absolute inset-x-2">
          <DropIndicator edge={activeDropEdge} />
        </div>
      )}
    </div>
  );
}
````

## File: modules/workspace/interfaces/web/components/dialogs/WorkspaceSettingsDialog.tsx
````typescript
"use client";

import { type FormEvent } from "react";
import type { WorkspaceEntity } from "../../../api/contracts";
import { Button } from "@ui-shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-shadcn/ui/select";
import type { WorkspaceSettingsDraft } from "../../state/workspace-settings";
import { WorkspaceSettingsInformationFields } from "./WorkspaceSettingsInformationFields";

interface WorkspaceSettingsDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly settingsDraft: WorkspaceSettingsDraft | null;
  readonly setSettingsDraft: React.Dispatch<React.SetStateAction<WorkspaceSettingsDraft | null>>;
  readonly isSaving: boolean;
  readonly saveError: string | null;
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function WorkspaceSettingsDialog({
  open,
  onOpenChange,
  settingsDraft,
  setSettingsDraft,
  isSaving,
  saveError,
  onSubmit,
}: WorkspaceSettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>編輯工作區設定</DialogTitle>
          <DialogDescription>
            更新工作區基本資料、地址與聯絡角色，讓個人與組織工作區都能直接在內頁維護。
          </DialogDescription>
        </DialogHeader>

        {settingsDraft && (
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <span className="text-sm font-medium text-foreground">可見性</span>
                <Select
                  value={settingsDraft.visibility}
                  onValueChange={(value: WorkspaceEntity["visibility"]) =>
                    setSettingsDraft((current) =>
                      current ? { ...current, visibility: value } : current,
                    )
                  }
                  disabled={isSaving}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visible">visible</SelectItem>
                    <SelectItem value="hidden">hidden</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium text-foreground">生命週期</span>
                <Select
                  value={settingsDraft.lifecycleState}
                  onValueChange={(value: WorkspaceEntity["lifecycleState"]) =>
                    setSettingsDraft((current) =>
                      current ? { ...current, lifecycleState: value } : current,
                    )
                  }
                  disabled={isSaving}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preparatory">preparatory</SelectItem>
                    <SelectItem value="active">active</SelectItem>
                    <SelectItem value="stopped">stopped</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <WorkspaceSettingsInformationFields
              settingsDraft={settingsDraft}
              setSettingsDraft={setSettingsDraft}
              isSaving={isSaving}
            />

            {saveError && <p className="text-sm text-destructive">{saveError}</p>}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                取消
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "儲存中…" : "儲存設定"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
````

## File: modules/workspace/interfaces/web/components/dialogs/WorkspaceSettingsInformationFields.tsx
````typescript
"use client";

import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";

import {
  createWorkspaceCustomRoleDraft,
  type WorkspaceSettingsDraft,
} from "../../state/workspace-settings";
import { WorkspaceInformationCard } from "../cards/WorkspaceInformationCard";

interface WorkspaceSettingsInformationFieldsProps {
  readonly settingsDraft: WorkspaceSettingsDraft;
  readonly setSettingsDraft: React.Dispatch<React.SetStateAction<WorkspaceSettingsDraft | null>>;
  readonly isSaving: boolean;
}

export function WorkspaceSettingsInformationFields({
  settingsDraft,
  setSettingsDraft,
  isSaving,
}: WorkspaceSettingsInformationFieldsProps) {
  return (
    <WorkspaceInformationCard
      workspaceName={(
        <Input
          aria-label="工作區名稱"
          id="workspace-detail-name"
          value={settingsDraft.name}
          onChange={(event) =>
            setSettingsDraft((current) =>
              current ? { ...current, name: event.target.value } : current,
            )
          }
          disabled={isSaving}
          maxLength={80}
        />
      )}
      workspaceAddress={(
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium text-foreground" htmlFor="workspace-address-street">
              Street
            </label>
            <Input
              id="workspace-address-street"
              value={settingsDraft.street}
              onChange={(event) =>
                setSettingsDraft((current) =>
                  current ? { ...current, street: event.target.value } : current,
                )
              }
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="workspace-address-city">
              City
            </label>
            <Input
              id="workspace-address-city"
              value={settingsDraft.city}
              onChange={(event) =>
                setSettingsDraft((current) =>
                  current ? { ...current, city: event.target.value } : current,
                )
              }
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="workspace-address-state">
              State
            </label>
            <Input
              id="workspace-address-state"
              value={settingsDraft.state}
              onChange={(event) =>
                setSettingsDraft((current) =>
                  current ? { ...current, state: event.target.value } : current,
                )
              }
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="workspace-address-postal-code">
              Postal code
            </label>
            <Input
              id="workspace-address-postal-code"
              value={settingsDraft.postalCode}
              onChange={(event) =>
                setSettingsDraft((current) =>
                  current ? { ...current, postalCode: event.target.value } : current,
                )
              }
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="workspace-address-country">
              Country
            </label>
            <Input
              id="workspace-address-country"
              value={settingsDraft.country}
              onChange={(event) =>
                setSettingsDraft((current) =>
                  current ? { ...current, country: event.target.value } : current,
                )
              }
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium text-foreground" htmlFor="workspace-address-details">
              Details
            </label>
            <Input
              id="workspace-address-details"
              value={settingsDraft.details}
              onChange={(event) =>
                setSettingsDraft((current) =>
                  current ? { ...current, details: event.target.value } : current,
                )
              }
              disabled={isSaving}
            />
          </div>
        </div>
      )}
      workspaceRoles={[
        {
          id: "workspace-manager-role",
          roleName: <p className="text-sm font-medium text-foreground">Manager</p>,
          roleValue: (
            <Input
              id="workspace-manager-id"
              value={settingsDraft.managerId}
              onChange={(event) =>
                setSettingsDraft((current) =>
                  current ? { ...current, managerId: event.target.value } : current,
                )
              }
              disabled={isSaving}
            />
          ),
        },
        {
          id: "workspace-supervisor-role",
          roleName: <p className="text-sm font-medium text-foreground">Supervisor</p>,
          roleValue: (
            <Input
              id="workspace-supervisor-id"
              value={settingsDraft.supervisorId}
              onChange={(event) =>
                setSettingsDraft((current) =>
                  current ? { ...current, supervisorId: event.target.value } : current,
                )
              }
              disabled={isSaving}
            />
          ),
        },
        {
          id: "workspace-safety-officer-role",
          roleName: <p className="text-sm font-medium text-foreground">Safety officer</p>,
          roleValue: (
            <Input
              id="workspace-safety-officer-id"
              value={settingsDraft.safetyOfficerId}
              onChange={(event) =>
                setSettingsDraft((current) =>
                  current ? { ...current, safetyOfficerId: event.target.value } : current,
                )
              }
              disabled={isSaving}
            />
          ),
        },
        ...settingsDraft.customRoles.map((entry) => ({
          id: entry.roleId,
          roleName: (
            <Input
              aria-label="角色名稱"
              value={entry.roleName}
              onChange={(event) =>
                setSettingsDraft((current) =>
                  current
                    ? {
                        ...current,
                        customRoles: current.customRoles.map((role) =>
                          role.roleId === entry.roleId
                            ? { ...role, roleName: event.target.value }
                            : role,
                        ),
                      }
                    : current,
                )
              }
              disabled={isSaving}
              placeholder="例如：Site lead"
            />
          ),
          roleValue: (
            <Input
              aria-label="角色"
              value={entry.role}
              onChange={(event) =>
                setSettingsDraft((current) =>
                  current
                    ? {
                        ...current,
                        customRoles: current.customRoles.map((role) =>
                          role.roleId === entry.roleId
                            ? { ...role, role: event.target.value }
                            : role,
                        ),
                      }
                    : current,
                )
              }
              disabled={isSaving}
              placeholder="輸入角色內容"
            />
          ),
          roleActions: (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                setSettingsDraft((current) =>
                  current
                    ? {
                        ...current,
                        customRoles: current.customRoles.filter((role) => role.roleId !== entry.roleId),
                      }
                    : current,
                )
              }
              disabled={isSaving}
            >
              移除
            </Button>
          ),
        })),
      ]}
      rolesAction={(
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            setSettingsDraft((current) =>
              current
                ? {
                    ...current,
                    customRoles: [...current.customRoles, createWorkspaceCustomRoleDraft()],
                  }
                : current,
            )
          }
          disabled={isSaving}
        >
          新增角色
        </Button>
      )}
    />
  );
}
````

## File: modules/workspace/interfaces/web/components/layout/workspace-detail-helpers.ts
````typescript
import type { WorkspaceEntity } from "../../../api/contracts";
import { formatDate } from "@shared-utils";
import type { WorkspaceTabGroup } from "../../navigation/workspace-tabs";

export const MOBILE_TAB_GROUP_ORDER: WorkspaceTabGroup[] = [
  "primary",
  "modules",
  "library",
  "spaces",
  "databases",
];

export const lifecycleBadgeVariant: Record<
  WorkspaceEntity["lifecycleState"],
  "default" | "secondary" | "outline"
> = {
  active: "default",
  preparatory: "secondary",
  stopped: "outline",
};

export function getWorkspaceInitials(name: string): string {
  const tokens = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (tokens.length === 0) {
    return "WS";
  }

  return tokens.map((token) => token[0]?.toUpperCase() ?? "").join("");
}

export function formatTimestamp(
  timestamp: WorkspaceEntity["createdAt"] | undefined,
): string {
  if (!timestamp) {
    return "—";
  }
  try {
    return formatDate(timestamp.toDate());
  } catch {
    return "—";
  }
}

export function trimOrUndefined(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed || undefined;
}
````

## File: modules/workspace/interfaces/web/components/layout/WorkspaceQuickAccessRow.tsx
````typescript
"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { useRef } from "react";

import type { WorkspaceQuickAccessItem } from "../navigation/workspace-quick-access";

interface WorkspaceQuickAccessRowProps {
  items: WorkspaceQuickAccessItem[];
  pathname: string;
  currentPanel: string | null;
  currentWorkspaceTab: string | null;
  workspaceSettingsHref: string;
  isActiveRoute: (href: string) => boolean;
}

export function WorkspaceQuickAccessRow({
  items,
  pathname,
  currentPanel,
  currentWorkspaceTab,
  workspaceSettingsHref,
  isActiveRoute,
}: WorkspaceQuickAccessRowProps) {
  const quickAccessDragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startScrollLeft: number;
    didDrag: boolean;
  } | null>(null);

  const suppressQuickAccessClickRef = useRef(false);

  if (items.length === 0) {
    return null;
  }

  function handleQuickAccessPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") {
      return;
    }

    const container = event.currentTarget;
    if (container.scrollWidth <= container.clientWidth) {
      return;
    }

    quickAccessDragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: container.scrollLeft,
      didDrag: false,
    };
  }

  function handleQuickAccessPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const dragState = quickAccessDragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;
    if (!dragState.didDrag && Math.abs(deltaX) > 4) {
      dragState.didDrag = true;
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    }

    if (!dragState.didDrag) {
      return;
    }

    event.preventDefault();
    event.currentTarget.scrollLeft = dragState.startScrollLeft - deltaX;
  }

  function finishQuickAccessPointer(event: React.PointerEvent<HTMLDivElement>) {
    const dragState = quickAccessDragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    if (dragState.didDrag) {
      suppressQuickAccessClickRef.current = true;
      window.setTimeout(() => {
        suppressQuickAccessClickRef.current = false;
      }, 0);
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    quickAccessDragStateRef.current = null;
  }

  function handleQuickAccessItemClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!suppressQuickAccessClickRef.current) {
      return;
    }

    suppressQuickAccessClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  }

  function handleQuickAccessDragStart(event: React.DragEvent<HTMLAnchorElement>) {
    event.preventDefault();
  }

  return (
    <div className="shrink-0 border-b border-border/30 px-2 py-2">
      <div className="flex items-center gap-1">
        <div
          className="min-w-0 flex-1 cursor-grab overflow-x-auto overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden active:cursor-grabbing"
          onPointerDown={handleQuickAccessPointerDown}
          onPointerMove={handleQuickAccessPointerMove}
          onPointerUp={finishQuickAccessPointer}
          onPointerCancel={finishQuickAccessPointer}
        >
          <div className="flex w-max items-center gap-1 pr-1 select-none">
            {items.map((item) => {
              const active = item.isActive?.(pathname, {
                panel: currentPanel,
                tab: currentWorkspaceTab,
              }) ?? isActiveRoute(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.label}
                  aria-current={active ? "page" : undefined}
                  onClick={handleQuickAccessItemClick}
                  onDragStart={handleQuickAccessDragStart}
                  draggable={false}
                  className={`flex size-7 shrink-0 items-center justify-center rounded-md transition ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  }`}
                >
                  {item.icon}
                  <span className="sr-only">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
        {workspaceSettingsHref ? (
          <Link
            href={workspaceSettingsHref}
            aria-label="工作區設定"
            aria-current={currentPanel === "settings" ? "page" : undefined}
            onClick={handleQuickAccessItemClick}
            onDragStart={handleQuickAccessDragStart}
            draggable={false}
            className={`ml-auto flex size-7 items-center justify-center rounded-md transition ${
              currentPanel === "settings"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            }`}
          >
            <Settings className="size-3.5" />
            <span className="sr-only">工作區設定</span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
````

## File: modules/workspace/interfaces/web/components/layout/WorkspaceSectionContent.tsx
````typescript
"use client";

import Link from "next/link";

import type { NavPreferences, SidebarLocaleBundle } from "../../navigation/nav-preferences-data";
import { WorkspaceSidebarSection } from "./WorkspaceSidebarSection";

interface RecentWorkspaceLink {
  id: string;
  name: string;
  href: string;
}

interface WorkspaceSectionContentProps {
  workspacePathId: string | null;
  navPrefs: NavPreferences;
  localeBundle: SidebarLocaleBundle | null;
  showRecentWorkspaces: boolean;
  visibleRecentWorkspaceLinks: RecentWorkspaceLink[];
  hasOverflow: boolean;
  isExpanded: boolean;
  activeWorkspaceId: string | null;
  isActiveRoute: (href: string) => boolean;
  onSelectWorkspace: (workspaceId: string | null) => void;
  onToggleExpanded: () => void;
  getItemClassName: (isActive: boolean) => string;
  sectionTitleClassName: string;
}

export function WorkspaceSectionContent({
  workspacePathId,
  navPrefs,
  localeBundle,
  showRecentWorkspaces,
  visibleRecentWorkspaceLinks,
  hasOverflow,
  isExpanded,
  activeWorkspaceId,
  isActiveRoute,
  onSelectWorkspace,
  onToggleExpanded,
  getItemClassName,
  sectionTitleClassName,
}: WorkspaceSectionContentProps) {
  if (workspacePathId) {
    return (
      <WorkspaceSidebarSection
        workspacePathId={workspacePathId}
        navPrefs={navPrefs}
        localeBundle={localeBundle}
        getItemClassName={getItemClassName}
      />
    );
  }

  if (!showRecentWorkspaces) {
    return null;
  }

  return (
    <div className="space-y-0.5">
      <p className={sectionTitleClassName}>最近工作區</p>
      {visibleRecentWorkspaceLinks.length === 0 ? (
        <p className="px-2 py-2 text-[11px] text-muted-foreground">尚無最近開啟的工作區。</p>
      ) : (
        visibleRecentWorkspaceLinks.map((workspace) => (
          <Link
            key={workspace.id}
            href={workspace.href}
            onClick={() => {
              onSelectWorkspace(workspace.id);
            }}
            className={`flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${
              activeWorkspaceId === workspace.id || isActiveRoute(workspace.href)
                ? "border border-primary/30 bg-primary/10 text-primary"
                : "border border-transparent text-foreground/80 hover:border-border/60 hover:bg-muted/70 hover:text-foreground"
            }`}
            title={workspace.name}
          >
            <span className="truncate">{workspace.name}</span>
          </Link>
        ))
      )}
      {hasOverflow && (
        <button
          type="button"
          onClick={onToggleExpanded}
          className="px-2 py-1 text-[11px] font-medium text-primary hover:underline"
        >
          {isExpanded ? "收起" : "顯示更多"}
        </button>
      )}
    </div>
  );
}
````

## File: modules/workspace/interfaces/web/components/layout/WorkspaceSidebarSection.tsx
````typescript
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
  getWorkspaceTabLabel,
  getWorkspaceTabPrefId,
  getWorkspaceTabsByGroup,
  WORKSPACE_TAB_SIDEBAR_GROUP_ORDER,
  getWorkspaceTabStatus,
  isWorkspaceTabValue,
  type WorkspaceTabGroup,
  type WorkspaceTabValue,
} from "../../navigation/workspace-tabs";

export interface WorkspaceSidebarLocaleBundle {
  workspace?: {
    tabLabels?: Record<string, string>;
  };
}

export interface WorkspaceNavigationPreferences {
  pinnedWorkspace: string[];
  workspaceOrder: string[];
}

interface TabLinkItem {
  value: WorkspaceTabValue;
  label: string;
}

function createWorkspaceLinkItems(group: WorkspaceTabGroup): TabLinkItem[] {
  return getWorkspaceTabsByGroup(group).map((value) => ({
    value,
    label: getWorkspaceTabLabel(value),
  }));
}

const WORKSPACE_PRIMARY_LINK_ITEMS = createWorkspaceLinkItems("primary");
const WORKSPACE_LINK_ITEMS_BY_GROUP: Record<WorkspaceTabGroup, readonly TabLinkItem[]> = {
  primary: WORKSPACE_PRIMARY_LINK_ITEMS,
  modules: createWorkspaceLinkItems("modules"),
  spaces: createWorkspaceLinkItems("spaces"),
  databases: createWorkspaceLinkItems("databases"),
  library: createWorkspaceLinkItems("library"),
};

function buildWorkspaceTabHref(workspaceId: string, tab: WorkspaceTabValue): string {
  return `/workspace/${workspaceId}?tab=${encodeURIComponent(tab)}`;
}

function tTab(
  tab: WorkspaceTabValue,
  fallback: string,
  localeBundle: WorkspaceSidebarLocaleBundle | null,
): string {
  return localeBundle?.workspace?.tabLabels?.[tab] ?? fallback;
}

function tTabWithDevStatus(
  tab: WorkspaceTabValue,
  fallback: string,
  localeBundle: WorkspaceSidebarLocaleBundle | null,
): string {
  const label = tTab(tab, fallback, localeBundle);
  const status = getWorkspaceTabStatus(tab);
  return `${status} ${label}`;
}

function getPrefId(tabValue: string): string {
  return getWorkspaceTabPrefId(tabValue as WorkspaceTabValue) ?? tabValue;
}

function isItemEnabled(prefId: string, navPrefs: WorkspaceNavigationPreferences): boolean {
  return navPrefs.pinnedWorkspace.includes(prefId);
}

function getItemOrder(prefId: string, navPrefs: WorkspaceNavigationPreferences): number {
  const index = navPrefs.workspaceOrder.indexOf(prefId);
  return index === -1 ? 999 : index;
}

function sortByPreferenceOrder<T extends { value: string }>(
  items: readonly T[],
  navPrefs: WorkspaceNavigationPreferences,
): T[] {
  return [...items].sort(
    (left, right) =>
      getItemOrder(getPrefId(left.value), navPrefs) -
      getItemOrder(getPrefId(right.value), navPrefs),
  );
}

interface WorkspaceSidebarSectionProps {
  workspacePathId: string;
  navPrefs: WorkspaceNavigationPreferences;
  localeBundle: WorkspaceSidebarLocaleBundle | null;
  getItemClassName: (isActive: boolean) => string;
}

export function WorkspaceSidebarSection({
  workspacePathId,
  navPrefs,
  localeBundle,
  getItemClassName,
}: WorkspaceSidebarSectionProps) {
  const searchParams = useSearchParams();
  const rawTab = searchParams.get("tab") ?? "Overview";
  const activeWorkspaceTab: WorkspaceTabValue = isWorkspaceTabValue(rawTab) ? rawTab : "Overview";

  const groups: Array<{ key: WorkspaceTabGroup; items: readonly TabLinkItem[] }> =
    WORKSPACE_TAB_SIDEBAR_GROUP_ORDER.map((groupKey) => ({
      key: groupKey,
      items: WORKSPACE_LINK_ITEMS_BY_GROUP[groupKey],
    }));

  const visibleGroups = groups
    .map((g) => ({
      key: g.key,
      visible: sortByPreferenceOrder(g.items, navPrefs).filter((item) =>
        isItemEnabled(getPrefId(item.value), navPrefs),
      ),
    }))
    .filter((g) => g.visible.length > 0);

  return (
    <nav className="space-y-0.5" aria-label="Workspace navigation">
      {visibleGroups.map((group, groupIndex) => (
        <div key={group.key}>
          {groupIndex > 0 && <div className="my-1.5 border-t border-border/40" />}
          <div className="space-y-0.5">
            {group.visible.map((item) => {
              const isActive = activeWorkspaceTab === item.value;
              return (
                <Link
                  key={item.value}
                  href={buildWorkspaceTabHref(workspacePathId, item.value)}
                  aria-current={isActive ? "page" : undefined}
                  className={getItemClassName(isActive)}
                >
                  {tTabWithDevStatus(item.value, item.label, localeBundle)}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
````

## File: modules/workspace/interfaces/web/components/screens/OrganizationWorkspacesScreen.tsx
````typescript
"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";

import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";

import type { WorkspaceEntity } from "../../../api/contracts";
import { useWorkspaceHub } from "../../hooks/useWorkspaceHub";
import { CreateWorkspaceDialog } from "../dialogs/CreateWorkspaceDialog";

const lifecycleBadgeVariant: Record<
  WorkspaceEntity["lifecycleState"],
  "default" | "secondary" | "outline"
> = {
  active: "default",
  preparatory: "secondary",
  stopped: "outline",
};

interface OrganizationWorkspacesScreenProps {
  readonly accountId: string | null | undefined;
}

export function OrganizationWorkspacesScreen({ accountId }: OrganizationWorkspacesScreenProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");

  const {
    createError,
    clearCreateError,
    createWorkspaceForAccount,
    isCreatingWorkspace,
    loadState,
    workspaces,
  } = useWorkspaceHub({ accountId, accountType: "organization" });

  function resetDialog() {
    setWorkspaceName("");
    clearCreateError();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await createWorkspaceForAccount(workspaceName);
    if (!result.success) return;
    resetDialog();
    setIsCreateOpen(false);
  }

  if (!accountId) {
    return (
      <p className="text-sm text-muted-foreground">請先切換到組織帳戶。</p>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">工作區</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            組織下所有工作區清單，含 lifecycle 狀態與快速連結。
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            resetDialog();
            setIsCreateOpen(true);
          }}
        >
          建立工作區
        </Button>
      </div>

      <CreateWorkspaceDialog
        open={isCreateOpen}
        workspaceName={workspaceName}
        createError={createError}
        isCreatingWorkspace={isCreatingWorkspace}
        accountId={accountId}
        onOpenChange={setIsCreateOpen}
        onWorkspaceNameChange={setWorkspaceName}
        onSubmit={handleSubmit}
      />

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Workspaces</CardTitle>
          <CardDescription>組織下所有工作區清單，含 lifecycle 狀態與快速連結。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadState === "loading" && (
            <p className="text-sm text-muted-foreground">工作區載入中…</p>
          )}
          {loadState === "error" && (
            <p className="text-sm text-destructive">無法載入工作區資料，請稍後再試。</p>
          )}
          {loadState === "loaded" && workspaces.length === 0 && (
            <p className="text-sm text-muted-foreground">目前沒有可顯示的工作區。</p>
          )}
          {loadState === "loaded" &&
            workspaces.map((workspace) => (
              <div key={workspace.id} className="rounded-lg border border-border/40 px-3 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button asChild variant="link" className="h-auto p-0 text-sm font-medium">
                      <Link href={`/workspace/${workspace.id}`}>{workspace.name}</Link>
                    </Button>
                    <Badge variant={lifecycleBadgeVariant[workspace.lifecycleState]}>
                      {workspace.lifecycleState}
                    </Badge>
                    <Badge variant="outline">{workspace.visibility}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button asChild variant="outline" size="sm" className="h-6 text-xs">
                      <Link href={`/workspace/${workspace.id}?tab=Files`}>檔案</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="h-6 text-xs">
                      <Link href={`/knowledge/pages?workspaceId=${encodeURIComponent(workspace.id)}`}>
                        知識頁面
                      </Link>
                    </Button>
                  </div>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{workspace.id}</p>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
````

## File: modules/workspace/interfaces/web/components/tabs/WorkspaceDailyTab.tsx
````typescript
"use client";

import type { WorkspaceEntity } from "../../../api/contracts";
import { WorkspaceFeedWorkspaceView } from "@/modules/workspace/api";

interface WorkspaceDailyTabProps {
  readonly workspace: WorkspaceEntity;
}

export function WorkspaceDailyTab({ workspace }: WorkspaceDailyTabProps) {
  return (
    <WorkspaceFeedWorkspaceView
      accountId={workspace.accountId}
      workspaceId={workspace.id}
      workspaceName={workspace.name}
    />
  );
}
````

## File: modules/workspace/interfaces/web/components/tabs/WorkspaceMembersTab.tsx
````typescript
"use client";

import { useEffect, useMemo, useState } from "react";

import type { WorkspaceEntity, WorkspaceMemberView } from "../../../api/contracts";
import { Avatar, AvatarFallback } from "@ui-shadcn/ui/avatar";
import { Badge } from "@ui-shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { getWorkspaceMembers } from "../../../api/facades";

function getMemberInitials(name: string) {
  const trimmed = name.trim();
  if (!trimmed) {
    return "??";
  }

  const tokens = trimmed.split(/\s+/).slice(0, 2);
  return tokens.map((token) => token[0]?.toUpperCase() ?? "").join("");
}

function getAccessChannelKey(memberId: string, channel: WorkspaceMemberView["accessChannels"][number], index: number) {
  return [
    memberId,
    channel.source,
    channel.label,
    channel.role ?? "",
    channel.protocol ?? "",
    channel.teamId ?? "",
    String(index),
  ].join("::");
}

const presenceLabelMap = {
  active: "Active",
  away: "Away",
  offline: "Offline",
  unknown: "Unknown",
} as const;

const sourceLabelMap = {
  owner: "Owner",
  direct: "Direct",
  team: "Team",
  personnel: "Personnel",
} as const;

interface WorkspaceMembersTabProps {
  readonly workspace: WorkspaceEntity;
}

export function WorkspaceMembersTab({ workspace }: WorkspaceMembersTabProps) {
  const [members, setMembers] = useState<WorkspaceMemberView[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function loadMembers() {
      setLoadState("loading");

      try {
        const nextMembers = await getWorkspaceMembers(workspace.id);
        if (cancelled) {
          return;
        }

        setMembers(nextMembers);
        setLoadState("loaded");
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[WorkspaceMembersTab] Failed to load members:", error);
        }

        if (!cancelled) {
          setMembers([]);
          setLoadState("error");
        }
      }
    }

    void loadMembers();

    return () => {
      cancelled = true;
    };
  }, [workspace.id]);

  const directCount = useMemo(
    () =>
      members.filter((member) =>
        member.accessChannels.some((channel) => channel.source === "direct"),
      ).length,
    [members],
  );

  const teamCount = useMemo(
    () =>
      members.filter((member) =>
        member.accessChannels.some((channel) => channel.source === "team"),
      ).length,
    [members],
  );

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>Members</CardTitle>
        <CardDescription>
          {workspace.accountType === "organization"
            ? "組織成員與工作區授權來源的整合檢視。"
            : "個人工作區目前的共享與聯絡角色摘要。"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Visible members</p>
            <p className="mt-1 text-xl font-semibold">{members.length}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Direct access</p>
            <p className="mt-1 text-xl font-semibold">{directCount}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Team access</p>
            <p className="mt-1 text-xl font-semibold">{teamCount}</p>
          </div>
        </div>

        {loadState === "loading" && (
          <p className="text-sm text-muted-foreground">Loading workspace members…</p>
        )}

        {loadState === "error" && (
          <p className="text-sm text-destructive">
            無法載入成員資料，請重新整理頁面或稍後再試。
          </p>
        )}

        {loadState === "loaded" && members.length === 0 && (
          <p className="text-sm text-muted-foreground">
            目前尚未整理出任何工作區成員或授權來源，之後可在這裡持續擴充成員維護流程。
          </p>
        )}

        {loadState === "loaded" && members.length > 0 && (
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="rounded-xl border border-border/40 px-4 py-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback>{getMemberInitials(member.displayName)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {member.displayName}
                        </p>
                        <Badge variant="outline">{presenceLabelMap[member.presence]}</Badge>
                        {member.organizationRole && (
                          <Badge variant="secondary">{member.organizationRole}</Badge>
                        )}
                        {member.isExternal && <Badge variant="outline">External</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {member.email ?? member.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {member.accessChannels.map((channel, index) => (
                      <Badge
                        key={getAccessChannelKey(member.id, channel, index)}
                        variant="outline"
                      >
                        {sourceLabelMap[channel.source]} · {channel.label}
                        {channel.role ? ` · ${channel.role}` : ""}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
````

## File: modules/workspace/interfaces/web/components/tabs/WorkspaceOverviewSettingsTab.tsx
````typescript
"use client";

import type { WorkspaceEntity } from "../../../api/contracts";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";

import { WorkspaceInformationCard } from "../cards/WorkspaceInformationCard";
import { lifecycleBadgeVariant } from "../layout/workspace-detail-helpers";

interface WorkspaceOverviewSettingsTabProps {
  readonly workspace: WorkspaceEntity;
  readonly personnelEntries: Array<{ label: string; value: string | undefined }>;
  readonly addressLines: string[];
  readonly onEditClick: () => void;
}

export function WorkspaceOverviewSettingsTab({
  workspace,
  personnelEntries,
  addressLines,
  onEditClick,
}: WorkspaceOverviewSettingsTabProps) {
  return (
    <div className="space-y-4">
      <Card className="border border-border/50">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <CardTitle>Workspace Settings</CardTitle>
            <CardDescription>
              檢視目前工作區設定，並從這裡進入編輯流程。
            </CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onEditClick}>
            編輯工作區
          </Button>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-border/40 px-4 py-4">
            <p className="text-xs text-muted-foreground">Visibility</p>
            <div className="mt-2">
              <Badge variant="outline">{workspace.visibility}</Badge>
            </div>
          </div>

          <div className="rounded-xl border border-border/40 px-4 py-4">
            <p className="text-xs text-muted-foreground">Lifecycle</p>
            <div className="mt-2">
              <Badge variant={lifecycleBadgeVariant[workspace.lifecycleState]}>
                {workspace.lifecycleState}
              </Badge>
            </div>
          </div>

          <div className="rounded-xl border border-border/40 px-4 py-4">
            <p className="text-xs text-muted-foreground">Account Type</p>
            <p className="mt-2 text-sm font-medium text-foreground">
              {workspace.accountType === "organization" ? "Organization" : "Personal"}
            </p>
          </div>

          <div className="rounded-xl border border-border/40 px-4 py-4">
            <p className="text-xs text-muted-foreground">Account ID</p>
            <p className="mt-2 break-all text-sm font-medium text-foreground">{workspace.accountId}</p>
          </div>
        </CardContent>
      </Card>

      <WorkspaceInformationCard
        workspaceName={<p className="text-sm font-medium text-foreground">{workspace.name}</p>}
        workspaceAddress={
          addressLines.length > 0 ? (
            <div className="space-y-1.5 text-sm text-foreground">
              {addressLines.map((line, index) => (
                <p key={`${line}-${index}`}>{line}</p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">尚未設定工作區地址。</p>
          )
        }
        workspaceRoles={personnelEntries.map((entry) => ({
          id: entry.label,
          roleName: <p className="text-sm font-medium text-foreground">{entry.label}</p>,
          roleValue: entry.value ? (
            <p className="break-all text-sm text-foreground">{entry.value}</p>
          ) : (
            <p className="text-sm text-muted-foreground">未設定</p>
          ),
        }))}
      />
    </div>
  );
}
````

## File: modules/workspace/interfaces/web/hooks/useWorkspaceHub.ts
````typescript
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import type { WorkspaceEntity } from "../../api/contracts";
import { createWorkspace, getWorkspacesForAccount } from "../../api/facades";

export type WorkspaceHubLoadState = "idle" | "loading" | "loaded" | "error";

interface UseWorkspaceHubOptions {
  readonly accountId: string | null | undefined;
  readonly accountType: "user" | "organization";
  readonly creatorUserId?: string | null;
}

function sortWorkspaces(items: WorkspaceEntity[]) {
  return [...items].sort((left, right) =>
    left.name.localeCompare(right.name, "en", { sensitivity: "base" }),
  );
}

export function useWorkspaceHub({ accountId, accountType, creatorUserId }: UseWorkspaceHubOptions) {
  const [workspaces, setWorkspaces] = useState<WorkspaceEntity[]>([]);
  const [loadState, setLoadState] = useState<WorkspaceHubLoadState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  const fetchWorkspaces = useCallback(
    async (nextAccountId: string, failureMessage: string) => {
      try {
        const nextWorkspaces = await getWorkspacesForAccount(nextAccountId);
        setWorkspaces(sortWorkspaces(nextWorkspaces));
        setLoadState("loaded");
        setErrorMessage(null);
        return nextWorkspaces;
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[useWorkspaceHub] Failed to load workspaces:", error);
        }
        setWorkspaces([]);
        setLoadState("error");
        setErrorMessage(failureMessage);
        return null;
      }
    },
    [],
  );

  useEffect(() => {
    async function loadWorkspaces() {
      if (!accountId) {
        setWorkspaces([]);
        setLoadState("loaded");
        setErrorMessage(null);
        return;
      }

      setLoadState("loading");
      setErrorMessage(null);

      await fetchWorkspaces(
        accountId,
        "Unable to load workspace records right now.",
      );
    }

    void loadWorkspaces();
  }, [accountId, fetchWorkspaces]);

  const refreshWorkspaces = useCallback(async () => {
    if (!accountId) {
      setWorkspaces([]);
      setLoadState("loaded");
      setErrorMessage(null);
      return;
    }

    await fetchWorkspaces(
      accountId,
      "工作區已建立，但清單更新失敗。請重新整理頁面以查看新的工作區。",
    );
  }, [accountId, fetchWorkspaces]);

  const createWorkspaceForAccount = useCallback(
    async (name: string): Promise<CommandResult> => {
      const nextWorkspaceName = name.trim();

      if (!accountId) {
        const error = commandFailureFrom(
          "WORKSPACE_ACCOUNT_REQUIRED",
          "帳號資訊已失效，請重新整理頁面後再建立工作區。",
        );
        setCreateError(error.error.message);
        return error;
      }

      if (!nextWorkspaceName) {
        const error = commandFailureFrom("WORKSPACE_NAME_REQUIRED", "請輸入工作區名稱。");
        setCreateError(error.error.message);
        return error;
      }

      setIsCreatingWorkspace(true);
      setCreateError(null);

      const result = await createWorkspace({
        name: nextWorkspaceName,
        accountId,
        accountType,
        creatorUserId: creatorUserId ?? undefined,
      });

      if (!result.success) {
        setCreateError(result.error.message);
        setIsCreatingWorkspace(false);
        return result;
      }

      await refreshWorkspaces();
      setIsCreatingWorkspace(false);
      return result;
    },
    [accountId, accountType, creatorUserId, refreshWorkspaces],
  );

  const workspaceStats = useMemo(() => {
    return {
      total: workspaces.length,
      active: workspaces.filter((workspace) => workspace.lifecycleState === "active").length,
      preparatory: workspaces.filter((workspace) => workspace.lifecycleState === "preparatory").length,
    };
  }, [workspaces]);

  const clearCreateError = useCallback(() => {
    setCreateError(null);
  }, []);

  return {
    createError,
    clearCreateError,
    createWorkspaceForAccount,
    errorMessage,
    isCreatingWorkspace,
    loadState,
    refreshWorkspaces,
    workspaceStats,
    workspaces,
  };
}
````

## File: modules/workspace/interfaces/web/hooks/useWorkspaceOrchestrationContext.ts
````typescript
import { useApp, useAuth } from "@/modules/platform/api";

import { resolveWorkspaceFromMap } from "../utils/workspace-map";
import { useWorkspaceContext } from "../providers/WorkspaceContextProvider";

export interface WorkspaceOrchestrationContext {
  readonly accountId: string;
  readonly currentUserId: string;
  readonly activeWorkspaceId: string;
  readonly workspaceId: string;
}

export interface UseWorkspaceOrchestrationContextOptions {
  readonly requestedWorkspaceId?: string;
}

/**
 * Provides normalized account/workspace actor context for app route shims.
 * This keeps route-level composition thin and moves orchestration into workspace API.
 */
export function useWorkspaceOrchestrationContext(
  options: UseWorkspaceOrchestrationContextOptions = {},
): WorkspaceOrchestrationContext {
  const { state: appState } = useApp();
  const { state: authState } = useAuth();
  const { state: workspaceState } = useWorkspaceContext();

  const accountId = appState.activeAccount?.id ?? authState.user?.id ?? "";
  const currentUserId = authState.user?.id ?? "";
  const activeWorkspaceId = workspaceState.activeWorkspaceId ?? "";

  const requestedWorkspaceId = options.requestedWorkspaceId?.trim() ?? "";
  const resolvedWorkspace = resolveWorkspaceFromMap(
    workspaceState.workspaces,
    requestedWorkspaceId,
  );
  const workspaceId = resolvedWorkspace?.id ?? activeWorkspaceId;

  return {
    accountId,
    currentUserId,
    activeWorkspaceId,
    workspaceId,
  };
}
````

## File: modules/workspace/interfaces/web/index.ts
````typescript
/**
 * workspace interfaces/web public boundary.
 *
 * Web-layer components, hooks, navigation, state helpers and utilities.
 * App-layer and cross-module consumers that need UI composition must import
 * from this path instead of reaching into individual sub-directories.
 */

export { WorkspaceDetailScreen } from "./components/screens/WorkspaceDetailScreen";
export { WorkspaceDetailRouteScreen } from "./components/screens/WorkspaceDetailRouteScreen";
export { WorkspaceHubScreen } from "./components/screens/WorkspaceHubScreen";
export { WorkspaceMembersTab } from "./components/tabs/WorkspaceMembersTab";
export { WorkspaceSidebarSection } from "./components/layout/WorkspaceSidebarSection";
export { CreateWorkspaceDialogRail } from "./components/rails/CreateWorkspaceDialogRail";
export { OrganizationWorkspacesScreen } from "./components/screens/OrganizationWorkspacesScreen";
export { WorkspaceContextCard } from "./components/cards/WorkspaceContextCard";

export {
	WORKSPACE_TAB_GROUPS,
	WORKSPACE_TAB_META,
	WORKSPACE_TAB_VALUES,
	getWorkspaceTabLabel,
	getWorkspaceTabMeta,
	getWorkspaceTabPrefId,
	getWorkspaceTabStatus,
	getWorkspaceTabsByGroup,
	isWorkspaceTabValue,
} from "./navigation/workspace-tabs";

export { getWorkspaceStorageKey } from "./state/workspace-session";

export {
	resolveWorkspaceFromMap,
	toWorkspaceMap,
} from "./utils/workspace-map";

export type { WorkspaceNavItem } from "./navigation/workspace-nav-items";
export {
	WORKSPACE_NAV_ITEMS,
	normalizeWorkspaceOrder,
} from "./navigation/workspace-nav-items";

export type {
	WorkspaceQuickAccessItem,
	WorkspaceQuickAccessMatcherOptions,
} from "./components/navigation/workspace-quick-access";

export { buildWorkspaceQuickAccessItems } from "./components/navigation/workspace-quick-access";

export type {
	WorkspaceTabDevStatus,
	WorkspaceTabGroup,
	WorkspaceTabValue,
} from "./navigation/workspace-tabs";

export { WorkspaceContextProvider, useWorkspaceContext } from "./providers/WorkspaceContextProvider";
export type { WorkspaceContextState, WorkspaceContextAction, WorkspaceContextValue } from "./providers/WorkspaceContextProvider";

export { useWorkspaceHub } from "./hooks/useWorkspaceHub";
export {
	MAX_VISIBLE_RECENT_WORKSPACES,
	getWorkspaceIdFromPath,
	useRecentWorkspaces,
} from "./hooks/useRecentWorkspaces";
````

## File: modules/workspace/interfaces/web/navigation/use-sidebar-locale.ts
````typescript
"use client";

import { useState, useEffect } from "react";
import type { SidebarLocaleBundle } from "./nav-preferences-data";

export type { SidebarLocaleBundle };

/**
 * Loads the sidebar locale bundle from the public localized-files directory.
 * Returns null until the bundle is loaded or if loading fails
 * (callers fall back to hardcoded labels).
 */
export function useSidebarLocale(): SidebarLocaleBundle | null {
  const [localeBundle, setLocaleBundle] = useState<SidebarLocaleBundle | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSidebarLocale() {
      const isZhHant =
        typeof navigator !== "undefined" &&
        /^(zh-TW|zh-HK|zh-MO|zh-Hant)/i.test(navigator.language);
      const localeFile = isZhHant ? "zh-TW.json" : "en.json";

      try {
        const response = await fetch(`/localized-files/${localeFile}`, { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as SidebarLocaleBundle;
        if (!cancelled) {
          setLocaleBundle(data);
        }
      } catch {
        // Keep fallback labels when localization files are unavailable.
      }
    }

    void loadSidebarLocale();

    return () => {
      cancelled = true;
    };
  }, []);

  return localeBundle;
}
````

## File: modules/workspace/interfaces/web/navigation/workspace-nav-items.ts
````typescript
/**
 * workspace-nav-items.ts
 *
 * Catalog of workspace sidebar tab entries owned by the workspace BC.
 * Consumers read this catalog; they do not define it.
 */

import {
  getWorkspaceTabLabel,
  getWorkspaceTabPrefId,
  getWorkspaceTabsInSidebarOrder,
  type WorkspaceTabValue,
} from "./workspace-tabs";

export interface WorkspaceNavItem {
  id: string;
  tabKey: WorkspaceTabValue;
  fallbackLabel: string;
}

export const WORKSPACE_NAV_ITEMS: WorkspaceNavItem[] = getWorkspaceTabsInSidebarOrder().map((tabKey) => ({
  id: getWorkspaceTabPrefId(tabKey),
  tabKey,
  fallbackLabel: getWorkspaceTabLabel(tabKey),
}));

const VALID_WORKSPACE_ORDER_IDS = new Set(WORKSPACE_NAV_ITEMS.map((item) => item.id));
const DEFAULT_WORKSPACE_ORDER = WORKSPACE_NAV_ITEMS.map((item) => item.id);

export function normalizeWorkspaceOrder(order: unknown): string[] {
  const fallback = DEFAULT_WORKSPACE_ORDER;
  if (!Array.isArray(order)) return fallback;
  const validOrder = order
    .filter((id): id is string => typeof id === "string")
    .filter((id) => VALID_WORKSPACE_ORDER_IDS.has(id));
  const deduped = Array.from(new Set(validOrder));
  for (const id of fallback) {
    if (!deduped.includes(id)) deduped.push(id);
  }
  return deduped;
}
````

## File: modules/workspace/interfaces/web/providers/WorkspaceContextProvider.tsx
````typescript
"use client";

/**
 * WorkspaceContextProvider — workspace/interfaces/web layer
 *
 * Owns workspace-scoped state for the authenticated shell:
 *   - workspaces visible under the active account
 *   - active workspace selection and localStorage persistence
 *
 * Reads `activeAccount` from platform's useApp(); subscribes to workspaces
 * via workspace-owned query functions. This keeps workspace state ownership
 * inside the workspace bounded context instead of leaking into platform.
 */

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";

import { useApp } from "@/modules/platform/api";
import type { WorkspaceEntity } from "../../api/contracts";
import { subscribeToWorkspacesForAccount } from "../../api/facades/workspace.facade";
import { toWorkspaceMap } from "../utils/workspace-map";
import { getWorkspaceStorageKey } from "../state/workspace-session";

// ── State ────────────────────────────────────────────────────────────────────

export interface WorkspaceContextState {
  /** Workspaces visible under the active account. */
  workspaces: Record<string, WorkspaceEntity>;
  /** True once the first active-account workspace snapshot has been received. */
  workspacesHydrated: boolean;
  /** Currently selected workspace context under the active account. */
  activeWorkspaceId: string | null;
}

export type WorkspaceContextAction =
  | {
      type: "SET_WORKSPACES";
      payload: { workspaces: Record<string, WorkspaceEntity>; hydrated: boolean };
    }
  | { type: "SET_ACTIVE_WORKSPACE"; payload: string | null }
  | { type: "RESET" };

export interface WorkspaceContextValue {
  state: WorkspaceContextState;
  dispatch: Dispatch<WorkspaceContextAction>;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

const initialState: WorkspaceContextState = {
  workspaces: {},
  workspacesHydrated: false,
  activeWorkspaceId: null,
};

function workspaceReducer(
  state: WorkspaceContextState,
  action: WorkspaceContextAction,
): WorkspaceContextState {
  switch (action.type) {
    case "SET_WORKSPACES":
      return {
        ...state,
        workspaces: action.payload.workspaces,
        workspacesHydrated: action.payload.hydrated,
      };
    case "SET_ACTIVE_WORKSPACE":
      if (state.activeWorkspaceId === action.payload) return state;
      return { ...state, activeWorkspaceId: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

// ── Provider ─────────────────────────────────────────────────────────────────

export function WorkspaceContextProvider({ children }: { children: ReactNode }) {
  const { state: appState } = useApp();
  const activeAccountId = appState.activeAccount?.id ?? null;
  const [state, dispatch] = useReducer(workspaceReducer, initialState);

  // Reset workspace state when account changes
  useEffect(() => {
    if (!activeAccountId) {
      dispatch({ type: "RESET" });
      return;
    }
    dispatch({ type: "SET_WORKSPACES", payload: { workspaces: {}, hydrated: false } });
  }, [activeAccountId]);

  // Restore active workspace from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!activeAccountId) {
      dispatch({ type: "SET_ACTIVE_WORKSPACE", payload: null });
      return;
    }
    const storedWorkspaceId = window.localStorage.getItem(
      getWorkspaceStorageKey(activeAccountId),
    );
    dispatch({ type: "SET_ACTIVE_WORKSPACE", payload: storedWorkspaceId || null });
  }, [activeAccountId]);

  // Persist active workspace to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!activeAccountId) return;
    const storageKey = getWorkspaceStorageKey(activeAccountId);
    if (!state.activeWorkspaceId) {
      window.localStorage.removeItem(storageKey);
      return;
    }
    window.localStorage.setItem(storageKey, state.activeWorkspaceId);
  }, [activeAccountId, state.activeWorkspaceId]);

  // Subscribe to workspaces for the active account
  useEffect(() => {
    if (!activeAccountId) {
      dispatch({ type: "SET_WORKSPACES", payload: { workspaces: {}, hydrated: true } });
      return;
    }

    const unsubscribe = subscribeToWorkspacesForAccount(
      activeAccountId,
      (workspaces) => {
        dispatch({
          type: "SET_WORKSPACES",
          payload: { workspaces: toWorkspaceMap(workspaces), hydrated: true },
        });
      },
    );

    return () => unsubscribe();
  }, [activeAccountId]);

  return (
    <WorkspaceContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useWorkspaceContext() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error("useWorkspaceContext must be used within WorkspaceContextProvider");
  }
  return ctx;
}
````

## File: modules/workspace/interfaces/web/state/workspace-session.ts
````typescript
const LAST_ACTIVE_WORKSPACE_STORAGE_PREFIX = "xuanwu_last_active_workspace:";

export function getWorkspaceStorageKey(accountId: string): string {
  return `${LAST_ACTIVE_WORKSPACE_STORAGE_PREFIX}${accountId}`;
}
````

## File: modules/workspace/interfaces/web/state/workspace-settings.ts
````typescript
import type { WorkspaceEntity } from "../../api/contracts";

export interface WorkspaceCustomRoleDraft {
  readonly roleId: string;
  readonly roleName: string;
  readonly role: string;
}

export interface WorkspaceSettingsDraft {
  readonly name: string;
  readonly visibility: WorkspaceEntity["visibility"];
  readonly lifecycleState: WorkspaceEntity["lifecycleState"];
  readonly street: string;
  readonly city: string;
  readonly state: string;
  readonly postalCode: string;
  readonly country: string;
  readonly details: string;
  readonly managerId: string;
  readonly supervisorId: string;
  readonly safetyOfficerId: string;
  readonly customRoles: WorkspaceCustomRoleDraft[];
}

export function createWorkspaceCustomRoleDraft(): WorkspaceCustomRoleDraft {
  return {
    roleId: crypto.randomUUID(),
    roleName: "",
    role: "",
  };
}

export function createSettingsDraft(workspace: WorkspaceEntity): WorkspaceSettingsDraft {
  return {
    name: workspace.name,
    visibility: workspace.visibility,
    lifecycleState: workspace.lifecycleState,
    street: workspace.address?.street ?? "",
    city: workspace.address?.city ?? "",
    state: workspace.address?.state ?? "",
    postalCode: workspace.address?.postalCode ?? "",
    country: workspace.address?.country ?? "",
    details: workspace.address?.details ?? "",
    managerId: workspace.personnel?.managerId ?? "",
    supervisorId: workspace.personnel?.supervisorId ?? "",
    safetyOfficerId: workspace.personnel?.safetyOfficerId ?? "",
    customRoles: workspace.personnel?.customRoles?.map((entry) => ({
      roleId: entry.roleId,
      roleName: entry.roleName,
      role: entry.role,
    })) ?? [],
  };
}
````

## File: modules/workspace/interfaces/web/utils/workspace-map.ts
````typescript
import type { WorkspaceEntity } from "../../api/contracts";

export function toWorkspaceMap(workspaces: WorkspaceEntity[]): Record<string, WorkspaceEntity> {
  return Object.fromEntries(workspaces.map((workspace) => [workspace.id, workspace]));
}

export function resolveWorkspaceFromMap(
  workspaces: Record<string, WorkspaceEntity>,
  id: string,
): WorkspaceEntity | null {
  if (!id || !Object.hasOwn(workspaces, id)) return null;
  return workspaces[id] ?? null;
}
````

## File: modules/workspace/interfaces/web/view-models/workspace-grants.ts
````typescript
import type { WorkspaceGrant } from "../../api/contracts";

export function describeGrant(grant: WorkspaceGrant): string {
  if (grant.teamId) {
    return "Team grant";
  }

  if (grant.userId) {
    return "User grant";
  }

  return "Unscoped grant";
}
````

## File: modules/workspace/interfaces/web/view-models/workspace-supporting-records.ts
````typescript
import type { WorkspaceEntity } from "../../api/contracts";

export interface WorkspacePersonnelEntry {
  label: string;
  value: string;
}

export interface WorkspaceRoleAssignment {
  id: string;
  roleName: string;
  role: string;
}

export interface WorkspaceGovernanceSummary {
  capabilityCount: number;
  teamCount: number;
  locationCount: number;
  grantCount: number;
}

export function getWorkspaceAddressLines(
  workspace: Pick<WorkspaceEntity, "address">,
): string[] {
  if (!workspace.address) {
    return [];
  }

  const { street, city, state, postalCode, country, details } = workspace.address;
  return [
    street,
    [city, state, postalCode].filter(Boolean).join(", "),
    country,
    details,
  ].filter((line): line is string => Boolean(line));
}

export function getWorkspaceRoleAssignments(
  workspace: Pick<WorkspaceEntity, "personnel">,
): WorkspaceRoleAssignment[] {
  return [
    { id: "manager", roleName: "Manager", role: workspace.personnel?.managerId ?? "" },
    { id: "supervisor", roleName: "Supervisor", role: workspace.personnel?.supervisorId ?? "" },
    {
      id: "safety-officer",
      roleName: "Safety officer",
      role: workspace.personnel?.safetyOfficerId ?? "",
    },
    ...((workspace.personnel?.customRoles ?? []).map((entry) => ({
      id: entry.roleId,
      roleName: entry.roleName,
      role: entry.role,
    }))),
  ];
}

export function getWorkspacePersonnelEntries(
  workspace: Pick<WorkspaceEntity, "personnel">,
): WorkspacePersonnelEntry[] {
  return getWorkspaceRoleAssignments(workspace)
    .filter((entry) => Boolean(entry.role))
    .map((entry) => ({
      label: entry.roleName,
      value: entry.role,
    }));
}

export function getWorkspaceGovernanceSummary(
  workspace: Pick<WorkspaceEntity, "capabilities" | "teamIds" | "locations" | "grants">,
): WorkspaceGovernanceSummary {
  return {
    capabilityCount: workspace.capabilities.length,
    teamCount: workspace.teamIds.length,
    locationCount: workspace.locations?.length ?? 0,
    grantCount: workspace.grants.length,
  };
}
````

## File: modules/workspace/subdomains/audit/api/factories.ts
````typescript
import { FirebaseAuditRepository } from "../infrastructure/firebase/FirebaseAuditRepository";

export function makeAuditRepo() {
  return new FirebaseAuditRepository();
}
````

## File: modules/workspace/subdomains/audit/api/index.ts
````typescript
/**
 * workspace/subdomains/audit API boundary.
 */

export type { AuditLogEntity, AuditLogSource } from "../domain/entities/AuditLog";

export type {
  AuditLog,
  AuditAction,
  AuditSeverity,
  ChangeRecord,
} from "../domain/schema";

export { AuditLogSchema, AUDIT_ACTIONS, AUDIT_SEVERITIES } from "../domain/schema";

export {
  getOrganizationAuditLogs,
  getWorkspaceAuditLogs,
} from "../interfaces/queries/audit.queries";

export { WorkspaceAuditTab } from "../interfaces/components/WorkspaceAuditTab";
export { AuditStream } from "../interfaces/components/AuditStream";
export { RecordAuditEntryUseCase } from "../application/use-cases/record-audit-entry.use-case";
````

## File: modules/workspace/subdomains/audit/application/dto/audit.dto.ts
````typescript
/**
 * Application-layer DTO re-exports for the audit subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
export type { AuditLogEntity, AuditLogSource } from "../../domain/entities/AuditLog";
export type { AuditSeverity } from "../../domain/schema";
````

## File: modules/workspace/subdomains/audit/application/queries/list-audit-logs.queries.ts
````typescript
import type { AuditLogEntity } from "../../domain/entities/AuditLog";
import type { AuditRepository } from "../../domain/repositories/AuditRepository";

export class ListWorkspaceAuditLogsUseCase {
  constructor(private readonly auditRepo: AuditRepository) {}

  execute(workspaceId: string): Promise<AuditLogEntity[]> {
    return this.auditRepo.findByWorkspaceId(workspaceId);
  }
}

export class ListOrganizationAuditLogsUseCase {
  constructor(private readonly auditRepo: AuditRepository) {}

  execute(workspaceIds: string[], maxCount?: number): Promise<AuditLogEntity[]> {
    return this.auditRepo.findByWorkspaceIds(workspaceIds, maxCount);
  }
}
````

## File: modules/workspace/subdomains/audit/application/use-cases/record-audit-entry.use-case.ts
````typescript
import { AuditEntry, type RecordAuditEntryInput } from "../../domain/aggregates/AuditEntry";
import type { AuditDomainEventType } from "../../domain/events";
import type { AuditRepository } from "../../domain/repositories/AuditRepository";

export class RecordAuditEntryUseCase {
  constructor(private readonly repo: AuditRepository) {}

  async execute(input: RecordAuditEntryInput): Promise<AuditDomainEventType[]> {
    const id = crypto.randomUUID();
    const entry = AuditEntry.record(id, input);
    await this.repo.save(entry);
    return entry.pullDomainEvents();
  }
}
````

## File: modules/workspace/subdomains/audit/domain/aggregates/AuditEntry.ts
````typescript
import type { AuditLogSource } from "../entities/AuditLog";
import type { AuditDomainEventType } from "../events";
import type { AuditAction } from "../schema";
import type { AuditSeverity } from "../value-objects";
import type { ChangeRecord } from "../schema";

export interface AuditEntrySnapshot {
	readonly id: string;
	readonly workspaceId: string;
	readonly actorId: string;
	readonly action: AuditAction;
	readonly resourceType: string;
	readonly resourceId: string;
	readonly severity: AuditSeverity;
	readonly detail: string;
	readonly source: AuditLogSource;
	readonly changes: readonly ChangeRecord[];
	readonly recordedAtISO: string;
}

export interface RecordAuditEntryInput {
	readonly workspaceId: string;
	readonly actorId: string;
	readonly action: string;
	readonly resourceType: string;
	readonly resourceId: string;
	readonly severity: string;
	readonly detail: string;
	readonly source: AuditLogSource;
	readonly changes?: readonly ChangeRecord[];
}

/**
 * AuditEntry — Immutable aggregate root for audit records.
 *
 * Audit entries are write-once: once recorded they cannot be modified or deleted.
 * All mutation methods are intentionally absent.
 */
export class AuditEntry {
	private readonly _domainEvents: AuditDomainEventType[] = [];

	private constructor(private readonly _props: AuditEntrySnapshot) {}

	/**
	 * Record a new audit entry. This is the only way to create an AuditEntry.
	 * Validates action and severity via Zod branded types.
	 */
	static record(id: string, input: RecordAuditEntryInput): AuditEntry {
		// Import dynamically is not possible in domain — validate via type narrowing
		// The caller is responsible for passing valid action/severity strings;
		// Zod validation happens at the value-object layer boundary.
		const now = new Date().toISOString();
		const entry = new AuditEntry({
			id,
			workspaceId: input.workspaceId,
			actorId: input.actorId,
			action: input.action as AuditAction,
			resourceType: input.resourceType,
			resourceId: input.resourceId,
			severity: input.severity as AuditSeverity,
			detail: input.detail,
			source: input.source,
			changes: input.changes ?? [],
			recordedAtISO: now,
		});
		entry._domainEvents.push({
			type: "workspace.audit.entry_recorded",
			eventId: crypto.randomUUID(),
			occurredAt: now,
			payload: {
				auditId: id,
				workspaceId: input.workspaceId,
				actorId: input.actorId,
				action: input.action,
				resourceType: input.resourceType,
				resourceId: input.resourceId,
				severity: input.severity,
			},
		});

		// Auto-escalation: critical entries emit an additional alert event
		if (entry.isCritical()) {
			entry._domainEvents.push({
				type: "workspace.audit.critical_detected",
				eventId: crypto.randomUUID(),
				occurredAt: now,
				payload: {
					auditId: id,
					workspaceId: input.workspaceId,
					actorId: input.actorId,
					action: input.action,
					resourceType: input.resourceType,
				},
			});
		}

		return entry;
	}

	static reconstitute(snapshot: AuditEntrySnapshot): AuditEntry {
		return new AuditEntry({ ...snapshot });
	}

	// ── Query methods (audit is immutable — no mutation) ─────────────────────

	/** Returns true when severity is "critical". */
	isCritical(): boolean {
		return this._props.severity === ("critical" as AuditSeverity);
	}

	/** Returns true when severity is "critical" or "high". */
	isHighSeverity(): boolean {
		return (
			this._props.severity === ("critical" as AuditSeverity) ||
			this._props.severity === ("high" as AuditSeverity)
		);
	}

	// ── Getters ──────────────────────────────────────────────────────────────

	get id(): string {
		return this._props.id;
	}

	get workspaceId(): string {
		return this._props.workspaceId;
	}

	get actorId(): string {
		return this._props.actorId;
	}

	get action(): AuditAction {
		return this._props.action;
	}

	get resourceType(): string {
		return this._props.resourceType;
	}

	get resourceId(): string {
		return this._props.resourceId;
	}

	get severity(): AuditSeverity {
		return this._props.severity;
	}

	get detail(): string {
		return this._props.detail;
	}

	get source(): AuditLogSource {
		return this._props.source;
	}

	get changes(): readonly ChangeRecord[] {
		return this._props.changes;
	}

	get recordedAtISO(): string {
		return this._props.recordedAtISO;
	}

	getSnapshot(): Readonly<AuditEntrySnapshot> {
		return Object.freeze({ ...this._props });
	}

	pullDomainEvents(): AuditDomainEventType[] {
		const events = [...this._domainEvents];
		(this._domainEvents as AuditDomainEventType[]).length = 0;
		return events;
	}
}
````

## File: modules/workspace/subdomains/audit/domain/aggregates/index.ts
````typescript
export { AuditEntry } from "./AuditEntry";
export type { AuditEntrySnapshot, RecordAuditEntryInput } from "./AuditEntry";
````

## File: modules/workspace/subdomains/audit/domain/entities/AuditLog.ts
````typescript
export type AuditLogSource = "workspace" | "finance" | "notification" | "system";

/**
 * AuditLogEntity
 * 
 * actorId: Receives platform's "actor reference" published language token.
 * This field DOES NOT own Actor semantics — it consumes the token from platform.
 * (See AGENTS.md ubiquitous language for context map rules.)
 */
export interface AuditLogEntity {
  readonly id: string;
  readonly workspaceId: string;
  readonly actorId: string;
  readonly action: string;
  readonly detail: string;
  readonly source: AuditLogSource;
  readonly occurredAtISO: string;
}
````

## File: modules/workspace/subdomains/audit/domain/events/AuditDomainEvent.ts
````typescript
export interface AuditDomainEvent {
	readonly eventId: string;
	readonly occurredAt: string;
	readonly type: string;
	readonly payload: object;
}

export interface AuditEntryRecordedEvent extends AuditDomainEvent {
	readonly type: "workspace.audit.entry_recorded";
	readonly payload: {
		readonly auditId: string;
		readonly workspaceId: string;
		readonly actorId: string;
		readonly action: string;
		readonly resourceType: string;
		readonly resourceId: string;
		readonly severity: string;
	};
}

export interface CriticalAuditDetectedEvent extends AuditDomainEvent {
	readonly type: "workspace.audit.critical_detected";
	readonly payload: {
		readonly auditId: string;
		readonly workspaceId: string;
		readonly actorId: string;
		readonly action: string;
		readonly resourceType: string;
	};
}

export type AuditDomainEventType = AuditEntryRecordedEvent | CriticalAuditDetectedEvent;
````

## File: modules/workspace/subdomains/audit/domain/events/index.ts
````typescript
export type {
	AuditDomainEvent,
	AuditEntryRecordedEvent,
	CriticalAuditDetectedEvent,
	AuditDomainEventType,
} from "./AuditDomainEvent";
````

## File: modules/workspace/subdomains/audit/domain/index.ts
````typescript
// ── Existing domain types ────────────────────────────────────────────────────
export type { AuditLogEntity, AuditLogSource } from "./entities/AuditLog";
export type { AuditLog, AuditAction, AuditSeverity, ChangeRecord } from "./schema";
export { AuditLogSchema, AUDIT_ACTIONS, AUDIT_SEVERITIES } from "./schema";
export type { AuditRepository } from "./repositories/AuditRepository";

// ── Rich DDD additions ──────────────────────────────────────────────────────
export * from "./aggregates";
export * from "./events";
export * from "./services";
export * from "./value-objects";

// ── Ports layer ──────────────────────────────────────────────────────────────
export type { IAuditPort } from "./ports";
````

## File: modules/workspace/subdomains/audit/domain/ports/index.ts
````typescript
/**
 * workspace/audit domain/ports — driven port interfaces for the audit subdomain.
 *
 * Re-exports the repository contract from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
export type { AuditRepository as IAuditPort } from "../repositories/AuditRepository";
````

## File: modules/workspace/subdomains/audit/domain/repositories/AuditRepository.ts
````typescript
import type { AuditEntry } from "../aggregates/AuditEntry";
import type { AuditLogEntity } from "../entities/AuditLog";

export interface AuditRepository {
  save(entry: AuditEntry): Promise<void>;
  findByWorkspaceId(workspaceId: string): Promise<AuditLogEntity[]>;
  findByWorkspaceIds(workspaceIds: string[], maxCount?: number): Promise<AuditLogEntity[]>;
}
````

## File: modules/workspace/subdomains/audit/domain/schema.ts
````typescript
/**
 * Audit subdomain schema — immutable operation records.
 */

import { z } from "@lib-zod";
import { BaseEntitySchema } from "@shared-types";

export const AUDIT_ACTIONS = ["create", "update", "delete", "login", "export"] as const;
export type AuditAction = (typeof AUDIT_ACTIONS)[number];

export const AUDIT_SEVERITIES = ["low", "medium", "high", "critical"] as const;
export type AuditSeverity = (typeof AUDIT_SEVERITIES)[number];

const ChangeRecordSchema = z.object({
  field: z.string(),
  oldValue: z.unknown(),
  newValue: z.unknown(),
});

export type ChangeRecord = z.infer<typeof ChangeRecordSchema>;

export const AuditLogSchema = BaseEntitySchema.extend({
  action: z.enum(AUDIT_ACTIONS),
  resourceType: z.string(),
  resourceId: z.string(),
  severity: z.enum(AUDIT_SEVERITIES),
  changes: z.array(ChangeRecordSchema).optional(),
});

export type AuditLog = z.infer<typeof AuditLogSchema>;
````

## File: modules/workspace/subdomains/audit/domain/services/AuditRecordingService.ts
````typescript
import { AuditEntry } from "../aggregates/AuditEntry";
import type { RecordAuditEntryInput } from "../aggregates/AuditEntry";
import { createAuditAction } from "../value-objects/AuditAction";
import { createAuditSeverity } from "../value-objects/AuditSeverity";
import { createActorId } from "../value-objects/ActorId";

/**
 * AuditRecordingService — Stateless domain service for recording audit entries.
 *
 * Validates inputs via value-object constructors and delegates to AuditEntry.record().
 * Critical-severity escalation is handled by the aggregate itself.
 */
export class AuditRecordingService {
	/**
	 * Record a new audit entry with full input validation.
	 *
	 * @throws ZodError if action, severity, or actorId is invalid
	 */
	record(id: string, input: RecordAuditEntryInput): AuditEntry {
		// Validate through branded value objects (throws on invalid input)
		createAuditAction(input.action);
		createAuditSeverity(input.severity);
		createActorId(input.actorId);

		return AuditEntry.record(id, input);
	}
}
````

## File: modules/workspace/subdomains/audit/domain/services/index.ts
````typescript
export { AuditRecordingService } from "./AuditRecordingService";
````

## File: modules/workspace/subdomains/audit/domain/value-objects/ActorId.ts
````typescript
import { z } from "@lib-zod";

/**
 * ActorId — receives platform's "actor reference" published language token.
 * 
 * MAPPING (AGENTS.md ubiquitous language):
 * - platform.Actor (upstream) → workspace.audit.ActorId (downstream)
 * - Platform defines the "actor reference" token in its ubiquitous language
 * - workspace.audit consumes this token without redefining Actor semantics
 * - ActorId is a local value object; does NOT own Actor concept
 * 
 * NOTE: Field name uses "Actor" only for clarity; it represents a consumed token.
 */
export const ActorIdSchema = z.string().min(1).brand("ActorId");

export type ActorId = z.infer<typeof ActorIdSchema>;

export function createActorId(raw: string): ActorId {
	return ActorIdSchema.parse(raw);
}

export function unsafeActorId(raw: string): ActorId {
	return raw as ActorId;
}
````

## File: modules/workspace/subdomains/audit/domain/value-objects/AuditAction.ts
````typescript
import { z } from "@lib-zod";

import { AUDIT_ACTIONS } from "../schema";

export const AuditActionSchema = z.enum(AUDIT_ACTIONS).brand("AuditAction");

export type AuditAction = z.infer<typeof AuditActionSchema>;

export function createAuditAction(raw: string): AuditAction {
  return AuditActionSchema.parse(raw);
}

export function unsafeAuditAction(raw: string): AuditAction {
  return raw as AuditAction;
}
````

## File: modules/workspace/subdomains/audit/domain/value-objects/AuditSeverity.ts
````typescript
import { z } from "@lib-zod";

import { AUDIT_SEVERITIES } from "../schema";

export const AuditSeveritySchema = z.enum(AUDIT_SEVERITIES).brand("AuditSeverity");

export type AuditSeverity = z.infer<typeof AuditSeveritySchema>;

export function createAuditSeverity(raw: string): AuditSeverity {
	return AuditSeveritySchema.parse(raw);
}

export function unsafeAuditSeverity(raw: string): AuditSeverity {
	return raw as AuditSeverity;
}

const SEVERITY_LEVELS: Record<string, number> = {
	low: 0,
	medium: 1,
	high: 2,
	critical: 3,
};

/** Numeric level for ordering/comparison (low=0, medium=1, high=2, critical=3). */
export function severityLevel(severity: AuditSeverity): number {
	return SEVERITY_LEVELS[severity] ?? 0;
}

/** Returns true when `severity` is at or above the given threshold. */
export function isAtLeast(severity: AuditSeverity, threshold: AuditSeverity): boolean {
	return severityLevel(severity) >= severityLevel(threshold);
}
````

## File: modules/workspace/subdomains/audit/domain/value-objects/index.ts
````typescript
export { AuditActionSchema, createAuditAction, unsafeAuditAction } from "./AuditAction";
export type { AuditAction } from "./AuditAction";

export { AuditSeveritySchema, createAuditSeverity, unsafeAuditSeverity, severityLevel, isAtLeast } from "./AuditSeverity";
export type { AuditSeverity } from "./AuditSeverity";

export { ActorIdSchema, createActorId, unsafeActorId } from "./ActorId";
export type { ActorId } from "./ActorId";
````

## File: modules/workspace/subdomains/audit/interfaces/components/AuditStream.tsx
````typescript
"use client";

import { format } from "date-fns";
import { zhTW } from "date-fns/locale/zh-TW";
import { ShieldAlert } from "lucide-react";

import { Badge } from "@ui-shadcn/ui/badge";
import { ScrollArea } from "@ui-shadcn/ui/scroll-area";

import type { AuditLogEntity, AuditLogSource } from "../../application/dto/audit.dto";
import type { AuditSeverity } from "../../application/dto/audit.dto";

interface AuditStreamItem {
  id: string;
  actorName: string;
  action: string;
  resourceType: string;
  detail: string;
  severity: AuditSeverity;
  workspaceId: string;
  occurredAtISO: string;
}

const SOURCE_SEVERITY: Record<AuditLogSource, AuditSeverity> = {
  workspace: "low",
  finance: "high",
  notification: "low",
  system: "medium",
};

function toStreamItem(entity: AuditLogEntity): AuditStreamItem {
  return {
    id: entity.id,
    actorName: entity.actorId,
    action: entity.action,
    resourceType: entity.source,
    detail: entity.detail,
    severity: SOURCE_SEVERITY[entity.source] ?? "low",
    workspaceId: entity.workspaceId,
    occurredAtISO: entity.occurredAtISO,
  };
}

const SEVERITY_DOT: Record<AuditSeverity, string> = {
  low: "bg-muted-foreground/40",
  medium: "bg-blue-500",
  high: "bg-orange-500",
  critical: "bg-destructive",
};

const SEVERITY_LABEL: Record<AuditSeverity, string> = {
  low: "低",
  medium: "中",
  high: "高",
  critical: "嚴重",
};

interface AuditRowProps {
  item: AuditStreamItem;
}

function AuditRow({ item }: AuditRowProps) {
  const timeLabel = (() => {
    try {
      return format(new Date(item.occurredAtISO), "yyyy-MM-dd HH:mm:ss", { locale: zhTW });
    } catch {
      return item.occurredAtISO;
    }
  })();

  return (
    <div className="mb-6 ml-6 relative group">
      <span
        className={`absolute -left-[1.85rem] flex h-3.5 w-3.5 items-center justify-center rounded-full ring-2 ring-background ${SEVERITY_DOT[item.severity]}`}
      />

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
        <div className="space-y-0.5 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 text-sm">
            <span className="font-semibold truncate max-w-[120px]">{item.actorName}</span>
            <span className="text-muted-foreground">執行了</span>
            <Badge variant="outline" className="text-xs uppercase px-1.5 py-0">
              {item.action}
            </Badge>
            <span className="text-muted-foreground">於</span>
            <code className="text-xs bg-muted px-1 py-0.5 rounded font-mono">
              {item.resourceType}
            </code>
            {item.severity === "critical" && (
              <ShieldAlert className="h-3.5 w-3.5 text-destructive shrink-0" />
            )}
          </div>

          {item.detail && (
            <p className="text-xs text-muted-foreground">{item.detail}</p>
          )}

          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs px-1.5 py-0">
              {SEVERITY_LABEL[item.severity]}
            </Badge>
            <span className="text-xs text-muted-foreground">@{item.workspaceId}</span>
          </div>
        </div>

        <time className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
          {timeLabel}
        </time>
      </div>
    </div>
  );
}

interface AuditStreamProps {
  logs: readonly AuditLogEntity[];
  height?: number;
}

export function AuditStream({ logs, height = 500 }: AuditStreamProps) {
  if (logs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        目前尚無稽核紀錄。
      </p>
    );
  }

  const items = logs.map(toStreamItem);

  return (
    <ScrollArea className="w-full rounded-md border" style={{ height }}>
      <div className="p-4">
        <div className="relative border-l border-border/60 ml-1.5">
          {items.map((item) => (
            <AuditRow key={item.id} item={item} />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
````

## File: modules/workspace/subdomains/audit/interfaces/components/WorkspaceAuditTab.tsx
````typescript
"use client";

import { useEffect, useState } from "react";

import type { AuditLogEntity } from "../../application/dto/audit.dto";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { Badge } from "@ui-shadcn/ui/badge";
import { getWorkspaceAuditLogs } from "../queries/audit.queries";

function formatAuditDate(value: string) {
  if (!value) {
    return "—";
  }

  try {
    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

interface WorkspaceAuditTabProps {
  readonly workspaceId: string;
}

export function WorkspaceAuditTab({ workspaceId }: WorkspaceAuditTabProps) {
  const [logs, setLogs] = useState<AuditLogEntity[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function loadLogs() {
      setLoadState("loading");

      try {
        const nextLogs = await getWorkspaceAuditLogs(workspaceId);
        if (cancelled) {
          return;
        }

        setLogs(nextLogs);
        setLoadState("loaded");
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[WorkspaceAuditTab] Failed to load audit logs:", error);
        }

        if (!cancelled) {
          setLogs([]);
          setLoadState("error");
        }
      }
    }

    void loadLogs();

    return () => {
      cancelled = true;
    };
  }, [workspaceId]);

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>Audit</CardTitle>
        <CardDescription>
          工作區相關行為紀錄、來源與時間軸。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loadState === "loading" && (
          <p className="text-sm text-muted-foreground">Loading audit log…</p>
        )}

        {loadState === "error" && (
          <p className="text-sm text-destructive">
            無法載入 audit log，請重新整理頁面或稍後再試。
          </p>
        )}

        {loadState === "loaded" && logs.length === 0 && (
          <p className="text-sm text-muted-foreground">
            目前尚未記錄這個工作區的 audit entries。
          </p>
        )}

        {loadState === "loaded" && logs.length > 0 && (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="rounded-xl border border-border/40 px-4 py-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{log.action}</p>
                      <Badge variant="outline">{log.source}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{log.detail || "—"}</p>
                    <p className="text-xs text-muted-foreground">Actor: {log.actorId}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatAuditDate(log.occurredAtISO)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
````

## File: modules/workspace/subdomains/audit/interfaces/queries/audit.queries.ts
````typescript
import type { AuditLogEntity } from "../../application/dto/audit.dto";
import {
  ListOrganizationAuditLogsUseCase,
  ListWorkspaceAuditLogsUseCase,
} from "../../application/queries/list-audit-logs.queries";
import { makeAuditRepo } from "../../api/factories";

const auditRepo = makeAuditRepo();
const listWorkspaceAuditLogsUseCase = new ListWorkspaceAuditLogsUseCase(auditRepo);
const listOrganizationAuditLogsUseCase = new ListOrganizationAuditLogsUseCase(auditRepo);

export async function getWorkspaceAuditLogs(
  workspaceId: string,
): Promise<AuditLogEntity[]> {
  const normalizedWorkspaceId = workspaceId.trim();
  if (!normalizedWorkspaceId) {
    return [];
  }

  return listWorkspaceAuditLogsUseCase.execute(normalizedWorkspaceId);
}

export async function getOrganizationAuditLogs(
  workspaceIds: string[],
  maxCount = 200,
): Promise<AuditLogEntity[]> {
  const normalizedWorkspaceIds = workspaceIds
    .map((workspaceId) => workspaceId.trim())
    .filter(Boolean);

  if (normalizedWorkspaceIds.length === 0) {
    return [];
  }

  return listOrganizationAuditLogsUseCase.execute(normalizedWorkspaceIds, maxCount);
}
````

## File: modules/workspace/subdomains/feed/api/factories.ts
````typescript
import { FirebaseWorkspaceFeedInteractionRepository } from "../infrastructure/firebase/FirebaseWorkspaceFeedInteractionRepository";
import { FirebaseWorkspaceFeedPostRepository } from "../infrastructure/firebase/FirebaseWorkspaceFeedPostRepository";

export function makeWorkspaceFeedPostRepo() {
  return new FirebaseWorkspaceFeedPostRepository();
}

export function makeWorkspaceFeedInteractionRepo() {
  return new FirebaseWorkspaceFeedInteractionRepository();
}
````

## File: modules/workspace/subdomains/feed/api/index.ts
````typescript
export { WorkspaceFeedFacade, workspaceFeedFacade } from "./workspace-feed.facade";
export type {
  CreateWorkspaceFeedPostParams,
  ReplyWorkspaceFeedPostParams,
  RepostWorkspaceFeedPostParams,
  WorkspaceFeedInteractionParams,
} from "./workspace-feed.facade";

export type {
  WorkspaceFeedPost,
  WorkspaceFeedPostType,
} from "../domain/entities/workspace-feed-post.entity";
export {
  WORKSPACE_FEED_POST_TYPES,
} from "../domain/entities/workspace-feed-post.entity";

export {
  getAccountWorkspaceFeed,
  getWorkspaceFeed,
  getWorkspaceFeedPost,
} from "../interfaces/queries/workspace-feed.queries";

export {
  bookmarkWorkspaceFeedPost,
  createWorkspaceFeedPost,
  likeWorkspaceFeedPost,
  replyWorkspaceFeedPost,
  repostWorkspaceFeedPost,
  shareWorkspaceFeedPost,
  viewWorkspaceFeedPost,
} from "../interfaces/_actions/workspace-feed.actions";

export { WorkspaceFeedWorkspaceView } from "../interfaces/components/WorkspaceFeedWorkspaceView";
export { WorkspaceFeedAccountView } from "../interfaces/components/WorkspaceFeedAccountView";
````

## File: modules/workspace/subdomains/feed/api/workspace-feed.facade.ts
````typescript
import type { WorkspaceFeedPost } from "../domain/entities/workspace-feed-post.entity";
import type {
  WorkspaceFeedInteractionRepository,
  WorkspaceFeedPostRepository,
} from "../domain/repositories/workspace-feed.repositories";
import {
  BookmarkWorkspaceFeedPostUseCase,
  CreateWorkspaceFeedPostUseCase,
  GetWorkspaceFeedPostUseCase,
  LikeWorkspaceFeedPostUseCase,
  ListAccountWorkspaceFeedUseCase,
  ListWorkspaceFeedUseCase,
  ReplyWorkspaceFeedPostUseCase,
  RepostWorkspaceFeedPostUseCase,
  ShareWorkspaceFeedPostUseCase,
  ViewWorkspaceFeedPostUseCase,
} from "../application/use-cases/workspace-feed.use-cases";
import {
  FirebaseWorkspaceFeedInteractionRepository,
  FirebaseWorkspaceFeedPostRepository,
} from "../infrastructure";

export interface CreateWorkspaceFeedPostParams {
  accountId: string;
  workspaceId: string;
  authorAccountId: string;
  content: string;
}

export interface ReplyWorkspaceFeedPostParams {
  accountId: string;
  workspaceId: string;
  parentPostId: string;
  authorAccountId: string;
  content: string;
}

export interface RepostWorkspaceFeedPostParams {
  accountId: string;
  workspaceId: string;
  sourcePostId: string;
  actorAccountId: string;
  comment?: string;
}

export interface WorkspaceFeedInteractionParams {
  accountId: string;
  postId: string;
  actorAccountId: string;
}

export class WorkspaceFeedFacade {
  private readonly postRepo: WorkspaceFeedPostRepository;
  private readonly interactionRepo: WorkspaceFeedInteractionRepository;

  constructor(
    postRepo: WorkspaceFeedPostRepository = new FirebaseWorkspaceFeedPostRepository(),
    interactionRepo: WorkspaceFeedInteractionRepository = new FirebaseWorkspaceFeedInteractionRepository(),
  ) {
    this.postRepo = postRepo;
    this.interactionRepo = interactionRepo;
  }

  async createPost(params: CreateWorkspaceFeedPostParams): Promise<string | null> {
    const result = await new CreateWorkspaceFeedPostUseCase(this.postRepo).execute(params);
    return result.success ? result.aggregateId : null;
  }

  async reply(params: ReplyWorkspaceFeedPostParams): Promise<string | null> {
    const result = await new ReplyWorkspaceFeedPostUseCase(this.postRepo).execute(params);
    return result.success ? result.aggregateId : null;
  }

  async repost(params: RepostWorkspaceFeedPostParams): Promise<string | null> {
    const result = await new RepostWorkspaceFeedPostUseCase(this.postRepo).execute(params);
    return result.success ? result.aggregateId : null;
  }

  async like(params: WorkspaceFeedInteractionParams): Promise<boolean> {
    const result = await new LikeWorkspaceFeedPostUseCase(this.postRepo, this.interactionRepo).execute(params);
    return result.success;
  }

  async view(params: WorkspaceFeedInteractionParams): Promise<boolean> {
    const result = await new ViewWorkspaceFeedPostUseCase(this.postRepo, this.interactionRepo).execute(params);
    return result.success;
  }

  async bookmark(params: WorkspaceFeedInteractionParams): Promise<boolean> {
    const result = await new BookmarkWorkspaceFeedPostUseCase(this.postRepo, this.interactionRepo).execute(params);
    return result.success;
  }

  async share(params: WorkspaceFeedInteractionParams): Promise<boolean> {
    const result = await new ShareWorkspaceFeedPostUseCase(this.postRepo, this.interactionRepo).execute(params);
    return result.success;
  }

  async getPost(accountId: string, postId: string): Promise<WorkspaceFeedPost | null> {
    return new GetWorkspaceFeedPostUseCase(this.postRepo).execute(accountId, postId);
  }

  async getWorkspaceFeed(
    accountId: string,
    workspaceId: string,
    maxRows = 50,
  ): Promise<WorkspaceFeedPost[]> {
    return new ListWorkspaceFeedUseCase(this.postRepo).execute({
      accountId,
      workspaceId,
      limit: maxRows,
    });
  }

  async getAccountFeed(accountId: string, maxRows = 50): Promise<WorkspaceFeedPost[]> {
    return new ListAccountWorkspaceFeedUseCase(this.postRepo).execute({
      accountId,
      limit: maxRows,
    });
  }
}

export const workspaceFeedFacade = new WorkspaceFeedFacade();
````

## File: modules/workspace/subdomains/feed/application/dto/workspace-feed.dto.ts
````typescript
import { z } from "@lib-zod";

/**
 * Application-layer DTO re-exports for the feed subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
export type { WorkspaceFeedPost } from "../../domain/entities/workspace-feed-post.entity";

const AccountScopeSchema = z.object({
  accountId: z.string().min(1),
});

const WorkspaceScopeSchema = AccountScopeSchema.extend({
  workspaceId: z.string().min(1),
});

export const FeedLimitSchema = z.number().int().min(1).max(200).default(50);

export const CreateWorkspaceFeedPostSchema = WorkspaceScopeSchema.extend({
  authorAccountId: z.string().min(1),
  content: z.string().trim().min(1).max(5000),
});

export type CreateWorkspaceFeedPostDto = z.infer<typeof CreateWorkspaceFeedPostSchema>;

export const ReplyWorkspaceFeedPostSchema = WorkspaceScopeSchema.extend({
  parentPostId: z.string().min(1),
  authorAccountId: z.string().min(1),
  content: z.string().trim().min(1).max(5000),
});

export type ReplyWorkspaceFeedPostDto = z.infer<typeof ReplyWorkspaceFeedPostSchema>;

export const RepostWorkspaceFeedPostSchema = WorkspaceScopeSchema.extend({
  sourcePostId: z.string().min(1),
  actorAccountId: z.string().min(1),
  comment: z.string().trim().max(1000).optional(),
});

export type RepostWorkspaceFeedPostDto = z.infer<typeof RepostWorkspaceFeedPostSchema>;

export const FeedInteractionSchema = AccountScopeSchema.extend({
  postId: z.string().min(1),
  actorAccountId: z.string().min(1),
});

export type FeedInteractionDto = z.infer<typeof FeedInteractionSchema>;

export const ListWorkspaceFeedSchema = WorkspaceScopeSchema.extend({
  limit: FeedLimitSchema.optional(),
});

export type ListWorkspaceFeedDto = z.infer<typeof ListWorkspaceFeedSchema>;

export const ListAccountFeedSchema = AccountScopeSchema.extend({
  limit: FeedLimitSchema.optional(),
});

export type ListAccountFeedDto = z.infer<typeof ListAccountFeedSchema>;
````

## File: modules/workspace/subdomains/feed/application/queries/workspace-feed-post.queries.ts
````typescript
import type { WorkspaceFeedPost } from "../../domain/entities/workspace-feed-post.entity";
import type { WorkspaceFeedPostRepository } from "../../domain/repositories/workspace-feed.repositories";
import {
  ListWorkspaceFeedSchema,
  type ListWorkspaceFeedDto,
  ListAccountFeedSchema,
  type ListAccountFeedDto,
} from "../dto/workspace-feed.dto";

export class GetWorkspaceFeedPostUseCase {
  constructor(private readonly repo: WorkspaceFeedPostRepository) {}

  async execute(accountId: string, postId: string): Promise<WorkspaceFeedPost | null> {
    if (!accountId.trim() || !postId.trim()) return null;
    return this.repo.findById(accountId, postId);
  }
}

export class ListWorkspaceFeedUseCase {
  constructor(private readonly repo: WorkspaceFeedPostRepository) {}

  async execute(input: ListWorkspaceFeedDto): Promise<WorkspaceFeedPost[]> {
    const parsed = ListWorkspaceFeedSchema.safeParse(input);
    if (!parsed.success) return [];
    return this.repo.listByWorkspaceId(parsed.data.accountId, parsed.data.workspaceId, parsed.data.limit ?? 50);
  }
}

export class ListAccountWorkspaceFeedUseCase {
  constructor(private readonly repo: WorkspaceFeedPostRepository) {}

  async execute(input: ListAccountFeedDto): Promise<WorkspaceFeedPost[]> {
    const parsed = ListAccountFeedSchema.safeParse(input);
    if (!parsed.success) return [];
    return this.repo.listByAccountId(parsed.data.accountId, parsed.data.limit ?? 50);
  }
}
````

## File: modules/workspace/subdomains/feed/application/use-cases/workspace-feed-interaction.use-cases.ts
````typescript
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";

import type {
  WorkspaceFeedInteractionRepository,
  WorkspaceFeedPostRepository,
} from "../../domain/repositories/workspace-feed.repositories";
import { FeedInteractionSchema } from "../dto/workspace-feed.dto";

export class LikeWorkspaceFeedPostUseCase {
  constructor(
    private readonly postRepo: WorkspaceFeedPostRepository,
    private readonly interactionRepo: WorkspaceFeedInteractionRepository,
  ) {}

  async execute(input: { accountId: string; postId: string; actorAccountId: string }): Promise<CommandResult> {
    const parsed = FeedInteractionSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("WORKSPACE_FEED_INVALID_INPUT", parsed.error.message);
    }

    const post = await this.postRepo.findById(parsed.data.accountId, parsed.data.postId);
    if (!post) {
      return commandFailureFrom("WORKSPACE_FEED_POST_NOT_FOUND", "Post not found.");
    }

    const liked = await this.interactionRepo.like(
      parsed.data.accountId,
      parsed.data.postId,
      parsed.data.actorAccountId,
    );
    if (liked) {
      await this.postRepo.patchCounters(parsed.data.accountId, parsed.data.postId, { likeDelta: 1 });
    }

    return commandSuccess(parsed.data.postId, Date.now());
  }
}

export class BookmarkWorkspaceFeedPostUseCase {
  constructor(
    private readonly postRepo: WorkspaceFeedPostRepository,
    private readonly interactionRepo: WorkspaceFeedInteractionRepository,
  ) {}

  async execute(input: { accountId: string; postId: string; actorAccountId: string }): Promise<CommandResult> {
    const parsed = FeedInteractionSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("WORKSPACE_FEED_INVALID_INPUT", parsed.error.message);
    }

    const post = await this.postRepo.findById(parsed.data.accountId, parsed.data.postId);
    if (!post) {
      return commandFailureFrom("WORKSPACE_FEED_POST_NOT_FOUND", "Post not found.");
    }

    const bookmarked = await this.interactionRepo.bookmark(
      parsed.data.accountId,
      parsed.data.postId,
      parsed.data.actorAccountId,
    );
    if (bookmarked) {
      await this.postRepo.patchCounters(parsed.data.accountId, parsed.data.postId, { bookmarkDelta: 1 });
    }

    return commandSuccess(parsed.data.postId, Date.now());
  }
}

export class ViewWorkspaceFeedPostUseCase {
  constructor(
    private readonly postRepo: WorkspaceFeedPostRepository,
    private readonly interactionRepo: WorkspaceFeedInteractionRepository,
  ) {}

  async execute(input: { accountId: string; postId: string; actorAccountId: string }): Promise<CommandResult> {
    const parsed = FeedInteractionSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("WORKSPACE_FEED_INVALID_INPUT", parsed.error.message);
    }

    const post = await this.postRepo.findById(parsed.data.accountId, parsed.data.postId);
    if (!post) {
      return commandFailureFrom("WORKSPACE_FEED_POST_NOT_FOUND", "Post not found.");
    }

    await this.interactionRepo.view(parsed.data.accountId, parsed.data.postId, parsed.data.actorAccountId);
    await this.postRepo.patchCounters(parsed.data.accountId, parsed.data.postId, { viewDelta: 1 });
    return commandSuccess(parsed.data.postId, Date.now());
  }
}

export class ShareWorkspaceFeedPostUseCase {
  constructor(
    private readonly postRepo: WorkspaceFeedPostRepository,
    private readonly interactionRepo: WorkspaceFeedInteractionRepository,
  ) {}

  async execute(input: { accountId: string; postId: string; actorAccountId: string }): Promise<CommandResult> {
    const parsed = FeedInteractionSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("WORKSPACE_FEED_INVALID_INPUT", parsed.error.message);
    }

    const post = await this.postRepo.findById(parsed.data.accountId, parsed.data.postId);
    if (!post) {
      return commandFailureFrom("WORKSPACE_FEED_POST_NOT_FOUND", "Post not found.");
    }

    await this.interactionRepo.share(parsed.data.accountId, parsed.data.postId, parsed.data.actorAccountId);
    await this.postRepo.patchCounters(parsed.data.accountId, parsed.data.postId, { shareDelta: 1 });
    return commandSuccess(parsed.data.postId, Date.now());
  }
}
````

## File: modules/workspace/subdomains/feed/application/use-cases/workspace-feed-post.use-cases.ts
````typescript
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";

import type { WorkspaceFeedPostRepository } from "../../domain/repositories/workspace-feed.repositories";
import {
  CreateWorkspaceFeedPostSchema,
  type CreateWorkspaceFeedPostDto,
  ReplyWorkspaceFeedPostSchema,
  type ReplyWorkspaceFeedPostDto,
  RepostWorkspaceFeedPostSchema,
  type RepostWorkspaceFeedPostDto,
} from "../dto/workspace-feed.dto";

export class CreateWorkspaceFeedPostUseCase {
  constructor(private readonly repo: WorkspaceFeedPostRepository) {}

  async execute(input: CreateWorkspaceFeedPostDto): Promise<CommandResult> {
    const parsed = CreateWorkspaceFeedPostSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("WORKSPACE_FEED_INVALID_INPUT", parsed.error.message);
    }

    const post = await this.repo.createPost(parsed.data);
    return commandSuccess(post.id, Date.now());
  }
}

export class ReplyWorkspaceFeedPostUseCase {
  constructor(private readonly repo: WorkspaceFeedPostRepository) {}

  async execute(input: ReplyWorkspaceFeedPostDto): Promise<CommandResult> {
    const parsed = ReplyWorkspaceFeedPostSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("WORKSPACE_FEED_INVALID_INPUT", parsed.error.message);
    }

    const parent = await this.repo.findById(parsed.data.accountId, parsed.data.parentPostId);
    if (!parent) {
      return commandFailureFrom("WORKSPACE_FEED_PARENT_NOT_FOUND", "Parent post not found.");
    }
    if (parent.workspaceId !== parsed.data.workspaceId) {
      return commandFailureFrom("WORKSPACE_FEED_WORKSPACE_MISMATCH", "Parent post is in another workspace.");
    }

    const reply = await this.repo.createReply(parsed.data);
    return commandSuccess(reply.id, Date.now());
  }
}

export class RepostWorkspaceFeedPostUseCase {
  constructor(private readonly repo: WorkspaceFeedPostRepository) {}

  async execute(input: RepostWorkspaceFeedPostDto): Promise<CommandResult> {
    const parsed = RepostWorkspaceFeedPostSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("WORKSPACE_FEED_INVALID_INPUT", parsed.error.message);
    }

    const source = await this.repo.findById(parsed.data.accountId, parsed.data.sourcePostId);
    if (!source) {
      return commandFailureFrom("WORKSPACE_FEED_SOURCE_NOT_FOUND", "Source post not found.");
    }
    if (source.workspaceId !== parsed.data.workspaceId) {
      return commandFailureFrom("WORKSPACE_FEED_WORKSPACE_MISMATCH", "Source post is in another workspace.");
    }

    const repost = await this.repo.createRepost(parsed.data);
    if (!repost) {
      return commandFailureFrom("WORKSPACE_FEED_REPOST_FAILED", "Failed to create repost.");
    }

    return commandSuccess(repost.id, Date.now());
  }
}

// Re-export read queries for backward compatibility
export {
  GetWorkspaceFeedPostUseCase,
  ListWorkspaceFeedUseCase,
  ListAccountWorkspaceFeedUseCase,
} from "../queries/workspace-feed-post.queries";
````

## File: modules/workspace/subdomains/feed/application/use-cases/workspace-feed.use-cases.ts
````typescript
export {
  CreateWorkspaceFeedPostUseCase,
  ReplyWorkspaceFeedPostUseCase,
  RepostWorkspaceFeedPostUseCase,
  GetWorkspaceFeedPostUseCase,
  ListWorkspaceFeedUseCase,
  ListAccountWorkspaceFeedUseCase,
} from "./workspace-feed-post.use-cases";

export {
  LikeWorkspaceFeedPostUseCase,
  BookmarkWorkspaceFeedPostUseCase,
  ViewWorkspaceFeedPostUseCase,
  ShareWorkspaceFeedPostUseCase,
} from "./workspace-feed-interaction.use-cases";
````

## File: modules/workspace/subdomains/feed/domain/entities/workspace-feed-post.entity.ts
````typescript
export const WORKSPACE_FEED_POST_TYPES = ["post", "reply", "repost"] as const;
export type WorkspaceFeedPostType = (typeof WORKSPACE_FEED_POST_TYPES)[number];

export interface WorkspaceFeedPost {
  id: string;
  accountId: string;
  workspaceId: string;
  authorAccountId: string;
  type: WorkspaceFeedPostType;
  content: string;
  replyToPostId: string | null;
  repostOfPostId: string | null;
  likeCount: number;
  replyCount: number;
  repostCount: number;
  viewCount: number;
  bookmarkCount: number;
  shareCount: number;
  createdAtISO: string;
  updatedAtISO: string;
}

export interface CreateWorkspaceFeedPostInput {
  accountId: string;
  workspaceId: string;
  authorAccountId: string;
  content: string;
}

export interface CreateWorkspaceFeedReplyInput {
  accountId: string;
  workspaceId: string;
  parentPostId: string;
  authorAccountId: string;
  content: string;
}

export interface CreateWorkspaceFeedRepostInput {
  accountId: string;
  workspaceId: string;
  sourcePostId: string;
  actorAccountId: string;
  comment?: string;
}

export interface WorkspaceFeedCounterPatch {
  likeDelta?: number;
  replyDelta?: number;
  repostDelta?: number;
  viewDelta?: number;
  bookmarkDelta?: number;
  shareDelta?: number;
}
````

## File: modules/workspace/subdomains/feed/domain/events/workspace-feed.events.ts
````typescript
export const WORKSPACE_FEED_EVENT_TYPES = [
  "WorkspaceFeedPostCreated",
  "WorkspaceFeedReplyCreated",
  "WorkspaceFeedRepostCreated",
  "WorkspaceFeedPostLiked",
  "WorkspaceFeedPostViewed",
  "WorkspaceFeedPostBookmarked",
  "WorkspaceFeedPostShared",
] as const;

export type WorkspaceFeedEventType = (typeof WORKSPACE_FEED_EVENT_TYPES)[number];

interface WorkspaceFeedBaseEvent {
  type: WorkspaceFeedEventType;
  accountId: string;
  workspaceId: string;
  postId: string;
  actorAccountId: string;
  occurredAtISO: string;
}

export interface WorkspaceFeedPostCreatedEvent extends WorkspaceFeedBaseEvent {
  type: "WorkspaceFeedPostCreated";
}

export interface WorkspaceFeedReplyCreatedEvent extends WorkspaceFeedBaseEvent {
  type: "WorkspaceFeedReplyCreated";
  parentPostId: string;
}

export interface WorkspaceFeedRepostCreatedEvent extends WorkspaceFeedBaseEvent {
  type: "WorkspaceFeedRepostCreated";
  sourcePostId: string;
}

export interface WorkspaceFeedPostLikedEvent extends WorkspaceFeedBaseEvent {
  type: "WorkspaceFeedPostLiked";
}

export interface WorkspaceFeedPostViewedEvent extends WorkspaceFeedBaseEvent {
  type: "WorkspaceFeedPostViewed";
}

export interface WorkspaceFeedPostBookmarkedEvent extends WorkspaceFeedBaseEvent {
  type: "WorkspaceFeedPostBookmarked";
}

export interface WorkspaceFeedPostSharedEvent extends WorkspaceFeedBaseEvent {
  type: "WorkspaceFeedPostShared";
}

export type WorkspaceFeedDomainEvent =
  | WorkspaceFeedPostCreatedEvent
  | WorkspaceFeedReplyCreatedEvent
  | WorkspaceFeedRepostCreatedEvent
  | WorkspaceFeedPostLikedEvent
  | WorkspaceFeedPostViewedEvent
  | WorkspaceFeedPostBookmarkedEvent
  | WorkspaceFeedPostSharedEvent;
````

## File: modules/workspace/subdomains/feed/domain/index.ts
````typescript
export type {
  WorkspaceFeedPost,
  WorkspaceFeedPostType,
  CreateWorkspaceFeedPostInput,
  CreateWorkspaceFeedReplyInput,
  CreateWorkspaceFeedRepostInput,
  WorkspaceFeedCounterPatch,
} from "./entities/workspace-feed-post.entity";

export { WORKSPACE_FEED_POST_TYPES } from "./entities/workspace-feed-post.entity";

export type {
  WorkspaceFeedDomainEvent,
  WorkspaceFeedPostCreatedEvent,
  WorkspaceFeedReplyCreatedEvent,
  WorkspaceFeedRepostCreatedEvent,
  WorkspaceFeedPostLikedEvent,
  WorkspaceFeedPostViewedEvent,
  WorkspaceFeedPostBookmarkedEvent,
  WorkspaceFeedPostSharedEvent,
} from "./events/workspace-feed.events";

export { WORKSPACE_FEED_EVENT_TYPES } from "./events/workspace-feed.events";

export type {
  WorkspaceFeedPostRepository,
  WorkspaceFeedInteractionRepository,
} from "./repositories/workspace-feed.repositories";

// ── Ports layer ──────────────────────────────────────────────────────────────
export type { IWorkspaceFeedPostPort, IWorkspaceFeedInteractionPort } from "./ports";
````

## File: modules/workspace/subdomains/feed/domain/ports/index.ts
````typescript
/**
 * workspace/feed domain/ports — driven port interfaces for the feed subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
export type {
  WorkspaceFeedPostRepository as IWorkspaceFeedPostPort,
  WorkspaceFeedInteractionRepository as IWorkspaceFeedInteractionPort,
} from "../repositories/workspace-feed.repositories";
````

## File: modules/workspace/subdomains/feed/domain/repositories/workspace-feed.repositories.ts
````typescript
import type {
  CreateWorkspaceFeedPostInput,
  CreateWorkspaceFeedReplyInput,
  CreateWorkspaceFeedRepostInput,
  WorkspaceFeedCounterPatch,
  WorkspaceFeedPost,
} from "../entities/workspace-feed-post.entity";

export interface WorkspaceFeedPostRepository {
  createPost(input: CreateWorkspaceFeedPostInput): Promise<WorkspaceFeedPost>;
  createReply(input: CreateWorkspaceFeedReplyInput): Promise<WorkspaceFeedPost>;
  createRepost(input: CreateWorkspaceFeedRepostInput): Promise<WorkspaceFeedPost | null>;
  patchCounters(accountId: string, postId: string, patch: WorkspaceFeedCounterPatch): Promise<void>;
  findById(accountId: string, postId: string): Promise<WorkspaceFeedPost | null>;
  listByWorkspaceId(accountId: string, workspaceId: string, limit: number): Promise<WorkspaceFeedPost[]>;
  listByAccountId(accountId: string, limit: number): Promise<WorkspaceFeedPost[]>;
}

export interface WorkspaceFeedInteractionRepository {
  like(accountId: string, postId: string, actorAccountId: string): Promise<boolean>;
  bookmark(accountId: string, postId: string, actorAccountId: string): Promise<boolean>;
  view(accountId: string, postId: string, actorAccountId: string): Promise<void>;
  share(accountId: string, postId: string, actorAccountId: string): Promise<void>;
}
````

## File: modules/workspace/subdomains/feed/infrastructure/index.ts
````typescript
export { FirebaseWorkspaceFeedPostRepository } from "./firebase/FirebaseWorkspaceFeedPostRepository";
export { FirebaseWorkspaceFeedInteractionRepository } from "./firebase/FirebaseWorkspaceFeedInteractionRepository";
````

## File: modules/workspace/subdomains/feed/interfaces/_actions/workspace-feed.actions.ts
````typescript
"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";

import type {
  CreateWorkspaceFeedPostDto,
  FeedInteractionDto,
  ReplyWorkspaceFeedPostDto,
  RepostWorkspaceFeedPostDto,
} from "../../application/dto/workspace-feed.dto";
import {
  makeWorkspaceFeedInteractionRepo,
  makeWorkspaceFeedPostRepo,
} from "../../api/factories";
import {
  BookmarkWorkspaceFeedPostUseCase,
  CreateWorkspaceFeedPostUseCase,
  LikeWorkspaceFeedPostUseCase,
  ReplyWorkspaceFeedPostUseCase,
  RepostWorkspaceFeedPostUseCase,
  ShareWorkspaceFeedPostUseCase,
  ViewWorkspaceFeedPostUseCase,
} from "../../application/use-cases/workspace-feed.use-cases";

function makePostRepo() {
  return makeWorkspaceFeedPostRepo();
}

function makeInteractionRepo() {
  return makeWorkspaceFeedInteractionRepo();
}

export async function createWorkspaceFeedPost(input: CreateWorkspaceFeedPostDto): Promise<CommandResult> {
  try {
    return await new CreateWorkspaceFeedPostUseCase(makePostRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "WORKSPACE_FEED_CREATE_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function replyWorkspaceFeedPost(input: ReplyWorkspaceFeedPostDto): Promise<CommandResult> {
  try {
    return await new ReplyWorkspaceFeedPostUseCase(makePostRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "WORKSPACE_FEED_REPLY_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function repostWorkspaceFeedPost(input: RepostWorkspaceFeedPostDto): Promise<CommandResult> {
  try {
    return await new RepostWorkspaceFeedPostUseCase(makePostRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "WORKSPACE_FEED_REPOST_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function likeWorkspaceFeedPost(input: FeedInteractionDto): Promise<CommandResult> {
  try {
    return await new LikeWorkspaceFeedPostUseCase(makePostRepo(), makeInteractionRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "WORKSPACE_FEED_LIKE_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function viewWorkspaceFeedPost(input: FeedInteractionDto): Promise<CommandResult> {
  try {
    return await new ViewWorkspaceFeedPostUseCase(makePostRepo(), makeInteractionRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "WORKSPACE_FEED_VIEW_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function bookmarkWorkspaceFeedPost(input: FeedInteractionDto): Promise<CommandResult> {
  try {
    return await new BookmarkWorkspaceFeedPostUseCase(makePostRepo(), makeInteractionRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "WORKSPACE_FEED_BOOKMARK_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function shareWorkspaceFeedPost(input: FeedInteractionDto): Promise<CommandResult> {
  try {
    return await new ShareWorkspaceFeedPostUseCase(makePostRepo(), makeInteractionRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "WORKSPACE_FEED_SHARE_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}
````

## File: modules/workspace/subdomains/feed/interfaces/components/WorkspaceFeedAccountView.tsx
````typescript
"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye, Heart, MessageCircle, Repeat2, Share2, Star } from "lucide-react";

import { useApp } from "@/modules/platform/api";
import { Button } from "@ui-shadcn/ui/button";
import { Textarea } from "@ui-shadcn/ui/textarea";
import { workspaceFeedFacade } from "../../api/workspace-feed.facade";
import type { WorkspaceFeedPost } from "../../application/dto/workspace-feed.dto";

interface WorkspaceFeedAccountViewProps {
  readonly accountId: string;
}

export function WorkspaceFeedAccountView({ accountId }: WorkspaceFeedAccountViewProps) {
  const { state: appState } = useApp();
  const actorId = appState.activeAccount?.id ?? accountId;

  const [posts, setPosts] = useState<WorkspaceFeedPost[]>([]);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [activeReplyPostId, setActiveReplyPostId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actingPostId, setActingPostId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refreshFeed = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rows = await workspaceFeedFacade.getAccountFeed(accountId, 80);
      setPosts(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "載入 account feed 失敗");
    } finally {
      setIsLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    void refreshFeed();
  }, [refreshFeed]);

  async function handleAction(post: WorkspaceFeedPost, action: "like" | "view" | "bookmark" | "share" | "repost") {
    setActingPostId(post.id);
    setError(null);
    try {
      if (action === "like") {
        await workspaceFeedFacade.like({ accountId, postId: post.id, actorAccountId: actorId });
      }
      if (action === "view") {
        await workspaceFeedFacade.view({ accountId, postId: post.id, actorAccountId: actorId });
      }
      if (action === "bookmark") {
        await workspaceFeedFacade.bookmark({ accountId, postId: post.id, actorAccountId: actorId });
      }
      if (action === "share") {
        await workspaceFeedFacade.share({ accountId, postId: post.id, actorAccountId: actorId });
      }
      if (action === "repost") {
        await workspaceFeedFacade.repost({
          accountId,
          workspaceId: post.workspaceId,
          sourcePostId: post.id,
          actorAccountId: actorId,
        });
      }
      await refreshFeed();
    } catch (err) {
      setError(err instanceof Error ? err.message : "互動失敗");
    } finally {
      setActingPostId(null);
    }
  }

  async function handleReply(post: WorkspaceFeedPost) {
    const content = replyDrafts[post.id]?.trim() ?? "";
    if (!content) return;

    setActingPostId(post.id);
    setError(null);
    try {
      await workspaceFeedFacade.reply({
        accountId,
        workspaceId: post.workspaceId,
        parentPostId: post.id,
        authorAccountId: actorId,
        content,
      });
      setReplyDrafts((prev) => ({ ...prev, [post.id]: "" }));
      await refreshFeed();
    } catch (err) {
      setError(err instanceof Error ? err.message : "回覆失敗");
    } finally {
      setActingPostId(null);
    }
  }

  return (
    <>
      {error && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="space-y-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">載入 account feed 中...</p>
        ) : posts.length === 0 ? (
          <p className="text-sm text-muted-foreground">目前沒有任何 workspace 貼文。</p>
        ) : (
          posts.map((post) => (
            <article key={post.id} className="space-y-3 rounded-2xl border border-border/60 bg-background/70 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {post.type.toUpperCase()} · workspace {post.workspaceId} · {new Date(post.createdAtISO).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">by {post.authorAccountId}</p>
              </div>

              <p className="whitespace-pre-wrap text-sm leading-6">{post.content}</p>

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={activeReplyPostId === post.id ? "default" : "outline"}
                  onClick={() => setActiveReplyPostId((current) => (current === post.id ? null : post.id))}
                >
                  <MessageCircle className="mr-1 h-4 w-4" />
                  Reply {post.replyCount}
                </Button>
                <Button size="sm" variant="outline" onClick={() => void handleAction(post, "repost")} disabled={actingPostId === post.id}>
                  <Repeat2 className="mr-1 h-4 w-4" />
                  Repost {post.repostCount}
                </Button>
                <Button size="sm" variant="outline" onClick={() => void handleAction(post, "like")} disabled={actingPostId === post.id}>
                  <Heart className="mr-1 h-4 w-4" />
                  Like {post.likeCount}
                </Button>
                <Button size="sm" variant="outline" onClick={() => void handleAction(post, "view")} disabled={actingPostId === post.id}>
                  <Eye className="mr-1 h-4 w-4" />
                  View {post.viewCount}
                </Button>
                <Button size="sm" variant="outline" onClick={() => void handleAction(post, "bookmark")} disabled={actingPostId === post.id}>
                  <Star className="mr-1 h-4 w-4" />
                  bookmark {post.bookmarkCount}
                </Button>
                <Button size="sm" variant="outline" onClick={() => void handleAction(post, "share")} disabled={actingPostId === post.id}>
                  <Share2 className="mr-1 h-4 w-4" />
                  share {post.shareCount}
                </Button>
              </div>

              {activeReplyPostId === post.id && (
                <div className="space-y-2 rounded-xl border border-border/40 p-3">
                  <Textarea
                    value={replyDrafts[post.id] ?? ""}
                    onChange={(event) => setReplyDrafts((prev) => ({ ...prev, [post.id]: event.target.value }))}
                    placeholder="回覆這則貼文..."
                    rows={2}
                  />
                  <div className="flex justify-end gap-2">
                    <Button size="sm" type="button" variant="ghost" onClick={() => setActiveReplyPostId(null)}>
                      取消
                    </Button>
                    <Button
                      size="sm"
                      type="button"
                      onClick={() => void handleReply(post)}
                      disabled={actingPostId === post.id || !(replyDrafts[post.id] ?? "").trim()}
                    >
                      回覆
                    </Button>
                  </div>
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </>
  );
}
````

## File: modules/workspace/subdomains/feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx
````typescript
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, Heart, MessageCircle, Repeat2, Send, Share2, Star } from "lucide-react";

import { useApp } from "@/modules/platform/api";
import { Avatar, AvatarFallback, AvatarImage } from "@ui-shadcn/ui/avatar";
import { Button } from "@ui-shadcn/ui/button";
import { Textarea } from "@ui-shadcn/ui/textarea";
import { workspaceFeedFacade } from "../../api/workspace-feed.facade";
import type { WorkspaceFeedPost } from "../../application/dto/workspace-feed.dto";

interface WorkspaceFeedWorkspaceViewProps {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly workspaceName: string;
}

export function WorkspaceFeedWorkspaceView({
  accountId,
  workspaceId,
  workspaceName,
}: WorkspaceFeedWorkspaceViewProps) {
  const { state: appState } = useApp();
  const actor = appState.activeAccount;
  const actorId = actor?.id ?? accountId;

  const [posts, setPosts] = useState<WorkspaceFeedPost[]>([]);
  const [composer, setComposer] = useState("");
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [activeReplyPostId, setActiveReplyPostId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [actingPostId, setActingPostId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const actorName = actor?.name ?? "未知";
  const actorAvatar = "photoURL" in (actor ?? {}) ? (actor as { photoURL?: string }).photoURL : undefined;
  const actorInitial = actorName.charAt(0).toUpperCase();

  const canPublish = useMemo(() => composer.trim().length > 0, [composer]);

  const refreshFeed = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rows = await workspaceFeedFacade.getWorkspaceFeed(accountId, workspaceId, 50);
      setPosts(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "載入 feed 失敗");
    } finally {
      setIsLoading(false);
    }
  }, [accountId, workspaceId]);

  useEffect(() => {
    void refreshFeed();
  }, [refreshFeed]);

  async function handlePublish() {
    if (!canPublish || isPublishing) return;
    setIsPublishing(true);
    setError(null);
    try {
      const createdId = await workspaceFeedFacade.createPost({
        accountId,
        workspaceId,
        authorAccountId: actorId,
        content: composer.trim(),
      });
      if (!createdId) {
        setError("建立貼文失敗");
        return;
      }
      setComposer("");
      await refreshFeed();
    } catch (err) {
      setError(err instanceof Error ? err.message : "建立貼文失敗");
    } finally {
      setIsPublishing(false);
    }
  }

  async function handleAction(postId: string, action: "like" | "view" | "bookmark" | "share" | "repost") {
    setActingPostId(postId);
    setError(null);
    try {
      if (action === "like") {
        await workspaceFeedFacade.like({ accountId, postId, actorAccountId: actorId });
      }
      if (action === "view") {
        await workspaceFeedFacade.view({ accountId, postId, actorAccountId: actorId });
      }
      if (action === "bookmark") {
        await workspaceFeedFacade.bookmark({ accountId, postId, actorAccountId: actorId });
      }
      if (action === "share") {
        await workspaceFeedFacade.share({ accountId, postId, actorAccountId: actorId });
      }
      if (action === "repost") {
        const current = posts.find((row) => row.id === postId);
        if (!current) return;
        await workspaceFeedFacade.repost({
          accountId,
          workspaceId: current.workspaceId,
          sourcePostId: postId,
          actorAccountId: actorId,
        });
      }
      await refreshFeed();
    } catch (err) {
      setError(err instanceof Error ? err.message : "互動失敗");
    } finally {
      setActingPostId(null);
    }
  }

  async function handleReply(postId: string) {
    const text = replyDrafts[postId]?.trim() ?? "";
    if (!text) return;
    setActingPostId(postId);
    setError(null);
    try {
      const current = posts.find((row) => row.id === postId);
      if (!current) return;
      await workspaceFeedFacade.reply({
        accountId,
        workspaceId: current.workspaceId,
        parentPostId: postId,
        authorAccountId: actorId,
        content: text,
      });
      setReplyDrafts((prev) => ({ ...prev, [postId]: "" }));
      await refreshFeed();
    } catch (err) {
      setError(err instanceof Error ? err.message : "回覆失敗");
    } finally {
      setActingPostId(null);
    }
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-border/60 bg-card/50 p-6">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 shrink-0">
            <AvatarImage src={actorAvatar} alt={actorName} />
            <AvatarFallback className="text-sm font-bold">{actorInitial}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{workspaceName} Feed</p>
            <p className="text-xs text-muted-foreground">workspaceId: {workspaceId}</p>
          </div>
        </div>
        <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
          live
        </div>
      </header>

      <div className="space-y-3 rounded-2xl border border-border/60 bg-background/80 p-4">
        <Textarea
          value={composer}
          onChange={(event) => setComposer(event.target.value)}
          placeholder="發佈你的想法到 workspace feed..."
          rows={4}
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">actor: {actorName} / account: {accountId}</p>
          <Button type="button" onClick={handlePublish} disabled={!canPublish || isPublishing}>
            <Send className="mr-2 h-4 w-4" />
            {isPublishing ? "送出中..." : "發佈"}
          </Button>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="space-y-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">載入 feed 中...</p>
        ) : posts.length === 0 ? (
          <p className="text-sm text-muted-foreground">目前還沒有貼文，發佈第一則吧。</p>
        ) : (
          posts.map((post) => (
            <article key={post.id} className="space-y-3 rounded-2xl border border-border/60 bg-background/70 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {post.type.toUpperCase()} · {post.workspaceId} · {new Date(post.createdAtISO).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">by {post.authorAccountId}</p>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-6">{post.content}</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={activeReplyPostId === post.id ? "default" : "outline"}
                  onClick={() => setActiveReplyPostId((current) => (current === post.id ? null : post.id))}
                >
                  <MessageCircle className="mr-1 h-4 w-4" />
                  Reply {post.replyCount}
                </Button>
                <Button size="sm" variant="outline" onClick={() => void handleAction(post.id, "repost")} disabled={actingPostId === post.id}>
                  <Repeat2 className="mr-1 h-4 w-4" />
                  Repost {post.repostCount}
                </Button>
                <Button size="sm" variant="outline" onClick={() => void handleAction(post.id, "like")} disabled={actingPostId === post.id}>
                  <Heart className="mr-1 h-4 w-4" />
                  Like {post.likeCount}
                </Button>
                <Button size="sm" variant="outline" onClick={() => void handleAction(post.id, "view")} disabled={actingPostId === post.id}>
                  <Eye className="mr-1 h-4 w-4" />
                  View {post.viewCount}
                </Button>
                <Button size="sm" variant="outline" onClick={() => void handleAction(post.id, "bookmark")} disabled={actingPostId === post.id}>
                  <Star className="mr-1 h-4 w-4" />
                  bookmark {post.bookmarkCount}
                </Button>
                <Button size="sm" variant="outline" onClick={() => void handleAction(post.id, "share")} disabled={actingPostId === post.id}>
                  <Share2 className="mr-1 h-4 w-4" />
                  share {post.shareCount}
                </Button>
              </div>

              {activeReplyPostId === post.id && (
                <div className="space-y-2 rounded-xl border border-border/40 p-3">
                  <Textarea
                    value={replyDrafts[post.id] ?? ""}
                    onChange={(event) => setReplyDrafts((prev) => ({ ...prev, [post.id]: event.target.value }))}
                    placeholder="回覆這則貼文..."
                    rows={2}
                  />
                  <div className="flex justify-end gap-2">
                    <Button size="sm" type="button" variant="ghost" onClick={() => setActiveReplyPostId(null)}>
                      取消
                    </Button>
                    <Button
                      size="sm"
                      type="button"
                      onClick={() => void handleReply(post.id)}
                      disabled={actingPostId === post.id || !(replyDrafts[post.id] ?? "").trim()}
                    >
                      回覆
                    </Button>
                  </div>
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </section>
  );
}
````

## File: modules/workspace/subdomains/feed/interfaces/queries/workspace-feed.queries.ts
````typescript
import type { WorkspaceFeedPost } from "../../application/dto/workspace-feed.dto";
import {
  GetWorkspaceFeedPostUseCase,
  ListAccountWorkspaceFeedUseCase,
  ListWorkspaceFeedUseCase,
} from "../../application/use-cases/workspace-feed.use-cases";
import { makeWorkspaceFeedPostRepo } from "../../api/factories";

export async function getWorkspaceFeedPost(
  accountId: string,
  postId: string,
): Promise<WorkspaceFeedPost | null> {
  return new GetWorkspaceFeedPostUseCase(makeWorkspaceFeedPostRepo()).execute(
    accountId,
    postId,
  );
}

export async function getWorkspaceFeed(
  accountId: string,
  workspaceId: string,
  limit = 50,
): Promise<WorkspaceFeedPost[]> {
  return new ListWorkspaceFeedUseCase(makeWorkspaceFeedPostRepo()).execute({
    accountId,
    workspaceId,
    limit,
  });
}

export async function getAccountWorkspaceFeed(accountId: string, limit = 50): Promise<WorkspaceFeedPost[]> {
  return new ListAccountWorkspaceFeedUseCase(makeWorkspaceFeedPostRepo()).execute({
    accountId,
    limit,
  });
}
````

## File: modules/workspace/subdomains/lifecycle/api/index.ts
````typescript
/**
 * Lifecycle Subdomain — Public API Boundary
 *
 * Cross-subdomain and cross-module consumers import through this entry point.
 */

// --- Application service ---
export {
  WorkspaceLifecycleApplicationService,
} from "../application";
export type { LifecycleServiceDependencies } from "../application";

// --- Domain types (published language for lifecycle) ---
export type {
  CreateWorkspaceCommand,
  UpdateWorkspaceSettingsCommand,
  WorkspaceEntity,
  WorkspaceLifecycleState,
  WorkspaceLifecycleStateInput,
  WorkspaceCreatedEvent,
  WorkspaceDomainEvent,
  WorkspaceLifecycleTransitionedEvent,
  WorkspaceVisibilityChangedEvent,
} from "../domain";

export {
  createWorkspaceCreatedEvent,
  createWorkspaceLifecycleTransitionedEvent,
  createWorkspaceVisibilityChangedEvent,
} from "../domain";
````

## File: modules/workspace/subdomains/lifecycle/application/index.ts
````typescript
/**
 * Lifecycle Subdomain — Application Layer
 *
 * Exports use cases and the application service for lifecycle operations.
 */

export { CreateWorkspaceUseCase, CreateWorkspaceWithCapabilitiesUseCase } from "./use-cases/create-workspace.use-case";
export { UpdateWorkspaceSettingsUseCase } from "./use-cases/update-workspace-settings.use-case";
export { DeleteWorkspaceUseCase } from "./use-cases/delete-workspace.use-case";
export { WorkspaceLifecycleApplicationService } from "./services/WorkspaceLifecycleApplicationService";
export type { LifecycleServiceDependencies } from "./services/WorkspaceLifecycleApplicationService";
````

## File: modules/workspace/subdomains/lifecycle/application/services/WorkspaceLifecycleApplicationService.ts
````typescript
/**
 * Lifecycle Subdomain — Application Service
 *
 * Composes lifecycle use cases with injected dependencies.
 * This is the subdomain's application-layer entry point.
 */

import type { CommandResult } from "@shared-types";
import type { CreateWorkspaceCommand, UpdateWorkspaceSettingsCommand } from "../../domain";
import type { Capability } from "../../../../domain/aggregates/Workspace";
import type {
  WorkspaceRepository,
  WorkspaceCapabilityRepository,
  WorkspaceDomainEventPublisher,
} from "../../domain/ports";
import {
  CreateWorkspaceUseCase,
  CreateWorkspaceWithCapabilitiesUseCase,
} from "../use-cases/create-workspace.use-case";
import { UpdateWorkspaceSettingsUseCase } from "../use-cases/update-workspace-settings.use-case";
import { DeleteWorkspaceUseCase } from "../use-cases/delete-workspace.use-case";

export interface LifecycleServiceDependencies {
  workspaceRepo: WorkspaceRepository;
  workspaceCapabilityRepo: WorkspaceCapabilityRepository;
  eventPublisher: WorkspaceDomainEventPublisher;
}

export class WorkspaceLifecycleApplicationService {
  private readonly createUseCase: CreateWorkspaceUseCase;
  private readonly createWithCapsUseCase: CreateWorkspaceWithCapabilitiesUseCase;
  private readonly updateSettingsUseCase: UpdateWorkspaceSettingsUseCase;
  private readonly deleteUseCase: DeleteWorkspaceUseCase;

  constructor(deps: LifecycleServiceDependencies) {
    const createDeps = {
      workspaceRepo: deps.workspaceRepo,
      workspaceCapabilityRepo: deps.workspaceCapabilityRepo,
      eventPublisher: deps.eventPublisher,
    };
    this.createUseCase = new CreateWorkspaceUseCase(createDeps);
    this.createWithCapsUseCase = new CreateWorkspaceWithCapabilitiesUseCase(createDeps);
    this.updateSettingsUseCase = new UpdateWorkspaceSettingsUseCase({
      workspaceRepo: deps.workspaceRepo,
      eventPublisher: deps.eventPublisher,
    });
    this.deleteUseCase = new DeleteWorkspaceUseCase({
      workspaceRepo: deps.workspaceRepo,
    });
  }

  createWorkspace(command: CreateWorkspaceCommand): Promise<CommandResult> {
    return this.createUseCase.execute(command);
  }

  createWorkspaceWithCapabilities(
    command: CreateWorkspaceCommand,
    capabilities: Capability[],
  ): Promise<CommandResult> {
    return this.createWithCapsUseCase.execute(command, capabilities);
  }

  updateWorkspaceSettings(command: UpdateWorkspaceSettingsCommand): Promise<CommandResult> {
    return this.updateSettingsUseCase.execute(command);
  }

  deleteWorkspace(workspaceId: string): Promise<CommandResult> {
    return this.deleteUseCase.execute(workspaceId);
  }
}
````

## File: modules/workspace/subdomains/lifecycle/application/use-cases/create-workspace.use-case.ts
````typescript
/**
 * Lifecycle Subdomain — Create Workspace Use Case
 *
 * Business intent: Provision a new workspace container within an account scope.
 *
 * DDD Rule 1: Has business behavior (aggregate creation, initial state setup)
 * DDD Rule 2: Has flow (validation → creation → persistence → event)
 * DDD Rule 8: One use case = one business intent (verb: Create)
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { CreateWorkspaceCommand } from "../../domain";
import type { Capability } from "../../../../domain/aggregates/Workspace";
import {
  createWorkspaceAggregate,
  toWorkspaceSnapshot,
} from "../../../../domain/factories/WorkspaceFactory";
import type {
  WorkspaceRepository,
  WorkspaceCapabilityRepository,
  WorkspaceDomainEventPublisher,
  WorkspaceEventPublishMetadata,
} from "../../domain/ports";
import { createWorkspaceCreatedEvent } from "../../domain";

interface CreateWorkspaceDeps {
  readonly workspaceRepo: WorkspaceRepository;
  readonly workspaceCapabilityRepo: WorkspaceCapabilityRepository;
  readonly eventPublisher: WorkspaceDomainEventPublisher;
}

function buildEventMetadata(
  workspaceId: string,
  accountId: string,
  accountType: "user" | "organization",
): WorkspaceEventPublishMetadata {
  return {
    workspaceId,
    organizationId: accountType === "organization" ? accountId : undefined,
  };
}

export class CreateWorkspaceUseCase {
  constructor(private readonly deps: CreateWorkspaceDeps) {}

  async execute(command: CreateWorkspaceCommand): Promise<CommandResult> {
    try {
      const workspace = createWorkspaceAggregate(command);
      const workspaceId = await this.deps.workspaceRepo.save(toWorkspaceSnapshot(workspace));

      await this.deps.eventPublisher.publish(
        createWorkspaceCreatedEvent({
          workspaceId,
          accountId: command.accountId,
          accountType: command.accountType,
          name: command.name,
        }),
        buildEventMetadata(workspaceId, command.accountId, command.accountType),
      );

      return commandSuccess(workspaceId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "WORKSPACE_CREATE_FAILED",
        err instanceof Error ? err.message : "Failed to create workspace",
      );
    }
  }
}

export class CreateWorkspaceWithCapabilitiesUseCase {
  constructor(private readonly deps: CreateWorkspaceDeps) {}

  async execute(
    command: CreateWorkspaceCommand,
    capabilities: Capability[] = [],
  ): Promise<CommandResult> {
    try {
      const workspace = createWorkspaceAggregate(command);
      const workspaceId = await this.deps.workspaceRepo.save(toWorkspaceSnapshot(workspace));

      if (capabilities.length > 0) {
        await this.deps.workspaceCapabilityRepo.mountCapabilities(workspaceId, capabilities);
      }

      await this.deps.eventPublisher.publish(
        createWorkspaceCreatedEvent({
          workspaceId,
          accountId: command.accountId,
          accountType: command.accountType,
          name: command.name,
        }),
        buildEventMetadata(workspaceId, command.accountId, command.accountType),
      );

      return commandSuccess(workspaceId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "WORKSPACE_CREATE_WITH_CAPABILITIES_FAILED",
        err instanceof Error ? err.message : "Failed to create workspace with capabilities",
      );
    }
  }
}
````

## File: modules/workspace/subdomains/lifecycle/application/use-cases/delete-workspace.use-case.ts
````typescript
/**
 * Lifecycle Subdomain — Delete Workspace Use Case
 *
 * Business intent: Remove a workspace container from the system.
 *
 * DDD Rule 1: Has business behavior (existence verification before deletion)
 * DDD Rule 2: Has flow (verify existence → delete → success/failure)
 * DDD Rule 8: One use case = one business intent (verb: Delete)
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { WorkspaceRepository } from "../../domain/ports";

interface DeleteWorkspaceDeps {
  readonly workspaceRepo: WorkspaceRepository;
}

export class DeleteWorkspaceUseCase {
  constructor(private readonly deps: DeleteWorkspaceDeps) {}

  async execute(workspaceId: string): Promise<CommandResult> {
    try {
      const workspace = await this.deps.workspaceRepo.findById(workspaceId);
      if (!workspace) {
        return commandFailureFrom("WORKSPACE_NOT_FOUND", `Workspace ${workspaceId} not found`);
      }

      await this.deps.workspaceRepo.delete(workspaceId);
      return commandSuccess(workspaceId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "WORKSPACE_DELETE_FAILED",
        err instanceof Error ? err.message : "Failed to delete workspace",
      );
    }
  }
}
````

## File: modules/workspace/subdomains/lifecycle/application/use-cases/update-workspace-settings.use-case.ts
````typescript
/**
 * Lifecycle Subdomain — Update Workspace Settings Use Case
 *
 * Business intent: Apply setting changes to an existing workspace with
 * domain validation and lifecycle/visibility change event emission.
 *
 * DDD Rule 1: Has business behavior (aggregate reconstitution, state transition)
 * DDD Rule 2: Has flow (fetch → validate → apply → persist → events)
 * DDD Rule 4: Needs consistency (settings + events must be coherent)
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { UpdateWorkspaceSettingsCommand, WorkspaceEntity } from "../../domain";
import {
  createWorkspaceLifecycleTransitionedEvent,
  createWorkspaceVisibilityChangedEvent,
} from "../../domain";
import {
  reconstituteWorkspaceAggregate,
} from "../../../../domain/factories/WorkspaceFactory";
import type {
  WorkspaceRepository,
  WorkspaceDomainEventPublisher,
  WorkspaceEventPublishMetadata,
} from "../../domain/ports";
import type { Workspace } from "../../../../domain/aggregates/Workspace";

interface UpdateSettingsDeps {
  readonly workspaceRepo: WorkspaceRepository;
  readonly eventPublisher: WorkspaceDomainEventPublisher;
}

function sanitizeSettings(
  workspace: Workspace,
  command: UpdateWorkspaceSettingsCommand,
): UpdateWorkspaceSettingsCommand {
  workspace.applySettings(command);

  return {
    workspaceId: command.workspaceId,
    accountId: command.accountId,
    name: command.name !== undefined ? workspace.name : undefined,
    visibility: command.visibility !== undefined ? workspace.visibility : undefined,
    lifecycleState: command.lifecycleState !== undefined ? workspace.lifecycleState : undefined,
    address: command.address !== undefined ? workspace.address : undefined,
    personnel: command.personnel !== undefined ? workspace.personnel : undefined,
  };
}

function buildEventMetadata(
  workspaceId: string,
  accountId: string,
  accountType: "user" | "organization",
): WorkspaceEventPublishMetadata {
  return {
    workspaceId,
    organizationId: accountType === "organization" ? accountId : undefined,
  };
}

export class UpdateWorkspaceSettingsUseCase {
  constructor(private readonly deps: UpdateSettingsDeps) {}

  async execute(command: UpdateWorkspaceSettingsCommand): Promise<CommandResult> {
    try {
      const previous = await this.deps.workspaceRepo.findByIdForAccount(
        command.accountId,
        command.workspaceId,
      );
      if (!previous) {
        return commandFailureFrom(
          "WORKSPACE_NOT_FOUND",
          `Workspace ${command.workspaceId} not found`,
        );
      }

      const sanitized = sanitizeSettings(reconstituteWorkspaceAggregate(previous), command);
      await this.deps.workspaceRepo.updateSettings(sanitized);

      await this.publishTransitionEvents(command, previous);

      return commandSuccess(command.workspaceId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "WORKSPACE_UPDATE_FAILED",
        err instanceof Error ? err.message : "Failed to update workspace settings",
      );
    }
  }

  private async publishTransitionEvents(
    command: UpdateWorkspaceSettingsCommand,
    previous: WorkspaceEntity,
  ): Promise<void> {
    const metadata = buildEventMetadata(
      command.workspaceId,
      command.accountId,
      previous.accountType,
    );

    if (
      command.lifecycleState !== undefined &&
      command.lifecycleState !== previous.lifecycleState
    ) {
      await this.deps.eventPublisher.publish(
        createWorkspaceLifecycleTransitionedEvent({
          workspaceId: command.workspaceId,
          accountId: command.accountId,
          fromState: previous.lifecycleState,
          toState: command.lifecycleState,
        }),
        metadata,
      );
    }

    if (
      command.visibility !== undefined &&
      command.visibility !== previous.visibility
    ) {
      await this.deps.eventPublisher.publish(
        createWorkspaceVisibilityChangedEvent({
          workspaceId: command.workspaceId,
          accountId: command.accountId,
          fromVisibility: previous.visibility,
          toVisibility: command.visibility,
        }),
        metadata,
      );
    }
  }
}
````

## File: modules/workspace/subdomains/lifecycle/domain/index.ts
````typescript
/**
 * Lifecycle Subdomain — Domain Layer
 *
 * Owns workspace container lifecycle: creation, settings update, deletion,
 * and lifecycle state transitions (preparatory → active → stopped).
 *
 * Depends on root workspace domain aggregate and value objects.
 * Does not duplicate the Workspace aggregate — references it through ports.
 */

// Re-export lifecycle-relevant root domain types for subdomain consumers
export type {
  CreateWorkspaceCommand,
  UpdateWorkspaceSettingsCommand,
  WorkspaceEntity,
} from "../../../domain/aggregates/Workspace";

export type {
  WorkspaceLifecycleState,
  WorkspaceLifecycleStateInput,
} from "../../../domain/value-objects/WorkspaceLifecycleState";

export type {
  WorkspaceCreatedEvent,
  WorkspaceDomainEvent,
  WorkspaceLifecycleTransitionedEvent,
  WorkspaceVisibilityChangedEvent,
} from "../../../domain/events/workspace.events";

export {
  createWorkspaceCreatedEvent,
  createWorkspaceLifecycleTransitionedEvent,
  createWorkspaceVisibilityChangedEvent,
} from "../../../domain/events/workspace.events";
````

## File: modules/workspace/subdomains/lifecycle/domain/ports/index.ts
````typescript
/**
 * Lifecycle Subdomain — Domain Ports
 *
 * These ports define what the lifecycle subdomain needs from the outside world.
 * They reference root domain repository interfaces since the Workspace aggregate
 * lives at the bounded-context root level.
 */

export type { WorkspaceRepository } from "../../../../domain/ports/output/WorkspaceRepository";
export type { WorkspaceCapabilityRepository } from "../../../../domain/ports/output/WorkspaceCapabilityRepository";
export type {
  WorkspaceDomainEventPublisher,
  WorkspaceEventPublishMetadata,
} from "../../../../domain/ports/output/WorkspaceDomainEventPublisher";
````

## File: modules/workspace/subdomains/lifecycle/infrastructure/index.ts
````typescript
/**
 * Lifecycle Subdomain — Infrastructure Layer
 *
 * The lifecycle subdomain uses root-level infrastructure adapters
 * (FirebaseWorkspaceRepository, SharedWorkspaceDomainEventPublisher)
 * injected through ports. No subdomain-specific adapters needed yet.
 */
export {};
````

## File: modules/workspace/subdomains/lifecycle/README.md
````markdown
# Lifecycle

把工作區容器生命週期獨立成正典邊界。

## Ownership

- **Bounded Context**: workspace
- **Subdomain Type**: Active
- **Status**: Active — lifecycle use cases implemented

## Responsibility

- Workspace creation (with optional capabilities)
- Workspace settings update (with lifecycle/visibility transition events)
- Workspace deletion
- Lifecycle state machine (preparatory → active → stopped)

## Dependency Direction

```
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces

## Key Design Decisions

- The Workspace aggregate root lives at context root level (`modules/workspace/domain/`), not inside this subdomain.
- This subdomain's use cases operate on the root aggregate through ports.
- Event publishing follows the "persist-then-publish" pattern.
- The `UpdateWorkspaceSettingsUseCase` consolidates both settings persistence and transition event emission into one cohesive use case, eliminating the prior split where the application service handled event logic.
````

## File: modules/workspace/subdomains/membership/api/index.ts
````typescript
/**
 * Membership Subdomain — Public API Boundary
 *
 * Cross-subdomain and cross-module consumers import through this entry point.
 */

// --- Domain types (published language for membership) ---
export type {
  WorkspaceMemberView,
  WorkspaceMemberPresence,
  WorkspaceMemberAccessSource,
  WorkspaceMemberAccessChannel,
} from "../domain";

// --- Application queries ---
export { fetchWorkspaceMembers } from "../application";
````

## File: modules/workspace/subdomains/membership/application/index.ts
````typescript
/**
 * Membership Subdomain — Application Layer
 *
 * Exports member-related queries for the membership subdomain.
 */

export { fetchWorkspaceMembers } from "./queries/workspace-member.queries";
````

## File: modules/workspace/subdomains/membership/application/queries/workspace-member.queries.ts
````typescript
/**
 * Membership Subdomain — Workspace Member Query Handler
 *
 * Pure read query for workspace members — no business logic.
 * Delegates to workspace query repository for member resolution.
 *
 * DDD Rule 5:  Pure reads → Query, not Use Case.
 * DDD Rule 13: Read → queries/
 */

import type { WorkspaceMemberView } from "../../domain";
import type { WorkspaceQueryRepository } from "../../domain/ports";

export function fetchWorkspaceMembers(
  workspaceQueryRepo: WorkspaceQueryRepository,
  workspaceId: string,
): Promise<WorkspaceMemberView[]> {
  return workspaceQueryRepo.getWorkspaceMembers(workspaceId);
}
````

## File: modules/workspace/subdomains/membership/domain/index.ts
````typescript
/**
 * Membership Subdomain — Domain Layer
 *
 * Owns the workspace member view model and participation concepts.
 * The WorkspaceMemberView is the canonical read model for workspace participants.
 *
 * Per ubiquitous language: "Membership" represents workspace participation,
 * not "User" which belongs to platform identity.
 */

// Re-export membership-relevant domain types from root domain
export type {
  WorkspaceMemberView,
  WorkspaceMemberPresence,
  WorkspaceMemberAccessSource,
  WorkspaceMemberAccessChannel,
} from "../../../domain/entities/WorkspaceMemberView";
````

## File: modules/workspace/subdomains/membership/domain/ports/index.ts
````typescript
/**
 * Membership Subdomain — Domain Ports
 *
 * The membership subdomain needs the workspace query repository port
 * to resolve member views from the root infrastructure layer.
 */

export type { WorkspaceQueryRepository } from "../../../../domain/ports/output/WorkspaceQueryRepository";
````

## File: modules/workspace/subdomains/membership/infrastructure/index.ts
````typescript
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
````

## File: modules/workspace/subdomains/membership/README.md
````markdown
# Membership

把工作區參與關係從平台身份治理中切開。

## Ownership

- **Bounded Context**: workspace
- **Subdomain Type**: Active
- **Status**: Active — member view query implemented

## Responsibility

- Workspace member view model (canonical read model for participants)
- Member resolution queries (merging grants, teams, personnel sources)
- Workspace participation semantics distinct from platform identity

## Ubiquitous Language

- **Membership**: Workspace participation relationship, NOT platform identity
- **WorkspaceMemberView**: Read-only projection of a workspace participant
- **AccessChannel**: The route through which a member gained workspace access (owner, direct, team, personnel)

## Dependency Direction

```
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces

## Key Design Decisions

- WorkspaceMemberView is the membership read model, not a full Membership aggregate (that would come when invitation/seat management is needed).
- Complex member resolution logic (merging from grants, teams, personnel) stays in the root infrastructure adapter since it depends on the full workspace document model.
- The subdomain's query handler delegates to the root WorkspaceQueryRepository port.
````

## File: modules/workspace/subdomains/scheduling/api/factories.ts
````typescript
import { FirebaseDemandRepository } from "../infrastructure/firebase/FirebaseDemandRepository";

export function makeDemandRepo() {
  return new FirebaseDemandRepository();
}
````

## File: modules/workspace/subdomains/scheduling/api/index.ts
````typescript
/**
 * Module: workspace/subdomains/scheduling
 * Layer: api/barrel
 * Purpose: Public anti-corruption layer for scheduling subdomain.
 */

export {
  CreateDemandSchema,
  AssignMemberSchema,
} from "./schema";

export type {
  CreateDemandInput,
  AssignMemberInput,
} from "./schema";

export type {
  WorkDemand,
  DemandStatus,
  DemandPriority,
  CreateWorkDemandCommand,
  AssignWorkDemandCommand,
  WorkDemandDomainEvent,
} from "../domain/types";

export {
  DEMAND_STATUSES,
  DEMAND_STATUS_LABELS,
  DEMAND_PRIORITIES,
  DEMAND_PRIORITY_LABELS,
} from "../domain/types";

export type { AccountMember } from "../interfaces/AccountSchedulingView";
export { WorkspaceSchedulingTab } from "../interfaces/WorkspaceSchedulingTab";
export { AccountSchedulingView } from "../interfaces/AccountSchedulingView";

export { submitWorkDemand, assignWorkDemand } from "../interfaces/_actions/work-demand.actions";
export { getWorkspaceDemands, getAccountDemands } from "../interfaces/queries/work-demand.queries";
````

## File: modules/workspace/subdomains/scheduling/api/schema.ts
````typescript
/**
 * Module: workspace/subdomains/scheduling
 * Layer: api/schema
 * Purpose: Zod validation schemas for WorkDemand commands.
 */

import { z } from "@lib-zod";

export const CreateDemandSchema = z.object({
  workspaceId: z.string().min(1, "workspaceId is required"),
  accountId: z.string().min(1, "accountId is required"),
  requesterId: z.string().min(1, "requesterId is required"),
  title: z.string().min(2, "標題至少需要 2 個字"),
  description: z.string().optional().default(""),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  scheduledAt: z.string().min(1, "請選擇排程日期"),
});

export type CreateDemandInput = z.infer<typeof CreateDemandSchema>;

export const AssignMemberSchema = z.object({
  demandId: z.string().min(1, "demandId is required"),
  userId: z.string().min(1, "userId is required"),
  assignedBy: z.string().min(1, "assignedBy is required"),
});

export type AssignMemberInput = z.infer<typeof AssignMemberSchema>;
````

## File: modules/workspace/subdomains/scheduling/application/dto/work-demand.dto.ts
````typescript
/**
 * Application-layer DTO re-exports for the scheduling subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
export type { WorkDemand, DemandPriority } from "../../domain/types";
export { DEMAND_STATUS_LABELS, DEMAND_PRIORITY_LABELS } from "../../domain/types";

import type { DemandPriority } from "../../domain/types";

export interface CreateDemandInput {
  workspaceId: string;
  accountId: string;
  requesterId: string;
  title: string;
  description?: string;
  priority: DemandPriority;
  scheduledAt: string;
}

export interface AssignMemberInput {
  demandId: string;
  userId: string;
  assignedBy: string;
}
````

## File: modules/workspace/subdomains/scheduling/application/work-demand.use-cases.ts
````typescript
/**
 * Module: workspace/subdomains/scheduling
 * Layer: application/use-cases
 * Purpose: Application services — orchestrate domain logic.
 */

import type { CommandResult } from "@shared-types";
import { commandFailureFrom, commandSuccess } from "@shared-types";

import type { WorkDemand } from "../domain/types";
import type { IDemandRepository } from "../domain/repository";
import type { AssignMemberInput, CreateDemandInput } from "./dto/work-demand.dto";

export class SubmitWorkDemandUseCase {
  constructor(private readonly repo: IDemandRepository) {}

  async execute(input: CreateDemandInput): Promise<CommandResult> {
    try {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const demand: WorkDemand = {
        id,
        workspaceId: input.workspaceId,
        accountId: input.accountId,
        requesterId: input.requesterId,
        title: input.title,
        description: input.description ?? "",
        priority: input.priority,
        scheduledAt: input.scheduledAt,
        status: "open",
        createdAtISO: now,
        updatedAtISO: now,
      };
      await this.repo.save(demand);
      return commandSuccess(id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "WORK_DEMAND_SUBMIT_FAILED",
        err instanceof Error ? err.message : "Failed to submit work demand",
      );
    }
  }
}

export class AssignWorkDemandUseCase {
  constructor(private readonly repo: IDemandRepository) {}

  async execute(input: AssignMemberInput): Promise<CommandResult> {
    try {
      const demand = await this.repo.findById(input.demandId);
      if (!demand) {
        return commandFailureFrom("DEMAND_NOT_FOUND", `Demand ${input.demandId} not found`);
      }
      const updated: WorkDemand = {
        ...demand,
        assignedUserId: input.userId,
        status: "in_progress",
        updatedAtISO: new Date().toISOString(),
      };
      await this.repo.update(updated);
      return commandSuccess(input.demandId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "WORK_DEMAND_ASSIGN_FAILED",
        err instanceof Error ? err.message : "Failed to assign work demand",
      );
    }
  }
}

export class ListWorkspaceDemandsUseCase {
  constructor(private readonly repo: IDemandRepository) {}

  async execute(workspaceId: string): Promise<WorkDemand[]> {
    return this.repo.listByWorkspace(workspaceId);
  }
}

export class ListAccountDemandsUseCase {
  constructor(private readonly repo: IDemandRepository) {}

  async execute(accountId: string): Promise<WorkDemand[]> {
    return this.repo.listByAccount(accountId);
  }
}
````

## File: modules/workspace/subdomains/scheduling/domain/repository.ts
````typescript
/**
 * Module: workspace/subdomains/scheduling
 * Layer: domain/repository
 * Purpose: IDemandRepository port — implemented by infrastructure adapters.
 */

import type { WorkDemand } from "./types";

export interface IDemandRepository {
  listByWorkspace(workspaceId: string): Promise<WorkDemand[]>;
  listByAccount(accountId: string): Promise<WorkDemand[]>;
  save(demand: WorkDemand): Promise<void>;
  update(demand: WorkDemand): Promise<void>;
  findById(id: string): Promise<WorkDemand | null>;
}
````

## File: modules/workspace/subdomains/scheduling/domain/types.ts
````typescript
/**
 * Module: workspace/subdomains/scheduling
 * Layer: domain
 * Purpose: Core WorkDemand entity and value types.
 */

export type DemandStatus = "draft" | "open" | "in_progress" | "completed";

export const DEMAND_STATUSES: readonly DemandStatus[] = [
  "draft",
  "open",
  "in_progress",
  "completed",
] as const;

export const DEMAND_STATUS_LABELS: Record<DemandStatus, string> = {
  draft: "草稿",
  open: "待處理",
  in_progress: "進行中",
  completed: "已完成",
};

export type DemandPriority = "low" | "medium" | "high";

export const DEMAND_PRIORITIES: readonly DemandPriority[] = [
  "low",
  "medium",
  "high",
] as const;

export const DEMAND_PRIORITY_LABELS: Record<DemandPriority, string> = {
  low: "低",
  medium: "中",
  high: "高",
};

export interface WorkDemand {
  readonly id: string;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly requesterId: string;
  readonly title: string;
  readonly description: string;
  readonly status: DemandStatus;
  readonly priority: DemandPriority;
  readonly scheduledAt: string;
  readonly assignedUserId?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateWorkDemandCommand {
  readonly workspaceId: string;
  readonly accountId: string;
  readonly requesterId: string;
  readonly title: string;
  readonly description: string;
  readonly priority: DemandPriority;
  readonly scheduledAt: string;
}

export interface AssignWorkDemandCommand {
  readonly demandId: string;
  readonly assignedUserId: string;
  readonly assignedBy: string;
}

export type WorkDemandCreatedEvent = {
  readonly type: "WORK_DEMAND_CREATED";
  readonly payload: { readonly demandId: string; readonly workspaceId: string };
};

export type WorkDemandAssignedEvent = {
  readonly type: "WORK_DEMAND_ASSIGNED";
  readonly payload: {
    readonly demandId: string;
    readonly assignedUserId: string;
    readonly assignedBy: string;
  };
};

export type WorkDemandDomainEvent =
  | WorkDemandCreatedEvent
  | WorkDemandAssignedEvent;
````

## File: modules/workspace/subdomains/scheduling/infrastructure/mock-demand-repository.ts
````typescript
import type { WorkDemand } from "../domain/types";
import type { IDemandRepository } from "../domain/repository";

const store: WorkDemand[] = [];

export class MockDemandRepository implements IDemandRepository {
  async listByWorkspace(workspaceId: string): Promise<WorkDemand[]> {
    return store.filter((d) => d.workspaceId === workspaceId);
  }

  async listByAccount(accountId: string): Promise<WorkDemand[]> {
    return store.filter((d) => d.accountId === accountId);
  }

  async save(demand: WorkDemand): Promise<void> {
    const existing = store.findIndex((d) => d.id === demand.id);
    if (existing !== -1) {
      store[existing] = demand;
    } else {
      store.push(demand);
    }
  }

  async update(demand: WorkDemand): Promise<void> {
    const idx = store.findIndex((d) => d.id === demand.id);
    if (idx !== -1) {
      store[idx] = demand;
    }
  }

  async findById(id: string): Promise<WorkDemand | null> {
    return store.find((d) => d.id === id) ?? null;
  }
}
````

## File: modules/workspace/subdomains/scheduling/interfaces/_actions/work-demand.actions.ts
````typescript
"use server";

import type { CommandResult } from "@shared-types";
import { commandFailureFrom } from "@shared-types";

import { CreateDemandSchema, AssignMemberSchema } from "../../api/schema";
import type { CreateDemandInput, AssignMemberInput } from "../../api/schema";
import { makeDemandRepo } from "../../api/factories";
import {
  SubmitWorkDemandUseCase,
  AssignWorkDemandUseCase,
} from "../../application/work-demand.use-cases";

function makeRepo() {
  return makeDemandRepo();
}

export async function submitWorkDemand(raw: CreateDemandInput): Promise<CommandResult> {
  const parsed = CreateDemandSchema.safeParse(raw);
  if (!parsed.success) {
    return commandFailureFrom("VALIDATION_FAILED", parsed.error.issues[0]?.message ?? "Validation failed");
  }
  try {
    return await new SubmitWorkDemandUseCase(makeRepo()).execute(parsed.data);
  } catch (err) {
    return commandFailureFrom(
      "WORK_DEMAND_ACTION_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function assignWorkDemand(raw: AssignMemberInput): Promise<CommandResult> {
  const parsed = AssignMemberSchema.safeParse(raw);
  if (!parsed.success) {
    return commandFailureFrom("VALIDATION_FAILED", parsed.error.issues[0]?.message ?? "Validation failed");
  }
  try {
    return await new AssignWorkDemandUseCase(makeRepo()).execute(parsed.data);
  } catch (err) {
    return commandFailureFrom(
      "WORK_DEMAND_ACTION_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}
````

## File: modules/workspace/subdomains/scheduling/interfaces/AccountSchedulingView.tsx
````typescript
"use client";

import { useCallback, useEffect, useState } from "react";

import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-shadcn/ui/select";
import { Users } from "lucide-react";

import type { WorkDemand } from "../application/dto/work-demand.dto";
import { DEMAND_STATUS_LABELS, DEMAND_PRIORITY_LABELS } from "../application/dto/work-demand.dto";
import { assignWorkDemand } from "./_actions/work-demand.actions";
import { getAccountDemands } from "./queries/work-demand.queries";

export interface AccountMember {
  id: string;
  name: string;
}

const PRIORITY_DOT: Record<WorkDemand["priority"], string> = {
  low: "bg-green-400",
  medium: "bg-amber-400",
  high: "bg-red-500",
};

const STATUS_VARIANT: Record<WorkDemand["status"], "default" | "secondary" | "outline" | "destructive"> = {
  draft: "outline",
  open: "secondary",
  in_progress: "default",
  completed: "default",
};

interface AccountSchedulingViewProps {
  readonly accountId: string;
  readonly currentUserId: string;
  readonly availableMembers?: AccountMember[];
}

export function AccountSchedulingView({
  accountId,
  currentUserId,
  availableMembers = [],
}: AccountSchedulingViewProps) {
  const [demands, setDemands] = useState<WorkDemand[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [pendingAssign, setPendingAssign] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadDemands = useCallback(async () => {
    setLoadState("loading");
    try {
      const data = await getAccountDemands(accountId);
      setDemands(data);
      setLoadState("loaded");
    } catch {
      setLoadState("error");
    }
  }, [accountId]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!cancelled) await loadDemands();
    })();
    return () => {
      cancelled = true;
    };
  }, [loadDemands]);

  async function handleAssign(demandId: string, userId: string) {
    setPendingAssign(demandId);
    setActionError(null);
    try {
      const result = await assignWorkDemand({
        demandId,
        userId,
        assignedBy: currentUserId,
      });
      if (!result.success) {
        setActionError(result.error.message);
        return;
      }
      await loadDemands();
    } finally {
      setPendingAssign(null);
    }
  }

  const byWorkspace = demands.reduce<Record<string, WorkDemand[]>>((acc, d) => {
    if (!acc[d.workspaceId]) acc[d.workspaceId] = [];
    acc[d.workspaceId].push(d);
    return acc;
  }, {});

  const workspaceEntries = Object.entries(byWorkspace);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-5 w-5 text-primary" />
        <div>
          <h2 className="text-lg font-semibold">工作需求總覽</h2>
          <p className="text-sm text-muted-foreground">
            顯示名下所有 Workspace 提出的需求，可在此指派成員。
          </p>
        </div>
      </div>

      {actionError && (
        <p role="alert" className="text-sm text-destructive">
          {actionError}
        </p>
      )}

      {loadState === "loading" && (
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          載入中…
        </div>
      )}

      {loadState === "error" && (
        <p className="text-sm text-destructive">載入失敗，請重新整理。</p>
      )}

      {loadState === "loaded" && demands.length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          目前名下所有 Workspace 均無工作需求。
        </div>
      )}

      {loadState === "loaded" && workspaceEntries.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workspaceEntries.map(([wsId, wsDemands]) => (
            <Card key={wsId} className="flex flex-col">
              <CardHeader className="bg-muted/40 pb-3">
                <CardTitle className="text-sm font-semibold truncate">
                  Workspace: <span className="font-mono text-xs">{wsId.slice(0, 8)}…</span>
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {wsDemands.length} 筆需求
                </p>
              </CardHeader>
              <CardContent className="flex-1 space-y-3 p-4">
                {wsDemands.map((demand) => (
                  <div
                    key={demand.id}
                    className="rounded-md border border-border/60 bg-background p-3 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-snug flex-1 min-w-0 truncate">
                        {demand.title}
                      </p>
                      <span
                        title={DEMAND_PRIORITY_LABELS[demand.priority]}
                        className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${PRIORITY_DOT[demand.priority]}`}
                      />
                    </div>

                    <div className="mt-1.5 flex items-center gap-2">
                      <Badge variant={STATUS_VARIANT[demand.status]} className="text-[10px]">
                        {DEMAND_STATUS_LABELS[demand.status]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {demand.scheduledAt}
                      </span>
                    </div>

                    {availableMembers.length > 0 && (
                      <div className="mt-2.5">
                        <p className="mb-1 text-[10px] text-muted-foreground">指派給</p>
                        <Select
                          value={demand.assignedUserId ?? ""}
                          onValueChange={(userId) => {
                            if (userId) void handleAssign(demand.id, userId);
                          }}
                          disabled={pendingAssign === demand.id}
                        >
                          <SelectTrigger className="h-7 text-xs">
                            <SelectValue placeholder="選擇成員…" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableMembers.map((member) => (
                              <SelectItem key={member.id} value={member.id}>
                                {member.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {availableMembers.length === 0 && demand.assignedUserId && (
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        已指派：{demand.assignedUserId}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {loadState === "loaded" && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={loadDemands}>
            重新整理
          </Button>
        </div>
      )}
    </div>
  );
}
````

## File: modules/workspace/subdomains/scheduling/interfaces/components/CalendarWidget.tsx
````typescript
"use client";

import { useMemo, useState } from "react";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameMonth,
  isToday,
  startOfMonth,
  subMonths,
} from "@lib-date-fns";
import { Button } from "@ui-shadcn/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { WorkDemand } from "../../application/dto/work-demand.dto";
import { DEMAND_STATUS_LABELS } from "../../application/dto/work-demand.dto";

interface CalendarWidgetProps {
  demands: WorkDemand[];
  onDayClick?: (date: Date) => void;
}

const DAY_HEADERS = ["日", "一", "二", "三", "四", "五", "六"] as const;

const STATUS_DOT_CLASSES: Record<WorkDemand["status"], string> = {
  draft: "bg-muted-foreground",
  open: "bg-blue-500",
  in_progress: "bg-amber-500",
  completed: "bg-green-500",
};

function CalendarDayCell({
  day,
  isCurrentMonth,
  dayDemands,
  onDayClick,
}: {
  day: Date;
  isCurrentMonth: boolean;
  dayDemands: WorkDemand[];
  onDayClick?: (date: Date) => void;
}) {
  const today = isToday(day);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={format(day, "yyyy-MM-dd")}
      onClick={() => onDayClick?.(day)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onDayClick?.(day);
      }}
      className={[
        "relative min-h-[72px] rounded-lg border p-1.5 text-sm transition-colors",
        isCurrentMonth
          ? "border-border/50 bg-card hover:bg-accent/40 cursor-pointer"
          : "border-transparent bg-muted/20 text-muted-foreground cursor-default",
        today ? "ring-2 ring-primary ring-offset-1" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        className={[
          "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
          today ? "bg-primary text-primary-foreground" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {format(day, "d")}
      </span>

      <div className="mt-1 space-y-0.5">
        {dayDemands.slice(0, 3).map((d) => (
          <div
            key={d.id}
            title={`${d.title} (${DEMAND_STATUS_LABELS[d.status]})`}
            className="flex items-center gap-1 truncate"
          >
            <span
              className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT_CLASSES[d.status]}`}
            />
            <span className="truncate text-[10px] leading-none text-foreground/80">
              {d.title}
            </span>
          </div>
        ))}
        {dayDemands.length > 3 && (
          <span className="text-[10px] text-muted-foreground">
            +{dayDemands.length - 3} more
          </span>
        )}
      </div>
    </div>
  );
}

export function CalendarWidget({ demands, onDayClick }: CalendarWidgetProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(new Date()));

  const monthDays = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
      }),
    [currentMonth],
  );

  const leadingBlanks = useMemo(() => getDay(startOfMonth(currentMonth)), [currentMonth]);

  const demandsByDate = useMemo(() => {
    const map = new Map<string, WorkDemand[]>();
    for (const d of demands) {
      const key = d.scheduledAt.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(d);
    }
    return map;
  }, [demands]);

  function getDayDemands(day: Date): WorkDemand[] {
    return demandsByDate.get(format(day, "yyyy-MM-dd")) ?? [];
  }

  const legendEntries: { status: WorkDemand["status"]; label: string }[] = [
    { status: "open", label: DEMAND_STATUS_LABELS.open },
    { status: "in_progress", label: DEMAND_STATUS_LABELS.in_progress },
    { status: "completed", label: DEMAND_STATUS_LABELS.completed },
    { status: "draft", label: DEMAND_STATUS_LABELS.draft },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">
          {format(currentMonth, "yyyy 年 M 月")}
        </h2>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="上個月"
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentMonth(startOfMonth(new Date()))}
          >
            今天
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="下個月"
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {legendEntries.map(({ status, label }) => (
          <div key={status} className="flex items-center gap-1.5">
            <span
              className={`h-2 w-2 rounded-full ${STATUS_DOT_CLASSES[status]}`}
            />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DAY_HEADERS.map((h) => (
          <div
            key={h}
            className="pb-1 text-center text-xs font-medium text-muted-foreground"
          >
            {h}
          </div>
        ))}

        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}

        {monthDays.map((day) => (
          <CalendarDayCell
            key={day.toISOString()}
            day={day}
            isCurrentMonth={isSameMonth(day, currentMonth)}
            dayDemands={getDayDemands(day)}
            onDayClick={isSameMonth(day, currentMonth) ? onDayClick : undefined}
          />
        ))}
      </div>
    </div>
  );
}
````

## File: modules/workspace/subdomains/scheduling/interfaces/queries/work-demand.queries.ts
````typescript
import type { WorkDemand } from "../../application/dto/work-demand.dto";
import {
  ListWorkspaceDemandsUseCase,
  ListAccountDemandsUseCase,
} from "../../application/work-demand.use-cases";
import { makeDemandRepo } from "../../api/factories";

function makeRepo() {
  return makeDemandRepo();
}

export async function getWorkspaceDemands(workspaceId: string): Promise<WorkDemand[]> {
  const normalizedWorkspaceId = workspaceId.trim();
  if (!normalizedWorkspaceId) {
    return [];
  }
  return new ListWorkspaceDemandsUseCase(makeRepo()).execute(normalizedWorkspaceId);
}

export async function getAccountDemands(accountId: string): Promise<WorkDemand[]> {
  const normalizedAccountId = accountId.trim();
  if (!normalizedAccountId) {
    return [];
  }
  return new ListAccountDemandsUseCase(makeRepo()).execute(normalizedAccountId);
}
````

## File: modules/workspace/subdomains/scheduling/interfaces/WorkspaceSchedulingTab.tsx
````typescript
"use client";

import { useCallback, useEffect, useState } from "react";

import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { Plus } from "lucide-react";

import type { WorkspaceEntity } from "@/modules/workspace/api";

import type { WorkDemand } from "../application/dto/work-demand.dto";
import { DEMAND_STATUS_LABELS, DEMAND_PRIORITY_LABELS } from "../application/dto/work-demand.dto";
import { submitWorkDemand } from "./_actions/work-demand.actions";
import { getWorkspaceDemands } from "./queries/work-demand.queries";
import { CalendarWidget } from "./components/CalendarWidget";
import { CreateDemandForm } from "./components/CreateDemandForm";
import type { CreateDemandFormValues } from "./components/CreateDemandForm";

const STATUS_VARIANT: Record<WorkDemand["status"], "default" | "secondary" | "outline" | "destructive"> = {
  draft: "outline",
  open: "secondary",
  in_progress: "default",
  completed: "default",
};

const PRIORITY_CLASS: Record<WorkDemand["priority"], string> = {
  low: "text-muted-foreground",
  medium: "text-amber-600",
  high: "text-red-600",
};

interface WorkspaceSchedulingTabProps {
  readonly workspace: WorkspaceEntity;
  readonly accountId: string;
  readonly currentUserId: string;
}

export function WorkspaceSchedulingTab({
  workspace,
  accountId,
  currentUserId,
}: WorkspaceSchedulingTabProps) {
  const [demands, setDemands] = useState<WorkDemand[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadDemands = useCallback(async () => {
    setLoadState("loading");
    try {
      const data = await getWorkspaceDemands(workspace.id);
      setDemands(data);
      setLoadState("loaded");
    } catch {
      setLoadState("error");
    }
  }, [workspace.id]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!cancelled) await loadDemands();
    })();
    return () => {
      cancelled = true;
    };
  }, [loadDemands]);

  function handleDayClick(date: Date) {
    setSelectedDate(date);
    setFormOpen(true);
  }

  function handleNewDemand() {
    setSelectedDate(undefined);
    setFormOpen(true);
  }

  async function handleSubmit(values: CreateDemandFormValues) {
    setActionError(null);
    const result = await submitWorkDemand({
      workspaceId: workspace.id,
      accountId,
      requesterId: currentUserId,
      title: values.title,
      description: values.description,
      priority: values.priority,
      scheduledAt: values.scheduledAt,
    });
    if (!result.success) {
      throw new Error(result.error.message);
    }
    await loadDemands();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{workspace.name} — 工作規劃</h2>
          <p className="text-sm text-muted-foreground">
            點擊日期或「新增需求」快速建立工作需求。
          </p>
        </div>
        <Button size="sm" onClick={handleNewDemand}>
          <Plus className="mr-1.5 h-4 w-4" />
          新增需求
        </Button>
      </div>

      {actionError && (
        <p role="alert" className="text-sm text-destructive">
          {actionError}
        </p>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">排程日曆</CardTitle>
          <CardDescription className="text-xs">
            點擊日期快速排程新需求
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadState === "loading" ? (
            <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
              載入中…
            </div>
          ) : (
            <CalendarWidget demands={demands} onDayClick={handleDayClick} />
          )}
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          需求列表 ({demands.length})
        </h3>

        {loadState === "error" && (
          <p className="text-sm text-destructive">載入失敗，請重新整理。</p>
        )}

        {loadState === "loaded" && demands.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            目前尚無需求。點擊日曆日期或「新增需求」開始排程。
          </div>
        )}

        {demands.map((demand) => (
          <div
            key={demand.id}
            className="flex items-start justify-between rounded-lg border border-border/60 bg-card px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-sm">{demand.title}</p>
              {demand.description && (
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {demand.description}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                排程日期：{demand.scheduledAt}
              </p>
            </div>
            <div className="ml-4 flex shrink-0 flex-col items-end gap-1.5">
              <Badge variant={STATUS_VARIANT[demand.status]}>
                {DEMAND_STATUS_LABELS[demand.status]}
              </Badge>
              <span className={`text-xs font-medium ${PRIORITY_CLASS[demand.priority]}`}>
                {DEMAND_PRIORITY_LABELS[demand.priority]}優先
              </span>
              {demand.assignedUserId && (
                <span className="text-xs text-muted-foreground">已指派</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <CreateDemandForm
        open={formOpen}
        initialDate={selectedDate}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
````

## File: modules/workspace/subdomains/sharing/api/index.ts
````typescript
/**
 * Sharing Subdomain — Public API Boundary
 *
 * Cross-subdomain and cross-module consumers import through this entry point.
 */

// --- Application service ---
export {
  WorkspaceSharingApplicationService,
} from "../application";
export type { SharingServiceDependencies } from "../application";

// --- Domain types (published language for sharing) ---
export type {
  WorkspaceGrant,
  WorkspaceAccessPolicy,
} from "../domain";
````

## File: modules/workspace/subdomains/sharing/application/index.ts
````typescript
/**
 * Sharing Subdomain — Application Layer
 *
 * Exports sharing use cases and the application service.
 */

export { GrantTeamAccessUseCase } from "./use-cases/grant-team-access.use-case";
export { GrantIndividualAccessUseCase } from "./use-cases/grant-individual-access.use-case";
export { WorkspaceSharingApplicationService } from "./services/WorkspaceSharingApplicationService";
export type { SharingServiceDependencies } from "./services/WorkspaceSharingApplicationService";
````

## File: modules/workspace/subdomains/sharing/application/services/WorkspaceSharingApplicationService.ts
````typescript
/**
 * Sharing Subdomain — Application Service
 *
 * Composes sharing use cases with injected dependencies.
 */

import type { CommandResult } from "@shared-types";
import type { WorkspaceGrant } from "../../domain";
import type { WorkspaceAccessRepository } from "../../domain/ports";
import { GrantTeamAccessUseCase } from "../use-cases/grant-team-access.use-case";
import { GrantIndividualAccessUseCase } from "../use-cases/grant-individual-access.use-case";

export interface SharingServiceDependencies {
  workspaceAccessRepo: WorkspaceAccessRepository;
}

export class WorkspaceSharingApplicationService {
  private readonly grantTeamUseCase: GrantTeamAccessUseCase;
  private readonly grantIndividualUseCase: GrantIndividualAccessUseCase;

  constructor(deps: SharingServiceDependencies) {
    this.grantTeamUseCase = new GrantTeamAccessUseCase({
      workspaceAccessRepo: deps.workspaceAccessRepo,
    });
    this.grantIndividualUseCase = new GrantIndividualAccessUseCase({
      workspaceAccessRepo: deps.workspaceAccessRepo,
    });
  }

  authorizeWorkspaceTeam(workspaceId: string, teamId: string): Promise<CommandResult> {
    return this.grantTeamUseCase.execute(workspaceId, teamId);
  }

  grantIndividualWorkspaceAccess(
    workspaceId: string,
    grant: WorkspaceGrant,
  ): Promise<CommandResult> {
    return this.grantIndividualUseCase.execute(workspaceId, grant);
  }
}
````

## File: modules/workspace/subdomains/sharing/application/use-cases/grant-individual-access.use-case.ts
````typescript
/**
 * Sharing Subdomain — Grant Individual Access Use Case
 *
 * Business intent: Grant an individual user access to a workspace.
 *
 * DDD Rule 1: Has business behavior (individual access grant)
 * DDD Rule 8: One use case = one business intent (verb: Grant)
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { WorkspaceGrant } from "../../domain";
import type { WorkspaceAccessRepository } from "../../domain/ports";

interface GrantIndividualAccessDeps {
  readonly workspaceAccessRepo: WorkspaceAccessRepository;
}

export class GrantIndividualAccessUseCase {
  constructor(private readonly deps: GrantIndividualAccessDeps) {}

  async execute(workspaceId: string, grant: WorkspaceGrant): Promise<CommandResult> {
    try {
      await this.deps.workspaceAccessRepo.grantIndividualAccess(workspaceId, grant);
      return commandSuccess(workspaceId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "WORKSPACE_GRANT_FAILED",
        err instanceof Error ? err.message : "Failed to grant individual access",
      );
    }
  }
}
````

## File: modules/workspace/subdomains/sharing/application/use-cases/grant-team-access.use-case.ts
````typescript
/**
 * Sharing Subdomain — Grant Team Access Use Case
 *
 * Business intent: Authorize a team to access a workspace.
 *
 * DDD Rule 1: Has business behavior (authorization grant)
 * DDD Rule 8: One use case = one business intent (verb: Grant)
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { WorkspaceAccessRepository } from "../../domain/ports";

interface GrantTeamAccessDeps {
  readonly workspaceAccessRepo: WorkspaceAccessRepository;
}

export class GrantTeamAccessUseCase {
  constructor(private readonly deps: GrantTeamAccessDeps) {}

  async execute(workspaceId: string, teamId: string): Promise<CommandResult> {
    try {
      await this.deps.workspaceAccessRepo.grantTeamAccess(workspaceId, teamId);
      return commandSuccess(workspaceId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "WORKSPACE_TEAM_GRANT_FAILED",
        err instanceof Error ? err.message : "Failed to grant team access",
      );
    }
  }
}
````

## File: modules/workspace/subdomains/sharing/domain/index.ts
````typescript
/**
 * Sharing Subdomain — Domain Layer
 *
 * Owns workspace access grants and sharing scope.
 *
 * Per ubiquitous language: "ShareScope" represents the sharing boundary,
 * not generic "Permission" which belongs to platform access control.
 */

// Re-export sharing-relevant domain types from root domain
export type {
  WorkspaceGrant,
  WorkspaceAccessPolicy,
} from "../../../domain/entities/WorkspaceAccess";
````

## File: modules/workspace/subdomains/sharing/domain/ports/index.ts
````typescript
/**
 * Sharing Subdomain — Domain Ports
 *
 * The sharing subdomain needs the workspace access repository port
 * to manage team and individual access grants.
 */

export type { WorkspaceAccessRepository } from "../../../../domain/ports/output/WorkspaceAccessRepository";
````

## File: modules/workspace/subdomains/sharing/infrastructure/index.ts
````typescript
/**
 * Sharing Subdomain — Infrastructure Layer
 *
 * The sharing subdomain uses the root-level WorkspaceAccessRepository
 * (FirebaseWorkspaceRepository) injected through ports.
 */
export {};
````

## File: modules/workspace/subdomains/sharing/README.md
````markdown
# Sharing

把對外共享與可見性規則收斂到單一上下文。

## Ownership

- **Bounded Context**: workspace
- **Subdomain Type**: Active
- **Status**: Active — access grant use cases implemented

## Responsibility

- Team access grants (authorize a team to access a workspace)
- Individual access grants (grant a user direct workspace access)
- Workspace sharing scope semantics

## Ubiquitous Language

- **ShareScope**: The sharing boundary and visibility extent, NOT generic "Permission"
- **WorkspaceGrant**: An individual access authorization to a workspace
- **WorkspaceAccessPolicy**: The aggregate access policy including grants and team associations

## Dependency Direction

```
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces

## Key Design Decisions

- Access grant use cases take injected WorkspaceAccessRepository through the deps pattern.
- WorkspaceSharingApplicationService composes grant use cases and exposes team/individual grant operations.
- Location management stays at root level (part of Workspace operational profile, not sharing semantics).
````

## File: modules/workspace/subdomains/workspace-workflow/api/contracts.ts
````typescript
/**
 * @module workspace-flow/api
 * @file contracts.ts
 * @description Public contracts exposed through the workspace-flow module boundary.
 *
 * All types, DTOs, and projection helpers that external consumers need are
 * re-exported from this single file.  XState internals (canTransition*, nextStatus,
 * isTerminal*) are intentionally NOT exposed here — status machines are internal.
 *
 * @author workspace-flow
 * @since 2026-03-24
 */

// ── Entity types ──────────────────────────────────────────────────────────────

export type { Task } from "../domain/entities/Task";
export type { Issue } from "../domain/entities/Issue";
export type { Invoice } from "../domain/entities/Invoice";
export type { InvoiceItem } from "../domain/entities/InvoiceItem";

// ── Value objects (enum / list only — no transition helpers) ──────────────────

export type { TaskStatus } from "../domain/value-objects/TaskStatus";
export { TASK_STATUSES } from "../domain/value-objects/TaskStatus";

export type { IssueStatus } from "../domain/value-objects/IssueStatus";
export { ISSUE_STATUSES } from "../domain/value-objects/IssueStatus";

export type { IssueStage } from "../domain/value-objects/IssueStage";
export { ISSUE_STAGES } from "../domain/value-objects/IssueStage";

export type { InvoiceStatus } from "../domain/value-objects/InvoiceStatus";
export { INVOICE_STATUSES } from "../domain/value-objects/InvoiceStatus";

// ── Source reference (content → workspace-flow provenance) ────────────────────

export type { SourceReference, SourceReferenceType } from "../domain/value-objects/SourceReference";

// ── Summary projections ───────────────────────────────────────────────────────

export type {
  TaskSummary,
  IssueSummary,
  InvoiceSummary,
  InvoiceItemSummary,
} from "../interfaces/contracts/workspace-flow.contract";

export {
  toTaskSummary,
  toIssueSummary,
  toInvoiceSummary,
  toInvoiceItemSummary,
} from "../interfaces/contracts/workspace-flow.contract";

// ── CRUD / command DTOs ───────────────────────────────────────────────────────

export type { CreateTaskDto } from "../application/dto/create-task.dto";
export type { UpdateTaskDto } from "../application/dto/update-task.dto";

export type { OpenIssueDto } from "../application/dto/open-issue.dto";
export type { ResolveIssueDto } from "../application/dto/resolve-issue.dto";

export type { AddInvoiceItemDto } from "../application/dto/add-invoice-item.dto";
export type { UpdateInvoiceItemDto } from "../application/dto/update-invoice-item.dto";
export type { RemoveInvoiceItemDto } from "../application/dto/remove-invoice-item.dto";

// ── Query / pagination DTOs ───────────────────────────────────────────────────

export type { TaskQueryDto } from "../application/dto/task-query.dto";
export type { IssueQueryDto } from "../application/dto/issue-query.dto";
export type { InvoiceQueryDto } from "../application/dto/invoice-query.dto";
export type { PaginationDto, PagedResult } from "../application/dto/pagination.dto";

// ── Command / operation result ────────────────────────────────────────────────

export type { CommandResult } from "@shared-types";
````

## File: modules/workspace/subdomains/workspace-workflow/api/factories.ts
````typescript
import { FirebaseInvoiceRepository } from "../infrastructure/repositories/FirebaseInvoiceRepository";
import { FirebaseIssueRepository } from "../infrastructure/repositories/FirebaseIssueRepository";
import { FirebaseTaskRepository } from "../infrastructure/repositories/FirebaseTaskRepository";

export function makeTaskRepo() {
  return new FirebaseTaskRepository();
}

export function makeIssueRepo() {
  return new FirebaseIssueRepository();
}

export function makeInvoiceRepo() {
  return new FirebaseInvoiceRepository();
}
````

## File: modules/workspace/subdomains/workspace-workflow/api/index.ts
````typescript
/**
 * @module workspace-flow/api
 * @file index.ts
 * @description Public cross-module boundary for workspace-flow.
 *
 * External consumers MUST import only from this path:
 *   @/modules/workspace/api
 *
 * Never import from domain/, application/, infrastructure/, or interfaces/ directly.
 * @author workspace-flow
 * @since 2026-03-24
 */

// ── Facade (write + summary-read surface) ────────────────────────────────────

// Composite facade (all three aggregates)
export { WorkspaceFlowFacade } from "./workspace-flow.facade";

// Focused facades (prefer these when only one aggregate is needed)
export { WorkspaceFlowTaskFacade } from "./workspace-flow-task.facade";
export { WorkspaceFlowIssueFacade } from "./workspace-flow-issue.facade";
export { WorkspaceFlowInvoiceFacade } from "./workspace-flow-invoice.facade";

// ── Public contracts ──────────────────────────────────────────────────────────

export type {
  // Entities
  Task,
  Issue,
  Invoice,
  InvoiceItem,
  // Value objects
  TaskStatus,
  IssueStatus,
  IssueStage,
  InvoiceStatus,
  // Summary projections
  TaskSummary,
  IssueSummary,
  InvoiceSummary,
  InvoiceItemSummary,
  // CRUD / command DTOs
  CreateTaskDto,
  UpdateTaskDto,
  OpenIssueDto,
  ResolveIssueDto,
  AddInvoiceItemDto,
  UpdateInvoiceItemDto,
  RemoveInvoiceItemDto,
  // Query / pagination DTOs
  TaskQueryDto,
  IssueQueryDto,
  InvoiceQueryDto,
  PaginationDto,
  PagedResult,
  // Command result
  CommandResult,
} from "./contracts";

export {
  // Value object lists (enum arrays)
  TASK_STATUSES,
  ISSUE_STATUSES,
  ISSUE_STAGES,
  INVOICE_STATUSES,
  // Summary projection helpers
  toTaskSummary,
  toIssueSummary,
  toInvoiceSummary,
  toInvoiceItemSummary,
} from "./contracts";

// ── Read queries (server-side) ────────────────────────────────────────────────

export {
  getWorkspaceFlowTasks,
  getWorkspaceFlowTask,
  getWorkspaceFlowIssues,
  getWorkspaceFlowInvoices,
  getWorkspaceFlowInvoiceItems,
} from "../interfaces/queries/workspace-flow.queries";

// ── UI components ─────────────────────────────────────────────────────────────

export { WorkspaceFlowTab } from "../interfaces/components/WorkspaceFlowTab";

// ── Event listeners (knowledge → workspace-flow integration) ─────────────────

export {
  createKnowledgeToWorkflowListener,
} from "./listeners";

export type {
  KnowledgePageApprovedHandler,
} from "./listeners";
````

## File: modules/workspace/subdomains/workspace-workflow/api/listeners.ts
````typescript
/**
 * @module workspace-flow/api
 * @file listeners.ts
 * @description Public event listener interface for workspace-flow.
 *
 * External modules (primarily the `knowledge` module's event bus) subscribe to
 * workspace-flow through this surface.  The concrete implementation is the
 * `KnowledgeToWorkflowMaterializer` process manager.
 *
 * ## Usage
 * ```ts
 * import { createKnowledgeToWorkflowListener } from "@/modules/workspace/api";
 *
 * const listener = createKnowledgeToWorkflowListener();
 * eventBus.subscribe("knowledge.page_approved", (event) => listener.handle(event));
 * ```
 *
 * @see ADR-001: docs/architecture/adr/ADR-001-knowledge-to-workflow-boundary.md
 */

import { KnowledgeToWorkflowMaterializer } from "../application/process-managers/knowledge-to-workflow-materializer";
import { FirebaseTaskRepository } from "../infrastructure/repositories/FirebaseTaskRepository";
import { FirebaseInvoiceRepository } from "../infrastructure/repositories/FirebaseInvoiceRepository";
import type { PageApprovedEvent } from "@/modules/notion/api";

// ── Public listener factory ───────────────────────────────────────────────────

/**
 * Creates a pre-wired `KnowledgeToWorkflowMaterializer` backed by Firebase repos.
 * Call `handle(event, workspaceId)` from your event bus subscriber.
 */
export function createKnowledgeToWorkflowListener(): KnowledgeToWorkflowMaterializer {
  return new KnowledgeToWorkflowMaterializer(
    new FirebaseTaskRepository(),
    new FirebaseInvoiceRepository(),
  );
}

// ── Listener type contracts ───────────────────────────────────────────────────

/** Shape of any handler that can process a `notion.knowledge.page_approved` event. */
export interface KnowledgePageApprovedHandler {
  handle(event: PageApprovedEvent, workspaceId: string): Promise<boolean>;
}

export type { PageApprovedEvent };
````

## File: modules/workspace/subdomains/workspace-workflow/api/workspace-flow-invoice.facade.ts
````typescript
/**
 * @module workspace-flow/api
 * @file workspace-flow-invoice.facade.ts
 * @description Focused facade for Invoice aggregate write and summary-read operations.
 *
 * Consumers that only need Invoice operations should use this class directly
 * instead of the composite {@link WorkspaceFlowFacade}.
 *
 * @author workspace-flow
 * @since 2026-04-06
 */

import type { InvoiceRepository } from "../domain/repositories/InvoiceRepository";

import { CreateInvoiceUseCase } from "../application/use-cases/create-invoice.use-case";
import { AddInvoiceItemUseCase } from "../application/use-cases/add-invoice-item.use-case";
import { UpdateInvoiceItemUseCase } from "../application/use-cases/update-invoice-item.use-case";
import { RemoveInvoiceItemUseCase } from "../application/use-cases/remove-invoice-item.use-case";
import { SubmitInvoiceUseCase } from "../application/use-cases/submit-invoice.use-case";
import { ReviewInvoiceUseCase } from "../application/use-cases/review-invoice.use-case";
import { ApproveInvoiceUseCase } from "../application/use-cases/approve-invoice.use-case";
import { RejectInvoiceUseCase } from "../application/use-cases/reject-invoice.use-case";
import { PayInvoiceUseCase } from "../application/use-cases/pay-invoice.use-case";
import { CloseInvoiceUseCase } from "../application/use-cases/close-invoice.use-case";

import type { AddInvoiceItemDto } from "../application/dto/add-invoice-item.dto";
import type { UpdateInvoiceItemDto } from "../application/dto/update-invoice-item.dto";
import type { RemoveInvoiceItemDto } from "../application/dto/remove-invoice-item.dto";
import type { InvoiceQueryDto } from "../application/dto/invoice-query.dto";
import type { PaginationDto, PagedResult } from "../application/dto/pagination.dto";

import type { InvoiceSummary } from "../interfaces/contracts/workspace-flow.contract";
import { toInvoiceSummary } from "../interfaces/contracts/workspace-flow.contract";

import type { CommandResult } from "@shared-types";

// ── Pagination helper ─────────────────────────────────────────────────────────

function toPagedResult<T>(items: T[], pagination?: PaginationDto): PagedResult<T> {
  const page = pagination?.page ?? 1;
  const pageSize = pagination?.pageSize ?? (items.length || 20);
  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);
  return { items: paged, total: items.length, page, pageSize, hasMore: start + pageSize < items.length };
}

/**
 * WorkspaceFlowInvoiceFacade
 *
 * Single entry point for all Invoice write and summary-read operations.
 * Requires only InvoiceRepository — no cross-aggregate dependencies.
 */
export class WorkspaceFlowInvoiceFacade {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  // ── Write operations ─────────────────────────────────────────────────────────

  async createInvoice(workspaceId: string): Promise<CommandResult> {
    return new CreateInvoiceUseCase(this.invoiceRepository).execute(workspaceId);
  }

  async addInvoiceItem(dto: AddInvoiceItemDto): Promise<CommandResult> {
    return new AddInvoiceItemUseCase(this.invoiceRepository).execute(dto);
  }

  async updateInvoiceItem(invoiceItemId: string, dto: UpdateInvoiceItemDto): Promise<CommandResult> {
    return new UpdateInvoiceItemUseCase(this.invoiceRepository).execute(invoiceItemId, dto);
  }

  async removeInvoiceItem(dto: RemoveInvoiceItemDto): Promise<CommandResult> {
    return new RemoveInvoiceItemUseCase(this.invoiceRepository).execute(dto.invoiceId, dto.invoiceItemId);
  }

  async submitInvoice(invoiceId: string): Promise<CommandResult> {
    return new SubmitInvoiceUseCase(this.invoiceRepository).execute(invoiceId);
  }

  async reviewInvoice(invoiceId: string): Promise<CommandResult> {
    return new ReviewInvoiceUseCase(this.invoiceRepository).execute(invoiceId);
  }

  async approveInvoice(invoiceId: string): Promise<CommandResult> {
    return new ApproveInvoiceUseCase(this.invoiceRepository).execute(invoiceId);
  }

  async rejectInvoice(invoiceId: string): Promise<CommandResult> {
    return new RejectInvoiceUseCase(this.invoiceRepository).execute(invoiceId);
  }

  async payInvoice(invoiceId: string): Promise<CommandResult> {
    return new PayInvoiceUseCase(this.invoiceRepository).execute(invoiceId);
  }

  async closeInvoice(invoiceId: string): Promise<CommandResult> {
    return new CloseInvoiceUseCase(this.invoiceRepository).execute(invoiceId);
  }

  // ── Read operations ──────────────────────────────────────────────────────────

  async listInvoices(query: InvoiceQueryDto, pagination?: PaginationDto): Promise<PagedResult<InvoiceSummary>> {
    const all = await this.invoiceRepository.findByWorkspaceId(query.workspaceId);
    const filtered = query.status ? all.filter((inv) => inv.status === query.status) : all;
    return toPagedResult(filtered.map(toInvoiceSummary), pagination);
  }

  async getInvoiceSummary(invoiceId: string): Promise<InvoiceSummary | null> {
    const invoice = await this.invoiceRepository.findById(invoiceId);
    return invoice ? toInvoiceSummary(invoice) : null;
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/api/workspace-flow-issue.facade.ts
````typescript
/**
 * @module workspace-flow/api
 * @file workspace-flow-issue.facade.ts
 * @description Focused facade for Issue aggregate write and summary-read operations.
 *
 * Consumers that only need Issue operations should use this class directly
 * instead of the composite {@link WorkspaceFlowFacade}.
 *
 * @author workspace-flow
 * @since 2026-04-06
 */

import type { IssueRepository } from "../domain/repositories/IssueRepository";

import { OpenIssueUseCase } from "../application/use-cases/open-issue.use-case";
import { StartIssueUseCase } from "../application/use-cases/start-issue.use-case";
import { FixIssueUseCase } from "../application/use-cases/fix-issue.use-case";
import { SubmitIssueRetestUseCase } from "../application/use-cases/submit-issue-retest.use-case";
import { PassIssueRetestUseCase } from "../application/use-cases/pass-issue-retest.use-case";
import { FailIssueRetestUseCase } from "../application/use-cases/fail-issue-retest.use-case";
import { ResolveIssueUseCase } from "../application/use-cases/resolve-issue.use-case";
import { CloseIssueUseCase } from "../application/use-cases/close-issue.use-case";

import type { OpenIssueDto } from "../application/dto/open-issue.dto";
import type { ResolveIssueDto } from "../application/dto/resolve-issue.dto";
import type { IssueQueryDto } from "../application/dto/issue-query.dto";
import type { PaginationDto, PagedResult } from "../application/dto/pagination.dto";

import type { IssueSummary } from "../interfaces/contracts/workspace-flow.contract";
import { toIssueSummary } from "../interfaces/contracts/workspace-flow.contract";

import type { CommandResult } from "@shared-types";

// ── Pagination helper ─────────────────────────────────────────────────────────

function toPagedResult<T>(items: T[], pagination?: PaginationDto): PagedResult<T> {
  const page = pagination?.page ?? 1;
  const pageSize = pagination?.pageSize ?? (items.length || 20);
  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);
  return { items: paged, total: items.length, page, pageSize, hasMore: start + pageSize < items.length };
}

/**
 * WorkspaceFlowIssueFacade
 *
 * Single entry point for all Issue write and summary-read operations.
 * Requires only IssueRepository — no cross-aggregate dependencies.
 */
export class WorkspaceFlowIssueFacade {
  constructor(private readonly issueRepository: IssueRepository) {}

  // ── Write operations ─────────────────────────────────────────────────────────

  async openIssue(dto: OpenIssueDto): Promise<CommandResult> {
    return new OpenIssueUseCase(this.issueRepository).execute(dto);
  }

  async startIssue(issueId: string): Promise<CommandResult> {
    return new StartIssueUseCase(this.issueRepository).execute(issueId);
  }

  async fixIssue(issueId: string): Promise<CommandResult> {
    return new FixIssueUseCase(this.issueRepository).execute(issueId);
  }

  async submitIssueRetest(issueId: string): Promise<CommandResult> {
    return new SubmitIssueRetestUseCase(this.issueRepository).execute(issueId);
  }

  async passIssueRetest(issueId: string): Promise<CommandResult> {
    return new PassIssueRetestUseCase(this.issueRepository).execute(issueId);
  }

  async failIssueRetest(issueId: string): Promise<CommandResult> {
    return new FailIssueRetestUseCase(this.issueRepository).execute(issueId);
  }

  async resolveIssue(dto: ResolveIssueDto): Promise<CommandResult> {
    return new ResolveIssueUseCase(this.issueRepository).execute(dto);
  }

  async closeIssue(issueId: string): Promise<CommandResult> {
    return new CloseIssueUseCase(this.issueRepository).execute(issueId);
  }

  // ── Read operations ──────────────────────────────────────────────────────────

  async listIssues(query: IssueQueryDto, pagination?: PaginationDto): Promise<PagedResult<IssueSummary>> {
    const all = await this.issueRepository.findByTaskId(query.taskId);
    const filtered = query.status ? all.filter((i) => i.status === query.status) : all;
    return toPagedResult(filtered.map(toIssueSummary), pagination);
  }

  async getIssueSummary(issueId: string): Promise<IssueSummary | null> {
    const issue = await this.issueRepository.findById(issueId);
    return issue ? toIssueSummary(issue) : null;
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/api/workspace-flow-task.facade.ts
````typescript
/**
 * @module workspace-flow/api
 * @file workspace-flow-task.facade.ts
 * @description Focused facade for Task aggregate write and summary-read operations.
 *
 * Consumers that only need Task operations should use this class directly
 * instead of the composite {@link WorkspaceFlowFacade}.
 *
 * Note: `issueRepository` is required because `passTaskQa` and
 * `approveTaskAcceptance` are cross-aggregate operations that create issues
 * as a side-effect of task state transitions.
 *
 * @author workspace-flow
 * @since 2026-04-06
 */

import type { TaskRepository } from "../domain/repositories/TaskRepository";
import type { IssueRepository } from "../domain/repositories/IssueRepository";

import { CreateTaskUseCase } from "../application/use-cases/create-task.use-case";
import { UpdateTaskUseCase } from "../application/use-cases/update-task.use-case";
import { AssignTaskUseCase } from "../application/use-cases/assign-task.use-case";
import { SubmitTaskToQaUseCase } from "../application/use-cases/submit-task-to-qa.use-case";
import { PassTaskQaUseCase } from "../application/use-cases/pass-task-qa.use-case";
import { ApproveTaskAcceptanceUseCase } from "../application/use-cases/approve-task-acceptance.use-case";
import { ArchiveTaskUseCase } from "../application/use-cases/archive-task.use-case";

import type { CreateTaskDto } from "../application/dto/create-task.dto";
import type { UpdateTaskDto } from "../application/dto/update-task.dto";
import type { TaskQueryDto } from "../application/dto/task-query.dto";
import type { PaginationDto, PagedResult } from "../application/dto/pagination.dto";

import type { TaskSummary } from "../interfaces/contracts/workspace-flow.contract";
import { toTaskSummary } from "../interfaces/contracts/workspace-flow.contract";

import type { CommandResult } from "@shared-types";

// ── Pagination helper ─────────────────────────────────────────────────────────

function toPagedResult<T>(items: T[], pagination?: PaginationDto): PagedResult<T> {
  const page = pagination?.page ?? 1;
  const pageSize = pagination?.pageSize ?? (items.length || 20);
  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);
  return { items: paged, total: items.length, page, pageSize, hasMore: start + pageSize < items.length };
}

/**
 * WorkspaceFlowTaskFacade
 *
 * Single entry point for all Task write and summary-read operations.
 * Requires both TaskRepository and IssueRepository because QA pass and
 * acceptance approval are cross-aggregate transitions that produce issues.
 */
export class WorkspaceFlowTaskFacade {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly issueRepository: IssueRepository,
  ) {}

  // ── Write operations ─────────────────────────────────────────────────────────

  async createTask(dto: CreateTaskDto): Promise<CommandResult> {
    return new CreateTaskUseCase(this.taskRepository).execute(dto);
  }

  async updateTask(taskId: string, dto: UpdateTaskDto): Promise<CommandResult> {
    return new UpdateTaskUseCase(this.taskRepository).execute(taskId, dto);
  }

  async assignTask(taskId: string, assigneeId: string): Promise<CommandResult> {
    return new AssignTaskUseCase(this.taskRepository).execute(taskId, assigneeId);
  }

  async submitTaskToQa(taskId: string): Promise<CommandResult> {
    return new SubmitTaskToQaUseCase(this.taskRepository).execute(taskId);
  }

  /** Cross-aggregate: transitions task to qa_passed and creates a linked issue. */
  async passTaskQa(taskId: string): Promise<CommandResult> {
    return new PassTaskQaUseCase(this.taskRepository, this.issueRepository).execute(taskId);
  }

  /** Cross-aggregate: transitions task to accepted and closes the linked issue. */
  async approveTaskAcceptance(taskId: string): Promise<CommandResult> {
    return new ApproveTaskAcceptanceUseCase(this.taskRepository, this.issueRepository).execute(taskId);
  }

  async archiveTask(taskId: string, invoiceStatus?: string): Promise<CommandResult> {
    return new ArchiveTaskUseCase(this.taskRepository).execute(taskId, invoiceStatus);
  }

  // ── Read operations ──────────────────────────────────────────────────────────

  async listTasks(query: TaskQueryDto, pagination?: PaginationDto): Promise<PagedResult<TaskSummary>> {
    const all = await this.taskRepository.findByWorkspaceId(query.workspaceId);
    const filtered = query.status ? all.filter((t) => t.status === query.status) : all;
    const assigneeFiltered = query.assigneeId
      ? filtered.filter((t) => t.assigneeId === query.assigneeId)
      : filtered;
    return toPagedResult(assigneeFiltered.map(toTaskSummary), pagination);
  }

  async getTaskSummary(taskId: string): Promise<TaskSummary | null> {
    const task = await this.taskRepository.findById(taskId);
    return task ? toTaskSummary(task) : null;
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/api/workspace-flow.facade.ts
````typescript
/**
 * @module workspace-flow/api
 * @file workspace-flow.facade.ts
 * @description Composite facade aggregating Task, Issue, and Invoice operations.
 *
 * Delegates entirely to the three focused facades:
 *   - {@link WorkspaceFlowTaskFacade}   — Task aggregate
 *   - {@link WorkspaceFlowIssueFacade}  — Issue aggregate
 *   - {@link WorkspaceFlowInvoiceFacade} — Invoice aggregate
 *
 * Prefer the focused facades when only one aggregate is needed.
 * Use this composite facade only when all three aggregates must be
 * available through a single construction point.
 *
 * @author workspace-flow
 * @since 2026-03-24
 */

import type { TaskRepository } from "../domain/repositories/TaskRepository";
import type { IssueRepository } from "../domain/repositories/IssueRepository";
import type { InvoiceRepository } from "../domain/repositories/InvoiceRepository";

import { WorkspaceFlowTaskFacade } from "./workspace-flow-task.facade";
import { WorkspaceFlowIssueFacade } from "./workspace-flow-issue.facade";
import { WorkspaceFlowInvoiceFacade } from "./workspace-flow-invoice.facade";

import type { CreateTaskDto } from "../application/dto/create-task.dto";
import type { UpdateTaskDto } from "../application/dto/update-task.dto";
import type { OpenIssueDto } from "../application/dto/open-issue.dto";
import type { ResolveIssueDto } from "../application/dto/resolve-issue.dto";
import type { AddInvoiceItemDto } from "../application/dto/add-invoice-item.dto";
import type { UpdateInvoiceItemDto } from "../application/dto/update-invoice-item.dto";
import type { RemoveInvoiceItemDto } from "../application/dto/remove-invoice-item.dto";
import type { TaskQueryDto } from "../application/dto/task-query.dto";
import type { IssueQueryDto } from "../application/dto/issue-query.dto";
import type { InvoiceQueryDto } from "../application/dto/invoice-query.dto";
import type { PaginationDto, PagedResult } from "../application/dto/pagination.dto";

import type {
  TaskSummary,
  IssueSummary,
  InvoiceSummary,
} from "../interfaces/contracts/workspace-flow.contract";

import type { CommandResult } from "@shared-types";

/**
 * WorkspaceFlowFacade
 *
 * Composite entry point for all workspace-flow write and read-summary operations.
 * Delegates to {@link WorkspaceFlowTaskFacade}, {@link WorkspaceFlowIssueFacade},
 * and {@link WorkspaceFlowInvoiceFacade}.
 *
 * @example
 * ```ts
 * const facade = new WorkspaceFlowFacade(
 *   new FirebaseTaskRepository(),
 *   new FirebaseIssueRepository(),
 *   new FirebaseInvoiceRepository(),
 * );
 * await facade.createTask({ workspaceId, title: "My task" });
 * ```
 */
export class WorkspaceFlowFacade {
  private readonly taskFacade: WorkspaceFlowTaskFacade;
  private readonly issueFacade: WorkspaceFlowIssueFacade;
  private readonly invoiceFacade: WorkspaceFlowInvoiceFacade;

  constructor(
    taskRepository: TaskRepository,
    issueRepository: IssueRepository,
    invoiceRepository: InvoiceRepository,
  ) {
    this.taskFacade = new WorkspaceFlowTaskFacade(taskRepository, issueRepository);
    this.issueFacade = new WorkspaceFlowIssueFacade(issueRepository);
    this.invoiceFacade = new WorkspaceFlowInvoiceFacade(invoiceRepository);
  }

  // ── Task operations (delegated) ──────────────────────────────────────────────

  createTask(dto: CreateTaskDto): Promise<CommandResult> { return this.taskFacade.createTask(dto); }
  updateTask(taskId: string, dto: UpdateTaskDto): Promise<CommandResult> { return this.taskFacade.updateTask(taskId, dto); }
  assignTask(taskId: string, assigneeId: string): Promise<CommandResult> { return this.taskFacade.assignTask(taskId, assigneeId); }
  submitTaskToQa(taskId: string): Promise<CommandResult> { return this.taskFacade.submitTaskToQa(taskId); }
  passTaskQa(taskId: string): Promise<CommandResult> { return this.taskFacade.passTaskQa(taskId); }
  approveTaskAcceptance(taskId: string): Promise<CommandResult> { return this.taskFacade.approveTaskAcceptance(taskId); }
  archiveTask(taskId: string, invoiceStatus?: string): Promise<CommandResult> { return this.taskFacade.archiveTask(taskId, invoiceStatus); }
  listTasks(query: TaskQueryDto, pagination?: PaginationDto): Promise<PagedResult<TaskSummary>> { return this.taskFacade.listTasks(query, pagination); }
  getTaskSummary(taskId: string): Promise<TaskSummary | null> { return this.taskFacade.getTaskSummary(taskId); }

  // ── Issue operations (delegated) ─────────────────────────────────────────────

  openIssue(dto: OpenIssueDto): Promise<CommandResult> { return this.issueFacade.openIssue(dto); }
  startIssue(issueId: string): Promise<CommandResult> { return this.issueFacade.startIssue(issueId); }
  fixIssue(issueId: string): Promise<CommandResult> { return this.issueFacade.fixIssue(issueId); }
  submitIssueRetest(issueId: string): Promise<CommandResult> { return this.issueFacade.submitIssueRetest(issueId); }
  passIssueRetest(issueId: string): Promise<CommandResult> { return this.issueFacade.passIssueRetest(issueId); }
  failIssueRetest(issueId: string): Promise<CommandResult> { return this.issueFacade.failIssueRetest(issueId); }
  resolveIssue(dto: ResolveIssueDto): Promise<CommandResult> { return this.issueFacade.resolveIssue(dto); }
  closeIssue(issueId: string): Promise<CommandResult> { return this.issueFacade.closeIssue(issueId); }
  listIssues(query: IssueQueryDto, pagination?: PaginationDto): Promise<PagedResult<IssueSummary>> { return this.issueFacade.listIssues(query, pagination); }
  getIssueSummary(issueId: string): Promise<IssueSummary | null> { return this.issueFacade.getIssueSummary(issueId); }

  // ── Invoice operations (delegated) ───────────────────────────────────────────

  createInvoice(workspaceId: string): Promise<CommandResult> { return this.invoiceFacade.createInvoice(workspaceId); }
  addInvoiceItem(dto: AddInvoiceItemDto): Promise<CommandResult> { return this.invoiceFacade.addInvoiceItem(dto); }
  updateInvoiceItem(invoiceItemId: string, dto: UpdateInvoiceItemDto): Promise<CommandResult> { return this.invoiceFacade.updateInvoiceItem(invoiceItemId, dto); }
  removeInvoiceItem(dto: RemoveInvoiceItemDto): Promise<CommandResult> { return this.invoiceFacade.removeInvoiceItem(dto); }
  submitInvoice(invoiceId: string): Promise<CommandResult> { return this.invoiceFacade.submitInvoice(invoiceId); }
  reviewInvoice(invoiceId: string): Promise<CommandResult> { return this.invoiceFacade.reviewInvoice(invoiceId); }
  approveInvoice(invoiceId: string): Promise<CommandResult> { return this.invoiceFacade.approveInvoice(invoiceId); }
  rejectInvoice(invoiceId: string): Promise<CommandResult> { return this.invoiceFacade.rejectInvoice(invoiceId); }
  payInvoice(invoiceId: string): Promise<CommandResult> { return this.invoiceFacade.payInvoice(invoiceId); }
  closeInvoice(invoiceId: string): Promise<CommandResult> { return this.invoiceFacade.closeInvoice(invoiceId); }
  listInvoices(query: InvoiceQueryDto, pagination?: PaginationDto): Promise<PagedResult<InvoiceSummary>> { return this.invoiceFacade.listInvoices(query, pagination); }
  getInvoiceSummary(invoiceId: string): Promise<InvoiceSummary | null> { return this.invoiceFacade.getInvoiceSummary(invoiceId); }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/dto/add-invoice-item.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file add-invoice-item.dto.ts
 * @description Command DTO for adding an item to an invoice.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add Zod schema when validation layer is wired in
 */

export interface AddInvoiceItemDto {
  readonly invoiceId: string;
  readonly taskId: string;
  readonly amount: number;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/dto/create-task.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file create-task.dto.ts
 * @description Command DTO for creating a new task.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add Zod schema when validation layer is wired in
 */

export interface CreateTaskDto {
  readonly workspaceId: string;
  readonly title: string;
  readonly description?: string;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/dto/invoice-query.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file invoice-query.dto.ts
 * @description Query parameters DTO for listing invoices.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add pagination support when invoice lists grow large
 */

export interface InvoiceQueryDto {
  /** Filter invoices by workspace. Required for scoped queries. */
  readonly workspaceId: string;
  /** Optional status filter. */
  readonly status?: string;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/dto/issue-query.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file issue-query.dto.ts
 * @description Query parameters DTO for listing issues.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add pagination support when issue lists grow large
 */

export interface IssueQueryDto {
  /** Filter issues by task. */
  readonly taskId: string;
  /** Optional status filter. */
  readonly status?: string;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/dto/materialize-from-knowledge.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file materialize-from-knowledge.dto.ts
 * @description Command DTO for materializing Tasks and Invoices from a
 * `knowledge.page_approved` event payload.
 *
 * This DTO is used by both:
 *  - MaterializeTasksFromKnowledgeUseCase
 *  - KnowledgeToWorkflowMaterializer (Process Manager)
 */

import type { SourceReference } from "../../domain/value-objects/SourceReference";

export interface ExtractedTaskItem {
  readonly title: string;
  readonly dueDate?: string;
  readonly description?: string;
}

export interface ExtractedInvoiceItem {
  readonly amount: number;
  readonly description: string;
  readonly currency?: string;
}

export interface MaterializeFromKnowledgeDto {
  readonly workspaceId: string;
  /** ID of the KnowledgePage that was approved (same as sourceReference.id). */
  readonly knowledgePageId: string;
  /** Pre-built SourceReference value object to attach to every created entity. */
  readonly sourceReference: SourceReference;
  readonly extractedTasks: ReadonlyArray<ExtractedTaskItem>;
  readonly extractedInvoices: ReadonlyArray<ExtractedInvoiceItem>;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/dto/open-issue.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file open-issue.dto.ts
 * @description Command DTO for opening a new issue against a task.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add Zod schema when validation layer is wired in
 */

import type { IssueStage } from "../../domain/value-objects/IssueStage";

export interface OpenIssueDto {
  readonly taskId: string;
  readonly stage: IssueStage;
  readonly title: string;
  readonly description?: string;
  readonly createdBy: string;
  readonly assignedTo?: string;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/dto/pagination.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file pagination.dto.ts
 * @description Shared pagination request / response DTOs for workspace-flow list queries.
 * @author workspace-flow
 * @since 2026-03-24
 */

export interface PaginationDto {
  /** 1-based page number. Defaults to 1. */
  readonly page?: number;
  /** Items per page. Defaults to 20. */
  readonly pageSize?: number;
}

export interface PagedResult<T> {
  readonly items: T[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly hasMore: boolean;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/dto/remove-invoice-item.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file remove-invoice-item.dto.ts
 * @description Command DTO for removing an item from an invoice.
 * @author workspace-flow
 * @since 2026-03-24
 */

export interface RemoveInvoiceItemDto {
  readonly invoiceId: string;
  readonly invoiceItemId: string;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/dto/resolve-issue.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file resolve-issue.dto.ts
 * @description Command DTO for resolving an issue (retest passed → resolved).
 * @author workspace-flow
 * @since 2026-03-24
 */

export interface ResolveIssueDto {
  readonly issueId: string;
  readonly resolutionNote?: string;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/dto/task-query.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file task-query.dto.ts
 * @description Query parameters DTO for listing tasks.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add pagination support when task lists grow large
 */

export interface TaskQueryDto {
  /** Filter tasks by workspace. Required for scoped queries. */
  readonly workspaceId: string;
  /** Optional status filter. */
  readonly status?: string;
  /** Optional assignee filter. */
  readonly assigneeId?: string;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/dto/update-invoice-item.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file update-invoice-item.dto.ts
 * @description Command DTO for updating the amount of an existing invoice item.
 * @author workspace-flow
 * @since 2026-03-24
 */

export interface UpdateInvoiceItemDto {
  /** Updated billing amount (must be > 0). */
  readonly amount: number;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/dto/update-task.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file update-task.dto.ts
 * @description Command DTO for updating mutable fields on an existing task.
 * @author workspace-flow
 * @since 2026-03-24
 */

export interface UpdateTaskDto {
  readonly title?: string;
  readonly description?: string;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/dto/workflow.dto.ts
````typescript
/**
 * Application-layer DTO re-exports for the workspace-workflow subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
export type { Task } from "../../domain/entities/Task";
export type { Issue } from "../../domain/entities/Issue";
export type { Invoice } from "../../domain/entities/Invoice";
export type { InvoiceItem } from "../../domain/entities/InvoiceItem";
export type { TaskStatus } from "../../domain/value-objects/TaskStatus";
export type { InvoiceStatus } from "../../domain/value-objects/InvoiceStatus";
export type { IssueStage } from "../../domain/value-objects/IssueStage";
````

## File: modules/workspace/subdomains/workspace-workflow/application/ports/InvoiceService.ts
````typescript
/**
 * @module workspace-flow/application/ports
 * @file InvoiceService.ts
 * @description Application port interface for Invoice operations.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Wire use cases and implement concrete adapters
 */

import type { Invoice } from "../../domain/entities/Invoice";
import type { InvoiceItem } from "../../domain/entities/InvoiceItem";
import type { InvoiceStatus } from "../../domain/value-objects/InvoiceStatus";
import type { AddInvoiceItemDto } from "../dto/add-invoice-item.dto";
import type { InvoiceQueryDto } from "../dto/invoice-query.dto";

export interface InvoiceService {
  createInvoice(workspaceId: string): Promise<Invoice>;
  addItem(dto: AddInvoiceItemDto): Promise<InvoiceItem>;
  removeItem(invoiceItemId: string): Promise<void>;
  transitionStatus(invoiceId: string, to: InvoiceStatus): Promise<Invoice>;
  listInvoices(query: InvoiceQueryDto): Promise<Invoice[]>;
  getInvoice(invoiceId: string): Promise<Invoice | null>;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/ports/IssueService.ts
````typescript
/**
 * @module workspace-flow/application/ports
 * @file IssueService.ts
 * @description Application port interface for Issue operations.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Wire use cases and implement concrete adapters
 */

import type { Issue } from "../../domain/entities/Issue";
import type { IssueStatus } from "../../domain/value-objects/IssueStatus";
import type { OpenIssueDto } from "../dto/open-issue.dto";
import type { IssueQueryDto } from "../dto/issue-query.dto";

export interface IssueService {
  openIssue(dto: OpenIssueDto): Promise<Issue>;
  transitionStatus(issueId: string, to: IssueStatus): Promise<Issue>;
  listIssues(query: IssueQueryDto): Promise<Issue[]>;
  getIssue(issueId: string): Promise<Issue | null>;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/ports/TaskService.ts
````typescript
/**
 * @module workspace-flow/application/ports
 * @file TaskService.ts
 * @description Application port interface for Task operations.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Wire use cases and implement concrete adapters
 */

import type { Task } from "../../domain/entities/Task";
import type { TaskStatus } from "../../domain/value-objects/TaskStatus";
import type { CreateTaskDto } from "../dto/create-task.dto";
import type { TaskQueryDto } from "../dto/task-query.dto";

export interface TaskService {
  createTask(dto: CreateTaskDto): Promise<Task>;
  assignTask(taskId: string, assigneeId: string): Promise<Task>;
  transitionStatus(taskId: string, to: TaskStatus): Promise<Task>;
  listTasks(query: TaskQueryDto): Promise<Task[]>;
  getTask(taskId: string): Promise<Task | null>;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/process-managers/knowledge-to-workflow-materializer.ts
````typescript
/**
 * @module workspace-flow/application/process-managers
 * @file knowledge-to-workflow-materializer.ts
 * @description Process Manager (Saga) that listens for `knowledge.page_approved`
 * events and orchestrates the creation of Tasks and Invoices in workspace-flow.
 *
 * ## Responsibility
 * This class is the single entry point for the cross-module event-driven
 * integration between the `knowledge` and `workspace-flow` bounded contexts.
 *
 * ## Idempotency
 * The process manager tracks processed `causationId` values to prevent
 * duplicate materialization if the same event is delivered more than once.
 * The seen-set is in-memory by default; production implementations should
 * persist to Firestore at:
 *   `workspaces/{workspaceId}/materializedEvents/{causationId}`
 * using a Firestore transaction to provide atomic idempotency guarantees.
 *
 * ## Placement
 * - Wired in: Cloud Function trigger (Firestore `onDocumentUpdated`) or
 *   `SimpleEventBus` subscriber registered at application startup.
 * - Alternative: a shared saga registry if cross-module saga coordination is needed.
 *
 * @see ADR-001: docs/architecture/adr/ADR-001-knowledge-to-workflow-boundary.md
 */

import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { MaterializeTasksFromKnowledgeUseCase } from "../use-cases/materialize-tasks-from-knowledge.use-case";
import type { ExtractedInvoiceItem, ExtractedTaskItem } from "../dto/materialize-from-knowledge.dto";
import type { SourceReference } from "../../domain/value-objects/SourceReference";

interface PageApprovedEvent {
  payload: {
    pageId: string;
    causationId: string;
    correlationId: string;
    extractedTasks: ReadonlyArray<ExtractedTaskItem>;
    extractedInvoices: ReadonlyArray<ExtractedInvoiceItem>;
  };
}

export class KnowledgeToWorkflowMaterializer {
  /**
   * In-memory idempotency guard.
   * Replace with a persistent store in production.
   */
  private readonly processedCausationIds = new Set<string>();

  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  /**
   * Handle a `knowledge.page_approved` event.
   *
   * @param event - The full event payload from the knowledge module's public API.
   * @param workspaceId - Target workspace where Tasks/Invoices will be created.
   *   Typically resolved from the event's `workspaceId` field if present.
   * @returns true if materialization succeeded, false if skipped (idempotency) or failed.
   */
  async handle(event: PageApprovedEvent, workspaceId: string): Promise<boolean> {
    if (this.processedCausationIds.has(event.payload.causationId)) {
      return false;
    }

    if (!workspaceId.trim()) return false;

    const sourceReference: SourceReference = {
      type: "KnowledgePage",
      id: event.payload.pageId,
      causationId: event.payload.causationId,
      correlationId: event.payload.correlationId,
    };

    const useCase = new MaterializeTasksFromKnowledgeUseCase(
      this.taskRepository,
      this.invoiceRepository,
    );

    const result = await useCase.execute({
      workspaceId,
      knowledgePageId: event.payload.pageId,
      sourceReference,
      extractedTasks: event.payload.extractedTasks,
      extractedInvoices: event.payload.extractedInvoices,
    });

    if (result.success) {
      this.processedCausationIds.add(event.payload.causationId);
      return true;
    }

    return false;
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/add-invoice-item.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file add-invoice-item.use-case.ts
 * @description Use case: Add an item to a draft invoice.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit InvoiceItemAddedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { invoiceIsEditable } from "../../domain/services/invoice-guards";
import type { AddInvoiceItemDto } from "../dto/add-invoice-item.dto";

export class AddInvoiceItemUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(dto: AddInvoiceItemDto): Promise<CommandResult> {
    if (!dto.invoiceId.trim()) {
      return commandFailureFrom("WF_INVOICE_ID_REQUIRED", "Invoice id is required.");
    }
    if (!dto.taskId.trim()) {
      return commandFailureFrom("WF_INVOICE_TASK_REQUIRED", "Task id is required.");
    }
    if (dto.amount <= 0) {
      return commandFailureFrom("WF_INVOICE_AMOUNT_INVALID", "Amount must be greater than zero.");
    }

    const invoice = await this.invoiceRepository.findById(dto.invoiceId);
    if (!invoice) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found.");
    }
    if (!invoiceIsEditable(invoice.status)) {
      return commandFailureFrom(
        "WF_INVOICE_NOT_EDITABLE",
        "Items can only be added to draft invoices.",
      );
    }

    const item = await this.invoiceRepository.addItem(dto);
    return commandSuccess(item.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/approve-invoice.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file approve-invoice.use-case.ts
 * @description Use case: Approve an invoice in finance review (finance_review → approved).
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit InvoiceApprovedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { evaluateInvoiceTransition } from "../../domain/services/invoice-transition-policy";

export class ApproveInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(invoiceId: string): Promise<CommandResult> {
    if (!invoiceId.trim()) {
      return commandFailureFrom("WF_INVOICE_ID_REQUIRED", "Invoice id is required.");
    }

    const invoice = await this.invoiceRepository.findById(invoiceId);
    if (!invoice) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found.");
    }

    const guard = evaluateInvoiceTransition(invoice.status, "approved");
    if (!guard.allowed) {
      return commandFailureFrom("WF_INVOICE_INVALID_TRANSITION", guard.reason);
    }

    const nowISO = new Date().toISOString();
    const updated = await this.invoiceRepository.transitionStatus(invoiceId, "approved", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/approve-task-acceptance.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file approve-task-acceptance.use-case.ts
 * @description Use case: Approve a task at acceptance stage (acceptance → accepted). Requires no open issues.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit TaskAcceptanceApprovedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateTaskTransition } from "../../domain/services/task-transition-policy";
import { hasNoOpenIssues } from "../../domain/services/task-guards";

export class ApproveTaskAcceptanceUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly issueRepository: IssueRepository,
  ) {}

  async execute(taskId: string): Promise<CommandResult> {
    if (!taskId.trim()) {
      return commandFailureFrom("WF_TASK_ID_REQUIRED", "Task id is required.");
    }

    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found.");
    }

    const guard = evaluateTaskTransition(task.status, "accepted");
    if (!guard.allowed) {
      return commandFailureFrom("WF_TASK_INVALID_TRANSITION", guard.reason);
    }

    const openIssues = await this.issueRepository.countOpenByTaskId(taskId);
    if (!hasNoOpenIssues(openIssues)) {
      return commandFailureFrom(
        "WF_TASK_HAS_OPEN_ISSUES",
        "Task cannot be accepted: there are open issues that must be resolved first.",
      );
    }

    const nowISO = new Date().toISOString();
    const updated = await this.taskRepository.transitionStatus(taskId, "accepted", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/archive-task.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file archive-task.use-case.ts
 * @description Use case: Archive a task (accepted → archived). Requires invoice closed or none.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit TaskArchivedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import { evaluateTaskTransition } from "../../domain/services/task-transition-policy";
import { invoiceAllowsArchive } from "../../domain/services/task-guards";

export class ArchiveTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  /**
   * @param taskId       - ID of the task to archive
   * @param invoiceStatus - Status of the linked invoice, or undefined if none
   */
  async execute(taskId: string, invoiceStatus?: string): Promise<CommandResult> {
    if (!taskId.trim()) {
      return commandFailureFrom("WF_TASK_ID_REQUIRED", "Task id is required.");
    }

    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found.");
    }

    const guard = evaluateTaskTransition(task.status, "archived");
    if (!guard.allowed) {
      return commandFailureFrom("WF_TASK_INVALID_TRANSITION", guard.reason);
    }

    if (!invoiceAllowsArchive(invoiceStatus)) {
      return commandFailureFrom(
        "WF_TASK_INVOICE_NOT_CLOSED",
        "Task cannot be archived: the linked invoice must be closed first.",
      );
    }

    const nowISO = new Date().toISOString();
    const updated = await this.taskRepository.transitionStatus(taskId, "archived", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/assign-task.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file assign-task.use-case.ts
 * @description Use case: Assign a task to a user and transition status to in_progress.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add permission check for assignee
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import { evaluateTaskTransition } from "../../domain/services/task-transition-policy";

export class AssignTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(taskId: string, assigneeId: string): Promise<CommandResult> {
    if (!taskId.trim()) {
      return commandFailureFrom("WF_TASK_ID_REQUIRED", "Task id is required.");
    }
    if (!assigneeId.trim()) {
      return commandFailureFrom("WF_TASK_ASSIGNEE_REQUIRED", "Assignee id is required.");
    }

    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found.");
    }

    const guard = evaluateTaskTransition(task.status, "in_progress");
    if (!guard.allowed) {
      return commandFailureFrom("WF_TASK_INVALID_TRANSITION", guard.reason);
    }

    // Persist the assignee before transitioning status
    await this.taskRepository.update(taskId, { assigneeId: assigneeId.trim() });

    const nowISO = new Date().toISOString();
    const updated = await this.taskRepository.transitionStatus(taskId, "in_progress", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/close-invoice.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file close-invoice.use-case.ts
 * @description Use case: Close a paid invoice (paid → closed).
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit InvoiceClosedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { evaluateInvoiceTransition } from "../../domain/services/invoice-transition-policy";

export class CloseInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(invoiceId: string): Promise<CommandResult> {
    if (!invoiceId.trim()) {
      return commandFailureFrom("WF_INVOICE_ID_REQUIRED", "Invoice id is required.");
    }

    const invoice = await this.invoiceRepository.findById(invoiceId);
    if (!invoice) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found.");
    }

    const guard = evaluateInvoiceTransition(invoice.status, "closed");
    if (!guard.allowed) {
      return commandFailureFrom("WF_INVOICE_INVALID_TRANSITION", guard.reason);
    }

    const nowISO = new Date().toISOString();
    const updated = await this.invoiceRepository.transitionStatus(invoiceId, "closed", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/close-issue.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file close-issue.use-case.ts
 * @description Use case: Close a resolved issue (resolved → closed).
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit IssueClosedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateIssueTransition } from "../../domain/services/issue-transition-policy";

export class CloseIssueUseCase {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(issueId: string): Promise<CommandResult> {
    if (!issueId.trim()) {
      return commandFailureFrom("WF_ISSUE_ID_REQUIRED", "Issue id is required.");
    }

    const issue = await this.issueRepository.findById(issueId);
    if (!issue) {
      return commandFailureFrom("WF_ISSUE_NOT_FOUND", "Issue not found.");
    }

    const guard = evaluateIssueTransition(issue.status, "closed");
    if (!guard.allowed) {
      return commandFailureFrom("WF_ISSUE_INVALID_TRANSITION", guard.reason);
    }

    const nowISO = new Date().toISOString();
    const updated = await this.issueRepository.transitionStatus(issueId, "closed", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_ISSUE_NOT_FOUND", "Issue not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/create-invoice.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file create-invoice.use-case.ts
 * @description Use case: Create a new invoice for a workspace.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit InvoiceCreatedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";

export class CreateInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(workspaceId: string): Promise<CommandResult> {
    if (!workspaceId.trim()) {
      return commandFailureFrom("WF_INVOICE_WORKSPACE_REQUIRED", "Workspace is required.");
    }

    const invoice = await this.invoiceRepository.create({ workspaceId: workspaceId.trim() });
    return commandSuccess(invoice.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/create-task.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file create-task.use-case.ts
 * @description Use case: Create a new task in the workspace-flow context.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add input validation with Zod schema
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { CreateTaskDto } from "../dto/create-task.dto";

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(dto: CreateTaskDto): Promise<CommandResult> {
    const workspaceId = dto.workspaceId.trim();
    const title = dto.title.trim();

    if (!workspaceId) {
      return commandFailureFrom("WF_TASK_WORKSPACE_REQUIRED", "Workspace is required.");
    }
    if (!title) {
      return commandFailureFrom("WF_TASK_TITLE_REQUIRED", "Task title is required.");
    }

    const task = await this.taskRepository.create({ ...dto, workspaceId, title });
    return commandSuccess(task.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/fail-issue-retest.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file fail-issue-retest.use-case.ts
 * @description Use case: Fail an issue's retest (retest → fixing).
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit IssueRetestFailedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateIssueTransition } from "../../domain/services/issue-transition-policy";

export class FailIssueRetestUseCase {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(issueId: string): Promise<CommandResult> {
    if (!issueId.trim()) {
      return commandFailureFrom("WF_ISSUE_ID_REQUIRED", "Issue id is required.");
    }

    const issue = await this.issueRepository.findById(issueId);
    if (!issue) {
      return commandFailureFrom("WF_ISSUE_NOT_FOUND", "Issue not found.");
    }

    const guard = evaluateIssueTransition(issue.status, "fixing");
    if (!guard.allowed) {
      return commandFailureFrom("WF_ISSUE_INVALID_TRANSITION", guard.reason);
    }

    const nowISO = new Date().toISOString();
    const updated = await this.issueRepository.transitionStatus(issueId, "fixing", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_ISSUE_NOT_FOUND", "Issue not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/fix-issue.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file fix-issue.use-case.ts
 * @description Use case: Mark an issue as being fixed (investigating → fixing).
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit IssueFixedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateIssueTransition } from "../../domain/services/issue-transition-policy";

export class FixIssueUseCase {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(issueId: string): Promise<CommandResult> {
    if (!issueId.trim()) {
      return commandFailureFrom("WF_ISSUE_ID_REQUIRED", "Issue id is required.");
    }

    const issue = await this.issueRepository.findById(issueId);
    if (!issue) {
      return commandFailureFrom("WF_ISSUE_NOT_FOUND", "Issue not found.");
    }

    const guard = evaluateIssueTransition(issue.status, "fixing");
    if (!guard.allowed) {
      return commandFailureFrom("WF_ISSUE_INVALID_TRANSITION", guard.reason);
    }

    const nowISO = new Date().toISOString();
    const updated = await this.issueRepository.transitionStatus(issueId, "fixing", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_ISSUE_NOT_FOUND", "Issue not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/materialize-tasks-from-knowledge.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file materialize-tasks-from-knowledge.use-case.ts
 * @description Use case: Batch-create Tasks (and optionally Invoices) from a
 * `knowledge.page_approved` event payload.
 *
 * Idempotency: callers must ensure the same `sourceReference.causationId` is
 * not processed twice. This use case does NOT check for duplicates itself;
 * that responsibility belongs to the KnowledgeToWorkflowMaterializer process
 * manager which wraps this use case.
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import type { MaterializeFromKnowledgeDto } from "../dto/materialize-from-knowledge.dto";

export class MaterializeTasksFromKnowledgeUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  async execute(dto: MaterializeFromKnowledgeDto): Promise<CommandResult> {
    if (!dto.workspaceId.trim()) {
      return commandFailureFrom("WF_MATERIALIZE_WORKSPACE_REQUIRED", "workspaceId is required.");
    }
    if (!dto.knowledgePageId.trim()) {
      return commandFailureFrom("WF_MATERIALIZE_PAGE_REQUIRED", "knowledgePageId is required.");
    }

    const taskIds: string[] = [];
    for (const item of dto.extractedTasks) {
      if (!item.title.trim()) continue;
      const task = await this.taskRepository.create({
        workspaceId: dto.workspaceId,
        title: item.title.trim(),
        description: item.description ?? "",
        dueDateISO: item.dueDate,
        sourceReference: dto.sourceReference,
      });
      taskIds.push(task.id);
    }

    const invoiceIds: string[] = [];
    for (const item of dto.extractedInvoices) {
      if (item.amount <= 0) continue;
      const invoice = await this.invoiceRepository.create({
        workspaceId: dto.workspaceId,
        sourceReference: dto.sourceReference,
      });
      await this.invoiceRepository.addItem({
        invoiceId: invoice.id,
        amount: item.amount,
        taskId: "",
      });
      invoiceIds.push(invoice.id);
    }

    return commandSuccess(dto.knowledgePageId, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/open-issue.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file open-issue.use-case.ts
 * @description Use case: Open a new issue against a task.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit IssueOpenedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import type { OpenIssueDto } from "../dto/open-issue.dto";

export class OpenIssueUseCase {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(dto: OpenIssueDto): Promise<CommandResult> {
    if (!dto.taskId.trim()) {
      return commandFailureFrom("WF_ISSUE_TASK_REQUIRED", "Task id is required.");
    }
    if (!dto.title.trim()) {
      return commandFailureFrom("WF_ISSUE_TITLE_REQUIRED", "Issue title is required.");
    }
    if (!dto.createdBy.trim()) {
      return commandFailureFrom("WF_ISSUE_CREATED_BY_REQUIRED", "Creator id is required.");
    }

    const issue = await this.issueRepository.create({
      ...dto,
      taskId: dto.taskId.trim(),
      title: dto.title.trim(),
    });
    return commandSuccess(issue.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/pass-issue-retest.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file pass-issue-retest.use-case.ts
 * @description Use case: Pass an issue's retest (retest → resolved).
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit IssueRetestPassedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateIssueTransition } from "../../domain/services/issue-transition-policy";

export class PassIssueRetestUseCase {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(issueId: string): Promise<CommandResult> {
    if (!issueId.trim()) {
      return commandFailureFrom("WF_ISSUE_ID_REQUIRED", "Issue id is required.");
    }

    const issue = await this.issueRepository.findById(issueId);
    if (!issue) {
      return commandFailureFrom("WF_ISSUE_NOT_FOUND", "Issue not found.");
    }

    const guard = evaluateIssueTransition(issue.status, "resolved");
    if (!guard.allowed) {
      return commandFailureFrom("WF_ISSUE_INVALID_TRANSITION", guard.reason);
    }

    const nowISO = new Date().toISOString();
    const updated = await this.issueRepository.transitionStatus(issueId, "resolved", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_ISSUE_NOT_FOUND", "Issue not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/pass-task-qa.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file pass-task-qa.use-case.ts
 * @description Use case: Pass a task's QA review (qa → acceptance). Requires no open issues.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit TaskQaPassedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateTaskTransition } from "../../domain/services/task-transition-policy";
import { hasNoOpenIssues } from "../../domain/services/task-guards";

export class PassTaskQaUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly issueRepository: IssueRepository,
  ) {}

  async execute(taskId: string): Promise<CommandResult> {
    if (!taskId.trim()) {
      return commandFailureFrom("WF_TASK_ID_REQUIRED", "Task id is required.");
    }

    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found.");
    }

    const guard = evaluateTaskTransition(task.status, "acceptance");
    if (!guard.allowed) {
      return commandFailureFrom("WF_TASK_INVALID_TRANSITION", guard.reason);
    }

    const openIssues = await this.issueRepository.countOpenByTaskId(taskId);
    if (!hasNoOpenIssues(openIssues)) {
      return commandFailureFrom(
        "WF_TASK_HAS_OPEN_ISSUES",
        "Task cannot advance: there are open issues that must be resolved first.",
      );
    }

    const nowISO = new Date().toISOString();
    const updated = await this.taskRepository.transitionStatus(taskId, "acceptance", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/pay-invoice.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file pay-invoice.use-case.ts
 * @description Use case: Mark an approved invoice as paid (approved → paid).
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit InvoicePaidEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { evaluateInvoiceTransition } from "../../domain/services/invoice-transition-policy";

export class PayInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(invoiceId: string): Promise<CommandResult> {
    if (!invoiceId.trim()) {
      return commandFailureFrom("WF_INVOICE_ID_REQUIRED", "Invoice id is required.");
    }

    const invoice = await this.invoiceRepository.findById(invoiceId);
    if (!invoice) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found.");
    }

    const guard = evaluateInvoiceTransition(invoice.status, "paid");
    if (!guard.allowed) {
      return commandFailureFrom("WF_INVOICE_INVALID_TRANSITION", guard.reason);
    }

    const nowISO = new Date().toISOString();
    const updated = await this.invoiceRepository.transitionStatus(invoiceId, "paid", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/reject-invoice.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file reject-invoice.use-case.ts
 * @description Use case: Reject an invoice back to submitted (finance_review → submitted).
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit InvoiceRejectedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { evaluateInvoiceTransition } from "../../domain/services/invoice-transition-policy";

export class RejectInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(invoiceId: string): Promise<CommandResult> {
    if (!invoiceId.trim()) {
      return commandFailureFrom("WF_INVOICE_ID_REQUIRED", "Invoice id is required.");
    }

    const invoice = await this.invoiceRepository.findById(invoiceId);
    if (!invoice) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found.");
    }

    const guard = evaluateInvoiceTransition(invoice.status, "submitted");
    if (!guard.allowed) {
      return commandFailureFrom("WF_INVOICE_INVALID_TRANSITION", guard.reason);
    }

    const nowISO = new Date().toISOString();
    const updated = await this.invoiceRepository.transitionStatus(invoiceId, "submitted", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/remove-invoice-item.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file remove-invoice-item.use-case.ts
 * @description Use case: Remove an item from a draft invoice.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit InvoiceItemRemovedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { invoiceIsEditable } from "../../domain/services/invoice-guards";

export class RemoveInvoiceItemUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(invoiceId: string, invoiceItemId: string): Promise<CommandResult> {
    if (!invoiceId.trim()) {
      return commandFailureFrom("WF_INVOICE_ID_REQUIRED", "Invoice id is required.");
    }
    if (!invoiceItemId.trim()) {
      return commandFailureFrom("WF_INVOICE_ITEM_ID_REQUIRED", "Invoice item id is required.");
    }

    const invoice = await this.invoiceRepository.findById(invoiceId);
    if (!invoice) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found.");
    }
    if (!invoiceIsEditable(invoice.status)) {
      return commandFailureFrom(
        "WF_INVOICE_NOT_EDITABLE",
        "Items can only be removed from draft invoices.",
      );
    }

    await this.invoiceRepository.removeItem(invoiceItemId);
    return commandSuccess(invoiceItemId, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/resolve-issue.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file resolve-issue.use-case.ts
 * @description Use case: Resolve an issue (retest-pending → resolved).
 * @author workspace-flow
 * @since 2026-03-24
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateIssueTransition } from "../../domain/services/issue-transition-policy";
import type { ResolveIssueDto } from "../dto/resolve-issue.dto";

export class ResolveIssueUseCase {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(dto: ResolveIssueDto): Promise<CommandResult> {
    if (!dto.issueId.trim()) {
      return commandFailureFrom("WF_ISSUE_ID_REQUIRED", "Issue id is required.");
    }

    const issue = await this.issueRepository.findById(dto.issueId);
    if (!issue) {
      return commandFailureFrom("WF_ISSUE_NOT_FOUND", "Issue not found.");
    }

    const guard = evaluateIssueTransition(issue.status, "resolved");
    if (!guard.allowed) {
      return commandFailureFrom("WF_ISSUE_INVALID_TRANSITION", guard.reason);
    }

    const nowISO = new Date().toISOString();
    const updated = await this.issueRepository.transitionStatus(dto.issueId, "resolved", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_ISSUE_NOT_FOUND", "Issue not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/review-invoice.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file review-invoice.use-case.ts
 * @description Use case: Move an invoice into finance review (submitted → finance_review).
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit InvoiceReviewedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { evaluateInvoiceTransition } from "../../domain/services/invoice-transition-policy";

export class ReviewInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(invoiceId: string): Promise<CommandResult> {
    if (!invoiceId.trim()) {
      return commandFailureFrom("WF_INVOICE_ID_REQUIRED", "Invoice id is required.");
    }

    const invoice = await this.invoiceRepository.findById(invoiceId);
    if (!invoice) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found.");
    }

    const guard = evaluateInvoiceTransition(invoice.status, "finance_review");
    if (!guard.allowed) {
      return commandFailureFrom("WF_INVOICE_INVALID_TRANSITION", guard.reason);
    }

    const nowISO = new Date().toISOString();
    const updated = await this.invoiceRepository.transitionStatus(invoiceId, "finance_review", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/start-issue.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file start-issue.use-case.ts
 * @description Use case: Start investigating an issue (open → investigating).
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit IssueStartedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateIssueTransition } from "../../domain/services/issue-transition-policy";

export class StartIssueUseCase {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(issueId: string): Promise<CommandResult> {
    if (!issueId.trim()) {
      return commandFailureFrom("WF_ISSUE_ID_REQUIRED", "Issue id is required.");
    }

    const issue = await this.issueRepository.findById(issueId);
    if (!issue) {
      return commandFailureFrom("WF_ISSUE_NOT_FOUND", "Issue not found.");
    }

    const guard = evaluateIssueTransition(issue.status, "investigating");
    if (!guard.allowed) {
      return commandFailureFrom("WF_ISSUE_INVALID_TRANSITION", guard.reason);
    }

    const nowISO = new Date().toISOString();
    const updated = await this.issueRepository.transitionStatus(issueId, "investigating", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_ISSUE_NOT_FOUND", "Issue not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/submit-invoice.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file submit-invoice.use-case.ts
 * @description Use case: Submit an invoice for review (draft → submitted). Requires at least one item.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit InvoiceSubmittedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { evaluateInvoiceTransition } from "../../domain/services/invoice-transition-policy";
import { invoiceHasItems } from "../../domain/services/invoice-guards";

export class SubmitInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(invoiceId: string): Promise<CommandResult> {
    if (!invoiceId.trim()) {
      return commandFailureFrom("WF_INVOICE_ID_REQUIRED", "Invoice id is required.");
    }

    const invoice = await this.invoiceRepository.findById(invoiceId);
    if (!invoice) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found.");
    }

    const guard = evaluateInvoiceTransition(invoice.status, "submitted");
    if (!guard.allowed) {
      return commandFailureFrom("WF_INVOICE_INVALID_TRANSITION", guard.reason);
    }

    const items = await this.invoiceRepository.listItems(invoiceId);
    if (!invoiceHasItems(items.length)) {
      return commandFailureFrom(
        "WF_INVOICE_NO_ITEMS",
        "Invoice cannot be submitted: at least one item is required.",
      );
    }

    const nowISO = new Date().toISOString();
    const updated = await this.invoiceRepository.transitionStatus(invoiceId, "submitted", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/submit-issue-retest.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file submit-issue-retest.use-case.ts
 * @description Use case: Submit an issue for retest (fixing → retest).
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit IssueRetestSubmittedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateIssueTransition } from "../../domain/services/issue-transition-policy";

export class SubmitIssueRetestUseCase {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(issueId: string): Promise<CommandResult> {
    if (!issueId.trim()) {
      return commandFailureFrom("WF_ISSUE_ID_REQUIRED", "Issue id is required.");
    }

    const issue = await this.issueRepository.findById(issueId);
    if (!issue) {
      return commandFailureFrom("WF_ISSUE_NOT_FOUND", "Issue not found.");
    }

    const guard = evaluateIssueTransition(issue.status, "retest");
    if (!guard.allowed) {
      return commandFailureFrom("WF_ISSUE_INVALID_TRANSITION", guard.reason);
    }

    const nowISO = new Date().toISOString();
    const updated = await this.issueRepository.transitionStatus(issueId, "retest", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_ISSUE_NOT_FOUND", "Issue not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/submit-task-to-qa.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file submit-task-to-qa.use-case.ts
 * @description Use case: Submit a task for QA review (in_progress → qa).
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add pre-submission checks (e.g. assignee present)
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import { evaluateTaskTransition } from "../../domain/services/task-transition-policy";

export class SubmitTaskToQaUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(taskId: string): Promise<CommandResult> {
    if (!taskId.trim()) {
      return commandFailureFrom("WF_TASK_ID_REQUIRED", "Task id is required.");
    }

    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found.");
    }

    const guard = evaluateTaskTransition(task.status, "qa");
    if (!guard.allowed) {
      return commandFailureFrom("WF_TASK_INVALID_TRANSITION", guard.reason);
    }

    const nowISO = new Date().toISOString();
    const updated = await this.taskRepository.transitionStatus(taskId, "qa", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/update-invoice-item.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file update-invoice-item.use-case.ts
 * @description Use case: Update the amount of an existing invoice item on a draft invoice.
 * @author workspace-flow
 * @since 2026-03-24
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { invoiceIsEditable } from "../../domain/services/invoice-guards";
import type { UpdateInvoiceItemDto } from "../dto/update-invoice-item.dto";

export class UpdateInvoiceItemUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(invoiceItemId: string, dto: UpdateInvoiceItemDto): Promise<CommandResult> {
    if (!invoiceItemId.trim()) {
      return commandFailureFrom("WF_INVOICE_ITEM_ID_REQUIRED", "Invoice item id is required.");
    }
    if (dto.amount <= 0) {
      return commandFailureFrom("WF_INVOICE_AMOUNT_INVALID", "Amount must be greater than zero.");
    }

    const item = await this.invoiceRepository.findItemById(invoiceItemId);
    if (!item) {
      return commandFailureFrom("WF_INVOICE_ITEM_NOT_FOUND", "Invoice item not found.");
    }

    const invoice = await this.invoiceRepository.findById(item.invoiceId);
    if (!invoice) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found.");
    }
    if (!invoiceIsEditable(invoice.status)) {
      return commandFailureFrom(
        "WF_INVOICE_NOT_EDITABLE",
        "Items can only be updated on draft invoices.",
      );
    }

    const updated = await this.invoiceRepository.updateItem(invoiceItemId, dto.amount);
    if (!updated) {
      return commandFailureFrom("WF_INVOICE_ITEM_NOT_FOUND", "Invoice item not found after update.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/update-task.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file update-task.use-case.ts
 * @description Use case: Update mutable fields on an existing task.
 * @author workspace-flow
 * @since 2026-03-24
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { UpdateTaskDto } from "../dto/update-task.dto";

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(taskId: string, dto: UpdateTaskDto): Promise<CommandResult> {
    if (!taskId.trim()) {
      return commandFailureFrom("WF_TASK_ID_REQUIRED", "Task id is required.");
    }

    const existing = await this.taskRepository.findById(taskId);
    if (!existing) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found.");
    }

    const updated = await this.taskRepository.update(taskId, dto);
    if (!updated) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found after update.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/entities/Invoice.ts
````typescript
/**
 * @module workspace-flow/domain/entities
 * @file Invoice.ts
 * @description Invoice aggregate entity representing a billing record for accepted tasks.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add domain validation methods as billing rules expand
 */

import type { InvoiceStatus } from "../value-objects/InvoiceStatus";
import type { SourceReference } from "../value-objects/SourceReference";

// ── Aggregate ─────────────────────────────────────────────────────────────────

export interface Invoice {
  readonly id: string;
  readonly workspaceId: string;
  readonly status: InvoiceStatus;
  readonly totalAmount: number;
  readonly submittedAtISO?: string;
  readonly approvedAtISO?: string;
  readonly paidAtISO?: string;
  readonly closedAtISO?: string;
  /**
   * Present when this Invoice was materialized from a KnowledgePage via the
   * `knowledge.page_approved` event. Provides full provenance traceability.
   */
  readonly sourceReference?: SourceReference;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

// ── Inputs ────────────────────────────────────────────────────────────────────

export interface CreateInvoiceInput {
  readonly workspaceId: string;
  readonly sourceReference?: SourceReference;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/entities/InvoiceItem.ts
````typescript
/**
 * @module workspace-flow/domain/entities
 * @file InvoiceItem.ts
 * @description InvoiceItem entity linking a task to an invoice with an amount.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add domain validation methods as billing rules expand
 */

// ── Entity ────────────────────────────────────────────────────────────────────

export interface InvoiceItem {
  readonly id: string;
  readonly invoiceId: string;
  readonly taskId: string;
  readonly amount: number;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

// ── Inputs ────────────────────────────────────────────────────────────────────

export interface AddInvoiceItemInput {
  readonly invoiceId: string;
  readonly taskId: string;
  readonly amount: number;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/entities/Issue.ts
````typescript
/**
 * @module workspace-flow/domain/entities
 * @file Issue.ts
 * @description Issue aggregate entity representing a defect or anomaly raised during workflow.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add domain validation methods as business rules expand
 */

import type { IssueStatus } from "../value-objects/IssueStatus";
import type { IssueStage } from "../value-objects/IssueStage";

// ── Aggregate ─────────────────────────────────────────────────────────────────

export interface Issue {
  readonly id: string;
  readonly taskId: string;
  /** Which stage of the task workflow this issue was raised in. */
  readonly stage: IssueStage;
  readonly title: string;
  readonly description: string;
  readonly status: IssueStatus;
  readonly createdBy: string;
  readonly assignedTo?: string;
  readonly resolvedAtISO?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

// ── Inputs ────────────────────────────────────────────────────────────────────

export interface OpenIssueInput {
  readonly taskId: string;
  readonly stage: IssueStage;
  readonly title: string;
  readonly description?: string;
  readonly createdBy: string;
  readonly assignedTo?: string;
}

export interface UpdateIssueInput {
  readonly title?: string;
  readonly description?: string;
  readonly assignedTo?: string;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/entities/Task.ts
````typescript
/**
 * @module workspace-flow/domain/entities
 * @file Task.ts
 * @description Task aggregate entity representing a work unit and its lifecycle.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add domain validation methods as business rules expand
 */

import type { TaskStatus } from "../value-objects/TaskStatus";
import type { SourceReference } from "../value-objects/SourceReference";

// ── Aggregate ─────────────────────────────────────────────────────────────────

export interface Task {
  readonly id: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly description: string;
  readonly status: TaskStatus;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
  readonly acceptedAtISO?: string;
  readonly archivedAtISO?: string;
  /**
   * Present when this Task was materialized from a KnowledgePage via the
   * `knowledge.page_approved` event. Provides full provenance traceability.
   */
  readonly sourceReference?: SourceReference;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

// ── Inputs ────────────────────────────────────────────────────────────────────

export interface CreateTaskInput {
  readonly workspaceId: string;
  readonly title: string;
  readonly description?: string;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
  readonly sourceReference?: SourceReference;
}

export interface UpdateTaskInput {
  readonly title?: string;
  readonly description?: string;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/events/InvoiceEvent.ts
````typescript
/**
 * @module workspace-flow/domain/events
 * @file InvoiceEvent.ts
 * @description Discriminated-union event types emitted by the Invoice aggregate.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Wire to event bus via @/modules/event IEventBusRepository
 */

import type { InvoiceStatus } from "../value-objects/InvoiceStatus";

// ── Individual event shapes ───────────────────────────────────────────────────

export interface InvoiceCreatedEvent {
  readonly type: "workspace-flow.invoice.created";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly occurredAtISO: string;
}

export interface InvoiceItemAddedEvent {
  readonly type: "workspace-flow.invoice.item_added";
  readonly invoiceId: string;
  readonly invoiceItemId: string;
  readonly taskId: string;
  readonly amount: number;
  readonly occurredAtISO: string;
}

export interface InvoiceItemRemovedEvent {
  readonly type: "workspace-flow.invoice.item_removed";
  readonly invoiceId: string;
  readonly invoiceItemId: string;
  readonly occurredAtISO: string;
}

export interface InvoiceSubmittedEvent {
  readonly type: "workspace-flow.invoice.submitted";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly submittedAtISO: string;
  readonly occurredAtISO: string;
}

export interface InvoiceReviewedEvent {
  readonly type: "workspace-flow.invoice.reviewed";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly occurredAtISO: string;
}

export interface InvoiceApprovedEvent {
  readonly type: "workspace-flow.invoice.approved";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly approvedAtISO: string;
  readonly occurredAtISO: string;
}

export interface InvoiceRejectedEvent {
  readonly type: "workspace-flow.invoice.rejected";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly occurredAtISO: string;
}

export interface InvoicePaidEvent {
  readonly type: "workspace-flow.invoice.paid";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly paidAtISO: string;
  readonly occurredAtISO: string;
}

export interface InvoiceClosedEvent {
  readonly type: "workspace-flow.invoice.closed";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly closedAtISO: string;
  readonly occurredAtISO: string;
}

export interface InvoiceStatusChangedEvent {
  readonly type: "workspace-flow.invoice.status_changed";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly from: InvoiceStatus;
  readonly to: InvoiceStatus;
  readonly occurredAtISO: string;
}

// ── Discriminated union ───────────────────────────────────────────────────────

export type InvoiceEvent =
  | InvoiceCreatedEvent
  | InvoiceItemAddedEvent
  | InvoiceItemRemovedEvent
  | InvoiceSubmittedEvent
  | InvoiceReviewedEvent
  | InvoiceApprovedEvent
  | InvoiceRejectedEvent
  | InvoicePaidEvent
  | InvoiceClosedEvent
  | InvoiceStatusChangedEvent;
````

## File: modules/workspace/subdomains/workspace-workflow/domain/events/IssueEvent.ts
````typescript
/**
 * @module workspace-flow/domain/events
 * @file IssueEvent.ts
 * @description Discriminated-union event types emitted by the Issue aggregate.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Wire to event bus via @/modules/event IEventBusRepository
 */

import type { IssueStatus } from "../value-objects/IssueStatus";
import type { IssueStage } from "../value-objects/IssueStage";

// ── Individual event shapes ───────────────────────────────────────────────────

export interface IssueOpenedEvent {
  readonly type: "workspace-flow.issue.opened";
  readonly issueId: string;
  readonly taskId: string;
  readonly stage: IssueStage;
  readonly createdBy: string;
  readonly occurredAtISO: string;
}

export interface IssueStartedEvent {
  readonly type: "workspace-flow.issue.started";
  readonly issueId: string;
  readonly taskId: string;
  readonly occurredAtISO: string;
}

export interface IssueFixedEvent {
  readonly type: "workspace-flow.issue.fixed";
  readonly issueId: string;
  readonly taskId: string;
  readonly occurredAtISO: string;
}

export interface IssueRetestSubmittedEvent {
  readonly type: "workspace-flow.issue.retest_submitted";
  readonly issueId: string;
  readonly taskId: string;
  readonly occurredAtISO: string;
}

export interface IssueRetestPassedEvent {
  readonly type: "workspace-flow.issue.retest_passed";
  readonly issueId: string;
  readonly taskId: string;
  readonly stage: IssueStage;
  readonly occurredAtISO: string;
}

export interface IssueRetestFailedEvent {
  readonly type: "workspace-flow.issue.retest_failed";
  readonly issueId: string;
  readonly taskId: string;
  readonly occurredAtISO: string;
}

export interface IssueClosedEvent {
  readonly type: "workspace-flow.issue.closed";
  readonly issueId: string;
  readonly taskId: string;
  readonly occurredAtISO: string;
}

export interface IssueStatusChangedEvent {
  readonly type: "workspace-flow.issue.status_changed";
  readonly issueId: string;
  readonly taskId: string;
  readonly from: IssueStatus;
  readonly to: IssueStatus;
  readonly occurredAtISO: string;
}

// ── Discriminated union ───────────────────────────────────────────────────────

export type IssueEvent =
  | IssueOpenedEvent
  | IssueStartedEvent
  | IssueFixedEvent
  | IssueRetestSubmittedEvent
  | IssueRetestPassedEvent
  | IssueRetestFailedEvent
  | IssueClosedEvent
  | IssueStatusChangedEvent;
````

## File: modules/workspace/subdomains/workspace-workflow/domain/events/TaskEvent.ts
````typescript
/**
 * @module workspace-flow/domain/events
 * @file TaskEvent.ts
 * @description Discriminated-union event types emitted by the Task aggregate.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Wire to event bus via @/modules/event IEventBusRepository
 */

import type { TaskStatus } from "../value-objects/TaskStatus";

// ── Individual event shapes ───────────────────────────────────────────────────

export interface TaskCreatedEvent {
  readonly type: "workspace-flow.task.created";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly occurredAtISO: string;
}

export interface TaskAssignedEvent {
  readonly type: "workspace-flow.task.assigned";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly assigneeId: string;
  readonly occurredAtISO: string;
}

export interface TaskSubmittedToQaEvent {
  readonly type: "workspace-flow.task.submitted_to_qa";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly occurredAtISO: string;
}

export interface TaskQaPassedEvent {
  readonly type: "workspace-flow.task.qa_passed";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly occurredAtISO: string;
}

export interface TaskAcceptanceApprovedEvent {
  readonly type: "workspace-flow.task.acceptance_approved";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly acceptedAtISO: string;
  readonly occurredAtISO: string;
}

export interface TaskArchivedEvent {
  readonly type: "workspace-flow.task.archived";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly archivedAtISO: string;
  readonly occurredAtISO: string;
}

export interface TaskStatusChangedEvent {
  readonly type: "workspace-flow.task.status_changed";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly from: TaskStatus;
  readonly to: TaskStatus;
  readonly occurredAtISO: string;
}

// ── Discriminated union ───────────────────────────────────────────────────────

export type TaskEvent =
  | TaskCreatedEvent
  | TaskAssignedEvent
  | TaskSubmittedToQaEvent
  | TaskQaPassedEvent
  | TaskAcceptanceApprovedEvent
  | TaskArchivedEvent
  | TaskStatusChangedEvent;
````

## File: modules/workspace/subdomains/workspace-workflow/domain/index.ts
````typescript
/**
 * workspace/workspace-workflow domain — public exports.
 */
export type { InvoiceRepository } from "./repositories/InvoiceRepository";
export type { IssueRepository } from "./repositories/IssueRepository";
export type { TaskRepository } from "./repositories/TaskRepository";
export * from "./events/TaskEvent";
export * from "./events/IssueEvent";
export * from "./events/InvoiceEvent";
export * from "./value-objects/InvoiceId";
export * from "./value-objects/InvoiceItemId";
export * from "./value-objects/InvoiceStatus";
export * from "./value-objects/IssueId";
export * from "./value-objects/IssueStage";
export * from "./value-objects/IssueStatus";
export * from "./value-objects/SourceReference";
export * from "./value-objects/TaskId";
export * from "./value-objects/TaskStatus";
export * from "./value-objects/UserId";
// Ports layer — driven port aliases
export type { IInvoicePort, IIssuePort, ITaskPort } from "./ports";
````

## File: modules/workspace/subdomains/workspace-workflow/domain/ports/index.ts
````typescript
/**
 * workspace/workspace-workflow domain/ports — driven port interfaces for the workflow subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
export type { InvoiceRepository as IInvoicePort } from "../repositories/InvoiceRepository";
export type { IssueRepository as IIssuePort } from "../repositories/IssueRepository";
export type { TaskRepository as ITaskPort } from "../repositories/TaskRepository";
````

## File: modules/workspace/subdomains/workspace-workflow/domain/repositories/InvoiceRepository.ts
````typescript
/**
 * @module workspace-flow/domain/repositories
 * @file InvoiceRepository.ts
 * @description Repository port interface for Invoice persistence.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Implement in infrastructure/repositories/FirebaseInvoiceRepository
 */

import type { Invoice, CreateInvoiceInput } from "../entities/Invoice";
import type { InvoiceItem, AddInvoiceItemInput } from "../entities/InvoiceItem";
import type { InvoiceStatus } from "../value-objects/InvoiceStatus";

export interface InvoiceRepository {
  /** Persist a new invoice and return the created aggregate. */
  create(input: CreateInvoiceInput): Promise<Invoice>;
  /** Hard-delete an invoice by id. */
  delete(invoiceId: string): Promise<void>;
  /** Retrieve an invoice by its id. Returns null if not found. */
  findById(invoiceId: string): Promise<Invoice | null>;
  /** List all invoices for a given workspace. */
  findByWorkspaceId(workspaceId: string): Promise<Invoice[]>;
  /** Persist a lifecycle status transition and stamp relevant timestamp. */
  transitionStatus(invoiceId: string, to: InvoiceStatus, nowISO: string): Promise<Invoice | null>;
  /** Add an item to an invoice and recalculate totalAmount. */
  addItem(input: AddInvoiceItemInput): Promise<InvoiceItem>;
  /** Retrieve a single invoice item by its id. Returns null if not found. */
  findItemById(invoiceItemId: string): Promise<InvoiceItem | null>;
  /** Update the amount of an existing item and recalculate totalAmount. Returns null if not found. */
  updateItem(invoiceItemId: string, amount: number): Promise<InvoiceItem | null>;
  /** Remove an item from an invoice and recalculate totalAmount. */
  removeItem(invoiceItemId: string): Promise<void>;
  /** List all items for an invoice. */
  listItems(invoiceId: string): Promise<InvoiceItem[]>;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/repositories/IssueRepository.ts
````typescript
/**
 * @module workspace-flow/domain/repositories
 * @file IssueRepository.ts
 * @description Repository port interface for Issue persistence.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Implement in infrastructure/repositories/FirebaseIssueRepository
 */

import type { Issue, OpenIssueInput, UpdateIssueInput } from "../entities/Issue";
import type { IssueStatus } from "../value-objects/IssueStatus";

export interface IssueRepository {
  /** Persist a new issue and return the created aggregate. */
  create(input: OpenIssueInput): Promise<Issue>;
  /** Update mutable fields on an existing issue. Returns null if not found. */
  update(issueId: string, input: UpdateIssueInput): Promise<Issue | null>;
  /** Hard-delete an issue by id. */
  delete(issueId: string): Promise<void>;
  /** Retrieve an issue by its id. Returns null if not found. */
  findById(issueId: string): Promise<Issue | null>;
  /** List all issues for a given task. */
  findByTaskId(taskId: string): Promise<Issue[]>;
  /** Count open issues for a given task (used in guard conditions). */
  countOpenByTaskId(taskId: string): Promise<number>;
  /** Persist a lifecycle status transition and stamp resolvedAtISO if to==="resolved". */
  transitionStatus(issueId: string, to: IssueStatus, nowISO: string): Promise<Issue | null>;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/repositories/TaskRepository.ts
````typescript
/**
 * @module workspace-flow/domain/repositories
 * @file TaskRepository.ts
 * @description Repository port interface for Task persistence.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Implement in infrastructure/repositories/FirebaseTaskRepository
 */

import type { Task, CreateTaskInput, UpdateTaskInput } from "../entities/Task";
import type { TaskStatus } from "../value-objects/TaskStatus";

export interface TaskRepository {
  /** Persist a new task and return the created aggregate. */
  create(input: CreateTaskInput): Promise<Task>;
  /** Update mutable fields on an existing task. Returns null if not found. */
  update(taskId: string, input: UpdateTaskInput): Promise<Task | null>;
  /** Hard-delete a task by id. */
  delete(taskId: string): Promise<void>;
  /** Retrieve a task by its id. Returns null if not found. */
  findById(taskId: string): Promise<Task | null>;
  /** List all tasks belonging to a workspace, ordered by updatedAtISO desc. */
  findByWorkspaceId(workspaceId: string): Promise<Task[]>;
  /** Persist a lifecycle status transition and stamp acceptedAtISO / archivedAtISO as appropriate. */
  transitionStatus(taskId: string, to: TaskStatus, nowISO: string): Promise<Task | null>;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/services/invoice-guards.ts
````typescript
/**
 * @module workspace-flow/domain/services
 * @file invoice-guards.ts
 * @description Pure domain guards for invoice lifecycle invariants.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add guards for additional billing invariants as rules evolve
 */

// ── Guard: item count > 0 before submit ───────────────────────────────────────

/**
 * Asserts that an invoice has at least one item before allowing submission.
 *
 * @param itemCount - Number of items currently on the invoice
 * @returns true if the invoice may be submitted; false if it has no items
 */
export function invoiceHasItems(itemCount: number): boolean {
  return itemCount > 0;
}

// ── Guard: invoice is in draft before item mutation ───────────────────────────

/**
 * Asserts that an invoice is in draft status before allowing item add/remove.
 *
 * @param status - Current invoice status
 * @returns true if items may be mutated; false otherwise
 */
export function invoiceIsEditable(status: string): boolean {
  return status === "draft";
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/services/invoice-transition-policy.ts
````typescript
/**
 * @module workspace-flow/domain/services
 * @file invoice-transition-policy.ts
 * @description Pure domain service encapsulating allowed Invoice status transitions.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Expand with additional guard conditions as billing rules evolve
 */

import { canTransitionInvoiceStatus, type InvoiceStatus } from "../value-objects/InvoiceStatus";

export type InvoiceTransitionResult =
  | { allowed: true }
  | { allowed: false; reason: string };

/**
 * Evaluates whether an invoice lifecycle transition is permitted.
 *
 * @param from - Current invoice status
 * @param to   - Requested next status
 * @returns InvoiceTransitionResult indicating whether the transition is allowed
 */
export function evaluateInvoiceTransition(
  from: InvoiceStatus,
  to: InvoiceStatus,
): InvoiceTransitionResult {
  if (!canTransitionInvoiceStatus(from, to)) {
    return {
      allowed: false,
      reason: `Invoice transition from "${from}" to "${to}" is not permitted.`,
    };
  }
  return { allowed: true };
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/services/issue-transition-policy.ts
````typescript
/**
 * @module workspace-flow/domain/services
 * @file issue-transition-policy.ts
 * @description Pure domain service encapsulating allowed Issue status transitions.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Expand with additional guard conditions as business rules evolve
 */

import { canTransitionIssueStatus, type IssueStatus } from "../value-objects/IssueStatus";

export type IssueTransitionResult =
  | { allowed: true }
  | { allowed: false; reason: string };

/**
 * Evaluates whether an issue lifecycle transition is permitted.
 *
 * @param from - Current issue status
 * @param to   - Requested next status
 * @returns IssueTransitionResult indicating whether the transition is allowed
 */
export function evaluateIssueTransition(
  from: IssueStatus,
  to: IssueStatus,
): IssueTransitionResult {
  if (!canTransitionIssueStatus(from, to)) {
    return {
      allowed: false,
      reason: `Issue transition from "${from}" to "${to}" is not permitted.`,
    };
  }
  return { allowed: true };
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/services/task-guards.ts
````typescript
/**
 * @module workspace-flow/domain/services
 * @file task-guards.ts
 * @description Pure domain guards for task lifecycle invariants.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add guards for additional business invariants as rules evolve
 */

// ── Guard: no open issues ─────────────────────────────────────────────────────

/**
 * Asserts that a task has no open issues before allowing QA-pass or acceptance-approve.
 *
 * @param openIssueCount - The number of open issues currently linked to the task
 * @returns true if the task may proceed; false if blocked by open issues
 */
export function hasNoOpenIssues(openIssueCount: number): boolean {
  return openIssueCount === 0;
}

// ── Guard: invoice closed or none ─────────────────────────────────────────────

/**
 * Asserts that any linked invoice is closed (or none exists) before allowing archive.
 *
 * @param invoiceStatus - The status of the linked invoice, or undefined if none
 * @returns true if the task may be archived; false if blocked by an active invoice
 */
export function invoiceAllowsArchive(
  invoiceStatus: string | undefined,
): boolean {
  if (invoiceStatus === undefined) return true;
  return invoiceStatus === "closed";
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/services/task-transition-policy.ts
````typescript
/**
 * @module workspace-flow/domain/services
 * @file task-transition-policy.ts
 * @description Pure domain service encapsulating allowed Task status transitions.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Expand with multi-branch transitions if workflow rules evolve
 */

import { canTransitionTaskStatus, type TaskStatus } from "../value-objects/TaskStatus";

export type TaskTransitionResult =
  | { allowed: true }
  | { allowed: false; reason: string };

/**
 * Evaluates whether a task lifecycle transition is permitted.
 *
 * @param from - Current task status
 * @param to   - Requested next status
 * @returns TaskTransitionResult indicating whether the transition is allowed
 */
export function evaluateTaskTransition(
  from: TaskStatus,
  to: TaskStatus,
): TaskTransitionResult {
  if (!canTransitionTaskStatus(from, to)) {
    return {
      allowed: false,
      reason: `Task transition from "${from}" to "${to}" is not permitted.`,
    };
  }
  return { allowed: true };
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/value-objects/InvoiceId.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file InvoiceId.ts
 * @description Branded string value object for Invoice identifiers.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Consider using a stronger opaque type if ID generation logic is added
 */

declare const InvoiceIdBrand: unique symbol;

/** Branded string that prevents mixing Invoice IDs with other string IDs. */
export type InvoiceId = string & { readonly [InvoiceIdBrand]: void };

/** Creates an InvoiceId from a plain string (e.g. a Firestore document ID). */
export function invoiceId(raw: string): InvoiceId {
  return raw as InvoiceId;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/value-objects/InvoiceItemId.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file InvoiceItemId.ts
 * @description Branded string value object for InvoiceItem identifiers.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Consider using a stronger opaque type if ID generation logic is added
 */

declare const InvoiceItemIdBrand: unique symbol;

/** Branded string that prevents mixing InvoiceItem IDs with other string IDs. */
export type InvoiceItemId = string & { readonly [InvoiceItemIdBrand]: void };

/** Creates an InvoiceItemId from a plain string (e.g. a Firestore document ID). */
export function invoiceItemId(raw: string): InvoiceItemId {
  return raw as InvoiceItemId;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/value-objects/InvoiceStatus.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file InvoiceStatus.ts
 * @description Invoice lifecycle status union, transition table, and helpers.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add additional transition guards as billing rules evolve
 */

// ── Status ─────────────────────────────────────────────────────────────────────

export type InvoiceStatus =
  | "draft"
  | "submitted"
  | "finance_review"
  | "approved"
  | "paid"
  | "closed";

export const INVOICE_STATUSES = [
  "draft",
  "submitted",
  "finance_review",
  "approved",
  "paid",
  "closed",
] as const satisfies readonly InvoiceStatus[];

// ── Transition table ──────────────────────────────────────────────────────────

/**
 * Multi-successor transition map for invoice lifecycle.
 *
 * draft → submitted (SUBMIT / item_count > 0)
 * submitted → finance_review (REVIEW)
 * finance_review → approved (APPROVE)
 * finance_review → submitted (REJECT — back to submitted for resubmission)
 * approved → paid (PAY)
 * paid → closed (CLOSE)
 */
const INVOICE_NEXT: Readonly<Record<InvoiceStatus, readonly InvoiceStatus[]>> = {
  draft: ["submitted"],
  submitted: ["finance_review"],
  finance_review: ["approved", "submitted"],
  approved: ["paid"],
  paid: ["closed"],
  closed: [],
};

/** Returns true if moving from `from` to `to` is a valid transition. */
export function canTransitionInvoiceStatus(from: InvoiceStatus, to: InvoiceStatus): boolean {
  return INVOICE_NEXT[from].includes(to);
}

/** Returns true when the invoice has reached a terminal state and cannot progress. */
export function isTerminalInvoiceStatus(status: InvoiceStatus): boolean {
  return INVOICE_NEXT[status].length === 0;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/value-objects/IssueId.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file IssueId.ts
 * @description Branded string value object for Issue identifiers.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Consider using a stronger opaque type if ID generation logic is added
 */

declare const IssueIdBrand: unique symbol;

/** Branded string that prevents mixing Issue IDs with other string IDs. */
export type IssueId = string & { readonly [IssueIdBrand]: void };

/** Creates an IssueId from a plain string (e.g. a Firestore document ID). */
export function issueId(raw: string): IssueId {
  return raw as IssueId;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/value-objects/IssueStage.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file IssueStage.ts
 * @description Cross-domain stage reference indicating at which task-flow stage an issue was raised.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Extend stage list if workflow introduces additional stages
 */

// ── IssueStage ─────────────────────────────────────────────────────────────────

/**
 * Indicates which stage of the task workflow this issue was raised in.
 * Used to route issue resolution back to the originating workflow step.
 */
export type IssueStage = "task" | "qa" | "acceptance";

export const ISSUE_STAGES = [
  "task",
  "qa",
  "acceptance",
] as const satisfies readonly IssueStage[];
````

## File: modules/workspace/subdomains/workspace-workflow/domain/value-objects/IssueStatus.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file IssueStatus.ts
 * @description Issue lifecycle status union, multi-successor transition table, and helpers.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add additional transition guards as business rules evolve
 */

// ── Status ─────────────────────────────────────────────────────────────────────

export type IssueStatus =
  | "open"
  | "investigating"
  | "fixing"
  | "retest"
  | "resolved"
  | "closed";

export const ISSUE_STATUSES = [
  "open",
  "investigating",
  "fixing",
  "retest",
  "resolved",
  "closed",
] as const satisfies readonly IssueStatus[];

// ── Transition table ──────────────────────────────────────────────────────────

/**
 * Multi-successor transition map for issue lifecycle.
 *
 * open → investigating (START)
 * investigating → fixing (FIX)
 * fixing → retest (SUBMIT_RETEST)
 * retest → resolved (PASS_RETEST)
 * retest → fixing (FAIL_RETEST — back-edge within the Issue fix cycle)
 * resolved → closed (CLOSE)
 */
const ISSUE_NEXT: Readonly<Record<IssueStatus, readonly IssueStatus[]>> = {
  open: ["investigating"],
  investigating: ["fixing"],
  fixing: ["retest"],
  retest: ["resolved", "fixing"],
  resolved: ["closed"],
  closed: [],
};

/** Returns true if moving from `from` to `to` is a valid transition. */
export function canTransitionIssueStatus(from: IssueStatus, to: IssueStatus): boolean {
  return ISSUE_NEXT[from].includes(to);
}

/** Returns true when the issue has reached a terminal state and cannot progress. */
export function isTerminalIssueStatus(status: IssueStatus): boolean {
  return ISSUE_NEXT[status].length === 0;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/value-objects/SourceReference.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file SourceReference.ts
 * @description Value object representing the origin of a materialized entity (Task or Invoice).
 *
 * A SourceReference is attached to Task and Invoice entities that were created
 * by the KnowledgeToWorkflowMaterializer Process Manager in response to a
 * `knowledge.page_approved` event. It provides full audit traceability:
 *
 *   Task → sourceReference → KnowledgePage → IngestionJob → source PDF
 */

export type SourceReferenceType = "KnowledgePage";

export interface SourceReference {
  /** The type of the source aggregate. */
  readonly type: SourceReferenceType;
  /** The ID of the source aggregate (e.g. KnowledgePage.id). */
  readonly id: string;
  /**
   * causationId from the `knowledge.page_approved` event that triggered
   * materialization.  Stored for idempotency checks and audit trails.
   */
  readonly causationId: string;
  /**
   * correlationId tracing the entire business flow:
   *   ingestion → human review → approval → materialization.
   */
  readonly correlationId: string;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/value-objects/TaskId.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file TaskId.ts
 * @description Branded string value object for Task identifiers.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Consider using a stronger opaque type if ID generation logic is added
 */

declare const TaskIdBrand: unique symbol;

/** Branded string that prevents mixing Task IDs with other string IDs. */
export type TaskId = string & { readonly [TaskIdBrand]: void };

/** Creates a TaskId from a plain string (e.g. a Firestore document ID). */
export function taskId(raw: string): TaskId {
  return raw as TaskId;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/value-objects/TaskStatus.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file TaskStatus.ts
 * @description Task lifecycle status union, transition table, and pure helper functions.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add additional transition guards as business rules evolve
 */

// ── Status ─────────────────────────────────────────────────────────────────────

export type TaskStatus =
  | "draft"
  | "in_progress"
  | "qa"
  | "acceptance"
  | "accepted"
  | "archived";

/** Ordered tuple used by Zod schemas (z.enum needs a const tuple). */
export const TASK_STATUSES = [
  "draft",
  "in_progress",
  "qa",
  "acceptance",
  "accepted",
  "archived",
] as const satisfies readonly TaskStatus[];

// ── Transition table ──────────────────────────────────────────────────────────

/**
 * Maps each status to its single valid successor (null = terminal).
 *
 * The flow is intentionally forward-only.
 * draft → in_progress (ASSIGN)
 * in_progress → qa (SUBMIT_QA)
 * qa → acceptance (PASS_QA)
 * acceptance → accepted (APPROVE_ACCEPTANCE)
 * accepted → archived (ARCHIVE)
 */
const TASK_NEXT: Readonly<Record<TaskStatus, TaskStatus | null>> = {
  draft: "in_progress",
  in_progress: "qa",
  qa: "acceptance",
  acceptance: "accepted",
  accepted: "archived",
  archived: null,
};

/** Returns true if moving from `from` to `to` is a valid forward transition. */
export function canTransitionTaskStatus(from: TaskStatus, to: TaskStatus): boolean {
  return TASK_NEXT[from] === to;
}

/** Returns the next status in the main flow, or null if already terminal. */
export function nextTaskStatus(current: TaskStatus): TaskStatus | null {
  return TASK_NEXT[current];
}

/** Returns true when the task has reached a terminal state and cannot progress. */
export function isTerminalTaskStatus(status: TaskStatus): boolean {
  return TASK_NEXT[status] === null;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/value-objects/UserId.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file UserId.ts
 * @description Branded string value object for User identifiers.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Consider using a stronger opaque type if ID generation logic is added
 */

declare const UserIdBrand: unique symbol;

/** Branded string that prevents mixing User IDs with other string IDs. */
export type UserId = string & { readonly [UserIdBrand]: void };

/** Creates a UserId from a plain string (e.g. a Firebase Auth UID). */
export function userId(raw: string): UserId {
  return raw as UserId;
}
````

## File: modules/workspace/subdomains/workspace-workflow/infrastructure/firebase/invoice-item.converter.ts
````typescript
/**
 * @module workspace-flow/infrastructure/firebase
 * @file invoice-item.converter.ts
 * @description Firestore document-to-entity converter for InvoiceItem.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Harden unknown field handling with stricter runtime validation
 */

import type { InvoiceItem } from "../../domain/entities/InvoiceItem";

/**
 * Converts a raw Firestore document data map into a typed InvoiceItem entity.
 *
 * @param id   - Firestore document ID
 * @param data - Raw document fields from Firestore
 */
export function toInvoiceItem(id: string, data: Record<string, unknown>): InvoiceItem {
  return {
    id,
    invoiceId: typeof data.invoiceId === "string" ? data.invoiceId : "",
    taskId: typeof data.taskId === "string" ? data.taskId : "",
    amount: typeof data.amount === "number" ? data.amount : 0,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}
````

## File: modules/workspace/subdomains/workspace-workflow/infrastructure/firebase/invoice.converter.ts
````typescript
/**
 * @module workspace-flow/infrastructure/firebase
 * @file invoice.converter.ts
 * @description Firestore document-to-entity converter for Invoice.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Harden unknown field handling with stricter runtime validation
 */

import type { Invoice } from "../../domain/entities/Invoice";
import { INVOICE_STATUSES, type InvoiceStatus } from "../../domain/value-objects/InvoiceStatus";
import { toSourceReference } from "./sourceReference.converter";

const VALID_STATUSES = new Set<InvoiceStatus>(INVOICE_STATUSES);
const DEFAULT_STATUS: InvoiceStatus = "draft";

/**
 * Converts a raw Firestore document data map into a typed Invoice entity.
 *
 * @param id   - Firestore document ID
 * @param data - Raw document fields from Firestore
 */
export function toInvoice(id: string, data: Record<string, unknown>): Invoice {
  const rawStatus = data.status as InvoiceStatus;
  return {
    id,
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    status: VALID_STATUSES.has(rawStatus) ? rawStatus : DEFAULT_STATUS,
    totalAmount: typeof data.totalAmount === "number" ? data.totalAmount : 0,
    submittedAtISO: typeof data.submittedAtISO === "string" ? data.submittedAtISO : undefined,
    approvedAtISO: typeof data.approvedAtISO === "string" ? data.approvedAtISO : undefined,
    paidAtISO: typeof data.paidAtISO === "string" ? data.paidAtISO : undefined,
    closedAtISO: typeof data.closedAtISO === "string" ? data.closedAtISO : undefined,
    sourceReference: toSourceReference(data.sourceReference),
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}
````

## File: modules/workspace/subdomains/workspace-workflow/infrastructure/firebase/issue.converter.ts
````typescript
/**
 * @module workspace-flow/infrastructure/firebase
 * @file issue.converter.ts
 * @description Firestore document-to-entity converter for Issue.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Harden unknown field handling with stricter runtime validation
 */

import type { Issue } from "../../domain/entities/Issue";
import { ISSUE_STATUSES, type IssueStatus } from "../../domain/value-objects/IssueStatus";
import { ISSUE_STAGES, type IssueStage } from "../../domain/value-objects/IssueStage";

const VALID_STATUSES = new Set<IssueStatus>(ISSUE_STATUSES);
const VALID_STAGES = new Set<IssueStage>(ISSUE_STAGES);
const DEFAULT_STATUS: IssueStatus = "open";
const DEFAULT_STAGE: IssueStage = "task";

/**
 * Converts a raw Firestore document data map into a typed Issue entity.
 *
 * @param id   - Firestore document ID
 * @param data - Raw document fields from Firestore
 */
export function toIssue(id: string, data: Record<string, unknown>): Issue {
  const rawStatus = data.status as IssueStatus;
  const rawStage = data.stage as IssueStage;
  return {
    id,
    taskId: typeof data.taskId === "string" ? data.taskId : "",
    stage: VALID_STAGES.has(rawStage) ? rawStage : DEFAULT_STAGE,
    title: typeof data.title === "string" ? data.title : "",
    description: typeof data.description === "string" ? data.description : "",
    status: VALID_STATUSES.has(rawStatus) ? rawStatus : DEFAULT_STATUS,
    createdBy: typeof data.createdBy === "string" ? data.createdBy : "",
    assignedTo: typeof data.assignedTo === "string" ? data.assignedTo : undefined,
    resolvedAtISO: typeof data.resolvedAtISO === "string" ? data.resolvedAtISO : undefined,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}
````

## File: modules/workspace/subdomains/workspace-workflow/infrastructure/firebase/sourceReference.converter.ts
````typescript
/**
 * @module workspace-flow/infrastructure/firebase
 * @file sourceReference.converter.ts
 * @description Firestore document-to-value-object converter for SourceReference.
 * Shared by task.converter.ts and invoice.converter.ts.
 */

import type { SourceReference } from "../../domain/value-objects/SourceReference";

/**
 * Convert a raw Firestore field value to a typed SourceReference value object.
 * Returns `undefined` if the value is absent or does not conform to the expected shape.
 */
export function toSourceReference(raw: unknown): SourceReference | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  if (r.type !== "KnowledgePage") return undefined;
  if (
    typeof r.id !== "string" ||
    typeof r.causationId !== "string" ||
    typeof r.correlationId !== "string"
  ) {
    return undefined;
  }
  return { type: "KnowledgePage", id: r.id, causationId: r.causationId, correlationId: r.correlationId };
}
````

## File: modules/workspace/subdomains/workspace-workflow/infrastructure/firebase/task.converter.ts
````typescript
/**
 * @module workspace-flow/infrastructure/firebase
 * @file task.converter.ts
 * @description Firestore document-to-entity converter for Task.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Harden unknown field handling with stricter runtime validation
 */

import type { Task } from "../../domain/entities/Task";
import { TASK_STATUSES, type TaskStatus } from "../../domain/value-objects/TaskStatus";
import { toSourceReference } from "./sourceReference.converter";

const VALID_STATUSES = new Set<TaskStatus>(TASK_STATUSES);
const DEFAULT_STATUS: TaskStatus = "draft";

/**
 * Converts a raw Firestore document data map into a typed Task entity.
 *
 * @param id   - Firestore document ID
 * @param data - Raw document fields from Firestore
 */
export function toTask(id: string, data: Record<string, unknown>): Task {
  const rawStatus = data.status as TaskStatus;
  return {
    id,
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    title: typeof data.title === "string" ? data.title : "",
    description: typeof data.description === "string" ? data.description : "",
    status: VALID_STATUSES.has(rawStatus) ? rawStatus : DEFAULT_STATUS,
    assigneeId: typeof data.assigneeId === "string" ? data.assigneeId : undefined,
    dueDateISO: typeof data.dueDateISO === "string" ? data.dueDateISO : undefined,
    acceptedAtISO: typeof data.acceptedAtISO === "string" ? data.acceptedAtISO : undefined,
    archivedAtISO: typeof data.archivedAtISO === "string" ? data.archivedAtISO : undefined,
    sourceReference: toSourceReference(data.sourceReference),
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}
````

## File: modules/workspace/subdomains/workspace-workflow/infrastructure/firebase/workspace-flow.collections.ts
````typescript
/**
 * @module workspace-flow/infrastructure/firebase
 * @file workspace-flow.collections.ts
 * @description Firestore collection path constants for the workspace-flow module.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Update collection names to match production Firestore schema
 */

/** Top-level Firestore collection for workspace-flow tasks. */
export const WF_TASKS_COLLECTION = "workspaceFlowTasks" as const;

/** Top-level Firestore collection for workspace-flow issues. */
export const WF_ISSUES_COLLECTION = "workspaceFlowIssues" as const;

/** Top-level Firestore collection for workspace-flow invoices. */
export const WF_INVOICES_COLLECTION = "workspaceFlowInvoices" as const;

/** Top-level Firestore collection for workspace-flow invoice items. */
export const WF_INVOICE_ITEMS_COLLECTION = "workspaceFlowInvoiceItems" as const;
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/_actions/workspace-flow-invoice.actions.ts
````typescript
"use server";

/**
 * @module workspace-flow/interfaces/_actions
 * @file workspace-flow-invoice.actions.ts
 * @description Server Actions for workspace-flow Invoice write operations.
 * Delegates exclusively to WorkspaceFlowFacade.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { WorkspaceFlowInvoiceFacade } from "../../api/workspace-flow-invoice.facade";
import { makeInvoiceRepo } from "../../api/factories";
import type { AddInvoiceItemDto } from "../../application/dto/add-invoice-item.dto";
import type { UpdateInvoiceItemDto } from "../../application/dto/update-invoice-item.dto";
import type { RemoveInvoiceItemDto } from "../../application/dto/remove-invoice-item.dto";

function makeFacade(): WorkspaceFlowInvoiceFacade {
  return new WorkspaceFlowInvoiceFacade(
    makeInvoiceRepo(),
  );
}

export async function wfCreateInvoice(workspaceId: string): Promise<CommandResult> {
  try {
    return await makeFacade().createInvoice(workspaceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfAddInvoiceItem(dto: AddInvoiceItemDto): Promise<CommandResult> {
  try {
    return await makeFacade().addInvoiceItem(dto);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_ADD_ITEM_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfUpdateInvoiceItem(invoiceItemId: string, dto: UpdateInvoiceItemDto): Promise<CommandResult> {
  try {
    return await makeFacade().updateInvoiceItem(invoiceItemId, dto);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_UPDATE_ITEM_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfRemoveInvoiceItem(dto: RemoveInvoiceItemDto): Promise<CommandResult> {
  try {
    return await makeFacade().removeInvoiceItem(dto);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_REMOVE_ITEM_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfSubmitInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await makeFacade().submitInvoice(invoiceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_SUBMIT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfReviewInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await makeFacade().reviewInvoice(invoiceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_REVIEW_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfApproveInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await makeFacade().approveInvoice(invoiceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_APPROVE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfRejectInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await makeFacade().rejectInvoice(invoiceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_REJECT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfPayInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await makeFacade().payInvoice(invoiceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_PAY_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfCloseInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await makeFacade().closeInvoice(invoiceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_CLOSE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/_actions/workspace-flow-issue.actions.ts
````typescript
"use server";

/**
 * @module workspace-flow/interfaces/_actions
 * @file workspace-flow-issue.actions.ts
 * @description Server Actions for workspace-flow Issue write operations.
 * Delegates exclusively to WorkspaceFlowFacade.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { WorkspaceFlowIssueFacade } from "../../api/workspace-flow-issue.facade";
import { makeIssueRepo } from "../../api/factories";
import type { OpenIssueDto } from "../../application/dto/open-issue.dto";
import type { ResolveIssueDto } from "../../application/dto/resolve-issue.dto";

function makeFacade(): WorkspaceFlowIssueFacade {
  return new WorkspaceFlowIssueFacade(
    makeIssueRepo(),
  );
}

export async function wfOpenIssue(dto: OpenIssueDto): Promise<CommandResult> {
  try {
    return await makeFacade().openIssue(dto);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_OPEN_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfStartIssue(issueId: string): Promise<CommandResult> {
  try {
    return await makeFacade().startIssue(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_START_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfFixIssue(issueId: string): Promise<CommandResult> {
  try {
    return await makeFacade().fixIssue(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_FIX_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfSubmitIssueRetest(issueId: string): Promise<CommandResult> {
  try {
    return await makeFacade().submitIssueRetest(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_RETEST_SUBMIT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfPassIssueRetest(issueId: string): Promise<CommandResult> {
  try {
    return await makeFacade().passIssueRetest(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_RETEST_PASS_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfFailIssueRetest(issueId: string): Promise<CommandResult> {
  try {
    return await makeFacade().failIssueRetest(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_RETEST_FAIL_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfResolveIssue(dto: ResolveIssueDto): Promise<CommandResult> {
  try {
    return await makeFacade().resolveIssue(dto);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_RESOLVE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfCloseIssue(issueId: string): Promise<CommandResult> {
  try {
    return await makeFacade().closeIssue(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_CLOSE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/_actions/workspace-flow-task.actions.ts
````typescript
"use server";

/**
 * @module workspace-flow/interfaces/_actions
 * @file workspace-flow-task.actions.ts
 * @description Server Actions for workspace-flow Task write operations.
 * Delegates exclusively to WorkspaceFlowFacade.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { WorkspaceFlowTaskFacade } from "../../api/workspace-flow-task.facade";
import { makeIssueRepo, makeTaskRepo } from "../../api/factories";
import type { CreateTaskDto } from "../../application/dto/create-task.dto";
import type { UpdateTaskDto } from "../../application/dto/update-task.dto";

function makeFacade(): WorkspaceFlowTaskFacade {
  return new WorkspaceFlowTaskFacade(
    makeTaskRepo(),
    makeIssueRepo(),
  );
}

export async function wfCreateTask(dto: CreateTaskDto): Promise<CommandResult> {
  try {
    return await makeFacade().createTask(dto);
  } catch (err) {
    return commandFailureFrom("WF_TASK_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfUpdateTask(taskId: string, dto: UpdateTaskDto): Promise<CommandResult> {
  try {
    return await makeFacade().updateTask(taskId, dto);
  } catch (err) {
    return commandFailureFrom("WF_TASK_UPDATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfAssignTask(taskId: string, assigneeId: string): Promise<CommandResult> {
  try {
    return await makeFacade().assignTask(taskId, assigneeId);
  } catch (err) {
    return commandFailureFrom("WF_TASK_ASSIGN_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfSubmitTaskToQa(taskId: string): Promise<CommandResult> {
  try {
    return await makeFacade().submitTaskToQa(taskId);
  } catch (err) {
    return commandFailureFrom("WF_TASK_SUBMIT_QA_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfPassTaskQa(taskId: string): Promise<CommandResult> {
  try {
    return await makeFacade().passTaskQa(taskId);
  } catch (err) {
    return commandFailureFrom("WF_TASK_PASS_QA_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfApproveTaskAcceptance(taskId: string): Promise<CommandResult> {
  try {
    return await makeFacade().approveTaskAcceptance(taskId);
  } catch (err) {
    return commandFailureFrom("WF_TASK_APPROVE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfArchiveTask(taskId: string, invoiceStatus?: string): Promise<CommandResult> {
  try {
    return await makeFacade().archiveTask(taskId, invoiceStatus);
  } catch (err) {
    return commandFailureFrom("WF_TASK_ARCHIVE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/_actions/workspace-flow.actions.ts
````typescript
/**
 * @module workspace-flow/interfaces/_actions
 * @file workspace-flow.actions.ts
 * @description Re-export barrel for all workspace-flow Server Actions.
 *              Each sub-file carries its own "use server" directive; this barrel
 *              must NOT repeat it — Turbopack cannot resolve re-exports from a
 *              "use server" barrel that itself re-exports other "use server" files.
 *  - workspace-flow-task.actions.ts    (create, update, assign, qa, approve, archive)
 *  - workspace-flow-issue.actions.ts   (open, start, fix, retest, resolve, close)
 *  - workspace-flow-invoice.actions.ts (create, add/update/remove item, submit, review, approve, reject, pay, close)
 */

export {
  wfCreateTask,
  wfUpdateTask,
  wfAssignTask,
  wfSubmitTaskToQa,
  wfPassTaskQa,
  wfApproveTaskAcceptance,
  wfArchiveTask,
} from "./workspace-flow-task.actions";

export {
  wfOpenIssue,
  wfStartIssue,
  wfFixIssue,
  wfSubmitIssueRetest,
  wfPassIssueRetest,
  wfFailIssueRetest,
  wfResolveIssue,
  wfCloseIssue,
} from "./workspace-flow-issue.actions";

export {
  wfCreateInvoice,
  wfAddInvoiceItem,
  wfUpdateInvoiceItem,
  wfRemoveInvoiceItem,
  wfSubmitInvoice,
  wfReviewInvoice,
  wfApproveInvoice,
  wfRejectInvoice,
  wfPayInvoice,
  wfCloseInvoice,
} from "./workspace-flow-invoice.actions";
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/components/AssignTaskDialog.tsx
````typescript
"use client";

import { useState } from "react";

import { Button } from "@ui-shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";

import { wfAssignTask } from "../_actions/workspace-flow.actions";

export interface AssignTaskDialogProps {
  open: boolean;
  taskId: string;
  onClose: () => void;
  onDone: () => void;
}

export function AssignTaskDialog({ open, taskId, onClose, onDone }: AssignTaskDialogProps) {
  const [assigneeId, setAssigneeId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleClose() {
    setAssigneeId("");
    setError(null);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const a = assigneeId.trim();
    if (!a) { setError("請輸入指派人 ID。"); return; }
    setSubmitting(true);
    setError(null);
    try {
      const result = await wfAssignTask(taskId, a);
      if (!result.success) { setError(result.error.message ?? "指派失敗"); return; }
      onDone();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "指派失敗，請再試一次。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>指派任務</DialogTitle>
          <DialogDescription>填入負責人 ID，任務將進入進行中。</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="assignee-id">指派人 ID *</Label>
            <Input
              id="assignee-id"
              placeholder="用戶 ID"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              disabled={submitting}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={submitting}>取消</Button>
            <Button type="submit" disabled={submitting}>{submitting ? "指派中…" : "指派"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/components/CreateTaskDialog.tsx
````typescript
"use client";

import { useState } from "react";

import { Button } from "@ui-shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { Textarea } from "@ui-shadcn/ui/textarea";

import { wfCreateTask } from "../_actions/workspace-flow.actions";

export interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  workspaceId: string;
}

export function CreateTaskDialog({ open, onClose, onCreated, workspaceId }: CreateTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDateISO, setDueDateISO] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleClose() {
    setTitle("");
    setDescription("");
    setAssigneeId("");
    setDueDateISO("");
    setError(null);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) { setError("請輸入任務標題。"); return; }
    setSubmitting(true);
    setError(null);
    try {
      const result = await wfCreateTask({
        workspaceId,
        title: t,
        description: description.trim() || undefined,
        assigneeId: assigneeId.trim() || undefined,
        dueDateISO: dueDateISO || undefined,
      });
      if (!result.success) { setError(result.error.message ?? "建立失敗"); return; }
      onCreated();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "建立失敗，請再試一次。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>建立任務</DialogTitle>
          <DialogDescription>新增一個工作任務到此工作區。</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="task-title">標題 *</Label>
            <Input
              id="task-title"
              placeholder="任務名稱"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="task-description">描述（選填）</Label>
            <Textarea
              id="task-description"
              placeholder="任務詳情或驗收條件…"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="task-assignee">指派人 ID（選填）</Label>
              <Input
                id="task-assignee"
                placeholder="用戶 ID"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                disabled={submitting}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="task-due">截止日期（選填）</Label>
              <Input
                id="task-due"
                type="date"
                value={dueDateISO}
                onChange={(e) => setDueDateISO(e.target.value)}
                disabled={submitting}
              />
            </div>
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={submitting}>取消</Button>
            <Button type="submit" disabled={submitting}>{submitting ? "建立中…" : "建立任務"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/components/InvoiceRow.tsx
````typescript
"use client";

import { useState } from "react";

import type { CommandResult } from "@shared-types";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";

import type { Invoice } from "../../application/dto/workflow.dto";
import type { InvoiceStatus } from "../../application/dto/workflow.dto";
import {
  wfApproveInvoice,
  wfCloseInvoice,
  wfPayInvoice,
  wfRejectInvoice,
  wfReviewInvoice,
  wfSubmitInvoice,
} from "../_actions/workspace-flow.actions";

const INVOICE_STATUS_VARIANT: Record<
  InvoiceStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  draft: "outline",
  submitted: "secondary",
  finance_review: "secondary",
  approved: "default",
  paid: "default",
  closed: "outline",
};

const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
  draft: "草稿",
  submitted: "已提交",
  finance_review: "財務審核",
  approved: "已核准",
  paid: "已付款",
  closed: "已結清",
};

function formatShortDate(iso: string | undefined): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function formatCurrency(amount: number): string {
  try {
    return new Intl.NumberFormat("zh-TW", {
      style: "currency",
      currency: "TWD",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `TWD ${amount}`;
  }
}

export interface InvoiceRowProps {
  invoice: Invoice;
  onTransitioned: () => void;
}

export function InvoiceRow({ invoice, onTransitioned }: InvoiceRowProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runAction(action: () => Promise<CommandResult>) {
    setBusy(true);
    setError(null);
    try {
      const result = await action();
      if (!result.success) { setError(result.error.message ?? "操作失敗"); }
      else { onTransitioned(); }
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失敗");
    } finally {
      setBusy(false);
    }
  }

  function renderActions() {
    switch (invoice.status) {
      case "draft":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfSubmitInvoice(invoice.id))}>提交</Button>;
      case "submitted":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfReviewInvoice(invoice.id))}>送審</Button>;
      case "finance_review":
        return (
          <div className="flex gap-1.5">
            <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfApproveInvoice(invoice.id))}>核准</Button>
            <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfRejectInvoice(invoice.id))}>退回</Button>
          </div>
        );
      case "approved":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfPayInvoice(invoice.id))}>付款</Button>;
      case "paid":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfCloseInvoice(invoice.id))}>結清</Button>;
      default:
        return null;
    }
  }

  return (
    <div className="rounded-xl border border-border/40 px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">
            #{invoice.id.slice(-8).toUpperCase()}
          </p>
          <p className="text-xs text-muted-foreground">建立：{formatShortDate(invoice.createdAtISO)}</p>
          {invoice.paidAtISO && (
            <p className="text-xs text-muted-foreground">付款：{formatShortDate(invoice.paidAtISO)}</p>
          )}
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <Badge variant={INVOICE_STATUS_VARIANT[invoice.status]}>
            {INVOICE_STATUS_LABEL[invoice.status]}
          </Badge>
          <p className="text-sm font-semibold text-foreground">{formatCurrency(invoice.totalAmount)}</p>
          {renderActions()}
        </div>
      </div>
    </div>
  );
}
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/components/IssueRow.tsx
````typescript
"use client";

import { useState } from "react";

import type { CommandResult } from "@shared-types";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";

import type { Issue } from "../../application/dto/workflow.dto";
import type { IssueStage } from "../../application/dto/workflow.dto";
import {
  wfCloseIssue,
  wfFailIssueRetest,
  wfFixIssue,
  wfPassIssueRetest,
  wfStartIssue,
  wfSubmitIssueRetest,
} from "../_actions/workspace-flow.actions";

export const ISSUE_STAGE_LABEL: Record<IssueStage, string> = {
  task: "任務",
  qa: "QA",
  acceptance: "驗收",
};

const ISSUE_STATUS_VARIANT: Record<
  Issue["status"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  open: "destructive",
  investigating: "destructive",
  fixing: "secondary",
  retest: "secondary",
  resolved: "default",
  closed: "outline",
};

const ISSUE_STATUS_LABEL: Record<Issue["status"], string> = {
  open: "開啟",
  investigating: "調查中",
  fixing: "修復中",
  retest: "重測中",
  resolved: "已解決",
  closed: "已關閉",
};

export interface IssueRowProps {
  issue: Issue;
  onTransitioned: () => void;
}

export function IssueRow({ issue, onTransitioned }: IssueRowProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runAction(action: () => Promise<CommandResult>) {
    setBusy(true);
    setError(null);
    try {
      const result = await action();
      if (!result.success) { setError(result.error.message ?? "操作失敗"); }
      else { onTransitioned(); }
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失敗");
    } finally {
      setBusy(false);
    }
  }

  function renderActions() {
    switch (issue.status) {
      case "open":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfStartIssue(issue.id))}>開始調查</Button>;
      case "investigating":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfFixIssue(issue.id))}>開始修復</Button>;
      case "fixing":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfSubmitIssueRetest(issue.id))}>送重測</Button>;
      case "retest":
        return (
          <div className="flex gap-1.5">
            <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfPassIssueRetest(issue.id))}>通過</Button>
            <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfFailIssueRetest(issue.id))}>失敗</Button>
          </div>
        );
      case "resolved":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfCloseIssue(issue.id))}>關閉</Button>;
      default:
        return null;
    }
  }

  return (
    <div className="rounded-lg border border-border/30 px-3 py-2.5 text-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant={ISSUE_STATUS_VARIANT[issue.status]} className="text-xs">
              {ISSUE_STATUS_LABEL[issue.status]}
            </Badge>
            <Badge variant="outline" className="text-xs">{ISSUE_STAGE_LABEL[issue.stage]}</Badge>
            <span className="font-medium text-foreground truncate">{issue.title}</span>
          </div>
          {issue.description && (
            <p className="text-xs text-muted-foreground line-clamp-1">{issue.description}</p>
          )}
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
        <div className="shrink-0">{renderActions()}</div>
      </div>
    </div>
  );
}
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/components/OpenIssueDialog.tsx
````typescript
"use client";

import { useState } from "react";

import { Button } from "@ui-shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { Textarea } from "@ui-shadcn/ui/textarea";

import type { IssueStage } from "../../application/dto/workflow.dto";
import { wfOpenIssue } from "../_actions/workspace-flow.actions";
import { ISSUE_STAGE_LABEL } from "./IssueRow";

export interface OpenIssueDialogProps {
  open: boolean;
  taskId: string;
  currentUserId: string;
  onClose: () => void;
  onCreated: () => void;
}

export function OpenIssueDialog({ open, taskId, currentUserId, onClose, onCreated }: OpenIssueDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stage, setStage] = useState<IssueStage>("task");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleClose() {
    setTitle("");
    setDescription("");
    setStage("task");
    setError(null);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) { setError("請輸入議題標題。"); return; }
    setSubmitting(true);
    setError(null);
    try {
      const result = await wfOpenIssue({
        taskId,
        stage,
        title: t,
        description: description.trim() || undefined,
        createdBy: currentUserId,
      });
      if (!result.success) { setError(result.error.message ?? "建立失敗"); return; }
      onCreated();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "建立失敗，請再試一次。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>開啟議題</DialogTitle>
          <DialogDescription>記錄此任務發現的問題或異常。</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="issue-title">標題 *</Label>
            <Input
              id="issue-title"
              placeholder="問題簡述"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="issue-description">描述（選填）</Label>
            <Textarea
              id="issue-description"
              placeholder="問題詳情、重現步驟…"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div className="space-y-1.5">
            <Label>發生階段</Label>
            <div className="flex gap-2">
              {(["task", "qa", "acceptance"] as const).map((s) => (
                <Button
                  key={s}
                  type="button"
                  size="sm"
                  variant={stage === s ? "default" : "outline"}
                  onClick={() => setStage(s)}
                  disabled={submitting}
                >
                  {ISSUE_STAGE_LABEL[s]}
                </Button>
              ))}
            </div>
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={submitting}>取消</Button>
            <Button type="submit" disabled={submitting}>{submitting ? "建立中…" : "開啟議題"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/components/TaskRow.tsx
````typescript
"use client";

import { useCallback, useState } from "react";

import { ChevronDown, ChevronRight, Plus } from "lucide-react";

import type { CommandResult } from "@shared-types";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";

import type { Issue } from "../../application/dto/workflow.dto";
import type { Task } from "../../application/dto/workflow.dto";
import type { TaskStatus } from "../../application/dto/workflow.dto";
import {
  wfApproveTaskAcceptance,
  wfArchiveTask,
  wfPassTaskQa,
  wfSubmitTaskToQa,
} from "../_actions/workspace-flow.actions";
import { getWorkspaceFlowIssues } from "../queries/workspace-flow.queries";
import { AssignTaskDialog } from "./AssignTaskDialog";
import { IssueRow } from "./IssueRow";
import { OpenIssueDialog } from "./OpenIssueDialog";

const TASK_STATUS_VARIANT: Record<
  TaskStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  draft: "outline",
  in_progress: "secondary",
  qa: "secondary",
  acceptance: "default",
  accepted: "default",
  archived: "outline",
};

const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  draft: "草稿",
  in_progress: "進行中",
  qa: "QA 審查",
  acceptance: "驗收中",
  accepted: "已驗收",
  archived: "已歸檔",
};

function formatShortDate(iso: string | undefined): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export interface TaskRowProps {
  task: Task;
  currentUserId: string;
  onTransitioned: () => void;
}

export function TaskRow({ task, currentUserId, onTransitioned }: TaskRowProps) {
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);
  const [issuesExpanded, setIssuesExpanded] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [issuesLoaded, setIssuesLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadIssues = useCallback(async () => {
    try {
      const data = await getWorkspaceFlowIssues(task.id);
      setIssues(data);
      setIssuesLoaded(true);
    } catch {
      // non-fatal
    }
  }, [task.id]);

  async function toggleIssues() {
    if (!issuesExpanded && !issuesLoaded) {
      await loadIssues();
    }
    setIssuesExpanded((v) => !v);
  }

  async function runAction(action: () => Promise<CommandResult>) {
    setBusy(true);
    setError(null);
    try {
      const result = await action();
      if (!result.success) { setError(result.error.message ?? "操作失敗"); }
      else { onTransitioned(); }
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失敗");
    } finally {
      setBusy(false);
    }
  }

  function renderTaskAction() {
    switch (task.status) {
      case "draft":
        return (
          <Button size="sm" variant="outline" disabled={busy} onClick={() => setAssignDialogOpen(true)}>
            指派任務
          </Button>
        );
      case "in_progress":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfSubmitTaskToQa(task.id))}>送 QA</Button>;
      case "qa":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfPassTaskQa(task.id))}>QA 通過</Button>;
      case "acceptance":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfApproveTaskAcceptance(task.id))}>驗收通過</Button>;
      case "accepted":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfArchiveTask(task.id))}>歸檔</Button>;
      default:
        return null;
    }
  }

  return (
    <div className="rounded-xl border border-border/40 px-4 py-4 space-y-3">
      {/* ── Task header ─────────────────────── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{task.title}</p>
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
          )}
          {task.assigneeId && (
            <p className="text-xs text-muted-foreground">指派：{task.assigneeId}</p>
          )}
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <Badge variant={TASK_STATUS_VARIANT[task.status]}>{TASK_STATUS_LABEL[task.status]}</Badge>
          {task.dueDateISO && (
            <p className="text-xs text-muted-foreground">截止：{formatShortDate(task.dueDateISO)}</p>
          )}
        </div>
      </div>

      {/* ── Action row ──────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        {renderTaskAction()}
        <Button
          size="sm"
          variant="ghost"
          className="text-muted-foreground"
          onClick={() => setIssueDialogOpen(true)}
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          開議題
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-muted-foreground ml-auto"
          onClick={toggleIssues}
        >
          {issuesExpanded ? (
            <ChevronDown className="mr-1 h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="mr-1 h-3.5 w-3.5" />
          )}
          議題{issuesLoaded ? ` (${issues.length})` : ""}
        </Button>
      </div>

      {/* ── Issues sub-list ─────────────────── */}
      {issuesExpanded && (
        <div className="space-y-2 pl-1">
          {issues.length === 0 ? (
            <p className="text-xs text-muted-foreground">此任務目前無議題。</p>
          ) : (
            issues.map((issue) => (
              <IssueRow
                key={issue.id}
                issue={issue}
                onTransitioned={loadIssues}
              />
            ))
          )}
        </div>
      )}

      {/* ── Dialogs ─────────────────────────── */}
      <AssignTaskDialog
        open={assignDialogOpen}
        taskId={task.id}
        onClose={() => setAssignDialogOpen(false)}
        onDone={onTransitioned}
      />
      <OpenIssueDialog
        open={issueDialogOpen}
        taskId={task.id}
        currentUserId={currentUserId}
        onClose={() => setIssueDialogOpen(false)}
        onCreated={async () => {
          await loadIssues();
          if (!issuesExpanded) setIssuesExpanded(true);
        }}
      />
    </div>
  );
}
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/components/WorkspaceFlowTab.tsx
````typescript
"use client";

/**
 * @module workspace-flow/interfaces/components
 * @file WorkspaceFlowTab.tsx
 * @description Workspace-level tab displaying Tasks, Issues, and Invoices managed by workspace-flow.
 *
 * MVP interactive surface:
 * - Create Task dialog
 * - Task lifecycle transition buttons (assign → QA → acceptance → archive)
 * - Per-task expandable Issue sub-list with transition buttons
 * - Open Issue dialog
 * - Create Invoice button + Invoice lifecycle transitions
 *
 * @author workspace-flow
 * @since 2026-03-27
 */

import { useCallback, useEffect, useMemo, useState } from "react";

import { Plus } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { Separator } from "@ui-shadcn/ui/separator";

import type { Invoice } from "../../application/dto/workflow.dto";
import type { Issue } from "../../application/dto/workflow.dto";
import type { Task } from "../../application/dto/workflow.dto";
import { wfCreateInvoice } from "../_actions/workspace-flow.actions";
import {
  getWorkspaceFlowIssues,
  getWorkspaceFlowInvoices,
  getWorkspaceFlowTasks,
} from "../queries/workspace-flow.queries";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { IssueRow } from "./IssueRow";
import { InvoiceRow } from "./InvoiceRow";
import { TaskRow } from "./TaskRow";

// ── Types ──────────────────────────────────────────────────────────────────────

type FlowSection = "tasks" | "qa" | "acceptance" | "issues" | "invoices";

interface WorkspaceFlowTabProps {
  readonly workspaceId: string;
  readonly currentUserId?: string;
  readonly initialSection?: FlowSection;
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function WorkspaceFlowTab({
  workspaceId,
  currentUserId = "anonymous",
  initialSection = "tasks",
}: WorkspaceFlowTabProps) {
  const [section, setSection] = useState<FlowSection>(initialSection);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoadState("loading");
    try {
      const [nextTasks, nextInvoices] = await Promise.all([
        getWorkspaceFlowTasks(workspaceId),
        getWorkspaceFlowInvoices(workspaceId),
      ]);
      const issueMatrix = await Promise.all(
        nextTasks.map(async (task) => {
          try {
            return await getWorkspaceFlowIssues(task.id);
          } catch {
            return [] as Issue[];
          }
        }),
      );
      setTasks(nextTasks);
      setInvoices(nextInvoices);
      setIssues(issueMatrix.flat());
      setLoadState("loaded");
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[WorkspaceFlowTab] Failed to load flow data:", err);
      }
      setLoadState("error");
    }
  }, [workspaceId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    setSection(initialSection);
  }, [initialSection]);

  const qaTasks = useMemo(
    () => tasks.filter((task) => task.status === "qa"),
    [tasks],
  );

  const acceptanceTasks = useMemo(
    () => tasks.filter((task) => task.status === "acceptance" || task.status === "accepted"),
    [tasks],
  );

  async function handleCreateInvoice() {
    setCreatingInvoice(true);
    setActionError(null);
    try {
      const result = await wfCreateInvoice(workspaceId);
      if (!result.success) { setActionError(result.error.message ?? "建立發票失敗"); }
      else { await loadData(); }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "建立發票失敗");
    } finally {
      setCreatingInvoice(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* ── Section switcher ─────────────────────────────────────────── */}
      <div className="flex gap-2">
        <Button
          variant={section === "tasks" ? "default" : "outline"}
          size="sm"
          onClick={() => setSection("tasks")}
        >
          任務{loadState === "loaded" ? ` (${tasks.length})` : ""}
        </Button>
        <Button
          variant={section === "qa" ? "default" : "outline"}
          size="sm"
          onClick={() => setSection("qa")}
        >
          質檢{loadState === "loaded" ? ` (${qaTasks.length})` : ""}
        </Button>
        <Button
          variant={section === "acceptance" ? "default" : "outline"}
          size="sm"
          onClick={() => setSection("acceptance")}
        >
          驗收{loadState === "loaded" ? ` (${acceptanceTasks.length})` : ""}
        </Button>
        <Button
          variant={section === "issues" ? "default" : "outline"}
          size="sm"
          onClick={() => setSection("issues")}
        >
          問題單{loadState === "loaded" ? ` (${issues.length})` : ""}
        </Button>
        <Button
          variant={section === "invoices" ? "default" : "outline"}
          size="sm"
          onClick={() => setSection("invoices")}
        >
          財務{loadState === "loaded" ? ` (${invoices.length})` : ""}
        </Button>
      </div>

      {/* ── Loading state ─────────────────────────────────────────────── */}
      {loadState === "loading" && (
        <Card className="border border-border/50">
          <CardContent className="px-6 py-5 text-sm text-muted-foreground">載入中…</CardContent>
        </Card>
      )}

      {/* ── Error state ───────────────────────────────────────────────── */}
      {loadState === "error" && (
        <Card className="border border-destructive/30">
          <CardContent className="px-6 py-5 text-sm text-destructive">
            無法載入資料，請重新整理頁面後再試。
          </CardContent>
        </Card>
      )}

      {/* ── Tasks section ─────────────────────────────────────────────── */}
      {loadState === "loaded" && section === "tasks" && (
        <Card className="border border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>任務</CardTitle>
                <CardDescription>工作區所有任務與其進度狀態。</CardDescription>
              </div>
              <Button size="sm" onClick={() => setCreateTaskOpen(true)}>
                <Plus className="mr-1.5 h-4 w-4" />
                建立任務
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">目前尚無任務，點擊右上角「建立任務」開始。</p>
            ) : (
              tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  currentUserId={currentUserId}
                  onTransitioned={loadData}
                />
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* ── QA section ────────────────────────────────────────────────── */}
      {loadState === "loaded" && section === "qa" && (
        <Card className="border border-border/50">
          <CardHeader className="pb-3">
            <CardTitle>質檢</CardTitle>
            <CardDescription>等待 QA 審查或處於 QA 階段的任務。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {qaTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">目前沒有等待質檢的任務。</p>
            ) : (
              qaTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  currentUserId={currentUserId}
                  onTransitioned={loadData}
                />
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Acceptance section ────────────────────────────────────────── */}
      {loadState === "loaded" && section === "acceptance" && (
        <Card className="border border-border/50">
          <CardHeader className="pb-3">
            <CardTitle>驗收</CardTitle>
            <CardDescription>進行驗收中與已完成驗收的任務。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {acceptanceTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">目前沒有驗收中的任務。</p>
            ) : (
              acceptanceTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  currentUserId={currentUserId}
                  onTransitioned={loadData}
                />
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Issues section ────────────────────────────────────────────── */}
      {loadState === "loaded" && section === "issues" && (
        <Card className="border border-border/50">
          <CardHeader className="pb-3">
            <CardTitle>問題單</CardTitle>
            <CardDescription>跨任務檢視所有議題狀態與處理進度。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {issues.length === 0 ? (
              <p className="text-sm text-muted-foreground">目前沒有問題單。</p>
            ) : (
              issues.map((issue) => (
                <IssueRow
                  key={issue.id}
                  issue={issue}
                  onTransitioned={loadData}
                />
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Invoices section ──────────────────────────────────────────── */}
      {loadState === "loaded" && section === "invoices" && (
        <Card className="border border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>財務</CardTitle>
                <CardDescription>工作區帳務請款紀錄。</CardDescription>
              </div>
              <Button size="sm" disabled={creatingInvoice} onClick={handleCreateInvoice}>
                <Plus className="mr-1.5 h-4 w-4" />
                {creatingInvoice ? "建立中…" : "建立發票"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {actionError && (
              <p role="alert" className="text-sm text-destructive">{actionError}</p>
            )}
            {invoices.length === 0 ? (
              <p className="text-sm text-muted-foreground">目前尚無發票紀錄，點擊右上角「建立發票」開始。</p>
            ) : (
              <>
                <Separator />
                {invoices.map((invoice) => (
                  <InvoiceRow
                    key={invoice.id}
                    invoice={invoice}
                    onTransitioned={loadData}
                  />
                ))}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Create Task Dialog ─────────────────────────────────────────── */}
      <CreateTaskDialog
        open={createTaskOpen}
        workspaceId={workspaceId}
        onClose={() => setCreateTaskOpen(false)}
        onCreated={loadData}
      />
    </div>
  );
}
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/contracts/workspace-flow.contract.ts
````typescript
/**
 * @module workspace-flow/interfaces/contracts
 * @file workspace-flow.contract.ts
 * @description Module-local interface contracts for workspace-flow UI adapters.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Expand with view-model contracts as UI adapters are added
 */

import type { Task } from "../../application/dto/workflow.dto";
import type { Issue } from "../../application/dto/workflow.dto";
import type { Invoice } from "../../application/dto/workflow.dto";
import type { InvoiceItem } from "../../application/dto/workflow.dto";

// ── Summary read models (lean projections for UI) ─────────────────────────────

export interface TaskSummary {
  readonly id: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly status: Task["status"];
  readonly assigneeId?: string;
}

export interface IssueSummary {
  readonly id: string;
  readonly taskId: string;
  readonly title: string;
  readonly status: Issue["status"];
  readonly stage: Issue["stage"];
}

export interface InvoiceSummary {
  readonly id: string;
  readonly workspaceId: string;
  readonly status: Invoice["status"];
  readonly totalAmount: number;
}

export interface InvoiceItemSummary {
  readonly id: string;
  readonly invoiceId: string;
  readonly taskId: string;
  readonly amount: InvoiceItem["amount"];
}

// ── Projection helpers ────────────────────────────────────────────────────────

export function toTaskSummary(task: Task): TaskSummary {
  return {
    id: task.id,
    workspaceId: task.workspaceId,
    title: task.title,
    status: task.status,
    assigneeId: task.assigneeId,
  };
}

export function toIssueSummary(issue: Issue): IssueSummary {
  return {
    id: issue.id,
    taskId: issue.taskId,
    title: issue.title,
    status: issue.status,
    stage: issue.stage,
  };
}

export function toInvoiceSummary(invoice: Invoice): InvoiceSummary {
  return {
    id: invoice.id,
    workspaceId: invoice.workspaceId,
    status: invoice.status,
    totalAmount: invoice.totalAmount,
  };
}

export function toInvoiceItemSummary(item: InvoiceItem): InvoiceItemSummary {
  return {
    id: item.id,
    invoiceId: item.invoiceId,
    taskId: item.taskId,
    amount: item.amount,
  };
}
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/queries/workspace-flow.queries.ts
````typescript
/**
 * @module workspace-flow/interfaces/queries
 * @file workspace-flow.queries.ts
 * @description Server-side read queries for workspace-flow entities.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add pagination support and caching layer
 */

import type { Task } from "../../application/dto/workflow.dto";
import type { Issue } from "../../application/dto/workflow.dto";
import type { Invoice } from "../../application/dto/workflow.dto";
import type { InvoiceItem } from "../../application/dto/workflow.dto";
import { makeInvoiceRepo, makeIssueRepo, makeTaskRepo } from "../../api/factories";

/**
 * List all tasks for a workspace.
 *
 * @param workspaceId - The workspace to query
 */
export async function getWorkspaceFlowTasks(workspaceId: string): Promise<Task[]> {
  return makeTaskRepo().findByWorkspaceId(workspaceId);
}

/**
 * Get a single task by id.
 *
 * @param taskId - The task identifier
 */
export async function getWorkspaceFlowTask(taskId: string): Promise<Task | null> {
  return makeTaskRepo().findById(taskId);
}

/**
 * List all issues for a task.
 *
 * @param taskId - The task identifier
 */
export async function getWorkspaceFlowIssues(taskId: string): Promise<Issue[]> {
  return makeIssueRepo().findByTaskId(taskId);
}

/**
 * List all invoices for a workspace.
 *
 * @param workspaceId - The workspace to query
 */
export async function getWorkspaceFlowInvoices(workspaceId: string): Promise<Invoice[]> {
  return makeInvoiceRepo().findByWorkspaceId(workspaceId);
}

/**
 * Get items for an invoice.
 *
 * @param invoiceId - The invoice identifier
 */
export async function getWorkspaceFlowInvoiceItems(invoiceId: string): Promise<InvoiceItem[]> {
  return makeInvoiceRepo().listItems(invoiceId);
}
````

## File: modules/workspace/workspace.instructions.md
````markdown
---
description: 'Workspace bounded context rules: workspaceId anchor ownership, collaboration container scope, downstream dependency position, and subdomain routing.'
applyTo: 'modules/workspace/**/*.{ts,tsx,md}'
---

# Workspace Bounded Context (Local)

Use this file as execution guardrails for `modules/workspace/`.
For full reference, align with `.github/instructions/architecture-core.instructions.md`, `docs/contexts/workspace/README.md`, and `docs/bounded-contexts.md`.

## Core Rules

- `workspace` is **downstream** of `platform`; never import from platform internals — use `modules/platform/api` only.
- `workspace` is **upstream** of `notebooklm`; expose `workspaceId` scope and membership signals via `modules/workspace/api`.
- Cross-module consumers import from `modules/workspace/api` only.
- `workspaceId` is the canonical scope anchor for all downstream modules — always resolve workspace identity through this module.
- Use ubiquitous language: `Membership` not `User` (for workspace participant), `WorkspaceCapability` not `Feature`, `WorkspaceLifecycleState` not `Status`.

## Route to Subdomain When

| Concern | Subdomain |
|---|---|
| Workspace lifecycle (create, archive, restore) | `lifecycle` |
| Member roles, invitations, participant management | `membership` |
| Workspace activity feed and posts | `feed` |
| Audit trail and compliance log | `audit` |
| Task, issue, invoice workflow | `workspace-workflow` |
| Scheduling and work demand | `scheduling` |
| Real-time presence and activity | `presence` |
| Workspace sharing and access grants | `sharing` |

## Route Elsewhere When

- Identity, entitlements, organization, credentials → `platform`
- Knowledge pages, articles, databases, content publishing → `notion`
- Notebook, conversation, source, retrieval, synthesis → `notebooklm`

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
````

## File: modules/workspace/api/facade.ts
````typescript
/**
 * workspace api/facade.ts
 *
 * Canonical public behavior surface for the workspace bounded context.
 * Cross-module and app-layer consumers invoke commands and queries from here.
 *
 * Internal source: interfaces/api/facades/
 */

export {
  getWorkspacesForAccount,
  subscribeToWorkspacesForAccount,
  getWorkspaceById,
  getWorkspaceByIdForAccount,
  buildWikiContentTree,
  authorizeWorkspaceTeam,
  createWorkspace,
  createWorkspaceLocation,
  createWorkspaceWithCapabilities,
  deleteWorkspace,
  grantIndividualWorkspaceAccess,
  mountCapabilities,
  updateWorkspaceSettings,
} from "../interfaces/api/facades/workspace.facade";

export {
  getWorkspaceMembers,
} from "../interfaces/api/facades/workspace-member.facade";

export {
  getOrganizationAuditLogs,
  getWorkspaceAuditLogs,
} from "../subdomains/audit/api";

export {
  workspaceFeedFacade,
  WorkspaceFeedFacade,
  getAccountWorkspaceFeed,
  getWorkspaceFeed,
  getWorkspaceFeedPost,
  bookmarkWorkspaceFeedPost,
  createWorkspaceFeedPost,
  likeWorkspaceFeedPost,
  replyWorkspaceFeedPost,
  repostWorkspaceFeedPost,
  shareWorkspaceFeedPost,
  viewWorkspaceFeedPost,
} from "../subdomains/feed/api";

export type {
  CreateWorkspaceFeedPostParams,
  ReplyWorkspaceFeedPostParams,
  RepostWorkspaceFeedPostParams,
  WorkspaceFeedInteractionParams,
} from "../subdomains/feed/api";

export {
  assignWorkDemand,
  getAccountDemands,
  getWorkspaceDemands,
  submitWorkDemand,
} from "../subdomains/scheduling/api";

export type {
  AssignMemberInput,
  CreateDemandInput,
} from "../subdomains/scheduling/api";

export {
  WorkspaceFlowFacade,
  WorkspaceFlowTaskFacade,
  WorkspaceFlowIssueFacade,
  WorkspaceFlowInvoiceFacade,
  getWorkspaceFlowTasks,
  getWorkspaceFlowTask,
  getWorkspaceFlowIssues,
  getWorkspaceFlowInvoices,
  getWorkspaceFlowInvoiceItems,
  createKnowledgeToWorkflowListener,
} from "../subdomains/workspace-workflow/api";

export type {
  KnowledgePageApprovedHandler,
} from "../subdomains/workspace-workflow/api";

// ── Orchestrated notion commands (workspace as composition owner) ─────────────

export { createKnowledgePage } from "@/modules/notion/api";
````

## File: modules/workspace/application/queries/wiki-content-tree.queries.ts
````typescript
/**
 * Module: workspace
 * Layer: application/queries
 * Purpose: Build the workspace content-tree from account/workspace seeds.
 *          This is a query projection, not a use case — it aggregates
 *          workspace-scoped content nodes for read-only display.
 *
 * DDD Rule 5:  Pure reads → Query, not Use Case.
 * DDD Rule 13: Read → queries/
 */

import type {
  WikiAccountContentNode,
  WikiAccountSeed,
  WikiContentItemNode,
  WikiWorkspaceContentNode,
} from "../../domain/entities/WikiContentTree";
import type { WikiWorkspaceRepository } from "../../domain/ports/output/WikiWorkspaceRepository";

function buildContentBaseItems(workspaceId: string): WikiContentItemNode[] {
  return [
    { key: "spaces", label: "Workspace", href: `/workspace/${workspaceId}`, enabled: true },
    {
      key: "pages",
      label: "Knowledge Pages",
      href: `/workspace/${workspaceId}?tab=Overview&panel=knowledge-pages`,
      enabled: true,
    },
    {
      key: "libraries",
      label: "Libraries",
      href: `/workspace/${workspaceId}?tab=Overview&panel=source-libraries`,
      enabled: true,
    },
    { key: "documents", label: "Documents", href: `/workspace/${workspaceId}?tab=Files`, enabled: true },
    {
      key: "vector-index",
      label: "Vector Index",
      href: `/workspace/${workspaceId}?tab=Overview&panel=knowledge-databases`,
      enabled: false,
    },
    { key: "rag", label: "RAG", href: `/notebook/rag-query?workspaceId=${workspaceId}`, enabled: true },
    { key: "ai-tools", label: "AI Tools", href: `/ai-chat?workspaceId=${workspaceId}`, enabled: true },
  ];
}

function buildWorkspaceNode(workspaceId: string, workspaceName: string): WikiWorkspaceContentNode {
  return {
    workspaceId,
    workspaceName,
    href: `/workspace/${workspaceId}`,
    contentBaseItems: buildContentBaseItems(workspaceId),
  };
}

export async function buildWikiContentTree(
  seeds: WikiAccountSeed[],
  workspaceRepository: WikiWorkspaceRepository,
): Promise<WikiAccountContentNode[]> {
  const accountNodes = await Promise.all(
    seeds.map(async (seed) => {
      const workspaces = await workspaceRepository.listByAccountId(seed.accountId);
      return {
        accountId: seed.accountId,
        accountName: seed.accountName,
        accountType: seed.accountType,
        isActive: seed.isActive,
        membersHref: seed.accountType === "organization" ? "/organization/members" : undefined,
        teamsHref: seed.accountType === "organization" ? "/organization/teams" : undefined,
        workspaces: workspaces.map((workspace) => buildWorkspaceNode(workspace.id, workspace.name)),
      } satisfies WikiAccountContentNode;
    }),
  );

  return accountNodes.sort((a, b) => {
    if (a.accountType !== b.accountType) {
      return a.accountType === "personal" ? -1 : 1;
    }
    return a.accountName.localeCompare(b.accountName, "zh-Hant");
  });
}
````

## File: modules/workspace/domain/aggregates/Workspace.ts
````typescript
/**
 * Workspace Domain Entities — pure TypeScript, zero framework dependencies.
 */

import type { Timestamp } from "@shared-types";
import type { WorkspaceAccessPolicy, WorkspaceGrant } from "../entities/WorkspaceAccess";
import type {
  Capability,
  WorkspaceCapabilityAssignments,
} from "../entities/WorkspaceCapability";
import type { WorkspaceLocation } from "../entities/WorkspaceLocation";
import type {
  Address,
  WorkspaceOperationalProfile,
  WorkspacePersonnel,
} from "../entities/WorkspaceProfile";
import { createAddress, type AddressInput } from "../value-objects/Address";
import type {
  WorkspaceLifecycleState,
  WorkspaceLifecycleStateInput,
} from "../value-objects/WorkspaceLifecycleState";
import {
  canTransitionWorkspaceLifecycleState,
  createWorkspaceLifecycleState,
} from "../value-objects/WorkspaceLifecycleState";
import type {
  WorkspaceName,
  WorkspaceNameInput,
} from "../value-objects/WorkspaceName";
import { createWorkspaceName } from "../value-objects/WorkspaceName";
import type {
  WorkspaceVisibility,
  WorkspaceVisibilityInput,
} from "../value-objects/WorkspaceVisibility";
import { createWorkspaceVisibility } from "../value-objects/WorkspaceVisibility";

export interface WorkspaceEntity {
  id: string;
  name: WorkspaceName;
  photoURL?: string;
  lifecycleState: WorkspaceLifecycleState;
  visibility: WorkspaceVisibility;
  accountId: string;
  accountType: "user" | "organization";
  createdAt: Timestamp;
}

export interface WorkspaceEntity
  extends WorkspaceCapabilityAssignments,
    WorkspaceAccessPolicy,
    WorkspaceOperationalProfile {}

// ─── Commands ─────────────────────────────────────────────────────────────────

export interface CreateWorkspaceCommand {
  readonly name: WorkspaceNameInput;
  readonly accountId: string;
  readonly accountType: "user" | "organization";
  readonly creatorUserId?: string;
}

export interface UpdateWorkspaceSettingsCommand {
  readonly workspaceId: string;
  readonly accountId: string;
  readonly name?: WorkspaceNameInput;
  readonly visibility?: WorkspaceVisibilityInput;
  readonly lifecycleState?: WorkspaceLifecycleStateInput;
  readonly address?: AddressInput;
  readonly personnel?: WorkspacePersonnel;
}

type WorkspaceSettingsPatch = Omit<
  UpdateWorkspaceSettingsCommand,
  "workspaceId" | "accountId"
>;

function createWorkspaceTimestamp(date = new Date()): Timestamp {
  const milliseconds = date.getTime();
  const seconds = Math.floor(milliseconds / 1000);
  const nanoseconds = (milliseconds % 1000) * 1_000_000;

  return {
    seconds,
    nanoseconds,
    toDate: () => new Date(milliseconds),
  };
}

function cloneCapabilities(capabilities: Capability[] = []): Capability[] {
  return capabilities.map((capability) => ({
    ...capability,
    config:
      capability.config !== undefined && capability.config !== null
        ? { ...capability.config }
        : capability.config,
  }));
}

function cloneGrants(grants: WorkspaceGrant[] = []): WorkspaceGrant[] {
  return grants.map((grant) => ({ ...grant }));
}

function cloneLocations(locations?: WorkspaceLocation[]): WorkspaceLocation[] | undefined {
  return locations?.map((location) => ({ ...location }));
}

function clonePersonnel(
  personnel?: WorkspacePersonnel,
): WorkspacePersonnel | undefined {
  if (!personnel) {
    return undefined;
  }

  return {
    ...personnel,
    customRoles: personnel.customRoles?.map((role) => ({ ...role })),
  };
}

function normalizeAccountId(accountId: string): string {
  const normalizedAccountId = accountId.trim();
  if (!normalizedAccountId) {
    throw new Error("Workspace accountId is required");
  }

  return normalizedAccountId;
}

export class Workspace implements WorkspaceEntity {
  readonly id: string;

  name: WorkspaceName;

  photoURL?: string;

  lifecycleState: WorkspaceLifecycleState;

  visibility: WorkspaceVisibility;

  readonly accountId: string;

  readonly accountType: "user" | "organization";

  readonly createdAt: Timestamp;

  capabilities: Capability[];

  grants: WorkspaceGrant[];

  teamIds: string[];

  address?: Address;

  locations?: WorkspaceLocation[];

  personnel?: WorkspacePersonnel;

  private constructor(snapshot: WorkspaceEntity) {
    this.id = snapshot.id;
    this.name = snapshot.name;
    this.photoURL = snapshot.photoURL?.trim() || undefined;
    this.lifecycleState = snapshot.lifecycleState;
    this.visibility = snapshot.visibility;
    this.accountId = normalizeAccountId(snapshot.accountId);
    this.accountType = snapshot.accountType;
    this.createdAt = snapshot.createdAt;
    this.capabilities = cloneCapabilities(snapshot.capabilities);
    this.grants = cloneGrants(snapshot.grants);
    this.teamIds = [...snapshot.teamIds];
    this.address = snapshot.address;
    this.locations = cloneLocations(snapshot.locations);
    this.personnel = clonePersonnel(snapshot.personnel);
  }

  static create(command: CreateWorkspaceCommand): Workspace {
    const initialGrants: WorkspaceGrant[] =
      command.creatorUserId?.trim()
        ? [{ userId: command.creatorUserId.trim(), role: "owner" }]
        : [];

    return new Workspace({
      id: crypto.randomUUID(),
      name: createWorkspaceName(command.name),
      accountId: normalizeAccountId(command.accountId),
      accountType: command.accountType,
      lifecycleState: createWorkspaceLifecycleState("preparatory"),
      visibility: createWorkspaceVisibility("visible"),
      capabilities: [],
      grants: initialGrants,
      teamIds: [],
      createdAt: createWorkspaceTimestamp(),
    });
  }

  static reconstitute(snapshot: WorkspaceEntity): Workspace {
    return new Workspace(snapshot);
  }

  rename(nextName: WorkspaceNameInput): void {
    this.name = createWorkspaceName(nextName);
  }

  changeVisibility(nextVisibility: WorkspaceVisibilityInput): void {
    this.visibility = createWorkspaceVisibility(nextVisibility);
  }

  activate(): void {
    this.transitionLifecycle("active");
  }

  stop(): void {
    this.transitionLifecycle("stopped");
  }

  transitionLifecycle(nextState: WorkspaceLifecycleStateInput): void {
    const normalizedNextState = createWorkspaceLifecycleState(nextState);
    if (normalizedNextState === this.lifecycleState) {
      return;
    }

    if (
      !canTransitionWorkspaceLifecycleState(
        this.lifecycleState,
        normalizedNextState,
      )
    ) {
      throw new Error(
        `Invalid workspace lifecycle transition: ${this.lifecycleState} -> ${normalizedNextState}`,
      );
    }

    this.lifecycleState = normalizedNextState;
  }

  updateAddress(nextAddress: AddressInput): void {
    this.address = createAddress(nextAddress);
  }

  updatePersonnel(nextPersonnel: WorkspacePersonnel): void {
    this.personnel = clonePersonnel(nextPersonnel);
  }

  applySettings(patch: WorkspaceSettingsPatch): void {
    if (patch.name !== undefined) {
      this.rename(patch.name);
    }

    if (patch.visibility !== undefined) {
      this.changeVisibility(patch.visibility);
    }

    if (patch.lifecycleState !== undefined) {
      this.transitionLifecycle(patch.lifecycleState);
    }

    if (patch.address !== undefined) {
      this.updateAddress(patch.address);
    }

    if (patch.personnel !== undefined) {
      this.updatePersonnel(patch.personnel);
    }
  }

  toSnapshot(): WorkspaceEntity {
    return {
      id: this.id,
      name: this.name,
      photoURL: this.photoURL,
      lifecycleState: this.lifecycleState,
      visibility: this.visibility,
      accountId: this.accountId,
      accountType: this.accountType,
      createdAt: this.createdAt,
      capabilities: cloneCapabilities(this.capabilities),
      grants: cloneGrants(this.grants),
      teamIds: [...this.teamIds],
      address: this.address,
      locations: cloneLocations(this.locations),
      personnel: clonePersonnel(this.personnel),
    };
  }
}

export type { WorkspaceGrant } from "../entities/WorkspaceAccess";
export type { Capability, CapabilitySpec } from "../entities/WorkspaceCapability";
export type { WorkspaceLocation } from "../entities/WorkspaceLocation";
export type {
  Address,
  AddressInput,
  WorkspacePersonnel,
  WorkspacePersonnelCustomRole,
} from "../entities/WorkspaceProfile";
export type {
  WorkspaceLifecycleState,
  WorkspaceLifecycleStateInput,
} from "../value-objects/WorkspaceLifecycleState";
export type {
  WorkspaceName,
  WorkspaceNameInput,
} from "../value-objects/WorkspaceName";
export type {
  WorkspaceVisibility,
  WorkspaceVisibilityInput,
} from "../value-objects/WorkspaceVisibility";
````

## File: modules/workspace/infrastructure/firebase/FirebaseWorkspaceQueryRepository.ts
````typescript
import type {
  WorkspaceMemberAccessChannel,
  WorkspaceMemberPresence,
  WorkspaceMemberView,
} from "../../domain/entities/WorkspaceMemberView";
import type { WorkspaceQueryRepository } from "../../domain/ports/output/WorkspaceQueryRepository";
import type { WorkspaceEntity } from "../../domain/aggregates/Workspace";
import { firestoreInfrastructureApi } from "@/modules/platform/api";
import { FirebaseWorkspaceRepository, toWorkspaceEntity } from "./FirebaseWorkspaceRepository";

const personnelLabels = {
  managerId: "Manager",
  supervisorId: "Supervisor",
  safetyOfficerId: "Safety officer",
} as const;

const personnelLabelEntries = Object.entries(personnelLabels) as Array<
  [keyof typeof personnelLabels, string]
>;

interface OrganizationMemberReference {
  id: string;
  name: string;
  email?: string;
  role?: string;
  presence?: string;
  isExternal?: boolean;
}

interface OrganizationTeam {
  id: string;
  name: string;
  memberIds: string[];
}

interface OrganizationDirectoryGateway {
  getOrganizationMembers(organizationId: string): Promise<OrganizationMemberReference[]>;
  getOrganizationTeams(organizationId: string): Promise<OrganizationTeam[]>;
}

const defaultOrganizationDirectoryGateway: OrganizationDirectoryGateway = {
  async getOrganizationMembers() {
    return [];
  },
  async getOrganizationTeams() {
    return [];
  },
};

function toPresence(value: OrganizationMemberReference["presence"] | undefined): WorkspaceMemberPresence {
  if (value === "active" || value === "away" || value === "offline") {
    return value;
  }

  return "unknown";
}

function createFallbackMember(id: string): WorkspaceMemberView {
  return {
    id,
    displayName: id,
    presence: "unknown",
    isExternal: false,
    accessChannels: [],
  };
}

export class FirebaseWorkspaceQueryRepository implements WorkspaceQueryRepository {
  constructor(
    private readonly organizationDirectoryGateway: OrganizationDirectoryGateway = defaultOrganizationDirectoryGateway,
  ) {}

  private readonly workspaceRepo = new FirebaseWorkspaceRepository();

  subscribeToWorkspacesForAccount(
    accountId: string,
    onUpdate: (workspaces: WorkspaceEntity[]) => void,
  ) {
    const normalizedAccountId = accountId.trim();
    if (!normalizedAccountId) {
      onUpdate([]);
      return () => {};
    }

    return firestoreInfrastructureApi.watchCollection<Record<string, unknown>>(
      "workspaces",
      {
        onNext: (documents) => {
          const workspaces = documents.map((document) => toWorkspaceEntity(document.id, document.data));
          onUpdate(workspaces);
        },
      },
      [{ field: "accountId", op: "==", value: normalizedAccountId }],
    );
  }

  async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMemberView[]> {
    const workspace = await this.workspaceRepo.findById(workspaceId);
    if (!workspace) {
      return [];
    }

    const members = new Map<string, WorkspaceMemberView>();
    const memberChannelKeys = new Map<string, Set<string>>();

    const mergeMember = (
      memberId: string,
      channel: WorkspaceMemberAccessChannel,
      orgMember?: OrganizationMemberReference,
    ) => {
      const current = members.get(memberId) ?? createFallbackMember(memberId);
      const channelKey = [
        channel.source,
        channel.label,
        channel.role ?? "",
        channel.protocol ?? "",
        channel.teamId ?? "",
      ].join("::");
      const knownChannelKeys = memberChannelKeys.get(memberId) ?? new Set<string>();
      memberChannelKeys.set(memberId, knownChannelKeys);
      const hasSameChannel = knownChannelKeys.has(channelKey);
      if (!hasSameChannel) {
        knownChannelKeys.add(channelKey);
      }

      members.set(memberId, {
        id: memberId,
        displayName: orgMember?.name || current.displayName,
        email: orgMember?.email ?? current.email,
        organizationRole: orgMember?.role ?? current.organizationRole,
        presence: orgMember ? toPresence(orgMember.presence) : current.presence,
        isExternal: orgMember?.isExternal ?? current.isExternal,
        accessChannels: hasSameChannel ? current.accessChannels : [...current.accessChannels, channel],
      });
    };

    if (workspace.accountType === "organization") {
      const [organizationMembers, teams] = await Promise.all([
        this.organizationDirectoryGateway.getOrganizationMembers(workspace.accountId),
        this.organizationDirectoryGateway.getOrganizationTeams(workspace.accountId),
      ]);

      const organizationMemberMap = new Map(organizationMembers.map((member) => [member.id, member]));
      const teamMap = new Map(teams.map((team) => [team.id, team]));

      const mergeTeam = (team: OrganizationTeam, role?: string, protocol?: string) => {
        const label = team.name || team.id;
        team.memberIds.forEach((memberId: string) => {
          mergeMember(
            memberId,
            {
              source: "team",
              label,
              role,
              protocol,
              teamId: team.id,
            },
            organizationMemberMap.get(memberId),
          );
        });
      };

      workspace.teamIds.forEach((teamId) => {
        const team = teamMap.get(teamId);
        if (team) {
          mergeTeam(team);
        }
      });

      workspace.grants.forEach((grant) => {
        if (grant.userId) {
          mergeMember(
            grant.userId,
            {
              source: "direct",
              label: "Direct access",
              role: grant.role,
              protocol: grant.protocol,
            },
            organizationMemberMap.get(grant.userId),
          );
        }

        if (grant.teamId) {
          const team = teamMap.get(grant.teamId);
          if (team) {
            mergeTeam(team, grant.role, grant.protocol);
          }
        }
      });

      personnelLabelEntries.forEach(([field, label]) => {
        const memberId = workspace.personnel?.[field];
        if (memberId) {
          mergeMember(
            memberId,
            {
              source: "personnel",
              label,
            },
            organizationMemberMap.get(memberId),
          );
        }
      });
    } else {
      mergeMember(workspace.accountId, {
        source: "owner",
        label: "Workspace owner",
      });

      workspace.grants.forEach((grant) => {
        if (grant.userId) {
          mergeMember(grant.userId, {
            source: "direct",
            label: "Direct access",
            role: grant.role,
            protocol: grant.protocol,
          });
        }
      });

      personnelLabelEntries.forEach(([field, label]) => {
        const memberId = workspace.personnel?.[field];
        if (memberId) {
          mergeMember(memberId, {
            source: "personnel",
            label,
          });
        }
      });
    }

    return Array.from(members.values()).sort((left, right) =>
      left.displayName.localeCompare(right.displayName),
    );
  }
}
````

## File: modules/workspace/infrastructure/firebase/FirebaseWorkspaceRepository.ts
````typescript
/**
 * FirebaseWorkspaceRepository — Infrastructure adapter for workspace persistence.
 * Translates Firestore documents ↔ Domain WorkspaceEntity.
 * Firebase SDK only exists in this file.
 */

import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api";
import type { WorkspaceRepository } from "../../domain/ports/output/WorkspaceRepository";
import type { WorkspaceCapabilityRepository } from "../../domain/ports/output/WorkspaceCapabilityRepository";
import type { WorkspaceAccessRepository } from "../../domain/ports/output/WorkspaceAccessRepository";
import type { WorkspaceLocationRepository } from "../../domain/ports/output/WorkspaceLocationRepository";
import type {
  WorkspaceEntity,
  Capability,
  WorkspaceGrant,
  UpdateWorkspaceSettingsCommand,
  WorkspaceLocation,
} from "../../domain/aggregates/Workspace";
import { createAddress } from "../../domain/value-objects/Address";
import { createWorkspaceLifecycleState } from "../../domain/value-objects/WorkspaceLifecycleState";
import { createWorkspaceName } from "../../domain/value-objects/WorkspaceName";
import { createWorkspaceVisibility } from "../../domain/value-objects/WorkspaceVisibility";

// ─── Mapper ───────────────────────────────────────────────────────────────────

const VALID_ACCOUNT_TYPES = new Set<WorkspaceEntity["accountType"]>(["user", "organization"]);

export function toWorkspaceEntity(id: string, data: Record<string, unknown>): WorkspaceEntity {
  const accountType = VALID_ACCOUNT_TYPES.has(data.accountType as WorkspaceEntity["accountType"])
    ? (data.accountType as WorkspaceEntity["accountType"])
    : "user";

  return {
    id,
    name: createWorkspaceName(typeof data.name === "string" ? data.name : "Untitled workspace"),
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    accountType,
    lifecycleState: createWorkspaceLifecycleState(
      data.lifecycleState === "active" ||
        data.lifecycleState === "stopped" ||
        data.lifecycleState === "preparatory"
        ? data.lifecycleState
        : "preparatory",
    ),
    visibility: createWorkspaceVisibility(
      data.visibility === "hidden" || data.visibility === "visible"
        ? data.visibility
        : "visible",
    ),
    capabilities: Array.isArray(data.capabilities) ? (data.capabilities as Capability[]) : [],
    grants: Array.isArray(data.grants) ? (data.grants as WorkspaceGrant[]) : [],
    teamIds: Array.isArray(data.teamIds) ? (data.teamIds as string[]) : [],
    photoURL: typeof data.photoURL === "string" ? data.photoURL : undefined,
    address: data.address != null ? createAddress(data.address as NonNullable<UpdateWorkspaceSettingsCommand["address"]>) : undefined,
    locations: Array.isArray(data.locations) ? (data.locations as WorkspaceLocation[]) : undefined,
    personnel: data.personnel != null ? (data.personnel as WorkspaceEntity["personnel"]) : undefined,
    createdAt: data.createdAt as WorkspaceEntity["createdAt"],
  };
}

// ─── Repository ───────────────────────────────────────────────────────────────

export class FirebaseWorkspaceRepository
  implements
    WorkspaceRepository,
    WorkspaceCapabilityRepository,
    WorkspaceAccessRepository,
    WorkspaceLocationRepository {
  private workspacePath(workspaceId: string): string {
    return `workspaces/${workspaceId}`;
  }

  async findById(id: string): Promise<WorkspaceEntity | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(this.workspacePath(id));
    if (!data) return null;
    return toWorkspaceEntity(id, data);
  }

  async findByIdForAccount(accountId: string, workspaceId: string): Promise<WorkspaceEntity | null> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      "workspaces",
      [{ field: "accountId", op: "==", value: accountId }],
    );
    const target = docs.find((doc) => doc.id === workspaceId);
    if (!target) return null;
    return toWorkspaceEntity(target.id, target.data);
  }

  async findAllByAccountId(accountId: string): Promise<WorkspaceEntity[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      "workspaces",
      [{ field: "accountId", op: "==", value: accountId }],
    );
    return docs.map((doc) => toWorkspaceEntity(doc.id, doc.data));
  }

  async save(workspace: WorkspaceEntity): Promise<string> {
    const payload: Record<string, unknown> = {
      name: workspace.name,
      accountId: workspace.accountId,
      accountType: workspace.accountType,
      lifecycleState: workspace.lifecycleState,
      visibility: workspace.visibility,
      capabilities: workspace.capabilities,
      grants: workspace.grants,
      teamIds: workspace.teamIds,
      createdAtISO: new Date().toISOString(),
    };

    if (workspace.photoURL !== undefined) payload.photoURL = workspace.photoURL;
    if (workspace.address !== undefined) payload.address = workspace.address;
    if (workspace.locations !== undefined) payload.locations = workspace.locations;
    if (workspace.personnel !== undefined) payload.personnel = workspace.personnel;

    await firestoreInfrastructureApi.set(this.workspacePath(workspace.id), payload);
    return workspace.id;
  }

  async updateSettings(command: UpdateWorkspaceSettingsCommand): Promise<void> {
    const updates: Record<string, unknown> = { updatedAtISO: new Date().toISOString() };
    if (command.name !== undefined) updates.name = command.name;
    if (command.visibility !== undefined) updates.visibility = command.visibility;
    if (command.lifecycleState !== undefined) updates.lifecycleState = command.lifecycleState;
    if (command.address !== undefined) updates.address = command.address;
    if (command.personnel !== undefined) updates.personnel = command.personnel;
    await firestoreInfrastructureApi.update(this.workspacePath(command.workspaceId), updates);
  }

  async delete(id: string): Promise<void> {
    await firestoreInfrastructureApi.delete(this.workspacePath(id));
  }

  async mountCapabilities(workspaceId: string, capabilities: Capability[]): Promise<void> {
    const path = this.workspacePath(workspaceId);
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!data) return;
    const existing = Array.isArray(data.capabilities) ? (data.capabilities as Capability[]) : [];
    const merged = [...existing];
    capabilities.forEach((capability) => {
      if (!merged.some((item) => item.id === capability.id)) {
        merged.push(capability);
      }
    });

    await firestoreInfrastructureApi.update(path, {
      capabilities: merged,
      updatedAtISO: new Date().toISOString(),
    });
  }

  async unmountCapability(workspaceId: string, capabilityId: string): Promise<void> {
    const path = this.workspacePath(workspaceId);
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!data) return;
    const caps = ((data.capabilities as Capability[]) ?? []).filter((c) => c.id !== capabilityId);
    await firestoreInfrastructureApi.update(path, {
      capabilities: caps,
      updatedAtISO: new Date().toISOString(),
    });
  }

  async grantTeamAccess(workspaceId: string, teamId: string): Promise<void> {
    const path = this.workspacePath(workspaceId);
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!data) return;
    const teamIds = Array.isArray(data.teamIds) ? [...(data.teamIds as string[])] : [];
    if (!teamIds.includes(teamId)) {
      teamIds.push(teamId);
    }
    await firestoreInfrastructureApi.update(path, {
      teamIds,
      updatedAtISO: new Date().toISOString(),
    });
  }

  async revokeTeamAccess(workspaceId: string, teamId: string): Promise<void> {
    const path = this.workspacePath(workspaceId);
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!data) return;
    const teamIds = (Array.isArray(data.teamIds) ? (data.teamIds as string[]) : []).filter((item) => item !== teamId);
    await firestoreInfrastructureApi.update(path, {
      teamIds,
      updatedAtISO: new Date().toISOString(),
    });
  }

  async grantIndividualAccess(workspaceId: string, grant: WorkspaceGrant): Promise<void> {
    const path = this.workspacePath(workspaceId);
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!data) return;
    const grants = Array.isArray(data.grants) ? [...(data.grants as WorkspaceGrant[])] : [];
    const exists = grants.some((item) => item.userId === grant.userId && item.teamId === grant.teamId);
    if (!exists) {
      grants.push(grant);
    }
    await firestoreInfrastructureApi.update(path, {
      grants,
      updatedAtISO: new Date().toISOString(),
    });
  }

  async revokeIndividualAccess(workspaceId: string, userId: string): Promise<void> {
    const path = this.workspacePath(workspaceId);
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!data) return;
    const grants = ((data.grants as WorkspaceGrant[]) ?? []).filter((g) => g.userId !== userId);
    await firestoreInfrastructureApi.update(path, {
      grants,
      updatedAtISO: new Date().toISOString(),
    });
  }

  async createLocation(
    workspaceId: string,
    location: Omit<WorkspaceLocation, "locationId">,
  ): Promise<string> {
    const locationId = crypto.randomUUID();
    const path = this.workspacePath(workspaceId);
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!data) return locationId;
    const locations = Array.isArray(data.locations) ? [...(data.locations as WorkspaceLocation[])] : [];
    locations.push({ ...location, locationId });
    await firestoreInfrastructureApi.update(path, {
      locations,
      updatedAtISO: new Date().toISOString(),
    });
    return locationId;
  }

  async updateLocation(workspaceId: string, location: WorkspaceLocation): Promise<void> {
    const path = this.workspacePath(workspaceId);
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!data) return;
    const locations = ((data.locations as WorkspaceLocation[]) ?? []).map((l) =>
      l.locationId === location.locationId ? location : l,
    );
    await firestoreInfrastructureApi.update(path, {
      locations,
      updatedAtISO: new Date().toISOString(),
    });
  }

  async deleteLocation(workspaceId: string, locationId: string): Promise<void> {
    const path = this.workspacePath(workspaceId);
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!data) return;
    const locations = ((data.locations as WorkspaceLocation[]) ?? []).filter(
      (l) => l.locationId !== locationId,
    );
    await firestoreInfrastructureApi.update(path, {
      locations,
      updatedAtISO: new Date().toISOString(),
    });
  }
}
````

## File: modules/workspace/infrastructure/infrastructure.instructions.md
````markdown
---
description: 'Workspace infrastructure layer rules: Firebase adapters, event publisher, repository implementations, and Firestore collection ownership.'
applyTo: 'modules/workspace/infrastructure/**/*.{ts,tsx}'
---

# Workspace Infrastructure Layer (Local)

Use this file as execution guardrails for `modules/workspace/infrastructure/*`.
For full reference, align with `.github/instructions/firestore-schema.instructions.md` and `docs/contexts/workspace/*`.

## Core Rules

- Implement only **port interfaces** declared in `domain/ports/output/` — never invent new contracts here.
- `SharedWorkspaceDomainEventPublisher` is the canonical event publisher; do not create alternative publish paths.
- Each Firebase repository (`FirebaseWorkspaceRepository`, `FirebaseWorkspaceQueryRepository`, `FirebaseWikiWorkspaceRepository`) owns its Firestore collection(s) — do not cross-read between them without an explicit port.
- `FirebaseWorkspaceQueryRepository` serves read-model queries; `FirebaseWorkspaceRepository` serves aggregate persistence — keep their responsibilities separate.
- Version breaking schema transitions with migration steps; update `firestore.indexes.json` with query-shape changes.
- Subdomain-specific adapters belong in the bounded-context root `infrastructure/<subdomain>/` grouping by default; only place adapters inside `subdomains/<name>/infrastructure/` when the mini-module gate is explicitly justified.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
#use skill xuanwu-development-contracts
````

## File: modules/workspace/interfaces/api/actions/workspace.command.ts
````typescript
"use server";

/**
 * Workspace Server Actions — thin adapter: Next.js Server Actions → Input Port.
 *
 * After each successful command, records an audit entry via the audit subdomain.
 */

import type { CommandResult } from "@shared-types";
import type {
  CreateWorkspaceCommand,
  UpdateWorkspaceSettingsCommand,
  Capability,
  WorkspaceGrant,
  WorkspaceLocation,
} from "../contracts";
import { workspaceCommandPort } from "../runtime";
import { RecordAuditEntryUseCase } from "../../../subdomains/audit/application/use-cases/record-audit-entry.use-case";
import { makeAuditRepo } from "../../../subdomains/audit/api/factories";
import type { RecordAuditEntryInput } from "../../../subdomains/audit/domain/aggregates/AuditEntry";

const auditUseCase = new RecordAuditEntryUseCase(makeAuditRepo());

async function recordAudit(input: RecordAuditEntryInput): Promise<void> {
  try {
    await auditUseCase.execute(input);
  } catch {
    // Audit recording is best-effort — do not fail the primary command.
    if (process.env.NODE_ENV !== "production") {
      console.warn("[workspace.command] Audit recording failed for", input.action);
    }
  }
}

export async function createWorkspace(command: CreateWorkspaceCommand): Promise<CommandResult> {
  const result = await workspaceCommandPort.createWorkspace(command);
  if (result.success) {
    await recordAudit({
      workspaceId: result.aggregateId,
      actorId: command.creatorUserId ?? command.accountId,
      action: "create",
      resourceType: "workspace",
      resourceId: result.aggregateId,
      severity: "medium",
      detail: `Workspace "${command.name}" created`,
      source: "workspace",
    });
  }
  return result;
}

export async function createWorkspaceWithCapabilities(
  command: CreateWorkspaceCommand,
  capabilities: Capability[],
): Promise<CommandResult> {
  const result = await workspaceCommandPort.createWorkspaceWithCapabilities(command, capabilities);
  if (result.success) {
    await recordAudit({
      workspaceId: result.aggregateId,
      actorId: command.creatorUserId ?? command.accountId,
      action: "create",
      resourceType: "workspace",
      resourceId: result.aggregateId,
      severity: "medium",
      detail: `Workspace "${command.name}" created with ${capabilities.length} capabilities`,
      source: "workspace",
    });
  }
  return result;
}

export async function updateWorkspaceSettings(
  command: UpdateWorkspaceSettingsCommand,
): Promise<CommandResult> {
  const result = await workspaceCommandPort.updateWorkspaceSettings(command);
  if (result.success) {
    await recordAudit({
      workspaceId: command.workspaceId,
      actorId: command.accountId,
      action: "update",
      resourceType: "workspace",
      resourceId: command.workspaceId,
      severity: "low",
      detail: "Workspace settings updated",
      source: "workspace",
    });
  }
  return result;
}

export async function deleteWorkspace(workspaceId: string): Promise<CommandResult> {
  const result = await workspaceCommandPort.deleteWorkspace(workspaceId);
  if (result.success) {
    await recordAudit({
      workspaceId,
      actorId: "system",
      action: "delete",
      resourceType: "workspace",
      resourceId: workspaceId,
      severity: "high",
      detail: `Workspace ${workspaceId} deleted`,
      source: "workspace",
    });
  }
  return result;
}

export async function mountCapabilities(
  workspaceId: string,
  capabilities: Capability[],
): Promise<CommandResult> {
  const result = await workspaceCommandPort.mountCapabilities(workspaceId, capabilities);
  if (result.success) {
    await recordAudit({
      workspaceId,
      actorId: "system",
      action: "update",
      resourceType: "workspace",
      resourceId: workspaceId,
      severity: "low",
      detail: `${capabilities.length} capabilities mounted`,
      source: "workspace",
    });
  }
  return result;
}

export async function authorizeWorkspaceTeam(
  workspaceId: string,
  teamId: string,
): Promise<CommandResult> {
  const result = await workspaceCommandPort.authorizeWorkspaceTeam(workspaceId, teamId);
  if (result.success) {
    await recordAudit({
      workspaceId,
      actorId: "system",
      action: "update",
      resourceType: "workspace",
      resourceId: workspaceId,
      severity: "medium",
      detail: `Team ${teamId} authorized`,
      source: "workspace",
    });
  }
  return result;
}

export async function grantIndividualWorkspaceAccess(
  workspaceId: string,
  grant: WorkspaceGrant,
): Promise<CommandResult> {
  const result = await workspaceCommandPort.grantIndividualWorkspaceAccess(workspaceId, grant);
  if (result.success) {
    await recordAudit({
      workspaceId,
      actorId: grant.userId ?? "system",
      action: "update",
      resourceType: "workspace",
      resourceId: workspaceId,
      severity: "medium",
      detail: `Individual access granted: role=${grant.role ?? "member"}`,
      source: "workspace",
    });
  }
  return result;
}

export async function createWorkspaceLocation(
  workspaceId: string,
  location: Omit<WorkspaceLocation, "locationId">,
): Promise<CommandResult> {
  const result = await workspaceCommandPort.createWorkspaceLocation(workspaceId, location);
  if (result.success) {
    await recordAudit({
      workspaceId,
      actorId: "system",
      action: "create",
      resourceType: "workspace-location",
      resourceId: result.aggregateId,
      severity: "low",
      detail: `Location "${location.label}" created`,
      source: "workspace",
    });
  }
  return result;
}
````

## File: modules/workspace/interfaces/web/components/rails/CreateWorkspaceDialogRail.tsx
````typescript
"use client";

import { type FormEvent, useState } from "react";

import { createWorkspace } from "../../../api/facades";
import { Button } from "@ui-shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";

interface CreateWorkspaceDialogRailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId: string | null;
  accountType: "user" | "organization" | null;
  creatorUserId?: string | null;
  onNavigate: (href: string) => void;
}

export function CreateWorkspaceDialogRail({
  open,
  onOpenChange,
  accountId,
  accountType,
  creatorUserId,
  onNavigate,
}: CreateWorkspaceDialogRailProps) {
  const [workspaceName, setWorkspaceName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  function reset() {
    setWorkspaceName("");
    setError(null);
    setIsCreating(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = workspaceName.trim();
    if (!name) {
      setError("請輸入工作區名稱。");
      return;
    }
    if (!accountId || !accountType) {
      setError("帳號資訊已失效，請重新登入後再建立工作區。");
      return;
    }

    setIsCreating(true);
    setError(null);
    const result = await createWorkspace({
      name,
      accountId,
      accountType,
      creatorUserId: creatorUserId ?? undefined,
    });

    if (!result.success) {
      setError(result.error.message);
      setIsCreating(false);
      return;
    }

    reset();
    onOpenChange(false);
    onNavigate(`/${encodeURIComponent(accountId)}`);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) reset();
      }}
    >
      <DialogContent aria-describedby="rail-create-workspace-description">
        <DialogHeader>
          <DialogTitle>建立新工作區</DialogTitle>
          <DialogDescription id="rail-create-workspace-description">
            輸入名稱後會直接建立工作區並加入目前帳號的工作區清單中。
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="rail-workspace-name">
              工作區名稱
            </label>
            <Input
              id="rail-workspace-name"
              value={workspaceName}
              onChange={(e) => {
                setWorkspaceName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="例如：Project Alpha"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              disabled={isCreating}
              maxLength={80}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              disabled={isCreating}
            >
              取消
            </Button>
            <Button type="submit" disabled={isCreating || !accountId || !accountType}>
              {isCreating ? "建立中…" : "直接建立"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
````

## File: modules/workspace/interfaces/web/components/screens/AccountDashboardScreen.tsx
````typescript
"use client";

import Link from "next/link";
import {
  BookOpen,
  Brain,
  Database,
  FileText,
  FolderOpen,
  Library,
  MessageSquare,
  Notebook,
  Shield,
  User,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { Badge } from "@ui-shadcn/ui/badge";

import type { WorkspaceEntity } from "../../../api/contracts";

// ── Types ─────────────────────────────────────────────────────────────────────

interface AccountDashboardScreenProps {
  readonly accountId: string;
  readonly accountName: string | null;
  readonly accountType: "user" | "organization";
  readonly workspaces: WorkspaceEntity[];
  readonly workspacesHydrated: boolean;
  readonly activeWorkspaceId: string | null;
  readonly currentUserId: string | null;
}

// ── Quick-access card definitions ─────────────────────────────────────────────

interface QuickAccessCard {
  readonly key: string;
  readonly label: string;
  readonly description: string;
  readonly icon: React.ReactNode;
  readonly buildHref: (accountId: string, workspaceId: string) => string;
}

const WORKSPACE_QUICK_ACCESS_CARDS: readonly QuickAccessCard[] = [
  {
    key: "knowledge-pages",
    label: "知識頁面",
    description: "管理知識頁面內容",
    icon: <FileText className="size-5 text-blue-500" />,
    buildHref: (a, w) => `/${enc(a)}/${enc(w)}?tab=Overview&panel=knowledge-pages`,
  },
  {
    key: "articles",
    label: "文章",
    description: "知識庫文章管理",
    icon: <BookOpen className="size-5 text-emerald-500" />,
    buildHref: (a, w) => `/${enc(a)}/${enc(w)}?tab=Overview&panel=knowledge-base-articles`,
  },
  {
    key: "files",
    label: "檔案",
    description: "工作區檔案管理",
    icon: <FolderOpen className="size-5 text-amber-500" />,
    buildHref: (a, w) => `/${enc(a)}/${enc(w)}?tab=Files`,
  },
  {
    key: "members",
    label: "成員",
    description: "工作區成員與角色",
    icon: <Users className="size-5 text-violet-500" />,
    buildHref: (a, w) => `/${enc(a)}/${enc(w)}?tab=Members`,
  },
  {
    key: "knowledge-base",
    label: "知識庫",
    description: "結構化知識管理",
    icon: <Notebook className="size-5 text-cyan-500" />,
    buildHref: (a, w) => `/${enc(a)}/${enc(w)}?tab=Knowledge`,
  },
  {
    key: "rag-query",
    label: "RAG 查詢",
    description: "問答與引用檢索",
    icon: <Brain className="size-5 text-pink-500" />,
    buildHref: (a, w) => `/${enc(a)}/${enc(w)}?tab=Notebook`,
  },
  {
    key: "ai-chat",
    label: "AI 對話",
    description: "AI 助手對話介面",
    icon: <MessageSquare className="size-5 text-orange-500" />,
    buildHref: (a, w) => `/${enc(a)}/${enc(w)}?tab=AiChat`,
  },
  {
    key: "databases",
    label: "資料庫",
    description: "結構化資料表管理",
    icon: <Database className="size-5 text-indigo-500" />,
    buildHref: (a, w) => `/${enc(a)}/${enc(w)}?tab=Overview&panel=knowledge-databases`,
  },
  {
    key: "source-libraries",
    label: "來源庫",
    description: "文件來源管理",
    icon: <Library className="size-5 text-teal-500" />,
    buildHref: (a, w) => `/${enc(a)}/${enc(w)}?tab=Overview&panel=source-libraries`,
  },
  {
    key: "governance",
    label: "治理",
    description: "存取與權限治理",
    icon: <Shield className="size-5 text-red-500" />,
    buildHref: (a, w) => `/${enc(a)}/${enc(w)}?tab=Overview&panel=governance`,
  },
  {
    key: "profile",
    label: "工作區資料",
    description: "工作區基本設定",
    icon: <User className="size-5 text-slate-500" />,
    buildHref: (a, w) => `/${enc(a)}/${enc(w)}?tab=Overview&panel=profile`,
  },
];

function enc(s: string): string {
  return encodeURIComponent(s);
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AccountDashboardScreen({
  accountId,
  accountName,
  accountType,
  workspaces,
  workspacesHydrated,
  activeWorkspaceId,
}: AccountDashboardScreenProps) {
  const activeWorkspace = activeWorkspaceId
    ? workspaces.find((w) => w.id === activeWorkspaceId) ?? null
    : null;

  const sortedWorkspaces = [...workspaces].sort((a, b) =>
    a.name.localeCompare(b.name, "zh-Hant"),
  );

  return (
    <div className="space-y-8">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">儀表板</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {accountName ?? accountId} ·{" "}
          <Badge variant="outline" className="text-[10px]">
            {accountType === "organization" ? "組織" : "個人"}
          </Badge>
        </p>
      </div>

      {/* ── Active workspace quick-access ──────────────────────────────── */}
      {activeWorkspace ? (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold">
              目前工作區：{activeWorkspace.name}
            </h2>
            <Badge variant="secondary" className="text-[10px]">
              {activeWorkspace.lifecycleState}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {WORKSPACE_QUICK_ACCESS_CARDS.map((card) => (
              <Link
                key={card.key}
                href={card.buildHref(accountId, activeWorkspace.id)}
                className="group"
              >
                <Card className="h-full transition-colors group-hover:border-primary/50 group-hover:bg-accent/40">
                  <CardHeader className="flex-row items-center gap-2 pb-1 pt-3">
                    {card.icon}
                    <CardTitle className="text-sm">{card.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3 pt-0">
                    <CardDescription className="text-xs">
                      {card.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-border/50 bg-card/70 p-6">
          <p className="text-sm text-muted-foreground">
            {workspacesHydrated
              ? "尚未選取工作區。請先從工作區中心選擇一個工作區。"
              : "正在載入工作區資料…"}
          </p>
        </section>
      )}

      {/* ── All workspaces list ─────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">
          所有工作區
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            ({sortedWorkspaces.length})
          </span>
        </h2>

        {!workspacesHydrated ? (
          <div className="rounded-xl border border-border/40 px-4 py-3 text-sm text-muted-foreground">
            正在載入工作區清單…
          </div>
        ) : sortedWorkspaces.length === 0 ? (
          <div className="rounded-xl border border-border/40 px-4 py-3 text-sm text-muted-foreground">
            目前帳號沒有工作區。
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sortedWorkspaces.map((workspace) => {
              const isActive = workspace.id === activeWorkspaceId;
              return (
                <Link
                  key={workspace.id}
                  href={`/${enc(accountId)}/${enc(workspace.id)}`}
                  className="group"
                >
                  <Card
                    className={`h-full transition-colors group-hover:border-primary/50 group-hover:bg-accent/40 ${
                      isActive ? "border-primary/30 bg-primary/5" : ""
                    }`}
                  >
                    <CardHeader className="pb-2 pt-4">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm">{workspace.name}</CardTitle>
                        {isActive && (
                          <Badge variant="secondary" className="text-[10px]">
                            Active
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-xs">
                        {workspace.lifecycleState} · {workspace.visibility}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3 pt-0">
                      <div className="flex flex-wrap gap-1.5 text-[10px] text-muted-foreground">
                        <span>Cap: {workspace.capabilities.length}</span>
                        <span>·</span>
                        <span>Teams: {workspace.teamIds.length}</span>
                        <span>·</span>
                        <span>Grants: {workspace.grants.length}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
````

## File: modules/workspace/interfaces/web/components/screens/WorkspaceDetailRouteScreen.tsx
````typescript
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { WorkspaceDetailScreen } from "./WorkspaceDetailScreen";

interface WorkspaceDetailRouteScreenProps {
  workspaceId: string;
  accountId: string | null | undefined;
  accountsHydrated: boolean;
  initialTab?: string;
  initialOverviewPanel?: string;
}

export function WorkspaceDetailRouteScreen({
  workspaceId,
  accountId,
  accountsHydrated,
  initialTab,
  initialOverviewPanel,
}: WorkspaceDetailRouteScreenProps) {
  const router = useRouter();

  useEffect(() => {
    if (initialTab === "Wiki" && workspaceId) {
      router.replace(`/workspace/${encodeURIComponent(workspaceId)}?tab=Overview&panel=knowledge-pages`);
    }
  }, [initialTab, router, workspaceId]);

  if (initialTab === "Wiki" && workspaceId) {
    return <div className="px-4 py-6 text-sm text-muted-foreground">正在導向工作區 Overview（Knowledge Pages）…</div>;
  }

  return (
    <WorkspaceDetailScreen
      workspaceId={workspaceId}
      accountId={accountId}
      accountsHydrated={accountsHydrated}
      initialTab={initialTab}
      initialOverviewPanel={initialOverviewPanel}
    />
  );
}
````

## File: modules/workspace/interfaces/web/components/screens/WorkspaceHubScreen.tsx
````typescript
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import type { WorkspaceEntity } from "../../../api/contracts";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";

import { useWorkspaceHub } from "../../hooks/useWorkspaceHub";
import { getWorkspaceGovernanceSummary } from "../../view-models/workspace-supporting-records";
import { CreateWorkspaceDialog } from "../dialogs/CreateWorkspaceDialog";

const lifecycleBadgeVariant: Record<
  WorkspaceEntity["lifecycleState"],
  "default" | "secondary" | "outline"
> = {
  active: "default",
  preparatory: "secondary",
  stopped: "outline",
};

interface WorkspaceHubScreenProps {
  readonly accountId: string | null | undefined;
  readonly accountName: string | null | undefined;
  readonly accountType: "user" | "organization";
  readonly accountsHydrated: boolean;
  readonly isBootstrapSeeded: boolean;
  readonly currentUserId?: string | null;
}

export function WorkspaceHubScreen({
  accountId,
  accountName,
  accountType,
  accountsHydrated,
  isBootstrapSeeded,
  currentUserId,
}: WorkspaceHubScreenProps) {
  const router = useRouter();
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");

  const {
    createError,
    clearCreateError,
    createWorkspaceForAccount,
    errorMessage,
    isCreatingWorkspace,
    loadState,
    workspaceStats,
    workspaces,
  } = useWorkspaceHub({
    accountId,
    accountType,
    creatorUserId: currentUserId,
  });

  function resetCreateWorkspaceDialog() {
    setWorkspaceName("");
    clearCreateError();
  }

  async function handleCreateWorkspace(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = await createWorkspaceForAccount(workspaceName);

    if (!result.success) {
      return;
    }

    resetCreateWorkspaceDialog();
    setIsCreateWorkspaceOpen(false);
    if (result.aggregateId) {
      if (accountId) {
        router.push(`/${encodeURIComponent(accountId)}/${encodeURIComponent(result.aggregateId)}`);
      } else {
        router.push("/");
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Workspace Hub</h1>
          <p className="text-sm text-muted-foreground">
            Review the workspaces connected to{" "}
            <span className="font-medium text-foreground">
              {accountName ?? "the active account"}
            </span>
            .
          </p>
        </div>

        <Button
          onClick={() => setIsCreateWorkspaceOpen(true)}
          disabled={!accountsHydrated || !accountId}
        >
          {!accountsHydrated ? "同步帳號中…" : "建立工作區"}
        </Button>
      </div>

      {!accountsHydrated && (
        <div
          className="rounded-xl border border-border/40 px-4 py-3 text-sm text-muted-foreground"
          aria-live="polite"
          role="status"
        >
          {isBootstrapSeeded
            ? "正在同步可用的組織與工作區內容，完成後即可直接建立或切換工作區。"
            : "正在載入帳號與工作區內容…"}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border border-border/50">
          <CardHeader>
            <CardDescription>Total Workspaces</CardDescription>
            <CardTitle className="text-3xl">{workspaceStats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border border-border/50">
          <CardHeader>
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl">{workspaceStats.active}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border border-border/50">
          <CardHeader>
            <CardDescription>Preparatory</CardDescription>
            <CardTitle className="text-3xl">{workspaceStats.preparatory}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle>Workspace-first Product Spine</CardTitle>
          <CardDescription>
            目前先把主流程收斂成 Identity → Organization → Workspace，再由工作區承接 Knowledge、知識頁面、Notebook / AI。
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-xl border border-border/40 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Entry flow</p>
            <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">1. Identity</span>：登入後先建立個人／組織帳號情境。
              </li>
              <li>
                <span className="font-medium text-foreground">2. Organization</span>：切換至目標 account / organization。
              </li>
              <li>
                <span className="font-medium text-foreground">3. Workspace</span>：進入工作區後再分流到知識、知識頁面、Notebook / AI。
              </li>
            </ol>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border/40 px-4 py-4">
              <p className="text-sm font-semibold text-foreground">Knowledge</p>
              <p className="mt-1 text-xs text-muted-foreground">
                文件、來源、Libraries 與 upload / ingest 流程都由工作區承接。
              </p>
            </div>
            <div className="rounded-xl border border-border/40 px-4 py-4">
              <p className="text-sm font-semibold text-foreground">知識頁面</p>
              <p className="mt-1 text-xs text-muted-foreground">
                頁面樹、內容導覽與知識結構直接從工作區知識頁面進入。
              </p>
            </div>
            <div className="rounded-xl border border-border/40 px-4 py-4">
              <p className="text-sm font-semibold text-foreground">Notebook / AI</p>
              <p className="mt-1 text-xs text-muted-foreground">
                問答、推理與 RAG 查詢作為工作區內的消費層，而非獨立入口。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle>Workspace Records</CardTitle>
          <CardDescription>
            Lifecycle 與 supporting governance records 目前仍由 workspace 模組擁有，但已收斂在專用 supporting ports；點入後會以工作區為樞紐進入 Knowledge / 知識頁面 / Notebook-AI。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadState === "loading" && (
            <div className="rounded-xl border border-border/40 px-4 py-3 text-sm text-muted-foreground">
              Loading workspace records…
            </div>
          )}

          {loadState === "error" && errorMessage && (
            <div className="rounded-xl border border-destructive/30 px-4 py-3 text-sm text-destructive">
              {errorMessage}
            </div>
          )}

          {loadState === "loaded" && workspaces.length === 0 && (
            <div className="rounded-xl border border-border/40 px-4 py-4 text-sm text-muted-foreground">
              目前這個帳號尚未建立任何工作區。你可以先完成{" "}
              <Link
                href={accountId ? `/${encodeURIComponent(accountId)}/organization` : "/"}
                className="font-medium text-primary hover:underline"
              >
                組織情境
              </Link>{" "}
              設定，再使用上方的建立工作區入口，回到 workspace-first 主流程。
            </div>
          )}

          {workspaces.map((workspace) => {
            const governanceSummary = getWorkspaceGovernanceSummary(workspace);

            return (
              <Link
                key={workspace.id}
                href={accountId
                  ? `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspace.id)}`
                  : "/"}
                className="block rounded-xl border border-border/40 px-4 py-4 shadow-sm transition hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        {workspace.name}
                      </p>
                      <Badge variant={lifecycleBadgeVariant[workspace.lifecycleState]}>
                        {workspace.lifecycleState}
                      </Badge>
                      <Badge variant="outline">{workspace.visibility}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Account scope: {workspace.accountType}
                    </p>
                    <p className="text-xs font-medium text-primary">點擊進入工作區</p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs text-muted-foreground sm:text-right">
                    <span>Capabilities: {governanceSummary.capabilityCount}</span>
                    <span>Teams: {governanceSummary.teamCount}</span>
                    <span>Locations: {governanceSummary.locationCount}</span>
                    <span>Grants: {governanceSummary.grantCount}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </CardContent>
      </Card>

      <CreateWorkspaceDialog
        open={isCreateWorkspaceOpen}
        workspaceName={workspaceName}
        createError={createError}
        isCreatingWorkspace={isCreatingWorkspace}
        accountId={accountId}
        onOpenChange={(open) => {
          setIsCreateWorkspaceOpen(open);
          if (!open) resetCreateWorkspaceDialog();
        }}
        onWorkspaceNameChange={(name) => {
          setWorkspaceName(name);
          if (createError) clearCreateError();
        }}
        onSubmit={handleCreateWorkspace}
      />
    </div>
  );
}
````

## File: modules/workspace/interfaces/web/hooks/useWorkspaceDetail.ts
````typescript
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { WorkspaceEntity } from "../../api/contracts";
import { getWorkspaceByIdForAccount } from "../../api/facades";

export type WorkspaceLoadState = "loading" | "loaded" | "error";

export interface UseWorkspaceDetailResult {
  workspace: WorkspaceEntity | null;
  loadState: WorkspaceLoadState;
  setWorkspace: (ws: WorkspaceEntity) => void;
}

export function useWorkspaceDetail(
  workspaceId: string,
  accountId: string | null | undefined,
  accountsHydrated: boolean,
): UseWorkspaceDetailResult {
  const router = useRouter();
  const [workspace, setWorkspace] = useState<WorkspaceEntity | null>(null);
  const [loadState, setLoadState] = useState<WorkspaceLoadState>("loading");

  useEffect(() => {
    let cancelled = false;

    async function loadWorkspace() {
      if (!workspaceId) {
        setLoadState("error");
        return;
      }

      if (!accountId || !accountsHydrated) {
        setWorkspace(null);
        setLoadState("loading");
        return;
      }

      setLoadState("loading");
      try {
        const detail = await getWorkspaceByIdForAccount(accountId, workspaceId);
        if (cancelled) return;
        if (!detail) {
          router.replace(`/${encodeURIComponent(accountId)}?context=unavailable`);
          return;
        }
        setWorkspace(detail);
        setLoadState("loaded");
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[useWorkspaceDetail] Failed to load workspace:", error);
        }
        if (!cancelled) {
          setWorkspace(null);
          setLoadState("error");
        }
      }
    }

    void loadWorkspace();

    return () => {
      cancelled = true;
    };
  }, [accountId, accountsHydrated, router, workspaceId]);

  return { workspace, loadState, setWorkspace };
}
````

## File: modules/workspace/interfaces/web/hooks/useWorkspaceSettingsSave.ts
````typescript
"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { WorkspaceEntity } from "../../api/contracts";
import { getWorkspaceByIdForAccount, updateWorkspaceSettings } from "../../api/facades";
import type { WorkspaceSettingsDraft } from "../state/workspace-settings";
import { trimOrUndefined } from "../components/layout/workspace-detail-helpers";

interface UseWorkspaceSettingsSaveOptions {
  readonly workspace: WorkspaceEntity | null;
  readonly accountId: string | null | undefined;
  readonly onSaved: (updated: WorkspaceEntity) => void;
}

interface UseWorkspaceSettingsSaveResult {
  readonly isSaving: boolean;
  readonly saveError: string | null;
  readonly clearSaveError: () => void;
  readonly handleSave: (
    event: FormEvent<HTMLFormElement>,
    settingsDraft: WorkspaceSettingsDraft | null,
  ) => Promise<void>;
}

export function useWorkspaceSettingsSave({
  workspace,
  accountId,
  onSaved,
}: UseWorkspaceSettingsSaveOptions): UseWorkspaceSettingsSaveResult {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleSave(
    event: FormEvent<HTMLFormElement>,
    settingsDraft: WorkspaceSettingsDraft | null,
  ) {
    event.preventDefault();

    if (!workspace || !settingsDraft) return;

    if (!accountId) {
      setSaveError("帳號上下文尚未完成同步，請稍候再試。");
      return;
    }

    const nextWorkspaceName = settingsDraft.name.trim();
    if (!nextWorkspaceName) {
      setSaveError("請輸入工作區名稱。");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    const hasAddressContent = Boolean(
      settingsDraft.street.trim() ||
        settingsDraft.city.trim() ||
        settingsDraft.state.trim() ||
        settingsDraft.postalCode.trim() ||
        settingsDraft.country.trim() ||
        settingsDraft.details.trim(),
    );
    const hasPersonnelContent = Boolean(
      settingsDraft.managerId.trim() ||
        settingsDraft.supervisorId.trim() ||
        settingsDraft.safetyOfficerId.trim() ||
        settingsDraft.customRoles.some((entry) => entry.roleName.trim() || entry.role.trim()),
    );

    const normalizedCustomRoles = settingsDraft.customRoles
      .map((entry) => ({
        roleId: entry.roleId,
        roleName: entry.roleName.trim(),
        role: entry.role.trim(),
      }))
      .filter((entry) => entry.roleName || entry.role);

    const result = await updateWorkspaceSettings({
      workspaceId: workspace.id,
      accountId,
      name: nextWorkspaceName,
      visibility: settingsDraft.visibility,
      lifecycleState: settingsDraft.lifecycleState,
      address:
        workspace.address != null || hasAddressContent
          ? {
              street: settingsDraft.street.trim(),
              city: settingsDraft.city.trim(),
              state: settingsDraft.state.trim(),
              postalCode: settingsDraft.postalCode.trim(),
              country: settingsDraft.country.trim(),
              details: trimOrUndefined(settingsDraft.details),
            }
          : undefined,
      personnel:
        workspace.personnel != null || hasPersonnelContent
          ? {
              managerId: trimOrUndefined(settingsDraft.managerId),
              supervisorId: trimOrUndefined(settingsDraft.supervisorId),
              safetyOfficerId: trimOrUndefined(settingsDraft.safetyOfficerId),
              customRoles: normalizedCustomRoles.length > 0 ? normalizedCustomRoles : undefined,
            }
          : undefined,
    });

    if (!result.success) {
      setSaveError(result.error.message);
      setIsSaving(false);
      return;
    }

    try {
      const detail = await getWorkspaceByIdForAccount(accountId, workspace.id);
      if (!detail) {
        router.replace(`/${encodeURIComponent(accountId)}?context=unavailable`);
        return;
      }
      onSaved(detail);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[useWorkspaceSettingsSave] Failed to refresh workspace after save:", error);
      }
      setSaveError("工作區已更新，但重新整理資料失敗。請稍後再試。");
    } finally {
      setIsSaving(false);
    }
  }

  return {
    isSaving,
    saveError,
    clearSaveError: () => setSaveError(null),
    handleSave,
  };
}
````

## File: modules/workspace/interfaces/web/navigation/nav-preferences-data.ts
````typescript
/**
 * nav-preferences-data.ts  (workspace BC – interfaces/web/navigation)
 * Owns: NavPreferences type, nav-item catalogs, default values,
 *   validation helpers, and localStorage read/write utilities.
 * Constraints: No React imports. No UI imports. Pure data / serialization.
 */

import {
  WORKSPACE_NAV_ITEMS,
  normalizeWorkspaceOrder,
} from "./workspace-nav-items";

// Re-export for consumers that import from this file directly.
export { WORKSPACE_NAV_ITEMS, normalizeWorkspaceOrder };

// ── Types ──────────────────────────────────────────────────────────────────

export interface NavPreferences {
  pinnedPersonal: string[];
  pinnedWorkspace: string[];
  showLimitedWorkspaces: boolean;
  maxWorkspaces: number;
  workspaceOrder: string[];
}

export interface SidebarLocaleBundle {
  workspace?: {
    groups?: Record<string, string>;
    tabLabels?: Record<string, string>;
  };
}

const STORAGE_KEY = "xuanwu:nav-preferences";

// ── Personal nav items ─────────────────────────────────────────────────────

export const PERSONAL_ITEMS: { id: string; labelKey: "recentWorkspaces" }[] = [
  { id: "recent-workspaces", labelKey: "recentWorkspaces" },
];

// ── Organization management items ─────────────────────────────────────────

export const ORGANIZATION_NAV_ITEMS: { id: string; zhLabel: string; enLabel: string }[] = [
  { id: "teams", zhLabel: "團隊", enLabel: "Teams" },
  { id: "permissions", zhLabel: "權限", enLabel: "Permissions" },
  { id: "workspaces", zhLabel: "工作區", enLabel: "Workspaces" },
];

export const DIALOG_TEXT = {
  zh: {
    title: "Customize navigation",
    description:
      "已勾選項目會固定顯示於側欄。此設定僅影響你自己的介面，不會影響其他成員。",
    sectionPersonal: "個人",
    sectionWorkspace: "工作區",
    sectionOrganization: "組織管理",
    sectionDisplay: "顯示設定",
    limitedLabel: "側欄僅顯示固定數量的最近工作區",
    limitedInputLabel: "工作區數量",
    done: "完成",
    recentWorkspaces: "最近工作區",
  },
  en: {
    title: "Customize navigation",
    description:
      "Checked items stay visible in your sidebar. This setting is personal and does not affect other members.",
    sectionPersonal: "Personal",
    sectionWorkspace: "Workspace",
    sectionOrganization: "Organization",
    sectionDisplay: "Display",
    limitedLabel: "Show a limited number of recent workspaces in sidebar",
    limitedInputLabel: "Number of workspaces",
    done: "Done",
    recentWorkspaces: "Recent workspaces",
  },
} as const;

// ── Defaults + validation ──────────────────────────────────────────────────

export const DEFAULT_PREFS: NavPreferences = {
  pinnedPersonal: ["recent-workspaces"],
  pinnedWorkspace: [
    ...WORKSPACE_NAV_ITEMS.map((item) => item.id),
    ...ORGANIZATION_NAV_ITEMS.map((item) => item.id),
  ],
  showLimitedWorkspaces: true,
  maxWorkspaces: 10,
  workspaceOrder: WORKSPACE_NAV_ITEMS.map((item) => item.id),
};

const VALID_PERSONAL_ITEM_IDS = new Set(PERSONAL_ITEMS.map((item) => item.id));
const VALID_WORKSPACE_ITEM_IDS = new Set([
  ...WORKSPACE_NAV_ITEMS.map((item) => item.id),
  ...ORGANIZATION_NAV_ITEMS.map((item) => item.id),
]);

const WORKFLOW_PIN_MIGRATION_IDS = [
  "task-qa",
  "task-acceptance",
  "task-issues",
  "task-finance",
] as const;

/**
 * Notion / NotebookLM orchestration tabs added via workspace orchestration layer.
 * Existing users whose localStorage pre-dates these tabs need auto-migration.
 */
const NOTION_NOTEBOOKLM_PIN_MIGRATION_IDS = [
  "knowledge",
  "notebook",
  "ai-chat",
] as const;

function normalizePinnedIds(ids: unknown, validSet: Set<string>, fallback: string[]): string[] {
  if (!Array.isArray(ids)) return fallback;
  const normalized = ids
    .filter((id): id is string => typeof id === "string")
    .filter((id) => validSet.has(id));
  return normalized.length > 0 ? Array.from(new Set(normalized)) : fallback;
}

function migrateWorkflowPins(ids: string[]): string[] {
  if (!ids.includes("tasks")) return ids;
  const next = [...ids];
  for (const id of WORKFLOW_PIN_MIGRATION_IDS) {
    if (!next.includes(id) && VALID_WORKSPACE_ITEM_IDS.has(id)) {
      next.push(id);
    }
  }
  return next;
}

function migrateNotionNotebooklmPins(ids: string[]): string[] {
  const next = [...ids];
  let changed = false;
  for (const id of NOTION_NOTEBOOKLM_PIN_MIGRATION_IDS) {
    if (!next.includes(id) && VALID_WORKSPACE_ITEM_IDS.has(id)) {
      next.push(id);
      changed = true;
    }
  }
  return changed ? next : ids;
}

// ── localStorage helpers ───────────────────────────────────────────────────

export function readNavPreferences(): NavPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<NavPreferences>;
    const normalizedWorkspacePinned = normalizePinnedIds(
      parsed.pinnedWorkspace,
      VALID_WORKSPACE_ITEM_IDS,
      DEFAULT_PREFS.pinnedWorkspace,
    );
    return {
      pinnedPersonal: normalizePinnedIds(
        parsed.pinnedPersonal,
        VALID_PERSONAL_ITEM_IDS,
        DEFAULT_PREFS.pinnedPersonal,
      ),
      pinnedWorkspace: migrateNotionNotebooklmPins(migrateWorkflowPins(normalizedWorkspacePinned)),
      showLimitedWorkspaces: parsed.showLimitedWorkspaces ?? DEFAULT_PREFS.showLimitedWorkspaces,
      maxWorkspaces:
        typeof parsed.maxWorkspaces === "number"
          ? parsed.maxWorkspaces
          : DEFAULT_PREFS.maxWorkspaces,
      workspaceOrder: normalizeWorkspaceOrder(parsed.workspaceOrder),
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function writeNavPreferences(prefs: NavPreferences): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}
````

## File: modules/workspace/interfaces/web/navigation/workspace-tabs.ts
````typescript
export type WorkspaceTabDevStatus = "🚧" | "🏗️" | "✅";

export type WorkspaceTabGroup = "primary" | "spaces" | "databases" | "library" | "modules";

export const WORKSPACE_TAB_SIDEBAR_GROUP_ORDER: readonly WorkspaceTabGroup[] = [
  "primary",
  "modules",
  "spaces",
  "databases",
  "library",
];

export const WORKSPACE_TAB_VALUES = [
  "Overview",
  "Members",
  "Daily",
  "Files",
  "Schedule",
  "Audit",
  "Tasks",
  "TaskQa",
  "TaskAcceptance",
  "TaskIssues",
  "TaskFinance",
  "Feed",
  "Knowledge",
  "Notebook",
  "AiChat",
] as const;

export type WorkspaceTabValue = (typeof WORKSPACE_TAB_VALUES)[number];

interface WorkspaceTabMeta {
  readonly label: string;
  readonly prefId: string;
  readonly group: WorkspaceTabGroup;
  readonly status: WorkspaceTabDevStatus;
}

export const WORKSPACE_TAB_META: Record<WorkspaceTabValue, WorkspaceTabMeta> = {
  Overview: { label: "Home", prefId: "home", group: "primary", status: "🏗️" },
  Members: { label: "Members", prefId: "members", group: "library", status: "✅" },
  Daily: { label: "Daily", prefId: "daily", group: "modules", status: "✅" },
  Files: { label: "Files", prefId: "files", group: "library", status: "✅" },
  Schedule: { label: "Schedule", prefId: "schedule", group: "modules", status: "✅" },
  Audit: { label: "Audit", prefId: "audit", group: "modules", status: "✅" },
  Tasks: { label: "任務", prefId: "tasks", group: "modules", status: "🏗️" },
  TaskQa: { label: "質檢", prefId: "task-qa", group: "modules", status: "🏗️" },
  TaskAcceptance: { label: "驗收", prefId: "task-acceptance", group: "modules", status: "🏗️" },
  TaskIssues: { label: "問題單", prefId: "task-issues", group: "modules", status: "🏗️" },
  TaskFinance: { label: "財務", prefId: "task-finance", group: "modules", status: "🏗️" },
  Feed: { label: "Feed", prefId: "feed", group: "modules", status: "🏗️" },
  Knowledge: { label: "Knowledge", prefId: "knowledge", group: "modules", status: "🏗️" },
  Notebook: { label: "Notebook", prefId: "notebook", group: "modules", status: "🏗️" },
  AiChat: { label: "AI Chat", prefId: "ai-chat", group: "modules", status: "🏗️" },
};

export const WORKSPACE_TAB_GROUPS: Record<WorkspaceTabGroup, readonly WorkspaceTabValue[]> = {
  primary: ["Overview"],
  spaces: [],
  databases: [],
  library: ["Files", "Members"],
  modules: [
    "Daily",
    "Schedule",
    "Audit",
    "Tasks",
    "TaskQa",
    "TaskAcceptance",
    "TaskIssues",
    "TaskFinance",
    "Feed",
    "Knowledge",
    "Notebook",
    "AiChat",
  ],
};

const WORKSPACE_TAB_VALUE_SET = new Set<string>(WORKSPACE_TAB_VALUES);

export function isWorkspaceTabValue(value: string): value is WorkspaceTabValue {
  return WORKSPACE_TAB_VALUE_SET.has(value);
}

export function getWorkspaceTabMeta(tab: WorkspaceTabValue) {
  return WORKSPACE_TAB_META[tab];
}

export function getWorkspaceTabStatus(tab: WorkspaceTabValue): WorkspaceTabDevStatus {
  return WORKSPACE_TAB_META[tab].status;
}

export function getWorkspaceTabLabel(tab: WorkspaceTabValue): string {
  return WORKSPACE_TAB_META[tab].label;
}

export function getWorkspaceTabPrefId(tab: WorkspaceTabValue): string {
  return WORKSPACE_TAB_META[tab].prefId;
}

export function getWorkspaceTabsByGroup(group: WorkspaceTabGroup): readonly WorkspaceTabValue[] {
  return WORKSPACE_TAB_GROUPS[group];
}

export function getWorkspaceTabsInSidebarOrder(): WorkspaceTabValue[] {
  return WORKSPACE_TAB_SIDEBAR_GROUP_ORDER.flatMap((group) => getWorkspaceTabsByGroup(group));
}
````

## File: modules/workspace/README.md
````markdown
# Workspace

協作容器與工作區範疇主域

## Implementation Structure

```text
modules/workspace/
├── api/              # Public API boundary
├── application/      # Context-wide orchestration (delegates to subdomains)
│   ├── queries/      # Read query handlers (pure reads, no business logic)
│   ├── use-cases/    # Command use cases remaining at root level
│   └── services/     # Application services (composite orchestrators)
├── domain/           # Context-wide domain concepts (Workspace aggregate root)
├── infrastructure/   # Context-wide driven adapters
├── interfaces/       # Context-wide driving adapters
├── docs/             # Links to strategic documentation
└── subdomains/
    ├── audit/             # Active — append-only audit trail
    ├── feed/              # Active — workspace activity projection
    ├── lifecycle/         # Active — workspace create/update/delete/transitions
    ├── membership/        # Active — member view model and participation queries
    ├── presence/          # Stub — real-time presence and activity
    ├── scheduling/        # Active — workspace scheduling management
    ├── sharing/           # Active — team and individual access grants
    └── workspace-workflow/ # Active — task/issue/invoice state machines
```

## Subdomains

| Subdomain | Status | Purpose |
|-----------|--------|---------|
| audit | Active | 不可否認稽核追蹤 |
| feed | Active | 工作區活動投影 |
| lifecycle | Active | 工作區容器生命週期（建立/修改/刪除/狀態轉換）|
| membership | Active | 工作區參與者視圖模型與查詢 |
| presence | Stub | 即時在線狀態 |
| scheduling | Active | 工作區排程管理 |
| sharing | Active | 工作區存取授權（團隊/個人）|
| workspace-workflow | Active | 工作區流程協調 |

## Application Layer Architecture

The root application services act as **composite orchestrators** that delegate to subdomain services:

| Operation | Delegated To |
|-----------|-------------|
| Create/Update/Delete workspace | `lifecycle` subdomain |
| Team/Individual access grants | `sharing` subdomain |
| Member view queries | `membership` subdomain |
| Mount capabilities | Root use-case (pending subdomain assignment) |
| Create workspace location | Root use-case (Workspace operational profile) |
| Workspace read queries | Root query handlers |
| Wiki content tree projection | Root query handler |

### DDD Rules Applied

- **Rule 5/13/16**: Pure reads → query handlers in `queries/`, not use cases
- **Rule 12**: Commands → `use-cases/` or subdomain use cases
- **Rule 18**: Single-call wrappers eliminated; functions instead of classes for queries
- **Rule 8**: Each use case = one business intent (verb-first naming)

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

- `api/` is the only cross-module public boundary.
- Domain must not import infrastructure, interfaces, or external frameworks.
- Cross-module collaboration goes through `api/` only.
- Subdomain cross-collaboration goes through subdomain `api/` only.

## UI Orchestration Boundary

- App-layer browser composition should prefer `modules/workspace/api/ui` and `modules/workspace/api/facade`.
- workspace is the composition owner for notion/notebooklm panels, commands, and navigation flows rendered in the shell.
- notion and notebooklm root `api/` surfaces provide downstream semantic capabilities for orchestrators; they are not the preferred browser-facing import path for app routes when workspace owns the flow.

## Strategic Documentation

- [Context README](../../docs/contexts/workspace/README.md)
- [Subdomains](../../docs/contexts/workspace/subdomains.md)
- [Context Map](../../docs/contexts/workspace/context-map.md)
- [Ubiquitous Language](../../docs/contexts/workspace/ubiquitous-language.md)
- [Bounded Context Template](../../docs/bounded-context-subdomain-template.md)
````

## File: modules/workspace/subdomains/audit/infrastructure/firebase/FirebaseAuditRepository.ts
````typescript
import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api";
import type { AuditEntry } from "../../domain/aggregates/AuditEntry";
import type { AuditLogEntity, AuditLogSource } from "../../domain/entities/AuditLog";
import type { AuditRepository } from "../../domain/repositories/AuditRepository";

const VALID_AUDIT_LOG_SOURCES = new Set<AuditLogSource>([
  "workspace",
  "finance",
  "notification",
  "system",
]);

function toAuditLogEntity(id: string, data: Record<string, unknown>): AuditLogEntity {
  const source = VALID_AUDIT_LOG_SOURCES.has(data.source as AuditLogSource)
    ? (data.source as AuditLogSource)
    : "workspace";

  return {
    id,
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    actorId: typeof data.actorId === "string" ? data.actorId : "system",
    action: typeof data.action === "string" ? data.action : "unknown",
    detail: typeof data.detail === "string" ? data.detail : "",
    source,
    occurredAtISO:
      typeof data.occurredAtISO === "string"
        ? data.occurredAtISO
        : "",
  };
}

export class FirebaseAuditRepository implements AuditRepository {
  async save(entry: AuditEntry): Promise<void> {
    const id = crypto.randomUUID();
    await firestoreInfrastructureApi.set(`auditLogs/${id}`, entry.getSnapshot());
  }

  async findByWorkspaceId(workspaceId: string): Promise<AuditLogEntity[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      "auditLogs",
      [{ field: "workspaceId", op: "==", value: workspaceId }],
    );

    return docs
      .map((doc) => toAuditLogEntity(doc.id, doc.data))
      .sort((left, right) => right.occurredAtISO.localeCompare(left.occurredAtISO));
  }

  async findByWorkspaceIds(
    workspaceIds: string[],
    maxCount = 200,
  ): Promise<AuditLogEntity[]> {
    if (workspaceIds.length === 0) {
      return [];
    }

    const chunks: string[][] = [];
    for (let index = 0; index < workspaceIds.length; index += 10) {
      chunks.push(workspaceIds.slice(index, index + 10));
    }

    const perChunkLimit = Math.max(1, Math.ceil(maxCount / chunks.length));

    const documents = await Promise.all(
      chunks.map((chunk) =>
        firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
          "auditLogs",
          [{ field: "workspaceId", op: "in", value: chunk }],
          { limit: perChunkLimit },
        ),
      ),
    );

    return documents
      .flatMap((document) => document)
      .map((doc) => toAuditLogEntity(doc.id, doc.data))
      .sort((left, right) => right.occurredAtISO.localeCompare(left.occurredAtISO))
      .slice(0, maxCount);
  }
}
````

## File: modules/workspace/subdomains/audit/README.md
````markdown
# Audit

Audit trail and accountability tracking for workspace actions.

## Ownership

- **Bounded Context**: workspace
- **Status**: Active

## Layers

| Layer | Purpose |
|-------|---------|
| `api/` | Local public boundary for same bounded context access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, events, repositories, and business rules |

> By default, `infrastructure/` and `interfaces/` live at the bounded-context root and are grouped by subdomain. Add local `infrastructure/` or `interfaces/` inside a subdomain only when the mini-module gate is explicitly justified.

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/workspace/subdomains/feed/infrastructure/firebase/FirebaseWorkspaceFeedInteractionRepository.ts
````typescript
import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api";
import { v7 as generateId } from "@lib-uuid";

import type { WorkspaceFeedInteractionRepository } from "../../domain/repositories/workspace-feed.repositories";

function postPath(accountId: string, postId: string): string {
  return `accounts/${accountId}/workspaceFeedPosts/${postId}`;
}

function likesPath(accountId: string, postId: string, actorAccountId: string): string {
  return `${postPath(accountId, postId)}/likes/${actorAccountId}`;
}

function bookmarksPath(accountId: string, postId: string, actorAccountId: string): string {
  return `${postPath(accountId, postId)}/bookmarks/${actorAccountId}`;
}

function viewsPath(accountId: string, postId: string): string {
  return `${postPath(accountId, postId)}/views`;
}

function sharesPath(accountId: string, postId: string): string {
  return `${postPath(accountId, postId)}/shares`;
}

export class FirebaseWorkspaceFeedInteractionRepository implements WorkspaceFeedInteractionRepository {
  async like(accountId: string, postId: string, actorAccountId: string): Promise<boolean> {
    const path = likesPath(accountId, postId, actorAccountId);
    const snap = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (snap) return false;

    await firestoreInfrastructureApi.set(path, {
      accountId,
      postId,
      actorAccountId,
      createdAtISO: new Date().toISOString(),
    });
    return true;
  }

  async bookmark(accountId: string, postId: string, actorAccountId: string): Promise<boolean> {
    const path = bookmarksPath(accountId, postId, actorAccountId);
    const snap = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (snap) return false;

    await firestoreInfrastructureApi.set(path, {
      accountId,
      postId,
      actorAccountId,
      createdAtISO: new Date().toISOString(),
    });
    return true;
  }

  async view(accountId: string, postId: string, actorAccountId: string): Promise<void> {
    await firestoreInfrastructureApi.set(`${viewsPath(accountId, postId)}/${generateId()}`, {
      accountId,
      postId,
      actorAccountId,
      createdAtISO: new Date().toISOString(),
    });
  }

  async share(accountId: string, postId: string, actorAccountId: string): Promise<void> {
    await firestoreInfrastructureApi.set(`${sharesPath(accountId, postId)}/${generateId()}`, {
      accountId,
      postId,
      actorAccountId,
      createdAtISO: new Date().toISOString(),
    });
  }
}
````

## File: modules/workspace/subdomains/feed/infrastructure/firebase/FirebaseWorkspaceFeedPostRepository.ts
````typescript
import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api";
import { v7 as generateId } from "@lib-uuid";

import type {
  CreateWorkspaceFeedPostInput,
  CreateWorkspaceFeedReplyInput,
  CreateWorkspaceFeedRepostInput,
  WorkspaceFeedCounterPatch,
  WorkspaceFeedPost,
} from "../../domain/entities/workspace-feed-post.entity";
import type { WorkspaceFeedPostRepository } from "../../domain/repositories/workspace-feed.repositories";

function postsPath(accountId: string): string {
  return `accounts/${accountId}/workspaceFeedPosts`;
}

function postPath(accountId: string, postId: string): string {
  return `accounts/${accountId}/workspaceFeedPosts/${postId}`;
}

function repostMapPath(accountId: string, actorAccountId: string, sourcePostId: string): string {
  return `accounts/${accountId}/workspaceFeedReposts/${actorAccountId}__${sourcePostId}`;
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown): number {
  return typeof value === "number" ? value : 0;
}

function toWorkspaceFeedPost(id: string, data: Record<string, unknown>): WorkspaceFeedPost {
  const type = asString(data.type, "post");
  return {
    id,
    accountId: asString(data.accountId),
    workspaceId: asString(data.workspaceId),
    authorAccountId: asString(data.authorAccountId),
    type: type === "reply" || type === "repost" ? type : "post",
    content: asString(data.content),
    replyToPostId: typeof data.replyToPostId === "string" ? data.replyToPostId : null,
    repostOfPostId: typeof data.repostOfPostId === "string" ? data.repostOfPostId : null,
    likeCount: asNumber(data.likeCount),
    replyCount: asNumber(data.replyCount),
    repostCount: asNumber(data.repostCount),
    viewCount: asNumber(data.viewCount),
    bookmarkCount: asNumber(data.bookmarkCount),
    shareCount: asNumber(data.shareCount),
    createdAtISO: asString(data.createdAtISO),
    updatedAtISO: asString(data.updatedAtISO),
  };
}

function createBasePostData(
  accountId: string,
  workspaceId: string,
  authorAccountId: string,
  content: string,
  type: "post" | "reply" | "repost",
): Record<string, unknown> {
  const nowISO = new Date().toISOString();
  return {
    accountId,
    workspaceId,
    authorAccountId,
    type,
    content,
    likeCount: 0,
    replyCount: 0,
    repostCount: 0,
    viewCount: 0,
    bookmarkCount: 0,
    shareCount: 0,
    createdAtISO: nowISO,
    updatedAtISO: nowISO,
  };
}

export class FirebaseWorkspaceFeedPostRepository implements WorkspaceFeedPostRepository {
  async createPost(input: CreateWorkspaceFeedPostInput): Promise<WorkspaceFeedPost> {
    const id = generateId();
    const data = createBasePostData(
      input.accountId,
      input.workspaceId,
      input.authorAccountId,
      input.content,
      "post",
    );
    await firestoreInfrastructureApi.set(postPath(input.accountId, id), data);
    return toWorkspaceFeedPost(id, data);
  }

  async createReply(input: CreateWorkspaceFeedReplyInput): Promise<WorkspaceFeedPost> {
    const id = generateId();
    const data: Record<string, unknown> = {
      ...createBasePostData(
        input.accountId,
        input.workspaceId,
        input.authorAccountId,
        input.content,
        "reply",
      ),
      replyToPostId: input.parentPostId,
      repostOfPostId: null,
    };

    await firestoreInfrastructureApi.set(postPath(input.accountId, id), data);
    await this.patchCounters(input.accountId, input.parentPostId, { replyDelta: 1 });
    return toWorkspaceFeedPost(id, data);
  }

  async createRepost(input: CreateWorkspaceFeedRepostInput): Promise<WorkspaceFeedPost | null> {
    const mapPath = repostMapPath(input.accountId, input.actorAccountId, input.sourcePostId);
    const existingMap = await firestoreInfrastructureApi.get<Record<string, unknown>>(mapPath);
    if (existingMap) {
      const repostPostId = asString(existingMap.repostPostId);
      if (!repostPostId) return null;
      return this.findById(input.accountId, repostPostId);
    }

    const source = await this.findById(input.accountId, input.sourcePostId);
    if (!source) return null;

    const id = generateId();
    const content = input.comment?.trim() || source.content;
    const data: Record<string, unknown> = {
      ...createBasePostData(
        input.accountId,
        input.workspaceId,
        input.actorAccountId,
        content,
        "repost",
      ),
      replyToPostId: null,
      repostOfPostId: input.sourcePostId,
    };

    await firestoreInfrastructureApi.set(postPath(input.accountId, id), data);
    await firestoreInfrastructureApi.set(mapPath, {
      accountId: input.accountId,
      workspaceId: input.workspaceId,
      sourcePostId: input.sourcePostId,
      actorAccountId: input.actorAccountId,
      repostPostId: id,
      createdAtISO: new Date().toISOString(),
    });
    await this.patchCounters(input.accountId, input.sourcePostId, { repostDelta: 1 });
    return toWorkspaceFeedPost(id, data);
  }

  async patchCounters(accountId: string, postId: string, patch: WorkspaceFeedCounterPatch): Promise<void> {
    const path = postPath(accountId, postId);
    const current = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!current) return;

    const updates: Record<string, unknown> = {
      updatedAtISO: new Date().toISOString(),
    };

    const applyDelta = (field: string, delta: number | undefined) => {
      if (!delta) return;
      const base = asNumber(current[field]);
      updates[field] = base + delta;
    };

    applyDelta("likeCount", patch.likeDelta);
    applyDelta("replyCount", patch.replyDelta);
    applyDelta("repostCount", patch.repostDelta);
    applyDelta("viewCount", patch.viewDelta);
    applyDelta("bookmarkCount", patch.bookmarkDelta);
    applyDelta("shareCount", patch.shareDelta);

    await firestoreInfrastructureApi.update(path, updates);
  }

  async findById(accountId: string, postId: string): Promise<WorkspaceFeedPost | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(postPath(accountId, postId));
    if (!data) return null;
    return toWorkspaceFeedPost(postId, data);
  }

  async listByWorkspaceId(accountId: string, workspaceId: string, maxRows: number): Promise<WorkspaceFeedPost[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      postsPath(accountId),
      [{ field: "workspaceId", op: "==", value: workspaceId }],
      { orderBy: [{ field: "createdAtISO", direction: "desc" }], limit: maxRows },
    );
    return docs.map((row) => toWorkspaceFeedPost(row.id, row.data));
  }

  async listByAccountId(accountId: string, maxRows: number): Promise<WorkspaceFeedPost[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      postsPath(accountId),
      [],
      { orderBy: [{ field: "createdAtISO", direction: "desc" }], limit: maxRows },
    );
    return docs.map((row) => toWorkspaceFeedPost(row.id, row.data));
  }
}
````

## File: modules/workspace/subdomains/feed/README.md
````markdown
# Feed

Activity feed projections for workspace events.

## Ownership

- **Bounded Context**: workspace
- **Status**: Active

## Layers

| Layer | Purpose |
|-------|---------|
| `api/` | Local public boundary for same bounded context access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, events, repositories, and business rules |

> By default, `infrastructure/` and `interfaces/` live at the bounded-context root and are grouped by subdomain. Add local `infrastructure/` or `interfaces/` inside a subdomain only when the mini-module gate is explicitly justified.

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/workspace/subdomains/scheduling/infrastructure/firebase/FirebaseDemandRepository.ts
````typescript
import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api";

import type { WorkDemand } from "../../domain/types";
import type { IDemandRepository } from "../../domain/repository";

const DEMANDS_COLLECTION = "workspacePlannerDemands";

function toWorkDemand(id: string, data: Record<string, unknown>): WorkDemand {
  const status = data.status;
  const priority = data.priority;

  return {
    id,
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    requesterId: typeof data.requesterId === "string" ? data.requesterId : "",
    title: typeof data.title === "string" ? data.title : "",
    description: typeof data.description === "string" ? data.description : "",
    status:
      status === "draft" || status === "open" || status === "in_progress" || status === "completed"
        ? status
        : "draft",
    priority: priority === "low" || priority === "medium" || priority === "high" ? priority : "medium",
    scheduledAt: typeof data.scheduledAt === "string" ? data.scheduledAt : "",
    assignedUserId: typeof data.assignedUserId === "string" ? data.assignedUserId : undefined,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

export class FirebaseDemandRepository implements IDemandRepository {
  private demandPath(id: string): string {
    return `${DEMANDS_COLLECTION}/${id}`;
  }

  async listByWorkspace(workspaceId: string): Promise<WorkDemand[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      DEMANDS_COLLECTION,
      [{ field: "workspaceId", op: "==", value: workspaceId }],
    );
    return docs
      .map((item) => toWorkDemand(item.id, item.data))
      .sort((a, b) => b.updatedAtISO.localeCompare(a.updatedAtISO));
  }

  async listByAccount(accountId: string): Promise<WorkDemand[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      DEMANDS_COLLECTION,
      [{ field: "accountId", op: "==", value: accountId }],
    );
    return docs
      .map((item) => toWorkDemand(item.id, item.data))
      .sort((a, b) => b.updatedAtISO.localeCompare(a.updatedAtISO));
  }

  async save(demand: WorkDemand): Promise<void> {
    const path = this.demandPath(demand.id);
    const existing = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (existing) {
      await this.update(demand);
      return;
    }

    await firestoreInfrastructureApi.set(path, {
      workspaceId: demand.workspaceId,
      accountId: demand.accountId,
      requesterId: demand.requesterId,
      title: demand.title,
      description: demand.description,
      status: demand.status,
      priority: demand.priority,
      scheduledAt: demand.scheduledAt,
      assignedUserId: demand.assignedUserId ?? null,
      createdAtISO: demand.createdAtISO,
      updatedAtISO: demand.updatedAtISO,
    });
  }

  async update(demand: WorkDemand): Promise<void> {
    await firestoreInfrastructureApi.update(this.demandPath(demand.id), {
      workspaceId: demand.workspaceId,
      accountId: demand.accountId,
      requesterId: demand.requesterId,
      title: demand.title,
      description: demand.description,
      status: demand.status,
      priority: demand.priority,
      scheduledAt: demand.scheduledAt,
      assignedUserId: demand.assignedUserId ?? null,
      updatedAtISO: demand.updatedAtISO,
    });
  }

  async findById(id: string): Promise<WorkDemand | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(this.demandPath(id));
    if (!data) return null;
    return toWorkDemand(id, data);
  }
}
````

## File: modules/workspace/subdomains/scheduling/interfaces/components/CreateDemandForm.tsx
````typescript
"use client";

import { useState } from "react";

import { format } from "@lib-date-fns";
import { Button } from "@ui-shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-shadcn/ui/select";
import { Textarea } from "@ui-shadcn/ui/textarea";

import { DEMAND_PRIORITY_LABELS } from "../../application/dto/work-demand.dto";
import type { DemandPriority } from "../../application/dto/work-demand.dto";

export interface CreateDemandFormValues {
  title: string;
  description: string;
  priority: DemandPriority;
  scheduledAt: string;
}

interface CreateDemandFormProps {
  open: boolean;
  initialDate?: Date;
  onClose: () => void;
  onSubmit: (values: CreateDemandFormValues) => Promise<void>;
}

export function CreateDemandForm({
  open,
  initialDate,
  onClose,
  onSubmit,
}: CreateDemandFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<DemandPriority>("medium");
  const [scheduledAt, setScheduledAt] = useState(
    initialDate ? format(initialDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleOpen = (isOpen: boolean) => {
    if (isOpen && initialDate) {
      setScheduledAt(format(initialDate, "yyyy-MM-dd"));
    }
    if (!isOpen) handleClose();
  };

  function handleClose() {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setScheduledAt(initialDate ? format(initialDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"));
    setError(null);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) {
      setError("請輸入需求標題。");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({ title: t, description: description.trim(), priority, scheduledAt });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "提交失敗，請再試一次。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>建立工作需求</DialogTitle>
          <DialogDescription>
            填寫需求詳情後送出，Account 管理員將收到通知並指派成員。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="demand-title">標題 *</Label>
            <Input
              id="demand-title"
              placeholder="需要完成什麼工作？"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="demand-description">描述（選填）</Label>
            <Textarea
              id="demand-description"
              placeholder="詳細說明需求背景或驗收條件…"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="demand-priority">優先級</Label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as DemandPriority)}
                disabled={submitting}
              >
                <SelectTrigger id="demand-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["low", "medium", "high"] as const).map((p) => (
                    <SelectItem key={p} value={p}>
                      {DEMAND_PRIORITY_LABELS[p]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="demand-date">排程日期 *</Label>
              <Input
                id="demand-date"
                type="date"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                disabled={submitting}
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={submitting}>
              取消
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "提交中…" : "建立需求"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
````

## File: modules/workspace/subdomains/scheduling/README.md
````markdown
# Scheduling

Scheduling and demand management within workspaces.

## Ownership

- **Bounded Context**: workspace
- **Status**: Active

## Layers

| Layer | Purpose |
|-------|---------|
| `api/` | Local public boundary for same bounded context access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, events, repositories, and business rules |

> By default, `infrastructure/` and `interfaces/` live at the bounded-context root and are grouped by subdomain. Add local `infrastructure/` or `interfaces/` inside a subdomain only when the mini-module gate is explicitly justified.

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/workspace/subdomains/subdomains.instructions.md
````markdown
---
description: 'Workspace subdomains structural rules: hexagonal shape per subdomain, workspaceId scope enforcement, cross-subdomain collaboration, and stub promotion criteria.'
applyTo: 'modules/workspace/subdomains/**/*.{ts,tsx}'
---

# Workspace Subdomains Layer (Local)

Use this file as execution guardrails for `modules/workspace/subdomains/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/workspace/subdomains.md`.

## Core Rules

- Every subdomain must maintain the core-first default shape: `api/`, `domain/`, `application/`, optional `ports/`, and `README.md`.
- `infrastructure/` and `interfaces/` belong at the bounded-context root by default and should be grouped by subdomain there unless the mini-module gate is explicitly justified.
- Stub subdomains must not be promoted to Active without a corresponding ADR and `README.md` update.
- Cross-subdomain collaboration within workspace goes through the **subdomain's own `api/`** — never import a sibling's `domain/`, `application/`, `infrastructure/`, or `interfaces/` internals.
- All subdomain operations must be scoped to a `workspaceId`; never perform workspace-wide queries without an explicit scope check.
- `workspace-workflow` owns Task, Issue, and Invoice state machines — do not duplicate workflow logic in other subdomains.
- `audit` subdomain is append-only; never modify or delete audit entries.
- Domain events use the discriminant format `workspace.<subdomain>.<action>` (e.g. `workspace.feed.post-created`, `workspace.workflow.task-assigned`).
- Dependency direction inside each subdomain: `interfaces → application → domain ← infrastructure`.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
````

## File: modules/workspace/subdomains/workspace-workflow/infrastructure/repositories/FirebaseInvoiceItemRepository.ts
````typescript
/**
 * @module workspace-flow/infrastructure/repositories
 * @file FirebaseInvoiceItemRepository.ts
 * @description Firebase Firestore repository for InvoiceItem CRUD operations.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add query pagination support
 */

import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api";
import type { InvoiceItem } from "../../domain/entities/InvoiceItem";
import { toInvoiceItem } from "../firebase/invoice-item.converter";
import { WF_INVOICE_ITEMS_COLLECTION } from "../firebase/workspace-flow.collections";

export class FirebaseInvoiceItemRepository {
  private itemPath(itemId: string): string {
    return `${WF_INVOICE_ITEMS_COLLECTION}/${itemId}`;
  }

  async findById(itemId: string): Promise<InvoiceItem | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(this.itemPath(itemId));
    if (!data) return null;
    return toInvoiceItem(itemId, data);
  }

  async findByInvoiceId(invoiceId: string): Promise<InvoiceItem[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      WF_INVOICE_ITEMS_COLLECTION,
      [{ field: "invoiceId", op: "==", value: invoiceId }],
    );
    return docs.map((d) => toInvoiceItem(d.id, d.data));
  }

  async delete(itemId: string): Promise<void> {
    await firestoreInfrastructureApi.delete(this.itemPath(itemId));
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/infrastructure/repositories/FirebaseInvoiceRepository.ts
````typescript
/**
 * @module workspace-flow/infrastructure/repositories
 * @file FirebaseInvoiceRepository.ts
 * @description Firebase Firestore implementation of InvoiceRepository for workspace-flow.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add query pagination support and composite indexes
 */

import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api";
import { v7 as generateId } from "@lib-uuid";
import type { Invoice, CreateInvoiceInput } from "../../domain/entities/Invoice";
import type { InvoiceItem, AddInvoiceItemInput } from "../../domain/entities/InvoiceItem";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { INVOICE_STATUSES, type InvoiceStatus } from "../../domain/value-objects/InvoiceStatus";
import { toInvoice } from "../firebase/invoice.converter";
import { toInvoiceItem } from "../firebase/invoice-item.converter";
import {
  WF_INVOICES_COLLECTION,
  WF_INVOICE_ITEMS_COLLECTION,
} from "../firebase/workspace-flow.collections";

const VALID_STATUSES = new Set<InvoiceStatus>(INVOICE_STATUSES);
const DEFAULT_STATUS: InvoiceStatus = "draft";

export class FirebaseInvoiceRepository implements InvoiceRepository {
  private invoicePath(invoiceId: string): string {
    return `${WF_INVOICES_COLLECTION}/${invoiceId}`;
  }

  private itemPath(itemId: string): string {
    return `${WF_INVOICE_ITEMS_COLLECTION}/${itemId}`;
  }

  async create(input: CreateInvoiceInput): Promise<Invoice> {
    const nowISO = new Date().toISOString();
    const docData: Record<string, unknown> = {
      workspaceId: input.workspaceId,
      status: DEFAULT_STATUS,
      totalAmount: 0,
      submittedAtISO: null,
      approvedAtISO: null,
      paidAtISO: null,
      closedAtISO: null,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    };
    if (input.sourceReference) {
      docData.sourceReference = { ...input.sourceReference };
    }

    const id = generateId();
    await firestoreInfrastructureApi.set(this.invoicePath(id), docData);

    return {
      id,
      workspaceId: input.workspaceId,
      status: DEFAULT_STATUS,
      totalAmount: 0,
      sourceReference: input.sourceReference,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    };
  }

  async delete(invoiceId: string): Promise<void> {
    await firestoreInfrastructureApi.delete(this.invoicePath(invoiceId));
  }

  async findById(invoiceId: string): Promise<Invoice | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(this.invoicePath(invoiceId));
    if (!data) return null;
    return toInvoice(invoiceId, data);
  }

  async findByWorkspaceId(workspaceId: string): Promise<Invoice[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      WF_INVOICES_COLLECTION,
      [{ field: "workspaceId", op: "==", value: workspaceId }],
    );
    const invoices = docs.map((d) => toInvoice(d.id, d.data));
    return invoices.sort((a, b) => b.createdAtISO.localeCompare(a.createdAtISO));
  }

  async transitionStatus(
    invoiceId: string,
    to: InvoiceStatus,
    nowISO: string,
  ): Promise<Invoice | null> {
    const path = this.invoicePath(invoiceId);
    const snap = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!snap) return null;

    const validTo = VALID_STATUSES.has(to) ? to : DEFAULT_STATUS;
    const patch: Record<string, unknown> = {
      status: validTo,
      updatedAtISO: nowISO,
    };
    if (validTo === "submitted") patch.submittedAtISO = nowISO;
    if (validTo === "approved") patch.approvedAtISO = nowISO;
    if (validTo === "paid") patch.paidAtISO = nowISO;
    if (validTo === "closed") patch.closedAtISO = nowISO;

    await firestoreInfrastructureApi.update(path, patch);
    const updated = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!updated) return null;
    return toInvoice(invoiceId, updated);
  }

  async addItem(input: AddInvoiceItemInput): Promise<InvoiceItem> {
    const nowISO = new Date().toISOString();
    const itemId = generateId();
    await firestoreInfrastructureApi.set(this.itemPath(itemId), {
      invoiceId: input.invoiceId,
      taskId: input.taskId,
      amount: input.amount,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    });

    // Update invoice totalAmount
    const invoicePath = this.invoicePath(input.invoiceId);
    const invoice = await firestoreInfrastructureApi.get<Record<string, unknown>>(invoicePath);
    if (invoice) {
      const totalAmount = typeof invoice.totalAmount === "number" ? invoice.totalAmount : 0;
      await firestoreInfrastructureApi.update(invoicePath, {
        totalAmount: totalAmount + input.amount,
        updatedAtISO: nowISO,
      });
    }

    return {
      id: itemId,
      invoiceId: input.invoiceId,
      taskId: input.taskId,
      amount: input.amount,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    };
  }

  async findItemById(invoiceItemId: string): Promise<InvoiceItem | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(this.itemPath(invoiceItemId));
    if (!data) return null;
    return toInvoiceItem(invoiceItemId, data);
  }

  async updateItem(invoiceItemId: string, amount: number): Promise<InvoiceItem | null> {
    const itemPath = this.itemPath(invoiceItemId);
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(itemPath);
    if (!data) return null;

    const oldAmount = typeof data.amount === "number" ? data.amount : 0;
    const invoiceId = typeof data.invoiceId === "string" ? data.invoiceId : "";
    const nowISO = new Date().toISOString();

    await firestoreInfrastructureApi.update(itemPath, { amount, updatedAtISO: nowISO });

    if (invoiceId) {
      const invoicePath = this.invoicePath(invoiceId);
      const invoice = await firestoreInfrastructureApi.get<Record<string, unknown>>(invoicePath);
      if (invoice) {
        const totalAmount = typeof invoice.totalAmount === "number" ? invoice.totalAmount : 0;
        await firestoreInfrastructureApi.update(invoicePath, {
          totalAmount: totalAmount + (amount - oldAmount),
          updatedAtISO: nowISO,
        });
      }
    }

    const updated = await firestoreInfrastructureApi.get<Record<string, unknown>>(itemPath);
    if (!updated) return null;
    return toInvoiceItem(invoiceItemId, updated);
  }

  async removeItem(invoiceItemId: string): Promise<void> {
    const itemPath = this.itemPath(invoiceItemId);
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(itemPath);
    if (!data) return;

    const amount = typeof data.amount === "number" ? data.amount : 0;
    const invoiceId = typeof data.invoiceId === "string" ? data.invoiceId : "";

    await firestoreInfrastructureApi.delete(itemPath);

    if (invoiceId) {
      const invoicePath = this.invoicePath(invoiceId);
      const invoice = await firestoreInfrastructureApi.get<Record<string, unknown>>(invoicePath);
      if (invoice) {
        const totalAmount = typeof invoice.totalAmount === "number" ? invoice.totalAmount : 0;
        await firestoreInfrastructureApi.update(invoicePath, {
          totalAmount: totalAmount - amount,
          updatedAtISO: new Date().toISOString(),
        });
      }
    }
  }

  async listItems(invoiceId: string): Promise<InvoiceItem[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      WF_INVOICE_ITEMS_COLLECTION,
      [{ field: "invoiceId", op: "==", value: invoiceId }],
    );
    return docs.map((d) => toInvoiceItem(d.id, d.data));
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/infrastructure/repositories/FirebaseIssueRepository.ts
````typescript
/**
 * @module workspace-flow/infrastructure/repositories
 * @file FirebaseIssueRepository.ts
 * @description Firebase Firestore implementation of IssueRepository for workspace-flow.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add query pagination support and composite indexes
 */

import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api";
import { v7 as generateId } from "@lib-uuid";
import type { Issue, OpenIssueInput, UpdateIssueInput } from "../../domain/entities/Issue";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { ISSUE_STATUSES, type IssueStatus } from "../../domain/value-objects/IssueStatus";
import { toIssue } from "../firebase/issue.converter";
import { WF_ISSUES_COLLECTION } from "../firebase/workspace-flow.collections";

const VALID_STATUSES = new Set<IssueStatus>(ISSUE_STATUSES);
const DEFAULT_STATUS: IssueStatus = "open";
const OPEN_STATUSES: IssueStatus[] = ["open", "investigating", "fixing", "retest"];

export class FirebaseIssueRepository implements IssueRepository {
  private issuePath(issueId: string): string {
    return `${WF_ISSUES_COLLECTION}/${issueId}`;
  }

  async create(input: OpenIssueInput): Promise<Issue> {
    const nowISO = new Date().toISOString();
    const issueId = generateId();
    await firestoreInfrastructureApi.set(this.issuePath(issueId), {
      taskId: input.taskId,
      stage: input.stage,
      title: input.title,
      description: input.description ?? "",
      status: DEFAULT_STATUS,
      createdBy: input.createdBy,
      assignedTo: input.assignedTo ?? null,
      resolvedAtISO: null,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    });

    return {
      id: issueId,
      taskId: input.taskId,
      stage: input.stage,
      title: input.title,
      description: input.description ?? "",
      status: DEFAULT_STATUS,
      createdBy: input.createdBy,
      assignedTo: input.assignedTo,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    };
  }

  async update(issueId: string, input: UpdateIssueInput): Promise<Issue | null> {
    const path = this.issuePath(issueId);
    const snap = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!snap) return null;

    const patch: Record<string, unknown> = {
      updatedAtISO: new Date().toISOString(),
    };
    if (typeof input.title === "string") patch.title = input.title;
    if (typeof input.description === "string") patch.description = input.description;
    if (typeof input.assignedTo === "string") patch.assignedTo = input.assignedTo;

    await firestoreInfrastructureApi.update(path, patch);
    const updated = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!updated) return null;
    return toIssue(issueId, updated);
  }

  async delete(issueId: string): Promise<void> {
    await firestoreInfrastructureApi.delete(this.issuePath(issueId));
  }

  async findById(issueId: string): Promise<Issue | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(this.issuePath(issueId));
    if (!data) return null;
    return toIssue(issueId, data);
  }

  async findByTaskId(taskId: string): Promise<Issue[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      WF_ISSUES_COLLECTION,
      [{ field: "taskId", op: "==", value: taskId }],
      { orderBy: [{ field: "createdAtISO", direction: "desc" }] },
    );
    return docs.map((d) => toIssue(d.id, d.data));
  }

  async countOpenByTaskId(taskId: string): Promise<number> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      WF_ISSUES_COLLECTION,
      [
        { field: "taskId", op: "==", value: taskId },
        { field: "status", op: "in", value: OPEN_STATUSES },
      ],
    );
    return docs.length;
  }

  async transitionStatus(issueId: string, to: IssueStatus, nowISO: string): Promise<Issue | null> {
    const path = this.issuePath(issueId);
    const snap = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!snap) return null;

    const validTo = VALID_STATUSES.has(to) ? to : DEFAULT_STATUS;
    const patch: Record<string, unknown> = {
      status: validTo,
      updatedAtISO: nowISO,
    };
    if (validTo === "resolved") patch.resolvedAtISO = nowISO;

    await firestoreInfrastructureApi.update(path, patch);
    const updated = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!updated) return null;
    return toIssue(issueId, updated);
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/infrastructure/repositories/FirebaseTaskRepository.ts
````typescript
/**
 * @module workspace-flow/infrastructure/repositories
 * @file FirebaseTaskRepository.ts
 * @description Firebase Firestore implementation of TaskRepository for workspace-flow.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add query pagination support and composite indexes
 */

import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api";
import { v7 as generateId } from "@lib-uuid";
import type { Task, CreateTaskInput, UpdateTaskInput } from "../../domain/entities/Task";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import { TASK_STATUSES, type TaskStatus } from "../../domain/value-objects/TaskStatus";
import { toTask } from "../firebase/task.converter";
import { WF_TASKS_COLLECTION } from "../firebase/workspace-flow.collections";

const VALID_STATUSES = new Set<TaskStatus>(TASK_STATUSES);
const DEFAULT_STATUS: TaskStatus = "draft";

export class FirebaseTaskRepository implements TaskRepository {
  private taskPath(taskId: string): string {
    return `${WF_TASKS_COLLECTION}/${taskId}`;
  }

  async create(input: CreateTaskInput): Promise<Task> {
    const nowISO = new Date().toISOString();
    const docData: Record<string, unknown> = {
      workspaceId: input.workspaceId,
      title: input.title,
      description: input.description ?? "",
      status: DEFAULT_STATUS,
      assigneeId: input.assigneeId ?? null,
      dueDateISO: input.dueDateISO ?? null,
      acceptedAtISO: null,
      archivedAtISO: null,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    };
    if (input.sourceReference) {
      docData.sourceReference = { ...input.sourceReference };
    }

    const taskId = generateId();
    await firestoreInfrastructureApi.set(this.taskPath(taskId), docData);

    return {
      id: taskId,
      workspaceId: input.workspaceId,
      title: input.title,
      description: input.description ?? "",
      status: DEFAULT_STATUS,
      assigneeId: input.assigneeId,
      dueDateISO: input.dueDateISO,
      sourceReference: input.sourceReference,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    };
  }

  async update(taskId: string, input: UpdateTaskInput): Promise<Task | null> {
    const path = this.taskPath(taskId);
    const snap = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!snap) return null;

    const patch: Record<string, unknown> = {
      updatedAtISO: new Date().toISOString(),
    };
    if (typeof input.title === "string") patch.title = input.title;
    if (typeof input.description === "string") patch.description = input.description;
    if (typeof input.assigneeId === "string") patch.assigneeId = input.assigneeId;
    if (typeof input.dueDateISO === "string") patch.dueDateISO = input.dueDateISO;

    await firestoreInfrastructureApi.update(path, patch);
    const updated = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!updated) return null;
    return toTask(taskId, updated);
  }

  async delete(taskId: string): Promise<void> {
    await firestoreInfrastructureApi.delete(this.taskPath(taskId));
  }

  async findById(taskId: string): Promise<Task | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(this.taskPath(taskId));
    if (!data) return null;
    return toTask(taskId, data);
  }

  async findByWorkspaceId(workspaceId: string): Promise<Task[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      WF_TASKS_COLLECTION,
      [{ field: "workspaceId", op: "==", value: workspaceId }],
    );
    const tasks = docs.map((d) => toTask(d.id, d.data));
    return tasks.sort((a, b) => b.updatedAtISO.localeCompare(a.updatedAtISO));
  }

  async transitionStatus(taskId: string, to: TaskStatus, nowISO: string): Promise<Task | null> {
    const path = this.taskPath(taskId);
    const snap = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!snap) return null;

    const validTo = VALID_STATUSES.has(to) ? to : DEFAULT_STATUS;
    const patch: Record<string, unknown> = {
      status: validTo,
      updatedAtISO: nowISO,
    };
    if (validTo === "accepted") patch.acceptedAtISO = nowISO;
    if (validTo === "archived") patch.archivedAtISO = nowISO;

    await firestoreInfrastructureApi.update(path, patch);
    const updated = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!updated) return null;
    return toTask(taskId, updated);
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/README.md
````markdown
# Workspace Workflow

Workflow orchestration for workspace processes.

## Ownership

- **Bounded Context**: workspace
- **Status**: Active

## Layers

| Layer | Purpose |
|-------|---------|
| `api/` | Local public boundary for same bounded context access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, events, repositories, and business rules |

> By default, `infrastructure/` and `interfaces/` live at the bounded-context root and are grouped by subdomain. Add local `infrastructure/` or `interfaces/` inside a subdomain only when the mini-module gate is explicitly justified.

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/workspace/api/ui.ts
````typescript
/**
 * workspace api/ui.ts
 *
 * Canonical public web UI surface for the workspace bounded context.
 * App-layer consumers that need workspace UI components, hooks, and
 * navigation utilities should import from here.
 *
 * Internal source: interfaces/web/
 */

// ── Screen components ────────────────────────────────────────────────────────

export { WorkspaceDetailScreen } from "../interfaces/web/components/screens/WorkspaceDetailScreen";
export { WorkspaceDetailRouteScreen } from "../interfaces/web/components/screens/WorkspaceDetailRouteScreen";
export { WorkspaceHubScreen } from "../interfaces/web/components/screens/WorkspaceHubScreen";
export { OrganizationWorkspacesScreen } from "../interfaces/web/components/screens/OrganizationWorkspacesScreen";
export { AccountDashboardScreen } from "../interfaces/web/components/screens/AccountDashboardScreen";

// ── Card components ──────────────────────────────────────────────────────────

export { WorkspaceContextCard } from "../interfaces/web/components/cards/WorkspaceContextCard";

// ── Tab components ───────────────────────────────────────────────────────────

export { WorkspaceMembersTab } from "../interfaces/web/components/tabs/WorkspaceMembersTab";

// ── Layout components ────────────────────────────────────────────────────────

export { WorkspaceSidebarSection } from "../interfaces/web/components/layout/WorkspaceSidebarSection";
export { WorkspaceQuickAccessRow } from "../interfaces/web/components/layout/WorkspaceQuickAccessRow";
export { WorkspaceSectionContent } from "../interfaces/web/components/layout/WorkspaceSectionContent";

// ── Rail components ──────────────────────────────────────────────────────────

export { CreateWorkspaceDialogRail } from "../interfaces/web/components/rails/CreateWorkspaceDialogRail";

// ── Navigation ────────────────────────────────────────────────────────────────

export type {
  WorkspaceTabDevStatus,
  WorkspaceTabGroup,
  WorkspaceTabValue,
} from "../interfaces/web/navigation/workspace-tabs";

export {
  WORKSPACE_TAB_GROUPS,
  WORKSPACE_TAB_META,
  WORKSPACE_TAB_VALUES,
  getWorkspaceTabLabel,
  getWorkspaceTabMeta,
  getWorkspaceTabPrefId,
  getWorkspaceTabStatus,
  getWorkspaceTabsByGroup,
  isWorkspaceTabValue,
} from "../interfaces/web/navigation/workspace-tabs";

export type { WorkspaceNavItem } from "../interfaces/web/navigation/workspace-nav-items";
export {
  WORKSPACE_NAV_ITEMS,
  normalizeWorkspaceOrder,
} from "../interfaces/web/navigation/workspace-nav-items";

// ── Quick-access navigation ───────────────────────────────────────────────────

export type {
  WorkspaceQuickAccessItem,
  WorkspaceQuickAccessMatcherOptions,
} from "../interfaces/web/components/navigation/workspace-quick-access";

export { buildWorkspaceQuickAccessItems } from "../interfaces/web/components/navigation/workspace-quick-access";

// ── State helpers ─────────────────────────────────────────────────────────────

export { getWorkspaceStorageKey } from "../interfaces/web/state/workspace-session";

// ── Map utilities ─────────────────────────────────────────────────────────────

export {
  resolveWorkspaceFromMap,
  toWorkspaceMap,
} from "../interfaces/web/utils/workspace-map";

// ── Hooks ─────────────────────────────────────────────────────────────────────

export { useWorkspaceHub } from "../interfaces/web/hooks/useWorkspaceHub";
export type {
  UseWorkspaceOrchestrationContextOptions,
  WorkspaceOrchestrationContext,
} from "../interfaces/web/hooks/useWorkspaceOrchestrationContext";
export { useWorkspaceOrchestrationContext } from "../interfaces/web/hooks/useWorkspaceOrchestrationContext";
export {
  MAX_VISIBLE_RECENT_WORKSPACES,
  getWorkspaceIdFromPath,
  useRecentWorkspaces,
} from "../interfaces/web/hooks/useRecentWorkspaces";

// ── Workspace context provider ────────────────────────────────────────────────

export {
  WorkspaceContextProvider,
  useWorkspaceContext,
} from "../interfaces/web/providers/WorkspaceContextProvider";
export type {
  WorkspaceContextState,
  WorkspaceContextAction,
  WorkspaceContextValue,
} from "../interfaces/web/providers/WorkspaceContextProvider";

// ── Navigation preferences ────────────────────────────────────────────────────

export type { NavPreferences, SidebarLocaleBundle } from "../interfaces/web/navigation/nav-preferences-data";
export {
  PERSONAL_ITEMS,
  ORGANIZATION_NAV_ITEMS,
  DIALOG_TEXT,
  DEFAULT_PREFS,
  readNavPreferences,
  writeNavPreferences,
} from "../interfaces/web/navigation/nav-preferences-data";

// ── Sidebar locale ────────────────────────────────────────────────────────────

export { useSidebarLocale } from "../interfaces/web/navigation/use-sidebar-locale";

export {
  appendWorkspaceContextQuery,
  buildWorkspaceOverviewPanelHref,
  buildWorkspaceContextHref,
  supportsWorkspaceSearchContext,
  type WorkspaceNavigationContext,
  type WorkspaceOverviewPanel,
} from "../interfaces/web/navigation/workspace-context-links";

// ── Navigation customize dialog ───────────────────────────────────────────────

export { CustomizeNavigationDialog } from "../interfaces/web/components/dialogs/CustomizeNavigationDialog";
export { CheckRow, WorkspaceCheckRow } from "../interfaces/web/components/dialogs/NavCheckRow";

export {
  AuditStream,
  WorkspaceAuditTab,
} from "../subdomains/audit/api";

export {
  WorkspaceFeedAccountView,
  WorkspaceFeedWorkspaceView,
} from "../subdomains/feed/api";

export type { AccountMember } from "../subdomains/scheduling/api";
export {
  AccountSchedulingView,
  WorkspaceSchedulingTab,
} from "../subdomains/scheduling/api";

export { WorkspaceFlowTab } from "../subdomains/workspace-workflow/api";

// ── Orchestrated notion UI (workspace as composition owner) ──────────────────

export { ArticleDetailPanel } from "@/modules/notion/api";
export { DatabaseDetailPanel } from "@/modules/notion/api";
export { DatabaseFormsPanel } from "@/modules/notion/api";
export { KnowledgeDetailPanel } from "@/modules/notion/api";
export { KnowledgeSidebarSection } from "@/modules/notion/api";

// ── Orchestrated notebooklm UI (workspace as composition owner) ──────────────

export { RagQueryPanel } from "@/modules/notebooklm/api";
export { ConversationPanel } from "@/modules/notebooklm/api";
export type { ConversationPanelProps } from "@/modules/notebooklm/api";
export { WorkspaceFilesTab } from "@/modules/notebooklm/api";
````

## File: modules/workspace/interfaces/web/hooks/useRecentWorkspaces.ts
````typescript
import { useEffect, useMemo, useState } from "react";

import type { WorkspaceEntity } from "../../api/contracts";

interface RecentWorkspaceLink {
  id: string;
  name: string;
  href: string;
}

const MAX_VISIBLE_RECENT_WORKSPACES = 10;
const RECENT_WORKSPACES_STORAGE_PREFIX = "xuanwu:recent-workspaces:";

const NON_ACCOUNT_WORKSPACE_TOP_LEVEL_ROUTES = new Set([
  "workspace",
  "workspace-feed",
  "knowledge",
  "knowledge-base",
  "knowledge-database",
  "source",
  "notebook",
  "ai-chat",
  "organization",
  "settings",
  "dashboard",
  "dev-tools",
]);

function getStorageKey(accountId: string) {
  return `${RECENT_WORKSPACES_STORAGE_PREFIX}${accountId}`;
}

function readRecentWorkspaceIds(accountId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(getStorageKey(accountId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string" && item.length > 0);
  } catch {
    return [];
  }
}

function persistRecentWorkspaceIds(accountId: string, workspaceIds: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getStorageKey(accountId), JSON.stringify(workspaceIds));
}

function trackWorkspaceFromPath(pathname: string, accountId: string) {
  const workspaceId = getWorkspaceIdFromPath(pathname);
  if (!workspaceId) return;
  const recentIds = readRecentWorkspaceIds(accountId);
  const deduped = [workspaceId, ...recentIds.filter((id) => id !== workspaceId)].slice(0, 50);
  persistRecentWorkspaceIds(accountId, deduped);
}

function getWorkspaceIdFromPath(pathname: string): string | null {
  const legacyMatch = pathname.match(/^\/workspace\/([^/]+)/);
  if (legacyMatch) {
    return decodeURIComponent(legacyMatch[1]);
  }

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length < 2) {
    return null;
  }

  const [firstSegment, secondSegment] = segments;
  if (NON_ACCOUNT_WORKSPACE_TOP_LEVEL_ROUTES.has(firstSegment)) {
    return null;
  }

  if (["organization", "settings", "dashboard", "dev-tools"].includes(secondSegment)) {
    return null;
  }

  if (!secondSegment) {
    return null;
  }

  return decodeURIComponent(secondSegment);
}

export function useRecentWorkspaces(
  accountId: string | undefined,
  pathname: string,
  workspaces: WorkspaceEntity[],
) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!accountId) return;
    trackWorkspaceFromPath(pathname, accountId);
  }, [accountId, pathname]);

  const workspacesById = useMemo(
    () => Object.fromEntries(workspaces.map((workspace) => [workspace.id, workspace])),
    [workspaces],
  );

  const recentWorkspaceIds = useMemo(() => {
    if (!accountId) return [] as string[];
    const stored = readRecentWorkspaceIds(accountId);
    const currentId = getWorkspaceIdFromPath(pathname);
    if (!currentId) return stored;
    return [currentId, ...stored.filter((id) => id !== currentId)];
  }, [accountId, pathname]);

  const recentWorkspaceLinks = useMemo<RecentWorkspaceLink[]>(() => {
    return recentWorkspaceIds
      .map<RecentWorkspaceLink | null>((workspaceId) => {
        const ws = workspacesById[workspaceId];
        if (!ws) return null;
        const href = accountId
          ? `/${encodeURIComponent(accountId)}/${encodeURIComponent(ws.id)}`
          : `/workspace/${encodeURIComponent(ws.id)}`;
        return { id: ws.id, name: ws.name, href };
      })
      .filter((item): item is RecentWorkspaceLink => item !== null);
  }, [accountId, recentWorkspaceIds, workspacesById]);

  return { isExpanded, setIsExpanded, recentWorkspaceLinks };
}

export { MAX_VISIBLE_RECENT_WORKSPACES, getWorkspaceIdFromPath };
````

## File: modules/workspace/interfaces/web/components/screens/WorkspaceDetailScreen.tsx
````typescript
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  Card,
  CardContent,
} from "@ui-shadcn/ui/card";
import { Badge } from "@ui-shadcn/ui/badge";
import { useAuth } from "@/modules/platform/api";
import {
  ConversationPanel,
  RagQueryPanel,
  WorkspaceAuditTab,
  WorkspaceFeedWorkspaceView,
  WorkspaceFilesTab,
  WorkspaceFlowTab,
  WorkspaceSchedulingTab,
} from "@/modules/workspace/api";
import { useWorkspaceContext } from "../../providers/WorkspaceContextProvider";

import {
  createSettingsDraft,
  type WorkspaceSettingsDraft,
} from "../../state/workspace-settings";
import {
  getWorkspaceAddressLines,
  getWorkspacePersonnelEntries,
} from "../../view-models/workspace-supporting-records";
import { WorkspaceDailyTab } from "../tabs/WorkspaceDailyTab";
import { WorkspaceMembersTab } from "../tabs/WorkspaceMembersTab";
import {
  getWorkspaceTabLabel,
  getWorkspaceTabStatus,
  getWorkspaceTabsByGroup,
  isWorkspaceTabValue,
  type WorkspaceTabValue,
} from "../../navigation/workspace-tabs";
import { MOBILE_TAB_GROUP_ORDER } from "../layout/workspace-detail-helpers";
import { WorkspaceOverviewTab } from "../tabs/WorkspaceOverviewTab";
import { WorkspaceSettingsDialog } from "../dialogs/WorkspaceSettingsDialog";
import { useWorkspaceSettingsSave } from "../../hooks/useWorkspaceSettingsSave";
import { useWorkspaceDetail } from "../../hooks/useWorkspaceDetail";

interface WorkspaceDetailScreenProps {
  readonly workspaceId: string;
  readonly accountId: string | null | undefined;
  readonly accountsHydrated: boolean;
  /** Optional tab to activate on first render (e.g. from ?tab= URL param). */
  readonly initialTab?: string;
  readonly initialOverviewPanel?: string;
}

export function WorkspaceDetailScreen({
  workspaceId,
  accountId,
  accountsHydrated,
  initialTab,
  initialOverviewPanel,
}: WorkspaceDetailScreenProps) {
  const { state: wsState, dispatch: wsDispatch } = useWorkspaceContext();
  const { state: authState } = useAuth();
  const { workspace, loadState, setWorkspace } = useWorkspaceDetail(
    workspaceId,
    accountId,
    accountsHydrated,
  );
  const [isEditWorkspaceOpen, setIsEditWorkspaceOpen] = useState(false);
  const [settingsDraft, setSettingsDraft] = useState<WorkspaceSettingsDraft | null>(null);

  const { isSaving: isSavingWorkspace, saveError, clearSaveError, handleSave } = useWorkspaceSettingsSave({
    workspace,
    accountId,
    onSaved: (updated) => {
      setWorkspace(updated);
      setSettingsDraft(createSettingsDraft(updated));
      setIsEditWorkspaceOpen(false);
    },
  });

  const personnelEntries = useMemo(() => {
    return workspace ? getWorkspacePersonnelEntries(workspace) : [];
  }, [workspace]);

  const addressLines = useMemo(() => {
    return workspace ? getWorkspaceAddressLines(workspace) : [];
  }, [workspace]);

  function renderTabContent(tab: WorkspaceTabValue) {
    if (!workspace) return null;

    const flowSection: Record<string, "tasks" | "qa" | "acceptance" | "issues" | "invoices"> = {
      Tasks: "tasks", TaskQa: "qa", TaskAcceptance: "acceptance",
      TaskIssues: "issues", TaskFinance: "invoices",
    };

    if (tab in flowSection) {
      return (
        <WorkspaceFlowTab
          workspaceId={workspace.id}
          currentUserId={accountId ?? "anonymous"}
          initialSection={flowSection[tab]}
        />
      );
    }

    const overviewPanel: Record<string, string> = { Knowledge: "knowledge-pages" };

    switch (tab) {
      case "Overview":
      case "Knowledge":
        return (
          <WorkspaceOverviewTab
            workspace={workspace}
            activeWorkspaceId={wsState.activeWorkspaceId}
            currentUserId={authState.user?.id}
            personnelEntries={personnelEntries}
            addressLines={addressLines}
            initialPanel={overviewPanel[tab] ?? initialOverviewPanel}
            onEditClick={() => {
              setSettingsDraft(createSettingsDraft(workspace));
              clearSaveError();
              setIsEditWorkspaceOpen(true);
            }}
            onSetActiveWorkspace={() =>
              wsDispatch({ type: "SET_ACTIVE_WORKSPACE", payload: workspace.id })
            }
          />
        );
      case "Members":
        return <WorkspaceMembersTab workspace={workspace} />;
      case "Daily":
        return <WorkspaceDailyTab workspace={workspace} />;
      case "Files":
        return <WorkspaceFilesTab workspace={workspace} />;
      case "Schedule":
        return (
          <WorkspaceSchedulingTab
            workspace={workspace}
            accountId={accountId ?? workspace.accountId}
            currentUserId={accountId ?? "anonymous"}
          />
        );
      case "Audit":
        return <WorkspaceAuditTab workspaceId={workspace.id} />;
      case "Feed":
        return (
          <WorkspaceFeedWorkspaceView
            accountId={accountId ?? workspace.accountId}
            workspaceId={workspace.id}
            workspaceName={workspace.name}
          />
        );
      case "Notebook":
        return <RagQueryPanel workspaceId={workspace.id} />;
      case "AiChat":
        return (
          <ConversationPanel
            accountId={accountId ?? workspace.accountId}
            workspaces={wsState.workspaces ?? {}}
            requestedWorkspaceId={workspace.id}
          />
        );
      default:
        return null;
    }
  }

  const resolvedTab: WorkspaceTabValue = initialTab && isWorkspaceTabValue(initialTab)
    ? initialTab
    : "Overview";

  return (
    <div className="space-y-6">
      <Link
        href={accountId ? `/${encodeURIComponent(accountId)}` : "/"}
        className="inline-flex text-sm font-medium text-primary hover:underline md:hidden"
      >
        ← 返回 Workspace Hub
      </Link>

      {!accountsHydrated && (
        <div className="rounded-xl border border-border/40 px-4 py-3 text-sm text-muted-foreground">
          正在同步帳號內容…
        </div>
      )}

      {loadState === "loading" && (
        <Card className="border border-border/50">
          <CardContent className="px-6 py-5 text-sm text-muted-foreground">
            Loading workspace detail…
          </CardContent>
        </Card>
      )}

      {loadState === "error" && (
        <Card className="border border-destructive/30">
          <CardContent className="px-6 py-5 text-sm text-destructive">
            無法載入工作區資料，請返回清單後重試。
          </CardContent>
        </Card>
      )}

      {loadState === "loaded" && !workspace && (
        <Card className="border border-border/50">
          <CardContent className="px-6 py-5 text-sm text-muted-foreground">
            找不到此工作區。
          </CardContent>
        </Card>
      )}

      {workspace && (
        <div className="space-y-6">
          {/* Mobile tab navigation – hidden on md+ where sidebar handles navigation */}
          <nav
            aria-label="Workspace tab navigation"
            className="md:hidden -mx-6 overflow-x-auto border-b border-border/50 px-4 pb-2"
          >
            <div className="flex min-w-max items-center gap-0.5">
              {MOBILE_TAB_GROUP_ORDER.flatMap((group, groupIndex) => {
                const tabs = getWorkspaceTabsByGroup(group);
                const links = tabs.map((tab) => {
                  const isActive = resolvedTab === tab;
                  return (
                    <Link
                      key={tab}
                      href={accountId
                        ? `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}?tab=${encodeURIComponent(tab)}`
                        : "/"}
                      aria-current={isActive ? "page" : undefined}
                      className={`whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {getWorkspaceTabLabel(tab)}
                    </Link>
                  );
                });
                if (groupIndex > 0) {
                  return [
                    <div
                      key={`sep-${group}`}
                      aria-hidden="true"
                      className="mx-1.5 h-3.5 w-px shrink-0 bg-border/60"
                    />,
                    ...links,
                  ];
                }
                return links;
              })}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <Badge variant="outline">{getWorkspaceTabStatus(resolvedTab)} {getWorkspaceTabLabel(resolvedTab)}</Badge>
          </div>
          {renderTabContent(resolvedTab)}
        </div>
      )}

      <WorkspaceSettingsDialog
        open={isEditWorkspaceOpen}
        onOpenChange={(open) => {
          setIsEditWorkspaceOpen(open);
          if (!open) {
            clearSaveError();
            if (workspace) setSettingsDraft(createSettingsDraft(workspace));
          }
        }}
        settingsDraft={settingsDraft}
        setSettingsDraft={setSettingsDraft}
        isSaving={isSavingWorkspace}
        saveError={saveError}
        onSubmit={(event) => void handleSave(event, settingsDraft)}
      />
    </div>
  );
}
````

## File: modules/workspace/interfaces/web/components/tabs/WorkspaceOverviewTab.tsx
````typescript
"use client";

import type { WorkspaceEntity } from "../../../api/contracts";
import { Badge } from "@ui-shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { Separator } from "@ui-shadcn/ui/separator";
import { describeGrant } from "../../view-models/workspace-grants";
import { WorkspaceOverviewSettingsTab } from "./WorkspaceOverviewSettingsTab";
import { WorkspaceOverviewSummaryCard } from "../cards/WorkspaceOverviewSummaryCard";
import { WorkspaceProductSpineCard } from "../cards/WorkspaceProductSpineCard";
import { WorkspaceQuickstartCard } from "../cards/WorkspaceQuickstartCard";
import { WorkspaceOverviewKnowledgePanels } from "./WorkspaceOverviewKnowledgePanels";

interface WorkspaceOverviewTabProps {
  readonly workspace: WorkspaceEntity;
  readonly activeWorkspaceId: string | null | undefined;
  readonly currentUserId?: string | null;
  readonly personnelEntries: Array<{ label: string; value: string | undefined }>;
  readonly addressLines: string[];
  readonly initialPanel?: string;
  readonly onEditClick: () => void;
  readonly onSetActiveWorkspace: () => void;
}

type WorkspaceOverviewSurface =
  | "home"
  | "knowledge-pages"
  | "knowledge-base-articles"
  | "knowledge-databases"
  | "source-libraries"
  | "governance"
  | "profile";

function resolveWorkspaceOverviewSurface(panel?: string): WorkspaceOverviewSurface {
  switch (panel) {
    case "knowledge-pages":
    case "knowledge-base-articles":
    case "knowledge-databases":
    case "source-libraries":
      return panel;
    case "governance":
    case "profile":
      return panel;
    default:
      return "home";
  }
}

export function WorkspaceOverviewTab({
  workspace,
  activeWorkspaceId,
  currentUserId,
  personnelEntries,
  addressLines,
  initialPanel,
  onEditClick,
  onSetActiveWorkspace,
}: WorkspaceOverviewTabProps) {
  if (initialPanel === "settings") {
    return (
      <WorkspaceOverviewSettingsTab
        workspace={workspace}
        personnelEntries={personnelEntries}
        addressLines={addressLines}
        onEditClick={onEditClick}
      />
    );
  }

  const activeSurface = resolveWorkspaceOverviewSurface(initialPanel);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/50 bg-card/70 p-3 shadow-sm">
        {activeSurface === "home" && (
          <div className="space-y-4">
            <WorkspaceOverviewSummaryCard
              workspace={workspace}
              activeWorkspaceId={activeWorkspaceId}
              onEditClick={onEditClick}
              onSetActiveWorkspace={onSetActiveWorkspace}
            />

            <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <WorkspaceProductSpineCard workspace={workspace} />

              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle>Capabilities</CardTitle>
                  <CardDescription>
                    Runtime features currently mounted on this workspace.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {workspace.capabilities.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No capability bindings have been added yet.
                    </p>
                  ) : (
                    workspace.capabilities.map((capability) => (
                      <div
                        key={capability.id}
                        className="rounded-xl border border-border/40 px-4 py-4"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">
                            {capability.name}
                          </p>
                          <Badge variant="outline">{capability.type}</Badge>
                          <Badge
                            variant={capability.status === "stable" ? "secondary" : "outline"}
                          >
                            {capability.status}
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {capability.description}
                        </p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {workspace.lifecycleState === "preparatory" && workspace.capabilities.length === 0 && (
              <WorkspaceQuickstartCard workspaceId={workspace.id} />
            )}
          </div>
        )}

        <WorkspaceOverviewKnowledgePanels
          workspace={workspace}
          currentUserId={currentUserId}
          activeSurface={activeSurface}
        />

        {activeSurface === "governance" && (
          <div className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-2">
              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle>Access Model</CardTitle>
                  <CardDescription>
                    Team scopes and direct grants applied to this workspace.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Team access</p>
                    {workspace.teamIds.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No team access assigned.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {workspace.teamIds.map((teamId) => (
                          <Badge key={teamId} variant="secondary">
                            {teamId}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Direct grants</p>
                    {workspace.grants.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No direct grants recorded.</p>
                    ) : (
                      workspace.grants.map((grant, index) => (
                        <div
                          key={`grant-${grant.role}-${grant.teamId ?? "none"}-${grant.userId ?? "none"}-${grant.protocol ?? "none"}-${index}`}
                          className="rounded-xl border border-border/40 px-4 py-3"
                        >
                          <p className="text-sm font-medium text-foreground">
                            {describeGrant(grant)}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Role: {grant.role}
                            {grant.teamId ? ` · Team: ${grant.teamId}` : ""}
                            {grant.userId ? ` · User: ${grant.userId}` : ""}
                            {grant.protocol ? ` · Protocol: ${grant.protocol}` : ""}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle>Locations</CardTitle>
                  <CardDescription>
                    Physical or logical locations linked to the workspace.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {workspace.locations == null || workspace.locations.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No locations have been configured yet.
                    </p>
                  ) : (
                    workspace.locations.map((location) => (
                      <div
                        key={location.locationId}
                        className="rounded-xl border border-border/40 px-4 py-4"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">
                            {location.label}
                          </p>
                          <Badge variant="outline">{location.locationId}</Badge>
                        </div>
                        {location.description && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {location.description}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-muted-foreground">
                          Capacity: {location.capacity ?? "—"}
                        </p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeSurface === "profile" && (
          <div className="space-y-4">
            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle>Workspace Profile</CardTitle>
                <CardDescription>
                  Operational contacts and registered workspace address.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Personnel</p>
                  {personnelEntries.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No personnel roles assigned.
                    </p>
                  ) : (
                    personnelEntries.map((entry) => (
                      <div
                        key={entry.label}
                        className="flex items-center justify-between rounded-xl border border-border/40 px-4 py-3 text-sm"
                      >
                        <span className="text-muted-foreground">{entry.label}</span>
                        <span className="font-medium text-foreground">{entry.value}</span>
                      </div>
                    ))
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Address</p>
                  {addressLines.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No address information has been provided.
                    </p>
                  ) : (
                    <div className="rounded-xl border border-border/40 px-4 py-4 text-sm text-muted-foreground">
                      {addressLines.map((line, index) => (
                        <p key={`${line}-${index}`}>{line}</p>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
````

## File: modules/workspace/interfaces/web/components/navigation/workspace-quick-access.tsx
````typescript
import { BookOpen, Brain, Database, FileText, FolderOpen, Home, Library, MessageSquare, Notebook, Shield, User, Users } from "lucide-react";
import type { ReactNode } from "react";

const NON_ACCOUNT_WORKSPACE_TOP_LEVEL_ROUTES = new Set([
  "workspace",
  "workspace-feed",
  "knowledge",
  "knowledge-base",
  "knowledge-database",
  "source",
  "notebook",
  "ai-chat",
  "organization",
  "settings",
  "dashboard",
  "dev-tools",
]);

function isWorkspaceScopedPath(pathname: string) {
  if (pathname.startsWith("/workspace/")) {
    return true;
  }

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length < 2) {
    return false;
  }

  return !NON_ACCOUNT_WORKSPACE_TOP_LEVEL_ROUTES.has(segments[0]);
}

export interface WorkspaceQuickAccessMatcherOptions {
  panel: string | null;
  tab: string | null;
}

export interface WorkspaceQuickAccessItem {
  href: string;
  label: string;
  icon: ReactNode;
  isActive?: (pathname: string, options?: WorkspaceQuickAccessMatcherOptions) => boolean;
}

const WORKSPACE_QUICK_ACCESS_TEMPLATES: readonly WorkspaceQuickAccessItem[] = [
  {
    href: "/workspace/{workspaceId}?tab=Overview",
    label: "首頁",
    icon: <Home className="size-3.5" />,
    isActive: (pathname: string, options) =>
      isWorkspaceScopedPath(pathname) &&
      (options?.tab == null || options.tab === "Overview") &&
      options?.panel == null,
  },
  {
    href: "/workspace/{workspaceId}?tab=Overview&panel=knowledge-pages",
    label: "知識頁面",
    icon: <FileText className="size-3.5" />,
    isActive: (pathname: string, options) =>
      isWorkspaceScopedPath(pathname) && options?.tab === "Overview" && options?.panel === "knowledge-pages",
  },
  {
    href: "/workspace/{workspaceId}?tab=Overview&panel=knowledge-base-articles",
    label: "文章",
    icon: <BookOpen className="size-3.5" />,
    isActive: (pathname: string, options) =>
      isWorkspaceScopedPath(pathname) && options?.tab === "Overview" && options?.panel === "knowledge-base-articles",
  },
  {
    href: "/workspace/{workspaceId}?tab=Files",
    label: "檔案",
    icon: <FolderOpen className="size-3.5" />,
    isActive: (pathname: string, options) =>
      isWorkspaceScopedPath(pathname) && options?.tab === "Files",
  },
  {
    href: "/workspace/{workspaceId}?tab=Members",
    label: "成員",
    icon: <Users className="size-3.5" />,
    isActive: (pathname: string, options) =>
      isWorkspaceScopedPath(pathname) && options?.tab === "Members",
  },
  {
    href: "/workspace/{workspaceId}?tab=Knowledge",
    label: "知識庫",
    icon: <Notebook className="size-3.5" />,
    isActive: (pathname: string, options) =>
      isWorkspaceScopedPath(pathname) && options?.tab === "Knowledge",
  },
  {
    href: "/workspace/{workspaceId}?tab=Notebook",
    label: "RAG 查詢",
    icon: <Brain className="size-3.5" />,
    isActive: (pathname: string, options) =>
      isWorkspaceScopedPath(pathname) && options?.tab === "Notebook",
  },
  {
    href: "/workspace/{workspaceId}?tab=AiChat",
    label: "AI 對話",
    icon: <MessageSquare className="size-3.5" />,
    isActive: (pathname: string, options) =>
      isWorkspaceScopedPath(pathname) && options?.tab === "AiChat",
  },
  {
    href: "/workspace/{workspaceId}?tab=Overview&panel=knowledge-databases",
    label: "資料庫",
    icon: <Database className="size-3.5" />,
    isActive: (pathname: string, options) =>
      isWorkspaceScopedPath(pathname) && options?.tab === "Overview" && options?.panel === "knowledge-databases",
  },
  {
    href: "/workspace/{workspaceId}?tab=Overview&panel=source-libraries",
    label: "來源庫",
    icon: <Library className="size-3.5" />,
    isActive: (pathname: string, options) =>
      isWorkspaceScopedPath(pathname) && options?.tab === "Overview" && options?.panel === "source-libraries",
  },
  {
    href: "/workspace/{workspaceId}?tab=Overview&panel=governance",
    label: "治理",
    icon: <Shield className="size-3.5" />,
    isActive: (pathname: string, options) =>
      isWorkspaceScopedPath(pathname) && options?.tab === "Overview" && options?.panel === "governance",
  },
  {
    href: "/workspace/{workspaceId}?tab=Overview&panel=profile",
    label: "工作區資料",
    icon: <User className="size-3.5" />,
    isActive: (pathname: string, options) =>
      isWorkspaceScopedPath(pathname) && options?.tab === "Overview" && options?.panel === "profile",
  },
];

export function buildWorkspaceQuickAccessItems(
  workspaceId: string,
  accountId?: string | null,
): WorkspaceQuickAccessItem[] {
  const encodedWorkspaceId = encodeURIComponent(workspaceId);
  const encodedAccountId = accountId ? encodeURIComponent(accountId) : "";
  const workspaceBaseHref = accountId
    ? `/${encodedAccountId}/${encodedWorkspaceId}`
    : "/";

  return WORKSPACE_QUICK_ACCESS_TEMPLATES.map((item) => ({
    ...item,
    href: item.href
      .replaceAll("/workspace/{workspaceId}", workspaceBaseHref)
      .replaceAll("{workspaceId}", encodedWorkspaceId),
  }));
}
````

## File: modules/workspace/interfaces/web/navigation/workspace-context-links.ts
````typescript
export interface WorkspaceNavigationContext {
  readonly accountId: string | null;
  readonly workspaceId: string | null;
}

const NON_ACCOUNT_WORKSPACE_TOP_LEVEL_ROUTES = new Set([
  "workspace",
  "workspace-feed",
  "knowledge",
  "knowledge-base",
  "knowledge-database",
  "source",
  "notebook",
  "ai-chat",
  "organization",
  "settings",
  "dashboard",
  "dev-tools",
]);

export const WORKSPACE_OVERVIEW_PANELS = [
  "knowledge-pages",
  "knowledge-base-articles",
  "knowledge-databases",
  "source-libraries",
  "settings",
] as const;

export type WorkspaceOverviewPanel = (typeof WORKSPACE_OVERVIEW_PANELS)[number];

function normalizeWorkspaceToolPath(pathname: string): string {
  const [pathOnly] = pathname.split("?");
  const segments = pathOnly.split("/").filter(Boolean);

  if (segments.length === 0) {
    return "/";
  }

  const [firstSegment, secondSegment, ...restSegments] = segments;

  if (NON_ACCOUNT_WORKSPACE_TOP_LEVEL_ROUTES.has(firstSegment)) {
    return pathOnly;
  }

  if (!secondSegment) {
    return "/workspace";
  }

  if (["organization", "settings", "dev-tools"].includes(secondSegment)) {
    return `/${[secondSegment, ...restSegments].join("/")}`;
  }

  if (restSegments.length === 0) {
    return "/workspace";
  }

  return `/${restSegments.join("/")}`;
}

function tryGetAccountIdFromPath(pathname: string): string | null {
  const [firstSegment] = pathname.split("/").filter(Boolean);
  if (!firstSegment) {
    return null;
  }
  if (NON_ACCOUNT_WORKSPACE_TOP_LEVEL_ROUTES.has(firstSegment)) {
    return null;
  }
  return decodeURIComponent(firstSegment);
}

function buildWorkspaceBaseHref(workspaceId: string, accountId?: string | null): string {
  const encodedWorkspaceId = encodeURIComponent(workspaceId);
  if (accountId) {
    return `/${encodeURIComponent(accountId)}/${encodedWorkspaceId}`;
  }
  return "/";
}

export function buildWorkspaceOverviewPanelHref(
  workspaceId: string,
  panel?: WorkspaceOverviewPanel,
  accountId?: string | null,
): string {
  const baseHref = buildWorkspaceBaseHref(workspaceId, accountId);
  if (!panel) {
    return `${baseHref}?tab=Overview`;
  }
  return `${baseHref}?tab=Overview&panel=${encodeURIComponent(panel)}`;
}

export function supportsWorkspaceSearchContext(pathname: string): boolean {
  const normalizedPathname = normalizeWorkspaceToolPath(pathname);
  return (
    normalizedPathname.startsWith("/knowledge") ||
    normalizedPathname.startsWith("/knowledge-base") ||
    normalizedPathname.startsWith("/knowledge-database") ||
    normalizedPathname.startsWith("/source") ||
    normalizedPathname.startsWith("/notebook")
  );
}

export function buildWorkspaceContextHref(pathname: string, workspaceId: string): string {
  const accountId = tryGetAccountIdFromPath(pathname);
  const normalizedPathname = normalizeWorkspaceToolPath(pathname);

  if (normalizedPathname.startsWith("/knowledge-base")) {
    return buildWorkspaceOverviewPanelHref(workspaceId, "knowledge-base-articles", accountId);
  }

  if (normalizedPathname.startsWith("/knowledge-database")) {
    return buildWorkspaceOverviewPanelHref(workspaceId, "knowledge-databases", accountId);
  }

  if (normalizedPathname.startsWith("/knowledge")) {
    return buildWorkspaceOverviewPanelHref(workspaceId, "knowledge-pages", accountId);
  }

  if (normalizedPathname.startsWith("/source/libraries")) {
    return buildWorkspaceOverviewPanelHref(workspaceId, "source-libraries", accountId);
  }

  if (normalizedPathname.startsWith("/source/documents")) {
    return `${buildWorkspaceBaseHref(workspaceId, accountId)}?tab=Files`;
  }

  return buildWorkspaceBaseHref(workspaceId, accountId);
}

export function appendWorkspaceContextQuery(
  href: string,
  context: WorkspaceNavigationContext,
): string {
  const { accountId, workspaceId } = context;

  if (!accountId && !workspaceId) {
    return href;
  }

  const [path, search = ""] = href.split("?");
  const params = new URLSearchParams(search);

  if (accountId) {
    params.set("accountId", accountId);
  }

  if (workspaceId) {
    params.set("workspaceId", workspaceId);
  }

  const query = params.toString();
  return query.length > 0 ? `${path}?${query}` : path;
}
````

## File: modules/workspace/interfaces/web/components/tabs/WorkspaceOverviewKnowledgePanels.tsx
````typescript
"use client";

import { KnowledgeBaseArticlesPanel, KnowledgeDatabasesPanel, KnowledgePagesPanel } from "@/modules/notion/api";
import { LibrariesPanel, LibraryTablePanel } from "@/modules/notebooklm/api";
import type { WorkspaceEntity } from "../../../api/contracts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";

interface WorkspaceOverviewKnowledgePanelsProps {
  readonly workspace: WorkspaceEntity;
  readonly currentUserId?: string | null;
  readonly activeSurface: string;
}

export function WorkspaceOverviewKnowledgePanels({
  workspace,
  currentUserId,
  activeSurface,
}: WorkspaceOverviewKnowledgePanelsProps) {
  return (
    <>
      {activeSurface === "knowledge-pages" && (
        <div className="space-y-4">
          <Card className="border border-border/50">
            <CardHeader>
              <CardTitle>Knowledge Pages</CardTitle>
              <CardDescription>
                Workspace orchestration surface for notion knowledge page tree and page entry flow.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <KnowledgePagesPanel
                accountId={workspace.accountId}
                workspaceId={workspace.id}
                currentUserId={currentUserId}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {activeSurface === "knowledge-base-articles" && (
        <div className="space-y-4">
          <Card className="border border-border/50">
            <CardHeader>
              <CardTitle>Knowledge Base Articles</CardTitle>
              <CardDescription>
                Workspace orchestration surface for notion authoring article lifecycle and categorization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <KnowledgeBaseArticlesPanel
                accountId={workspace.accountId}
                workspaceId={workspace.id}
                currentUserId={currentUserId}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {activeSurface === "knowledge-databases" && (
        <div className="space-y-4">
          <Card className="border border-border/50">
            <CardHeader>
              <CardTitle>Knowledge Databases</CardTitle>
              <CardDescription>
                Workspace orchestration surface for notion structured database views.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <KnowledgeDatabasesPanel
                accountId={workspace.accountId}
                workspaceId={workspace.id}
                currentUserId={currentUserId}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {activeSurface === "source-libraries" && (
        <div className="space-y-4">
          <Card className="border border-border/50">
            <CardHeader>
              <CardTitle>Source Libraries</CardTitle>
              <CardDescription>
                Workspace orchestration surface for notebooklm source libraries.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <LibraryTablePanel accountId={workspace.accountId} workspaceId={workspace.id} />
              <LibrariesPanel accountId={workspace.accountId} workspaceId={workspace.id} />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
````