---
title: Constructor Injection for Dependencies
impact: MEDIUM
impactDescription: Enables testability and loose coupling
tags: patterns, dependency-injection, constructor, testability
---

## Constructor Injection for Dependencies

**Impact: MEDIUM**

Use constructor injection or function parameter injection for dependencies. This makes dependencies explicit, testable, and swappable.

**Incorrect (hidden dependency on global singleton):**

```typescript
// modules/wiki/application/use-cases/create-wiki-document.ts
import { WikiDocumentFirebaseRepository } from "../../infrastructure/repositories/WikiDocumentRepository";

const repo = new WikiDocumentFirebaseRepository();    // ❌ Hidden global, hard to test

export async function createWikiDocument(input: CreateInput) {
  return repo.save(WikiDocument.create(input));
}
```

**Correct (dependency as parameter):**

```typescript
// modules/wiki/application/use-cases/create-wiki-document.ts
import type { IWikiDocumentRepository } from "../../domain/repositories/iwiki-document.repository";

export async function createWikiDocument(
  input: CreateInput,
  deps: { wikiDocRepo: IWikiDocumentRepository },
): Promise<CommandResult<WikiDocument>> {
  const doc = WikiDocument.create(input);
  await deps.wikiDocRepo.save(doc);
  return { success: true, data: doc };
}
```

**For class-based use cases:**

```typescript
export class UploadInitFileUseCase {
  constructor(
    private readonly fileRepo: FileRepository,
    private readonly actorContext: ActorContextPort,
  ) {}

  async execute(input: UploadInitInput): Promise<CommandResult<File>> {
    const actor = await this.actorContext.resolve();
    // ...
  }
}
```

**Guidelines:**
- Prefer interface types for injected dependencies
- Wire dependencies at the app root or module `api/` composition entrypoint (for example `modules/<target-domain>/api/index.ts`), not inside the use case
- For simple modules, function parameter injection (`deps: { repo }`) is sufficient
- For complex modules (e.g., file with hexagonal ports), use class constructors
