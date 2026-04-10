# workspace/subdomains/presence

## 子域職責

`presence` 子域負責即時協作存在感與共同編輯訊號的正典邊界：

- 追蹤哪些成員正在線上並活躍於特定工作區或文件（`PresenceSignal`）
- 廣播游標位置、選取範圍等即時協作狀態（`CursorState`）
- 管理存在感的生命週期：上線、心跳、離線逾時

## 核心語言

| 術語 | 說明 |
|---|---|
| `PresenceSession` | 一個成員在工作區的即時存在感聚合根 |
| `PresenceSignal` | 一次存在感廣播訊號（上線、心跳、離線） |
| `CursorState` | 成員在文件中的即時游標與選取狀態 |
| `ActiveParticipants` | 某文件或工作區當前在線成員的快照 |
| `PresenceTTL` | 存在感記錄的存活時間，超過即視為離線 |

## Hexagonal shape

- `api/`: public 子域 boundary
- `application/`: use cases（`RegisterPresence`、`HeartbeatPresence`、`LeavePresence`、`GetActiveParticipants`）
- `domain/`: `PresenceSession`、`PresenceSignal`、`CursorState`
- `infrastructure/`: Firebase Realtime Database / Firestore 即時資料適配器
- `interfaces/`: server action 接線、即時協作 UI 元件

## 整合規則

- `presence` 不藏進 UI 狀態：它有獨立語言，供多個 UI 元件共享
- 消費 `workspace.member-joined` 與 `membership` 成員清單，確認有效存在感主體
- 父模組 public API（`@/modules/workspace/api`）是跨模組進入點

## Status

🔲 Gap — 尚未實作，依 docs/contexts/workspace/subdomains.md 建議建立
