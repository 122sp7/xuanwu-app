---
name: implement-zustand-store
description: 實作 Zustand client state store，採用 State/Actions slice 模式，正確命名與放置，並確保不存放 server state 或 domain 資料。
applyTo: 'src/modules/**/interfaces/stores/**/*.{ts,tsx}'
agent: State Management Agent
argument-hint: 提供 store 名稱、所屬模組、要管理的 UI 狀態欄位，以及觸發 state 變更的操作清單。
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'execute']
---

# Implement Zustand Store

## 職責判斷（先確認再實作）

在開始前確認以下問題：

1. **這是 UI 狀態還是 server 資料？** 若是從 API 或 Firestore 取得的資料 → 用 TanStack Query，不要建 Zustand store。
2. **這是否跨越多步驟流程？** 若有明確 state machine 語意（idle/creating/failed 等）→ 用 XState，不要用 Zustand。
3. **這需要跨多個元件共享嗎？** 若只在單一元件內 → 用 `useState` 即可。

符合「跨元件 UI 偏好或瞬態 UI 資料」時，才建立 Zustand store。

## 輸入

- **Store 名稱**：例如 `panel`、`draft`、`sidebar`
- **所屬模組**：例如 `workspace`、`notion`
- **State 欄位**：欄位名稱與型別清單
- **Actions**：操作名稱與邏輯說明

## 工作流程

1. 讀取 `.github/instructions/state-management.instructions.md`，確認 slice 模式。
2. 確認放置路徑：
   - 模組內 UI state → `src/modules/<context>/interfaces/stores/<name>.store.ts`
   - Shell 全域 UI state → `src/app/(shell)/stores/<name>.store.ts`
3. 建立 store 檔案，採用 **State / Actions 兩個 slice**：

```typescript
// src/modules/<context>/interfaces/stores/<name>.store.ts
import { create } from 'zustand';

interface <Name>State {
  // state fields
}

interface <Name>Actions {
  // action signatures
}

export const use<Name>Store = create<<Name>State & <Name>Actions>((set) => ({
  // state initial values
  // action implementations
}));
```

4. 確認 store 不含任何：
   - 從 TanStack Query / fetch 取得的資料
   - Domain aggregate 或 entity 實例
   - Business rule 邏輯
5. 更新使用該 store 的元件或 hook，以 `use<Name>Store(selector)` 取值，避免整 store 訂閱。

## 輸出合約

- Store 檔案（完整 TypeScript，含型別）
- 使用端 hook/component 的更新

## 驗證

- `npm run lint` — 確認無 layer 違規（store 不得出現在 `domain/` 或 `application/`）
- `npm run build` — 確認型別一致

Tags: #use skill context7 #use skill serena-mcp #use skill repomix #use skill xuanwu-skill
#use skill zustand-xstate
