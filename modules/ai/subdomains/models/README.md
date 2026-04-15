# models — LLM 模型供應商適配器

## 子域目的

管理 LLM 供應商的適配器定義、支援的 Context Window 上限，以及模型端點（Endpoint）配置。此子域是 `ai` bounded context 對「哪些模型可用、各自的能力邊界在哪」的正典知識邊界。

## 業務能力邊界

**負責：**
- LLM 供應商（Google Gemini、OpenAI、Anthropic 等）的 Adapter 定義
- 每個模型支援的 Context Window（輸入/輸出 token 上限）
- API 端點（Endpoint）地址與版本配置
- 模型識別符（model ID）的正典命名與版本化

**不負責：**
- 模型的實際呼叫執行（屬於 `inference` 或 `tool-runtime` 子域）
- Provider 路由策略（屬於 `model-observability` 子域的監測信號）
- 計費與 token 用量計算（屬於 `tokens` 子域）
- Prompt 內容（屬於 `prompt-pipeline` / `prompts` 子域）

## 核心概念

| 概念 | 說明 |
|------|------|
| ModelDescriptor | 模型識別符、Provider、Context Window、支援能力的值對象 |
| ProviderAdapter | 供應商 SDK 邊界抽象；Infrastructure 層實作 |
| Endpoint | 模型 API 端點配置，包含 URL、版本與認證方式 |
| ContextWindow | 輸入/輸出 token 上限的值對象 |

## 架構層級

```
models/
  api/          ← 對外公開模型目錄查詢能力（只讀）
  domain/
    entities/   ← ModelDescriptor
    value-objects/ ← ContextWindow, Endpoint
    repositories/  ← ModelRepository（介面）
  application/
    use-cases/  ← ListAvailableModels, GetModelCapabilities
```

## 依賴方向

- 本子域不依賴其他 AI 子域的 domain 層
- 消費者（`content-generation`、`tool-runtime`、`inference`）透過 `api/` 查詢模型能力
- Provider SDK 只存在於 `infrastructure/` 的 Adapter 實作中

## Ubiquitous Language

- **ModelDescriptor**：模型的完整能力描述（不是 SDK 物件）
- **Provider**：LLM 服務供應商，如 `googleai`、`openai`
- **Context Window**：一次推理請求可處理的最大 token 邊界
- **Endpoint**：模型 API 的可定址端點配置
