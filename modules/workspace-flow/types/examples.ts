/**
 * @fileoverview
 * 展示型別如何在 runtime 鎖住非法操作
 * 這個檔案可以直接貼進 Copilot Chat 當 context 用
 */

import type {
  Task, TaskStatus,
  TaskTransitionMap,
  NextTaskStatus,
  GuardResult,
} from './index'

// ============================================================
// 1. Transition Map 讓 TypeScript 在 compile time 擋掉非法 transition
// ============================================================

// ✅ 合法：qa → acceptance
type AfterQA = NextTaskStatus<'qa'>
//   ^? 'acceptance'

// ✅ 合法：archived → never（終態）
type AfterArchived = NextTaskStatus<'archived'>
//   ^? never

// ❌ 如果你試著把 archived task 往前推，TypeScript 會直接報錯
// function wrongTransition(task: Task & { status: 'archived' }) {
//   transition(task, 'in_progress')  // Error: Argument of type '"in_progress"'
// }                                  //        is not assignable to parameter of type 'never'

// ============================================================
// 2. Guard 型別範例 — TaskService 實作時參考
// ============================================================

async function canPassQAExample(task_id: string): Promise<GuardResult> {
  // 假設這是 Firestore query
  const openIssues = 0 // await countOpenByTask(task_id)

  if (openIssues > 0) {
    return { ok: false, reason: `還有 ${openIssues} 個 Issue 未關閉` }
  }
  return { ok: true }
}

// ============================================================
// 3. Branded ID 防呆示範
// ============================================================

import type { TaskId, InvoiceId } from './index'

// ✅ 正確
declare const tid: TaskId
declare const iid: InvoiceId

// ❌ 型別不符，TypeScript 報錯
// const broken: TaskId = iid  // Error: Type 'InvoiceId' is not assignable to type 'TaskId'

// ============================================================
// 4. Status 是 union，switch 必須窮舉
// ============================================================

function getTaskStatusLabel(status: TaskStatus): string {
  switch (status) {
    case 'draft':        return '草稿'
    case 'in_progress':  return '進行中'
    case 'qa':           return '測試中'
    case 'acceptance':   return '驗收中'
    case 'accepted':     return '已驗收'
    case 'archived':     return '已歸檔'
    // 少寫任何一個 case，TypeScript 會在 default 報錯
    // default: return status satisfies never
  }
}

// ============================================================
// 5. 加新 Status 時的影響範圍（讓 Copilot 知道要改哪裡）
// ============================================================

/**
 * 如果要加新狀態（例如 'on_hold'）：
 *
 * 1. types/core.ts       → TaskStatus union 加 'on_hold'
 * 2. types/transitions.ts → TaskTransitionMap 加對應 entry
 * 3. types/services.ts   → TaskService 加 putOnHold() method
 * 4. getTaskStatusLabel() → switch 加 case（不加會 compile error）
 * 5. Firestore rules      → 更新合法 status 清單
 *
 * TypeScript 會在 (4) 直接告訴你哪裡忘了改。
 */
