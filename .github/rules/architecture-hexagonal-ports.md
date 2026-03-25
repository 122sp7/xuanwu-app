---
title: Hexagonal Ports for Cross-Cutting Concerns
impact: HIGH
impactDescription: Enables testable, dependency-free domain logic for complex modules
tags: architecture, mddd, hexagonal, ports, adapters
---

## Hexagonal Ports for Cross-Cutting Concerns

**Impact: HIGH**

For modules with complex cross-cutting dependencies (permissions, tenant policies, actor context), use the hexagonal ports pattern. The domain layer defines **port interfaces** that describe what it needs; the infrastructure layer provides **adapters** that implement them.

**Reference implementation: `modules/asset/`**

```
modules/asset/
  domain/
    ports/
      ActorContextPort.ts           # Who is acting?
      WorkspaceGrantPort.ts         # What can they do in this workspace?
      OrganizationPolicyPort.ts     # What does the tenant allow?
    entities/
      RagDocument.ts
    repositories/
      RagDocumentRepository.ts
  application/
    use-cases/
      register-uploaded-rag-document.use-case.ts  # Orchestrates via ports
  infrastructure/
    firebase/
      FirebaseActorContextAdapter.ts
      FirebaseWorkspaceGrantAdapter.ts
```

**Incorrect (scattering permission checks in UI/router):**

```typescript
// app/(shell)/workspace/files/page.tsx
import { auth } from "@integration-firebase";
import { db } from "@integration-firebase";

export default async function FilesPage() {
  const user = await auth.currentUser;                           // ❌ Auth logic in page
  const org = await getDoc(doc(db, "organizations", orgId));     // ❌ Policy check in page
  if (!org.data().allowUploads) return <Forbidden />;            // ❌ Business rule in UI
}
```

**Correct (access decisions flow through use cases via ports):**

```typescript
// modules/asset/domain/ports/OrganizationPolicyPort.ts
export interface OrganizationPolicyPort {
  allowsFileUpload(organizationId: string): Promise<boolean>;
}

// modules/asset/application/use-cases/register-uploaded-rag-document.use-case.ts
export class RegisterUploadedRagDocumentUseCase {
  constructor(
    private readonly actorContext: ActorContextPort,
    private readonly orgPolicy: OrganizationPolicyPort,
    private readonly ragDocumentRepo: RagDocumentRepository,
  ) {}

  async execute(input: RegisterUploadedRagDocumentInput): Promise<CommandResult<RagDocumentRecord>> {
    const actor = await this.actorContext.resolve();
    const allowed = await this.orgPolicy.allowsFileUpload(actor.organizationId);
    if (!allowed) return { success: false, error: new DomainError("upload-forbidden") };
    // ... proceed
  }
}
```

**When to use ports:**
- The module has cross-cutting dependencies (auth, permissions, tenant policies)
- You need to test domain logic in isolation from external systems
- Multiple infrastructure implementations may exist (Firebase, in-memory, mock)

**When NOT needed:**
- Simple CRUD modules with a single repository
- Modules that only need standard repository interfaces
