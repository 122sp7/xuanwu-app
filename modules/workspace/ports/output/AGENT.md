# ports/output — Driven Ports（輸出端口）

此目錄是 `workspace` BC 核心對外部基礎設施「要求能力」的**唯一抽象入口**。
Core（domain + application）依賴這些 interface；infrastructure 實作它們。

---

## ✅ 屬於此處

| 類型 | 範例 |
|------|------|
| Repository port interface | `WorkspaceRepository`、`WorkspaceQueryRepository` |
| Domain event publisher port | `WorkspaceDomainEventPublisher` |
| 任何 BC 核心向外索取能力的抽象介面 | `StoragePort`、`NotificationPort`（未來） |

## ❌ 禁止放入

| 禁止項目 | 原因 |
|----------|------|
| `class`、concrete implementation | 實作放 `infrastructure/` |
| Firebase、HTTP、React 等框架 import | 抽象層不能感知外部技術 |
| 業務邏輯、計算 | 邏輯放 `domain/services/` |
| DTO / data shape | 資料形狀放 `application/dtos/` |

---

## 依賴方向

```
application/use-cases → ports/output
application/services → ports/output
infrastructure/firebase|events → ports/output（實作 interface）
ports/output → domain/（只取型別，e.g., WorkspaceDomainEvent）
```

`ports/output` 本身**不可**被 `domain/` 反向依賴。

---

## 目前 Port 清單

目前此目錄應承載 workspace 對外能力的正式抽象面：

- `WorkspaceDomainEventPublisher`
- `WorkspaceRepository`
- `WorkspaceCapabilityRepository`
- `WorkspaceAccessRepository`
- `WorkspaceLocationRepository`
- `WorkspaceQueryRepository`
- `WikiWorkspaceRepository`
