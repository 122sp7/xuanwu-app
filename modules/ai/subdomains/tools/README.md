# tools — Function Calling 工具定義

## 子域目的

管理 Function Calling 的 JSON Schema 規範、工具描述檔（Tool Descriptor），以及工具的正典目錄。此子域是 `ai` bounded context 對「哪些工具存在、各自的輸入/輸出合約是什麼」的正典知識邊界。

> **注意**：此子域管理工具的**定義與目錄**；工具的**執行引擎**屬於 `tool-runtime` 子域。

## 業務能力邊界

**負責：**
- 工具的 JSON Schema 規範（`parameters`、`returns`）定義與版本化
- 工具描述檔（name、description、category）的正典管理
- 工具目錄（Tool Catalog）的查詢與發布
- 工具 schema 的相容性驗證（backward compatibility）

**不負責：**
- 工具的實際執行（屬於 `tool-runtime` 子域）
- AI 模型決定要呼叫哪個工具（屬於推理流程）
- Tool Return 訊息的持久化（屬於 `messages` 子域）
- 工具與 Prompt 的綁定（屬於 `prompt-pipeline` 子域）

## tools vs tool-runtime 分工

| 關注點 | tools | tool-runtime |
|--------|-------|--------------|
| JSON Schema 定義 | ✅ 正典所有者 | 消費者 |
| 工具目錄查詢 | ✅ 正典所有者 | 消費者 |
| 工具執行引擎 | ❌ | ✅ 正典所有者 |
| 執行結果回傳 | ❌ | ✅ 正典所有者 |

## 核心概念

| 概念 | 說明 |
|------|------|
| ToolDescriptor | 工具的完整宣告：name、description、parameters schema、returns schema |
| ToolCatalog | 已發布工具的聚合目錄，支援依 name、category 查詢 |
| ParametersSchema | 工具輸入的 JSON Schema 定義（Zod 轉換後的 OpenAPI 格式）|
| ToolVersion | 工具 schema 的語意版本，保護下游相容性 |

## 架構層級

```
tools/
  api/              ← 對外公開工具目錄查詢能力
  domain/
    entities/       ← ToolDescriptor
    value-objects/  ← ToolVersion, ParametersSchema, ToolCategory
    repositories/   ← ToolCatalogRepository（介面）
    events/         ← ToolDescriptorPublished, ToolDescriptorDeprecated
  application/
    use-cases/      ← PublishToolDescriptor, ListAvailableTools, GetToolDescriptor
```

## 與 Genkit 的邊界

- Genkit `defineTool()` 是 `tool-runtime` 的 Infrastructure 實作細節
- 本子域的 `ToolDescriptor` 是平台無關的正典定義，不依賴 Genkit SDK
- `tool-runtime` 在初始化時從本子域的 `ToolCatalog` 載入需要執行的工具描述

## Ubiquitous Language

- **ToolDescriptor**：工具的靜態合約（不是執行實體）
- **ToolCatalog**：已發布可用工具的正典目錄（不是執行佇列）
- **ParametersSchema**：輸入驗證的 JSON Schema（Zod 是實作，Schema 是合約）
- **DeprecatedTool**：已標記棄用但可能仍在執行中的工具狀態
