# 1201 Boundary Violation — 業務規則漏入 Infrastructure 層

- Status: Partially Resolved
- Date: 2026-04-13
- Resolution Date: 2026-04-14
- Category: Architectural Smells > Boundary Violation

## Context

Hexagonal Architecture 要求 Infrastructure 層（Adapter）只負責技術轉換（I/O、序列化、協議轉換），
**不得包含業務規則或 Domain Invariant**。業務規則屬於 `domain/` 層，
透過聚合根的方法（command method）來執行不變量檢查。

掃描發現 `FirebaseAccountRepository.ts` 在 Firestore 交易中直接執行了 wallet 業務規則：

```typescript
// modules/platform/subdomains/account/infrastructure/firebase/FirebaseAccountRepository.ts:127-133
const current = snap.exists()
  ? ((snap.data() as Record<string, unknown>).wallet as Record<string, unknown> | undefined)
  : undefined;
const currentBalance = typeof current?.balance === "number" ? current.balance : 0;
if (currentBalance < amount) {
  throw new Error(`Insufficient wallet balance: have ${currentBalance}, need ${amount}`);
}
txn.update(accountRef, {
  "wallet.balance": currentBalance - amount,
  updatedAt: serverTimestamp(),
});
```

### 問題分析

此段程式碼做了三件事：

1. 從 Firestore 讀取 wallet.balance（基礎設施）
2. 檢查餘額是否足夠（**業務規則 / Domain Invariant**）
3. 直接扣除餘額並寫回 Firestore（應透過 Aggregate 來協調）

**為何這是邊界違規？**

| 職責 | 正確歸屬 | 實際歸屬 |
|------|----------|----------|
| 讀取 wallet 狀態 | infrastructure（Firestore 查詢） | ✅ infrastructure |
| `balance >= amount` 檢查 | domain（Account aggregate invariant） | ❌ infrastructure |
| 扣款操作 | domain（Account.deductWallet()） | ❌ infrastructure（直接 Firestore update） |

正確的模式是：
1. Repository 讀取 Account aggregate（含 wallet state）
2. `account.deductFromWallet(amount)` 在 aggregate 內部執行不變量檢查並記錄 domain event
3. Repository 將更新後的 aggregate 持久化

### 潛在危害

- **測試盲點**：wallet 規則只能在整合測試（需要 Firestore）中覆蓋，無法用純 domain unit test 驗證。
- **規則散落**：若 wallet 扣款邏輯在多個 use-case 中重複呼叫 repository，未來新增「VIP 用戶免費」規則需要修改多個 infrastructure 層文件。
- **Domain Event 遺失**：直接操作 Firestore 的 wallet 扣款不會產生 `WalletDeducted` domain event，無法被下游 subscriber 監聽。

### 相關掃描結果

以下 infrastructure 文件中也有類似的「not found」防衛性拋出，但因為這些是純查詢守衛（找不到資源回傳 Error），屬於邊界性案例，需個別審視：

```
modules/notion/infrastructure/database/firebase/FirebaseViewRepository.ts:89, 102
modules/notion/infrastructure/database/firebase/FirebaseDatabaseRecordRepository.ts:82, 86
modules/notion/infrastructure/database/firebase/FirebaseDatabaseRepository.ts:74
```

上述「not found throws」建議以 `null` 回傳後由 application 決定是否拋出業務錯誤（遵循 Query 回傳 null 模式）。

## Decision

1. **wallet 扣款業務規則遷移至 Account aggregate**：建立 `Account.deductFromWallet(amount: number): void` 方法，在其中執行 `balance < amount` 不變量檢查並拋出適當 domain error，同時記錄 `WalletDeducted` domain event。
2. **FirebaseAccountRepository 職責還原**：只負責從 Firestore 重建 Account aggregate，儲存後的 aggregate（含 domain events），移除直接業務判斷。
3. **Repository 中的「not found」拋出**：統一為 `null` 回傳（Repository returning `null` pattern），由 use-case 決定是否拋出 `ResourceNotFoundError`。
4. **Domain Error 型別**：建議建立模組層級的 domain error 型別（如 `AccountDomainError`），而非 plain `new Error(message)`。

## Consequences

正面：
- wallet 扣款邏輯可以被 pure domain unit tests 覆蓋（不需 Firestore emulator）。
- 任何 wallet 扣款都會產生 `WalletDeducted` domain event，可供 audit、notification 等下游訂閱。
- 未來新增 wallet 政策（免費額度、VIP 折扣）只需修改 `Account.deductFromWallet()`。

代價：
- 需要重構 Account aggregate 加入 wallet 行為方法。
- 需要更新 `FirebaseAccountRepository` 中的交易邏輯，改為先 reconstitute aggregate，呼叫方法，再 persist。

## 關聯 ADR

- **ADR 0009** (Anemic Aggregates)：wallet 規則放在 infrastructure 是 Anemic Model 的一種表現
- **ADR 1100** (Layer Violation)：layer violation 的另一形式

## Resolution

**HX-2-002 — 2026-04-14**

`FirebaseAccountRepository.creditWallet()` and `debitWallet()` were
refactored to delegate wallet invariant enforcement to the `Account`
aggregate:

1. A private `toAccountSnapshot()` helper maps Firestore document data
   (including `Timestamp` → ISO string conversion) to `AccountSnapshot`.
2. Inside the Firestore transaction, the Account aggregate is reconstituted
   via `Account.reconstitute(snapshot)`.
3. `account.creditWallet(amount, description)` or
   `account.debitWallet(amount, description)` is called on the aggregate —
   the `Insufficient wallet balance` invariant check is now enforced
   exclusively in the domain layer.
4. The resulting `account.walletBalance` is written back to Firestore;
   the repository no longer contains any balance arithmetic.

**Remaining open work (follow-up tasks):**
- ADR Decision §1: `Account.deductFromWallet()` was not added; the
  existing `account.debitWallet()` method already encapsulates the
  invariant check. A separate `WalletDeducted` domain event is not yet
  emitted; domain events from wallet operations are not published.
- ADR Decision §3: Repository "not found" returns are still `Error` throws
  in some paths; migration to `null`-return pattern is tracked separately.
- ADR Decision §4: `AccountDomainError` type not yet created.
