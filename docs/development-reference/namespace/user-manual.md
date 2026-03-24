---
title: Namespace Core user manual
description: User manual for the Namespace Core domain — how organization and workspace slugs work, how they are resolved, and what the lifecycle states mean.
---

# Namespace Core 使用手冊

> **文件版本**：v1.0.0
> **最後更新**：2026-03-20
> **目標讀者**：工程師、平台架構師、模組 Owner

---

## 概覽

Namespace Core 是 xuanwu-app 的**命名空間基礎**。它讓每個組織與工作區都有：

- 🔤 **唯一可閱讀的 slug**（例如 `acme-corp`、`product-team`）
- 🔗 **穩定的 URL 路由定址**（例如 `/acme-corp/product-team`）
- 🏷️ **多租戶資源隔離**（透過 `organizationId` 邊界）

---

## 什麼是 Namespace？

在 xuanwu-app 中，**Namespace（命名空間）**是一個為組織或工作區保留的具名範圍：

| Kind | 說明 | 範例 slug |
|------|------|-----------|
| `organization` | 組織層命名空間 | `acme-corp` |
| `workspace` | 工作區層命名空間 | `product-team` |

---

## Slug 規則

| 規則 | 說明 |
|------|------|
| 長度 | 3–63 字元 |
| 允許字元 | 小寫英文 `a-z`、數字 `0-9`、連字號 `-` |
| 不允許 | 大寫字母、底線、連字號開頭/結尾 |
| 唯一性 | 在相同 kind 下唯一 |

---

## Namespace 生命週期

| 狀態 | 說明 |
|------|------|
| `active` | 正常使用中，slug 可被解析 |
| `suspended` | 暫停，slug 暫時無法路由（仍保留） |
| `archived` | 封存，slug 永久保留但不可再啟用 |

---

## 常見問題

### Q: Slug 可以修改嗎？
A: 目前尚未實作 slug 變更流程。Slug 一旦建立後暫時固定，未來實作時會同步建立舊 slug 重定向紀錄。

### Q: 不同組織可以使用相同 slug 嗎？
A: 在相同 kind（`organization` 或 `workspace`）下，slug 是全域唯一的，不允許重複使用。

### Q: 封存的 namespace 的 slug 還能被新組織使用嗎？
A: 不行。封存的 namespace 仍保留其 slug，新建立的命名空間無法使用已存在的 slug（包含封存狀態）。

---

## 參考文件

| 文件 | 路徑 |
|------|------|
| 架構設計 | `docs/decision-architecture/architecture/namespace.md` |
| 開發契約 | `docs/development-reference/reference/development-contracts/namespace-contract.md` |
| 開發指南 | `docs/development-reference/namespace/development-guide.md` |
| 整體架構指南 | `agents/knowledge-base.md` |
