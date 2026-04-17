# integration-ai

AI SDK（Genkit / Google AI）封裝套件。提供 AI Flow 執行、Embedding 生成等穩定介面，隔離 AI SDK 細節與 `src/modules/` 業務層。

## 套件結構

```
packages/integration-ai/
  index.ts      ← 統一 re-export
  AGENTS.md     ← Agent 使用規則
  README.md     ← 本文件
```

> 目前為待實作狀態（empty）。實作時遵循 `AGENTS.md` 的封裝規則。

## 預期公開 API

```ts
// AI Flow 執行
import { runAiFlow, streamAiFlow } from '@integration-ai'

// Embedding
import { generateEmbedding, batchEmbedding } from '@integration-ai'
```

## 使用限制

| 規則 | 說明 |
|---|---|
| **只允許在 outbound adapters 使用** | ESLint boundary 限制 `src/modules/*/adapters/outbound/` |
| **禁止直接 import Genkit / Google AI SDK** | 所有 AI 操作必須透過此套件 |
| **禁止加入 prompt 邏輯** | prompt 設計屬於 platform.ai 或 notebooklm |
| **API key 不可含 NEXT_PUBLIC_ 前綴** | AI SDK 只在 server-side 使用 |

## 職責邊界

此套件只封裝 SDK 機制層（如何呼叫 AI）。  
業務決策（prompt 設計、safety policy、grounding）屬於 `src/modules/platform/` 和 `src/modules/notebooklm/`。
