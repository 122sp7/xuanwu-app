# AI Module

`src/modules/ai` 是蒸餾自 `modules/ai` 的精簡等價版，以 `src/modules/template` 骨架為基線。
僅保留 **active** 子域的 domain 概念（content-generation、content-distillation、tool-runtime），略過所有 stub-only 子域。

## 領域定位

| 項目 | 內容 |
|---|---|
| **DDD 分類** | Core Domain |
| **定位** | AI 能力中樞（所有智慧行為來源）|
| **核心價值** | 把「語言模型能力」產品化；提供 workspace / notion / notebooklm 可復用的 AI 能力 |
| **不做** | UI、商業規則（billing / plan）、使用者身份管理 |
| **依賴方向** | 被 workspace / notion / notebooklm 使用；不依賴其他 domain |

## 蒸餾來源

`modules/ai`（完整六邊形 + 14 個 subdomains）→ `src/modules/ai`（精簡骨架，3 active ports）

## 目錄結構

```
src/modules/ai/
  index.ts                                    ← 模組對外唯一入口（具名匯出）
  domain/
    index.ts
    ports/
      AiTextGenerationPort.ts                 ← content-generation port
      DistillationPort.ts                     ← content-distillation port
      TaskExtractionPort.ts                   ← task extraction port
      ToolRuntimePort.ts                      ← tool-runtime port
  application/
    index.ts
    use-cases/
      generate-ai-text.use-case.ts
      distill-content.use-case.ts
      extract-tasks-from-content.use-case.ts
      generate-with-tools.use-case.ts
    dto/
      AiTextGenerationDTO.ts
      DistillationDTO.ts
      TaskExtractionDTO.ts
  adapters/
    inbound/
      index.ts
      http/                                   ← HTTP route handlers（ai endpoints）
      rpc/                                    ← tRPC routers
    outbound/
      index.ts
      genkit/
        GenkitAiTextGenerationAdapter.ts      ← implements AiTextGenerationPort
        GenkitDistillationAdapter.ts          ← implements DistillationPort
        GenkitToolRuntimeAdapter.ts           ← implements ToolRuntimePort
        GenkitTaskExtractionAdapter.ts        ← implements TaskExtractionPort
      openai/                                 ← (future) fallback adapter
```

## Barrel 結構（具名匯出原則）

所有 barrel 使用明確的 `export { X }` 與 `export type { X }`，嚴禁 `export *`。

| Barrel | 覆蓋範圍 |
|---|---|
| `index.ts` | domain + application 的公開符號 |
| `domain/index.ts` | 4 ports |
| `application/index.ts` | use-cases + dto |
| `adapters/inbound/index.ts` | http, rpc |
| `adapters/outbound/index.ts` | genkit/, openai/ |

Source 檔案內部 import 使用**直接相對路徑**，不依賴 barrel，確保 barrel 可獨立修改。

### 根 index.ts 匯出範例

```ts
// src/modules/ai/index.ts
export type { AiTextGenerationPort, DistillationPort, TaskExtractionPort, ToolRuntimePort } from './domain';
export { GenerateAiTextUseCase } from './application';
export type { GenerateAiTextInput, GenerateAiTextResult, DistillationInput, DistillationResult } from './application';
```

## 蒸餾範圍

| src 概念 | 蒸餾自 modules/ai | 狀態 |
|---|---|---|
| domain/ports/AiTextGenerationPort | domain/ports/ 或 subdomains/content-generation | ✅ 保留 |
| domain/ports/DistillationPort | domain/ports/ 或 subdomains/content-distillation | ✅ 保留 |
| domain/ports/TaskExtractionPort | domain/ports/ | ✅ 保留 |
| domain/ports/ToolRuntimePort | domain/ports/ 或 subdomains/tool-runtime | ✅ 保留 |
| evaluation-policy, memory-context | subdomains/*（stub only） | ❌ 跳過 |
| model-observability, safety-guardrail | subdomains/*（stub only） | ❌ 跳過 |
| conversations, datasets, embeddings, models | subdomains/*（stub only） | ❌ 跳過 |

## 依賴方向

```
adapters/inbound → application → domain ← adapters/outbound
```

`domain/` 絕對不依賴 Genkit、OpenAI SDK、React 或任何 Firebase 模組。
Genkit / OpenAI SDK 只能出現在 `adapters/outbound/genkit/` 或 `adapters/outbound/openai/`。

## 外部消費方式

```ts
// types（client-safe）
import type { AIAPI, GenerateAiTextInput, DistillationResult } from "@/src/modules/ai";

// server-only functions
import { generateAiText, distillContent, extractTasksFromContent } from "@/src/modules/ai";
```

原始 API 合約參考：`modules/ai/api/index.ts` 與 `modules/ai/api/server.ts`。

---

## 如何複製成新模組

1. 複製整個 `src/modules/template/` 資料夾，重命名為目標模組名稱。
2. 全域取代 `Template` → `<YourEntity>`（保留大小寫規律），各層 entity 名稱也一併取代。
3. 依業務需求選留子域；刪除本模組不需要的邏輯。
4. 依 DDD 開發順序填入業務規則：domain ports → application use-cases → adapters → 更新 barrel。
5. 更新根 `index.ts` barrel，僅匯出有實作的符號。

---

## 蒸餾作業說明（src/modules 層定位）

`src/modules/ai` 是 **`src/modules` 蒸餾層**的精簡等價版本。

### 兩層模組結構，不可互換

| 路徑 | 角色 | 用途 |
|---|---|---|
| `modules/ai/` | 完整 Hexagonal DDD 實作（現況） | 讀取邊界規則、published language、context map |
| `src/modules/ai/` | 精簡蒸餾骨架（新實作目標） | 撰寫新 use case、adapter、port 實作 |

### 路由規則

- 讀取邊界規則、published language → `modules/ai/AGENT.md`、`modules/ai/api/`
- 撰寫新實作程式碼 → `src/modules/ai/`（本目錄）
- 了解蒸餾進度與跳過概念 → `src/modules/ai/README.md`（本文件）
- 跨模組 API boundary → `modules/ai/api/index.ts`（仍是權威邊界）

---

## 衝突防護

1. **不把 `modules/ai/infrastructure/` 的實作直接複製到 `src/modules/ai/domain/`**。
2. **不把 `src/modules/` 當成 `modules/` 的別名**；它們是兩個獨立的實作層。
3. 生成程式碼前，先確認目標路徑是 `modules/` 還是 `src/modules/`，再決定結構與命名。
4. `domain/` 不得匯入 Genkit、Firebase SDK、React 等任何框架或外部 SDK。

---

## 文件網絡

- [AGENT.md](AGENT.md) — Agent / Copilot 使用規則
- [src/modules/README.md](../README.md) — 蒸餾層狀態總覽
- [modules/ai/AGENT.md](../../../modules/ai/AGENT.md) — 完整 HEX+DDD 實作層規則
- [modules/ai/api/](../../../modules/ai/api/) — 跨模組 API 邊界（權威）
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
