# IAM Module — Agent Guide

## Purpose

`src/modules/iam` 是 **IAM（Identity & Access Management）能力蒸餾骨架**，整合了原先分散在 `modules/iam/` 與 `modules/platform/`（account、organization 子域）的身份、存取控制、帳號、組織等能力。

**蒸餾來源：** `modules/iam/` + `modules/platform/subdomains/account/`（已遷入）+ `modules/platform/subdomains/organization/`（已遷入）  
**蒸餾狀態：** 🔨 進行中（account / organization 已從 platform 遷入 iam）

## 蒸餾子域清單

蒸餾來源 `modules/iam/subdomains/` 包含以下子域：

| 子域 | 來源 | 說明 | 蒸餾狀態 |
|---|---|---|---|
| `account` | `modules/iam/subdomains/account/`（原 platform/account）| 帳號 Profile 管理 | 🔨 進行中 |
| `access-control` | `modules/iam/subdomains/access-control/` | 存取控制規則 | 📋 待蒸餾 |
| `authentication` | `modules/iam/subdomains/authentication/` | 認證流程 | 📋 待蒸餾 |
| `authorization` | `modules/iam/subdomains/authorization/` | 授權決策 | 📋 待蒸餾 |
| `federation` | `modules/iam/subdomains/federation/` | SSO / 聯合身份 | 📋 待蒸餾 |
| `identity` | `modules/iam/subdomains/identity/` | 身份核心（Actor）| 📋 待蒸餾 |
| `organization` | `modules/iam/subdomains/organization/`（原 platform/org）| 組織 / 成員 / 團隊 | 🔨 進行中 |
| `security-policy` | `modules/iam/subdomains/security-policy/` | 安全策略 | 📋 待蒸餾 |
| `session` | `modules/iam/subdomains/session/` | 會話管理 | 📋 待蒸餾 |
| `tenant` | `modules/iam/subdomains/tenant/` | 租戶隔離 | 📋 待蒸餾 |

## 遷入說明

`platform/account` 與 `platform/organization` 子域已**完全遷入** `iam`：
- `modules/iam/subdomains/account/` — AccountProfile read-model（getProfile / updateProfile）
- `modules/iam/subdomains/organization/` — OrganizationTeam aggregate、成員管理、Team CRUD

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
- workspace 的 Membership 概念 → `modules/workspace/subdomains/membership/`

## 衝突防護（src/modules vs modules/）

| 情境 | 正確路徑 |
|---|---|
| 讀取邊界規則 / published language | `src/modules/iam/AGENT.md` |
| 撰寫新 use case / adapter / entity | `src/modules/iam/`（本層）|
| 跨模組 API boundary | `src/modules/iam/index.ts` |
| 查閱 account API（過渡期）| IAM 模組公開入口（詳見 README）|

**⚠ 蒸餾作業進行中 — 嚴禁事項：**
- ❌ 在 `modules/platform/subdomains/` 下新增 account / org 相關程式碼（已遷入 iam）
- ❌ 把 `src/modules/iam/` 當成 `modules/iam/` 的別名
- ❌ 在 `domain/` 匯入 Firebase SDK、React
- ❌ 混用 Actor（身份）與 User（業務角色）術語

## 文件網絡

- [README.md](README.md) — 蒸餾狀態與目錄結構
- [src/modules/README.md](../README.md) — 蒸餾層總覽
- [modules/iam/](../../../modules/iam/) — 完整 HEX+DDD 實作層（邊界規則權威）
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
