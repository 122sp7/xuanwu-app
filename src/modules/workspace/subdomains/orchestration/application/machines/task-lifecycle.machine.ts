import { setup, assign } from "xstate";

/**
 * Task Lifecycle State Machine (XState v5)
 *
 * Purpose: UI-layer finite-state workflow for the full task lifecycle:
 *   task-formation → task → quality(QA) → approval(acceptance) → settlement
 *
 * KEY DESIGN DECISIONS:
 * - `qa_blocked` / `acceptance_blocked` exist only in this machine context.
 *   Firestore task.status stays `qa` / `acceptance` while an issue is open.
 *   Open issue count is the blocking signal, NOT a separate Firestore field.
 * - The machine is a UI/Server Action orchestration aid. Domain invariants
 *   are still enforced inside use cases and aggregate methods.
 * - Events are named after actor intent (ADVANCE, OPEN_ISSUE, ISSUE_RESOLVED),
 *   not domain events directly.
 */

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface TaskLifecycleContext {
  readonly taskId: string;
  readonly workspaceId: string;
  readonly openIssueCount: number;
  readonly blockedAtStage: "qa" | "acceptance" | null;
  readonly invoiceId: string | null;
  readonly errorMessage: string | null;
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export type TaskLifecycleEvent =
  | { type: "ADVANCE" }
  | { type: "OPEN_ISSUE"; stage: "qa" | "acceptance" }
  | { type: "ISSUE_RESOLVED"; stage: "qa" | "acceptance" }
  | { type: "ARCHIVE" }
  | { type: "SET_ERROR"; message: string }
  | { type: "CLEAR_ERROR" }
  | { type: "INVOICE_CREATED"; invoiceId: string };

// ---------------------------------------------------------------------------
// Machine
// ---------------------------------------------------------------------------

export const taskLifecycleMachine = setup({
  types: {
    context: {} as TaskLifecycleContext,
    events: {} as TaskLifecycleEvent,
    input: {} as { taskId: string; workspaceId: string },
  },
  actions: {
    setQaBlocked: assign({
      openIssueCount: ({ context }) => context.openIssueCount + 1,
      blockedAtStage: () => "qa" as const,
    }),
    setAcceptanceBlocked: assign({
      openIssueCount: ({ context }) => context.openIssueCount + 1,
      blockedAtStage: () => "acceptance" as const,
    }),
    clearBlockedState: assign({
      openIssueCount: ({ context }) => Math.max(0, context.openIssueCount - 1),
      blockedAtStage: () => null,
    }),
    setInvoiceId: assign({
      invoiceId: (_, params: { invoiceId: string }) => params.invoiceId,
    }),
    setError: assign({
      errorMessage: (_, params: { message: string }) => params.message,
    }),
    clearError: assign({ errorMessage: () => null }),
  },
  guards: {
    hasNoOpenIssues: ({ context }) => context.openIssueCount === 0,
  },
}).createMachine({
  id: "taskLifecycle",
  initial: "draft",
  context: ({ input }) => ({
    taskId: input.taskId,
    workspaceId: input.workspaceId,
    openIssueCount: 0,
    blockedAtStage: null,
    invoiceId: null,
    errorMessage: null,
  }),

  states: {
    // -----------------------------------------------------------------------
    // Core linear flow
    // -----------------------------------------------------------------------
    draft: {
      on: {
        ADVANCE: { target: "in_progress" },
      },
    },

    in_progress: {
      on: {
        ADVANCE: { target: "qa" },
        ARCHIVE: { target: "archived" },
      },
    },

    qa: {
      on: {
        ADVANCE: { target: "acceptance" },
        OPEN_ISSUE: {
          guard: ({ event }) => event.stage === "qa",
          target: "qa_blocked",
          actions: "setQaBlocked",
        },
        ARCHIVE: { target: "archived" },
      },
    },

    /** qa_blocked: issue open at QA stage — Firestore status stays `qa` */
    qa_blocked: {
      on: {
        ISSUE_RESOLVED: {
          guard: ({ event }) => event.stage === "qa",
          target: "qa",
          actions: "clearBlockedState",
        },
        OPEN_ISSUE: {
          guard: ({ event }) => event.stage === "qa",
          actions: "setQaBlocked",
        },
      },
    },

    acceptance: {
      on: {
        ADVANCE: { target: "accepted" },
        OPEN_ISSUE: {
          guard: ({ event }) => event.stage === "acceptance",
          target: "acceptance_blocked",
          actions: "setAcceptanceBlocked",
        },
        ARCHIVE: { target: "archived" },
      },
    },

    /** acceptance_blocked: issue open at acceptance stage — Firestore status stays `acceptance` */
    acceptance_blocked: {
      on: {
        ISSUE_RESOLVED: {
          guard: ({ event }) => event.stage === "acceptance",
          target: "acceptance",
          actions: "clearBlockedState",
        },
        OPEN_ISSUE: {
          guard: ({ event }) => event.stage === "acceptance",
          actions: "setAcceptanceBlocked",
        },
      },
    },

    accepted: {
      on: {
        INVOICE_CREATED: {
          target: "settled",
          actions: assign({
            invoiceId: ({ event }) => event.invoiceId,
          }),
        },
        ARCHIVE: { target: "archived" },
      },
    },

    /** settled: invoice draft created — flow is complete */
    settled: {
      type: "final",
    },

    archived: {
      type: "final",
    },
  },
});

export type TaskLifecycleMachine = typeof taskLifecycleMachine;
