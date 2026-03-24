import type { TaskStatus, IssueStatus, InvoiceStatus } from './core'

// ============================================================
// Transition Maps — 用 Record 鎖死每個 status 的合法下一步
// Copilot 補不出不合法的 transition
// ============================================================

export type TaskTransitionMap = {
  draft:        'in_progress'
  in_progress:  'qa'
  qa:           'acceptance'
  acceptance:   'accepted'
  accepted:     'archived'
  archived:     never           // 終態，沒有下一步
}

export type IssueTransitionMap = {
  open:          'investigating'
  investigating: 'fixing'
  fixing:        'retest'
  retest:        'resolved' | 'fixing'   // pass → resolved, fail → fixing
  resolved:      'closed'
  closed:        never
}

export type InvoiceTransitionMap = {
  invoice_draft: 'submitted'
  submitted:     'finance_review'
  finance_review:'approved' | 'submitted'  // approve or reject back
  approved:      'paid'
  paid:          'closed'
  closed:        never
}

// ============================================================
// Utility — 從 TransitionMap 抽出某狀態的合法下一步
// ============================================================

export type NextTaskStatus<S extends TaskStatus> = TaskTransitionMap[S]
export type NextIssueStatus<S extends IssueStatus> = IssueTransitionMap[S]
export type NextInvoiceStatus<S extends InvoiceStatus> = InvoiceTransitionMap[S]

// ============================================================
// Transition Function Signatures — Service 層必須照這個寫
// ============================================================

export type TransitionFn<
  TEntity,
  TStatus extends string,
  TMap extends Record<string, string | never>,
  TExtra = void
> = <S extends TStatus & keyof TMap>(
  entity: TEntity & { status: S },
  to:     TMap[S] extends never ? never : TMap[S],
  extra?: TExtra
) => Promise<TEntity & { status: TMap[S] }>

// ============================================================
// Guard Types — 轉移前必須通過的前置條件
// ============================================================

export interface TaskGuardContext {
  task_id:      import('./core').TaskId
  open_issues:  number   // 必須 === 0 才能往前
}

export interface InvoiceGuardContext {
  invoice_id:   import('./core').InvoiceId
  item_count:   number   // 必須 > 0 才能 submit
}

export type GuardResult =
  | { ok: true }
  | { ok: false; reason: string }

export type Guard<TContext> = (ctx: TContext) => GuardResult
