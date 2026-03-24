// 全部從這裡 import，不要單獨引各個檔案
// import type { Task, TaskStatus, TaskService } from '@/types'

export type {
  // Branded IDs
  TaskId,
  IssueId,
  InvoiceId,
  InvoiceItemId,
  UserId,

  // Status unions
  TaskStatus,
  IssueStatus,
  IssueStage,
  InvoiceStatus,

  // Event unions
  TaskEvent,
  IssueEvent,
  InvoiceEvent,
} from './core'

export type {
  Task,
  Issue,
  Invoice,
  InvoiceItem,
} from './models'

export type {
  TaskTransitionMap,
  IssueTransitionMap,
  InvoiceTransitionMap,
  NextTaskStatus,
  NextIssueStatus,
  NextInvoiceStatus,
  TransitionFn,
  TaskGuardContext,
  InvoiceGuardContext,
  GuardResult,
  Guard,
} from './transitions'

export type {
  TaskService,
  IssueService,
  InvoiceService,
} from './services'

export type {
  CollectionName,
  TaskDoc,
  IssueDoc,
  InvoiceDoc,
  InvoiceItemDoc,
  TaskQuery,
  IssueQuery,
  InvoiceQuery,
} from './firestore'

export { COLLECTIONS } from './firestore'
