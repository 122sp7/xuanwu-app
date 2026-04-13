# 2300 Temporal Coupling

- Status: Accepted
- Date: 2026-04-13
- Category: Coupling Smells > Temporal Coupling

## Context

時序耦合（Temporal Coupling）指某一操作正確執行依賴另一操作必須**先**執行，但這個依賴關係**沒有在類型系統或介面中顯式表達**。調用方必須「知道正確的呼叫順序」才能正確使用。

掃描後發現兩類時序耦合：

### 類型一：延遲初始化 singleton 的隱式初始化順序

```typescript
// workspace-runtime.ts
let _sessionContext: ReturnType<typeof createWorkspaceSessionContext> | undefined;

function getSessionContext() {
  if (!_sessionContext) {
    const platformApi = require("@/modules/platform/api"); // 延遲載入破壞循環
    // ...
    _sessionContext = createWorkspaceSessionContext(...);
  }
  return _sessionContext;
}
```

使用 `getSessionContext()` 的任何呼叫者，必須在 platform/api 完全初始化**之後**才能呼叫，否則 `require()` 得到的是部分初始化的 module。這個前提條件沒有在型別中表達——呼叫方看不到這個時序需求。

同類問題存在於：
- `organization-service.ts: getTeamPort()` — 必須等 team module 初始化
- `identity-token-refresh.adapter.ts: getEmitFn()` — 必須等 identity module 初始化
- `account-profile-service.ts: getLegacyDataSource()` — 必須等 account module 初始化

### 類型二：Use Case 流程中的隱式步驟順序依賴

根據 ADR 0010，`Workspace.create()` 不在 aggregate 內部觸發事件，而是依賴 use-case 在外部按正確順序（1. 持久化，2. 組裝事件，3. 發布）執行。這就是時序耦合：use-case 呼叫者必須「知道」不能跳過中間步驟。

### 危害

1. **文件依賴**：時序需求無法從型別推導，只能靠代碼注釋或文件，容易在重構時遺忘。
2. **測試困難**：測試必須模擬正確的初始化順序，否則 singleton 處於 undefined 狀態。
3. **啟動耦合**：`platform/api` 的初始化速度決定了 workspace 能否正常啟動，耦合了兩個主域的啟動時序。

## Decision

1. **消除隱式初始化順序**：
   - 用 Constructor DI 替代 `require()` 延遲載入——在創建時就注入依賴，而非在第一次呼叫時才解析。
   - 或使用 async factory（`createWorkspaceRuntime()`）明確標示需要等待初始化完成。
2. **時序前提條件要在型別中可見**：
   - 若確實需要延遲初始化，應用 `Promise<T>` 或 builder pattern，讓型別表達「需要 await 初始化」。
   - 禁止 `let _xxx: T | undefined`，改為 `late(() => T)`（函式包裝）或 explicit initialization 方法。
3. **Aggregate domain event 時序（ADR 0010 補充）**：use-case 的事件收集必須是聚合根的責任（aggregate 收集事件），use-case 只需在 `save()` 後呼叫 `pullDomainEvents()`——消除 use-case 的步驟順序依賴。

## Consequences

正面：
- 依賴關係在型別中可見，編譯器在依賴未滿足時報錯。
- 測試不需要模擬特定初始化順序。

代價：
- 所有延遲 `require()` 都需要改為 constructor DI 或 async factory，這是循環依賴問題（ADR 1300）的根本解法，需要同步進行。
