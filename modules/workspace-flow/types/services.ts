import type { TaskId, IssueId, InvoiceId, InvoiceItemId, UserId } from './core'
import type { Task, Issue, Invoice, InvoiceItem } from './models'
import type { GuardResult } from './transitions'

// ============================================================
// TaskService — Task 狀態機操作介面
// ============================================================

export interface TaskService {
  // Queries
  getById(id: TaskId): Promise<Task | null>
  listByStatus(status: Task['status']): Promise<Task[]>
  listAcceptedWithoutInvoice(): Promise<Task[]>

  // Commands — 每個都對應一個合法 transition
  create(payload: Pick<Task, 'title' | 'description'>): Promise<Task>
  assign(id: TaskId, assignee: UserId): Promise<Task>
  submitToQA(id: TaskId): Promise<Task>
  passQA(id: TaskId): Promise<Task>         // guard: no open issues
  approveAcceptance(id: TaskId): Promise<Task>  // guard: no open issues
  archive(id: TaskId): Promise<Task>

  // Guard checks (可單獨呼叫，給 UI 顯示按鈕是否可點)
  canPassQA(id: TaskId): Promise<GuardResult>
  canApproveAcceptance(id: TaskId): Promise<GuardResult>
}

// ============================================================
// IssueService — Issue 狀態機操作介面
// ============================================================

export interface IssueService {
  // Queries
  getById(id: IssueId): Promise<Issue | null>
  listByTask(task_id: TaskId): Promise<Issue[]>
  listOpenByTask(task_id: TaskId): Promise<Issue[]>
  countOpenByTask(task_id: TaskId): Promise<number>

  // Commands
  open(payload: Pick<Issue, 'task_id' | 'stage' | 'title' | 'description' | 'created_by'>): Promise<Issue>
  start(id: IssueId): Promise<Issue>
  fix(id: IssueId, assigned_to: UserId): Promise<Issue>
  submitRetest(id: IssueId): Promise<Issue>
  passRetest(id: IssueId): Promise<Issue>
  failRetest(id: IssueId): Promise<Issue>
  close(id: IssueId): Promise<Issue>
}

// ============================================================
// InvoiceService — Invoice 狀態機操作介面
// ============================================================

export interface InvoiceService {
  // Queries
  getById(id: InvoiceId): Promise<Invoice | null>
  getItemsByInvoice(invoice_id: InvoiceId): Promise<InvoiceItem[]>

  // Commands
  create(): Promise<Invoice>
  addItem(invoice_id: InvoiceId, task_id: TaskId, amount: number): Promise<InvoiceItem>
  removeItem(item_id: InvoiceItemId): Promise<void>
  submit(id: InvoiceId): Promise<Invoice>        // guard: items > 0
  review(id: InvoiceId): Promise<Invoice>
  approve(id: InvoiceId): Promise<Invoice>
  reject(id: InvoiceId, reason: string): Promise<Invoice>
  pay(id: InvoiceId): Promise<Invoice>
  close(id: InvoiceId): Promise<Invoice>

  // Guard checks
  canSubmit(id: InvoiceId): Promise<GuardResult>
}
