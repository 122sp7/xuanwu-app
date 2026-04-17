# 6117 Migration Gain — `packages/ui-shadcn`

- Status: Recorded
- Date: 2026-04-17
- Category: Migration Gain > packages

## Context

`xuanwu-skill`（新）新增了 `packages/ui-shadcn`，包含 70+ 個 shadcn/ui 元件。這個 package 在 `xuanwu-app-skill`（舊）中不存在。

### 新增內容

```
packages/ui-shadcn/
  src/
    components/
      accordion.tsx, alert.tsx, alert-dialog.tsx, aspect-ratio.tsx,
      avatar.tsx, badge.tsx, breadcrumb.tsx, button.tsx, calendar.tsx,
      card.tsx, carousel.tsx, checkbox.tsx, collapsible.tsx, command.tsx,
      context-menu.tsx, dialog.tsx, drawer.tsx, dropdown-menu.tsx,
      form.tsx, hover-card.tsx, input.tsx, input-otp.tsx, label.tsx,
      menubar.tsx, navigation-menu.tsx, pagination.tsx, popover.tsx,
      progress.tsx, radio-group.tsx, resizable.tsx, scroll-area.tsx,
      select.tsx, separator.tsx, sheet.tsx, sidebar.tsx, skeleton.tsx,
      slider.tsx, sonner.tsx, switch.tsx, table.tsx, tabs.tsx,
      textarea.tsx, toggle.tsx, toggle-group.tsx, tooltip.tsx,
      ...（共 70+ 個元件）
    lib/
      utils.ts    ← cn() utility
    index.ts
  package.json    ← alias: @ui-shadcn
```

### 舊版情況

`xuanwu-app-skill` 的 packages 中沒有集中的 UI 元件 package。Shell 元件和業務元件都使用各自的本地 import 路徑引入 shadcn/ui 元件。

### 架構意義

`packages/ui-shadcn` 的存在使 UI 元件的依賴關係集中管理：
- 所有 `src/modules/*/interfaces/` 和 `src/app/` 通過 `@ui-shadcn` alias 引入元件，而非直接 `@/components/ui`。
- 版本升級和客製化只需在一個 package 內進行。
- ESLint 邊界規則可確保 `domain/` 和 `application/` 層不引入 `@ui-shadcn`（見 `eslint.config.mjs`）。

## Decision

此為已實作並穩定的功能，**不需要額外動作**。

## Consequences

- 所有新元件應優先查找 `@ui-shadcn` 是否已有對應元件，再考慮自建。
- 若需客製化 shadcn 元件外觀，應在 `packages/ui-shadcn/src/components/` 中修改，而非在消費方 patch。

## 關聯 ADR

- **6116** Shell UI 元件：ShellAppRail、AccountSwitcher 等 Shell 元件使用 `@ui-shadcn` 元件。
- **6113** 消失的 packages：`packages/ui-vis` 中的視覺化元件（D3.js 系）無法由 `@ui-shadcn` 覆蓋，仍需獨立補充。
