# platform/subdomains/ai

## 子域職責

`ai` 子域是 platform 對全系統提供的**共享 AI 能力治理層**，負責：

- AI provider 路由與供應商抽象（OpenAI、Gemini、Claude 等）
- 模型政策（模型版本、fallback、retry 策略）
- 配額追蹤與成本管控
- 安全護欄（content filter、safety guardrail）

notebooklm 的 retrieval/grounding/synthesis 與 notion 的 content assist 均**消費**此子域，而不自行擁有 `ai` 子域。

## 核心語言

| 術語 | 說明 |
|---|---|
| `AiProviderRoute` | 一個 AI provider 的路由規則與選擇條件 |
| `ModelPolicy` | 模型版本、fallback 與 retry 策略組合 |
| `AiQuota` | 用量配額定義與計量邊界 |
| `AiSafetyGuard` | 安全護欄規則集合 |

## Hexagonal shape

- `api/`: public 子域 boundary
- `application/`: use cases（`RouteAiProvider`、`EnforceModelPolicy`、`CheckAiQuota`）
- `domain/`: `AiProviderRoute`、`ModelPolicy`、`AiQuota`、`AiSafetyGuard`
- `infrastructure/`: provider SDK 適配器（OpenAI、Gemini、Claude）
- `interfaces/`: server action 接線

## 狀態

🔲 Gap — 架構已定位，程式碼骨架待填充。

## 整合規則

- notebooklm 消費 `platform.ai` via `@/modules/platform/api`，不建立本地 `ai` 子域
- notion 消費 `platform.ai` via `@/modules/platform/api`，不建立本地 `ai` 子域
- 父模組 public API（`@/modules/platform/api`）是跨模組進入點
