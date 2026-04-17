# integration-http

HTTP 用戶端封裝套件。提供標準化的 HTTP 操作介面，隔離底層 fetch / HTTP library 細節與 `src/modules/` 業務層。

## 套件結構

```
packages/integration-http/
  index.ts      ← 統一 re-export
  AGENTS.md     ← Agent 使用規則
  README.md     ← 本文件
```

> 目前為待實作狀態（empty）。實作時遵循 `AGENTS.md` 的封裝規則。

## 預期公開 API

```ts
import { httpClient, type HttpError } from '@integration-http'

// GET
const data = await httpClient.get<ResponseType>('/endpoint')

// POST
const result = await httpClient.post<ResponseType>('/endpoint', body)

// 錯誤類型
try { ... } catch (err) {
  if (err instanceof HttpError) { ... }
}
```

## 使用限制

| 規則 | 說明 |
|---|---|
| **只允許在 outbound adapters 使用** | ESLint boundary 限制 `src/modules/*/adapters/outbound/` |
| **禁止在 modules 直接使用 `fetch`** | 所有 HTTP 呼叫必須透過此套件 |
| **禁止加入業務邏輯** | URL 路由與 response 映射由消費端 adapter 負責 |

## 職責邊界

此套件只封裝 HTTP 機制層（如何發送請求、如何處理重試/逾時/錯誤）。  
業務端點 URL、response 映射至 domain model，屬於各 `src/modules/*/adapters/outbound/`。
