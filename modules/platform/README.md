# 📄 `modules/platform/README.md`

````markdown
# Platform Module

> 企業級 SaaS 平台核心模組，採用 **DDD（領域驅動設計）× Hexagonal Architecture** 建構。

---

## 📐 架構概覽

```
platform/
├── adapters/        # 驅動層：CLI、Web、外部 API、資料庫實作
├── application/     # 應用層：Use Case、Command、Query、Handler
├── docs/            # 架構文件：DDD 設計決策與領域說明
├── domain/          # 核心領域層：Aggregate、Entity、Value Object、Domain Event
├── events/          # 跨域 Domain Event Contract 定義
├── infrastructure/  # 技術實作層：DB、Cache、Email、Messaging、Storage
├── ports/           # Port 介面定義：Input Port、Output Port
├── shared/          # 跨域共用：常數、錯誤、型別、工具、Value Object
└── subdomains/      # 業務子域：23 個 Bounded Context
```

---

## 🧱 架構分層說明

### `domain/` — 領域核心層
平台的業務核心，**不依賴任何框架與技術實作**。

| 資料夾 | 內容 |
|---|---|
| `aggregates/` | Aggregate Root，定義業務一致性邊界 |
| `entities/` | 有唯一識別碼的領域物件 |
| `value-objects/` | 不可變的值物件（Email、Money、DateRange） |
| `events/` | Domain Event 定義（領域內部） |
| `factories/` | 複雜 Aggregate / Entity 的建構工廠 |
| `services/` | 跨 Entity 的領域邏輯，無法歸屬單一 Entity |

---

### `application/` — 應用層
協調領域物件完成使用者意圖，**不含業務邏輯**。

| 資料夾 | 內容 |
|---|---|
| `commands/` | 寫入意圖定義（CreateAccount、UpdateProfile） |
| `queries/` | 讀取意圖定義（GetAccountById、ListOrganizations） |
| `handlers/` | Command / Query 的執行處理器 |
| `dtos/` | 應用層輸入 / 輸出資料結構定義 |

---

### `ports/` — Port 介面層
定義系統邊界的抽象介面，**不含實作**。

| 資料夾 | 內容 |
|---|---|
| `input/` | Use Case Interface，由 Application Layer 實作 |
| `output/` | Repository / Service Interface，由 Infrastructure 實作 |

---

### `adapters/` — 適配器層
將外部世界的呼叫轉換為系統可理解的格式。

| 資料夾 | 內容 |
|---|---|
| `web/` | HTTP Controller、Route Handler（Next.js / Express） |
| `cli/` | CLI 指令入口 |
| `persistence/` | Repository 實作（Firestore / Prisma） |
| `external/` | 外部 API 呼叫封裝（Stripe、SendGrid） |

---

### `infrastructure/` — 基礎設施層
所有技術服務的具體實作。

| 資料夾 | 內容 |
|---|---|
| `db/` | 資料庫連線、ORM 設定 |
| `cache/` | Redis / In-Memory 快取 |
| `messaging/` | Pub/Sub、Queue、Event Bus |
| `email/` | Email 發送服務（Resend / SendGrid） |
| `storage/` | 檔案儲存（Firebase Storage / GCS） |
| `monitoring/` | Logger、Tracer、Metric 實作 |

---

### `shared/` — 跨域共用層
**不依賴任何 subdomain**，只能被其他層單向引用。

| 資料夾 | 內容 |
|---|---|
| `constants/` | 全域常數定義 |
| `errors/` | Base Error Class、Domain Error 類型 |
| `types/` | 共用 TypeScript Interface / Type |
| `utils/` | 純函式工具（date、string、crypto） |
| `value-objects/` | 跨域共用 VO（Money、Pagination、Result\<T\>） |

---

### `events/` — 跨域事件層
跨 Subdomain 的 Domain Event Contract 集中定義，**避免循環依賴**。

```typescript
// 範例
export interface UserCreatedEvent {
  type: 'user.created'
  accountId: string
  email: string
  occurredAt: Date
}
```

---

## 🗂️ Subdomains — 23 個 Bounded Context

| # | Subdomain | 職責 |
|---|---|---|
| 1 | `identity` | 身份驗證、OAuth、Token、Session |
| 2 | `account` | 帳號聚合根、帳號類型、生命週期管理 |
| 3 | `account-profile` | 個人帳號資料、偏好設定 |
| 4 | `organization` | 組織管理、成員、Team |
| 5 | `access-control` | RBAC、Permission、Role 管理 |
| 6 | `onboarding` | 新用戶引導流程、Setup Wizard |
| 7 | `subscription` | 訂閱方案、Trial、升降級 |
| 8 | `billing` | 付款處理、Invoice、金流串接 |
| 9 | `referral` | 推薦碼、邀請機制 |
| 10 | `notification` | Email / Push / SMS 通知發送 |
| 11 | `content` | CMS、文章、媒體管理 |
| 12 | `search` | 全文搜尋、跨域資料查詢 |
| 13 | `integration` | Webhook、第三方 API 串接 |
| 14 | `workflow` | 流程自動化、狀態機 |
| 15 | `background-job` | 排程任務、Queue、Cron Job |
| 16 | `feature-flag` | 功能開關、A/B Test |
| 17 | `audit-log` | 操作記錄、事件稽核追蹤 |
| 18 | `compliance` | GDPR、資料保留政策 |
| 19 | `security-policy` | 密碼政策、IP 白名單、MFA 規則 |
| 20 | `analytics` | 使用行為分析、報表 |
| 21 | `observability` | Log、Metric、Distributed Trace |
| 22 | `platform-config` | 系統參數、環境設定 |
| 23 | `support` | 客服工單、FAQ |

---

## 🔄 依賴方向規則

```
adapters
    ↓
application  ←→  ports
    ↓
domain
    ↑
infrastructure (實作 ports/output)

shared ← 所有層都可引用，但 shared 不引用任何層
events ← subdomains 可發布與訂閱，但不互相直接引用
```

> ⚠️ **嚴禁反向依賴**：`domain` 不可 import `application` 或 `infrastructure`

---

## 📚 相關文件

| 文件 | 說明 |
|---|---|
| [bounded-context.md](./docs/bounded-context.md) | Bounded Context 邊界定義 |
| [context-map.md](./docs/context-map.md) | Context Map 關係圖 |
| [subdomains.md](./docs/subdomains.md) | 各 Subdomain 詳細說明 |
| [aggregates.md](./docs/aggregates.md) | Aggregate 設計說明 |
| [domain-events.md](./docs/domain-events.md) | Domain Event 清單 |
| [domain-services.md](./docs/domain-services.md) | Domain Service 說明 |
| [application-services.md](./docs/application-services.md) | Application Service 說明 |
| [repositories.md](./docs/repositories.md) | Repository 介面清單 |
| [ubiquitous-language.md](./docs/ubiquitous-language.md) | 統一語言詞彙表 |

---

*Platform Module — Powered by DDD × Hexagonal Architecture*
````