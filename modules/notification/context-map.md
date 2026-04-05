# notification — Context Map

> **Canonical DDD reference:** `../../docs/ddd/notification/context-map.md`

本文件對齊 `docs/ddd/notification/context-map.md`，作為 `notification` 在模組目錄中的整合關係速查表。

## Integration Notes

- 上游：各業務 BC 的 Published Language 事件
- 下游：終端通知輸出

## 邊界規則

- 跨模組互動只能透過目標模組 `api/` 邊界
- 若使用事件整合，事件語意以 canonical DDD 文件為準
- 不要從其他模組 reach-through import `domain/`、`application/`、`infrastructure/`

## 參考

- `../../docs/ddd/notification/context-map.md`
- `../../docs/ddd/bounded-contexts.md`
