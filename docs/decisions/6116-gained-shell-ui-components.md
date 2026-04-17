# 6116 Migration Gain — Shell UI 元件

- Status: Recorded
- Date: 2026-04-17
- Category: Migration Gain > platform

## Context

`xuanwu-skill`（新）新增了完整的 Shell UI 元件層，對應 `src/modules/platform/adapters/inbound/react/shell/`，共 13 個元件。這些元件在 `xuanwu-app-skill`（舊）中不存在。

### 新增的元件（`src/modules/platform/adapters/inbound/react/shell/`）

| 元件 | 職責 |
|---|---|
| `ShellRootLayout.tsx` | Shell 根佈局（app rail + sidebar + main content 三欄佈局） |
| `ShellAppRail.tsx` | 左側應用導航軌道（icon-based navigation） |
| `ShellDashboardSidebar.tsx` | 儀表板側邊欄（workspace/notebook 列表） |
| `ShellSidebarBody.tsx` | 側邊欄主體內容區域 |
| `ShellSidebarHeader.tsx` | 側邊欄頭部（workspace 切換器） |
| `ShellSidebarNavData.tsx` | 導航資料提供者元件 |
| `ShellContextNavSection.tsx` | 情境導航章節（根據當前路由顯示不同快捷導航） |
| `ShellGuard.tsx` | 認證守衛（使用 iam AuthContext，未認證時重定向） |
| `ShellUserAvatar.tsx` | 使用者 Avatar + 下拉選單（登出、設定） |
| `AccountSwitcher.tsx` | 帳號/組織切換器（Base UI DropdownMenu） |
| `CreateOrganizationDialog.tsx` | 建立組織對話框 |
| `ShellLanguageSwitcher.tsx` | 語言切換器 |

以及 `src/modules/platform/adapters/inbound/react/` 下的：

| 元件 | 職責 |
|---|---|
| `AccountScopeProvider.tsx` | 帳號作用域 Provider（整合 Firebase Auth + Account 訂閱） |
| `ShellFrame.tsx` | ShellLayout re-export wrapper |

### 舊版情況

`xuanwu-app-skill` 的 `modules/platform/` 只有 domain + application + infrastructure（API 合約層），沒有任何 React UI 元件。Shell UI 是 `src/app/(shell)/layout.tsx` 直接組裝的 stub 佔位。

### 架構意義

這批元件的加入使 platform 模組從純業務邏輯層進化為同時承載 Shell UI composition 的 interfaces 層。這符合 `architecture-core.instructions.md` 中「interfaces/ 負責 UI wiring」的定義。

## Decision

此為已實作並穩定的功能，**不需要額外動作**。

## Consequences

- Shell UI 元件由 platform 模組統一擁有，消費者（`src/app/`）只需掛載不需要實作細節。
- `AccountScopeProvider` 整合了 Firebase Auth 訂閱，是 AccountSwitcher 和 WorkspaceScopeProvider 的上游 Provider。

## 關聯 ADR

- **6109** workspace interfaces 層：Shell 導航需要 workspace 功能的 UI 元件，目前缺失。
- **0015** api/ 層移除：Shell 元件作為 platform 的 interfaces 層，是 api/ 移除後的正確位置。
