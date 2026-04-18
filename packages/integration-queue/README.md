# integration-queue

訊息佇列整合層：QStash HTTP publisher 合約與工具函式。

## 套件結構

```
packages/integration-queue/
  index.ts    ← QueueClient 介面 + createQStashClient + 型別定義
  AGENTS.md
```

## 公開 API

```ts
import {
  // 主要 API
  createQStashClient,
  type QueueClient,
  type QueuePublishOptions,
  type QueuePublishResult,
  type QStashConfig,

  // 錯誤
  IntegrationQueueError,

  // 開發 / 測試 stub
  createNoOpQueueClient,

  // Legacy 相容
  createInMemoryQueuePublisher,
  type QueuePublisher,
  type QueueMessage,
} from '@integration-queue'
```

## 使用範例

```ts
import { createQStashClient } from '@integration-queue'

const queue = createQStashClient({
  token: process.env.QSTASH_TOKEN!,
})

await queue.publish({
  destination: 'https://app.example.com/api/worker/embed',
  body: { documentId: 'doc-123' },
  retries: 3,
  delay: '5s',
  failureCallback: 'https://app.example.com/api/worker/embed-failed',
})
```

## 使用規則

| 規則 | 說明 |
|---|---|
| **只允許在 outbound adapter 使用** | `src/modules/*/adapters/outbound/` |
| **token 來自 env var** | `QSTASH_TOKEN`，不得 hardcode |
| **domain / application 禁止直接 import** | 透過 port interface 注入 |

## Context7 官方基線

- 文件：`/websites/upstash_qstash`
- 佇列發布需支援 retry、delay、callback/failureCallback。
- 發布訊息通過 `Authorization: Bearer <token>` HTTP header。
