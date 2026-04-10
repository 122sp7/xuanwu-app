# platform/subdomains/tenant

## 子域職責

`tenant` 子域負責多租戶隔離與 tenant-scoped 規則的正典邊界：

- 管理 `Tenant` 聚合根與租戶生命週期（建立、暫停、終止）
- 強制執行租戶資源隔離邊界（`TenantBoundary`）
- 維護租戶級配置（`TenantConfig`）與資料分區策略

## 核心語言

| 術語 | 說明 |
|---|---|
| `Tenant` | 一個獨立的租戶組織聚合根（不等同於 `Organization`） |
| `TenantId` | 全局唯一的租戶識別碼（品牌型別） |
| `TenantBoundary` | 定義租戶隔離規則與跨租戶存取限制 |
| `TenantConfig` | 租戶層級的系統配置快照 |
| `TenantStatus` | 租戶狀態（`active`、`suspended`、`terminated`） |

## Hexagonal shape

- `api/`: public 子域 boundary
- `application/`: use cases（`ProvisionTenant`、`SuspendTenant`、`UpdateTenantConfig`、`ResolveTenantContext`）
- `domain/`: `Tenant`、`TenantBoundary`、`TenantConfig`
- `infrastructure/`: Firestore 租戶資料存取
- `interfaces/`: server action 接線、租戶管理入口

## 整合規則

- `tenant` 提供 `TenantId` 解析能力，供 `organization`、`access-control`、`billing` 等子域消費
- 不與 `organization` 視為同義：`Organization` 是業務協作單位，`Tenant` 是資源隔離邊界
- 父模組 public API（`@/modules/platform/api`）是跨模組進入點

## Status

🔲 Gap — 尚未實作，依 docs/contexts/platform/subdomains.md 建議建立
