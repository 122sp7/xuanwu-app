# conversations — 對話群組與上下文歷史視窗

## 子域目的

管理對話群組（Thread）的生命週期，以及上下文歷史視窗（Context History Window）的組裝與裁切邏輯。此子域是 `ai` bounded context 對「多輪對話的連續性與範圍」的正典知識邊界。

## 業務能力邊界

**負責：**
- Thread 的建立、封存與狀態追蹤
- Context History Window 的組裝（哪些訊息進入當前推理的 context）
- 視窗裁切策略（sliding window、summarization threshold）
- Thread 與 Notebook / Workspace 的關聯追蹤

**不負責：**
- 單次訊息的原子寫入（屬於 `messages` 子域）
- 實際推理執行（屬於 `inference` 子域）
- Conversation 的 UI 呈現（屬於 `notebooklm/interfaces/` 層）
- Notebook 的正典所有者（屬於 `notebooklm` bounded context）

## conversations vs messages 分工

| 關注點 | conversations | messages |
|--------|---------------|---------|
| Thread 生命週期 | ✅ 正典所有者 | 不關心 |
| Context Window 組裝 | ✅ 正典所有者 | 不關心 |
| 單次訊息原子寫入 | 消費訊息列表 | ✅ 正典所有者 |
| 訊息角色（User/Assistant）| 不關心 | ✅ 正典所有者 |

## 核心概念

| 概念 | 說明 |
|------|------|
| Thread | 對話群組聚合根，攜帶狀態、關聯 scope 與訊息參考清單 |
| ContextHistoryWindow | 從 Thread 中選取、排序後送入推理的訊息視窗 |
| WindowPolicy | 視窗裁切策略值對象（max tokens、message count、strategy） |
| ThreadStatus | `active` / `archived` / `summarized` |

## 架構層級

```
conversations/
  api/              ← 對外公開 Thread 查詢與 Context Window 組裝能力
  domain/
    entities/       ← Thread
    value-objects/  ← ContextHistoryWindow, WindowPolicy, ThreadStatus
    repositories/   ← ThreadRepository（介面）
    events/         ← ThreadCreated, ThreadArchived, ContextWindowAssembled
  application/
    use-cases/      ← CreateThread, ArchiveThread, AssembleContextWindow
```

## Ubiquitous Language

- **Thread**：對話群組的聚合根，不直接持有訊息內容（持有訊息 ID 引用）
- **ContextHistoryWindow**：推理前的訊息視窗快照，是短暫的組裝產物
- **WindowPolicy**：決定哪些訊息進入 context 的裁切策略（不是 UI 分頁設定）
- **ThreadArchived**：Thread 完成對話後進入不可再寫入的終態事實
