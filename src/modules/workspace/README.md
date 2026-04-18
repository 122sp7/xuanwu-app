# Workspace Module

> `workspace-workflow` 子域已移除（2026-04-15）。其能力已分散至 task、issue、settlement、approval、quality、orchestration、task-formation。

## 子域清單（名詞域）

> **子域設計原則：** 每個子域以**名詞**命名（`approval` 不用 `approve`；`schedule` 不用 `scheduling`；`share` 不用 `sharing`）。

| 子域 | 狀態 | 說明 |
|---|---|---|
| `activity` | 🔨 骨架建立，實作進行中 | 活動記錄實體 |
| `api-key` | 🔨 骨架建立，實作進行中 | API 金鑰生命週期 |
| `approval` | 🔨 骨架建立，實作進行中 | 審批實體（審批流程與決策記錄）|
| `audit` | 🔨 骨架建立，實作進行中 | 日誌紀錄實體 |
| `feed` | 🔨 骨架建立，實作進行中 | 活動動態實體 |
| `invitation` | 🔨 骨架建立，實作進行中 | 邀請實體（邀請連結、邀請狀態）|
| `issue` | 🔨 骨架建立，實作進行中 | 議題實體（議題管理）|
| `lifecycle` | 🔨 骨架建立，實作進行中 | 生命週期實體（工作區生命週期）|
| `membership` | 🔨 骨架建立，實作進行中 | 成員資格實體（Membership）|
| `orchestration` | 🔨 骨架建立，實作進行中 | 跨子域編排（原 workspace-workflow）|
| `quality` | 🔨 骨架建立，實作進行中 | 品質管控實體 |
| `resource` | 🔨 骨架建立，實作進行中 | 資源實體（工作區資源配額與管理）|
| `schedule` | 🔨 骨架建立，實作進行中 | 排程實體 |
| `settlement` | 🔨 骨架建立，實作進行中 | 結算實體 |
| `share` | 🔨 骨架建立，實作進行中 | 分享實體（對外發布）|
| `task` | 🔨 骨架建立，實作進行中 | 任務實體（任務管理）|
| `task-formation` | 🔨 骨架建立，實作進行中 | 任務生成實體（AI 輔助 + 使用者確認流程）|

---

## 目錄結構

```
src/modules/workspace/
  index.ts
  README.md
  AGENT.md
  orchestration/
    WorkspaceFacade.ts
    WorkspaceCoordinator.ts     ← 跨子域流程（task→settlement 等）
  shared/
    domain/index.ts             ← WorkspaceId、MembershipRef 等共用 VO
    events/index.ts             ← Published Language Events
    types/index.ts
  subdomains/
    lifecycle/
      domain/
      application/
      adapters/outbound/
    task/
    issue/
    membership/
    orchestration/
    activity/
    api-key/
    approval/
    invitation/
    resource/
    settlement/
    quality/
    task-formation/
    schedule/
    share/
    feed/
    audit/
```

---

## 衝突防護

| 禁止行為 | 原因 |
|---|---|
| 新建或恢復 `workspace-workflow` 子域 | 已拆解，禁止回歸 |
| 使用 `approve` / `scheduling` / `sharing` 作為子域名 | 已更正為名詞（`approval` / `schedule` / `share`）|
| 混用 Membership（工作區參與）與 Actor（身份）術語 | 違反 Ubiquitous Language |
| workspace 直接呼叫 Firestore | 必須透過 `src/modules/platform/index.ts`（FileAPI、PermissionAPI）|

---

## 文件網絡

- [AGENT.md](AGENT.md) — Agent / Copilot 使用規則
- [src/modules/README.md](../README.md) — 模組層總覽
- [docs/structure/domain/bounded-contexts.md](../../../docs/structure/domain/bounded-contexts.md) — 主域所有權地圖
