# src/modules 蒸餾作業狀態（2026-04-15）

## 兩層模組結構（不可互換）

| 路徑 | 角色 | 何時用 |
|---|---|---|
| `modules/<context>/` | 完整 Hexagonal DDD 實作（現況） | 讀邊界規則、published language、context map |
| `src/modules/<context>/` | 精簡蒸餾骨架（新實作目標） | 撰寫新 use case、adapter、entity |

## 模組完成度

| 模組 | 狀態 |
|---|---|
| `src/modules/template/` | ✅ 完整多子域骨架（從這裡複製） |
| `src/modules/iam/` | 🔨 進行中（account / org 從 platform 遷入） |
| `src/modules/platform/` | 🔨 進行中（notification 等剩餘服務） |
| `src/modules/workspace/` | 🔨 進行中 |
| `src/modules/notion/` | 📋 待蒸餾 |
| `src/modules/notebooklm/` | 📋 待蒸餾 |
| `src/modules/ai/` | 📋 待蒸餾 |
| `src/modules/analytics/` | 📋 待蒸餾 |
| `src/modules/billing/` | 📋 待蒸餾 |

## template 模組結構（完整）

```
src/modules/template/
  index.ts              ← 唯一對外入口（具名匯出）
  README.md             ← 完整多子域說明（目錄樹、barrel 表、蒸餾說明）
  AGENT.md              ← Copilot/Agent 使用規則（衝突防護）
  orchestration/
    TemplateFacade.ts   ← 委派各子域 use case 的統一 Facade
    TemplateCoordinator.ts ← 跨子域流程協調 stub
  shared/               ← 9 個共用層（config/constants/errors/events/types/utils + stubs）
  subdomains/
    document/           ← 核心子域（完整 domain + application + adapters）
    generation/         ← stub
    ingestion/          ← stub
    workflow/           ← stub
```

## 關鍵衝突防護規則

- ❌ 不把 `modules/<context>/infrastructure/` 搬到 `src/modules/<context>/domain/`
- ❌ 不把 `src/modules/` 當 `modules/` 的別名
- ❌ `domain/` 不匯入 Firebase SDK、React、HTTP client
- ❌ barrel 不使用 `export *`

## 舊平坦層狀態

`src/modules/template/domain/`、`application/`、`adapters/`（根層舊結構）已確認零外部依賴，
可用 `Remove-Item -Recurse -Force` 刪除，但尚未刪除。待確認後執行。

## 新增文件

- `src/modules/README.md` — 蒸餾層整體狀態總覽與路由規則（新建 2026-04-15）
- `src/modules/template/README.md` — 蒸餾作業說明段落（追加 2026-04-15）
- `src/modules/template/AGENT.md` — 衝突防護段落（追加 2026-04-15）
