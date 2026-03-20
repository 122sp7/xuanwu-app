---
title: Schedule architecture
description: Target MDDD architecture for the bidirectional resource-request scheduling system, including the currently shipped scope, domain model, Firestore data model, state machines, and event-driven design.
---

# 排程模組架構規範

> **文件編號**：XUANWU-SCHED-SPEC-001
> **適用系統**：xuanwu-app — 雙向資源請求排程系統
> **版本**：v1.1.0
> **最後更新**：2026-03-20
> **維護責任方**：Schedule Module Owner / 平台架構委員會

---

## 0. 目前已上線範圍

目前已上線的是最小可運作切片（MVP write-side + projection），作為後續完整 MDDD 排程域的入口：

- **工作區 UI**：`modules/schedule/interfaces/components/WorkspaceScheduleTab.tsx`
  - 掛載位置：`modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx`
  - 功能：新增資源請求（`scheduleRequests` 寫入 + `scheduleMdddFlowProjections` 初始 projection）
- **組織 UI**：`app/(shell)/organization/schedule/page.tsx`
  - 待分派（`submitted` 狀態的 projection 清單）+ 月曆週視圖
- **開發契約**：`docs/reference/development-contracts/schedule-contract.md`

### 0.1 目前已交付（本輪完成）

| 切片 | 說明 | 路徑 |
|------|------|------|
| 資源請求提交 | 工作區提交請求，寫入 `scheduleRequests` | `FirebaseScheduleRequestRepository.submit()` |
| 初始 projection 建立 | 提交成功後立即建立 `RequestCreated` projection | `schedule-request.actions.ts` → `FirebaseMdddProjectionRepository.project()` |
| Projection 列表查詢 | 工作區查詢自身所有請求的 projection | `listWorkspaceScheduleMdddFlowProjections(workspaceId)` |
| 組織待分派視圖 | 跨工作區聚合 `submitted` 狀態請求 | `OrganizationSchedulePage` |
| 月曆週視圖 | 顯示已排程項目（`WorkspaceScheduleItem`） | `OrganizationSchedulePage` 月曆分頁 |

### 0.2 本輪不在交付範圍

以下仍屬後續階段，**本輪不假裝已完成**：

- 請求取消 / 審核拒絕流程（完整 MDDD `Request` 生命週期）
- 任務分解（`Task`）與候選人比對（`Match`）的完整引擎
- 人工分派（`Assignment` offer/accept/reject）的 UI
- 排程衝突偵測與時段重新分配
- 跨工作區 Notification 路由（`organization:schedule:assigned`）
- Temporal workflow 或 Cloud Functions 非同步觸發器

---

## 1. 核心設計原則

| 原則 | 說明 |
|------|------|
| **雙向分離** | 工作區負責 demand 側（提交需求），組織負責 supply 側（審核履行），兩側透過 projection 解耦 |
| **Event-Sourced Projection** | `scheduleMdddFlowProjections` 僅由 domain event 驅動更新，UI 只讀 projection，不直接讀 aggregate |
| **Aggregate 不可越界** | Request / Task / Assignment / Schedule 各自擁有獨立生命週期，不共享可變狀態 |
| **Skills 可選（workspace 端）** | 簡單資源請求不強制技能需求；完整 MDDD flow 使用時才強制驗證 |
| **Postiz 月曆類比** | 組織月曆視圖參照 Postiz calendar.tsx 的週視圖設計：24 小時橫列、每日欄位、今日高亮 |

---

## 2. 領域模型

### 2.1 核心聚合（Aggregates）

| 聚合 | 根實體 | 責任 | 主要欄位 |
|------|--------|------|----------|
| `RequestAggregate` | `Request` | 工作區需求的生命週期管理 | `requestId`, `workspaceId`, `organizationId`, `requiredSkills`, `status`, `notes` |
| `TaskAggregate` | `Task` | 可執行工作單元，由 Request 分解而來 | `taskId`, `requestId`, `requiredSkills`, `requiredHeadcount`, `status` |
| `MatchAggregate` | `Match` | 候選人評分與排名結果 | `matchId`, `taskId`, `candidateAccountUserId`, `score`, `rank` |
| `AssignmentAggregate` | `Assignment` | 任務與被分派人的決策生命週期 | `assignmentId`, `taskId`, `assigneeAccountUserId`, `status` |
| `ScheduleAggregate` | `Schedule` | 時段預留與執行計畫 | `scheduleId`, `assignmentId`, `calendarSlot`, `loadUnits`, `status` |

### 2.2 投影讀模型（Projection）

`ScheduleMdddFlowProjection` 是聚合跨狀態的跨段快照，供 UI 直接讀取：

| 欄位 | 類型 | 說明 |
|------|------|------|
| `requestId` | `string` | 請求唯一識別碼 |
| `workspaceId` | `string` | 所屬工作區 |
| `organizationId` | `string` | 所屬組織 |
| `requestStatus` | `RequestStatus` | 請求當前狀態 |
| `taskId` | `string \| null` | 對應任務 ID（Task 建立後填入） |
| `taskStatus` | `TaskStatus \| null` | 任務當前狀態 |
| `assignmentId` | `string \| null` | 對應分派 ID |
| `assignmentStatus` | `AssignmentStatus \| null` | 分派當前狀態 |
| `scheduleId` | `string \| null` | 對應排程 ID |
| `scheduleStatus` | `ScheduleStatus \| null` | 排程當前狀態 |
| `assigneeAccountUserId` | `string \| null` | 被分派人帳號 ID |
| `lastReason` | `string \| null` | 最近一次拒絕或取消原因 |
| `eventTypes` | `string[]` | 已發生的 domain event 類型列表 |
| `updatedAtISO` | `string` | 最近更新時間（ISO 8601） |

---

## 3. Firestore 資料模型

### 3.1 資源請求集合（`scheduleRequests`）

**Collection Path**：`/scheduleRequests/{requestId}`

| 欄位名 | 類型 | 必填 | 說明 |
|--------|------|------|------|
| `workspaceId` | `string` | ✅ | 提交請求的工作區 ID |
| `organizationId` | `string` | ✅ | 所屬組織 ID |
| `status` | `ScheduleRequestStatus` | ✅ | 請求狀態（`submitted` \| `cancelled` \| `closed`） |
| `requiredSkills` | `SkillRequirement[]` | ✅ | 所需技能清單（可為空陣列） |
| `proposedStartAtISO` | `string \| null` | ❌ | 期望開始時間 |
| `notes` | `string` | ✅ | 需求說明 |
| `submittedByAccountId` | `string` | ✅ | 提交者帳號 ID |
| `submittedAtISO` | `string` | ✅ | 提交時間（ISO 8601） |
| `createdAtISO` | `string` | ✅ | 建立時間 |
| `updatedAtISO` | `string` | ✅ | 最後更新時間 |

### 3.2 Projection 集合（`scheduleMdddFlowProjections`）

**Collection Path**：`/scheduleMdddFlowProjections/{requestId}`

欄位同 `ScheduleMdddFlowProjection` 介面定義。每次 domain event 透過 `FirebaseMdddProjectionRepository.project()` 以 `merge: true` 方式更新。

**重要**：Projection 由 domain event 驅動，不由 UI 直接寫入（唯一例外：`schedule-request.actions.ts` 在成功提交後立即寫入初始 `RequestCreated` projection 以確保可見性）。

### 3.3 MDDD Flow 集合（完整 flow 使用）

| 集合 | 說明 |
|------|------|
| `scheduleMdddRequests` | MDDD Request 聚合文件 |
| `scheduleMdddTasks` | MDDD Task 聚合文件 |
| `scheduleMdddMatches` | Match 評分結果 |
| `scheduleMdddAssignments` | Assignment 決策文件 |
| `scheduleMdddSchedules` | Schedule 時段文件 |

---

## 4. 狀態機

### 4.1 RequestStatus

```
draft ──→ submitted ──→ under-review ──→ accepted ──→ closed
                   ↘                 ↘
                    cancelled        rejected ──→ closed
```

| 狀態 | 觸發者 | 說明 |
|------|--------|------|
| `draft` | 工作區 | 草稿，尚未提交 |
| `submitted` | 工作區 | 已提交，等待組織審核 |
| `under-review` | 組織 | 審核中 |
| `accepted` | 組織 | 審核通過，進入任務分解 |
| `rejected` | 組織 | 審核拒絕 |
| `cancelled` | 工作區 | 提交前取消 |
| `closed` | 系統 | 已結束（完成或拒絕後關閉） |

### 4.2 TaskStatus

```
open ──→ matching ──→ assignable ──→ assigned ──→ scheduled ──→ completed
                                  ↘
                                   cancelled
```

### 4.3 AssignmentStatus

```
pending-review ──→ proposed ──→ accepted ──→ completed
                           ↘
                            rejected / cancelled
```

### 4.4 ScheduleStatus

```
planned ──→ reserved ──→ active ──→ completed
                    ↘
                     cancelled / conflicted
```

---

## 5. 事件驅動設計

### 5.1 已實作 Domain Events

| Event | 觸發時機 | 擁有聚合 |
|-------|----------|----------|
| `RequestCreated` | 請求提交成功後立即寫入 | `RequestAggregate` |
| `RequestAccepted` | 組織審核通過 | `RequestAggregate` |
| `RequestRejected` | 組織審核拒絕 | `RequestAggregate` |
| `TaskMatched` | 候選人比對完成 | `TaskAggregate` |
| `AssignmentAccepted` | 被分派人接受 | `AssignmentAggregate` |
| `AssignmentRejected` | 被分派人拒絕 | `AssignmentAggregate` |
| `ScheduleReserved` | 時段預留成功 | `ScheduleAggregate` |
| `ScheduleCancelled` | 時段取消 | `ScheduleAggregate` |
| `TaskCompleted` | 任務完成 | `TaskAggregate` |

### 5.2 Event 消費路徑

```
Domain Event
    │
    ↓
FirebaseMdddProjectionRepository.project(events)
    │
    ↓
scheduleMdddFlowProjections/{requestId}  ← UI 讀取此集合
```

---

## 6. 模組架構對映

```
modules/schedule/
├── domain/
│   ├── entities/          # ScheduleRequest, ScheduleItem, ScheduleEventType
│   ├── repositories/      # ScheduleRequestRepository (port interface)
│   ├── mddd/
│   │   ├── entities/      # Request, Task, Match, Assignment, Schedule
│   │   ├── value-objects/ # Projection, WorkflowStatuses, Requirements, Scheduling
│   │   ├── services/      # matching-engine, scheduling-engine
│   │   ├── events/        # ScheduleDomainEvents
│   │   └── repositories/  # MDDD port interfaces
├── application/
│   └── use-cases/
│       ├── submit-schedule-request.use-case.ts  # 目前已上線
│       └── mddd/
│           └── run-schedule-mddd-flow.use-case.ts  # 完整 MDDD flow
├── infrastructure/
│   └── firebase/
│       ├── FirebaseScheduleRequestRepository.ts   # scheduleRequests 集合
│       ├── FirebaseMdddProjectionRepository.ts    # scheduleMdddFlowProjections 集合
│       └── Firebase*Repository.ts (其餘 MDDD 集合)
└── interfaces/
    ├── _actions/
    │   ├── schedule-request.actions.ts  # 提交 + projection 初始化
    │   └── schedule-mddd.actions.ts
    ├── queries/
    │   ├── schedule-mddd.queries.ts     # listWorkspaceScheduleMdddFlowProjections
    │   └── schedule.queries.ts
    └── components/
        └── WorkspaceScheduleTab.tsx     # 工作區資源請求 UI
```

---

## 7. 比對：Postiz 月曆模型 vs Xuanwu 排程模型

Postiz 是社群媒體發文排程平台，其 `calendar.tsx`（1232 行）提供了成熟的週視圖月曆實作。以下是兩者設計的對映與借鑒點：

| Postiz 概念 | Xuanwu 對映 | 借鑒點 |
|-------------|-------------|--------|
| Post（待排程發文）| ScheduleRequest（資源請求）| 佔位符可點擊，顯示詳細資訊 |
| Calendar week grid | OrganizationSchedulePage 週月曆 | 24 小時橫列 + 每日欄位 |
| Post status badge | RequestStatus badge | 顏色映射狀態語意 |
| Temporal workflow | RunScheduleMdddFlowUseCase | 多步驟非同步 flow |
| Integration（平台）| Workspace（工作區）| 多來源聚合顯示 |
| Draft / Scheduled / Published | draft / submitted / accepted / closed | 類似單向狀態推進 |

---

## 8. 安全規則建議

```javascript
// firestore.rules — 排程集合存取控制（建議）
match /scheduleRequests/{requestId} {
  // 工作區成員可建立（組織成員驗證由應用層處理）
  allow create: if isAuthenticated();
  // 僅提交者和組織管理員可讀取
  allow read: if isAuthenticated() && (
    resource.data.submittedByAccountId == request.auth.uid ||
    isOrgAdmin(resource.data.organizationId)
  );
  // 不允許直接更新（由 Server Action 處理）
  allow update, delete: if false;
}

match /scheduleMdddFlowProjections/{requestId} {
  // 讀取：工作區成員（投影查詢由 server-side 過濾）
  allow read: if isAuthenticated();
  // 寫入：僅後端（Server Actions / Admin SDK）
  allow write: if false;
}
```

---

## 9. 索引設計

### 9.1 Firestore 複合索引（必要）

| Collection | 欄位組合 | 用途 |
|------------|----------|------|
| `scheduleMdddFlowProjections` | `workspaceId ASC` + `updatedAtISO DESC` | 工作區請求列表 |
| `scheduleMdddFlowProjections` | `organizationId ASC` + `requestStatus ASC` + `updatedAtISO DESC` | 組織待分派視圖 |
| `scheduleRequests` | `workspaceId ASC` + `submittedAtISO DESC` | 工作區歷史請求 |
| `scheduleRequests` | `organizationId ASC` + `status ASC` | 組織審核佇列 |

---

## 10. 變更記錄

| 版本 | 日期 | 變更說明 | 作者 |
|------|------|----------|------|
| v1.0.0 | 2026-03-20 | 初版建立，涵蓋 MVP write-side + projection 設計 | xuanwu-app 架構委員會 |
| v1.1.0 | 2026-03-20 | 補充 Postiz 月曆對映、Firestore 索引、安全規則、`requiredSkills` 可選說明 | Copilot |
