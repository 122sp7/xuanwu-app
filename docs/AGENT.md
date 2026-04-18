# docs — Agent Guide

## Purpose

`docs/` 是 Xuanwu App 的**架構文件集**，記錄 8 個主域的 DDD 戰略設計、Bounded Context 邊界、Context Map 方向與 ADR 決策日誌。

> **重要：** `docs/**/*` 是所有邊界問題、術語命名與 context map 的戰略權威。遇到邊界模糊時，先讀 `docs/`，再看程式碼。

## Reading Order（架構決策）

1. `docs/README.md` — 文件索引與路由規則
2. `docs/structure/system/architecture-overview.md` — 全域架構與主域關係
3. `docs/structure/domain/bounded-contexts.md` — 主域與子域所有權
4. `docs/structure/domain/ubiquitous-language.md` — 戰略術語權威
5. `docs/structure/system/context-map.md` — 主域間關係方向
6. `docs/decisions/README.md` — ADR 決策日誌

## Context Folders

`docs/contexts/<context>/` 各有：
- `README.md` — 主域用途、Upstream/Downstream、Baseline Subdomains
- `AGENT.md` — Agent 路由規則、保護邊界的 Guardrails
- `subdomains.md`、`bounded-context.md`、`ubiquitous-language.md`、`context-map.md`（選擇性）

## Governance Rules

- 不得在 `docs/` 外複製架構決策內容（指向，不複製）。
- ADR 只記錄有持續影響的架構決策；不把每個實作細節都升格為 ADR。
- `docs/contexts/<context>/` 的術語命名衝突，以 `docs/structure/domain/ubiquitous-language.md` 為準。
- 不得把 `.github/instructions/` 的行為規則寫成 `docs/` 的策略文件。

## 文件網絡

- [README.md](README.md) — 文件索引
- [bounded-contexts.md](structure/domain/bounded-contexts.md) — 主域所有權地圖
- [subdomains.md](structure/domain/subdomains.md) — 子域清單
- [context-map.md](structure/system/context-map.md) — 主域關係方向
- [ubiquitous-language.md](structure/domain/ubiquitous-language.md) — 戰略術語
- [decisions/README.md](decisions/README.md) — ADR 索引
