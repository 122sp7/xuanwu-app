# src — Agent Guide

## Purpose

`src/` 是 Xuanwu App 的 Next.js 應用程式根目錄，包含兩個主要子目錄：

- `src/app/` — Next.js 16 App Router 路由入口層（layout、page、route group）
- `src/modules/` — 所有主域模組實作層（Hexagonal Architecture + DDD）

## Route Decision

| 需要 | 去哪裡 |
|---|---|
| 新增或修改路由、layout、page | `src/app/` → 見 `src/app/AGENT.md` |
| 新增或修改模組的 use case、entity、adapter | `src/modules/<context>/` → 見對應 `AGENT.md` |
| 跨模組 API boundary | `src/modules/<context>/index.ts` |
| 模組清單與子域狀態 | `src/modules/README.md` |

## Boundary Rules

- `src/app/` 只組合路由與 UI 入口，不承載業務邏輯。
- `src/modules/` 是唯一模組實作層；不得在 `src/app/` 內直接撰寫 domain 或 use case 邏輯。
- 跨模組協作只能透過目標模組的 `index.ts` 公開邊界，禁止跨模組直接 import `domain/`、`application/`、`infrastructure/`、`interfaces/` 內部路徑。

## 文件網絡

- [src/app/AGENT.md](app/AGENT.md) — App Router 路由規則
- [src/modules/README.md](modules/README.md) — 模組清單與子域狀態
- [docs/structure/domain/bounded-contexts.md](../docs/structure/domain/bounded-contexts.md) — 主域所有權地圖
- [docs/README.md](../docs/README.md) — 架構文件索引
