# Architecture Docs

這裡整理全局規則與系統結構。

重點是說明系統怎麼運作，特別是抽象層、邊界與整體關係。
內容對齊 Hexagonal + DDD、Firebase、Genkit、Zustand / XState 與 Zod 驗證分層。

## Current Architecture Write-ups

- [system-overview.md](./system-overview.md)
- [firebase-architecture.md](./firebase-architecture.md)
- [genkit-flow-standards.md](./genkit-flow-standards.md)
- [event-driven-design.md](./event-driven-design.md)
- [state-machine-model.md](./state-machine-model.md)
- [context-map.md](./context-map.md)
- [source-to-task-flow.md](./source-to-task-flow.md) — upload → parse → task 的正式邊界與組裝路徑。
