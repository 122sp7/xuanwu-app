---
name: implement-state-machine
description: 以 XState 實作有限狀態工作流 machine，放置於 application/machines/，定義業務語意的 state / event / transition，並與 Server Action 正確整合。
applyTo: 'src/modules/**/application/machines/**/*.{ts,tsx}'
agent: State Management Agent
argument-hint: 提供工作流名稱、所屬模組、初始狀態、所有業務狀態（idle/creating/ready/failed 等）、觸發事件、以及需要呼叫的 Server Action。
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'execute']
---

# Implement State Machine (XState)

## 職責判斷（先確認再實作）

XState machine 只適用於以下情境：

- 有明確的「進入狀態條件」與「離開狀態條件」的多步驟流程
- 非同步操作有 loading / success / failed / retry 四種以上可見狀態
- 流程需要 cancel、pause、resume 控制
- 表單 wizard 或多階段審批

若只是單一 loading flag → 用 TanStack Query 的 `isLoading` / `isError`。

## 輸入

- **Machine 名稱**：例如 `workspace-creation`、`document-review`
- **所屬模組**：例如 `workspace`、`notion`
- **States 清單**：每個業務狀態名稱（業務語意，非技術語意）
- **Events 清單**：觸發 transition 的事件名稱
- **Server Action**：每個 async invoke 對應哪個 Server Action
- **Context 欄位**：machine 需要追蹤的資料

## 工作流程

1. 讀取 `.github/instructions/state-management.instructions.md`，確認命名與放置規則。
2. 讀取 `.github/instructions/event-driven-state.instructions.md`，確認 Server Action 整合模式。
3. 建立 machine 檔案：
   - 路徑：`src/modules/<context>/application/machines/<noun>-<flow>.machine.ts`
4. 定義 machine 結構：
   - `id`：`<noun><Flow>` (camelCase)
   - `initial`：第一個業務狀態（通常是 `idle`）
   - `context`：型別化的 context 介面
   - `states`：每個業務狀態，以 `on` 定義 transitions
   - async invoke：用 `invoke.src` 呼叫 Server Action actor

```typescript
// src/modules/<context>/application/machines/<noun>-<flow>.machine.ts
import { createMachine, assign } from 'xstate';

interface <Name>Context {
  resultId: string | null;
  error: string | null;
}

export const <name>Machine = createMachine({
  id: '<name>',
  initial: 'idle',
  context: { resultId: null, error: null } as <Name>Context,
  states: {
    idle: {
      on: { SUBMIT: 'processing' },
    },
    processing: {
      invoke: {
        src: '<serverActionActor>',
        onDone: {
          target: 'ready',
          actions: assign({ resultId: ({ event }) => event.output.aggregateId }),
        },
        onError: {
          target: 'failed',
          actions: assign({ error: ({ event }) => String(event.error) }),
        },
      },
    },
    ready: {},
    failed: { on: { RETRY: 'idle' } },
  },
});
```

5. 若需要 React 整合，在 `interfaces/` 中建立對應的 hook：
   - 路徑：`src/modules/<context>/interfaces/hooks/use-<name>-machine.ts`
   - hook 以 `useMachine` 包裝，注入 Server Action actor

6. 確認 machine 不含任何：
   - Firebase SDK import
   - Business rule / invariant 邏輯
   - Domain aggregate 直接操作

## 輸出合約

- Machine 定義檔案（TypeScript，完整型別）
- 若需要 React 整合：`interfaces/hooks/use-<name>-machine.ts`
- Machine 的 context 型別介面

## 驗證

- `npm run lint` — 確認 machine 不在 `interfaces/` 定義（應在 `application/machines/`）
- `npm run build` — 確認型別一致

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-skill
#use skill zustand-xstate
