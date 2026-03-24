# System State Machines

三條完全獨立的狀態機，不混用。

Mermaid 圖檔：`./Workspace-Flow.mermaid`

---

## 核心原則

```
Task.status      → 事情做完沒
Issue.status     → 異常處理中
Invoice.status   → 錢的狀態
```

**六個 Domain，各自一條狀態機。**

---

## 1. Task State Machine（工作流）

```
INITIAL → draft

draft        --[assign]-->     in_progress
in_progress  --[submit_qa]-->  qa
qa           --[pass]-->       acceptance
acceptance   --[approve]-->    accepted
accepted     --[archive]-->    archived

qa           --[fail]-->       in_progress   ← 不用，改開 Issue
acceptance   --[fail]-->       qa            ← 不用，改開 Issue
```

> **規則：Task status 只往前走，不倒退。**
> 發現問題 → 開 Issue，不是退狀態。

### States

| state | 說明 |
|---|---|
| `draft` | 任務建立，尚未開始 |
| `in_progress` | 開發中 |
| `qa` | 提交測試 |
| `acceptance` | 客戶驗收中 |
| `accepted` | 驗收通過，可進 Finance |
| `archived` | 歸檔 |

### Transitions

| from | event | to | guard |
|---|---|---|---|
| `draft` | `ASSIGN` | `in_progress` | assignee 存在 |
| `in_progress` | `SUBMIT_QA` | `qa` | — |
| `qa` | `PASS` | `acceptance` | no open issues |
| `acceptance` | `APPROVE` | `accepted` | no open issues |
| `accepted` | `ARCHIVE` | `archived` | invoice closed or none |

---

## 2. Issue State Machine（問題單流）

```
INITIAL → open

open          --[start]-->    investigating
investigating --[fix]-->      fixing
fixing        --[submit]-->   retest
retest        --[pass]-->     resolved
retest        --[fail]-->     fixing          ← 回修
resolved      --[close]-->    closed
```

> **規則：任何節點發現問題，一律開 Issue，不退 Task。**
> Issue 解決後，回到原來節點繼續。

### States

| state | 說明 |
|---|---|
| `open` | 問題建立 |
| `investigating` | 調查原因中 |
| `fixing` | 修復中 |
| `retest` | 重新測試 |
| `resolved` | 已解決 |
| `closed` | 關閉歸檔 |

### Transitions

| from | event | to |
|---|---|---|
| `open` | `START` | `investigating` |
| `investigating` | `FIX` | `fixing` |
| `fixing` | `SUBMIT` | `retest` |
| `retest` | `PASS` | `resolved` |
| `retest` | `FAIL` | `fixing` |
| `resolved` | `CLOSE` | `closed` |

### Issue 與 Task 的關係

```
Task (qa)       → Issue.stage = 'qa'       → 解完 → 回 qa
Task (acceptance) → Issue.stage = 'acceptance' → 解完 → 回 acceptance
```

`Issue.stage` 記錄在哪個節點產生，方便 retest 後回到正確位置。

---

## 3. Invoice State Machine（財務流）

```
INITIAL → invoice_draft

invoice_draft  --[submit]-->   submitted
submitted      --[review]-->   finance_review
finance_review --[approve]-->  approved
finance_review --[reject]-->   submitted       ← 退回補件
approved       --[pay]-->      paid
paid           --[close]-->    closed
```

> **規則：Task 不擁有 Finance status。**
> Invoice 有自己的狀態機。Task 被加入 InvoiceItem，透過 InvoiceItem 關聯到 Invoice。

### States

| state | 說明 |
|---|---|
| `invoice_draft` | 草稿，選取 accepted tasks |
| `submitted` | 送出請款 |
| `finance_review` | 財務審核中 |
| `approved` | 核准 |
| `paid` | 已付款 |
| `closed` | 結案 |

### Transitions

| from | event | to | guard |
|---|---|---|---|
| `invoice_draft` | `SUBMIT` | `submitted` | items 不為空 |
| `submitted` | `REVIEW` | `finance_review` | — |
| `finance_review` | `APPROVE` | `approved` | — |
| `finance_review` | `REJECT` | `submitted` | — |
| `approved` | `PAY` | `paid` | — |
| `paid` | `CLOSE` | `closed` | — |

---

## 4. 資料模型

### Task

```ts
type Task = {
  id: string
  title: string
  description: string
  status: 'draft' | 'in_progress' | 'qa' | 'acceptance' | 'accepted' | 'archived'
  assignee: string
  accepted_at?: Date
  created_at: Date
}
```

### Issue

```ts
type Issue = {
  id: string
  task_id: string
  stage: 'qa' | 'acceptance' | 'finance'     // 在哪個節點發生
  title: string
  description: string
  status: 'open' | 'investigating' | 'fixing' | 'retest' | 'resolved' | 'closed'
  created_by: string
  assigned_to: string
  created_at: Date
  resolved_at?: Date
}
```

### Invoice

```ts
type Invoice = {
  id: string
  status: 'invoice_draft' | 'submitted' | 'finance_review' | 'approved' | 'paid' | 'closed'
  total_amount: number
  created_at: Date
  submitted_at?: Date
  approved_at?: Date
  paid_at?: Date
}
```

### InvoiceItem

```ts
type InvoiceItem = {
  id: string
  invoice_id: string
  task_id: string
  amount: number
}
```

---

## 5. 關聯關係

```
Task    1 ──── n    Issue
Task    1 ──── n    InvoiceItem   n ──── 1   Invoice
```

Task 不直接持有 Invoice，透過 InvoiceItem 關聯。

---

## 6. Guard 規則（狀態轉移前置條件）

| 規則 | 說明 |
|---|---|
| `qa → acceptance` | Task 下無 `open / investigating / fixing / retest` 的 Issue |
| `acceptance → accepted` | 同上 |
| `invoice_draft → submitted` | InvoiceItems 至少一筆 |
| `accepted → archived` | 關聯的 Invoice 全為 `closed` 或無 Invoice |

---

## 7. 完整流程一覽

```
Task → qa → acceptance → accepted
        │        │
        └─ Issue ┘  (任何節點發現問題 → 開 Issue → 修完回原節點)

accepted → InvoiceItem → Invoice → Finance Review → Approved → Paid
```

**一句話記憶法：**

```
Task   解決：事情做完沒？
Issue  解決：異常怎麼辦？
Invoice 解決：要收多少錢？
Finance 解決：錢付了沒？
```
