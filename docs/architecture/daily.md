---
title: Daily architecture
description: Target architecture for Organization Daily and Workspace Daily, including the current digest baseline and Instagram-inspired value extraction.
---

# Daily 模組架構規範

> **文件編號**：XUANWU-DAILY-SPEC-001
> **適用系統**：xuanwu-app — Workspace Daily / Organization Daily
> **版本**：v1.0.0
> **最後更新**：2026-03-20
> **維護責任方**：Daily Module Owner / 平台架構委員會

---

## 0. 目前已上線範圍

目前 Daily 的**標準化基線**已經收斂為 **canonical authored-entry feed**，而不是只有 notification-driven digest：

- **Canonical command / query surface（目前標準）**
  - `publishDailyEntry(input)`：發布 `dailyEntries` canonical authored entry
  - `getWorkspaceDailyFeed(workspaceId)`：讀取單一 workspace 的 canonical feed
  - `getOrganizationDailyFeed(organizationId, workspaceIds)`：讀取組織層跨 workspace canonical feed
- **Workspace Daily UI**：`modules/workspace/interfaces/components/WorkspaceDailyTab.tsx`
  - 以 authored entries 為主畫面
  - 保留 `getWorkspaceDailyDigest(workspaceId, accountId)` 作為遷移對照
- **Organization Daily UI**：`app/(shell)/organization/daily/page.tsx`
  - 以 organization feed 為主畫面
  - 保留 `getOrganizationDailyDigest(organizationId, workspaceIds)` 作為遷移對照
- **目前資料邊界**：`modules/daily` 已有 canonical `dailyEntries` write-side、workspace / organization feed query，以及既有 notification-driven digest compatibility layer

### 0.1 目前收斂判斷

本輪對 Daily 的標準化判斷如下：

1. **Feed 是主體**：Workspace / Organization Daily 目前都以 canonical authored feed 為標準
2. **Digest 不是主體**：digest 僅保留為 compatibility layer，不再描述成目前 Daily 的核心產品形態
3. **未完成能力要明講**：ranking / interaction / promotion / projection materialization 未完成時，不用文件假裝已交付

### 0.2 本輪文件要解決的問題

本輪先建立 Daily 的設計、契約、開發指南與使用手冊，目的是在正式擴寫 Daily write-side 之前，先回答四件事：

1. **Workspace Daily 是什麼**：它不是單純通知盒，而是每個工作區的「今日敘事面」
2. **Organization Daily 是什麼**：它是組織層的「跨 Workspace feed」，用於掌握整體動能與風險
3. **Instagram 能抽取哪些價值**：保留 feed / story / profile / interaction 的產品機制，替換成工作協作語境
4. **如何在 MDDD 下落地**：保持 `UI -> Application -> Domain <- Infrastructure`，避免 Daily 再次退化成散落在 UI 的卡片集合

### 0.3 本輪不假裝已完成

以下能力目前**尚未完整實作**，本文件只定義方向與契約：

- 圖片 / 附件 / carousel 類型 Daily 卡片
- Reaction、bookmark、acknowledgement、comment thread
- 多因子 Ranking 與「你今天應該先看什麼」排序器（目前僅 freshness-only）
- Story / Highlight / Pin 等完整內容生命週期
- `selected_workspaces` 精準可見性投影
- Cross-workspace follow / subscribe / digest policy
- Daily 與 task / knowledge / schedule / billing / audit 的事件整合

---

## 1. 產品定位

### 1.1 Workspace Daily = Instagram 個人帳號的工作區版本

Workspace Daily 的角色，類似 Instagram 上單一創作者或品牌帳號的首頁 feed：

- 它代表某個工作區「今天發生了什麼」
- 它不是完整資料庫，而是今天值得被看見的內容排序結果
- 它需要同時容納 **人寫的內容** 與 **系統生成的訊號**
- 它的目標不是長文沉澱，而是讓其他人快速理解這個工作區現在的狀態、節奏與需求

因此，Workspace Daily 不應只顯示通知；它應逐步演化為一個由下列內容組成的工作區動態流：

- 進度更新（progress update）
- 風險與阻塞（blocker / risk）
- 需求與協作請求（ask / help wanted）
- 里程碑與成果（milestone / win）
- 系統事件（schedule changed / document approved / invoice overdue）

### 1.2 Organization Daily = 所有 Workspace Daily 的聚合視圖

Organization Daily 類似 Instagram 的多帳號觀察面板，但場景不是社群娛樂，而是組織經營：

- 顯示組織名下所有 Workspace Daily
- 幫助組織看見「哪個工作區有進展、哪個工作區有風險、哪個工作區需要支援」
- 不是把所有內容平鋪，而是要有 **跨 workspace 的排序與摘要能力**
- 是組織端協調 schedule、knowledge、audit、billing、notification 的前置入口之一

一句話定義：

> **Workspace Daily 是單一工作區的今日敘事面；Organization Daily 是所有工作區今日敘事的管理者 feed。**

---

## 2. 從 Instagram 抽取的產品價值

Daily 不需要複製 Instagram 的娛樂表面，但值得抽取其高價值機制。

| Instagram 機制 | Xuanwu Daily 對應 | 抽取的價值 |
| --- | --- | --- |
| Profile | Workspace identity + profile header | 讓每個 Workspace 有清楚的角色、領域、當前狀態與輸出風格 |
| Feed | Workspace Daily / Organization Daily | 以時間流 + 權重排序承載今天值得被看見的內容 |
| Story | 24 小時短訊號 / ephemeral updates | 承載短期提醒、緊急變更、臨時協作需求 |
| Highlight | Pinned Daily / recurring highlights | 將常態重要資訊從即時流提升為可回看入口 |
| Engagement | reaction / acknowledgement / bookmark | 讓組織知道哪些訊號已被看到、哪些需要回應 |
| Discovery | cross-workspace suggestions / related work | 讓其他工作區發現可協作對象、相似案例與可複用資源 |
| Ranking | organization priority feed | 將高風險、高影響、高緊急性的內容排到前面 |
| Social proof | visible momentum and consistency | 讓組織看見工作區是否持續輸出、是否健康運作 |

### 2.1 本次重點：不是模仿 UI，而是抽取經營機制

本次 Daily 的重點不在於做出 Instagram 風格卡片，而在於抽取其背後的產品機制：

1. **身份可辨識**：每個工作區必須像一個可被理解的主體
2. **內容有節奏**：Daily 是持續更新的流，不是一次性公告板
3. **系統會排序**：組織不可能讀完全部內容，必須幫他排出最值得先看的項目
4. **互動有回饋**：看到、回應、收藏、轉派都要成為顯性訊號
5. **短期 / 長期分層**：今天要看的訊號與值得長期保存的知識要分開

---

## 3. 核心設計原則

| 原則 | 說明 |
| --- | --- |
| **Workspace-first** | 任何 Daily 內容都必須能回到單一 Workspace 的敘事脈絡 |
| **Organization aggregation** | Organization Daily 只顯示組織名下 Workspace Daily，不直接越界聚合外部內容 |
| **Human + system co-authoring** | Daily 同時容納人工發布與系統生成訊號，但兩者需可辨識 |
| **Ephemeral by default** | Daily 先服務「今天應該看什麼」，不是取代 wiki 或 knowledge base |
| **Promotion path** | 值得長期保存的 Daily 內容需能升格為 Highlight、Knowledge 或 Task |
| **Explainable ranking** | 組織 feed 的排序需能解釋為何某條內容優先 |
| **Audience-aware visibility** | 內容必須有清楚受眾：workspace-only / organization / cross-workspace |
| **MDDD boundaries** | ranking、promotion、visibility 屬於 application / domain，不屬於 UI 硬編碼 |

---

## 4. 領域模型

### 4.1 核心聚合

| 聚合 | 根實體 | 責任 | 主要欄位 |
| --- | --- | --- | --- |
| `DailyEntryAggregate` | `DailyEntry` | 單筆 Daily 內容生命週期（草稿、發布、封存、升格） | `entryId`, `organizationId`, `workspaceId`, `authorId`, `entryType`, `status`, `visibility`, `publishedAtISO`, `expiresAtISO` |
| `DailyInteractionAggregate` | `DailyInteraction` | reaction / acknowledgement / bookmark / assignment 等互動軌跡 | `interactionId`, `entryId`, `actorId`, `interactionType`, `createdAtISO` |
| `DailyFeedProjection` | `DailyFeedItem` | 將 DailyEntry + system signal 摺疊成給 UI 讀取的 feed 項目 | `audienceKey`, `entryId`, `rankScore`, `rankReason`, `workspaceId`, `expiresAtISO` |
| `DailyPromotionAggregate` | `DailyPromotion` | 將 Daily 內容升格到 Knowledge / Task / Schedule / Audit 的關聯關係 | `promotionId`, `entryId`, `targetType`, `targetId`, `promotedBy`, `promotedAtISO` |

### 4.2 DailyEntry 類型

| 類型 | 說明 | 來源 |
| --- | --- | --- |
| `update` | 一般進度更新 | 人工 |
| `blocker` | 阻塞、風險、需要支援 | 人工 / 系統 |
| `ask` | 對組織或其他工作區提出協助需求 | 人工 |
| `milestone` | 里程碑、成果、完成事件 | 人工 / 系統 |
| `signal` | 由其他模組投影進來的事件摘要 | 系統 |
| `story` | 24 小時短訊號 | 人工 / 系統 |
| `highlight` | 被釘選或升格的長效內容 | 人工 / 系統 |

### 4.3 重要值物件

- `DailyVisibility`：`workspace_only | organization | selected_workspaces | public_demo`
- `DailyAudienceKey`：如 `workspace:{workspaceId}`、`organization:{organizationId}`
- `DailyRankReason`：風險、逾期、多人互動、組織關注、最新發布
- `DailyPromotionTarget`：`knowledge | task | schedule | audit | notification`

---

## 5. 讀寫模型

### 5.1 Canonical write-side

建議 Daily 寫入模型以 `DailyEntry` 為核心，而不是讓 UI 直接從 notification 清單拼出產品。

#### `dailyEntries`

**Collection Path**：`/dailyEntries/{entryId}`

| 欄位 | 類型 | 說明 |
| --- | --- | --- |
| `organizationId` | `string` | 所屬組織 |
| `workspaceId` | `string` | 所屬工作區 |
| `authorId` | `string` | 發布者帳號 |
| `entryType` | `DailyEntryType` | 內容類型 |
| `status` | `draft / published / archived / promoted` | 生命週期 |
| `visibility` | `DailyVisibility` | 受眾範圍 |
| `title` | `string` | 標題 |
| `summary` | `string` | 摘要 |
| `body` | `string` | 內文 |
| `media` | `DailyMedia[]` | 圖片 / 附件 / 連結 |
| `tags` | `string[]` | 主題標籤 |
| `publishedAtISO` | nullable `string` | 發布時間 |
| `expiresAtISO` | nullable `string` | Story / 短期訊號過期時間 |
| `sourceModule` | nullable `string` | 若為系統生成，標記來源模組 |
| `sourceEventId` | nullable `string` | 對應事件 |
| `createdAtISO` | `string` | 建立時間 |
| `updatedAtISO` | `string` | 更新時間 |

#### `dailyInteractions`

**Collection Path**：`/dailyInteractions/{interactionId}`

承載 seen / ack / bookmark / react / promote / reassign 等互動軌跡。

### 5.2 Read-side projections

#### `dailyFeedProjections`

**Collection Path**：`/dailyFeedProjections/{audienceKey}/items/{entryId}`

| 欄位 | 類型 | 說明 |
| --- | --- | --- |
| `audienceKey` | `string` | `workspace:{id}` 或 `organization:{id}` |
| `organizationId` | `string` | 所屬組織 |
| `workspaceId` | `string` | 所屬工作區 |
| `entryId` | `string` | DailyEntry ID |
| `entryType` | `string` | 類型 |
| `title` | `string` | 標題 |
| `summary` | `string` | 摘要 |
| `rankScore` | `number` | 排序分數 |
| `rankReason` | `string[]` | 排序原因 |
| `interactionSummary` | `object` | 已讀 / 收藏 / 回應統計 |
| `publishedAtISO` | `string` | 發布時間 |
| `expiresAtISO` | nullable `string` | 過期時間 |

### 5.3 目前 shipped read-side（基線）

目前 `modules/daily` 已存在的讀取介面如下：

- `WorkspaceDailyDigestEntity`
  - `workspaceId`
  - `accountId`
  - `summary: { total, unread }`
  - `items: DailyDigestItem[]`
- `OrganizationDailyDigestEntity`
  - `organizationId`
  - `summary: { total, unread }`
  - `items: DailyDigestItem[]`

這是可沿用的讀模型基線，但未來應逐步由 `dailyFeedProjections` 提供，而不是直接依賴 notification repository。

---

## 6. 排序與價值抽取策略

Organization Daily 的核心不是「列出全部」，而是「排出最值得先看的」。

### 6.1 Organization 排序因子

| 排序因子 | 說明 |
| --- | --- |
| `urgency` | blocker / overdue / pending decision 優先 |
| `impact` | 影響多個工作區或高價值目標的內容優先 |
| `freshness` | 當日新內容優先 |
| `engagement` | 多人已互動或被標記關注的內容優先 |
| `promotionPotential` | 可能升格為 task / knowledge 的內容優先 |
| `silenceRisk` | 長時間沒有更新但本應活躍的工作區提高權重 |

### 6.2 Workspace Daily 的經營信號

Workspace Daily 不只回答「今天有幾則通知」，還要回答：

- 這個 Workspace 最近是否持續更新？
- 這個 Workspace 目前是健康、停滯，還是有風險？
- 這個 Workspace 今天最值得被關注的 1-3 件事是什麼？
- 是否有內容值得升格到 Knowledge、Task 或 Schedule？

---

## 7. 模組架構對映

```text
modules/daily/
├── domain/
│   ├── entities/              # DailyEntry, DailyInteraction, DailyFeedItem
│   ├── value-objects/         # DailyVisibility, DailyAudienceKey, DailyRankReason
│   ├── services/              # ranking-policy, promotion-policy
│   └── repositories/          # DailyEntryRepository, DailyFeedRepository, DailyInteractionRepository
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
│       └── FirebaseDailyInteractionRepository.ts
└── interfaces/
    ├── _actions/              # publish / archive / promote / acknowledge
    ├── queries/               # workspace / organization feed query
    └── components/            # WorkspaceDailyTab, OrganizationDailyPage, future composer/feed cards
```

### 7.1 與其他模組的關係

| 模組 | Daily 如何取值 | Daily 如何回饋 |
| --- | --- | --- |
| `notification` | 目前最小基線來源 | 未來可用於 mention / alert / digest push |
| `schedule` | 排程變更、資源請求狀態可投影為 `signal` | Daily 中的 ask / blocker 可升格為 schedule demand |
| `knowledge` / `wiki` | Daily 條目可升格為長期知識 | wiki 可作為 highlight 的長效承接 |
| `task` | Daily 可承接 task 完成 / 阻塞事件 | Daily 內容可升格為待辦或 follow-up |
| `audit` | 關鍵 Daily 行為可留下 audit trail | audit 不等於 feed，但可提供可信追溯 |

---

## 8. 演進路線

### Phase 1：Digest baseline（已存在）

- 以通知資料生成 workspace / organization Daily digest
- UI 只做今日摘要顯示

### Phase 2：DailyEntry write-side（目前已落地最小切片）

- 支援 Workspace 主動發布 Daily 內容
- 建立 canonical `dailyEntries` 集合
- 組織端顯示跨 workspace feed
- 目前 Organization feed 以 freshness-only 排序，並保留 digest compatibility layer

### Phase 3：Ranking + interaction

- 加入 organization ranking policy
- 支援 ack / bookmark / reaction
- 引入 story / highlight / pin 機制

### Phase 4：Promotion + orchestration

- Daily 與 task / schedule / knowledge / audit 串聯
- 支援「從 Daily 升格為可執行事項」
- 建立組織營運儀表板級的 Daily intelligence

---

## 9. 成功標準

Daily 設計成功，不是因為它像 Instagram，而是因為它讓組織與工作區都更容易經營：

- 工作區能用更低成本持續表達今日狀態
- 組織能快速看見跨 workspace 的風險與機會
- 短期訊號不會淹沒長期知識
- 重要內容可從 feed 平滑升格到 knowledge / task / schedule
- Daily 成為組織營運節奏的一級入口，而非另一個孤立分頁
