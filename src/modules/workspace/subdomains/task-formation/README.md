# task-formation 子域

> 狀態：骨架建立，實作進行中（2026-04-18）

## 職責

從 Notion 知識頁面（`KnowledgeArtifact`）中，透過 AI 提取任務候選（`ExtractedTaskCandidate[]`），讓使用者審閱確認後，批次建立正式 `Task` 實體。

**這個子域擁有的：**

- `TaskFormationJob` aggregate（任務形成工作的生命週期）
- AI 提取結果的暫存與狀態（`candidates` 欄位）
- 使用者確認後的批次 Task 建立觸發

**這個子域不擁有的：**

- `KnowledgeArtifact`（屬於 `notion` context）
- `Task` 實體建立（觸發 `task` 子域的 `CreateTaskUseCase`）
- AI provider / model policy（屬於 `ai` context，由 `platform` 路由）

---

## 完整設計流程

```
用戶在 Notion 頁面選取 → 觸發 Server Action
        ↓
CreateTaskFormationJobUseCase  → Firestore（status: queued）
        ↓
ExtractTaskCandidatesUseCase   → TaskCandidateExtractorPort（Genkit Flow）
        ↓ (async, 更新 Job status: queued → running → succeeded/failed)
AI 提取 ExtractedTaskCandidate[]  → setCandidates() 存入 Job.candidates
        ↓
UI（TaskFormationPanel）        → XState machine（reviewing state）
        ↓ 使用者勾選 / 編輯候選任務
ConfirmCandidatesUseCase        → 呼叫 task.CreateTaskUseCase × N
        ↓
CompleteTaskFormationJobUseCase → Firestore（status: succeeded）
```

---

## 生命週期狀態

```
queued → running → succeeded
                 → partially_succeeded
                 → failed
queued → cancelled
```

---

## 現況檔案樹

```
task-formation/
├── README.md                         ← 本文件
├── AGENTS.md                          ← 開發守則
├── domain/
│   ├── index.ts
│   ├── entities/
│   │   └── TaskFormationJob.ts       ← Aggregate Root（⚠️ 需補 candidates 欄位）
│   ├── value-objects/
│   │   ├── TaskFormationJobStatus.ts ← ✅ queued/running/succeeded/partially_succeeded/failed/cancelled
│   │   └── TaskCandidate.ts         ← ✅ ExtractedTaskCandidate 型別定義
│   ├── repositories/
│   │   └── TaskFormationJobRepository.ts  ← ✅ Port 定義
│   └── events/
│       └── TaskFormationDomainEvent.ts    ← ⚠️ 僅 job-created，需補後續事件
├── application/
│   ├── index.ts
│   ├── dto/
│   │   └── TaskFormationDTO.ts           ← ✅ CreateTaskFormationJobSchema（Zod）
│   └── use-cases/
│       └── TaskFormationUseCases.ts      ← ⚠️ 僅 Create + Complete，缺 Extract + Confirm
├── adapters/
│   ├── index.ts
│   ├── inbound/
│   │   └── index.ts                      ← ❌ 空白（export {}）
│   │   ├── server-actions/               ← 待建：startExtraction + confirmCandidates
│   │   └── react/                        ← 待建：TaskFormationPanel（XState）
│   └── outbound/
│       ├── firestore/
│       │   └── FirestoreTaskFormationJobRepository.ts  ← ✅
│       └── genkit/                       ← ❌ 待建：extract-candidates.flow.ts
```

---

## 關鍵缺口（P0）

| # | 缺口 | 位置 |
|---|---|---|
| 1 | `TaskFormationJob` aggregate 不存 candidates | `domain/entities/TaskFormationJob.ts` |
| 2 | 無 AI 提取 Port 定義 | `domain/ports/TaskCandidateExtractorPort.ts`（待建）|
| 3 | 無 `candidates-extracted` domain event | `domain/events/TaskFormationDomainEvent.ts` |
| 4 | 無 `ExtractTaskCandidatesUseCase` | `application/use-cases/TaskFormationUseCases.ts` |
| 5 | 無 Genkit extraction flow adapter | `adapters/outbound/genkit/extract-candidates.flow.ts` |
| 6 | 無 `ConfirmCandidatesUseCase` | `application/use-cases/TaskFormationUseCases.ts` |
| 7 | inbound adapter 完全空白 | `adapters/inbound/` |

---

## 關鍵設計決策

### AI 提取：Genkit `defineFlow` + Zod `outputSchema`

```typescript
// adapters/outbound/genkit/extract-candidates.flow.ts
export const extractTaskCandidatesFlow = ai.defineFlow(
  {
    name: 'task-formation.extractCandidates',
    inputSchema: z.object({
      pageContent: z.string(),
      workspaceContext: z.string(),
    }),
    outputSchema: z.object({
      candidates: z.array(TaskCandidateSchema),
    }),
  },
  async ({ pageContent }) => { /* ... */ }
);
```

- 使用 `z.coerce.number()` 處理 AI 輸出 `confidence` 為字串的情況
- `outputSchema` 與 `generate output.schema` 雙重保護
- AI 結果在進入 use case 前必須通過 Zod `.parse()` 驗證

### UI 狀態：XState v5 `setup()` + `fromPromise`

```typescript
// application/machines/task-formation.machine.ts
export const taskFormationMachine = setup({
  types: {
    context: {} as {
      jobId: string | null;
      candidates: ExtractedTaskCandidate[];
      selectedIds: Set<number>;
      errorMessage: string | null;
    },
    events: {} as
      | { type: 'START'; pageIds: string[] }
      | { type: 'CANDIDATE_TOGGLED'; idx: number }
      | { type: 'CONFIRM_SELECTION' }
      | { type: 'CANCEL' },
    input: {} as { workspaceId: string },
  },
  actors: {
    extractCandidates: fromPromise<ExtractResult, ExtractInput>(
      async ({ input }) => { /* Server Action */ }
    ),
    confirmCandidates: fromPromise<ConfirmResult, ConfirmInput>(
      async ({ input }) => { /* Server Action */ }
    ),
  },
}).createMachine({
  /* idle → extracting → reviewing → confirming → done */
});
```

狀態轉換：

```
idle ──START──→ extracting ──onDone──→ reviewing ──CONFIRM──→ confirming ──onDone──→ done
               ──onError──→ failed               ──onError──→ reviewing（保留選擇）
reviewing ──CANCEL──→ idle
```

### Inbound：Next.js Server Actions + `useActionState`

```typescript
// adapters/inbound/server-actions/task-formation-actions.ts
'use server';
export async function startExtractionAction(
  prevState: ExtractionActionState,
  formData: FormData,
): Promise<ExtractionActionState> {
  const validated = StartExtractionSchema.safeParse({ ... });
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors };
  // ...
}
```

---

## Domain Events（discriminant 格式）

| Event type | 觸發時機 |
|---|---|
| `workspace.task-formation.job-created` | ✅ `CreateTaskFormationJobUseCase` 成功 |
| `workspace.task-formation.candidates-extracted` | ⚠️ 待補：AI 提取完成，candidates 已存入 Job |
| `workspace.task-formation.candidates-confirmed` | ⚠️ 待補：使用者確認選擇，Task 建立觸發 |
| `workspace.task-formation.job-failed` | ⚠️ 待補：任何不可回復錯誤 |

---

## 跨模組依賴

| 依賴方向 | 目標模組 | 用途 | 邊界 |
|---|---|---|---|
| 消費 `notion` | `src/modules/notion/index.ts` | 取得 KnowledgeArtifact 頁面內容 | published language token |
| 消費 `ai`（透過 platform） | `src/modules/platform/index.ts` | Genkit generation flow routing | Service API boundary |
| 觸發 `task` | `src/modules/workspace/subdomains/task/application/` | ConfirmCandidates 後批次建立 Task | use case 邊界 |

---

## 下一步待實作

| 優先 | 工作 | 位置 |
|---|---|---|
| P0 | 補 `TaskFormationJob.candidates` 欄位 + `setCandidates()` 方法 | `domain/entities/TaskFormationJob.ts` |
| P0 | 補 `TaskCandidateExtractorPort` 介面 | `domain/ports/TaskCandidateExtractorPort.ts`（新建）|
| P0 | 補 `candidates-extracted` / `candidates-confirmed` / `job-failed` domain events | `domain/events/TaskFormationDomainEvent.ts` |
| P1 | 建 `ExtractTaskCandidatesUseCase` | `application/use-cases/TaskFormationUseCases.ts` |
| P1 | 建 Genkit `extract-candidates.flow.ts` adapter | `adapters/outbound/genkit/` |
| P2 | 建 `ConfirmCandidatesUseCase` | `application/use-cases/TaskFormationUseCases.ts` |
| P2 | 建 XState `task-formation.machine.ts` | `application/machines/` |
| P3 | 建 Server Actions（start + confirm） | `adapters/inbound/server-actions/` |
| P3 | 建 `TaskFormationPanel` UI（XState `useMachine`） | `adapters/inbound/react/` |
