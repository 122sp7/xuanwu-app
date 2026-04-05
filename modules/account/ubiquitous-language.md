# Ubiquitous Language — account

> **範圍：** 僅限 `modules/account/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 | 代碼位置 |
|------|------|------|---------|
| 帳戶 | Account | 使用者在平台的業務記錄，含 profile 資訊與狀態 | `modules/account/domain/entities/Account.ts` |
| 帳戶政策 | AccountPolicy | 附加到帳戶的存取控制政策，決定 Firebase custom claims 內容 | `modules/account/domain/entities/AccountPolicy.ts` |
| 帳戶 ID | accountId | Account 的業務主鍵（對應 Firebase uid，但在業務層使用 accountId 術語） | `Account.id` |
| 自訂宣告 | customClaims | Firebase ID token 中的自訂 claims，由 AccountPolicy 決定 | `Account.customClaims` |
| 帳戶查詢庫 | AccountQueryRepository | CQRS 讀取側 Repository port | `domain/repositories/AccountQueryRepository.ts` |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `Account` | `User`, `Profile` |
| `AccountPolicy` | `Permission`, `Role`, `AccessRule` |
| `accountId` | `userId`（帳戶層應使用 accountId） |
