# ADR 0002 — ai `safety` 子域建立

## Status

Proposed

## Date

2025-02-11

## Context

`docs/structure/domain/subdomains.md` 的 ai baseline 包含 `safety`：

> safety — 安全護欄、有害內容過濾與合規保護

目前 `ai/subdomains/` 沒有 `safety`。相關能力散落狀況：

1. **Genkit flow 層**：Genkit 提供 `dotprompt` 的 safety settings，但這是 provider 配置，非業務規則。
2. **無 SafetyGuardrail 型別**：`docs/structure/domain/ubiquitous-language.md` 定義的 `SafetyGuardrail` published language token 目前無對應實作。
3. **platform 可能混淆**：`platform/compliance` 子域負責法規執行，但 AI 輸出的有害內容過濾是 ai 自身的能力，不應委託 platform 判斷。

Genkit AI 安全機制分兩層：
- **Provider-level**：Google AI Safety Settings（在 Genkit model config 設定）
- **Application-level**：業務層的安全政策（如：哪些 prompt 類型被允許、哪些輸出需要後處理）

Application-level 安全規則屬於 **ai bounded context 的 domain 責任**，不是 infrastructure 配置。

## Decision

### 建立 `safety` 子域

```
src/modules/ai/subdomains/safety/
  README.md
  domain/
    value-objects/
      SafetyGuardrail.ts       # SafetyGuardrail published language token
      SafetyLevel.ts           # none / low / medium / high
      ContentPolicy.ts         # 允許/禁止的內容類型規則
    services/
      SafetyEvaluator.ts       # 評估輸出是否符合安全政策（pure domain logic）
    events/
      SafetyViolationDetected.ts
  application/
    use-cases/
      evaluate-ai-output-safety.use-case.ts
    dtos/
      SafetyEvaluationInput.ts
      SafetyEvaluationResult.ts
```

### SafetyGuardrail 作為 Published Language Token

ai module 對下游（notion、notebooklm）暴露的 safety token：

```typescript
// ai/index.ts 暴露的 published language
export type { SafetyGuardrail, SafetyLevel, SafetyEvaluationResult };
export { evaluateAiOutputSafetyUseCase };
```

notion 和 notebooklm 消費此 token，不自行定義安全規則。

### 邊界澄清

| 責任 | 所屬 |
|---|---|
| 有害內容過濾（業務規則） | ✅ ai/safety |
| Genkit model safety settings | ✅ ai/infrastructure（adapter 配置） |
| 法規資料保留合規 | ❌ platform/compliance |
| IAM 授權決策 | ❌ iam/access-control |

## Consequences

**正面：** `SafetyGuardrail` 有明確的業務語言定義；下游模組不需各自實作安全邏輯。  
**負面：** 需要定義具體的 `ContentPolicy` 規則，這依賴業務決策（目前未知）。  
**中性：** Provider-level safety settings 維持在 Genkit 配置層，不需動 domain 模型。

## References

- `docs/structure/domain/subdomains.md` — ai safety baseline
- `docs/structure/domain/ubiquitous-language.md` — SafetyGuardrail published language token
- `packages/integration-ai/genkit.ts` — Genkit 現有配置
- ADR ai/0003 — ai orchestration 正式化（safety 將由 orchestration 子域呼叫）
