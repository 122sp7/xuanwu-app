# 開發指南索引

本目錄提供開發流程、分支策略與程式碼風格的入口。

## 文件地圖

| 文件 | 類型 | 說明 |
| --- | --- | --- |
| [development-process.md](./development-process.md) | How-to | 從需求到合併的開發流程 |
| [modules-implementation-guide.md](./modules-implementation-guide.md) | Reference | `modules/`、`packages/`、`app/` 的落點與邊界 |
| [branch-strategy.md](./branch-strategy.md) | Reference | 分支命名、生命週期、保護策略 |
| [code-style.md](./code-style.md) | Reference | TypeScript、React、CSS 程式碼風格 |

## 開發前檢查

1. [agents/knowledge-base.md](../../../agents/knowledge-base.md)
2. [agents/README.md](../../../agents/README.md)
3. [CONTRIBUTING.md](../../../CONTRIBUTING.md)

## 驗證命令

```bash
npm install
npm run lint
npm run build
cd py_fn && python -m compileall -q .
cd py_fn && python -m pytest tests/ -v
```

## 相關索引

- [docs/how-to-user/ui-ux/README.md](../../how-to-user/ui-ux/README.md)
- [docs/development-reference/specification/README.md](../specification/README.md)
- [docs/development-reference/reference/development-contracts/overview.md](../reference/development-contracts/overview.md)
- [docs/decision-architecture/adr/](../../decision-architecture/adr/)
