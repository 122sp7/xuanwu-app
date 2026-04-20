# ADR 0004 — workspace `presence` 子域延遲決策

## Status

Proposed

## Date

2025-02-11

## Context

`docs/structure/domain/subdomains.md` 將 `presence` 列為 workspace 的 **Recommended Gap Subdomain**：

> presence — 即時協作存在感、共同編輯訊號收斂為本地語言

目前 workspace 模組已有 18 個子域（baseline 覆蓋完整），`presence` 是唯一缺失的 gap subdomain。

評估現況：
1. 目前 workspace 無任何即時協作功能（co-cursor、co-editing、online indicator）。
2. `feed` 子域提供非即時的活動摘要，不是 presence 的替代。
3. 現有技術棧（Firebase Realtime Database / Firestore onSnapshot）支援 presence，但無對應業務需求。
4. 若加入 presence，需要：WebSocket 或 SSE channel、presence heartbeat、cursor sync 協定。

## Decision

### 延遲建立 `presence` 子域

`presence` 不在當前交付範圍，延遲至以下任一條件成立時重新評估：

| 觸發條件 | 說明 |
|---|---|
| 多人即時編輯 | 使用者同時編輯同一 Task 或 Page |
| Online indicator | 工作區顯示哪些成員在線 |
| Co-cursor | 顯示其他成員游標位置 |
| Collaborative conflict | 需要 CRDT / OT 解決即時編輯衝突 |

### 預留措施

1. 在 `workspace/subdomains/` 目錄不建立 `presence/` 資料夾（避免空骨架）。
2. 本 ADR 作為「已知缺口」記錄，下一輪規劃時直接引用。
3. 若需要 presence 的 proof-of-concept，可在 `workspace/subdomains/feed/` 或實驗分支中驗證，確認後再提升為正式子域。

## Consequences

**正面：** 避免過早建立無業務需求的子域骨架（YAGNI 原則）。  
**負面：** 若即時協作需求突然加速，需要一次性補建骨架和業務語言定義。  
**中性：** Gap subdomain 本就是「已知但未驗證的缺口」，延遲是合理的 DDD 實踐。

## References

- `docs/structure/domain/subdomains.md` — workspace gap subdomain 清單
- `src/modules/workspace/subdomains/` — 現有 18 個子域
- ADR architecture/0001 — 整體子域邊界治理
