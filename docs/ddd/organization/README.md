# organization — 組織上下文

> **Domain Type:** Generic Subdomain  
> **模組路徑:** `modules/organization/`  
> **開發狀態:** ✅ Done — 穩定

## 在 Knowledge Platform / Second Brain 中的角色

`organization` 是平台多租戶治理層，負責定義團隊、成員與組織級關係。它把個人帳戶提升到群體協作層，為工作區與知識協作提供治理邊界。

## 主要職責

| 能力 | 說明 |
|---|---|
| 組織管理 | 建立與維護 Organization 聚合 |
| 成員與團隊治理 | 管理 MemberReference、Team 與組織內角色 |
| 邀請與夥伴協作 | 處理 PartnerInvite 與跨組織協作入口 |

## 與其他 Bounded Context 協作

- `account` 提供個人帳戶語意；`workspace` 以組織為主要歸屬邊界。
- `workspace-audit` 與 `notification` 會消費組織事件或範圍資訊。

## 核心聚合 / 核心概念

- **`Organization`**
- **`MemberReference`**
- **`Team`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
