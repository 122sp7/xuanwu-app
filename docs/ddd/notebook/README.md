# notebook — AI 對話上下文

> **Domain Type:** Supporting Subdomain（支援域）
> **模組路徑:** `modules/notebook/`
> **開發狀態:** 🏗️ Midway

## 定位

`notebook` 管理 AI 對話的 **Thread / Message 生命週期**，並封裝 Genkit AI 模型呼叫。它是面向使用者的 AI 互動界面層——接收使用者訊息、呼叫 Genkit 生成回應、維護對話歷史。

## 職責

| 能力 | 說明 |
|------|------|
| Thread 管理 | 建立、讀取對話串（含 Message 歷史） |
| Message 管理 | 追加 user / assistant / system 訊息 |
| AI 回應生成 | 封裝 Genkit 模型呼叫（GenerateNotebookResponse） |
| RAG 整合查詢 | 透過 `search` BC 取得語意相關 chunks（已移至 search） |

## 核心概念

- **`Thread`** — 對話串聚合根（含 Message 列表）
- **`Message`** — 單則訊息（role: user / assistant / system，content）

## 重要邊界規則

`notebook` 的 Server Action **不得**從 `@/modules/notebook/api` barrel 中在 Client Component 直接 import。Genkit/gRPC 模組是 server-only，需透過本地 `_actions.ts` 隔離：

```typescript
// app/(shell)/ai-chat/_actions.ts
"use server";
export async function generateResponse(...) { ... }
```

## 詳細文件

| 文件 | 說明 |
|------|------|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | Thread / Message 聚合根設計 |
| [domain-events.md](./domain-events.md) | 領域事件 |
| [context-map.md](./context-map.md) | 與其他 BC 的整合關係 |
