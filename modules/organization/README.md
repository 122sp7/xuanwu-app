# organization — Organization Management Layer

> **開發狀態**：✅ Done — 核心功能完成
> **Domain Type**：Generic Domain（通用域）

`modules/organization` 負責團隊/組織的管理，包含組織建立、成員管理、角色授權與組織政策。是工作區（workspace）的上層治理結構。

外界互動規則：
- 外界只能透過 `api/` 公開介面存取此模組
- 禁止直接 import `domain/`、`application/`、`infrastructure/`、`interfaces/`

---

## 職責（Responsibilities）

| 能力 | 說明 |
|------|------|
| 組織管理 | 建立、更新、刪除組織（Organization） |
| 成員管理 | 邀請、移除成員，管理成員角色 |
| 角色授權 | 定義並執行組織層級的角色與權限 |
| 組織政策 | 管理組織層級的存取政策 |

---

## 聚合根（Aggregate Roots）

| Aggregate | 說明 |
|-----------|------|
| `Organization` | 組織聚合根，包含成員列表與組織設定 |
| `OrganizationMember` | 組織成員實體，含角色資訊 |
| `OrganizationRole` | 組織角色定義 |

---

## 通用語言（Ubiquitous Language）

| 術語 | 英文 | 說明 |
|------|------|------|
| 組織 | Organization | 團隊或公司的管理單元 |
| 租戶 | Tenant | 組織的另一種表達（multi-tenant 情境） |
| 成員 | Member | 組織的成員 |
| 角色 | Role | 成員在組織中的職責定義 |
| 邀請 | Invitation | 新成員加入組織的邀請流程 |

---

## 領域事件（Domain Events）

| 事件 | 觸發條件 |
|------|----------|
| `organization.created` | 新組織建立時 |
| `organization.member_invited` | 成員被邀請時 |
| `organization.member_removed` | 成員被移除時 |
| `organization.role_assigned` | 角色被指派給成員時 |

---

## 依賴關係

- **上游（依賴）**：`identity/api`（使用者身分驗證）
- **下游（被依賴）**：`workspace/api`、`account/api`、`source/api`

---

## 目錄結構

```
modules/organization/
├── api/                  # 公開 API 邊界
├── application/          # Use Cases
├── domain/               # Aggregates, Entities, Repositories
├── infrastructure/       # Firebase 適配器
├── interfaces/           # UI 元件、Server Actions
└── index.ts
```
