# wiki — Context Map

> **Canonical DDD reference:** `../../docs/ddd/wiki/context-map.md`

本文件對齊 `docs/ddd/wiki/context-map.md`，作為 `wiki` 在模組目錄中的整合關係速查表。

## Integration Notes

- 上游：knowledge
- 下游：search、notebook

## 邊界規則

- 跨模組互動只能透過目標模組 `api/` 邊界
- 若使用事件整合，事件語意以 canonical DDD 文件為準
- 不要從其他模組 reach-through import `domain/`、`application/`、`infrastructure/`

## 參考

- `../../docs/ddd/wiki/context-map.md`
- `../../docs/ddd/bounded-contexts.md`
