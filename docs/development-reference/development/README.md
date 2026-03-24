# 開發指南索引

開發流程、分支策略、程式碼風格入口。

## 文件

| 文件 | 說明 |
| --- | --- |
| [development-process.md](./development-process.md) | 需求 → 合併的開發流程 |
| [modules-implementation-guide.md](./modules-implementation-guide.md) | `modules/`、`packages/`、`app/` 邊界 |
| [branch-strategy.md](./branch-strategy.md) | 分支命名與保護策略 |
| [code-style.md](./code-style.md) | TypeScript、React、CSS 風格 |

## 驗證

```bash
npm install && npm run lint && npm run build
cd py_fn && python -m compileall -q . && python -m pytest tests/ -v
```

## 初讀

- [agents/knowledge-base.md](../../../agents/knowledge-base.md) — MDDD 與模塊清冊
- [CONTRIBUTING.md](../../../CONTRIBUTING.md) — 貢獻指南

## 相關

- [../specification/README.md](../specification/README.md) — 規格與契約
- [../../decision-architecture/adr/](../../decision-architecture/adr/) — 架構決策
