# IAM Module — Agent Guide

## Purpose

`src/modules/iam` 是 **IAM（Identity & Access Management）模組**，整合了身份、存取控制、帳號、組織等能力（含原先分散在 `platform/account`、`platform/organization` 的子域）。

## 子域清單

| 子域 | 說明 | 狀態 |
|---|---|---|
| `account` | 帳號 Profile 管理 | ✅ 完成 |
| `access-control` | 存取控制規則 | ✅ 完成 |
| `authentication` | 認證流程 | ✅ 完成 |
| `authorization` | 授權決策 | ✅ 完成 |
| `federation` | SSO / 聯合身份 | ✅ 完成 |
| `identity` | 身份核心（Actor）| ✅ 完成 |
| `organization` | 組織 / 成員 / 團隊（原 platform/org）| ✅ 完成 |
| `security-policy` | 安全策略 | ✅ 完成 |
| `session` | 會話管理 | ✅ 完成 |
| `tenant` | 租戶隔離 | ✅ 完成 |

## 遷入說明

`platform/account` 與 `platform/organization` 子域已**完全遷入** `iam`：
- `src/modules/iam/subdomains/account/` — AccountProfile read-model（getProfile / updateProfile）
- `src/modules/iam/subdomains/organization/` — OrganizationTeam aggregate、成員管理、Team CRUD

## Boundary Rules

- `domain/` 禁止匯入 React、Firebase SDK、HTTP client 或任何框架。
- `organization/` 使用 `OrganizationTeam` aggregate；不得混用 `Actor`（身份）與 `Membership`（工作區參與）術語。
- `identity` 是唯一定義 Actor 概念的子域。

## Route Here When

- 撰寫 IAM 的新 use case、entity、adapter 實作（account、session、access-control 等）。
- 擴展 organization 子域的 team / member 功能。

## Route Elsewhere When

- 讀取邊界規則 → `src/modules/iam/AGENT.md`
- 跨模組 API boundary → `src/modules/iam/index.ts`
- workspace 的 Membership 概念 → `src/modules/workspace/subdomains/membership/`

## 路由規則

| 情境 | 正確路徑 |
|---|---|
| 讀取邊界規則 / published language | `src/modules/iam/AGENT.md` |
| 撰寫新 use case / adapter / entity | `src/modules/iam/`（本層）|
| 跨模組 API boundary | `src/modules/iam/index.ts` |

**嚴禁事項：**
- ❌ 在 `src/modules/platform/subdomains/` 下新增 account / org 相關程式碼（已遷入 iam）
- ❌ 在 `domain/` 匯入 Firebase SDK、React
- ❌ 混用 Actor（身份）與 User（業務角色）術語

## 文件網絡

- [README.md](README.md) — 模組目錄結構
- [src/modules/README.md](../README.md) — 模組層總覽
- [docs/structure/domain/bounded-contexts.md](../../../docs/structure/domain/bounded-contexts.md) — 主域所有權地圖
