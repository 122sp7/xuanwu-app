# ADR 0003 — notebooklm `synthesis` 子域建立

## Status

Proposed

## Date

2025-02-11

## Context

`docs/structure/domain/subdomains.md` 定義 notebooklm 的 baseline 包含 `synthesis` 子域：

> synthesis — RAG 合成、摘要與洞察生成

目前 `synthesis` 完全缺失。相關能力散落於：

- `conversation` 子域：處理對話輪次，但也含摘要生成邏輯
- `document`（待改名 `source`）子域：儲存 `parsedJsonGcsUri`、`ragChunkCount`、`ragVectorCount` 等 RAG 輸出欄位

問題：
1. **RAG grounding 無明確所有權**：從向量搜尋結果到組裝回答的 grounding 邏輯，應屬 `synthesis`，但目前沒有歸宿。
2. **摘要生成混在 `conversation`**：`conversation` 子域負責 Thread/Message 生命週期，不應同時承接 RAG 合成邏輯。
3. **`citation` 歸屬不清**：`ai/subdomains/citation/` 追蹤引用，但引用是 synthesis 的輸出結果，理應屬於 notebooklm。

未來 split triggers（見 `docs/structure/contexts/notebooklm/subdomains.md`）：
- `retrieval`（向量搜尋）
- `grounding`（context 組裝）
- `evaluation`（品質評估）

目前這三個仍作為 `synthesis` 的內部 facets，不獨立為子域。

## Decision

### 建立 `synthesis` 子域

```
src/modules/notebooklm/subdomains/synthesis/
  README.md
  domain/
    entities/
      SynthesisResult.ts       # 合成輸出聚合根
    value-objects/
      Citation.ts              # 引用值對象（從 ai/ 遷移）
      GroundingContext.ts       # context 組裝結果
      SynthesisStatus.ts       # 合成狀態（pending/completed/failed）
    events/
      SynthesisCompleted.ts
      SynthesisFailed.ts
    repositories/
      SynthesisResultRepository.ts
  application/
    use-cases/
      synthesize-notebook-answer.use-case.ts   # 主 RAG 合成流程
      summarize-source.use-case.ts             # 單一來源摘要
    dtos/
      SynthesisInput.ts
      SynthesisOutput.ts
```

### 責任邊界

| 行為 | synthesis 負責 | 不負責 |
|---|---|---|
| 組裝 RAG 上下文（grounding） | ✅ | — |
| 呼叫 AI 生成 API | ✅（透過 ai module port） | ❌ 不直接 import ai infrastructure |
| 追蹤引用來源 | ✅（Citation value object） | — |
| 品質評估 | ✅（內部 facet，未來可獨立） | — |
| 對話輪次管理 | ❌ | 屬 conversation 子域 |
| 向量搜尋執行 | ❌ | 屬 ai/retrieval 子域 |

### Citation 歸屬遷移

`ai/subdomains/citation/` 追蹤的是 notebooklm 合成結果的引用，**不是通用 AI 能力**。決定：

- `Citation` 型別與邏輯移至 `notebooklm/subdomains/synthesis/domain/value-objects/Citation.ts`
- `ai/subdomains/citation/` 廢棄並在下一輪 ai 模組清理中移除

## Consequences

**正面：** RAG grounding 取得明確所有權；`conversation` 子域職責單純化。  
**負面：** 需要從 `conversation` 中分離現有摘要邏輯；`Citation` 遷移需更新 ai/index.ts export。  
**中性：** `retrieval`、`grounding`、`evaluation` 作為 synthesis 的 facets，未來觸發 split 時可獨立為子域，但現在不預建。

## References

- `docs/structure/domain/subdomains.md` — notebooklm synthesis baseline
- `docs/structure/contexts/notebooklm/subdomains.md` — split trigger 條件
- `src/modules/notebooklm/subdomains/conversation/` — 待分離摘要邏輯
- `src/modules/ai/subdomains/citation/` — 待遷移 Citation 概念
- ADR domain/0001 — document → source 重命名
