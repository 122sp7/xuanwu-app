# 開發指南索引

本目錄收斂 Xuanwu App 的開發流程、分支策略與程式碼風格規範。

---

## 文件地圖

| 文件 | 類型 | 說明 |
|---|---|---|
| [development-process.md](./development-process.md) | 操作指南 | 從需求到合併的端對端開發流程 |
| [modules-implementation-guide.md](./modules-implementation-guide.md) | 參考 | 將高階架構對位到 `modules/`、`packages/`、`app/` 的實作落點 |
| [branch-strategy.md](./branch-strategy.md) | 參考 | Git 分支命名、生命週期與保護規則 |
| [code-style.md](./code-style.md) | 參考 | TypeScript、React、CSS 程式碼風格規範 |

---

## 快速參考

### 開發前必讀

1. **架構文件**：[`agents/knowledge-base.md`](../../../agents/knowledge-base.md) — MDDD 模組的職責與邊界
2. **規則索引**：[`agents/README.md`](../../../agents/README.md) — 架構、品質、資料、API 規則
3. **貢獻指南**：[`CONTRIBUTING.md`](../../../CONTRIBUTING.md) — PR 規範與 House Rules

### 每次開發前執行

```bash
npm install          # 安裝相依套件
npm run lint         # ESLint — 0 errors
npm run build        # Next.js 生產建置 + TypeScript type-check
```

### Python Worker

```bash
cd py_fn && python -m compileall -q .
cd py_fn && python -m pytest tests/ -v
```

---

## 技術棧快速參考

| 層次 | 技術 | 版本 |
|---|---|---|
| 框架 | Next.js App Router | 16 |
| UI | React | 19 |
| 語言 | TypeScript | 5 |
| 後端 | Firebase | 12 |
| 樣式 | Tailwind CSS | 4 |
| 元件庫 | shadcn/ui | — |
| 狀態管理 | Zustand | 5 |
| 資料取用 | TanStack Query | 5 |
| Worker | Python 3.11 Cloud Functions | — |

---

## 相關文件連結

- [UI/UX 設計文件](../../how-to-user/ui-ux/README.md)
- [規格與契約文件](../specification/README.md)
- [ADR 決策記錄](../../decision-architecture/adr/)
- [開發契約總覽](../reference/development-contracts/overview.md)
