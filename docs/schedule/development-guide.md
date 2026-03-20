---
title: Schedule module development guide
description: Developer guide for contributing to the schedule module — module structure, adding use cases, repository patterns, common pitfalls, and testing.
---

# Schedule 模組開發指南

> **文件版本**：v1.1.0
> **最後更新**：2026-03-20
> **目標讀者**：參與 `modules/schedule` 實作的後端/全端工程師

---

## 前置閱讀

在開始任何排程相關功能前，請先閱讀：

1. **架構規範**：`docs/architecture/schedule.md`
2. **開發契約**：`docs/reference/development-contracts/schedule-contract.md`
3. **整體架構指南**：`ARCHITECTURE.md`

---

## 1. 模組結構

```
modules/schedule/
├── domain/
│   ├── entities/              # ScheduleRequest, ScheduleItem, ScheduleEventType
│   ├── repositories/          # Port interfaces（ScheduleRequestRepository 等）
│   ├── services/              # derive-schedule-items.ts
│   └── mddd/
│       ├── entities/          # Request, Task, Match, Assignment, Schedule
│       ├── value-objects/     # Projection, WorkflowStatuses, Requirements
│       ├── services/          # matching-engine.ts, scheduling-engine.ts
│       ├── events/            # ScheduleDomainEvents.ts
│       ├── repositories/      # MDDD port interfaces
│       └── utils/             # create-id.ts
├── application/
│   └── use-cases/
│       ├── submit-schedule-request.use-case.ts
│       ├── cancel-schedule-request.use-case.ts
│       ├── list-schedule-event-types.use-case.ts
│       ├── list-workspace-schedule-items.use-case.ts
│       └── mddd/
│           ├── run-schedule-mddd-flow.use-case.ts
│           ├── cancel-schedule.use-case.ts
│           ├── reject-schedule-assignment.use-case.ts
│           └── reject-schedule-request.use-case.ts
├── infrastructure/
│   ├── firebase/              # Firestore 介接（Repository 實作）
│   │   ├── FirebaseScheduleRequestRepository.ts
│   │   ├── FirebaseMdddProjectionRepository.ts
│   │   └── Firebase*Repository.ts（其餘 MDDD 集合）
│   └── default/               # 預設/靜態資料實作
├── interfaces/
│   ├── _actions/              # Next.js Server Actions（"use server"）
│   │   ├── schedule-request.actions.ts
│   │   ├── schedule-mddd.actions.ts
│   │   └── schedule.actions.ts
│   ├── queries/               # 查詢函式（可從 Client Component 呼叫）
│   │   ├── schedule-mddd.queries.ts
│   │   └── schedule.queries.ts
│   ├── components/            # React Client Components
│   │   └── WorkspaceScheduleTab.tsx
│   └── schedule-ui.constants.ts
├── index.ts                   # 模組公開 API
└── README.md                  # 模組說明與遷移狀態
```

### 依賴方向（嚴格）

```
interfaces (actions/queries/components)
    ↓
application (use-cases)
    ↓
domain (entities/ports/services)
    ↑
infrastructure (Firestore adapters)
```

**絕對禁止**：
- `domain/` 引用 `infrastructure/` 或 Firebase SDK
- `application/` 引用 React 或 Next.js
- `infrastructure/` 直接被 UI 呼叫（必須透過 application/interfaces）

---

## 2. 新增 Use Case 步驟

### 2.1 定義 Domain Port（如有需要）

在 `domain/repositories/` 或 `domain/mddd/repositories/` 新增 interface：

```typescript
// domain/repositories/ScheduleCancellationRepository.ts
export interface ScheduleCancellationRepository {
  cancel(requestId: string, reason: string): Promise<void>;
}
```

### 2.2 實作 Use Case

```typescript
// application/use-cases/cancel-schedule-request.use-case.ts
import { commandFailureFrom, commandSuccess, type CommandResult } from "@/shared/types";
import type { ScheduleCancellationRepository } from "../../domain/repositories/ScheduleCancellationRepository";

export class CancelScheduleRequestUseCase {
  constructor(private readonly repo: ScheduleCancellationRepository) {}

  async execute(requestId: string, actorAccountId: string): Promise<CommandResult> {
    if (!requestId.trim()) {
      return commandFailureFrom("SCHEDULE_REQUEST_ID_REQUIRED", "Request ID is required.");
    }
    // ... 業務邏輯
    await this.repo.cancel(requestId, "cancelled_by_requester");
    return commandSuccess(requestId, Date.now());
  }
}
```

### 2.3 實作 Firebase Adapter

```typescript
// infrastructure/firebase/FirebaseScheduleCancellationRepository.ts
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { firebaseClientApp } from "@/infrastructure/firebase/client";
import type { ScheduleCancellationRepository } from "../../domain/repositories/ScheduleCancellationRepository";

export class FirebaseScheduleCancellationRepository implements ScheduleCancellationRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async cancel(requestId: string, reason: string): Promise<void> {
    await updateDoc(doc(this.db, "scheduleRequests", requestId), {
      status: "cancelled",
      cancellationReason: reason,
      updatedAtISO: new Date().toISOString(),
    });
  }
}
```

### 2.4 串接 Server Action

```typescript
// interfaces/_actions/schedule-request.actions.ts（新增函式）
"use server";

import { CancelScheduleRequestUseCase } from "../../application/use-cases/cancel-schedule-request.use-case";
import { FirebaseScheduleCancellationRepository } from "../../infrastructure/firebase/FirebaseScheduleCancellationRepository";

const cancelRepo = new FirebaseScheduleCancellationRepository();
const cancelUseCase = new CancelScheduleRequestUseCase(cancelRepo);

export async function cancelScheduleRequest(
  requestId: string,
  actorAccountId: string,
): Promise<CommandResult> {
  // ...
}
```

---

## 3. Projection 寫入規範

Projection 集合（`scheduleMdddFlowProjections`）**只能**透過 `FirebaseMdddProjectionRepository.project(events)` 更新：

```typescript
// 正確：透過 domain event 驅動
await projectionRepository.project([
  {
    type: "RequestCreated",
    requestId: result.aggregateId,
    workspaceId: input.workspaceId,
    organizationId: input.organizationId,
    occurredAtISO: new Date().toISOString(),
  },
]);

// 錯誤：直接寫入 projection 欄位（嚴格禁止）
// await setDoc(doc(db, "scheduleMdddFlowProjections", id), { requestStatus: "submitted" });
```

`project()` 內部使用 `applyEvent()` 做事件折疊（event folding），確保 projection 狀態機正確轉換。

---

## 4. 常見陷阱（已修復）

### 陷阱 1：空 `requiredSkills` 導致靜默失敗

**問題**：`normalizeSkillRequirements([])` 回傳 `SCHEDULE_REQUIRED_SKILLS_REQUIRED` 錯誤，Server Action 回傳失敗但 UI 無錯誤提示，Firestore 沒有任何寫入。

**修復**：`SubmitScheduleRequestUseCase` 現在接受空陣列；完整 MDDD flow 仍獨立驗證技能需求。

```typescript
// ✅ 修復後（allow empty for simple requests）
const requiredSkills =
  input.requiredSkills.length === 0
    ? { success: true as const, value: [] as SkillRequirement[] }
    : normalizeSkillRequirements(input.requiredSkills);
```

### 陷阱 2：寫入集合 ≠ 讀取集合

**問題**：`submitScheduleRequest` 寫入 `scheduleRequests`，但 UI 查詢 `scheduleMdddFlowProjections`。兩個完全獨立的 Firestore 集合，導致提交成功但列表永遠空白。

**修復**：提交成功後立即寫入初始 `RequestCreated` projection：

```typescript
// schedule-request.actions.ts
if (result.success) {
  await projectionRepository.project([{
    type: "RequestCreated",
    requestId: result.aggregateId,
    workspaceId: input.workspaceId,
    organizationId: input.organizationId,
    occurredAtISO: new Date().toISOString(),
  }]);
}
```

### 目前已實作的 workspace 請求取消

`WorkspaceScheduleTab` 的取消按鈕現在已串接 `cancelScheduleRequest()`：

- use case：`CancelScheduleRequestUseCase`
- repository：`FirebaseScheduleRequestRepository.findById/save`
- projection event：`RequestCancelled`

這個切片刻意維持在目前模組邊界內：只處理**工作區提交者取消自己的請求**，不延伸到組織端審核或完整 MDDD request review flow。

### 陷阱 3：Server Actions 使用 Client SDK

`FirebaseScheduleRequestRepository` 使用 `firebaseClientApp`（Client SDK）。**Server Actions 是 Next.js Server-side 程式碼**，但 `firebaseClientApp` 在 server context 可能未初始化或行為不一致。

**建議**：長期應遷移至 Firebase Admin SDK（`firebaseAdminApp`）以確保 server-side 一致性。

---

## 5. 新增 Domain Event

若需新增事件類型，步驟如下：

### 5.1 在 `ScheduleDomainEvents.ts` 新增 interface 和 union

```typescript
// domain/mddd/events/ScheduleDomainEvents.ts
export interface RequestCancelledEvent {
  readonly type: "RequestCancelled";
  readonly requestId: string;
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly reason: string;
  readonly occurredAtISO: string;
}

export type ScheduleDomainEvent =
  | RequestCreatedEvent
  // ... 現有 events
  | RequestCancelledEvent;  // ← 新增
```

### 5.2 在 `FirebaseMdddProjectionRepository.applyEvent()` 新增 case

```typescript
// infrastructure/firebase/FirebaseMdddProjectionRepository.ts
case "RequestCancelled":
  return {
    ...base,
    workspaceId: event.workspaceId,
    organizationId: event.organizationId,
    requestStatus: "cancelled",
    lastReason: event.reason,
    eventTypes: appendEventType(base.eventTypes, event.type),
    updatedAtISO: event.occurredAtISO,
  };
```

TypeScript exhaustive check（`assertUnreachableEvent`）會在編譯期提醒遺漏的 case。

---

## 6. 驗證指令

```bash
# Lint 所有變更檔案
npm run lint

# 完整建置
npm run build

# 針對特定檔案 TypeScript 檢查
npx tsc --noEmit --skipLibCheck
```

---

## 7. 測試策略

目前無自動化測試，建議新增時遵循：

| 層級 | 測試範圍 | 建議工具 |
|------|----------|----------|
| Domain | Entity / Value Object 不變式 | Vitest / Jest |
| Application | Use Case 輸入驗證與狀態轉換 | Vitest + mock repository |
| Infrastructure | Firestore 讀寫正確性 | Firestore Emulator + Integration test |
| Interface | Server Action 回傳格式 | Vitest + mock use case |

Use Case 測試範本：

```typescript
describe("SubmitScheduleRequestUseCase", () => {
  it("should allow empty requiredSkills", async () => {
    const mockRepo = { submit: vi.fn().mockResolvedValue({ id: "req-1" }) };
    const useCase = new SubmitScheduleRequestUseCase(mockRepo);
    const result = await useCase.execute({
      workspaceId: "ws-1",
      organizationId: "org-1",
      requiredSkills: [],
      actorAccountId: "user-1",
      notes: "需要一位工程師支援",
    });
    expect(result.success).toBe(true);
  });
});
```

---

## 8. 參考資源

| 文件 | 說明 |
|------|------|
| `docs/architecture/schedule.md` | 架構設計規範（本輪新增） |
| `docs/reference/development-contracts/schedule-contract.md` | 開發契約與驗收條件 |
| `modules/schedule/README.md` | 模組邊界與遷移狀態 |
| `ARCHITECTURE.md` | 整體 MDDD 架構指南 |
| Postiz `apps/orchestrator/src/workflows/post-workflows/` | 排程工作流參考實作 |

---

## 9. 建議實作順序（先補缺口，再擴 UI）

這份順序是針對**目前已上線切片只有 submit/cancel + projection list** 的現況而寫。新增功能請優先補足缺口，先把 domain/application/projection 契約補齊，再擴充 UI，這樣才能維持 MDDD 邊界並避免畫面先行後造成技術債。

### Phase 1 — 補齊 Request review flow

- 新增組織端審核 use cases：review / accept / reject / close
- 補齊 `RequestAggregate` 狀態轉換與對應 events
- 讓 projection 可顯示 review state、last reason、review timestamps

**Definition of Done**

- 組織端可正式改變 request 狀態，不再只有 `submitted` 聚合清單
- workspace 與 organization 都能從 projection 看到 review 結果
- 無任何 UI 直接寫 projection 集合

### Phase 2 — 建立 Task decomposition

- 定義 Request → Task 的 application orchestration
- 實作 `TaskRepository`、`TaskAggregate`、task events
- 補齊 projection 的 `taskId` / `taskStatus`

**Definition of Done**

- 每個 accepted request 都能被拆成可追蹤 task
- task 狀態轉換不依賴 UI 自行拼接布林旗標
- task lifecycle 可由 projection 被讀取

### Phase 3 — 落地 Match shortlist

- 實作 matching engine 的 eligibility filter、availability pre-check、score breakdown
- 建立 shortlist query / projection contract
- 在 organization 端提供 shortlist 檢視能力

**Definition of Done**

- match 結果可重跑且規則明確
- shortlist 來源可追蹤，不是手動挑人後再回填狀態
- disqualification / penalty reason 可被審核

### Phase 4 — 補齊 Assignment decision flow

- 新增 offer / accept / reject / expire / cancel
- 定義唯一 active assignment invariant
- 補齊 assignment queue / assignee-facing read model

**Definition of Done**

- task 不會在沒有 accepted assignment 的情況下進入 scheduled
- assignment 決策有 actor、time、reason
- organization 與 assignee 看到的是同一條決策流

### Phase 5 — 補齊 Schedule allocation

- accepted assignment 產生 `ScheduleAggregate`
- 實作 conflict detection、overload checks、reschedule trail
- 月曆讀模型改由正式 scheduling flow 支撐

**Definition of Done**

- 月曆上的排程可回溯到 assignment 與 task
- 衝突與超載會阻止確認，而不是事後人工修補
- reschedule / cancel 有明確事件軌跡

### Phase 6 — 補強 integration / reliability

- 將 projection bootstrap 與後續事件發佈做成冪等且可恢復
- 定義 notifications / triggers / workflow ownership
- 完成 audit trail 與故障補償策略

**Definition of Done**

- 主寫入成功但 projection 缺失時，可重播或補償
- 通知與 workflow 的責任邊界清楚
- 文件與實作對齊，不再只存在聊天室描述

---

## 10. 實作時的禁止事項

- **不要先補大面積 UI 再回頭想 domain**：先補 contract，再補畫面。
- **不要讓 interfaces 直接吸 Firebase 資料形狀當 domain 狀態**：需要 repository + mapper 邊界。
- **不要把 projection 當 aggregate**：projection 是讀模型，不是決策來源。
- **不要用零散布林旗標代替狀態機**：review / assignment / schedule 都要走明確 status 與 event。
- **不要把「目前只有 MVP」寫成模糊敘述**：缺口要記錄在文件並隨實作更新。
