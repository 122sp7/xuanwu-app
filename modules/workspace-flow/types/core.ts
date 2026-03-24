// ============================================================
// Branded ID Types — 防止 task_id 傳進 invoice_id 這種蠢事
// ============================================================

declare const __brand: unique symbol
type Brand<T, B> = T & { [__brand]: B }

export type TaskId    = Brand<string, 'TaskId'>
export type IssueId   = Brand<string, 'IssueId'>
export type InvoiceId = Brand<string, 'InvoiceId'>
export type InvoiceItemId = Brand<string, 'InvoiceItemId'>
export type UserId    = Brand<string, 'UserId'>

// ============================================================
// Status Enums — 三條狀態機，各自獨立，不混用
// ============================================================

export type TaskStatus =
  | 'draft'
  | 'in_progress'
  | 'qa'
  | 'acceptance'
  | 'accepted'
  | 'archived'

export type IssueStatus =
  | 'open'
  | 'investigating'
  | 'fixing'
  | 'retest'
  | 'resolved'
  | 'closed'

export type IssueStage =
  | 'qa'
  | 'acceptance'
  | 'finance'

export type InvoiceStatus =
  | 'invoice_draft'
  | 'submitted'
  | 'finance_review'
  | 'approved'
  | 'paid'
  | 'closed'

// ============================================================
// Transition Event Types — 每條狀態機的合法事件
// ============================================================

export type TaskEvent =
  | { type: 'ASSIGN';      assignee: UserId }
  | { type: 'SUBMIT_QA' }
  | { type: 'PASS_QA' }
  | { type: 'APPROVE_ACCEPTANCE' }
  | { type: 'ARCHIVE' }

export type IssueEvent =
  | { type: 'START' }
  | { type: 'FIX' }
  | { type: 'SUBMIT_RETEST' }
  | { type: 'PASS_RETEST' }
  | { type: 'FAIL_RETEST' }
  | { type: 'CLOSE' }

export type InvoiceEvent =
  | { type: 'SUBMIT' }
  | { type: 'REVIEW' }
  | { type: 'APPROVE' }
  | { type: 'REJECT'; reason: string }
  | { type: 'PAY';    paid_at: Date }
  | { type: 'CLOSE' }
