modules\task
modules\qa
modules\acceptance
modules\finance
modules\issue

# 一、整體系統流程

系統其實是三條流程：

```
Work Flow（工作流）
Issue Flow（異常 / 問題單）
Finance Flow（金流）
```

整體關係：

```
Task → QA → Acceptance → Accepted
            ↑      ↓
            └ Issue ┘

Accepted Tasks
 → Select Tasks
 → Create Invoice / Payment Batch
 → Finance Review
 → Approved
 → Paid
```

核心概念：

```
Task Status ≠ Finance Status
Issue 是側邊流程，不是主流程
```

---

# 二、Task Workflow（工作狀態機）

Task 主流程：

```
draft
→ in_progress
→ qa
→ acceptance
→ accepted
→ archived
```

狀態說明：

| 狀態          | 說明   |
| ----------- | ---- |
| draft       | 建立任務 |
| in_progress | 開發中  |
| qa          | 測試   |
| acceptance  | 驗收   |
| accepted    | 驗收完成 |
| archived    | 歸檔   |

**Accepted 才能進 Finance**

---

# 三、Issue Workflow（問題單 / 異常流程）

任何階段發現問題都不要直接退回
**一律開 Issue**

```
open
→ investigating
→ fixing
→ retest
→ resolved
→ closed
```

Issue 與 Task / QA / Acceptance 關係：

```
Task → QA → Acceptance
        ↓      ↓
       Issue  Issue
```

Issue 解決後回到原本節點：

```
QA 發現問題
→ Issue
→ 修復
→ retest
→ 回 QA

Acceptance 發現問題
→ Issue
→ 修復
→ retest
→ 回 Acceptance
```

**重點：不要讓 Task status 一直 forward / backward**
用 Issue Flow 處理異常。

---

# 四、Finance Workflow（財務 / 請款 / 付款）

Finance 是另一個狀態機：

```
invoice_draft
→ submitted
→ finance_review
→ approved
→ paid
→ closed
```

流程：

```
Accepted Tasks
 → Select Tasks
 → Create Invoice / Payment Batch
 → Finance Review
 → Approved
 → Paid
```

注意：

```
Task 被加入 Invoice
Invoice 有 Finance Status
Task 不應該有 Finance Status
```

---

# 五、三條流程合併視圖（非常重要）

完整流程圖：

```
Work Flow
---------
Task
 → QA
 → Acceptance
 → Accepted
        ↓
Finance Flow
------------
Accepted Tasks
 → Select Tasks
 → Invoice / Payment Batch
 → Finance Review
 → Approved
 → Paid

Issue Flow
----------
任何節點
 → Create Issue
 → Fix
 → Retest
 → 回原節點
```

用圖表示：

```
Task → QA → Acceptance → Accepted
        │       │
        └ Issue ┘
                ↓
            Invoice
                ↓
             Review
                ↓
             Approved
                ↓
               Paid
```

---

# 六、資料模型（核心）

這是最重要的資料關係設計。

## 1. Task

```
Task
 ├─ id
 ├─ title
 ├─ description
 ├─ status
 ├─ assignee
 ├─ accepted_at
 ├─ created_at
```

## 2. Issue（問題單）

```
Issue
 ├─ id
 ├─ task_id
 ├─ stage (qa / acceptance / finance)
 ├─ title
 ├─ description
 ├─ status
 ├─ created_by
 ├─ assigned_to
 ├─ created_at
 ├─ resolved_at
```

## 3. Invoice

```
Invoice
 ├─ id
 ├─ status
 ├─ total_amount
 ├─ created_at
 ├─ submitted_at
 ├─ approved_at
 ├─ paid_at
```

## 4. InvoiceItems

```
InvoiceItems
 ├─ id
 ├─ invoice_id
 ├─ task_id
 ├─ amount
```

---

# 七、關聯關係（非常重要）

```
Task 1 --- n Issue

Task 1 --- n InvoiceItems n --- 1 Invoice
```

完整關係：

```
Task
 ├─ Issues
 └─ InvoiceItems
        └─ Invoice
```

或畫成流程：

```
Task
 ├─ QA
 ├─ Acceptance
 ├─ Issues
 └─ Accepted
        ↓
   InvoiceItem
        ↓
      Invoice
        ↓
      Payment
```

---

# 八、最終狀態機整理（總表）

## Task Status

```
draft
in_progress
qa
acceptance
accepted
archived
```

## Issue Status

```
open
investigating
fixing
retest
resolved
closed
```

## Invoice / Finance Status

```
invoice_draft
submitted
finance_review
approved
paid
closed
```

---

# 九、最終完整流程（最標準版本）

這個可以當系統設計文件：

```
Task Flow
---------
draft
→ in_progress
→ qa
→ acceptance
→ accepted
→ archived

Issue Flow
----------
open
→ investigating
→ fixing
→ retest
→ resolved
→ closed

Finance Flow
------------
invoice_draft
→ submitted
→ finance_review
→ approved
→ paid
→ closed
```

流程關係：

```
Task → QA → Acceptance → Accepted
        │       │
        └ Issue ┘
                ↓
            Invoice
                ↓
             Review
                ↓
             Approved
                ↓
               Paid
```

---

# 十、系統設計核心原則（非常重要）

最後記住這幾句就不會設計錯：

```
Task 解決：事情做完沒
QA 解決：品質過關沒
Acceptance 解決：客戶驗收沒
Issue 解決：異常與問題
Invoice 解決：要收多少錢
Finance 解決：錢付了沒
```

**六個 Domain，不要混成一個狀態機。**

