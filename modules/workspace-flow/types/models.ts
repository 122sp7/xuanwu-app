import type {
  TaskId, IssueId, InvoiceId, InvoiceItemId, UserId,
  TaskStatus, IssueStatus, IssueStage, InvoiceStatus,
} from './core'

// ============================================================
// Task — 只管工作狀態，不碰 Finance
// ============================================================

export interface Task {
  id:          TaskId
  title:       string
  description: string
  status:      TaskStatus
  assignee:    UserId | null
  created_at:  Date
  accepted_at: Date | null   // accepted 時才有值
  archived_at: Date | null
}

// ============================================================
// Issue — 側邊異常流，不退 Task 狀態
// ============================================================

export interface Issue {
  id:          IssueId
  task_id:     TaskId
  stage:       IssueStage   // 在哪個節點產生的
  title:       string
  description: string
  status:      IssueStatus
  created_by:  UserId
  assigned_to: UserId | null
  created_at:  Date
  resolved_at: Date | null
}

// ============================================================
// Invoice — 財務狀態，不持有 TaskStatus
// ============================================================

export interface Invoice {
  id:           InvoiceId
  status:       InvoiceStatus
  total_amount: number
  created_at:   Date
  submitted_at: Date | null
  approved_at:  Date | null
  paid_at:      Date | null
  closed_at:    Date | null
}

// ============================================================
// InvoiceItem — Task 與 Invoice 的 join table
// ============================================================

export interface InvoiceItem {
  id:         InvoiceItemId
  invoice_id: InvoiceId
  task_id:    TaskId          // 只有 accepted 的 Task 才能加入
  amount:     number
}
