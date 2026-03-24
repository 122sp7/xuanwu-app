---
title: Namespace Core architecture
description: Target architecture for the namespace-core domain — canonical named-scope registration, slug validation, and resolution for multi-tenant resource addressing in Xuanwu.
status: "🚧 Developing"
---

# Namespace Core 命名空間架構規範

> **文件編號**：XUANWU-NS-SPEC-001
> **適用系統**：xuanwu-app — 多租戶命名空間管理核心
> **版本**：v1.0.0
> **最後更新**：2026-03-20
> **維護責任方**：Namespace Core Owner / 平台架構委員會
> **開發狀態**：🚧 Developing — 積極開發中

---

## 0. 目前已上線範圍

目前 Namespace Core 已具備最小可運作的命名空間骨架，作為後續 URL 路由與多租戶資源定址的基礎：

- **Namespace 實體**：`modules/namespace/domain/entities/namespace.entity.ts`
  - 功能：id、slug、kind（organization / workspace）、ownerAccountId、organizationId、status
- **NamespaceSlug 值物件**：slug 格式驗證（3-63 字元，小寫英數字加連字號）
- **slug-policy domain service**：純函式 — `deriveSlugCandidate`、`isValidSlug`
- **INamespaceRepository port**：save / findById / findBySlug / findByOrganization / existsBySlug
- **Use Cases**：`RegisterNamespaceUseCase`（寫入 + 衝突檢查）、`ResolveNamespaceUseCase`（讀取）
- **In-memory adapter**：本地開發與測試用

### 0.1 本輪交付目標

本輪先建立 Namespace Core 的完整設計文件：

| 文件 | 路徑 |
|------|------|
| 架構設計（本文件） | `docs/decision-architecture/architecture/namespace.md` |
| 開發契約 | `docs/development-reference/reference/development-contracts/namespace-contract.md` |
| 開發指南 | `docs/development-reference/namespace/development-guide.md` |
| 使用手冊 | `docs/development-reference/namespace/user-manual.md` |

### 0.2 本輪不在交付範圍

- Firestore adapter 實作（`FirebaseNamespaceRepository`）
- Namespace slug 變更（rename）流程與舊連結重定向
- 跨租戶 slug 衝突的全域唯一性保證（目前僅 kind 層級）
- Namespace 事件（NamespaceRegistered / NamespaceSuspended）與 event-core 整合
- 組織管理 UI 中的 slug 設定介面

---

## 1. 核心設計原則

| 原則 | 說明 |
|------|------|
| **Slug 即地址** | 每個組織與工作區都有唯一、可閱讀的 slug，作為 URL 路由與 API 定址的基礎 |
| **Kind 隔離** | `organization` slug 與 `workspace` slug 各自獨立，同 slug 在不同 kind 下不衝突 |
| **不可變 ID** | Namespace `id` 一旦建立不得變更；slug 可透過受控流程更新（目前尚未實作） |
| **純粹 domain** | Slug 驗證與推導邏輯均為純函式，不含任何 SDK/HTTP/DB 依賴 |
| **可替換 adapter** | 從 in-memory 切換至 Firestore 不影響 domain 或 application 層 |

---

## 2. Namespace Core 整體架構

### 2.1 模組邊界

```
modules/organization/ 或 modules/workspace/
    ↓ (呼叫 RegisterNamespaceUseCase on create)
modules/namespace/interfaces/api/
    ↓
modules/namespace/application/use-cases/
    ↓
modules/namespace/domain/
    ↑
modules/namespace/infrastructure/
```

### 2.2 Namespace 生命週期

```
建立（Register）
    → deriveSlugCandidate（從 displayName 推導 slug 候選值）
    → NamespaceSlug.create（驗證格式）
    → existsBySlug（衝突檢查）
    → save（持久化 Namespace，status: active）
解析（Resolve）
    → findBySlug(slug, kind) → Namespace 實體
暫停（Suspend）
    → namespace.suspend() → status: suspended
恢復（Restore）
    → namespace.restore() → status: active
封存（Archive）
    → namespace.archive() → status: archived
```

---

## 3. Namespace 資料模型

### 3.1 Namespace 欄位

| 欄位 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `id` | `string` | ✅ | UUID v4，全域唯一 |
| `slug` | `NamespaceSlug` | ✅ | URL-safe slug（3-63 字元，小寫英數字 + 連字號） |
| `kind` | `'organization' \| 'workspace'` | ✅ | 命名空間種類 |
| `ownerAccountId` | `string` | ✅ | 建立者帳號 ID |
| `organizationId` | `string` | ✅ | 所屬組織 ID（多租戶邊界） |
| `status` | `'active' \| 'suspended' \| 'archived'` | ✅ | 命名空間狀態 |
| `createdAt` | `Date` | ✅ | 建立時間 |
| `updatedAt` | `Date` | ✅ | 最後更新時間 |

### 3.2 NamespaceSlug 格式規範

```
規則：
  - 長度：3–63 字元
  - 允許字元：小寫英文字母 (a-z)、數字 (0-9)、連字號 (-)
  - 不得以連字號開頭或結尾
  - 不允許連續連字號（目前未強制，但推薦避免）

合法範例：
  my-organization
  workspace-2024
  acme-corp

非法範例：
  -org        （以連字號開頭）
  org-        （以連字號結尾）
  ab          （長度不足）
  ORG_NAME    （含大寫與底線）
```

---

## 4. Slug Policy（純函式）

`slug-policy` 住在 domain/services，保持純函式：

```typescript
// 從顯示名稱推導 slug 候選值
deriveSlugCandidate('My Organization 2024!')
// → 'my-organization-2024'

// 驗證 slug 格式
isValidSlug('my-org')   // → true
isValidSlug('-bad-')    // → false
```

---

## 5. 模組結構（目標）

```
modules/namespace/
├── domain/
│   ├── entities/
│   │   └── namespace.entity.ts           # Namespace class
│   ├── repositories/
│   │   └── inamespace.repository.ts      # INamespaceRepository port
│   ├── services/
│   │   └── slug-policy.ts               # deriveSlugCandidate, isValidSlug (純函式)
│   └── value-objects/
│       └── namespace-slug.vo.ts         # NamespaceSlug
├── application/
│   └── use-cases/
│       ├── register-namespace.use-case.ts  # RegisterNamespaceUseCase
│       └── resolve-namespace.use-case.ts   # ResolveNamespaceUseCase
├── infrastructure/
│   ├── persistence/
│   │   └── config.ts                    # NAMESPACE_CORE_CONFIG
│   └── repositories/
│       └── in-memory-namespace.repository.ts
├── interfaces/
│   └── api/
│       └── namespace.controller.ts      # NamespaceController
├── index.ts
├── README.md
└── AGENT.md
```

---

## 6. 一句話總結

```
Slug 進來：deriveSlugCandidate → NamespaceSlug.create → existsBySlug → save

Slug 解析：findBySlug(slug, kind) → Namespace → route

Slug 變更：（未實作）更新 slug → 建立舊 slug 重定向紀錄
```

---

## 7. 變更記錄

| 版本 | 日期 | 變更說明 | 作者 |
|------|------|----------|------|
| v1.0.0 | 2026-03-20 | 初版建立，涵蓋 Namespace Core 目標架構、Namespace 資料模型、slug policy | xuanwu-app 架構委員會 |
