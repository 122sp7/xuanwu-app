# interfaces/web — Web Driving Adapters

`web/` 是 **UI 封裝層**，負責 React / shadcn 畫面、hooks 與本地互動狀態。它可以組裝 workspace 的 public API，但不直接承擔 application 或 infrastructure 的流程細節。

> 新增的 UI component / hook 以收斂到這裡為原則；不要再把新的 driving adapter 散落在其他目錄。

---

## 目錄結構

```txt
interfaces/web/
	components/
		dialogs/
		cards/
		screens/
		tabs/
		rails/
		layout/
	hooks/
	workspace-nav-items.ts
	workspace-quick-access.tsx
	workspace-session.ts
	workspace-settings.ts
	workspace-supporting-records.ts
	workspace-tabs.ts
```

## ✅ 屬於此處

| 類型 | 範例 |
|------|------|
| Screen / route components | `components/screens/*` |
| Dialog / modal UI | `components/dialogs/*` |
| Summary / info cards | `components/cards/*` |
| Tab panes | `components/tabs/*` |
| Rail / side panel UI | `components/rails/*` |
| Layout helpers / sections | `components/layout/*` |
| React Hooks | `hooks/useWorkspaceHub.ts` |
| UI state / form draft mapping | `workspace-settings.ts` |

---

## ❌ 禁止放入

| 禁止項目 | 原因 |
|----------|------|
| 核心業務邏輯（Domain / Application） | 放 `domain/`、`application/` |
| Repository / Database / Genkit concrete call | 應透過 `@/modules/workspace/api` 或本地 api boundary 間接協作 |
| HTTP Route Handler | 放 `interfaces/api/` |
| CLI 命令解析 | 放 `interfaces/cli/` |

---

## 依賴箭頭

```txt
interfaces/web/components | hooks
	-> modules/workspace/api | ../api/*
modules/workspace/api
	-> interfaces/api/{contracts,facades,ui}
```

`interfaces/web` **不可**直接依賴 `infrastructure/*`、`application/*`、`domain/*`。