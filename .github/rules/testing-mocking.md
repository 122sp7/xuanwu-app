---
title: Mocking Services and Repositories
impact: MEDIUM-HIGH
impactDescription: Enables isolated, fast, and deterministic tests
tags: testing, mocking, repositories, isolation
---

## Mocking Services and Repositories

**Impact: MEDIUM-HIGH**

The repository pattern makes mocking straightforward — mock the interface, not the implementation. Use case tests should never touch Firebase or any external system.

**Incorrect (testing with real Firebase):**

```typescript
// ❌ Test depends on Firebase — slow, flaky, requires network
import { db } from "@integration-firebase";

test("createTask stores in Firestore", async () => {
  await createTask({ title: "Test", workspaceId: "ws-1" });
  const snap = await getDoc(doc(db, "tasks", "..."));       // ❌ Real database call
  expect(snap.exists()).toBe(true);
});
```

**Correct (mock the repository interface):**

```typescript
// ✅ Fast, deterministic, no external dependencies
const mockTaskRepo: TaskRepository = {
  findById: vi.fn().mockResolvedValue(null),
  findByWorkspace: vi.fn().mockResolvedValue([]),
  save: vi.fn().mockResolvedValue(undefined),
};

test("createTask returns success with valid input", async () => {
  const result = await createTask(
    { title: "Test", workspaceId: "ws-1" },
    { taskRepo: mockTaskRepo },
  );
  expect(result.success).toBe(true);
  expect(mockTaskRepo.save).toHaveBeenCalledOnce();
});

test("createTask returns error when title is empty", async () => {
  const result = await createTask(
    { title: "", workspaceId: "ws-1" },
    { taskRepo: mockTaskRepo },
  );
  expect(result.success).toBe(false);
  expect(result.error?.code).toBe("missing-title");
});
```

**Guidelines:**
- Mock at the repository interface boundary
- For domain services, test with real entities and mock only repositories
- For infrastructure tests, use the real implementation against a test environment
- Keep mocks minimal — don't over-mock or you'll test nothing
