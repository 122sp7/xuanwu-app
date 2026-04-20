# ADR 0001 — ai module chunk/embedding/pipeline 子域歸屬

## Status

Proposed

## Date

2025-02-11

## Context

`src/modules/ai/subdomains/` 目前包含以下不在 baseline 定義的子域：

```
chunk / citation / embedding / pipeline
```

`docs/structure/domain/subdomains.md` 的 ai baseline 定義為：

```
generation / orchestration / distillation / retrieval / memory /
context / safety / tool-calling / reasoning / conversation /
evaluation / tracing
```

問題：`chunk`、`embedding`、`pipeline` 描述的是 **文件 ingestion 的 ETL 步驟**，這些能力：

1. **在 `fn/` Python runtime 執行**：`fn/src/` 實際做 chunking（分塊）和 embedding（向量化），TypeScript ai module 不能執行這些操作。
2. **不是通用 AI 能力**：它們是 notebooklm source 處理流程的具體步驟，不是跨主域共享的 AI capability。
3. **命名違反 ai module 語意**：`ai` module 擁有的應是 `AICapability`（generation、retrieval、safety 等通用能力），而不是特定 pipeline 步驟。

`citation` 問題另論（見 domain/0003）：citation 是 notebooklm 合成結果的引用追蹤，屬於 `synthesis` 子域的 value object，不是通用 ai capability。

## Decision

### 各子域處置方案

| 子域 | 現有位置 | 決定 |
|---|---|---|
| `chunk` | `ai/subdomains/chunk/` | 若只有 TypeScript 型別契約 → 移至 `notebooklm/subdomains/source/domain/value-objects/`；若有 runtime 邏輯 → 刪除（fn/ 負責執行） |
| `embedding` | `ai/subdomains/embedding/` | 同 chunk 處置原則 |
| `pipeline` | `ai/subdomains/pipeline/` | 若描述 orchestration schema → 移至 fn/ interface/schemas；若無，刪除 |
| `citation` | `ai/subdomains/citation/` | 移至 `notebooklm/subdomains/synthesis/domain/value-objects/Citation.ts` |

### 驗證步驟

1. 讀取 `ai/subdomains/chunk/`、`embedding/`、`pipeline/` 的現有程式碼。
2. 若只有空骨架（README + .gitkeep）→ 直接移除目錄。
3. 若有 domain types/schemas → 依上表歸屬目標遷移。
4. 若有 runtime 執行邏輯 → 記錄 VIOLATION，立即重構移至 fn/。

### ai module 缺失但應建立的子域

以下是 ai baseline 中**實際缺失**且應補建的子域：

| 缺失子域 | 說明 | 優先級 |
|---|---|---|
| `safety` | Genkit 安全護欄、有害內容過濾 | P1 |
| `tracing` | AI 執行 span、成本追蹤、可觀測性 | P1 |
| `reasoning` | Chain-of-thought、反思步驟管理 | P2 |
| `distillation` | 長輸出濃縮為精煉知識片段 | P2 |
| `orchestration` | 正式化為子域（現為 AiFacade.ts）| P1 |

## Consequences

**正面：** ai module 僅保留真正通用的 AI 能力；ETL 步驟回歸 fn/ 所有權。  
**負面：** 需要審查現有 chunk/embedding/pipeline 程式碼，確認是否有消費端 import。  
**中性：** `pipeline` 概念可能跨越 fn/ 和 TypeScript 層（QStash 訊息格式），需仔細分離型別契約與執行邏輯。

## References

- `docs/structure/domain/subdomains.md` — ai baseline 定義
- `fn/src/` — Python 側的 chunking/embedding 實作
- `src/modules/ai/subdomains/` — 待審查目錄
- ADR domain/0003 — synthesis subdomain（citation 遷移目標）
- ADR architecture/0002 — cross-runtime bridge 決策
