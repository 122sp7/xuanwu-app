import { setup, assign, fromPromise } from "xstate";
import type { ExtractedTaskCandidate } from "../../domain/value-objects/TaskCandidate";

/**
 * Task Formation State Machine (XState v5)
 *
 * Models the UI-layer workflow for extracting and confirming task candidates:
 *
 *   idle ──START──→ extracting ──onDone──→ reviewing ──CONFIRM──→ confirming ──onDone──→ done
 *                  ──onError──→ failed                ──onError──→ reviewing（保留選擇）
 *   reviewing ──CANCEL──→ idle
 *   failed ──RETRY──→ idle
 *
 * The machine does NOT call repositories or Server Actions directly.
 * Callers must provide actor implementations via `provide()`.
 */

// ── Context ────────────────────────────────────────────────────────────────────

export interface TaskFormationContext {
  readonly workspaceId: string;
  readonly actorId: string;
  readonly jobId: string | null;
  readonly candidates: ReadonlyArray<ExtractedTaskCandidate>;
  readonly selectedIndices: ReadonlyArray<number>;
  readonly errorMessage: string | null;
}

// ── Events ─────────────────────────────────────────────────────────────────────

export type TaskFormationMachineEvent =
  | { type: "START"; sourceType: "rule" | "ai"; sourcePageIds: string[] }
  | { type: "CONFIRM" }
  | { type: "CANCEL" }
  | { type: "RETRY" }
  | { type: "TOGGLE_CANDIDATE"; index: number }
  | { type: "SELECT_ALL" }
  | { type: "DESELECT_ALL" };

// ── Machine ────────────────────────────────────────────────────────────────────

export const taskFormationMachine = setup({
  types: {
    context: {} as TaskFormationContext,
    events: {} as TaskFormationMachineEvent,
    input: {} as { workspaceId: string; actorId: string },
  },
  actors: {
    extractCandidates: fromPromise<
      { jobId: string; candidates: ExtractedTaskCandidate[] },
      { workspaceId: string; actorId: string; sourceType: "rule" | "ai"; sourcePageIds: string[] }
    >(async () => {
      // Replaced by `provide()` at the call site.
      throw new Error("extractCandidates actor not provided.");
    }),
    confirmCandidates: fromPromise<
      void,
      { jobId: string; workspaceId: string; actorId: string; selectedIndices: number[] }
    >(async () => {
      // Replaced by `provide()` at the call site.
      throw new Error("confirmCandidates actor not provided.");
    }),
  },
  actions: {
    toggleCandidate: assign({
      selectedIndices: ({ context, event }) => {
        if (event.type !== "TOGGLE_CANDIDATE") return context.selectedIndices;
        const set = new Set(context.selectedIndices);
        if (set.has(event.index)) {
          set.delete(event.index);
        } else {
          set.add(event.index);
        }
        return [...set].sort((a, b) => a - b);
      },
    }),
    selectAll: assign({
      selectedIndices: ({ context }) => context.candidates.map((_, i) => i),
    }),
    deselectAll: assign({ selectedIndices: () => [] }),
    setError: assign({
      errorMessage: (_, params: { message: string }) => params.message,
    }),
    clearState: assign({
      jobId: () => null,
      candidates: () => [],
      selectedIndices: () => [],
      errorMessage: () => null,
    }),
  },
}).createMachine({
  id: "taskFormation",
  initial: "idle",
  context: ({ input }) => ({
    workspaceId: input.workspaceId,
    actorId: input.actorId,
    jobId: null,
    candidates: [],
    selectedIndices: [],
    errorMessage: null,
  }),

  states: {
    idle: {
      on: {
        START: {
          target: "extracting",
        },
      },
    },

    extracting: {
      invoke: {
        src: "extractCandidates",
        input: ({ context, event }) => {
          if (event.type !== "START") throw new Error("unexpected event");
          return {
            workspaceId: context.workspaceId,
            actorId: context.actorId,
            sourceType: event.sourceType,
            sourcePageIds: event.sourcePageIds,
          };
        },
        onDone: {
          target: "reviewing",
          actions: assign({
            jobId: ({ event }) => event.output.jobId,
            candidates: ({ event }) => event.output.candidates,
            selectedIndices: ({ event }) => event.output.candidates.map((_, i) => i),
            errorMessage: () => null,
          }),
        },
        onError: {
          target: "failed",
          actions: assign({
            errorMessage: ({ event }) =>
              event.error instanceof Error ? event.error.message : "Extraction failed.",
          }),
        },
      },
    },

    reviewing: {
      on: {
        TOGGLE_CANDIDATE: { actions: "toggleCandidate" },
        SELECT_ALL: { actions: "selectAll" },
        DESELECT_ALL: { actions: "deselectAll" },
        CONFIRM: {
          target: "confirming",
        },
        CANCEL: {
          target: "idle",
          actions: "clearState",
        },
      },
    },

    confirming: {
      invoke: {
        src: "confirmCandidates",
        input: ({ context }) => ({
          jobId: context.jobId ?? "",
          workspaceId: context.workspaceId,
          actorId: context.actorId,
          selectedIndices: [...context.selectedIndices],
        }),
        onDone: {
          target: "done",
        },
        onError: {
          target: "reviewing",
          actions: assign({
            errorMessage: ({ event }) =>
              event.error instanceof Error ? event.error.message : "Confirmation failed.",
          }),
        },
      },
    },

    done: {
      type: "final",
    },

    failed: {
      on: {
        RETRY: {
          target: "idle",
          actions: "clearState",
        },
      },
    },
  },
});

export type TaskFormationMachine = typeof taskFormationMachine;
