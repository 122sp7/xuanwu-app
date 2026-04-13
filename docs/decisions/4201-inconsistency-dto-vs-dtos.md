# 4201 Inconsistency — `dto` vs `dtos` 目錄命名不一致

- Status: Accepted
- Date: 2026-04-13
- Category: Maintainability Smells > Inconsistency

## Context

一致性（Consistency）使開發者能夠通過慣例預測文件位置，無需逐一查找。
當相同概念在不同位置使用不同名稱時，認知摩擦增加，新成員容易在錯誤目錄下尋找或建立文件。

掃描 `application/` 層的 DTO 目錄命名，發現**單數 `dto` 與複數 `dtos` 混用**：

### 使用 `dtos`（複數）的模組

```
modules/platform/application/dtos/             ← platform root application
modules/workspace/application/dtos/            ← workspace root application
modules/notebooklm/application/dtos/           ← notebooklm root application
modules/notion/application/dtos/               ← notion root application（部分）
```

### 使用 `dto`（單數）的模組

```
modules/workspace/subdomains/audit/application/dto/
modules/workspace/subdomains/workspace-workflow/application/dto/
modules/workspace/subdomains/scheduling/application/dto/
modules/workspace/subdomains/feed/application/dto/
modules/notion/subdomains/knowledge/application/dto/
modules/notion/subdomains/database/application/dto/
modules/notion/subdomains/collaboration/application/dto/
modules/notion/subdomains/taxonomy/application/dto/
modules/notion/subdomains/relations/application/dto/
modules/notion/subdomains/authoring/application/dto/
modules/notebooklm/subdomains/notebook/application/dto/
modules/notebooklm/subdomains/source/application/dto/
modules/notebooklm/subdomains/conversation/application/dto/
```

**統計：** 4 個使用 `dtos`，13 個使用 `dto`（單數佔多數）。

### 命名模式對比

在同一主域（workspace）中同時存在兩種格式：

```
modules/workspace/application/dtos/          ← 根層使用複數
modules/workspace/subdomains/audit/application/dto/  ← 子域使用單數
modules/workspace/subdomains/feed/application/dto/   ← 子域使用單數
```

這造成：
- 在 workspace root application 尋找 DTO → 去 `dtos/`
- 在 workspace/audit 尋找 DTO → 去 `dto/`
- 在 workspace/feed 尋找 DTO → 去 `dto/`

同一個 workspace 模組，兩種約定。

### 延伸：其他目錄命名觀察

以下目錄均已統一，未有不一致問題（供對比）：

```
domain/repositories/   → 全部複數 ✅（24 個目錄均為 repositories）
domain/value-objects/  → 全部複數 ✅
domain/events/         → 全部複數 ✅
domain/ports/          → 全部複數 ✅
application/use-cases/ → 全部複數 ✅（僅 scheduling 例外，見 ADR 3200）
```

`dto`/`dtos` 是唯一出現複數不一致的目錄層級。

### 根本原因

可能的歷史原因：
- Platform、workspace、notion、notebooklm 的**根層 application**（`modules/*/application/`）最初使用複數 `dtos`。
- 後來新建的**子域 application**（`modules/*/subdomains/*/application/`）跟隨了不同慣例，使用單數 `dto`。
- 沒有強制性的目錄命名規範 lint rule，兩種模式共存至今。

## Decision

1. **統一採用單數 `dto`**（多數優先原則，13 vs 4）：
   - 單數 `dto` 表示「this directory contains DTO definitions」，與 `repositories/`、`events/`、`value-objects/` 的複數慣例不衝突（因為 dto 是 directory type，不是 entity type）。
   - 將 `modules/platform/application/dtos/`、`modules/workspace/application/dtos/`、`modules/notebooklm/application/dtos/`、`modules/notion/application/dtos/` 的 4 個目錄從 `dtos` 重命名為 `dto`。
2. **備選：統一採用複數 `dtos`**（若團隊偏好與 `repositories/`、`value-objects/` 一致）：
   - 將 13 個 `dto/` 目錄改為 `dtos/`（較大工作量）。
3. **無論哪個決定，都需要更新 `architecture-core.instructions.md`** 中的目錄形狀規範，確保未來新建子域遵循統一格式。

## Consequences

正面：
- 開發者可以直覺預測任何 module 的 DTO 目錄位置，無需翻找。
- 新子域建立時有明確的目錄命名參考。

代價：
- 重命名需要更新所有 import 路徑（可用 IDE 重構工具批量處理）。
- 4 個目錄（單數→複數決定）或 13 個目錄（複數→單數決定）的路徑更新。

## 關聯 ADR

- **ADR 3200** (Duplication)：`work-demand.use-cases.ts` 放置不一致也是相同根因
- **ADR 4200** (Inconsistency)：這是命名一致性問題的延伸
