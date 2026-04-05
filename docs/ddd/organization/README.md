# organization — 組織上下文

> **Domain Type:** Generic Subdomain
> **模組路徑:** `modules/organization/`
> **開發狀態:** ✅ Done — 穩定

## 定位

`organization` 實作 Xuanwu 的**多租戶（Multi-tenancy）** 模型。一個 Organization 代表一個企業或團隊租戶，擁有多個成員（MemberReference）、隊伍（Team）與工作區（Workspace）。

## 職責

| 能力 | 說明 |
|------|------|
| Organization CRUD | 建立、更新、查詢組織 |
| 成員管理 | 邀請成員（PartnerInvite）、管理角色（Owner/Admin/Member/Guest） |
| Team 管理 | 建立 Team、指派成員 |
| 組織政策 | 管理組織層級的存取控制政策 |

## 核心概念

- **`Organization`** — 租戶聚合根，持有所有成員與隊伍的參照
- **`MemberReference`** — 成員的輕量參照物件（accountId + role + presence）
- **`Team`** — 組織內的子群組
- **`PartnerInvite`** — 邀請合作夥伴加入的邀請記錄

## 角色體系

```
OrganizationRole: Owner > Admin > Member > Guest
```

## 詳細文件

| 文件 | 說明 |
|------|------|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | Organization 聚合根設計 |
| [domain-events.md](./domain-events.md) | 領域事件 |
| [context-map.md](./context-map.md) | 與其他 BC 的整合關係 |
