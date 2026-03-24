import type { Task, Issue, Invoice, InvoiceItem } from './models'

// ============================================================
// Firestore Collection Paths — 統一管理，不要散落在各 service
// ============================================================

export const COLLECTIONS = {
  TASKS:         'tasks',
  ISSUES:        'issues',
  INVOICES:      'invoices',
  INVOICE_ITEMS: 'invoice_items',
} as const

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS]

// ============================================================
// Firestore Document Types — 對應 Firestore 儲存格式
// Date → Timestamp 的 mapping 由 converter 處理
// ============================================================

export type TaskDoc         = Omit<Task,         'id'>
export type IssueDoc        = Omit<Issue,        'id'>
export type InvoiceDoc      = Omit<Invoice,      'id'>
export type InvoiceItemDoc  = Omit<InvoiceItem,  'id'>

// ============================================================
// Query Filter Types — 給 listByStatus 等查詢用
// ============================================================

export interface TaskQuery {
  status?:   Task['status']
  assignee?: import('./core').UserId
  limit?:    number
}

export interface IssueQuery {
  task_id?: import('./core').TaskId
  stage?:   import('./core').IssueStage
  status?:  Issue['status']
}

export interface InvoiceQuery {
  status?: Invoice['status']
  limit?:  number
}
