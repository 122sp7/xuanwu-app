# ADR 0001 — ADR 格式與編號規範

## Status

Accepted

## Date

2025-02-11

## Context

`docs/decisions/` 下已建立六個子目錄，但沒有統一的 ADR 格式規範與編號策略。隨著 8 個主域逐步演化，架構決策將越來越多，必須有一套可維護的命名與結構約束。

## Decision

### 子目錄分類

| 目錄 | 決策類型 |
|---|---|
| `meta/` | ADR 流程、格式、治理規則 |
| `architecture/` | 模組邊界、依賴方向、cross-runtime 分拆 |
| `domain/` | bounded context 語言、subdomain 切分、aggregate 設計 |
| `ai/` | AI capability、model policy、safety、orchestration |
| `platform/` | 平台服務治理：audit-log、feature-flag、observability |
| `data/` | Firestore schema、vector storage、collection ownership |

### 編號規則

- 每個子目錄獨立從 `0001` 開始。
- 格式：`NNNN-kebab-case-title.md`（例如：`0001-notebooklm-source-rename.md`）。
- 每個 ADR 必須有：Status、Date、Context、Decision、Consequences 五個必要欄位。
- Status 允許值：`Proposed` / `Accepted` / `Deprecated` / `Superseded By NNNN`。

### ADR 模板

```markdown
# ADR NNNN — <Title>

## Status
<Proposed | Accepted | Deprecated | Superseded By NNNN>

## Date
<YYYY-MM-DD>

## Context
<為什麼需要做決策？描述問題空間與現有限制>

## Decision
<選擇了什麼方案？為什麼？>

## Consequences
<這個決策帶來的正面、負面與中性結果>

## References
<相關文件、外部資料、相關 ADR>
```

### 不寫 ADR 的情境

- 只改 UI 細節（無邊界影響）。
- 單純 bug 修復（不改變語意邊界或架構）。
- 技術細節（如 CSS class 命名）。

## Consequences

**正面：** 決策可追溯，減少重複討論。  
**負面：** 每次架構決策多一份文件成本。  
**中性：** 需要在 PR 說明中標記對應 ADR 編號。

## References

- `.github/copilot-instructions.md` — Mandatory Compliance Rule 16
- `docs/README.md` — Conflict Resolution Rules
