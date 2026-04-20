# ADR 0003 — ai `orchestration` 子域正式化

## Status

Proposed

## Date

2025-02-11

## Context

`docs/structure/domain/subdomains.md` 定義 ai baseline 的 `orchestration`：

> orchestration — 執行圖與多步驟 AI workflow 協調

目前 `ai/` module root 有一個 `AiFacade.ts`（或類似命名），承接跨 subdomain 的 AI 能力協調。問題：

1. **不是正式子域**：`AiFacade.ts` 在 module root，不在 `subdomains/orchestration/`，沒有完整的 domain/application 分層。
2. **Facade 反模式**：若 `AiFacade.ts` 只是轉發呼叫（pass-through），它是過度設計；若它有流程決策邏輯，它的業務規則沒有對應的 domain model。
3. **Genkit Flow 歸屬**：Genkit 的 multi-step flow（如 RAG → summarize → cite）應由 `orchestration` 子域定義 flow 合約，而非分散在各 adapter 或 use case。

ai module 的 baseline 預期：`orchestration` 負責「執行圖與多步驟 AI workflow 協調」，這是一個有明確業務邏輯的子域，需要正式的 domain 邊界。

## Decision

### 建立 `orchestration` 子域，替代 AiFacade 模式

```
src/modules/ai/subdomains/orchestration/
  README.md
  domain/
    entities/
      AiWorkflow.ts            # 多步驟 AI 工作流定義
    value-objects/
      WorkflowStep.ts          # 單一步驟（type、input schema、output schema）
      WorkflowStatus.ts        # pending / running / completed / failed
    events/
      AiWorkflowCompleted.ts
      AiWorkflowFailed.ts
    services/
      WorkflowPlanner.ts       # 依 input 決定執行哪些 step（純業務邏輯）
  application/
    use-cases/
      run-ai-workflow.use-case.ts     # 主工作流執行入口
    dtos/
      AiWorkflowInput.ts
      AiWorkflowOutput.ts
```

### AiFacade 處置方案

確認現有 `AiFacade.ts` 的內容性質後二擇一：

| 情況 | 處置 |
|---|---|
| 只是 re-export / pass-through | 刪除 AiFacade，讓消費端直接 import 對應 subdomain |
| 有流程決策邏輯 | 將邏輯遷移至 `orchestration/domain/services/WorkflowPlanner.ts` |

### Genkit Flow 合約

Genkit flow 定義（`packages/integration-ai/genkit.ts`）保持在 integration package，但 **flow 的執行步驟合約**（哪些步驟、什麼順序、失敗策略）在 `orchestration/domain/` 定義。infrastructure adapter 在 `ai/infrastructure/orchestration/` 實作 Genkit 呼叫。

## Consequences

**正面：** 多步驟 AI 工作流有明確的業務語言定義；Genkit 細節被隔離在 adapter 層。  
**負面：** 需要評估 AiFacade 現有邏輯量，決定遷移或刪除。  
**中性：** 若目前只有 1-2 個 Genkit flow，`orchestration` 子域可以從最小骨架開始，隨需求成長。

## References

- `docs/structure/domain/subdomains.md` — ai orchestration baseline
- `packages/integration-ai/genkit.ts` — 現有 Genkit 配置
- `src/modules/ai/` — AiFacade 現有位置（待確認）
- ADR ai/0002 — safety subdomain（orchestration 將呼叫 safety evaluator）
- ADR architecture/0002 — cross-runtime bridge（fn/ pipeline 不走 orchestration 子域）
