import { setup } from "xstate";

export interface SettlementLifecycleContext {
  readonly invoiceId: string;
  readonly workspaceId: string;
}

export type SettlementLifecycleEvent =
  | { type: "ADVANCE" }
  | { type: "ROLLBACK" };

export const settlementLifecycleMachine = setup({
  types: {
    context: {} as SettlementLifecycleContext,
    events: {} as SettlementLifecycleEvent,
    input: {} as SettlementLifecycleContext,
  },
}).createMachine({
  id: "settlementLifecycle",
  initial: "draft",
  context: ({ input }) => input,
  states: {
    draft: {
      on: { ADVANCE: { target: "submitted" } },
    },
    submitted: {
      on: { ADVANCE: { target: "finance_review" } },
    },
    finance_review: {
      on: {
        ADVANCE: { target: "approved" },
        ROLLBACK: { target: "submitted" },
      },
    },
    approved: {
      on: { ADVANCE: { target: "paid" } },
    },
    paid: {
      on: { ADVANCE: { target: "closed" } },
    },
    closed: {
      type: "final",
    },
  },
});

export type SettlementLifecycleMachine = typeof settlementLifecycleMachine;
