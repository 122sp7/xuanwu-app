import { setup } from "xstate";
import type { IssueStatus } from "../../domain/value-objects/IssueStatus";

export interface IssueLifecycleContext {
  readonly issueId: string;
  readonly currentStatus: IssueStatus;
}

export type IssueLifecycleEvent =
  | { type: "INVESTIGATE" }
  | { type: "START_FIX" }
  | { type: "SUBMIT_RETEST" }
  | { type: "REOPEN_FIX" }
  | { type: "RESOLVE" }
  | { type: "CLOSE" };

/**
 * issueLifecycleMachine — XState FSM modelling the Issue status lifecycle.
 *
 * Matches the domain FSM in IssueStatus.ts:
 *   open → investigating → fixing → retest → resolved / fixing(reopen)
 *   resolved → closed
 */
export const issueLifecycleMachine = setup({
  types: {
    context: {} as IssueLifecycleContext,
    events: {} as IssueLifecycleEvent,
    input: {} as IssueLifecycleContext,
  },
}).createMachine({
  id: "issueLifecycle",
  context: ({ input }) => input,
  initial: "open",
  states: {
    open: {
      on: { INVESTIGATE: { target: "investigating" } },
    },
    investigating: {
      on: { START_FIX: { target: "fixing" } },
    },
    fixing: {
      on: { SUBMIT_RETEST: { target: "retest" } },
    },
    retest: {
      on: {
        RESOLVE: { target: "resolved" },
        REOPEN_FIX: { target: "fixing" },
      },
    },
    resolved: {
      on: { CLOSE: { target: "closed" } },
    },
    closed: {
      type: "final",
    },
  },
});

export type IssueLifecycleMachine = typeof issueLifecycleMachine;

/** Map from IssueStatus to the XState state name (they are the same here) */
export const ISSUE_STATUS_TO_STATE: Record<IssueStatus, string> = {
  open: "open",
  investigating: "investigating",
  fixing: "fixing",
  retest: "retest",
  resolved: "resolved",
  closed: "closed",
};

/** Derive available transition events for a given status — used by UI button rendering */
export function getIssueTransitionEvents(
  status: IssueStatus,
): IssueLifecycleEvent["type"][] {
  switch (status) {
    case "open":
      return ["INVESTIGATE"];
    case "investigating":
      return ["START_FIX"];
    case "fixing":
      return ["SUBMIT_RETEST"];
    case "retest":
      return ["RESOLVE", "REOPEN_FIX"];
    case "resolved":
      return ["CLOSE"];
    case "closed":
      return [];
  }
}

/** Map event type to target IssueStatus for action dispatch */
export const ISSUE_EVENT_TO_STATUS: Record<
  IssueLifecycleEvent["type"],
  IssueStatus | null
> = {
  INVESTIGATE: "investigating",
  START_FIX: "fixing",
  SUBMIT_RETEST: "retest",
  REOPEN_FIX: "fixing",
  RESOLVE: "resolved",
  CLOSE: "closed",
};

/** Human-readable label for each transition event */
export const ISSUE_EVENT_LABEL: Record<IssueLifecycleEvent["type"], string> = {
  INVESTIGATE: "開始調查",
  START_FIX: "開始修復",
  SUBMIT_RETEST: "提交重測",
  REOPEN_FIX: "重新修復",
  RESOLVE: "標記已解決",
  CLOSE: "關閉問題",
};
