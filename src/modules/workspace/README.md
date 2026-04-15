# Workspace Module — 精簡蒸餾骨架

> **⚠ 蒸餾作業進行中**：`src/modules/workspace/` 正在從 `modules/workspace/`（完整 HEX+DDD 實作層）蒸餾而來。兩層職責不同，不可互換。
>
> `workspace-workflow` 子域已移除（2026-04-15）。其能力已分散至 task、issue、settlement、approval、quality、orchestration、task-formation。

**蒸餾狀態：** 🔨 進行中（task、issue、lifecycle、orchestration、membership 蒸餾中）

---

## 子域對照表（名詞域 → modules/ 來源）

> **子域設計原則：** 每個子域以**名詞**命名（`approval` 不用 `approve`；`schedule` 不用 `scheduling`；`share` 不用 `sharing`）。

| 子域 | 蒸餾來源（modules/workspace/subdomains/）| 狀態 | 說明 |
|---|---|---|---|
| `approval` | `approve` | 📋 待蒸餾 | 審批實體（審批流程與決策記錄）|
| `audit` | `audit` | 📋 待蒸餾 | 稽核紀錄實體 |
| `feed` | `feed` | 📋 待蒸餾 | 活動動態實體 |
| `issue` | `issue` | 🔨 進行中 | 議題實體（議題管理）|
| `lifecycle` | `lifecycle` | 🔨 進行中 | 生命週期實體（工作區生命週期）|
| `membership` | `membership` | 🔨 進行中 | 成員資格實體（Membership）|
| `orchestration` | `orchestration` | 🔨 進行中 | 跨子域編排（原 workspace-workflow）|
| `quality` | `quality` | 📋 待蒸餾 | 品質管控實體 |
| `schedule` | `scheduling` | 📋 待蒸餾 | 排程實體 |
| `settlement` | `settlement` | 📋 待蒸餾 | 結算實體 |
| `share` | `sharing` | 📋 待蒸餾 | 分享實體（對外發布）|
| `task` | `task` | 🔨 進行中 | 任務實體（任務管理）|
| `task-formation` | `task-formation` | 📋 待蒸餾 | 任務生成實體（AI 輔助 + 使用者確認流程）|

---

## 預期目錄結構（蒸餾後）

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
    lifecycle/                  ← 優先蒸餾
      domain/
      application/
      adapters/outbound/
    task/                       ← 優先蒸餾
    issue/                      ← 優先蒸餾
    membership/                 ← 優先蒸餾
    orchestration/              ← 優先蒸餾（WorkspaceFlowTab 等）
    approval/
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
| workspace 直接呼叫 Firestore | 必須透過 `platform/api/`（FileAPI、PermissionAPI）|

---

## 文件網絡

- [AGENT.md](AGENT.md) — Agent / Copilot 使用規則
- [src/modules/README.md](../README.md) — 蒸餾層總覽
- [modules/workspace/](../../../modules/workspace/) — 完整 HEX+DDD 實作層
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
