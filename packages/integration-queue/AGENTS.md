# integration-queue — Agent Rules

此套件是 **訊息佇列整合的唯一封裝層**：QStash、Google Cloud Tasks。

---

## Route Here

| 類型 | 說明 |
|---|---|
| QStash 訊息發布 | `publishToQueue(topic, payload)` |
| Cloud Tasks 任務建立 | `enqueueCloudTask(queue, url, payload)` |
| Queue 設定原語 | topic 名稱常數、delivery 設定 |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 業務任務內容與邏輯 | `src/modules/<context>/application/` |
| 背景工作處理 handler | `src/app/api/` 或 `fn/` |

---

## 嚴禁

```ts
// ❌ 在 domain 直接 import queue SDK
import { Client } from '@upstash/qstash'

// ✅ 透過此套件
import { publishToQueue } from '@integration-queue'
```

- 不得在此套件包含業務 payload 建構邏輯
- 不得 import `src/modules/*`
- 憑證只能來自 env vars（`QSTASH_TOKEN` 等）

## Alias

```ts
import { ... } from '@integration-queue'
```
