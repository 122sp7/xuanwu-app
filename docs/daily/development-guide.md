---
title: Daily module development guide
description: Developer guide for building Workspace Daily and Organization Daily within Xuanwu MDDD boundaries.
---

# Daily 模組開發指南

> **文件版本**：v1.0.0
> **最後更新**：2026-03-20
> **目標讀者**：參與 `modules/daily`、Workspace Daily、Organization Daily 的工程師

---

## 前置閱讀

開始任何 Daily 實作前，請先閱讀：

1. **架構規範**：`docs/architecture/daily.md`
2. **開發契約**：`docs/reference/development-contracts/daily-contract.md`
3. **整體架構指南**：`ARCHITECTURE.md`

---

## 1. 先理解目前基線

目前 Daily 已存在的實作，包含 **notification-driven digest baseline** 與 **canonical authored entry baseline**：

- `modules/daily/domain/entities/DailyDigest.ts`
- `modules/daily/application/use-cases/daily-digest.use-cases.ts`
- `modules/daily/infrastructure/default/DefaultDailyDigestRepository.ts`
- `modules/daily/interfaces/queries/daily-digest.queries.ts`
- `modules/daily/domain/entities/DailyEntry.ts`
- `modules/daily/domain/entities/DailyFeed.ts`
- `modules/daily/domain/repositories/DailyEntryRepository.ts`
- `modules/daily/domain/repositories/DailyFeedRepository.ts`
- `modules/daily/application/use-cases/publish-daily-entry.use-case.ts`
- `modules/daily/application/use-cases/list-daily-feed.use-cases.ts`
- `modules/daily/infrastructure/firebase/FirebaseDailyEntryRepository.ts`
- `modules/daily/infrastructure/firebase/FirebaseDailyFeedRepository.ts`
- `modules/daily/interfaces/queries/daily-feed.queries.ts`
- `modules/daily/interfaces/_actions/daily.actions.ts`
- `modules/workspace/interfaces/components/WorkspaceDailyTab.tsx`
- `app/(shell)/organization/daily/page.tsx`

這個基線的價值在於：

- 已經證明 Workspace / Organization 兩層 Daily UI 入口存在
- 已經證明 Organization Daily 的聚合邏輯需要 `organizationId + workspaceIds`
- 已經提供最小 `DailyDigestItem` 形狀，供後續遷移時相容

但它**不是最終架構**。未來不要繼續把 Daily 視為 notification list 的另一個外觀，也不要把目前的 freshness-only feed 誤認為完整 projection / ranking 實作。

---

## 2. 實作 Daily 時的邊界規則

```text
interfaces (actions / queries / components)
    ↓
application (use-cases)
    ↓
domain (entities / value objects / services / repositories)
    ↑
infrastructure (Firestore / adapter / projection)
```

### 絕對禁止

- `domain/` 直接依賴 notification、Firestore、React、Next.js
- `application/` 直接返回 UI component 所需的硬編碼樣式資料
- `interfaces/components/` 直接拼接其他模組的原始資料再自行排序
- 用 UI 邏輯偷偷實作 Organization ranking
- 把 Instagram 的互動樣式複製成前端效果，卻沒有對應的 domain / contract

### 必須做到

- Daily 的排序、可見性、升格規則寫在 domain / application
- authored entry 與 system signal 都透過 Daily 模組自己的契約對齊
- Organization Daily 一律明確保留 `workspaceId`
- Workspace Daily 與 Organization Daily 共用同一套 canonical entry 與 projection 概念

---

## 3. 建議模組結構

```text
modules/daily/
├── domain/
│   ├── entities/
│   │   ├── DailyEntry.ts
│   │   ├── DailyInteraction.ts
│   │   └── DailyFeedItem.ts
│   ├── value-objects/
│   │   ├── DailyVisibility.ts
│   │   ├── DailyAudienceKey.ts
│   │   └── DailyRankReason.ts
│   ├── services/
│   │   ├── rank-daily-feed.ts
│   │   └── normalize-daily-signal.ts
│   └── repositories/
│       ├── DailyEntryRepository.ts
│       ├── DailyFeedRepository.ts
│       ├── DailyInteractionRepository.ts
│       └── DailyPromotionRepository.ts
├── application/
│   └── use-cases/
│       ├── publish-daily-entry.use-case.ts
│       ├── list-workspace-daily-feed.use-case.ts
│       ├── list-organization-daily-feed.use-case.ts
│       ├── acknowledge-daily-entry.use-case.ts
│       └── promote-daily-entry.use-case.ts
├── infrastructure/
│   └── firebase/
│       ├── FirebaseDailyEntryRepository.ts
│       ├── FirebaseDailyFeedProjectionRepository.ts
│       ├── FirebaseDailyInteractionRepository.ts
│       └── FirebaseDailyPromotionRepository.ts
└── interfaces/
    ├── _actions/
    ├── queries/
    └── components/
```

---

## 4. 新增 Daily 功能的推薦順序

### 4.1 先做 canonical entry，再做 UI 美化

推薦順序：

1. 定義 `DailyEntry` / `DailyInteraction` / `DailyFeedItem` 契約
2. 實作 repository ports
3. 實作 publish / list / acknowledge use cases
4. 建立 feed projection
5. 再改 Workspace / Organization UI

不要反過來先畫卡片，再回頭硬湊資料模型。

### 4.2 先做 Workspace 發布，再做 Organization ranking

功能落地建議：

1. **Workspace 發布 DailyEntry** ✅
2. **Workspace feed 讀取自己的 canonical feed repository** ✅
3. **Organization 聚合所有 workspace feed** ✅（目前 freshness-only）
4. **加入 ranking / interaction / promotion** ⏳

原因是 Organization Daily 的價值來自 Workspace Daily 的存在，沒有穩定單點 feed，就不應先做跨 workspace 智慧排序。

---

## 5. 常見實作模式

### 5.1 發布 DailyEntry

步驟：

1. 在 `domain/repositories/` 定義 `DailyEntryRepository`
2. 在 `application/use-cases/` 實作 `PublishDailyEntryUseCase`
3. 在 `infrastructure/firebase/` 實作 Firestore adapter
4. 在 `interfaces/_actions/` 暴露 server action
5. 在 `interfaces/queries/` 與 `components/` 使用新的 read-side projection

### 5.2 投影其他模組事件為 Daily signal

如果要把 `schedule`、`task`、`knowledge` 等事件投影到 Daily，請遵守：

1. 先在 Daily domain 定義 `signal` 型別 entry 的最小必要欄位
2. 在 application 層做 event normalization
3. 在 infrastructure 層消費原始事件來源
4. 最後輸出為 **Daily 自己的 entry shape**

**不要**直接把其他模組的 DTO 原封不動塞進 Daily UI。

### 5.3 Organization ranking

Organization Daily 排序策略要放在：

- `domain/services/rank-daily-feed.ts`：純排序規則
- `application/use-cases/list-organization-daily-feed.use-case.ts`：組合 workspace feed + ranking + filters

UI 只負責顯示：

- 這條 entry 來自哪個 workspace
- 為何排在前面（`rankReason`）
- 目前互動狀態

---

## 6. 與 Instagram 類比時的工程準則

Instagram 的價值是產品機制，不是 CSS 風格。

### 可以抽取

- feed / story / highlight 的內容分層
- profile-first 的身份表達
- interaction signal 對排序與治理的回饋
- ranking 對注意力配置的影響
- discovery 對跨 workspace 協作的促進

### 不要直接照搬

- 無意義的愛心數或社交炫耀設計
- 以流量最大化為目標的黑盒排序
- 過度 client-side 動畫與沉浸式 UI
- 脫離工作語境的追蹤 / 推薦邏輯

Daily 在 Xuanwu 的目標是 **更好的營運可見性**，不是社群停留時間。

---

## 7. 遷移現有 digest 的建議

現有 `DailyDigestItem` 可以作為過渡層，但請用「包裝兼容」而不是「永久綁死」。

建議遷移方式：

1. 新增 `DailyEntry` / `DailyFeedItem`
2. 保留 `getWorkspaceDailyDigest()` / `getOrganizationDailyDigest()` 作為 compatibility facade
3. 目前新增 `getWorkspaceDailyFeed()` / `getOrganizationDailyFeed()` 作為 canonical authored feed query
4. 後續再讓 feed query 轉向 `dailyFeedProjections`
5. 最後再決定是否保留 digest 命名或切換到 feed 命名

這樣可以避免一次性重寫所有 UI。

---

## 8. Firestore 與資料治理注意事項

- 使用 `@/infrastructure/firebase` 作為 Firebase 標準 wrapper import
- Write-side collection 與 read-side projection collection 分離
- `Organization Daily` 查詢必須明確帶入 `organizationId`
- 不要讓 `workspaceId` 缺失，因為組織聚合視圖需要保留來源
- `story` / ephemeral 類型必須有 `expiresAtISO`
- 對 `acknowledged` / `bookmarked` 類互動要做 idempotent 設計

---

## 9. 驗證建議

在 Daily 開發過程中，至少檢查：

1. Workspace Daily 是否只顯示該 workspace 可見內容
2. Organization Daily 是否只聚合組織名下 workspace
3. ranking 是否可解釋
4. promotion 是否保留來源追溯
5. 舊有 digest UI 是否仍可正常顯示

若修改涉及應用程式邏輯或 UI，依倉庫基線執行：

- `npm run lint`
- `npm run build`

---

## 10. 實作時最容易犯的錯

### 錯誤 1：把 Daily 當通知列表皮膚

Daily 應該是產品層的 feed，不只是 notification 的另一個 tab。

### 錯誤 2：把 Organization Daily 做成平鋪列表

Organization Daily 的核心價值是 **聚合 + 排序 + 解釋**，不是把所有 workspace 動態直接列出。

### 錯誤 3：把重要內容永遠困在 Daily

Daily 是今天的入口；值得長期保存的內容要能升格到 knowledge、task、schedule、audit。

### 錯誤 4：UI 自己決定業務優先序

如果優先序只存在於 React component 裡，未來就無法被重用、測試或治理。
