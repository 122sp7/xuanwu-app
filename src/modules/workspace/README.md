# Workspace Module — 精簡蒸餾骨架

> **⚠ 蒸餾作業進行中**：`src/modules/workspace/` 正在從 `modules/workspace/`（完整 HEX+DDD 實作層）蒸餾而來。兩層職責不同，不可互換。
>
> `workspace-workflow` 子域已移除（2026-04-15）。其能力已分散至 task、issue、settlement、approve、quality、orchestration、task-formation。

**蒸餾狀態：** 🔨 進行中（task、issue、lifecycle、orchestration、membership 蒸餾中）

---

## 子域對照表（modules → src/modules）

| 子域 | 蒸餾來源 | 狀態 | 說明 |
|---|---|---|---|
| `approve` | `modules/workspace/subdomains/approve/` | 📋 待蒸餾 | 審批流程 |
| `audit` | `modules/workspace/subdomains/audit/` | 📋 待蒸餾 | 稽核紀錄 |
| `feed` | `modules/workspace/subdomains/feed/` | 📋 待蒸餾 | 活動動態 |
| `issue` | `modules/workspace/subdomains/issue/` | 🔨 進行中 | 議題管理 |
| `lifecycle` | `modules/workspace/subdomains/lifecycle/` | 🔨 進行中 | 工作區生命週期 |
| `membership` | `modules/workspace/subdomains/membership/` | 🔨 進行中 | 成員資格 |
| `orchestration` | `modules/workspace/subdomains/orchestration/` | 🔨 進行中 | 跨子域流程編排 |
| `quality` | `modules/workspace/subdomains/quality/` | 📋 待蒸餾 | 品質管控 |
| `scheduling` | `modules/workspace/subdomains/scheduling/` | 📋 待蒸餾 | 排程 |
| `settlement` | `modules/workspace/subdomains/settlement/` | 📋 待蒸餾 | 結算 / 交割 |
| `sharing` | `modules/workspace/subdomains/sharing/` | 📋 待蒸餾 | 分享 / 對外發布 |
| `task` | `modules/workspace/subdomains/task/` | 🔨 進行中 | 任務管理 |
| `task-formation` | `modules/workspace/subdomains/task-formation/` | 📋 待蒸餾 | AI 輔助任務生成 |

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
    approve/
    settlement/
    quality/
    task-formation/
    scheduling/
    sharing/
    feed/
    audit/
```

---

## 衝突防護

| 禁止行為 | 原因 |
|---|---|
| 新建或恢復 `workspace-workflow` 子域 | 已拆解，禁止回歸 |
| 混用 Membership（工作區參與）與 Actor（身份）術語 | 違反 Ubiquitous Language |
| workspace 直接呼叫 Firestore | 必須透過 `platform/api/`（FileAPI、PermissionAPI）|

---

## 文件網絡

- [AGENT.md](AGENT.md) — Agent / Copilot 使用規則
- [src/modules/README.md](../README.md) — 蒸餾層總覽
- [modules/workspace/](../../../modules/workspace/) — 完整 HEX+DDD 實作層
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
