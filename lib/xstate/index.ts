/**
 * @module lib/xstate
 * Thin wrapper for XState v5 + @xstate/react.
 *
 * Provides a single import path for state machine creation, actor execution,
 * and React integration hooks.  All exports are isomorphic (server + client)
 * except for React hooks which require a Client Component boundary.
 *
 * Machine definition:
 *   import { setup, fromPromise } from "@/lib/xstate";
 *   const machine = setup({ actors: { fetch: fromPromise(…) } }).createMachine(…);
 *
 * React integration:
 *   import { useMachine, useActorRef, useSelector } from "@/lib/xstate";
 */

// ── Core factories ─────────────────────────────────────────────────────────
export { createMachine, createActor, setup } from "xstate";

// ── Actions ────────────────────────────────────────────────────────────────
export {
  assign,
  sendTo,
  raise,
  log,
  emit,
  cancel,
  stopChild,
  enqueueActions,
  forwardTo,
  sendParent,
  spawnChild,
} from "xstate";

// ── Guards ─────────────────────────────────────────────────────────────────
export { and, or, not, stateIn } from "xstate";

// ── Actor logic creators ───────────────────────────────────────────────────
export { fromPromise, fromCallback, fromObservable, fromTransition, fromEventObservable } from "xstate";

// ── Utilities ──────────────────────────────────────────────────────────────
export { waitFor, toPromise, assertEvent, createEmptyActor } from "xstate";

// ── Types ──────────────────────────────────────────────────────────────────
export type {
  ActorRefFrom,
  SnapshotFrom,
  EventFrom,
  InputFrom,
  OutputFrom,
  AnyActorRef,
  ActorLogic,
  AnyMachineSnapshot,
} from "xstate";

// ── React hooks (Client Component only) ───────────────────────────────────
export {
  useActor,
  useActorRef,
  useMachine,
  useSelector,
  createActorContext,
  shallowEqual,
} from "@xstate/react";
