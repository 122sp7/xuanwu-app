# Ubiquitous Language — workspace-audit

> **範圍：** 僅限 `modules/workspace-audit/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 稽核記錄 | AuditLog | 一條不可變的操作紀錄（Append-Only，永不修改） |
| 稽核事件類型 | auditEventType | 記錄的操作類型字串（如 `workspace.member_joined`） |
| 操作者 ID | actorId | 執行此操作的帳戶 ID |
| 稽核範圍 | auditScope | 此記錄的範圍（workspace 或 organization） |
| 稽核時間 | auditedAt | 操作發生時間，ISO 8601 |
| 元資料 | metadata | 操作的附加資訊（JSON，可選） |

## Append-Only 原則

`AuditLog` 一旦寫入即不可更改。任何試圖修改或刪除 AuditLog 的操作都違反此域的核心不變數。

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `AuditLog` | `Log`, `Record`, `History` |
| `actorId` | `userId`, `performerId` |
| `auditedAt` | `timestamp`, `createdAt`（在稽核上下文中） |
