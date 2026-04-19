/**
 * @module infra/state
 * State management primitives for local stores and machines.
 *
 * Zustand 5: `create` (React hook factory), `createStore` (vanilla),
 *            `StateCreator` type for slice composition.
 * XState 5:  `createMachine`, `createActor`, `assign`, `setup`.
 */

// ─── Zustand ─────────────────────────────────────────────────────────────────

// React-aware hook factory (canonical for module interfaces/stores/)
export { create } from "zustand";

// Vanilla factory for non-React contexts
export { createStore, type StoreApi } from "zustand/vanilla";

// Slice composition type
export type { StateCreator } from "zustand";

// ─── XState ──────────────────────────────────────────────────────────────────

export {
  createMachine,
  createActor,
  assign,
  setup,
  type ActorRefFrom,
  type SnapshotFrom,
} from "xstate";

// ─── XState React ─────────────────────────────────────────────────────────────
// Use only in "use client" components / hooks (interface layer).
//
// useMachine     — spawn a machine + subscribe to state (alias for useActor in v5)
// useActorRef    — get a stable actorRef without re-render on every snapshot
// useSelector    — subscribe to a derived slice; only re-renders on slice change
// shallowEqual   — pass as comparator to useSelector to avoid object-ref churn
// createActorContext — React Context factory for sharing actor across components

export {
  useMachine,
  useActorRef,
  useSelector,
  shallowEqual,
  createActorContext,
} from "@xstate/react";

// ─── Utilities ───────────────────────────────────────────────────────────────

import type { StoreApi } from "zustand/vanilla";

/**
 * Fully replace a vanilla store's state (replace=true).
 * Useful for resetting store to a known clean snapshot.
 */
export const replaceStoreState = <T>(store: StoreApi<T>, nextState: T): void => {
  store.setState(nextState, true);
};
